const funcionariosData = [
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
    },
    {
        id: 4,
        nome: 'Thiago Barbosa',
        profissao: 'Secretário',
        vinculo: 'Ativo',
        entrada: '06/02/2024',
        saida: '--------',
        contato: 'thiagobarbosa@gmail.com',
        cor: '#fff59d'
    },
    {
        id: 5,
        nome: 'Ana Silva',
        profissao: 'Gerente',
        vinculo: 'Inativo',
        entrada: '15/01/2022',
        saida: '30/11/2024',
        contato: 'anasilva@gmail.com',
        cor: '#ce93d8'
    },
    {
        id: 6,
        nome: 'Carlos Mendes',
        profissao: 'Veterinário',
        vinculo: 'Ativo',
        entrada: '12/05/2023',
        saida: '--------',
        contato: 'carlosmendes@gmail.com',
        cor: '#ffab91'
    }
];


function carregarDadosUsuario() {
    const usuarioLogado = {
        nome: 'Joao Silva',
        email: 'joao.silva@pettyz.com'
    };

    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');

    if (userNameEl) userNameEl.textContent = usuarioLogado.nome;
    if (userEmailEl) userEmailEl.textContent = usuarioLogado.email;
}


document.addEventListener('DOMContentLoaded', function () {
    renderizarFuncionarios(funcionariosData);
    inicializarEventos();
});



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


function getProfissaoClass(profissao) {
    const classMap = {
        'Gerente': 'profissao-gerente',
        'Veterinário': 'profissao-veterinario',
        'Administrador': 'profissao-administrador',
        'Secretário': 'profissao-secretario'
    };
    return classMap[profissao] || '';
}

function getVinculoClass(vinculo) {
    return vinculo === 'Ativo' ? 'vinculo-ativo' : 'vinculo-inativo';
}

function getIniciais(nome) {
    return nome
        .split(' ')
        .map(palavra => palavra[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}



function inicializarEventos() {

    const userDropdown = document.querySelector('.user-account-dropdown');
    const btnAccount = document.querySelector('.btn-account');

    if (btnAccount) {
        btnAccount.addEventListener('click', function () {
            userDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    carregarDadosUsuario();


    const statusTabs = document.querySelectorAll('.status-tab');
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            statusTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filtrarPorStatus(this.dataset.status);
        });
    });


    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        buscarFuncionarios(this.value);
    });


    const btnNovoFuncionario = document.querySelector('.btn-novo-funcionario');
    btnNovoFuncionario.addEventListener('click', function () {
        novoFuncionario();
    });


    const filterBtn = document.querySelector('.filter-btn');
    filterBtn.addEventListener('click', function () {
        abrirFiltros();
    });


    const sortBtn = document.querySelector('.sort-btn');
    sortBtn.addEventListener('click', function () {
        abrirOrdenacao();
    });


    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
        });
    }
}



function filtrarPorStatus(status) {
    if (status === 'all') {
        renderizarFuncionarios(funcionariosData);
    } else {
        const filtrados = funcionariosData.filter(f => {
            if (status === 'entrada') return f.saida === '--------';
            if (status === 'saida') return f.saida !== '--------';
            if (status === 'desligado') return f.vinculo === 'Inativo';
            return true;
        });
        renderizarFuncionarios(filtrados);
    }
}

function buscarFuncionarios(termo) {
    const termoLower = termo.toLowerCase();
    const filtrados = funcionariosData.filter(f => {
        return f.nome.toLowerCase().includes(termoLower) ||
            f.profissao.toLowerCase().includes(termoLower) ||
            f.vinculo.toLowerCase().includes(termoLower) ||
            f.contato.toLowerCase().includes(termoLower);
    });
    renderizarFuncionarios(filtrados);
}

function abrirFiltros() {
    alert('Função de filtros avançados em desenvolvimento!');
}

function abrirOrdenacao() {
    alert('Função de ordenação em desenvolvimento!');
}



function novoFuncionario() {
    alert('Abrir formulário para novo funcionário em desenvolvimento!');
}

function editarFuncionario(id) {
    const funcionario = funcionariosData.find(f => f.id === id);
    if (funcionario) {
        alert(`Editar funcionário: ${funcionario.nome}`);
    }
}

function deletarFuncionario(id) {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
        const index = funcionariosData.findIndex(f => f.id === id);
        if (index > -1) {
            funcionariosData.splice(index, 1);
            renderizarFuncionarios(funcionariosData);
            alert('Funcionário deletado com sucesso!');
        }
    }
}




const mobileBtn = document.getElementById('mobile_btn');
const mobileMenu = document.getElementById('mobile_menu');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}


document.querySelectorAll('#mobile_nav_list a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

