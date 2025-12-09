const addPetModal = document.getElementById('addPetModal');
const addPetForm = document.getElementById('addPetForm');

let currentEditingPetId = null;
let currentPet = null; // objeto completo do pet (vindo do backend)


// Função de Abertura do Modal
function openAddPetModal() {
    currentEditingPetId = null; // garante que não é edição
    if (addPetModal) {
        addPetModal.classList.add('active');
    }
}

// Função de Fechamento do Modal
function closeAddPetModal() {
    if (addPetModal) {
        addPetModal.classList.remove('active');
    }
    if (addPetForm) {
        addPetForm.reset(); // Limpa o formulário ao fechar
    }
}


// Função de Envio do Formulário (POST para a API)
async function handleAddPetSubmit(event) {
    event.preventDefault();

    const formData = new FormData(addPetForm);
    // Cria o objeto de dados com base nos campos do formulário (ex: {nome: '...', especie: '...', ...})
    const petData = Object.fromEntries(formData.entries());

    const token = localStorage.getItem('token');

    try {
        const response = await fetch("https://pettzy-backend.onrender.com/api/pets", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(petData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao adicionar o pet.");
        }

        alert("Pet adicionado com sucesso!");
        closeAddPetModal();
        await carregarPets(); // Recarrega a lista para mostrar o novo pet

    } catch (error) {
        console.error("Falha ao adicionar pet:", error);
        alert(`Erro: ${error.message}`);
    }
}

// function openEditPetModal(pet) {

// }


async function carregarPets() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Usuário não autenticado. Redirecionando...");
        // Se não houver token, redirecione para a página de login
        window.location.href = 'login.html';
        return;
    }


    try {
        const response = await fetch("https://pettzy-backend.onrender.com/api/pets", {
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

        const pets = await response.json();

        const container = document.getElementById("pets-container");
        container.innerHTML = "";

        pets.forEach(pet => {

            const status = pet.status?.toLowerCase() || "yellow";
            const statusClass = `status-${status}`;
            const badgeClass = status;

            const idadeTexto =
                pet.idade != null
                    ? pet.idade === 1
                        ? "1 ano"
                        : `${pet.idade} anos`
                    : "";

            const pesoTexto =
                pet.peso != null
                    ? `${pet.peso} kg`
                    : "";

            const card = document.createElement("div");
            card.classList.add("pet-card", statusClass);
            card.dataset.status = status;

            // Adiciona o clique à modal
            card.addEventListener("click", () => openModal({
                id: pet._id,
                image: pet.foto,
                name: pet.nome,
                type: pet.especie,
                comportamento: pet.comportamento || "Comportamento não informado",
                status: status,
                statusText: badgeClass === "green" ? "Estável" : badgeClass === "yellow" ? "Atenção" : "Urgente",

                age: idadeTexto,
                weight: pesoTexto,
                breed: pet.raca || "Não informado",
                lastVaccine: pet.ultimaVacina || "Não informado",

                healthStatus: pet.saude || "Não informado",
                lastCheckup: pet.ultimaConsulta || "Não informado",
                medications: pet.medicacoes || "Nenhuma",

                observations: pet.observacoes || [],

                tutor: {
                    name: pet.Owner || "-",
                    phone: pet.telefone || "-"
                }
            }));

            // ------------------------------
            // CARD HTML ORIGINAL DO SEU TIME
            // ------------------------------
            card.innerHTML = `
                <div class="pet-card-header-id">
                    <span class="pet-id">ID: #${pet._id?.slice(-4) ?? "0000"}</span>
                </div>

                <div class="pet-card-top">
                    <img src="${pet.foto}" alt="${pet.nome}" class="pet-image" />

                    <div class="pet-info">
                        <h3>${pet.nome}</h3>
                        <p>${pet.especie}</p>
                    </div>

                    <span class="status-badge ${badgeClass}">
                        ${status === "green" ? "Estável" :
                    status === "yellow" ? "Atenção" :
                        "Urgente"}
                    </span>
                </div>

                <div class="pet-card-bottom">
                    <span class="pet-detail">${idadeTexto}</span>
                    <span class="pet-detail">${pesoTexto}</span>
                </div>
            `;

            container.appendChild(card);
        });


        // Otimização: Chama o filtro após o carregamento, se a função existir no pets.js
        if (typeof aplicarFiltros === 'function') {
            aplicarFiltros();
        }

    } catch (err) {
        console.error("Erro ao carregar pets:", err);
    }
}

carregarPets();

// Anexar listeners de fechar/enviar após a execução do script
if (addPetModal && addPetForm) {
    // Listener para o botão de fechar (X) dentro do modal
    const closeAddModalBtn = document.getElementById('closeAddModalBtn');
    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener('click', closeAddPetModal);
    }

    // Listener para o botão 'Cancelar'
    const cancelAddModalBtn = document.getElementById('cancelAddModalBtn');
    if (cancelAddModalBtn) {
        cancelAddModalBtn.addEventListener('click', closeAddPetModal);
    }

    // Listener para o clique fora do modal
    addPetModal.addEventListener('click', (e) => {
        if (e.target.id === 'addPetModal') {
            closeAddPetModal();
        }
    });

    const pet = {
        nome: document.getElementById("petName").value.trim() || "Sem Nome",
        especie: document.getElementById("petSpecies").value.trim(),
        status: document.getElementById("petStatus").value,
        foto: document.getElementById("petImage").value.trim() || "https://placehold.co/300x200?text=Pet",
        idade: document.getElementById("petSpecies").value.trim(),
    };

    // Listener para o envio do formulário
    addPetForm.addEventListener('submit', handleAddPetSubmit);
}