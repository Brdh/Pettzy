const petsData = [
    {
        id: 1,
        name: "Fred",
        type: "Coelho",
        status: "red",
        statusText: "Urgente",
        image: "img/fred.png",
        description: "Apresenta comportamento dócil e curioso, demonstrando boa adaptação ao ambiente e interação positiva com tutores. Tem uma rotina de exercício regular, higienização do espaço e monitoramento veterinário preventivo.",
        age: "1 ano",
        weight: "45 kg",
        breed: "Cabra Boer",
        lastVaccine: "20/11/2025",
        lastCheckup: "15/11/2025",
        healthStatus: "Urgente",
        medications: "Medicações do suplemento",
        observations: [
            "Medicações ou Suplementos - Administrar uma vez ao dia",
            "Alimentação Especial - Dieta balanceada para animais diferenciados",
            "Cuidados Veterinários - Acompanhamento mensal obrigatório"
        ],
        tutor: {
            name: "Hellen Marçal",
            phone: "(81) 98765-4321"
        }
    },
    {
        id: 2,
        name: "Valentina",
        type: "Gato",
        status: "yellow",
        statusText: "Atenção",
        image: "img/valentina.jpg",
        description: "Gato independente e carinhoso, com preferência por ambientes tranquilos. Gosta de brincar à noite e descansar durante o dia. Alimentação regular e monitoramento de comportamento.",
        age: "3 anos",
        weight: "4.5 kg",
        breed: "Gato Persa",
        lastVaccine: "10/11/2025",
        lastCheckup: "05/11/2025",
        healthStatus: "Atenção",
        medications: "Suplemento de vitaminas",
        observations: [
            "Alimentação - Ração premium duas vezes ao dia",
            "Brincadeiras - Preferência por brinquedos interativos",
            "Higiene - Escovação diária recomendada"
        ],
        tutor: {
            name: "João Medeiros",
            phone: "(81) 99876-5432"
        }
    },
    {
        id: 3,
        name: "Alfredo",
        type: "Cachorro",
        status: "green",
        statusText: "Saudável",
        image: "img/sebastiao.jpg",
        description: "Cachorro energético e amigável, adora brincar e socializar com outros animais. Excelente saúde geral e comportamento equilibrado. Rotina de exercícios diários mantida.",
        age: "2 anos",
        weight: "25 kg",
        breed: "Bulldog",
        lastVaccine: "25/11/2025",
        lastCheckup: "20/11/2025",
        healthStatus: "Estável",
        medications: "Nenhuma",
        observations: [
            "Exercícios - Caminhadas diárias de 30 minutos",
            "Alimentação - Ração balanceada duas vezes ao dia",
            "Vacinação - Próxima dose em 12 meses"
        ],
        tutor: {
            name: "Fernanda Valadares",
            phone: "(81) 98765-1234"
        }
    }
];


function openModal(pet) {
    const modal = document.getElementById('petModal');
    const modalContent = document.querySelector('.modal-content');

    modalContent.classList.remove('status-red', 'status-yellow', 'status-green');
    modalContent.classList.add(`status-${pet.status}`);

    document.getElementById('modalPetId').textContent = `ID: #${String(pet.id).padStart(3, '0')}`;
    document.getElementById('modalPetImage').src = pet.image;
    document.getElementById('modalPetName').textContent = pet.name;
    document.getElementById('modalPetType').textContent = pet.type;
    document.getElementById('modalPetStatus').textContent = pet.statusText;
    document.getElementById('modalPetStatus').className = `pet-detail-status ${pet.status}`;
    document.getElementById('modalPetDescription').textContent = pet.description;

    const infoGrid = document.getElementById('modalPetInfo');
    infoGrid.innerHTML = `
        <div class="info-item">
            <div class="info-label">Idade</div>
            <div class="info-value">${pet.age}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Peso</div>
            <div class="info-value">${pet.weight}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Raça</div>
            <div class="info-value">${pet.breed}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Última Vacinação</div>
            <div class="info-value">${pet.lastVaccine}</div>
        </div>
    `;

    const healthGrid = document.getElementById('modalPetHealth');
    healthGrid.innerHTML = `
        <div class="info-item">
            <div class="info-label">Status de Saúde</div>
            <div class="info-value">${pet.healthStatus}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Última Consulta</div>
            <div class="info-value">${pet.lastCheckup}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Medicações</div>
            <div class="info-value">${pet.medications}</div>
        </div>
    `;

    const notesList = document.getElementById('modalPetNotes');
    notesList.innerHTML = '';
    pet.observations.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note;
        notesList.appendChild(li);
    });

    document.getElementById('modalTutorName').textContent = pet.tutor.name;
    document.getElementById('modalTutorPhone').textContent = pet.tutor.phone;


    const editBtn = document.getElementById('editPetBtn');

    // Removemos eventos anteriores para não duplicar o click
    const novoBtn = editBtn.cloneNode(true);
    editBtn.parentNode.replaceChild(novoBtn, editBtn);

    // Adicionamos o evento de click passando o objeto PET completo
    novoBtn.addEventListener('click', () => {
        closeModal(); // Fecha a modal de visualização
        abrirModalEdicao(pet); // Abre a modal de formulário (função criada no passo 3)
    });

    modal.classList.add('active');

}


function closeModal() {
    const modal = document.getElementById('petModal');
    modal.classList.remove('active');
}


// Função para abrir o modal de formulário preenchido
function abrirModalEdicao(pet) {
    const formModal = document.getElementById('formModal');

    // 1. Preenche o ID (usa _id se vier do banco, ou id se for estático)
    const petId = pet._id || pet.id;
    document.getElementById('editPetId').value = petId;

    // 2. Preenche os inputs visuais (IDs corrigidos conforme seu HTML)
    document.getElementById('editName').value = pet.name || pet.nome || '';
    document.getElementById('editImage').value = pet.image || pet.foto || '';
    document.getElementById('editType').value = pet.type || pet.especie || '';
    // Remove texto como " anos" quando for uma string (deixa só o número)
    const rawAge = pet.age || pet.idade || '';
    let ageForInput = '';
    if (rawAge !== null && rawAge !== undefined) {
        if (typeof rawAge === 'number') {
            ageForInput = String(rawAge);
        } else if (typeof rawAge === 'string') {
            const match = rawAge.match(/(\d+)/);
            ageForInput = match ? match[0] : '';
        }
    }
    document.getElementById('editAge').value = ageForInput;

    // Para o Select, precisamos garantir que o valor bata com as options (green, yellow, red)
    document.getElementById('editStatus').value = pet.status;

    // Muda o título
    document.getElementById('modalTitle').innerText = "Editar Pet";

    formModal.classList.add('active');
}

function closeFormModal() {
    document.getElementById('formModal').classList.remove('active');
}

// --- Listener de Envio do Formulário (PUT) ---
// CORREÇÃO: O ID do form no HTML é 'editPetForm'
document.getElementById('editPetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editPetId').value;
    const token = localStorage.getItem('token');

    // Cria o objeto com os dados corrigidos
    // Build payload and ensure `idade` (age) is sent as a Number or omitted if empty
    const fotoVal = document.getElementById('editImage').value;
    const nomeVal = document.getElementById('editName').value;
    const especieVal = document.getElementById('editType').value;
    const statusVal = document.getElementById('editStatus').value || "";
    const idadeRaw = document.getElementById('editAge').value.trim();

    const dadosAtualizados = {
        nome: nomeVal,
        foto: fotoVal,
        especie: especieVal,
        status: statusVal
    };

    if (idadeRaw !== '') {
        const idadeNumber = Number(idadeRaw);
        if (!Number.isNaN(idadeNumber)) {
            dadosAtualizados.idade = idadeNumber;
        }
    }

    try {
        const response = await fetch(`http://localhost:3000/api/pets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            alert('Pet atualizado com sucesso!');
            closeFormModal();
            // Verifica se a função carregarPets existe (geralmente está no petsLoad.js)
            if (typeof carregarPets === 'function') {
                carregarPets();
            } else {
                location.reload(); // Recarrega a página se não houver função de recarregar
            }
        } else {
            const erro = await response.json();
            alert('Erro ao atualizar: ' + (erro.message || erro.error));
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão com o servidor');
    }
});

// Listener do botão Cancelar do formulário
document.getElementById('cancelEditModalBtn').addEventListener('click', closeFormModal);

document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('closeModalBtnFooter').addEventListener('click', closeModal);

document.getElementById('petModal').addEventListener('click', (e) => {
    if (e.target.id === 'petModal') {
        closeModal();
    }
});


let statusAtual = 'all';
let termoBusca = '';

function aplicarFiltros() {
    const petCards = document.querySelectorAll('.pet-card');

    petCards.forEach((card, index) => {
        const cardStatus = card.getAttribute('data-status');
        const petName = petsData[index]?.name.toLowerCase() || '';

        const passaStatus = statusAtual === 'all' || cardStatus === statusAtual;
        const passaBusca = petName.includes(termoBusca.toLowerCase());

        card.style.display = (passaStatus && passaBusca) ? '' : 'none';
    });
}

function filtrarPorStatus(status) {
    statusAtual = status;
    aplicarFiltros();
}

function buscarPets() {
    const searchInput = document.getElementById('searchInput');
    termoBusca = searchInput.value;
    const clearBtn = document.getElementById('clearSearchBtn');

    clearBtn.style.display = termoBusca ? 'block' : 'none';
    aplicarFiltros();
}

function limparBusca() {
    document.getElementById('searchInput').value = '';
    termoBusca = '';
    document.getElementById('clearSearchBtn').style.display = 'none';
    aplicarFiltros();
}


document.addEventListener('DOMContentLoaded', () => {

    const statusTabs = document.querySelectorAll('.status-tab');
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            statusTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filtrarPorStatus(this.dataset.status);
        });
    });


    const petCards = document.querySelectorAll('.pet-card');

    petCards.forEach((card, index) => {
        if (index < petsData.length) {
            card.addEventListener('click', () => openModal(petsData[index]));
        }
    });


    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', buscarPets);

    const clearBtn = document.getElementById('clearSearchBtn');
    clearBtn.addEventListener('click', limparBusca);


    const addPetBtn = document.getElementById('addPetBtn');
    addPetBtn.addEventListener('click', () => {
        alert('Funcionalidade de adicionar novo pet em desenvolvimento!');
    });


});


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


