class Dolar {
  constructor(valor) {
    this.valor = valor;
  }

  vezes(multiplicador) {
    this.valor = this.valor * multiplicador;
  }
}

module.exports = { Dolar };
