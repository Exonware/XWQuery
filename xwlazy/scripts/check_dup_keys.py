import re
from pathlib import Path
from collections import Counter
p = Path(__file__).resolve().parent.parent / "src" / "exonware" / "xwlazy_external_libs.toml"
text = p.read_text(encoding="utf-8")
in_m = False
keys = []
for line in text.splitlines():
    if line.strip() == "[mappings]":
        in_m = True
        continue
    if in_m and line.strip().startswith("["):
        break
    m = re.match(r'"([^"]+)"\s*=', line)
    if in_m and m:
        keys.append(m.group(1))
c = Counter(keys)
dups = [k for k, n in c.items() if n > 1]
print("Duplicate keys in [mappings]:", len(dups))
for k in dups[:30]:
    print(" ", k)
