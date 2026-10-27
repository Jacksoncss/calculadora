/* Interface: liga os botões e o teclado à lógica de calculator.js */
(function () {
  const calc = new Calculadora();
  const elValor = document.getElementById('valor');
  const elConta = document.getElementById('conta');
  const simbolos = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  function paraTela(texto) {
    return texto.replace('.', ',');
  }

  function atualizar() {
    const texto = paraTela(calc.atual);
    elValor.textContent = texto;
    elValor.classList.toggle('longo', texto.length > 9);

    elConta.textContent = calc.operador
      ? paraTela(String(calc.anterior)) + ' ' + simbolos[calc.operador]
      : '';

    document.querySelectorAll('.tecla-op').forEach((b) => {
      b.classList.toggle('ativo', calc.novoNumero && b.dataset.op === calc.operador);
    });
  }

  function executar(acao) {
    switch (acao) {
      case 'limpar': calc.limpar(); break;
      case 'sinal': calc.inverterSinal(); break;
      case 'porcentagem': calc.porcentagem(); break;
      case 'decimal': calc.decimal(); break;
      case 'apagar': calc.apagar(); break;
      case 'igual': calc.igual(); break;
    }
    atualizar();
  }

  document.querySelector('.teclas').addEventListener('click', (e) => {
    const botao = e.target.closest('button');
    if (!botao) return;
    if (botao.dataset.num !== undefined) {
      calc.digitar(botao.dataset.num);
      atualizar();
    } else if (botao.dataset.op) {
      calc.definirOperador(botao.dataset.op);
      atualizar();
    } else {
      executar(botao.dataset.acao);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (/^[0-9]$/.test(k)) { calc.digitar(k); atualizar(); }
    else if (['+', '-', '*', '/'].includes(k)) { calc.definirOperador(k); atualizar(); }
    else if (k === ',' || k === '.') executar('decimal');
    else if (k === 'Enter' || k === '=') { e.preventDefault(); executar('igual'); }
    else if (k === 'Backspace') executar('apagar');
    else if (k === 'Escape' || k === 'c' || k === 'C') executar('limpar');
    else if (k === '%') executar('porcentagem');
  });

  atualizar();
})();
