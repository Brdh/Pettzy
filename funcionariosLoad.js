// ============================================
// VARIÁVEIS GLOBAIS E SELETORES
// ============================================
let funcionarios = []; // Armazena os dados vindos da API

// Elementos do Modal de Adicionar
const addFuncionarioModal = document.getElementById('addFuncionarioModal');
const addFuncionarioForm = document.getElementById('addFuncionarioForm');
const closeAddModalBtn = document.getElementById('closeAddModalBtn');
const cancelAddModalBtn = document.getElementById('cancelAddModalBtn');

// Elementos do Modal de Editar
const editFuncionarioModal = document.getElementById('editFuncionarioModal');
const editFuncionarioForm = document.getElementById('editFuncionarioForm');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const cancelEditModalBtn = document.getElementById('cancelEditModalBtn');

// ============================================
// CARREGAMENTO DE DADOS (GET)
// ============================================
async function carregarFuncionarios() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/employees", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) throw new Error("Erro ao buscar dados");

        funcionarios = await response.json();

        // Normalização de dados (cargo vs profissao / email vs contato)
        funcionarios.forEach(f => {
            f.profissao = f.profissao || f.cargo || 'Não informado';
            f.contato = f.contato || f.email || '';
            // Garante que o ID venha correto (MongoDB usa _id)
            f.id = f._id || f.id; 
        });

        renderizarTabela(funcionarios);
    } catch (err) {
        console.error("Erro ao carregar funcionarios:", err);
        alert("Erro ao carregar a lista de funcionários.");
    }
}

// ============================================
// RENDERIZAÇÃO DA TABELA
// ============================================
function renderizarTabela(lista) {
    const tbody = document.getElementById("funcionariosTableBody");
    tbody.innerHTML = "";

    lista.forEach(funcionario => {
        const row = document.createElement("tr");
        const profissaoClass = getProfissaoClass(funcionario.profissao);
        const vinculoClass = getVinculoClass(funcionario.vinculo);
        const iniciais = getIniciais(funcionario.nome);

        // ATENÇÃO: No botão editar, passamos o ID como string
        row.innerHTML = `
            <td data-label="Nome">
                <div class="funcionario-nome-cell">
                    <div class="funcionario-avatar" style="background-color: ${funcionario.cor || '#ccc'};">
                        ${iniciais}
                    </div>
                    <span class="funcionario-nome">${funcionario.nome}</span>
                </div>
            </td>
            <td data-label="Profissão">
                <span class="profissao-badge ${profissaoClass}">${funcionario.profissao}</span>
            </td>
            <td data-label="Vínculo">
                <span class="vinculo-badge ${vinculoClass}">${funcionario.vinculo}</span>
            </td>
            <td data-label="Entrada" class="data-cell">${funcionario.entrada || "-"}</td>
            <td data-label="Saída" class="data-cell">${funcionario.saida || "-"}</td>
            <td data-label="Contato">
                <a href="mailto:${funcionario.contato}" class="contato-cell">${funcionario.contato}</a>
            </td>
            <td data-label="Ações">
                <div class="acoes-cell">
                    <button class="btn-acao btn-editar" title="Editar" onclick="abrirModalEdicao('${funcionario.id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-acao btn-deletar" title="Deletar" onclick="deletarFuncionario('${funcionario.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ============================================
// LÓGICA DE EDIÇÃO (PUT)
// ============================================

// 1. Função chamada pelo botão da tabela para preencher e abrir o modal
window.abrirModalEdicao = function(id) {
    // Busca o funcionário na lista carregada na memória
    const funcionario = funcionarios.find(f => f.id === id || f._id === id);

    if (!funcionario) {
        alert("Funcionário não encontrado.");
        return;
    }

    // Preenche os campos do formulário
    document.getElementById('editFuncionarioId').value = funcionario.id;
    document.getElementById('editFuncionarioName').value = funcionario.nome;
    document.getElementById('editFuncionarioCargo').value = funcionario.profissao; // ou .cargo
    document.getElementById('editFuncionarioEntrada').value = funcionario.entrada || '';
    document.getElementById('editFuncionarioSaida').value = funcionario.saida || '';
    document.getElementById('editFuncionarioEmail').value = funcionario.contato;
    document.getElementById('editFuncionarioVinculo').value = funcionario.vinculo;
    document.getElementById('editFuncionarioCor').value = funcionario.cor || '#90caf9';

    // Abre o modal (usando jQuery se disponível, ou classe CSS)
    if (editFuncionarioModal) {
        editFuncionarioModal.style.display = 'block'; 
        // Se usar a classe .active do CSS igual ao modal de adicionar:
        editFuncionarioModal.classList.add('active');
    }
}

// 2. Função para fechar o modal de edição
function fecharModalEdicao() {
    if (editFuncionarioModal) {
        editFuncionarioModal.style.display = 'none';
        editFuncionarioModal.classList.remove('active');
    }
    editFuncionarioForm.reset();
}

// 3. Evento de Submit do Formulário de Edição (Envia para API)
editFuncionarioForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('editFuncionarioId').value;
    const token = localStorage.getItem('token');

    // Cria o objeto com os dados atualizados
    const dadosAtualizados = {
        nome: document.getElementById('editFuncionarioName').value,
        cargo: document.getElementById('editFuncionarioCargo').value, // Backend geralmente espera 'cargo'
        entrada: document.getElementById('editFuncionarioEntrada').value,
        saida: document.getElementById('editFuncionarioSaida').value,
        email: document.getElementById('editFuncionarioEmail').value,
        vinculo: document.getElementById('editFuncionarioVinculo').value,
        cor: document.getElementById('editFuncionarioCor').value
    };

    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar funcionário');
        }

        alert('Funcionário atualizado com sucesso!');
        fecharModalEdicao();
        carregarFuncionarios(); // Recarrega a tabela para mostrar dados novos
        
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar: ' + error.message);
    }
});

// Eventos de fechar modal de edição
if(closeEditModalBtn) closeEditModalBtn.addEventListener('click', fecharModalEdicao);
if(cancelEditModalBtn) cancelEditModalBtn.addEventListener('click', fecharModalEdicao);


// ============================================
// LÓGICA DE ADICIONAR (POST)
// ============================================
// (Mantendo a lógica existente de abrir modal)
const btnNovoFuncionario = document.querySelector('.btn-novo-funcionario');
if(btnNovoFuncionario) {
    btnNovoFuncionario.addEventListener('click', () => {
        addFuncionarioModal.classList.add('active');
    });
}

function fecharModalAdd() {
    addFuncionarioModal.classList.remove('active');
    addFuncionarioForm.reset();
}

if(closeAddModalBtn) closeAddModalBtn.addEventListener('click', fecharModalAdd);
if(cancelAddModalBtn) cancelAddModalBtn.addEventListener('click', fecharModalAdd);

addFuncionarioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addFuncionarioForm);
    const data = Object.fromEntries(formData.entries());
    const token = localStorage.getItem('token');

    try {
        const response = await fetch("http://localhost:3000/api/employees", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Funcionário cadastrado!");
            fecharModalAdd();
            carregarFuncionarios();
        } else {
            alert("Erro ao cadastrar.");
        }
    } catch (err) {
        console.error(err);
    }
});


// ============================================
// UTILITÁRIOS (Helpers)
// ============================================
function getProfissaoClass(profissao) {
    if (!profissao) return "profissao-default";
    const map = {
        "Gerente": "profissao-gerente",
        "Veterinário": "profissao-veterinario",
        "Administrador": "profissao-administrador",
        "Secretário": "profissao-secretario"
    };
    return map[profissao] || "profissao-default";
}

function getVinculoClass(vinculo) {
    return vinculo === "Ativo" ? "vinculo-ativo" : "vinculo-inativo";
}

function getIniciais(nome) {
    if (!nome) return "??";
    return nome.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

// Função de Deletar (Exemplo básico)
window.deletarFuncionario = async function(id) {
    if(!confirm("Tem certeza que deseja excluir?")) return;
    
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if(response.ok) {
            alert("Funcionário removido.");
            carregarFuncionarios();
        } else {
            alert("Erro ao remover.");
        }
    } catch(err) {
        console.error(err);
    }
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', carregarFuncionarios);