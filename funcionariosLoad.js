async function carregarFuncionarios() {
    try {
        const response = await fetch("http://localhost:3000/api/employees");
        const funcionarios = await response.json();

        const container = document.getElementById("funcionariosTableBody");
        container.innerHTML = "";

        funcionarios.forEach(funcionario => {

            const status = funcionario.status?.toLowerCase() || "yellow";
            const statusClass = `status-${status}`;
            const badgeClass = status;

            const idadeTexto =
                funcionario.idade != null
                    ? funcionario.idade === 1
                        ? "1 ano"
                        : `${funcionario.idade} anos`
                    : "";

            const pesoTexto =
                funcionario.peso != null
                    ? `${funcionario.peso} kg`
                    : "";

            const card = document.createElement("div");
            card.classList.add("pet-card", statusClass);
            card.dataset.status = status;

            // ------------------------------
            // 🔥 ADICIONAR O CLICK DO MODAL
            // ------------------------------
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
