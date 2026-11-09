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

  equals(object) {
    if (!(object instanceof Dolar)) return false;
    return this.#valor === object.valor;
  }
}

module.exports = { Dolar };
