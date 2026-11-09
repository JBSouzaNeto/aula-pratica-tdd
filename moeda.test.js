const { test } = require("node:test");
const assert = require("node:assert");
const { Moeda } = require("./moeda.js");

test("testeMultiplicacao", () => {
  const cinco = Moeda.dolar(5);
  assert.ok(cinco.vezes(2).equals(Moeda.dolar(10)));
  assert.ok(cinco.vezes(3).equals(Moeda.dolar(15)));
});

test("testeMultiplicacaoEuro", () => {
  const cinco = Moeda.euro(5);
  assert.ok(cinco.vezes(2).equals(Moeda.euro(10)));
  assert.ok(cinco.vezes(3).equals(Moeda.euro(15)));
});

test("testeIgualdade", () => {
  assert.ok(Moeda.dolar(5).equals(Moeda.dolar(5)));
  assert.strictEqual(Moeda.dolar(5).equals(Moeda.dolar(6)), false);
  assert.ok(Moeda.euro(5).equals(Moeda.euro(5)));
  assert.strictEqual(Moeda.euro(5).equals(Moeda.euro(6)), false);
  assert.strictEqual(Moeda.euro(5).equals(Moeda.dolar(5)), false);
});

test("testeMoedaTipo", () => {
  assert.strictEqual(Moeda.dolar(1).tipo, "USD");
  assert.strictEqual(Moeda.euro(1).tipo, "EUR");
});
