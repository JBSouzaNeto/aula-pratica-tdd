class Dolar {
  #valor;

  constructor(valor) {
    this.#valor = valor;
  }

  get valor() {
    return this.#valor;
  }

  vezes(multiplicador) {
    return new Dolar(this.#valor * multiplicador);
  }
}

module.exports = { Dolar };
