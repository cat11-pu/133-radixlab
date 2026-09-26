// canon.js：规范打印（小写前缀、小写十六进制字母、去前导零、十进制无前缀）
import { parseLiteral } from "./radix.js";

const PREFIXES = { 2: "0b", 8: "0o", 10: "", 16: "0x" };

export function format(parsed) {
  return PREFIXES[parsed.radix] + parsed.value.toString(parsed.radix);
}

export function canonical(text) {
  return format(parseLiteral(text));
}
