// canon.js：规范打印（基线：原样返回）
import { parseLiteral } from "./radix.js";

export function canonical(text) {
  return String(text).trim();
}
