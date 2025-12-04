// ============================================
// FUNÇÕES DE MÁSCARA E VALIDAÇÃO
// ============================================

/**
 * Aplica máscara de data (DD/MM/AAAA) em um campo de input
 * @param {string} value - Valor do input
 * @returns {string} - Valor formatado
 */
function aplicarMascaraData(value) {
  value = value.replace(/\D/g, '');
  if (value.length <= 2) {
    return value;
  } else if (value.length <= 4) {
    return value.slice(0, 2) + '/' + value.slice(2);
  } else {
    return value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
  }
}

/**
 * Valida se uma data está no formato correto DD/MM/AAAA
 * @param {string} data - Data a ser validada
 * @returns {boolean} - True se válida, false caso contrário
 */
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
  
  const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  if ((ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0) {
    diasPorMes[1] = 29;
  }
  
  if (dia > diasPorMes[mes - 1]) return false;
  
  return true;
}

/**
 * Valida se um email está no formato correto
 * @param {string} email - Email a ser validado
 * @returns {boolean} - True se válido, false caso contrário
 */
function validarEmail(email) {
  if (!email || email === '--------') return true; // Email é opcional ou placeholder
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Adiciona feedback visual de validação ao campo
 * @param {HTMLElement} input - Campo de input
 * @param {boolean} isValid - Se o valor é válido
 */
function adicionarFeedbackVisual(input, isValid) {
  if (isValid) {
    input.classList.remove('input-error');
    input.classList.add('input-success');
  } else {
    input.classList.remove('input-success');
    input.classList.add('input-error');
  }
}

/**
 * Remove feedback visual do campo
 * @param {HTMLElement} input - Campo de input
 */
function removerFeedbackVisual(input) {
  input.classList.remove('input-error', 'input-success');
}

// ============================================
// LÓGICA DE NEGÓCIO E MANIPULAÇÃO DE DADOS
// (Baseado no código fornecido pelo usuário)
// ============================================

// Dados de exemplo (adaptados para serem mutáveis)
let funcionariosData = [
    {
        id: 1,
        nome: 'Marcela Figueiredo',
        profissao: 'Gerente',
        vinculo: 'Ativo',
        entrada: '03/03/2023',
        saida: '--------',
        contato: 'marcela.figueiredo@gmail.com',
        cor: '#90caf9'
    },
    {
        id: 2,
        nome: 'Bruno Alencar',
        profissao: 'Veterinário',
        vinculo: 'Ativo',
        entrada: '23/09/2021',
        saida: '--------',
        contato: 'brunoalencar@gmail.com',
        cor: '#81c784'
    },
    {
        id: 3,
        nome: 'Fernanda Tavares',
        profissao: 'Administrador',
        vinculo: 'Ativo',
        entrada: '09/04/2022',
        saida: '--------',
        contato: 'fernandatavares@gmail.com',
        cor: '#f48fb1'
    }
];

// Funções auxiliares (assumindo que existem no código original)
function getProfissaoClass(profissao) {
    return 'profissao-' + profissao.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getVinculoClass(vinculo) {
    return 'vinculo-' + vinculo.toLowerCase();
}

function getIniciais(nome) {
    const partes = nome.split(' ');
    if (partes.length >= 2) {
        return partes[0][0] + partes[1][0];
    }
    return nome[0];
}

// ============================================
// FUNÇÕES DE EDIÇÃO (IMPLEMENTADAS)
// ============================================

/**
 * Busca um funcionário pelo ID
 * @param {number} id - ID do funcionário
 * @returns {Object|null} - Objeto do funcionário ou null
 */
function buscarFuncionarioPorId(id) {
    const funcionarioId = typeof id === 'string' ? parseInt(id, 10) : id;
    return funcionariosData.find(f => f.id === funcionarioId) || null;
}

/**
 * Atualiza os dados de um funcionário
 * @param {Object} funcionarioAtualizado - Objeto com os dados atualizados
 */
function atualizarFuncionario(funcionarioAtualizado) {
    const id = parseInt(funcionarioAtualizado.id, 10);
    const index = funcionariosData.findIndex(f => f.id === id);
    
    if (index !== -1) {
        // Mapear os campos do modal para a estrutura de dados
        funcionariosData[index] = {
            ...funcionariosData[index],
            nome: funcionarioAtualizado.nome,
            profissao: funcionarioAtualizado.cargo, // 'cargo' no modal, 'profissao' nos dados
            entrada: funcionarioAtualizado.entrada,
            saida: funcionarioAtualizado.saida,
            contato: funcionarioAtualizado.email, // 'email' no modal, 'contato' nos dados
            vinculo: funcionarioAtualizado.vinculo,
            cor: funcionarioAtualizado.cor
        };
        
        // Recarregar a tabela para refletir a mudança
        renderizarFuncionarios(funcionariosData);
        
        alert('Funcionário atualizado com sucesso!');
        console.log('Funcionário atualizado:', funcionariosData[index]);
    } else {
        console.error('Funcionário não encontrado para atualização:', id);
        alert('Erro ao atualizar funcionário.');
    }
}

/**
 * Abre o modal de edição com os dados do funcionário
 * Esta função é chamada pelo botão de edição na tabela
 * @param {number} id - ID do funcionário a ser editado
 */
function editarFuncionario(id) {
    const funcionario = buscarFuncionarioPorId(id);
    
    if (funcionario) {
        // Preenche os campos do formulário de edição
        $('#editFuncionarioId').val(funcionario.id);
        $('#editFuncionarioName').val(funcionario.nome);
        $('#editFuncionarioCargo').val(funcionario.profissao);
        $('#editFuncionarioEntrada').val(funcionario.entrada === '--------' ? '' : funcionario.entrada);
        $('#editFuncionarioSaida').val(funcionario.saida === '--------' ? '' : funcionario.saida);
        $('#editFuncionarioEmail').val(funcionario.contato === '--------' ? '' : funcionario.contato);
        $('#editFuncionarioVinculo').val(funcionario.vinculo);
        $('#editFuncionarioCor').val(funcionario.cor || '#90caf9');
        
        // Abre o modal
        $('#editFuncionarioModal').fadeIn(300);
    } else {
        alert('Funcionário não encontrado.');
    }
}

/**
 * Fecha o modal de edição
 */
function fecharModalEdicao() {
    $('#editFuncionarioModal').fadeOut(300);
    $('#editFuncionarioForm')[0].reset();
    
    // Remove feedback visual de todos os campos
    $('#editFuncionarioForm input').each(function() {
        removerFeedbackVisual(this);
    });
}

// ============================================
// RENDERIZAÇÃO E EVENTOS (ADAPTADOS)
// ============================================

function renderizarFuncionarios(dados) {
    const tbody = document.getElementById('funcionariosTableBody');
    tbody.innerHTML = '';

    dados.forEach(funcionario => {
        const row = document.createElement('tr');

        const profissaoClass = getProfissaoClass(funcionario.profissao);
        const vinculoClass = getVinculoClass(funcionario.vinculo);
        const iniciais = getIniciais(funcionario.nome);


        row.innerHTML = `
            <td data-label="Nome">
                <div class="funcionario-nome-cell">
                    <div class="funcionario-avatar" style="background-color: ${funcionario.cor};">
                        ${iniciais}
                    </div>
                    <span class="funcionario-nome">${funcionario.nome}</span>
                </div>
            </td>
            <td data-label="Profissão">
                <span class="profissao-badge ${profissaoClass}">
                    ${funcionario.profissao}
                </span>
            </td>
            <td data-label="Vínculo">
                <span class="vinculo-badge ${vinculoClass}">
                    ${funcionario.vinculo}
                </span>
            </td>
            <td data-label="Entrada" class="data-cell">${funcionario.entrada}</td>
            <td data-label="Saída" class="data-cell">${funcionario.saida}</td>
            <td data-label="Contato">
                <a href="mailto:${funcionario.contato}" class="contato-cell">
                    ${funcionario.contato}
                </a>
            </td>
            <td data-label="Ações">
                <div class="acoes-cell">
                    <button class="btn-acao btn-editar" title="Editar" onclick="editarFuncionario(${funcionario.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-acao btn-deletar" title="Deletar" onclick="deletarFuncionario(${funcionario.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Função de deletar (simplesmente para evitar erro, deve ser implementada no código original)
function deletarFuncionario(id) {
    if (confirm(`Tem certeza que deseja deletar o funcionário ID ${id}?`)) {
        const index = funcionariosData.findIndex(f => f.id === id);
        if (index !== -1) {
            funcionariosData.splice(index, 1);
            renderizarFuncionarios(funcionariosData);
            alert('Funcionário deletado com sucesso (apenas em memória).');
        }
    }
}

// ============================================
// INICIALIZAÇÃO E EVENTOS DE MÁSCARA/VALIDAÇÃO
// ============================================

$(document).ready(function() {
    // Aplicar máscara de data e validação aos campos
    const camposData = ['#funcionarioEntrada', '#funcionarioSaida', '#editFuncionarioEntrada', '#editFuncionarioSaida'];
    const camposEmail = ['#funcionarioEmail', '#editFuncionarioEmail'];

    // 1. Máscara de Data
    camposData.forEach(function(seletor) {
        $(seletor).on('input', function() {
            const input = this;
            const cursorPos = input.selectionStart;
            const valorAnterior = input.value;
            
            input.value = aplicarMascaraData(input.value);
            
            // Ajusta a posição do cursor
            if (valorAnterior.length < input.value.length) {
                input.setSelectionRange(cursorPos + 1, cursorPos + 1);
            } else {
                input.setSelectionRange(cursorPos, cursorPos);
            }
            
            removerFeedbackVisual(input);
        }).on('blur', function() {
            const valor = this.value.trim();
            if (valor === '') {
                removerFeedbackVisual(this);
                return;
            }
            const isValid = validarData(valor);
            adicionarFeedbackVisual(this, isValid);
        }).on('focus', function() {
            removerFeedbackVisual(this);
        });
    });

    // 2. Validação de Email
    camposEmail.forEach(function(seletor) {
        $(seletor).on('blur', function() {
            const valor = this.value.trim();
            if (valor === '') {
                removerFeedbackVisual(this);
                return;
            }
            const isValid = validarEmail(valor);
            adicionarFeedbackVisual(this, isValid);
        }).on('focus', function() {
            removerFeedbackVisual(this);
        });
    });

    // 3. Eventos do Modal de Edição
    $('#closeEditModalBtn').on('click', fecharModalEdicao);
    $('#cancelEditModalBtn').on('click', fecharModalEdicao);
    $('#editFuncionarioModal').on('click', function(e) {
        if (e.target.id === 'editFuncionarioModal') {
            fecharModalEdicao();
        }
    });

    // 4. Submissão do Formulário de Edição
    $('#editFuncionarioForm').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validação de Data de Entrada
        const entrada = $('#editFuncionarioEntrada').val().trim();
        if (entrada && !validarData(entrada)) {
            adicionarFeedbackVisual($('#editFuncionarioEntrada')[0], false);
            isValid = false;
        }
        
        // Validação de Data de Saída
        const saida = $('#editFuncionarioSaida').val().trim();
        if (saida && !validarData(saida)) {
            adicionarFeedbackVisual($('#editFuncionarioSaida')[0], false);
            isValid = false;
        }
        
        // Validação de Email
        const email = $('#editFuncionarioEmail').val().trim();
        if (email && !validarEmail(email)) {
            adicionarFeedbackVisual($('#editFuncionarioEmail')[0], false);
            isValid = false;
        }
        
        if (!isValid) {
            alert('Por favor, corrija os campos inválidos antes de salvar.');
            return;
        }
        
        // Coletar dados do formulário
        const funcionarioAtualizado = {
            id: $('#editFuncionarioId').val(),
            nome: $('#editFuncionarioName').val().trim(),
            cargo: $('#editFuncionarioCargo').val().trim(),
            entrada: entrada,
            saida: saida,
            email: email,
            vinculo: $('#editFuncionarioVinculo').val(),
            cor: $('#editFuncionarioCor').val()
        };
        
        atualizarFuncionario(funcionarioAtualizado);
        fecharModalEdicao();
    });

    // 5. Validação no Modal de Adicionar (apenas para garantir)
    $('#addFuncionarioForm').on('submit', function(e) {
        let isValid = true;
        
        const entrada = $('#funcionarioEntrada').val().trim();
        if (entrada && !validarData(entrada)) {
            adicionarFeedbackVisual($('#funcionarioEntrada')[0], false);
            isValid = false;
            e.preventDefault();
        }
        
        const saida = $('#funcionarioSaida').val().trim();
        if (saida && !validarData(saida)) {
            adicionarFeedbackVisual($('#funcionarioSaida')[0], false);
            isValid = false;
            e.preventDefault();
        }
        
        const email = $('#funcionarioEmail').val().trim();
        if (email && !validarEmail(email)) {
            adicionarFeedbackVisual($('#funcionarioEmail')[0], false);
            isValid = false;
            e.preventDefault();
        }
        
        if (!isValid) {
            alert('Por favor, corrija os campos inválidos antes de salvar.');
        }
        
        // Se for válido, a função de adicionar funcionário deve ser chamada aqui
        // Exemplo: adicionarFuncionario(coletarDadosDoForm());
    });
});

