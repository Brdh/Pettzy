// VARIÁVEL GLOBAL PARA A API_URL
const API_URL = "http://localhost:3000/api";

// Função utilitária para exibir mensagens de notificação
function mostrarNotificacao(mensagem, sucesso = true) {
    // Implemente aqui sua lógica de notificação (ex: um toast, alert melhorado, etc.)
    alert(mensagem);
}

// ==========================================================
// 1. CARREGAR DADOS DA EMPRESA (COM CNPJ REAL)
// ==========================================================

async function carregarEmpresa() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Usuário não autenticado. Redirecionando...");
        window.location.href = 'login.html';
        return;
    }

    // Assumimos que o backend tem um endpoint mais específico, como /company/me
    // que retorna os dados da empresa do usuário logado baseado no token.
    try {
        const response = await fetch(`${API_URL}/company/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // TRATAMENTO DE ERROS GENÉRICOS DE FETCH
        if (!response.ok) {
            if (response.status === 401) {
                mostrarNotificacao("Sessão expirada. Faça login novamente.", false);
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Erro ao carregar dados: ${response.status} - ${errorData.message}`);
        }

        const empresa = await response.json();

        // Se o backend retornar um array, descomente a linha abaixo e ajuste
        // const empresa = dados.find(e => e.principal === true) || dados[0]; 

        if (empresa) {
            // Preenche o campo de e-mail
            document.getElementById("emailInput").value = empresa.email || "";

            // Preenche o CNPJ
            const cnpjInput = document.getElementById("cnpjInput");
            const cnpjReal = empresa.cnpj || "12345678000190";

            console.log("Empresa carregada:", empresa);
            console.log("CNPJ Real:", cnpjReal);

            const formatarCNPJ = (cnpj) => {
                if (!cnpj || cnpj.length !== 14) return cnpj;
                return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
            };

            // Armazena o CNPJ real no dataset
            cnpjInput.dataset.cnpjReal = cnpjReal;
            cnpjInput.dataset.revealed = "false";
            cnpjInput.value = formatarCNPJ(cnpjReal);

            console.log("CNPJ Input dataset após carregar:", cnpjInput.dataset);
        }
    }
    catch (err) {
        console.error("Erro ao carregar dados da empresa:", err);
        mostrarNotificacao(`Falha ao carregar informações: ${err.message}`, false);
    }
}

// ==========================================================
// 2. LÓGICA DE TROCA DE SENHA - Versão Corrigida
// ==========================================================

// Variáveis para armazenar as senhas temporariamente
let senhaAtualInput;
let novaSenhaInput;
let confirmarSenhaInput;
let btnEditarSenha; // Referência ao botão 'Editar Senha' / 'Salvar Senha'

// ⭐️ FUNÇÃO REINSERIDA PARA FAZER O BOTÃO FUNCIONAR
function criarCamposDeSenha() {
    // Esta função é chamada ao clicar em 'Editar Senha' pela primeira vez

    btnEditarSenha = document.querySelector('.config-item-body > .btn-edit');
    const passwordInputsDiv = document.querySelector('.password-inputs');

    // Remove os inputs fakes
    passwordInputsDiv.innerHTML = '';

    // Cria os novos inputs
    const inputConfigs = [
        { id: 'currentPassword', placeholder: 'Senha Atual', icon: 'eye', action: 'togglePassword', required: true },
        { id: 'newPassword', placeholder: 'Nova Senha', icon: 'eye', action: 'togglePassword', required: true },
        { id: 'confirmNewPassword', placeholder: 'Confirmar Nova Senha', icon: 'eye', action: 'togglePassword', required: true }
    ];

    inputConfigs.forEach(config => {
        const group = document.createElement('div');
        group.className = 'password-input-group';

        const input = document.createElement('input');
        input.type = 'password';
        input.id = config.id;
        input.className = 'config-input';
        input.placeholder = config.placeholder;
        input.required = config.required;

        const button = document.createElement('button');
        button.className = 'btn-toggle-password';
        button.innerHTML = `<i class="fa-solid fa-${config.icon}"></i>`;
        button.onclick = () => togglePassword(config.id);

        group.appendChild(input);
        group.appendChild(button);
        passwordInputsDiv.appendChild(group);
    });

    // Atualiza as referências
    senhaAtualInput = document.getElementById('currentPassword');
    novaSenhaInput = document.getElementById('newPassword');
    confirmarSenhaInput = document.getElementById('confirmNewPassword');

    // Muda o botão 'Editar Senha' para 'Salvar Senha' e conecta à função de envio
    btnEditarSenha.innerHTML = `<i class="fa-solid fa-save"></i> Salvar Senha`;
    btnEditarSenha.onclick = enviarNovaSenha;
}


// Função para resetar a interface de senha para o estado inicial (placeholder)
function resetarInterfaceSenha() {
    const passwordInputsDiv = document.querySelector('.password-inputs');
    const btnEdit = document.querySelector('.config-item-body > .btn-edit');

    // 1. Limpa o div dos inputs
    passwordInputsDiv.innerHTML = `
        <div class="password-input-group">
            <input
                type="password"
                id="senhaInput2" 
                class="config-input"
                value="••••••••••••••••"
                readonly
            />
        </div>
    `;

    // 2. Reseta o botão para o estado inicial
    btnEdit.innerHTML = `<i class="fa-solid fa-pen"></i> Editar Senha`;
    btnEdit.onclick = editarSenha; // Reconecta ao fluxo de edição
}


async function enviarNovaSenha() {
    if (!senhaAtualInput || !novaSenhaInput || !confirmarSenhaInput) {
        mostrarNotificacao("Erro interno na interface. Recarregue a página.", false);
        return;
    }

    const currentPassword = senhaAtualInput.value;
    const newPassword = novaSenhaInput.value;
    const confirmNewPassword = confirmarSenhaInput.value;

    if (newPassword !== confirmNewPassword) {
        return mostrarNotificacao("As novas senhas não coincidem!", false);
    }
    if (newPassword.length < 6) {
        return mostrarNotificacao("A nova senha deve ter no mínimo 6 caracteres!", false);
    }
    if (currentPassword === newPassword) {
        return mostrarNotificacao("A nova senha deve ser diferente da senha atual!", false);
    }


    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        if (response.ok) {
            // 1. Feedback de Sucesso
            mostrarNotificacao("Senha alterada com sucesso! Você será desconectado para reautenticação.", true);

            // 2. Força Logout e Redirecionamento (Limpeza de Estado)
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.href = 'login.html'; // Redireciona para a tela de login
            }, 1500);

        } else {
            // Trata erros de requisição (400, 401, 500)
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido do servidor.' }));

            // 1. Feedback de Erro
            if (response.status === 400 && errorData.message && errorData.message.includes('current password')) {
                mostrarNotificacao("Erro: Senha atual incorreta.", false);
            } else {
                mostrarNotificacao(`Falha ao trocar senha: ${errorData.message}`, false);
            }

            // 2. Reseta campos para o estado inicial após falha
            resetarInterfaceSenha();
        }
    }
    catch (err) {
        console.error("Erro no fetch de troca de senha:", err);
        mostrarNotificacao("Erro de rede. Verifique sua conexão.", false);

        // Reseta campos para o estado inicial após falha de rede
        resetarInterfaceSenha();
    }
}


function editarSenha() {
    const passwordInputsDiv = document.querySelector('.password-inputs');

    // Verifica se ainda está no estado placeholder (apenas 1 grupo de input)
    if (passwordInputsDiv.querySelectorAll('.password-input-group').length === 1) {
        // Inicializa a interface real de troca de senha
        criarCamposDeSenha(); // ⭐️ ESTA FUNÇÃO FAZ O BOTÃO TER AÇÃO
    } else {
        // Se já está em edição, o botão já foi remapeado para enviarNovaSenha()
        return;
    }
}


// ==========================================================
// 3. LÓGICA DE ATUALIZAÇÃO DE E-MAIL
// ==========================================================

// Variável de controle para salvar o email original
let emailOriginal;

async function enviarNovoEmail(novoEmail) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/auth/update-email`, {
            method: 'PUT', // PUT ou PATCH
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email: novoEmail })
        });

        if (response.ok) {
            mostrarNotificacao("E-mail alterado com sucesso! Recarregando dados...", true);
            // 6. ATUALIZAÇÃO AUTOMÁTICA
            await carregarEmpresa(); // Recarrega os dados para confirmar a mudança
            return true;
        } else {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            mostrarNotificacao(`Falha ao alterar e-mail: ${errorData.message}`, false);
            return false;
        }
    }
    catch (err) {
        console.error("Erro no fetch de troca de e-mail:", err);
        mostrarNotificacao("Erro de rede. Verifique sua conexão.", false);
        return false;
    }
}

async function editarEmail() {
    const emailInput = document.getElementById('emailInput');
    const btnEdit = emailInput.nextElementSibling;

    if (emailInput.readOnly) {
        // Modo EDIÇÃO: Salva o email original, habilita a edição
        emailOriginal = emailInput.value;
        emailInput.readOnly = false;
        emailInput.focus();
        emailInput.select();
        btnEdit.innerHTML = `<i class="fa-solid fa-save"></i> Salvar E-mail`;

    } else {
        // Modo SALVAR: Tenta enviar a mudança
        const novoEmail = emailInput.value;

        if (!validarEmail(novoEmail)) {
            return mostrarNotificacao('Por favor, insira um e-mail válido!', false);
        }

        if (novoEmail === emailOriginal) {
            // Se o email não mudou, apenas volta para o modo readonly
            mostrarNotificacao("Nenhuma alteração de e-mail detectada.");
            emailInput.readOnly = true;
            btnEdit.innerHTML = `<i class="fa-solid fa-pen"></i> Editar E-mail`;
            return;
        }

        const sucesso = await enviarNovoEmail(novoEmail);

        if (sucesso) {
            emailInput.readOnly = true;
            btnEdit.innerHTML = `<i class="fa-solid fa-pen"></i> Editar E-mail`;
        } else {
            // Se falhar, volta o email original no input
            emailInput.value = emailOriginal;
            emailInput.readOnly = true;
            btnEdit.innerHTML = `<i class="fa-solid fa-pen"></i> Editar E-mail`;
        }
    }
}

// ==========================================================
// 4. FUNÇÕES EXISTENTES E CORRIGIDAS
// ==========================================================

// Mostrar | Esconder senha - CORRIGIDO para os novos IDs
function togglePassword(id) {
    const input = document.getElementById(id);
    const button = document.getElementById(id).closest(".password-input-group").querySelector('button');
    const icon = button.querySelector('i');

    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}


// Mostrar | Esconder CNPJ
function toggleCNPJ() {
    const input = document.getElementById('cnpjInput');
    const button = input.nextElementSibling;
    const icon = button?.querySelector('i');

    if (!input || !button || !icon) {
        console.error("Elementos não encontrados. Input:", input, "Button:", button, "Icon:", icon);
        return;
    }

    const cnpjReal = input.dataset.cnpjReal;

    if (!cnpjReal) {
        console.error("CNPJ real não carregado. Dataset:", input.dataset);
        return;
    }

    const formatarCNPJ = (cnpj) => {
        if (!cnpj || cnpj.length !== 14) return cnpj;
        return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    };

    const isRevealed = input.dataset.revealed === "true";

    console.log("Toggle CNPJ - Atual:", isRevealed, "CNPJ Real:", cnpjReal);

    if (isRevealed) {
        // Volta para mascarado
        input.value = formatarCNPJ(cnpjReal);
        input.dataset.revealed = "false";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
        console.log("CNPJ mascarado");
    } else {
        // Mostra completo
        input.value = cnpjReal;
        input.dataset.revealed = "true";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
        console.log("CNPJ revelado");
    }
}

// Inicialização dos Eventos
document.addEventListener('DOMContentLoaded', () => {
    carregarEmpresa();

    // ⭐️ CORREÇÃO PARA O TOGGLE CNPJ
    const cnpjButton = document.querySelector('#cnpjInput').nextElementSibling;
    if (cnpjButton) {
        cnpjButton.onclick = toggleCNPJ;
    }
    // ⭐️ FIM DA CORREÇÃO

    inicializarEventosMobile();
});

// Menu Mobile
function inicializarEventosMobile() {
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
}

// Validar email
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Funções Sair/Desativar/Excluir (mantidas originais, mas devem ser ligadas ao Backend se for para serem "reais")
function sairDaConta() {
    if (!confirm("Tem certeza que deseja sair?")) return;

    localStorage.removeItem('token');
    window.location.href = 'index.html';
}