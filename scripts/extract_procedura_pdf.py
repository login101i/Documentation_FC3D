import json
from pathlib import Path

import pymupdf

pdf_path = Path(r"d:\Dokumentacja\FC3D_Worktops\Procedura konfiguracji FC3D.pdf")
out_img = Path(r"d:\Dokumentacja\website\static\img\procedura-konfiguracji")
out_img.mkdir(parents=True, exist_ok=True)
scripts = Path(r"d:\Dokumentacja\website\scripts")
scripts.mkdir(parents=True, exist_ok=True)

doc = pymupdf.open(pdf_path)
print("pages", doc.page_count)
print("metadata", doc.metadata)

img_count = 0
img_map = []
seen_xrefs = set()

for page_index in range(doc.page_count):
    page = doc[page_index]
    images = page.get_images(full=True)
    print(f"page {page_index+1}: {len(images)} images, text_len={len(page.get_text())}")
    for img in images:
        xref = img[0]
        if xref in seen_xrefs:
            continue
        seen_xrefs.add(xref)
        try:
            pix = pymupdf.Pixmap(doc, xref)
            if pix.n - pix.alpha >= 4:
                pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
            if pix.width < 60 or pix.height < 60:
                print(f"  skip tiny {pix.width}x{pix.height} xref={xref}")
                continue
            img_count += 1
            name = f"procedura-{img_count:02d}.png"
            out = out_img / name
            pix.save(out.as_posix())
            img_map.append(
                {
                    "page": page_index + 1,
                    "file": name,
                    "w": pix.width,
                    "h": pix.height,
                    "xref": xref,
                }
            )
            print(f"  saved {name} {pix.width}x{pix.height}")
        except Exception as e:
            print(f"  img error xref={xref}: {e}")

print("saved_images", len(img_map))
(scripts / "_procedura_images.json").write_text(
    json.dumps(img_map, indent=2), encoding="utf-8"
)

parts = []
for i in range(doc.page_count):
    t = doc[i].get_text("text")
    parts.append(f"\n\n===== PAGE {i+1} =====\n{t}")
(scripts / "_procedura_extract.txt").write_text("".join(parts), encoding="utf-8")

bp = []
for i in range(doc.page_count):
    bp.append(f"\n\n===== PAGE {i+1} =====\n")
    d = doc[i].get_text("dict")
    for b in d.get("blocks", []):
        if b.get("type") == 0:
            lines = []
            for line in b.get("lines", []):
                line_text = "".join(span.get("text", "") for span in line.get("spans", []))
                sizes = [span.get("size", 0) for span in line.get("spans", [])]
                flags = [span.get("flags", 0) for span in line.get("spans", [])]
                max_size = max(sizes) if sizes else 0
                bold = any(f & 2**4 for f in flags)
                lines.append(f"[size={max_size:.1f} bold={bold}] {line_text}")
            bp.append("\n".join(lines) + "\n---\n")
        elif b.get("type") == 1:
            bp.append(f"[IMAGE {b.get('width')}x{b.get('height')} bbox={b.get('bbox')}]\n---\n")
(scripts / "_procedura_blocks.txt").write_text("".join(bp), encoding="utf-8")
print("done")
