// VARIÁVEIS GLOBAIS
let funcionarios = [];


// Carrega funcionarios do banco
async function carregarFuncionarios() {
    try {
        const response = await fetch("http://localhost:3000/api/employees");
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
    return classMap[profissao] || "";
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


// Deleta funcionário do Banco de Dados
async function deletarFuncionario(id) {
    if (!confirm("Tem certeza que deseja deletar?")) return;

    await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: "DELETE"
    });

    carregarFuncionarios();
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


// Execução do código
carregarFuncionarios();
