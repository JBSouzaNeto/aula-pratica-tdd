class Moeda {
  #valor;

  constructor(valor) {
    this.#valor = valor;
  }

  get valor() {
    return this.#valor;
  }

  set valor(valor) {
    this.#valor = valor;
  }

  equals(object) {
    if (!(object instanceof Moeda)) return false;
    return (
      this.#valor === object.valor && this.constructor === object.constructor
    );
  }
}

class Dolar extends Moeda {
  vezes(multiplicador) {
    return new Dolar(this.valor * multiplicador);
  }
}

class Euro extends Moeda {
  vezes(multiplicador) {
    return new Euro(this.valor * multiplicador);
  }
}

module.exports = { Moeda, Dolar, Euro };
