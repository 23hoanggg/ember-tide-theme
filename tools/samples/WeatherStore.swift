import Foundation
import SwiftUI

/// Weather condition reported by the API.
/// - Parameter code: raw condition code
enum Condition: String, Codable, CaseIterable {
    case sunny, cloudy
    case rain = "rainy"
}

protocol Forecasting {
    associatedtype Output
    func forecast(for city: String, days: Int) async throws -> [Output]
}

struct Reading: Identifiable, Hashable {
    let id = UUID()
    var temperature: Double
    var condition: Condition
    static let freezing = 0.0
}

@MainActor
final class WeatherStore: ObservableObject, Forecasting {
    typealias Output = Reading

    @Published private(set) var readings: [Reading] = []
    private let session: URLSession
    private var cache = [String: Data]()
    let mask = 0xFF, bits = 0b1010, perms = 0o755

    init(session: URLSession = .shared) {
        self.session = session
    }

    func forecast(for city: String, days: Int = 3) async throws -> [Reading] {
        guard let url = URL(string: "https://api.example.com/\(city)?days=\(days)\n") else {
            throw URLError(.badURL)
        }
        let (data, _) = try await session.data(from: url)
        cache[city] = data
        let decoded = try JSONDecoder().decode([Reading].self, from: data)
        readings = decoded.filter { $0.temperature > Reading.freezing }
        return readings
    }

    func summary<T: Numeric & Comparable>(_ values: [T]) -> T? {
        values.max()
    }

    deinit { print("released", self.cache.count) }
}

extension Reading: CustomStringConvertible {
    var description: String {
        let raw = #"no \(interpolation) here"#
        return "\(condition.rawValue): \(String(format: "%.1f", temperature))° \(raw)"
    }
}

let store = WeatherStore()
Task { _ = try? await store.forecast(for: "Hanoi"); print(store.readings.isEmpty, nil as Int?, true) }
