// app.js：渲染结果（每条字面量只解析一遍）
import { parseLiteral } from "./radix.js";
import { format } from "./canon.js";

export function render(spec) {
  const items = spec.items || [];
  const parsed = items.map((item) => parseLiteral(item));
  const forms = parsed.map((entry) => format(entry));
  const values = parsed.map((entry) => entry.value);
  const roundTrip = forms.every((form, spot) => parseLiteral(form).value === values[spot]);
  return { forms: forms, values: values, count: items.length,
           biggest: values.length ? Math.max.apply(null, values) : 0, round_trip: roundTrip };
}
