// VARIÁVEIS GLOBAIS
let funcionarios = [];
const addFuncionarioModal = document.getElementById('addFuncionarioModal');
const addFuncionarioForm = document.getElementById('addFuncionarioForm');
const novoFuncionarioBtn = document.querySelector('.btn-novo-funcionario');
const closeAddModalBtn = document.getElementById('closeAddModalBtn');
const cancelAddModalBtn = document.getElementById('cancelAddModalBtn');

// Carrega funcionarios do banco
async function carregarFuncionarios() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Usuário não autenticado. Redirecionando...");
        // Se não houver token, redirecione para a página de login
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/employees", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // --- AÇÃO CRÍTICA: ENVIA O TOKEN JWT ---
                'Authorization': `Bearer ${token}`
            }
        });

        // Trata erro de autenticação (Token inválido/expirado)
        if (response.status === 401) {
            console.error("Token inválido ou expirado.");
            localStorage.removeItem('token');
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = 'login.html';
            return;
        }

        // Se a resposta não for OK (404, 500, etc.)
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
        }

        funcionarios = await response.json();

        // Ajusta profissão quando o backend usa "cargo"
        funcionarios.forEach(funcionario => {
            funcionario.profissao = funcionario.profissao || funcionario.cargo;
        });

        // Ajusta contato quando o backend usa "email"
        funcionarios.forEach(funcionario => {
            funcionario.contato = funcionario.contato || funcionario.email;
        });


        renderizarTabela(funcionarios);
    } catch (err) {
        console.error("Erro ao carregar funcionarios:", err);
    }
}



// renderiza tabela com dados carregados
function renderizarTabela(lista) {
    const tbody = document.getElementById("funcionariosTableBody");
    tbody.innerHTML = "";

    lista.forEach(funcionario => {
        const row = document.createElement("tr");

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

            <td data-label="Entrada" class="data-cell">${funcionario.entrada || ""}</td>
            <td data-label="Saída" class="data-cell">${funcionario.saida || ""}</td>

            <td data-label="Contato">
                <a href="mailto:${funcionario.contato}" class="contato-cell">
                    ${funcionario.contato}
                </a>
            </td>

            <td data-label="Ações">
                <div class="acoes-cell">
                    <button class="btn-acao btn-editar" title="Editar" onclick="editarFuncionario('${funcionario._id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="btn-acao btn-deletar" title="Deletar" onclick="deletarFuncionario('${funcionario._id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });
}


// Classes para etilização no CSS
function getProfissaoClass(profissao) {
    const classMap = {
        "Gerente": "profissao-gerente",
        "Veterinário": "profissao-veterinario",
        "Administrador": "profissao-administrador",
        "Secretário": "profissao-secretario"
    };
    return classMap[profissao] || "profissao-default";
}

function getVinculoClass(vinculo) {
    return vinculo === "Ativo" ? "vinculo-ativo" : "vinculo-inativo";
}


// Pegar as iniciais das pessoa
function getIniciais(nome) {
    return nome
        .split(" ")
        .map(p => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}


//  Função buscar
function buscarFuncionarios(termo) {
    const termoLower = termo.toLowerCase();

    const filtrados = funcionarios.filter(f =>
        f.nome.toLowerCase().includes(termoLower) ||
        f.profissao.toLowerCase().includes(termoLower) ||
        f.vinculo.toLowerCase().includes(termoLower) ||
        f.contato.toLowerCase().includes(termoLower)
    );

    renderizarTabela(filtrados);
}


//  Função filtrar
function filtrarPorStatus(status) {
    let filtrados = funcionarios;

    if (status === "ativo") {
        filtrados = funcionarios.filter(f => f.vinculo === "Ativo");
    }
    if (status === "inativo") {
        filtrados = funcionarios.filter(f => f.vinculo === "Inativo");
    }

    renderizarTabela(filtrados);
}

// Função para abrir Modal
function openAddModal() {

    if (addFuncionarioModal) {
        addFuncionarioModal.classList.add('active');
    }

}

// Função para fechar Modal
function closeAddModal() {
    if (addFuncionarioModal) {
        addFuncionarioModal.classList.remove('active');
    }
    if (addFuncionarioForm) {
        addFuncionarioForm.reset();
    }
}

// Cria novo funcionário no Banco de Dados
async function handleAddFuncionarioSubmit(event) {
    event.preventDefault();

    const formData = new FormData(addFuncionarioForm);
    const funcionarioData = Object.fromEntries(formData.entries());
    const token = localStorage.getItem('token');

    // Validação básica do email
    if (!funcionarioData.email || !funcionarioData.email.includes('@')) {
        alert("Por favor, insira um email válido.");
        return;
    }

    // Se a cor não for definida, usa um valor padrão
    if (!funcionarioData.cor) {
        funcionarioData.cor = "#90caf9";
    }

    try {
        const response = await fetch("http://localhost:3000/api/employees", {
            method: 'POST', // Método para CRIAR novo recurso
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(funcionarioData)
        });

        if (!response.ok) {
            // Tenta obter a mensagem de erro do backend
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro desconhecido ao adicionar funcionário.");
        }

        alert("Funcionário adicionado com sucesso!");
        closeAddModal();
        await carregarFuncionarios();

    } catch (error) {
        console.error("Falha ao adicionar funcionário:", error);
        alert(`Erro: ${error.message}`);
    }
}

// Edita funcionário do Banco de Dados
function editarFuncionario(id) {
    // window.location.href = `/editar.html?id=${id}`;
    const funcionario = funcionarios.find(f => f._id === id);
    if (funcionario) {
        alert(`Editar funcionário: ${funcionario.nome}`);
        console.log(funcionario._id)
    } else {
        console.log("Funcionario não encontrado", id)
    }
}

// Deleta funcionário do Banco de Dados
async function deletarFuncionario(id) {
    if (!confirm("Tem certeza que deseja deletar?")) return;

    // --- OBTENHA O TOKEN ---
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Sua sessão expirou. Faça login novamente.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
            method: "DELETE",
            headers: {
                // --- AÇÃO CRÍTICA: ENVIE O TOKEN JWT ---
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            console.error("Token inválido ou expirado.");
            localStorage.removeItem('token');
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) {
            // Tenta obter a mensagem de erro do backend (se houver)
            const errorText = await response.text();
            throw new Error(`Falha ao deletar: ${response.status} - ${errorText}`);
        }

        // 3. Recarrega a lista para atualizar a tabela
        await carregarFuncionarios();
        alert("Funcionário deletado com sucesso!");

    } catch (error) {
        console.error("Erro ao deletar funcionário:", error);
        alert(`Erro ao deletar: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ligar o botão "Novo Funcionário" para abrir o modal
    if (novoFuncionarioBtn) {
        novoFuncionarioBtn.addEventListener('click', openAddModal);
    }

    // 2. Ligar os botões de fechar (X e Cancelar)
    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener('click', closeAddModal);
    }
    if (cancelAddModalBtn) {
        cancelAddModalBtn.addEventListener('click', closeAddModal);
    }

    // Fechar modal ao clicar fora
    if (addFuncionarioModal) {
        addFuncionarioModal.addEventListener('click', (e) => {
            if (e.target.id === 'addFuncionarioModal') {
                closeAddModal();
            }
        });
    }

    // 3. Ligar o formulário para a função de envio POST
    if (addFuncionarioForm) {
        addFuncionarioForm.addEventListener('submit', handleAddFuncionarioSubmit);
    }

    // CHAME A FUNÇÃO PRINCIPAL AQUI, DEPOIS QUE TUDO FOI CONFIGURADO
    carregarFuncionarios();
});


