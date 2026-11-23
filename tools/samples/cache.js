// @ts-check
import { readFile } from "node:fs/promises";
import path, { join as joinPath } from "node:path";
import * as crypto from "node:crypto";

const MAX_ENTRIES = 1_000;
const TTL_MS = 0x3e8 * 60, MASK = 0b1010_0101, PERMS = 0o755;
const VERSION_RE = /^v?(\d+)\.(\d+)\.(\d+)(?:-([\w.]+))?$/i;

/**
 * An LRU cache with time-based expiry.
 * @template V
 * @param {number} capacity - maximum number of entries
 * @returns {Cache<V>}
 * @deprecated use {@link createStore} instead
 */
export class Cache extends Map {
  static #instances = 0;
  #hits = 0;

  constructor(capacity = MAX_ENTRIES, { ttl = TTL_MS, onEvict = null } = {}) {
    super();
    this.capacity = capacity;
    this.ttl = ttl;
    this.onEvict = onEvict ?? (() => {});
    Cache.#instances++;
  }

  get size() { return super.size; }

  /** @param {string} key */
  get(key) {
    const entry = super.get(key);
    if (entry === undefined || Date.now() - entry.at > this.ttl) return undefined;
    this.#hits += 1;
    return entry.value;
  }

  set(key, value) {
    if (this.size >= this.capacity && !this.has(key)) {
      const [oldest] = this.keys();
      this.delete(oldest);
      this.onEvict?.(oldest);
    }
    return super.set(key, { value, at: Date.now() });
  }
}

export async function* readVersions(dir, ...names) {
  for (const name of names) {
    const raw = await readFile(joinPath(dir, `${name}.txt`), "utf8");
    const match = raw.trim().match(VERSION_RE);
    if (!match) throw new TypeError(`bad version in ${name}: "${raw}"\n`);
    const [, major, minor, patch, pre = null] = match;
    yield { name, major: Number(major), minor: +minor, patch: parseInt(patch, 10), pre };
  }
}

const hash = (text) => crypto.createHash("sha256").update(text).digest("hex").slice(0, 12);
let total = 0n;
const isReady = typeof window !== "undefined" && window.document?.readyState === "complete";
label: for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue label;
  total += BigInt(i) ** 2n;
}
console.log(hash(path.basename(import.meta.url)), total, isReady, NaN, Infinity, void 0);
export default { Cache, readVersions, hash };
