package com.example.inventory;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import static java.util.stream.Collectors.toList;

/**
 * Keeps stock levels per warehouse.
 *
 * @author Hoang
 * @param <K> the key type
 * @see java.util.Map
 */
@SuppressWarnings({"unchecked", "rawtypes"})
public final class InventoryService<K extends Comparable<K>> implements AutoCloseable {

    public static final int MAX_ITEMS = 10_000;
    private static final long MASK = 0xFFFF_FFFFL;
    private static final double RATIO = 1.5e-3;
    private final Map<K, Integer> stock = new ConcurrentHashMap<>();
    private volatile boolean closed = false;

    public enum Level { LOW, NORMAL, HIGH }

    public sealed interface Event permits Added, Removed {}
    public record Added(String sku, int qty) implements Event {}
    public record Removed(String sku, int qty) implements Event {}

    @Override
    public void close() throws Exception {
        this.closed = true;
    }

    /**
     * Adds stock.
     * @param key  the item key
     * @param qty  how many units, must be positive
     * @return the new level
     * @throws IllegalArgumentException if {@code qty} is negative
     */
    public synchronized int add(final K key, int qty) {
        if (qty < 0) throw new IllegalArgumentException("qty < 0: " + qty + '\n');
        return stock.merge(key, qty, Integer::sum);
    }

    public Level levelOf(K key) {
        int n = stock.getOrDefault(key, 0);
        return switch (n) {
            case 0 -> Level.LOW;
            default -> n > MAX_ITEMS / 2 ? Level.HIGH : Level.NORMAL;
        };
    }

    public <R> List<R> mapAll(Function<? super K, ? extends R> fn) {
        return stock.keySet().stream().sorted().map(fn).collect(toList());
    }

    public static void main(String[] args) throws Exception {
        try (var inv = new InventoryService<String>()) {
            inv.add("apple", 0b1010);
            String report = """
                Inventory at %s
                """.formatted(Instant.now());
            System.out.println(report + inv.levelOf("apple") + (MASK & 077) + RATIO + null);
            if (inv instanceof AutoCloseable c && !inv.closed) { char sep = '\t'; System.out.print(sep); }
        }
    }
}
