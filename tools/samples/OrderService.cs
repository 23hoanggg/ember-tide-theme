using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shop.Orders;

/// <summary>Order lifecycle states.</summary>
public enum OrderState { Draft, Paid = 0x10, Shipped }

public record OrderLine(string Sku, int Quantity, decimal Price);

public interface IOrderRepository
{
    Task<Order?> FindAsync(Guid id);
    IAsyncEnumerable<Order> ListAsync(int take = 50);
}

/// <summary>
/// Coordinates orders. See <see cref="IOrderRepository"/>.
/// </summary>
/// <param name="repo">The backing store.</param>
[Serializable]
public sealed class OrderService<TKey> where TKey : struct, IEquatable<TKey>
{
    private const int MaxLines = 1_000;
    private readonly IOrderRepository _repo;
    private static int s_count;

    public event EventHandler<OrderState>? StateChanged;
    public string Name { get; init; } = "orders";

    public OrderService(IOrderRepository repo) => _repo = repo ?? throw new ArgumentNullException(nameof(repo));

    [Obsolete("Use PlaceAsync")]
    public async Task<decimal> TotalAsync(Guid id, bool includeTax = true)
    {
        var order = await _repo.FindAsync(id).ConfigureAwait(false);
        if (order is null) return 0m;
        decimal total = order.Lines.Where(l => l.Quantity > 0).Sum(l => l.Price * l.Quantity);
        string path = @"C:\orders\" + id;
        Console.WriteLine($"Order {id:N} total={total,10:C2} at {path}\n");
        this.StateChanged?.Invoke(this, OrderState.Paid);
        s_count++;
        return includeTax ? total * 1.2m : total;
    }

    public static bool TryParse(string? text, out OrderState state)
    {
        state = default;
        switch (text?.Trim().ToLowerInvariant())
        {
            case "draft": state = OrderState.Draft; return true;
            case var s when s?.StartsWith("ship") == true: state = OrderState.Shipped; return true;
            default: return false;
        }
    }
}

public class Order
{
    public Guid Id { get; set; }
    public List<OrderLine> Lines { get; } = new();
    public double Weight => Lines.Count * 0.5e1 + 0b101;
}
