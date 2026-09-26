// radix.js：解析字面量（基线：一律按十进制解析）
export function parseLiteral(text) {
  return { radix: 10, value: Number(text) };
}
