from dataclasses import dataclass
import re

PATTERN = re.compile(r"^(?P<key>\w+)=(?P<value>.*)$")

@dataclass(frozen=True)
class Entry:
    """A single key/value pair from a .env file."""
    key: str
    value: str | None = None

    def render(self, *, quote: bool = True) -> str:
        value = f'"{self.value}"' if quote else self.value
        return f"{self.key}={value}"

def parse(lines: list[str]) -> dict[str, Entry]:
    entries = {}
    for number, line in enumerate(lines, start=1):
        if (match := PATTERN.match(line)) is None:
            continue  # skip comments and blanks
        entries[match["key"]] = Entry(match["key"], match["value"] or None)
    return entries
