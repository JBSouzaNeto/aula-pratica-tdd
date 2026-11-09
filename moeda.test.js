const { test } = require("node:test");
const assert = require("node:assert");
const { Dolar, Euro } = require("./moeda.js");

test("testeMultiplicacao", () => {
  const cinco = new Dolar(5);
  assert.ok(cinco.vezes(2).equals(new Dolar(10)));
  assert.ok(cinco.vezes(3).equals(new Dolar(15)));
});

test("testeIgualdade", () => {
  assert.ok(new Dolar(5).equals(new Dolar(5)));
  assert.strictEqual(new Dolar(5).equals(new Dolar(6)), false);
  assert.ok(new Euro(5).equals(new Euro(5)));
  assert.strictEqual(new Euro(5).equals(new Euro(6)), false);
  assert.strictEqual(new Euro(5).equals(new Dolar(5)), false); // Moedas distintas!
});

test("testeMultiplicacaoEuro", () => {
  const cinco = new Euro(5);
  assert.ok(cinco.vezes(2).equals(new Euro(10)));
  assert.ok(cinco.vezes(3).equals(new Euro(15)));
});
