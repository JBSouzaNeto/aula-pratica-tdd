# Resumo de POO com JavaScript

O modelo de Programação Orientada a Objetos (POO) em JavaScript moderno (ES6+) utiliza uma sintaxe de classe para organizar dados e comportamentos. Embora ofereça uma abstração visualmente familiar para desenvolvedores vindos de linguagens como Java ou C#, o motor do JavaScript executa essa estrutura sobre um sistema de herança prototípica. Compreender as particularidades do ciclo de vida das instâncias, do encapsulamento nativo e da vinculação do contexto é essencial para estruturar orientações sólidas e escrever testes unitários em um ambiente orientado a Test-Driven Development (TDD).

---

## 1. Declaração de Classes, Atributos Públicos e Métodos

As classes em JavaScript podem ser definidas por meio de declarações (`class Nome {}`) ou expressões de classe. Diferentemente das funções tradicionais, as declarações de classe não sofrem elevação (_hoisting_) padrão e estão sujeitas às restrições da Zona Morta Temporal (_Temporal Dead Zone_ — TDZ). Além disso, o corpo de qualquer classe é executado automaticamente em Modo Estrito (_strict mode_).

Os elementos de uma classe combinam características de visibilidade, localização e tipo:

- **Atributos Públicos de Instância (_Public Class Fields_):** São declarados diretamente no corpo da classe, sem a utilização de palavras-chave de escopo (`let`, `const`) ou modificadores de acesso (`public`). Se um campo for declarado sem valor inicial, ele é inicializado automaticamente como `undefined`. Os campos públicos são vinculados a cada instância antes da execução do construtor na classe base ou imediatamente após o retorno do método `super()` em subclasses.
- **Métodos de Instância:** Declarados no corpo da classe sem a palavra-chave `function`. Esses métodos são instalados no protótipo (`prototype`) da classe e compartilhados por todas as instâncias criadas.
- **Acessores Natíveis (`get` e `set`):** A sintaxe `get` vincula uma propriedade de objeto a uma função que é executada quando a propriedade é lida, devendo possuir exatamente zero parâmetros. A sintaxe `set` vincula uma propriedade a uma função que é executada na atribuição de valor, devendo aceitar exatamente um parâmetro.

```javascript
class Retangulo {
  // Atributos públicos (fields)
  altura = 0;
  largura;

  constructor(altura, largura) {
    this.altura = altura;
    this.largura = largura;
  }

  // Getter (acesso sintático como propriedade)
  get area() {
    return this.calcularArea();
  }

  // Setter (recebe exatamente um argumento)
  set area(valor) {
    this.altura = Math.sqrt(valor);
    this.largura = Math.sqrt(valor);
  }

  // Método de instância (armazenado em Retangulo.prototype)
  calcularArea() {
    return this.altura * this.largura;
  }
}
```

---

## 2. O Método Construtor e Inicialização de Instâncias

A criação e a inicialização de objetos instanciados a partir de uma classe ocorrem por meio do método especial `constructor`, que é invocado exclusivamente através do operador `new`.

A especificação do JavaScript impõe regras estritas sobre a estrutura e a execução do construtor:

1.  **Unicidade do Construtor:** Cada classe pode conter no máximo um método chamado `constructor`. A inclusão de múltiplas ocorrências lança um erro de sintaxe (`SyntaxError`).
2.  **Restrições Sintáticas:** O método `constructor` não pode ser uma função assíncrona (`async`), uma função geradora (`generator`), nem um acessor (`get`/`set`).
3.  **Construtores Padrão:** Caso uma classe base não declare um construtor explícito, o motor do JavaScript fornece um construtor padrão vazio (`constructor() {}`). Em subclasses, o construtor padrão repassa automaticamente todos os argumentos recebidos para a superclasse (`constructor(...args) { super(...args); }`).
4.  **Ordem de Avaliação durante a Instanciação:** Quando o operador `new` é executado em uma classe derivada, a avaliação segue uma ordem sequencial: a fase pré-`super()` do construtor da subclasse é avaliada (onde o acesso a `this` é proibido); o método `super()` é executado para inicializar o pai; os campos de instância da subclasse são inicializados; e, finalmente, o restante do corpo do construtor da subclasse é executado.

```javascript
class Pessoa {
  constructor(nome = "Anônimo") {
    this.nome = nome;
  }

  apresentar() {
    return `Olá, meu nome é ${this.nome}`;
  }
}

const pessoa = new Pessoa("Carlos");
console.log(pessoa.apresentar()); // "Olá, meu nome é Carlos"
```

---

## 3. Encapsulamento Nativo: Elementos Privados (`#`) vs. Públicos

Diferentemente do Java, que utiliza os modificadores de acesso `private` e `public`, o JavaScript implementa o encapsulamento privado nativo por meio da sintaxe de _Hash Names_ (identificadores iniciados obrigatoriamente pelo caractere `#`).

A privacidade garantida pela linguagem possui propriedades comportamentais específicas:

- **Verificação em Tempo de Compilação/Avaliação:** A proteção de elementos privados é aplicada diretamente pela engine de JavaScript. Tentar referenciar um campo `#` que não foi declarado no corpo da classe gera um erro de sintaxe imediato (`SyntaxError`). Tentar acessar um elemento privado em um objeto que não pertence à classe declarante resulta em um erro de tipo (`TypeError`).
- **Diferença de Propriedades Comuns:** Os elementos privados não possuem chaves do tipo `string` ou `symbol` no objeto e não contêm atributos de propriedade como `enumerable`, `writable` ou `configurable`. Por essa razão, é impossível acessá-los dinamicamente com a notação de colchetes (`objeto['#campo']`), enumerá-los ou removê-los com o operador `delete`.
- **Isolamento da Herança:** Elementos privados não fazem parte do modelo de herança prototípica. Subclasses não herdam e não têm acesso aos membros privados de suas superclasses.
- **Proibição de Construtores Privados:** O identificador `#constructor` é proibido pela linguagem. Para simular a instanciação privada (como em padrões _Factory_ ou _Singleton_), utiliza-se uma flag estática privada dentro do construtor público para validar a origem da chamada.

```javascript
class ContaBancaria {
  #saldo = 0; // Campo privado de instância

  constructor(saldoInicial) {
    this.#saldo = saldoInicial;
  }

  // Método privado
  #validarValor(valor) {
    return typeof valor === "number" && valor > 0;
  }

  depositar(valor) {
    if (this.#validarValor(valor)) {
      this.#saldo += valor;
      return true;
    }
    return false;
  }

  get saldo() {
    return this.#saldo;
  }
}

const conta = new ContaBancaria(100);
conta.depositar(50);
console.log(conta.saldo); // 150
// conta.#saldo; // SyntaxError: Private field '#saldo' must be declared in an enclosing class
```

---

## 4. Membros Estáticos (`static`) e Blocos de Inicialização

Os membros estáticos pertencem à própria função construtora/classe e não às suas instâncias. Eles são úteis para centralizar dados de configuração, rotinas utilitárias e gerenciar caches compartilhados.

A declaração e o comportamento dos membros estáticos incluem os seguintes aspectos:

- **Acesso por Classe:** Métodos e campos estáticos são acessados diretamente na classe (`NomeDaClasse.membroEstatico`). Tentar chamá-los a partir de uma instância (`instancia.membroEstatico`) resulta em `undefined` ou em erro de função inexistente. Em métodos de instância, eles podem ser acessados via `this.constructor.membroEstatico`.
- **Herança de Estáticos Públicos:** A cláusula `extends` estabelece a herança entre as próprias funções construtoras (`Object.getPrototypeOf(Subclasse) === ClassePai`). Assim, subclasses herdam membros estáticos públicos através da cadeia de protótipos.
- **Restrição em Estáticos Privados:** Campos ou métodos estáticos privados (`static #membro`) só podem ser acessados pela classe exata que os declarou. Invocar um método estático herdado que faz referência a `this.#membroEstaticoPrivado` a partir de uma subclasse lança um `TypeError`.
- **Blocos de Inicialização Estática:** A sintaxe `static { ... }` permite executar código de inicialização síncrono e complexo durante a avaliação da classe, concedendo acesso direto ao escopo privado da classe.

```javascript
class Calculadora {
  static #precisaoPadrao = 2; // Campo estático privado

  static {
    // Bloco de inicialização estática para configurações complexas
  }

  // Método estático público
  static arredondar(valor) {
    return Number(valor.toFixed(Calculadora.#precisaoPadrao));
  }
}

console.log(Calculadora.arredondar(3.14159)); // 3.14
```

---

## 5. Herança com `extends` e Manipulação de `super`

A herança orientada a objetos em JavaScript é configurada explicitamente por meio da palavra-chave `extends`, que estabelece a ligação prototípica entre a subclasse e a superclasse.

A implementação de subclasses exige atenção a regras fundamentais de inicialização e reaproveitamento:

- **Cadeia Prototípica Dupla:** A palavra-chave `extends` ajusta simultaneamente o protótipo da função construtora (`Subclasse` aponta para `Superclasse`) e o protótipo da propriedade `.prototype` (`Subclasse.prototype` aponta para `Superclasse.prototype`).
- **Obrigatoriedade do `super()`:** Em subclasses que definem um construtor próprio, é **obrogatório invocar `super(...)` antes de acessar a referência `this`**. A tentativa de ler ou escrever em `this` antes do retorno do `super()` lança um erro de referência (`ReferenceError`).
- **Invocação de Métodos do Pai:** A palavra-chave `super` pode ser usada em qualquer método para chamar implementações correspondentes da superclasse (`super.nomeDoMetodo()`).

```javascript
class Veiculo {
  constructor(marca) {
    this.marca = marca;
  }

  descricao() {
    return `Veículo da marca ${this.marca}`;
  }
}

class Carro extends Veiculo {
  constructor(marca, modelo) {
    super(marca); // Invocação obrigatória antes de usar `this`
    this.modelo = modelo;
  }

  descricao() {
    // Reutiliza a lógica da classe pai
    return `${super.descricao()}, modelo ${this.modelo}`;
  }
}

const meuCarro = new Carro("Toyota", "Corolla");
console.log(meuCarro.descricao()); // "Veículo da marca Toyota, modelo Corolla"
```

---

## 6. Comparação: Java vs. JavaScript (ES6+)

A tabela a seguir sintetiza os principias pontos de divergência sintática e comportamental entre o modelo de POO tradicional do Java e o modelo do JavaScript, servindo como guia de referência rápida para o desenvolvimento de software e criação de testes automatizados.

| Conceito de POO                   | Java                                                | JavaScript (ES6+)                                       |
| :-------------------------------- | :-------------------------------------------------- | :------------------------------------------------------ |
| **Declaração de Classe**          | `public class Pessoa {}`                            | `class Pessoa {}`                                       |
| **Modificadores de Visibilidade** | Palavras-chave `public`, `protected`, `private`     | Sem modificadores de texto; privado usa prefixo `#`     |
| **Declaração de Campos Públicos** | `public String nome;`                               | `nome;` ou `nome = "padrão";`                           |
| **Declaração de Campos Privados** | `private double saldo;`                             | `#saldo;` ou `#saldo = 0;`                              |
| **Membros Estáticos**             | `public static int contador;`                       | `static contador = 0;`                                  |
| **Método Construtor**             | Nome igual ao da classe (`public Pessoa()`)         | Nome fixo obrigatório `constructor()`                   |
| **Sobrecarga de Construtores**    | Suportada (múltiplos construtores por assinatura)   | Proibida (máximo de 1 `constructor` por classe)         |
| **Construtor da Superclasse**     | `super()` inserido implicitamente se houver default | `super()` obrigatório antes de usar `this` em subclasse |
| **Getters e Setters**             | Convenção de métodos (`getNome()`, `setNome()`)     | Palavras-chave nativas `get nome()` e `set nome(val)`   |
