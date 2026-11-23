---
title: Ember Tide sample
tags: [theme, sample]
---

# Ember Tide

A **warm–cool** dark theme with *calm* contrast and ***both*** styles. ~~Old name~~ is gone.

## Install

1. Open the Extensions view
2. Search for `Ember Tide`
   - pick **Ember Tide** from the list
   - press <kbd>Ctrl</kbd>+<kbd>K</kbd>
3. Done

> **Note**
> Semantic highlighting is enabled by default.

### Code

```ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

```bash
npm run build && npm test
```

```python
def area(r: float) -> float:
    return 3.14159 * r ** 2
```

| Role    | Color     | Style  |
|---------|:---------:|-------:|
| Keyword | `#D29BFF` | normal |
| Comment | `#8B94A2` | italic |

- [x] Palette
- [ ] Zed port

See the [changelog](CHANGELOG.md "Release notes"), the [docs][docs] or <https://example.com>.
![Preview](images/preview.png)

Inline `code`, a footnote[^1], an escaped \*star\*, and a hard break  
on the next line.

---

[docs]: https://github.com/23hoanggg/ember-tide-theme#readme
[^1]: Footnote text.

<details>
<summary>HTML block</summary>

Raw <b>HTML</b> inside Markdown.

</details>
