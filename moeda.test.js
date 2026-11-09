const { test } = require("node:test");
const assert = require("node:assert");
const { Dolar } = require("./moeda.js");

test("testeMultiplicacao", () => {
  const cinco = new Dolar(5);
  cinco.vezes(2);
  assert.strictEqual(cinco.valor, 10);
});
