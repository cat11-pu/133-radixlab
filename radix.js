// radix.js：解析字面量（0x/0X 十六进制、0b/0B 二进制、0o/0O 八进制、否则十进制）
function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function parseLiteral(text) {
  const source = String(text);
  let radix = 10;
  let start = 0;
  if (source.length > 1 && source.charCodeAt(0) === 48) {
    const mark = source.charCodeAt(1);
    if (mark === 120 || mark === 88) { radix = 16; start = 2; }
    else if (mark === 98 || mark === 66) { radix = 2; start = 2; }
    else if (mark === 111 || mark === 79) { radix = 8; start = 2; }
    else if ((mark >= 97 && mark <= 122) || (mark >= 65 && mark <= 90)) {
      throw fail("E_BAD_RADIX", "不认识的前缀 0" + source[1]);
    }
  }
  if (start >= source.length) {
    throw fail("E_BAD_DIGIT", "前缀后面没有数字");
  }
  let value = 0;
  for (let spot = start; spot < source.length; spot += 1) {
    const code = source.charCodeAt(spot);
    let digit;
    if (code >= 48 && code <= 57) digit = code - 48;
    else if (code >= 97 && code <= 102) digit = code - 87;
    else if (code >= 65 && code <= 70) digit = code - 55;
    else throw fail("E_BAD_DIGIT", "字符 " + source[spot] + " 不属于 " + radix + " 进制");
    if (digit >= radix) {
      throw fail("E_BAD_DIGIT", "数字 " + source[spot] + " 不属于 " + radix + " 进制");
    }
    value = value * radix + digit;
    if (!Number.isSafeInteger(value)) {
      throw fail("E_BAD_DIGIT", "数值超出安全整数范围");
    }
  }
  return { radix: radix, value: value };
}
