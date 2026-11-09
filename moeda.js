class Moeda {
  #valor;
  #tipo;

  constructor(valor, tipo) {
    this.#valor = valor;
    this.#tipo = tipo;
  }

  get valor() {
    return this.#valor;
  }

  set valor(valor) {
    this.#valor = valor;
  }

  get tipo() {
    return this.#tipo;
  }

  set tipo(tipo) {
    this.#tipo = tipo;
  }

  static dolar(valor) {
    return new Moeda(valor, "USD");
  }

  static euro(valor) {
    return new Moeda(valor, "EUR");
  }

  vezes(multiplicador) {
    return new Moeda(this.#valor * multiplicador, this.#tipo);
  }

  equals(object) {
    if (!(object instanceof Moeda)) return false;
    return this.#valor === object.valor && this.#tipo === object.tipo;
  }
}

module.exports = { Moeda };
