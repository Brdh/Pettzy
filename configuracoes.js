const usuarioLogado = {
    nome: 'João Silva',
    email: 'caringpet2002@gmail.com',
    empresa: 'CaringPet'
};



document.addEventListener('DOMContentLoaded', function() {
    carregarDadosUsuario();
    inicializarEventos();
});

function carregarDadosUsuario() {
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');

    if (userNameEl) userNameEl.textContent = usuarioLogado.nome;
    if (userEmailEl) userEmailEl.textContent = usuarioLogado.email;
}



function inicializarEventos() {
    // Dropdown de Conta
    const userDropdown = document.querySelector('.user-account-dropdown');
    const btnAccount = document.querySelector('.btn-account');
    
    if (btnAccount) {
        btnAccount.addEventListener('click', function() {
            userDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }


    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
}


function editarEmail() {
    const emailInput = document.getElementById('emailInput');
    
    if (emailInput.readOnly) {
        emailInput.readOnly = false;
        emailInput.focus();
        emailInput.select();
    } else {
        const novoEmail = emailInput.value;
        if (validarEmail(novoEmail)) {
            emailInput.readOnly = true;
            usuarioLogado.email = novoEmail;
            alert('E-mail atualizado com sucesso!');
        } else {
            alert('Por favor, insira um e-mail válido!');
        }
    }
}

function editarSenha() {
    const senhaInput1 = document.getElementById('senhaInput1');
    const senhaInput2 = document.getElementById('senhaInput2');
    
    if (senhaInput1.readOnly) {
        senhaInput1.readOnly = false;
        senhaInput2.readOnly = false;
        senhaInput1.focus();
        senhaInput1.select();
    } else {
        const senha1 = senhaInput1.value;
        const senha2 = senhaInput2.value;
        
        if (senha1 === senha2 && senha1.length >= 6) {
            senhaInput1.readOnly = true;
            senhaInput2.readOnly = true;
            senhaInput1.value = '••••••••••••••••';
            senhaInput2.value = '••••••••••••••••';
            alert('Senha atualizada com sucesso!');
        } else if (senha1 !== senha2) {
            alert('As senhas não coincidem!');
        } else {
            alert('A senha deve ter no mínimo 6 caracteres!');
        }
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const btn = event.target.closest('.btn-toggle-password');
    const icon = btn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function toggleCNPJ() {
    const cnpjInput = document.getElementById('cnpjInput');
    const btn = event.target.closest('.btn-toggle-password');
    const icon = btn.querySelector('i');
    
    if (cnpjInput.value === 'XX.XXX.XXX/XXXX-XX') {
        cnpjInput.value = '12.345.678/0001-90';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        cnpjInput.value = 'XX.XXX.XXX/XXXX-XX';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}


function sairDaConta() {
    const confirmacao = confirm(
        'Tem certeza que deseja sair da sua conta?\n\n' +
        'Você será redirecionado para a página inicial.'
    );
    
    if (confirmacao) {
        // Limpar dados da sessão/localStorage
        localStorage.removeItem('usuarioLogado');
        sessionStorage.removeItem('token');
        
        // Exibir mensagem de confirmação
        alert('Você foi desconectado com sucesso!');
        
        // Redirecionar para página de login após 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

function desativarConta() {
    const confirmacao = confirm(
        'Tem certeza que deseja desativar sua conta?\n\n' +
        'Você poderá reativá-la a qualquer momento.'
    );
    
    if (confirmacao) {
        alert('Sua conta foi desativada com sucesso!\n\nVocê receberá um e-mail de confirmação.');
       
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

function excluirConta() {
    const confirmacao1 = confirm(
        'Tem certeza que deseja EXCLUIR sua conta?\n\n' +
        'Esta ação é IRREVERSÍVEL e todos os seus dados serão permanentemente removidos!'
    );
    
    if (confirmacao1) {
        const confirmacao2 = prompt(
            'Para confirmar a exclusão, digite sua senha:'
        );
        
        if (confirmacao2) {
            alert(
                'Sua conta foi marcada para exclusão!\n\n' +
                'Você tem 14 dias para reverter esta ação.\n' +
                'Caso não reverta, sua conta será permanentemente deletada.'
            );
          
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}



function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}