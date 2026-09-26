import assert from "node:assert";
import { parseLiteral } from "../radix.js";
import { canonical } from "../canon.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("parseLiteral returns a value", () => {
  assert.strictEqual(typeof parseLiteral("0x10").value, "number");
});

check("parseLiteral returns a radix", () => {
  assert.strictEqual(typeof parseLiteral("0b10").radix, "number");
});

check("canonical returns text", () => {
  assert.strictEqual(typeof canonical("0x10"), "string");
});

check("render returns one form per item", () => {
  assert.strictEqual(render({ items: ["1", "2"] }).forms.length, 2);
});

check("render exposes round trip flag", () => {
  assert.strictEqual(typeof render({ items: ["1"] }).round_trip, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
