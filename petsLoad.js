async function carregarPets() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("Usuário não autenticado. Redirecionando...");
        // Se não houver token, redirecione para a página de login
        window.location.href = 'login.html';
        return;
    }


    try {
        const response = await fetch("http://localhost:3000/api/pets", {
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
                description: pet.descricao || "Comportamento não informado",
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
                    name: pet.dono?.nome || "-",
                    phone: pet.dono?.telefone || "-"
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

        // ---------------------------
        // 🔥 BOTÃO DE ADICIONAR PET
        // ---------------------------
        const addBtn = document.createElement("button");
        addBtn.classList.add("add-pet-btn");
        addBtn.id = "addPetBtn";

        addBtn.innerHTML = `
            <div class="add-pet-content">
                <i class="fa-solid fa-plus"></i>
                <span>Adicionar Novo Pet</span>
            </div>
        `;

        container.appendChild(addBtn);

    } catch (err) {
        console.error("Erro ao carregar pets:", err);
    }
}

carregarPets();
