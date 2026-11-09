const { test } = require("node:test");
const assert = require("node:assert");
const { Dolar } = require("./moeda.js");

test("testeMultiplicacao", () => {
  const cinco = new Dolar(5);
  let produto = cinco.vezes(2);
  assert.strictEqual(produto.valor, 10);

  produto = cinco.vezes(3);
  assert.strictEqual(produto.valor, 15);
});
