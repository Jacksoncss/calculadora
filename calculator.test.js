const {
  soma, subtrai, multiplica, divide, calcular, formatar, Calculadora,
} = require('./calculator');

describe('operações básicas', () => {
  test('soma', () => expect(soma(2, 3)).toBe(5));
  test('subtração', () => expect(subtrai(10, 4)).toBe(6));
  test('multiplicação', () => expect(multiplica(6, 7)).toBe(42));
  test('divisão', () => expect(divide(20, 4)).toBe(5));
  test('divisão por zero lança erro', () => {
    expect(() => divide(1, 0)).toThrow('Divisão por zero');
  });
  test('calcular escolhe a operação certa', () => {
    expect(calcular(8, '+', 2)).toBe(10);
    expect(calcular(8, '-', 2)).toBe(6);
    expect(calcular(8, '*', 2)).toBe(16);
    expect(calcular(8, '/', 2)).toBe(4);
  });
  test('calcular rejeita operador inválido', () => {
    expect(() => calcular(1, '^', 2)).toThrow('Operador inválido');
  });
});

describe('formatar', () => {
  test('remove ruído de ponto flutuante', () => {
    expect(formatar(0.1 + 0.2)).toBe('0.3');
  });
  test('usa notação científica para números muito grandes', () => {
    expect(formatar(1e20)).toContain('e+');
  });
});

describe('Calculadora (estado)', () => {
  let c;
  beforeEach(() => { c = new Calculadora(); });

  const digitos = (texto) => {
    for (const ch of texto) ch === '.' ? c.decimal() : c.digitar(ch);
  };

  test('começa em zero', () => expect(c.atual).toBe('0'));

  test('digita números sem zeros à esquerda', () => {
    digitos('007');
    expect(c.atual).toBe('7');
  });

  test('aceita só um ponto decimal', () => {
    digitos('1.2.3');
    expect(c.atual).toBe('1.23');
  });

  test('começar com ponto vira 0.', () => {
    c.decimal();
    expect(c.atual).toBe('0.');
  });

  test('2 + 3 = 5', () => {
    digitos('2'); c.definirOperador('+'); digitos('3'); c.igual();
    expect(c.atual).toBe('5');
  });

  test('encadeia operações: 2 + 3 * 4 resolve na ordem digitada', () => {
    digitos('2'); c.definirOperador('+');
    digitos('3'); c.definirOperador('*');
    digitos('4'); c.igual();
    expect(c.atual).toBe('20');
  });

  test('0.1 + 0.2 = 0.3', () => {
    digitos('0.1'); c.definirOperador('+'); digitos('0.2'); c.igual();
    expect(c.atual).toBe('0.3');
  });

  test('divisão por zero mostra Erro e o próximo dígito recomeça', () => {
    digitos('5'); c.definirOperador('/'); digitos('0'); c.igual();
    expect(c.atual).toBe('Erro');
    c.digitar('9');
    expect(c.atual).toBe('9');
  });

  test('trocar de operador antes do segundo número não calcula', () => {
    digitos('6'); c.definirOperador('+'); c.definirOperador('*');
    digitos('2'); c.igual();
    expect(c.atual).toBe('12');
  });

  test('apagar remove o último dígito', () => {
    digitos('123'); c.apagar();
    expect(c.atual).toBe('12');
    c.apagar(); c.apagar();
    expect(c.atual).toBe('0');
  });

  test('inverter sinal', () => {
    digitos('5'); c.inverterSinal();
    expect(c.atual).toBe('-5');
    c.inverterSinal();
    expect(c.atual).toBe('5');
  });

  test('porcentagem', () => {
    digitos('50'); c.porcentagem();
    expect(c.atual).toBe('0.5');
  });

  test('limpar zera tudo', () => {
    digitos('9'); c.definirOperador('+'); digitos('1'); c.limpar();
    expect(c.atual).toBe('0');
    expect(c.operador).toBeNull();
  });

  test('limita a 12 dígitos', () => {
    digitos('1234567890123456');
    expect(c.atual).toHaveLength(12);
  });
});
