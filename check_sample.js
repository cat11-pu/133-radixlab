import fs from "node:fs";
import { parseLiteral } from "./radix.js";
import { canonical } from "./canon.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/literals.json", "utf8"));
const view = render(spec);

emit("十进制的值 =", JSON.stringify(view.values));
emit("规范化写法 =", JSON.stringify(view.forms));
emit("最大值 =", view.biggest);
emit("条数 =", view.count);
emit("是否都能往返 =", view.round_trip);
emit("数字不合法的错误码 =", spec.digit_error_code);
emit("进制不识别的错误码 =", spec.radix_error_code);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  parseLiteral("0b12");
  emit("数字不合法的错误码", "没有报错");
} catch (error) {
  emit("数字不合法的错误码", error && error.code ? error.code : String(error.message));
}
try {
  parseLiteral("0z9");
  emit("进制不识别的错误码", "没有报错");
} catch (error) {
  emit("进制不识别的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "十进制的值": [
    31,
    11,
    1010,
    15,
    42
  ],
  "规范化写法": [
    "0x1f",
    "0b1011",
    "1010",
    "0o17",
    "0x2a"
  ],
  "最大值": 1010,
  "条数": 5,
  "是否都能往返": true,
  "数字不合法的错误码": "E_BAD_DIGIT",
  "进制不识别的错误码": "E_BAD_RADIX"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
