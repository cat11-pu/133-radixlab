// canon.js：规范打印（前缀小写、十六进制字母小写、去前导零、十进制无前缀）
import { parseLiteral } from "./radix.js";

const PREFIX = { 2: "0b", 8: "0o", 16: "0x" };

export function formatLiteral(radix, value) {
  const body = value.toString(radix); // 小写、无前导零、零就是 "0"
  return radix === 10 ? body : PREFIX[radix] + body;
}

export function canonical(text) {
  const parsed = parseLiteral(text);
  return formatLiteral(parsed.radix, parsed.value);
}
