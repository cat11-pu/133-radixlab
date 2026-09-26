// app.js：渲染结果
import { parseLiteral } from "./radix.js";
import { canonical } from "./canon.js";

export function render(spec) {
  const items = spec.items || [];
  const forms = items.map((item) => canonical(item));
  const values = items.map((item) => parseLiteral(item).value);
  const roundTrip = items.every((item, spot) => parseLiteral(forms[spot]).value === values[spot]);
  return { forms: forms, values: values, count: items.length,
           biggest: values.length ? Math.max.apply(null, values) : 0, round_trip: roundTrip };
}
