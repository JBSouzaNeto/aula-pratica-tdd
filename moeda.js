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
    return new Dolar(valor, "USD");
  }

  static euro(valor) {
    return new Euro(valor, "EUR");
  }

  equals(object) {
    if (!(object instanceof Moeda)) return false;
    return this.#valor === object.valor && this.#tipo === object.tipo;
  }
}

class Dolar extends Moeda {
  constructor(valor, tipo) {
    super(valor, tipo);
  }

  vezes(multiplicador) {
    return Moeda.dolar(this.valor * multiplicador);
  }
}

class Euro extends Moeda {
  constructor(valor, tipo) {
    super(valor, tipo);
  }

  vezes(multiplicador) {
    return Moeda.euro(this.valor * multiplicador);
  }
}

module.exports = { Moeda, Dolar, Euro };
