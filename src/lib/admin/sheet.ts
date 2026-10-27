"use client";
// Read the product sheet in the browser: .xlsx (first worksheet) or .csv. No extra libraries.

export async function readSheet(file: File): Promise<string[][]> {
  if (/\.csv$/i.test(file.name) || file.type === "text/csv") return parseCsv(await file.text());
  if (/\.xlsx$/i.test(file.name)) return readXlsx(await file.arrayBuffer());
  throw new Error("Please upload the sheet as .xlsx or .csv");
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

// Minimal zip reader (central directory + deflate via DecompressionStream).
async function unzip(buf: ArrayBuffer): Promise<Map<string, Uint8Array>> {
  const v = new DataView(buf);
  let eocd = -1;
  for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 66000); i--) {
    if (v.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("This file does not look like an Excel workbook");
  const count = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  const out = new Map<string, Uint8Array>();
  const dec = new TextDecoder();
  for (let n = 0; n < count; n++) {
    const method = v.getUint16(p + 10, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true);
    const extraLen = v.getUint16(p + 30, true);
    const commentLen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const name = dec.decode(new Uint8Array(buf, p + 46, nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (!/^xl\/(sharedStrings\.xml|workbook\.xml|worksheets\/sheet\d+\.xml|_rels\/workbook\.xml\.rels)$/.test(name)) continue;
    const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
    const raw = new Uint8Array(buf.slice(start, start + size));
    if (method === 0) out.set(name, raw);
    else if (method === 8) {
      const ds = new DecompressionStream("deflate-raw") as unknown as TransformStream<Uint8Array, Uint8Array>;
      const stream = new Blob([raw]).stream().pipeThrough(ds);
      out.set(name, new Uint8Array(await new Response(stream).arrayBuffer()));
    }
  }
  return out;
}

async function readXlsx(buf: ArrayBuffer): Promise<string[][]> {
  const files = await unzip(buf);
  const dec = new TextDecoder();
  const xml = (name: string) => {
    const f = files.get(name);
    return f ? new DOMParser().parseFromString(dec.decode(f), "application/xml") : null;
  };
  const shared: string[] = [];
  const ss = xml("xl/sharedStrings.xml");
  ss?.querySelectorAll("si").forEach((si) => shared.push(Array.from(si.querySelectorAll("t")).map((t) => t.textContent ?? "").join("")));

  // First sheet in workbook order.
  let sheetPath = "xl/worksheets/sheet1.xml";
  const wb = xml("xl/workbook.xml");
  const rels = xml("xl/_rels/workbook.xml.rels");
  const first = wb?.getElementsByTagName("sheet")[0];
  const rid = first?.getAttribute("r:id") ?? first?.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
  if (rid && rels) {
    const rel = Array.from(rels.getElementsByTagName("Relationship")).find((r) => r.getAttribute("Id") === rid);
    const target = rel?.getAttribute("Target");
    if (target) sheetPath = "xl/" + target.replace(/^\/?xl\//, "").replace(/^\//, "");
  }
  const sheet = xml(sheetPath);
  if (!sheet) throw new Error("Could not read the first worksheet");

  const colIndex = (ref: string) => {
    const letters = ref.replace(/[0-9]/g, "");
    let n = 0;
    for (let i = 0; i < letters.length; i++) n = n * 26 + (letters.charCodeAt(i) - 64);
    return n - 1;
  };
  const rows: string[][] = [];
  sheet.querySelectorAll("sheetData > row").forEach((r) => {
    const row: string[] = [];
    r.querySelectorAll("c").forEach((c) => {
      const t = c.getAttribute("t");
      let val = "";
      if (t === "s") val = shared[Number(c.querySelector("v")?.textContent ?? -1)] ?? "";
      else if (t === "inlineStr") val = Array.from(c.querySelectorAll("t")).map((x) => x.textContent ?? "").join("");
      else val = c.querySelector("v")?.textContent ?? "";
      row[colIndex(c.getAttribute("r") ?? "A1")] = val;
    });
    rows.push(Array.from(row, (x) => x ?? ""));
  });
  return rows.filter((r) => r.some((c) => String(c).trim()));
}

// Map the client's column names to database fields.
const ALIASES: Record<string, string[]> = {
  name: ["name", "productname", "product", "title"],
  slug: ["slug", "urlslug"],
  category: ["category", "maincategory", "categoryname"],
  sub_category: ["subcategory", "subcat", "type", "producttype"],
  mrp: ["mrp", "maximumretailprice", "mrprs", "mrpinr"],
  price: ["price", "sellingprice", "saleprice", "offerprice", "sellingpricers"],
  stock: ["stock", "stockquantity", "quantity", "qty", "inventory"],
  size: ["size", "weight", "sizeweight", "volume", "netquantity"],
  short_description: ["shortdescription", "tagline", "summary"],
  description: ["description", "fulldescription", "details", "productdescription"],
  key_ingredients: ["keyingredients", "ingredients"],
  how_to_use: ["howtouse", "usage", "directions", "directionsforuse"],
  sku: ["sku", "code", "productcode", "itemcode"],
  hsn_code: ["hsn", "hsncode"],
  gst_rate: ["gst", "gstrate", "gstpercent", "tax"],
  is_featured: ["featured", "bestseller", "isfeatured"],
};

export type SheetProduct = {
  name: string;
  slug: string;
  category: string;
  sub_category: string;
  mrp: number;
  price: number;
  stock: number;
  size: string;
  short_description: string;
  description: string;
  key_ingredients: string[];
  how_to_use: string[];
  sku: string | null;
  hsn_code: string | null;
  gst_rate: number;
  is_featured: boolean;
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const money = (s: string) => Math.round(Number(String(s).replace(/[^0-9.]/g, "")) || 0);
const list = (s: string) =>
  String(s ?? "")
    .split(/[;\n|•]+/)
    .map((x) => x.trim())
    .filter(Boolean);

export function mapSheet(rows: string[][]): { products: SheetProduct[]; problems: string[] } {
  if (rows.length < 2) return { products: [], problems: ["The sheet needs a header row and at least one product."] };
  const norm = (h: string) => String(h).toLowerCase().replace(/[^a-z0-9]/g, "");
  const header = rows[0].map(norm);
  const idx: Record<string, number> = {};
  for (const [field, names] of Object.entries(ALIASES)) {
    const i = header.findIndex((h) => names.includes(h));
    if (i >= 0) idx[field] = i;
  }
  const problems: string[] = [];
  if (idx.name === undefined) problems.push("Could not find a product name column.");
  if (idx.price === undefined && idx.mrp === undefined) problems.push("Could not find a price or MRP column.");
  const get = (r: string[], f: string) => (idx[f] === undefined ? "" : String(r[idx[f]] ?? "").trim());
  const seen = new Set<string>();
  const products: SheetProduct[] = [];
  rows.slice(1).forEach((r, n) => {
    const name = get(r, "name");
    if (!name) return;
    const slug = slugify(get(r, "slug") || name);
    if (seen.has(slug)) {
      problems.push(`Row ${n + 2} (${name}): duplicate product name, skipped.`);
      return;
    }
    seen.add(slug);
    const mrp0 = money(get(r, "mrp"));
    const price0 = money(get(r, "price"));
    const price = price0 || mrp0;
    const mrp = mrp0 || price0;
    if (!price) problems.push(`Row ${n + 2} (${name}): missing price.`);
    if (price > mrp) problems.push(`Row ${n + 2} (${name}): selling price is above MRP, MRP set to the selling price.`);
    const ingredients = list(get(r, "key_ingredients"));
    products.push({
      name,
      slug,
      category: get(r, "category"),
      sub_category: get(r, "sub_category"),
      mrp: Math.max(mrp, price),
      price,
      stock: Math.max(0, Math.round(Number(get(r, "stock")) || 0)),
      size: get(r, "size"),
      short_description: get(r, "short_description"),
      description: get(r, "description"),
      key_ingredients: ingredients.length === 1 ? ingredients[0].split(",").map((x) => x.trim()).filter(Boolean) : ingredients,
      how_to_use: list(get(r, "how_to_use")),
      sku: get(r, "sku") || null,
      hsn_code: get(r, "hsn_code") || null,
      gst_rate: Number(get(r, "gst_rate").replace(/[^0-9.]/g, "")) || 18,
      is_featured: /^(y|yes|true|1)$/i.test(get(r, "is_featured")),
    });
  });
  return { products, problems };
}
