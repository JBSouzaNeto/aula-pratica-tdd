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

class Euro {
  #valor;

  constructor(valor) {
    this.#valor = valor;
  }

  get valor() {
    return this.#valor;
  }

  vezes(multiplicador) {
    return new Euro(this.#valor * multiplicador);
  }

  equals(object) {
    if (!(object instanceof Euro)) return false;
    return this.#valor === object.valor;
  }
}

module.exports = { Dolar, Euro };
