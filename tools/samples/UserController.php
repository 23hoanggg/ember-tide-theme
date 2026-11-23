<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\{JsonResponse, Request};
use function array_map;

/**
 * Handles user endpoints.
 *
 * @package App\Http\Controllers
 * @param  Request $request
 * @return JsonResponse
 */
#[Attribute(Attribute::TARGET_CLASS)]
final class UserController extends Controller implements \JsonSerializable
{
    use HasPagination;

    public const PER_PAGE = 25;
    private const MASK = 0x1F;
    protected static ?self $instance = null;

    public function __construct(
        private readonly UserRepository $users,
        protected int $limit = 100,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $items = $this->users->paginate(self::PER_PAGE, page: $page);
        $names = array_map(fn (User $u): string => strtoupper($u->name), $items);
        $message = "Found {$items->count()} users on page $page\n";
        $raw = 'single $quoted\n';
        $sql = <<<SQL
            SELECT * FROM users WHERE id = {$request->id}
            SQL;

        if (empty($names) || !isset($request->q)) {
            return response()->json(['message' => $message, 'raw' => $raw], 404);
        }

        foreach ($items as $i => $user) {
            match (true) {
                $user->isAdmin() => $this->log("admin #$i"),
                default => null,
            };
        }

        return new JsonResponse(['data' => $names, 'total' => 0b1010 + 0o17 + 1_000, 'ok' => true]);
    }

    public function jsonSerialize(): mixed
    {
        return static::class . '::' . __FUNCTION__ . PHP_EOL;
    }

    private function log(string ...$parts): void
    {
        echo implode(', ', $parts), preg_match('/^admin\s+#\d+$/', $parts[0]);
    }
}
