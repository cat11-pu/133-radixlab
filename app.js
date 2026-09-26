// app.js：渲染结果（每条字面量只解析一遍）
import { parseLiteral } from "./radix.js";
import { formatLiteral } from "./canon.js";

export function render(spec) {
  const items = spec.items || [];
  const forms = new Array(items.length);
  const values = new Array(items.length);
  for (let i = 0; i < items.length; i += 1) {
    const parsed = parseLiteral(items[i]);
    values[i] = parsed.value;
    forms[i] = formatLiteral(parsed.radix, parsed.value);
  }
  const roundTrip = forms.every((form, spot) => parseLiteral(form).value === values[spot]);
  return { forms: forms, values: values, count: items.length,
           biggest: values.length ? Math.max.apply(null, values) : 0, round_trip: roundTrip };
}
