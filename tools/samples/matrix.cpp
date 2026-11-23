// matrix.cpp — a small dense matrix with expression helpers.
#include <array>
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string_view>
#include <vector>

namespace la::detail {

/// Compile-time size check.
template <typename T, std::size_t N>
concept Square = N > 0 && std::is_arithmetic_v<T>;

constexpr auto kEpsilon = 1e-9;
constexpr unsigned kMask = 0xFFu, kBits = 0b1101;

enum class Layout : std::uint8_t { RowMajor, ColMajor };

template <typename T, std::size_t N>
    requires Square<T, N>
class Matrix final {
public:
    using value_type = T;

    explicit Matrix(T fill = T{}) noexcept { data_.fill(fill); }
    Matrix(const Matrix&) = default;
    virtual ~Matrix() = default;

    [[nodiscard]] T& operator()(std::size_t r, std::size_t c) {
        if (r >= N || c >= N) throw std::out_of_range("index out of range");
        return data_[r * N + c];
    }

    Matrix operator*(const Matrix& other) const {
        Matrix out{};
        for (std::size_t i = 0; i < N; ++i)
            for (std::size_t j = 0; j < N; ++j)
                for (std::size_t k = 0; k < N; ++k)
                    out.data_[i * N + j] += this->data_[i * N + k] * other.data_[k * N + j];
        return out;
    }

    static constexpr Layout layout = Layout::RowMajor;

private:
    std::array<T, N * N> data_{};
    mutable bool dirty_ = false;
};

} // namespace la::detail

int main() {
    using namespace std::literals;
    auto m = std::make_unique<la::detail::Matrix<double, 3>>(1.5);
    auto label = "matrix\n"sv;
    const char* raw = R"(C:\no\escapes)";
    std::vector<int> v{1, 2, 3};
    for (const auto& x : v) std::cout << label << x << ' ' << raw << std::endl;
    auto square = [&](int n) -> int { return n * n; };
    static_assert(sizeof(int) >= 4, "int too small");
    return (*m)(0, 0) > la::detail::kEpsilon && square(2) == 4 ? 0 : nullptr == nullptr;
}
