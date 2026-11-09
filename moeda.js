class Dolar {
  constructor(valor) {
    this.valor = valor;
  }

  vezes(multiplicador) {
    return new Dolar(this.valor * multiplicador);
  }
}

module.exports = { Dolar };
