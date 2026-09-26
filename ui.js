// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let text = (spec.items || []).join("\n");
  parts.log.textContent = "字面量 " + (spec.items || []).length + " 条，点归一化看结果。";

  function draw() {
    const list = text.split("\n").map((line) => line.trim()).filter(Boolean);
    let view = null;
    try {
      view = render(Object.assign({}, spec, { items: list }));
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    view.forms.forEach(function (form, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = (spec.items || [])[spot];
      row.appendChild(head);
      const mark = document.createElement("span");
      mark.className = "chip ok";
      mark.textContent = form + " 也就是 " + view.values[spot];
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "最大十进值 " + view.biggest + "，条数 " + view.count;
    parts.log.textContent = "能否往返 " + view.round_trip;
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "归一化";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "追加一条";
  addButton.addEventListener("click", function () {
    text = text + "\n0x10";
    draw();
  });
  parts.controls.appendChild(addButton);

  const label = document.createElement("label");
  label.textContent = "字面量（一行一条）";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "text";
  box.value = "0xA";
  box.addEventListener("input", function () {
    try {
      const view = render(Object.assign({}, spec, { items: (spec.items || []).concat([box.value]) }));
      parts.out.textContent = box.value + " 归一化成 " + view.forms[view.forms.length - 1];
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
    }
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看最大值";
  readButton.addEventListener("click", function () {
    const list = text.split("\n").map((line) => line.trim()).filter(Boolean);
    const view = render(Object.assign({}, spec, { items: list }));
    parts.out.textContent = "最大十进值 " + view.biggest + "，条数 " + view.count;
  });
  parts.controls.appendChild(readButton);

  draw();
}
