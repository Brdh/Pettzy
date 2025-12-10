// funcionarios.js - Apenas Máscaras e Validações Visuais

function aplicarMascaraData(value) {
  value = value.replace(/\D/g, '');
  if (value.length <= 2) return value;
  if (value.length <= 4) return value.slice(0, 2) + '/' + value.slice(2);
  return value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
}

function validarData(data) {
  if (!data || data.length === 0) return true; // Data opcional (vazia) é válida
  if (data.length !== 10) return false;
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = data.match(regex);
  if (!match) return false;

  // Constrói a data no formato AAAA-MM-DD para validação precisa
  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const ano = parseInt(match[3], 10);

  // Cria um objeto Date e verifica se os componentes correspondem
  const dateObj = new Date(ano, mes - 1, dia);

  // Verifica se o objeto Date reverteu para a data original
  const isValid = dateObj.getFullYear() === ano &&
    dateObj.getMonth() === mes - 1 &&
    dateObj.getDate() === dia;

  if (!isValid) return false;
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

// ============================================
// LÓGICA DO MENU MOBILE
// ============================================
const mobileBtn = document.getElementById('mobile_btn');
const mobileMenu = document.getElementById('mobile_menu');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    // Alterna a classe 'active' no menu mobile
    mobileMenu.classList.toggle('active');
    // Opcional: Adiciona/remove a classe 'active' no body ou navbar 
    // se você usar isso para esconder o conteúdo principal ou mudar ícone
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.toggle('active');
    }

    // Opcional: Trocar o ícone do botão (de barras para 'x')
    const icon = mobileBtn.querySelector('i');
    if (icon) {
      if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times'); // Use o ícone 'x' para fechar
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });
}

// Inicializa os eventos de máscara assim que o DOM carregar
$(document).ready(function () {
  const camposData = ['#funcionarioEntrada', '#funcionarioSaida', '#editFuncionarioEntrada', '#editFuncionarioSaida'];
  const camposEmail = ['#funcionarioEmail', '#editFuncionarioEmail'];

  camposData.forEach(function (seletor) {
    $(document).on('input', seletor, function () {
      this.value = aplicarMascaraData(this.value);
      removerFeedbackVisual(this);
    });
  });
});