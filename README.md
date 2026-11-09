# Roteiro de Aula Prática: TDD em JavaScript com Node Test Runner (`node:test`)[^1]

---

## 1. Introdução ao TDD (Test-Driven Development)

### O que é TDD?

O **TDD** (_Test-Driven Development_, ou Desenvolvimento Dirigido por Testes) é uma prática de engenharia de software proposta por Kent Beck no contexto do _Extreme Programming_ (XP). Diferente do fluxo tradicional de desenvolvimento — no qual os testes são escritos após o código de produção (ou mesmo deixados de lado) —, o TDD inverte o fluxo de trabalho: **os testes automatizados são escritos antes da implementação do código de produção**.

### Objetivos do TDD

1. **Garantir a Escrita de Testes**: Ao colocar os testes como o primeiro passo de qualquer tarefa, evita-se que eles sejam negligenciados por falta de tempo.
2. **Promover Alta Testabilidade e Bom Design**: Como o desenvolvedor atua como o primeiro "cliente" de sua própria classe ao escrever o teste, ele busca instintivamente interfaces simples, nomes legíveis, baixo acoplamento e funções puras.
3. **Servir como Especificação Executável e Documentação Viva**: Os testes documentam exatamente o que o sistema deve fazer e como cada classe deve responder.
4. **Rede de Proteção contra Regressões**: Permite refatorar o código com total confiança de que modificações futuras não quebrarão funcionalidades que já funcionavam.

### Como Funciona: O Ciclo Red-Green-Refactor

O TDD opera em um ciclo contínuo composto por três fases fundamentais:

![](https://www.thoughtworks.com/content/dam/thoughtworks/images/photography/inline-image/insights/blog/testing/blg_inline_TDD_as_a_scaffold_diagram.jpg)

1. **🔴 RED (Vermelho)**: Escreva um teste automatizado pequeno para uma nova funcionalidade ou regra de negócio. Execute o teste e confirme que ele **falha** (ou nem compila). Essa falha é o sinal verde de que o teste é válido e representa uma especificação clara do que precisa ser feito.
2. **🟢 GREEN (Verde)**: Escreva a **menor e mais simples quantidade de código de produção necessária** para fazer o teste passar. Em TDD, avançamos em pequenos passos (_baby steps_). Não há problema em usar implementações simples ou temporárias nesta fase, desde que o teste fique verde.
3. **🟡 REFACTOR (Refatorar)**: Com a suíte de testes passando (em verde), examine o código de produção e o próprio código de teste para eliminar duplicações, melhorar nomes de variáveis, encapsular atributos e aplicar boas práticas de design. Todos os testes devem continuar verdes ao final da refatoração.

### As Duas Regras de Ouro do TDD (Kent Beck)

- **Regra 1**: _Escreva um teste automático que falhe antes de escrever qualquer código de produção._
- **Regra 2**: _Elimine a duplicação de código._

---

## 2. O Problema Prático: Relatório Financeiro Multi-moeda

### Origem do Projeto

Este exemplo foi retirado diretamente do livro clássico de Kent Beck (_Test-Driven Development: By Example_) e é baseado em uma situação real vivida por Ward Cunningham no desenvolvimento do sistema de gerenciamento de investimentos _WyCash_.

### O Cenário de Negócio

O sistema _WyCash_ atendia com sucesso fundos de investimento operando exclusivamente em dólares americanos. Repentinamente, surgiu a necessidade comercial de suportar carteiras de títulos e relatórios financeiros contendo **múltiplas moedas** (como Dólar e Euro).

Para resolver o problema sem reescrever o sistema do zero nem quebrar as regras existentes, o desafio era estender a aritmética financeira para suportar diferentes moedas de forma segura e incremental.

### O Nosso Desafio

Nesta aula prática, vamos vivenciar esse mesmo dilema:

1. Começaremos criando uma representação para valores em dólares (`Dolar`).
2. Garantiremos que operações aritméticas como multiplicação e igualdade funcionem de forma imutável.
3. Introduziremos suporte para uma segunda moeda, o **Euro** (`Euro`).
4. Identificaremos duplicações no código e, através de ciclos de refatoração, unificaremos o comportamento em uma abstração genérica (`Moeda`).

---

## 3. Configuração do Ambiente e Execução dos Testes

1. Crie uma pasta para o projeto e inicialize o Node.js:

   ```bash
   mkdir aula-tdd-js
   cd aula-tdd-js
   npm init -y
   ```

2. Para executar a suíte de testes durante a aula, execute no terminal:
   ```bash
   node --test
   ```

---

## 4. Roteiro Passo a Passo (Ciclo TDD)

---

### **Passo 1: 🔴 Vermelho — Primeiro Teste e Estrutura Inicial**

Criamos a estrutura mínima em JavaScript para permitir que o teste de multiplicação de dólares seja escrito.

**Código de Produção (`moeda.js`)**:

```javascript
class Dolar {
  valor = 10;

  constructor(valor) {}

  vezes(multiplicador) {}
}

module.exports = { Dolar };
```

**Código de Teste (`moeda.test.js`)**:

```javascript
const { test } = require("node:test");
const assert = require("node:assert");
const { Dolar } = require("./moeda.js");

test("testeMultiplicacao", () => {
  const cinco = new Dolar(5);
  cinco.vezes(2);
  assert.strictEqual(cinco.valor, 10);
});
```

👉 **Ação**: Execute os testes (`node --test`). Note que o teste passa temporariamente de forma "falsa" apenas porque `valor` possui o valor padrão 10.

---

### **Passo 2: 🟢 Verde — Implementação Real em `Dolar`**

Fornecemos a implementação real para calcular o valor acumulado no objeto `Dolar`.

**Atualização em `moeda.js`**:

```javascript
class Dolar {
  constructor(valor) {
    this.valor = valor;
  }

  vezes(multiplicador) {
    this.valor = this.valor * multiplicador;
  }
}

module.exports = { Dolar };
```

👉 **Ação**: Execute os testes (`node --test`). Verifique que o teste passou com sucesso!

---

### **Passo 3: 🔴 Vermelho — Imutabilidade da Moeda**

Evoluímos o requisito: chamadas ao método `vezes()` não devem alterar o objeto original, mas sim retornar uma nova instância de `Dolar`.

**Atualização do Teste (`moeda.test.js`)**:

```javascript
test("testeMultiplicacao", () => {
  const cinco = new Dolar(5);
  let produto = cinco.vezes(2);
  assert.strictEqual(produto.valor, 10);

  produto = cinco.vezes(3);
  assert.strictEqual(produto.valor, 15);
});
```

**Ajuste em `moeda.js` para compilar e passar**:

```javascript
class Dolar {
  constructor(valor) {
    this.valor = valor;
  }

  vezes(multiplicador) {
    return new Dolar(this.valor * multiplicador);
  }
}

module.exports = { Dolar };
```

👉 **Ação**: Execute os testes (`node --test`).

---

### **Passo 4: 🟡 Refatoração do Teste e Encapsulamento**

Para comparar duas moedas diretamente nos testes, expressamos a necessidade do método `equals()` e protegemos o acesso direto ao atributo `valor`.

**Atualização do Teste (`moeda.test.js`)**:

```javascript
test("testeMultiplicacao", () => {
  const cinco = new Dolar(5);
  assert.ok(cinco.vezes(2).equals(new Dolar(10)));
  assert.ok(cinco.vezes(3).equals(new Dolar(15)));
});
```

**Encapsulamento em `moeda.js`**:

```javascript
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
```

---

### **Passo 5: 🔴 Vermelho & 🟢 Verde — Implementando `equals()`**

**Novo Teste em `moeda.test.js`**:

```javascript
test("testeIgualdade", () => {
  assert.ok(new Dolar(5).equals(new Dolar(5)));
  assert.strictEqual(new Dolar(5).equals(new Dolar(6)), false);
});
```

**Implementação do método `equals()` em `moeda.js`**:

```javascript
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
```

👉 **Ação**: Execute os testes (`node --test`).

---

### **Passo 6: 🔴/🟢 Nova Moeda: Suporte ao `Euro`**

A aplicação precisa suportar a moeda **Euro**.

**Novo Teste em `moeda.test.js`**:

```javascript
const { test } = require("node:test");
const assert = require("node:assert");
const { Dolar, Euro } = require("./moeda.js");

test("testeMultiplicacaoEuro", () => {
  const cinco = new Euro(5);
  assert.ok(cinco.vezes(2).equals(new Euro(10)));
  assert.ok(cinco.vezes(3).equals(new Euro(15)));
});
```

**Implementação da Classe `Euro` (`moeda.js`)**:

```javascript
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
```

👉 **Ação**: Execute os testes (`node --test`).

---

### **Passo 7: 🟡 Refatoração — Extraindo a Superclasse `Moeda`**

Identificamos duplicação de código entre `Dolar` e `Euro` e extraímos a superclasse `Moeda`.

**Refatoração do Código de Produção (`moeda.js`)**:

```javascript
class Moeda {
  #valor;

  constructor(valor) {
    this.#valor = valor;
  }

  get valor() {
    return this.#valor;
  }

  equals(object) {
    if (!(object instanceof Moeda)) return false;
    return this.#valor === object.valor;
  }
}

class Dolar extends Moeda {
  vezes(multiplicador) {
    return new Dolar(this.#valor * multiplicador);
  }
}

class Euro extends Moeda {
  vezes(multiplicador) {
    return new Euro(this.#valor * multiplicador);
  }
}

module.exports = { Moeda, Dolar, Euro };
```

**Atualização dos Testes (`moeda.test.js`)**:

```javascript
test("testeIgualdade", () => {
  assert.ok(new Dolar(5).equals(new Dolar(5)));
  assert.strictEqual(new Dolar(5).equals(new Dolar(6)), false);
  assert.ok(new Euro(5).equals(new Euro(5)));
  assert.strictEqual(new Euro(5).equals(new Euro(6)), false);
});
```

👉 **Ação**: Execute os testes (`node --test`).

---

### **Passo 8: 🔴/🟢 Comparação entre Moedas Diferentes (`Euro` vs `Dolar`)**

Devemos garantir que a comparação entre 5 Euros e 5 Dólares retorne `false`.

**Atualização do Teste (`moeda.test.js`)**:

```javascript
test("testeIgualdade", () => {
  assert.ok(new Dolar(5).equals(new Dolar(5)));
  assert.strictEqual(new Dolar(5).equals(new Dolar(6)), false);
  assert.ok(new Euro(5).equals(new Euro(5)));
  assert.strictEqual(new Euro(5).equals(new Euro(6)), false);
  assert.strictEqual(new Euro(5).equals(new Dolar(5)), false); // Moedas distintas!
});
```

**Ajuste na Checagem do `equals()` (`moeda.js`)**:

```javascript
class Moeda {
  #valor;

  constructor(valor) {
    this.#valor = valor;
  }

  get valor() {
    return this.#valor;
  }

  equals(object) {
    if (!(object instanceof Moeda)) return false;
    return (
      this.#valor === object.valor && this.constructor === object.constructor
    );
  }
}
```

👉 **Ação**: Execute os testes (`node --test`).

---

### **Passo 9: 🔴/🟢 Métodos Fábrica na Classe `Moeda`**

Criamos métodos estáticos em `Moeda` para desacoplar as chamadas diretas aos construtores das subclasses nos testes.

**Atualização nos Testes (`moeda.test.js`)**:

```javascript
test("testeMultiplicacao", () => {
  const cinco = Moeda.dolar(5);
  assert.ok(cinco.vezes(2).equals(Moeda.dolar(10)));
  assert.ok(cinco.vezes(3).equals(Moeda.dolar(15)));
});

test("testeMultiplicacaoEuro", () => {
  const cinco = Moeda.euro(5);
  assert.ok(cinco.vezes(2).equals(Moeda.euro(10)));
  assert.ok(cinco.vezes(3).equals(Moeda.euro(15)));
});

test("testeIgualdade", () => {
  assert.ok(Moeda.dolar(5).equals(Moeda.dolar(5)));
  assert.strictEqual(Moeda.dolar(5).equals(Moeda.dolar(6)), false);
  assert.ok(Moeda.euro(5).equals(Moeda.euro(5)));
  assert.strictEqual(Moeda.euro(5).equals(Moeda.euro(6)), false);
  assert.strictEqual(Moeda.euro(5).equals(Moeda.dolar(5)), false);
});
```

**Adição dos Métodos Fábrica (`moeda.js`)**:

```javascript
class Moeda {
  #valor;

  constructor(valor) {
    this.#valor = valor;
  }

  get valor() {
    return this.#valor;
  }

  static dolar(valor) {
    return new Dolar(valor);
  }

  static euro(valor) {
    return new Euro(valor);
  }

  equals(object) {
    if (!(object instanceof Moeda)) return false;
    return (
      this.#valor === object.valor && this.constructor === object.constructor
    );
  }
}
```

👉 **Ação**: Execute os testes (`node --test`).

---

### **Passo 10: 🔴/🟢 Código do Tipo de Moeda (`tipo`)**

Adicionamos o código textual da moeda (`"USD"` e `"EUR"`).

**Novo Teste em `moeda.test.js`**:

```javascript
test("testeMoedaTipo", () => {
  assert.strictEqual(Moeda.dolar(1).tipo(), "USD");
  assert.strictEqual(Moeda.euro(1).tipo(), "EUR");
});
```

**Atributo `tipo` na classe `Moeda` (`moeda.js`)**:

```javascript
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

  get tipo() {
    return this.#tipo;
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
    return Moeda.dolar(this.#valor * multiplicador);
  }
}

class Euro extends Moeda {
  constructor(valor, tipo) {
    super(valor, tipo);
  }

  vezes(multiplicador) {
    return Moeda.euro(this.#valor * multiplicador);
  }
}

module.exports = { Moeda, Dolar, Euro };
```

👉 **Ação**: Execute os testes (`node --test`).

---

### **Passo 11: 🟡 Refatoração Final — Removendo as Subclasses Redundantes**

Com a informação de `tipo` na classe base `Moeda`, as subclasses `Dolar` e `Euro` tornaram-se idênticas e podem ser completamente removidas!

**Código de Produção Final (`moeda.js`)**:

```javascript
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

  get tipo() {
    return this.#tipo;
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
```

**Código de Teste Final (`moeda.test.js`)**:

```javascript
const { test } = require("node:test");
const assert = require("node:assert");
const { Moeda } = require("./moeda.js");

test("testeMultiplicacao", () => {
  const cinco = Moeda.dolar(5);
  assert.ok(cinco.vezes(2).equals(Moeda.dolar(10)));
  assert.ok(cinco.vezes(3).equals(Moeda.dolar(15)));
});

test("testeIgualdade", () => {
  assert.ok(Moeda.dolar(5).equals(Moeda.dolar(5)));
  assert.strictEqual(Moeda.dolar(5).equals(Moeda.dolar(6)), false);
  assert.ok(Moeda.euro(5).equals(Moeda.euro(5)));
  assert.strictEqual(Moeda.euro(5).equals(Moeda.euro(6)), false);
  assert.strictEqual(Moeda.euro(5).equals(Moeda.dolar(5)), false);
});

test("testeMoedaTipo", () => {
  assert.strictEqual(Moeda.dolar(1).tipo(), "USD");
  assert.strictEqual(Moeda.euro(1).tipo(), "EUR");
});
```

👉 **Ação**: Execute os testes (`node --test`). Parabéns! Você vivenciou os ciclos de TDD, evoluindo a arquitetura do código a partir de testes e obtendo um modelo simples, sem duplicação e seguro.

[^1]: **Nota de Adaptação**: Este roteiro foi adaptado do exercício prático de TDD do livro _Engenharia de Software Moderna_ (Prof. Marco Tulio Valente) e do livro clássico _Test-Driven Development: By Example_ (Kent Beck). As implementações utilizam **JavaScript** com notação **CommonJS** (`require`/`module.exports`), o test runner nativo do Node.js (**`node:test`**) com o estilo `test()`, o módulo **`node:assert`** e nomenclatura em português (`Moeda`, `Dolar`, `Euro`).
