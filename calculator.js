/* Lógica da calculadora (sem dependência de DOM, para ser testável com Jest). */

function soma(a, b) {
  return a + b;
}

function subtrai(a, b) {
  return a - b;
}

function multiplica(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Divisão por zero');
  }
  return a / b;
}

function calcular(a, operador, b) {
  switch (operador) {
    case '+':
      return soma(a, b);
    case '-':
      return subtrai(a, b);
    case '*':
      return multiplica(a, b);
    case '/':
      return divide(a, b);
    default:
      throw new Error('Operador inválido: ' + operador);
  }
}

/* Remove ruídos de ponto flutuante (0.1 + 0.2 => "0.3") e limita o tamanho. */
function formatar(valor) {
  const arredondado = parseFloat(valor.toPrecision(10));
  const texto = String(arredondado);
  if (texto.length > 12) {
    return arredondado.toExponential(5);
  }
  return texto;
}

class Calculadora {
  constructor() {
    this.limpar();
  }

  limpar() {
    this.atual = '0';
    this.anterior = null;
    this.operador = null;
    this.novoNumero = true;
    this.erro = false;
  }

  digitar(digito) {
    if (this.erro) this.limpar();
    if (this.novoNumero) {
      this.atual = digito;
      this.novoNumero = false;
    } else if (this.atual === '0') {
      this.atual = digito;
    } else if (this.atual.replace(/[-.]/g, '').length < 12) {
      this.atual += digito;
    }
  }

  decimal() {
    if (this.erro) this.limpar();
    if (this.novoNumero) {
      this.atual = '0.';
      this.novoNumero = false;
    } else if (!this.atual.includes('.')) {
      this.atual += '.';
    }
  }

  apagar() {
    if (this.erro) return this.limpar();
    if (this.novoNumero) return;
    this.atual = this.atual.length > 1 && this.atual !== '-0'
      ? this.atual.slice(0, -1)
      : '0';
    if (this.atual === '-') this.atual = '0';
  }

  inverterSinal() {
    if (this.erro || this.atual === '0') return;
    this.atual = this.atual.startsWith('-')
      ? this.atual.slice(1)
      : '-' + this.atual;
  }

  porcentagem() {
    if (this.erro) return;
    this.atual = formatar(parseFloat(this.atual) / 100);
    this.novoNumero = true;
  }

  definirOperador(op) {
    if (this.erro) return;
    // Encadeamento: 2 + 3 + ... resolve 2 + 3 antes de seguir
    if (this.operador && !this.novoNumero) {
      if (!this._resolver()) return;
    }
    this.anterior = parseFloat(this.atual);
    this.operador = op;
    this.novoNumero = true;
  }

  igual() {
    if (this.erro || !this.operador) return;
    this._resolver();
    this.anterior = null;
    this.operador = null;
    this.novoNumero = true;
  }

  /* Executa a operação pendente. Retorna false se der erro. */
  _resolver() {
    try {
      const resultado = calcular(this.anterior, this.operador, parseFloat(this.atual));
      this.atual = formatar(resultado);
      this.anterior = resultado;
      return true;
    } catch (e) {
      this.atual = 'Erro';
      this.erro = true;
      this.anterior = null;
      this.operador = null;
      this.novoNumero = true;
      return false;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { soma, subtrai, multiplica, divide, calcular, formatar, Calculadora };
}
