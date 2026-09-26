// radix.js：解析进制字面量（0x/0X 十六进制、0b/0B 二进制、0o/0O 八进制、否则十进制）
const PREFIX_RADIX = { x: 16, b: 2, o: 8 };

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function digitValue(ch) {
  const code = ch.charCodeAt(0);
  if (code >= 48 && code <= 57) return code - 48; // 0-9
  if (code >= 97 && code <= 102) return code - 87; // a-f
  if (code >= 65 && code <= 70) return code - 55; // A-F
  return -1;
}

export function parseLiteral(text) {
  const raw = String(text).trim();
  let radix = 10;
  let digits = raw;
  if (raw.length > 1 && raw[0] === "0") {
    const mark = raw[1].toLowerCase();
    if (Object.prototype.hasOwnProperty.call(PREFIX_RADIX, mark)) {
      radix = PREFIX_RADIX[mark];
      digits = raw.slice(2);
    } else if (/[a-z]/i.test(raw[1])) {
      throw fail("E_BAD_RADIX", "不认识的前缀: 0" + raw[1]);
    }
  }
  if (digits.length === 0) {
    throw fail("E_BAD_DIGIT", "前缀后面没有数字: " + raw);
  }
  let value = 0;
  for (let i = 0; i < digits.length; i += 1) {
    const d = digitValue(digits[i]);
    if (d < 0 || d >= radix) {
      throw fail("E_BAD_DIGIT", "字符不属于该进制: " + digits[i]);
    }
    value = value * radix + d;
    if (!Number.isSafeInteger(value)) {
      throw fail("E_BAD_DIGIT", "数值超出安全整数范围: " + raw);
    }
  }
  return { radix: radix, value: value };
}
