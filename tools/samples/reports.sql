-- reports.sql: monthly revenue report.
/* Requires PostgreSQL 15+.
   Owner: analytics */
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.orders (
    id          BIGSERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
    status      VARCHAR(16) NOT NULL DEFAULT 'pending',
    total       NUMERIC(12, 2) CHECK (total >= 0),
    is_gift     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_created ON analytics.orders USING btree (created_at DESC);

CREATE OR REPLACE FUNCTION analytics.month_total(p_month DATE)
RETURNS NUMERIC
LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_total NUMERIC := 0;
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO v_total
    FROM analytics.orders
    WHERE date_trunc('month', created_at) = p_month;
    RETURN v_total;
END;
$$;

WITH monthly AS (
    SELECT
        date_trunc('month', o.created_at) AS month,
        c.country,
        COUNT(*) AS orders,
        SUM(o.total)::NUMERIC(14, 2) AS revenue,
        AVG(o.total) FILTER (WHERE o.is_gift IS TRUE) AS avg_gift
    FROM analytics.orders AS o
    INNER JOIN customers c ON c.id = o.customer_id
    LEFT JOIN refunds r USING (order_id)
    WHERE o.status IN ('paid', 'shipped')
      AND o.created_at >= CURRENT_DATE - INTERVAL '12 months'
      AND r.id IS NULL
      AND c.email LIKE '%@example.com'
    GROUP BY 1, 2
    HAVING SUM(o.total) > 1000.50
)
SELECT
    month,
    country,
    revenue,
    RANK() OVER (PARTITION BY month ORDER BY revenue DESC) AS rank,
    CASE WHEN revenue > 1e5 THEN 'high' ELSE 'normal' END AS tier
FROM monthly
ORDER BY month DESC, rank
LIMIT 50 OFFSET 0;

UPDATE analytics.orders SET status = 'archived', is_gift = NULL WHERE created_at < '2020-01-01';
DELETE FROM analytics.orders WHERE id = :order_id;
INSERT INTO analytics.orders (customer_id, total) VALUES (42, 19.99), (7, 0) RETURNING id;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO reporting;
