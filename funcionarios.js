// funcionarios.js - Apenas Máscaras e Validações Visuais

function aplicarMascaraData(value) {
  value = value.replace(/\D/g, '');
  if (value.length <= 2) return value;
  if (value.length <= 4) return value.slice(0, 2) + '/' + value.slice(2);
  return value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
}

function validarData(data) {
  if (!data || data.length !== 10) return false;
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = data.match(regex);
  if (!match) return false;
  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const ano = parseInt(match[3], 10);
  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  if (ano < 1900 || ano > 2100) return false;
  return true;
}

function validarEmail(email) {
  if (!email || email === '--------') return true;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function adicionarFeedbackVisual(input, isValid) {
  if (isValid) {
    input.classList.remove('input-error');
    input.classList.add('input-success');
  } else {
    input.classList.remove('input-success');
    input.classList.add('input-error');
  }
}

function removerFeedbackVisual(input) {
  input.classList.remove('input-error', 'input-success');
}

// Inicializa os eventos de máscara assim que o DOM carregar
$(document).ready(function() {
    const camposData = ['#funcionarioEntrada', '#funcionarioSaida', '#editFuncionarioEntrada', '#editFuncionarioSaida'];
    const camposEmail = ['#funcionarioEmail', '#editFuncionarioEmail'];

    camposData.forEach(function(seletor) {
        $(document).on('input', seletor, function() {
            this.value = aplicarMascaraData(this.value);
            removerFeedbackVisual(this);
        });
        // Adicione aqui os eventos de blur/focus se desejar validação visual
    });
});