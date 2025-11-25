const petsData = [
    {
        id: 1,
        name: "Fred",
        type: "Cabra",
        status: "red",
        statusText: "Urgente",
        image: "#",
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
            name: "Thalyta Silveira",
            phone: "(81) 98765-4321"
        }
    },
    {
        id: 2,
        name: "Valentina",
        type: "Gato",
        status: "yellow",
        statusText: "Atenção",
        image: "#",
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
            name: "João Oliveira",
            phone: "(81) 99876-5432"
        }
    },
 
    {
        id: 3,
        name: "Sebastião",
        type: "Bulldog",
        status: "green",
        statusText: "Estável",
        image: "#",
        description: "Um Bulldog de temperamento calmo. Comportamento tranquilo e rotina bem estabelecida. Saúde excelente com acompanhamento veterinário regular.",
        age: "4 anos",
        weight: "30 kg",
        breed: "Bulldog Francês",
        lastVaccine: "15/11/2025",
        lastCheckup: "10/11/2025",
        healthStatus: "Estável",
        medications: "Nenhuma",
        observations: [
            "Alimentação - Ração premium uma vez ao dia",
            "Ambiente - Prefere locais tranquilos e com luz",
            "Higiene - Banho mensal recomendado"
        ],
        tutor: {
            name: "Carlos Batista",
            phone: "(11) 99876-4321"
        }
    }
];



// Função para abrir o modal
function openModal(pet) {
    const modal = document.getElementById('petModal');
    
  
    // Mostrar modal
    modal.classList.add('active');
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('petModal');
    modal.classList.remove('active');
}

// Event listeners para fechar o modal
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('closeModalBtnFooter').addEventListener('click', closeModal);

// Fechar modal ao clicar fora dele
document.getElementById('petModal').addEventListener('click', (e) => {
    if (e.target.id === 'petModal') {
        closeModal();
    }
});

// Adicionar event listeners aos cards de pets
document.addEventListener('DOMContentLoaded', () => {
    const petCards = document.querySelectorAll('.pet-card');
    
    petCards.forEach((card, index) => {
        if (index < petsData.length) {
            card.addEventListener('click', () => openModal(petsData[index]));
        }
    });

    // Adicionar evento ao botão de adicionar pet
    const addPetBtn = document.querySelector('.add-pet-btn');
    addPetBtn.addEventListener('click', () => {
        alert('Funcionalidade de adicionar novo pet em desenvolvimento!');
    });

    // Menu mobile
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('#mobile_nav_list a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
});


























async function carregarPets() {
  try {
    const response = await fetch("http://localhost:3000/pets");
    const pets = await response.json();

    const container = document.getElementById("pets-container");

    // Se o container não existir, não faz nada
    if (!container) return;

    container.innerHTML = ""; // limpa antes

    pets.forEach((pet) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${pet.foto}" alt="${pet.nome}">
        <h2>${pet.nome}</h2>
        <p><strong>Espécie:</strong> ${pet.especie}</p>
        <p><strong>Raça:</strong> ${pet.raca}</p>
        <p><strong>Dono:</strong> ${pet.dono?.name ?? "Sem dono"}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar pets:", error);
  }
}

if (document.getElementById("pets-container")) {
  carregarPets();
}

