const { test } = require("node:test");
const assert = require("node:assert");
const { Dolar } = require("./moeda.js");

test("testeMultiplicacao", () => {
  const cinco = new Dolar(5);
  assert.ok(cinco.vezes(2).equals(new Dolar(10)));
  assert.ok(cinco.vezes(3).equals(new Dolar(15)));
});

test("testeIgualdade", () => {
  assert.ok(new Dolar(5).equals(new Dolar(5)));
  assert.strictEqual(new Dolar(5).equals(new Dolar(6)), false);
});
