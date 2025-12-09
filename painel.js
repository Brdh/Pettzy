// Script para controlar o menu mobile
document.addEventListener('DOMContentLoaded', function () {
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');

    // Adicionar evento de clique
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function () {

            mobileMenu.classList.toggle('active');
        });
    }

    // Fechar o menu quando clicar em um link
    const mobileNavLinks = document.querySelectorAll('#mobile_nav_list a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
        });
    });

    // Fechar o menu quando clicar fora dele
    document.addEventListener('click', function (event) {
        const isClickInsideHeader = document.querySelector('header').contains(event.target);

        if (!isClickInsideHeader && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    });

    // Carrega pets e funcionários para o dashboard
    loadDashboardData();
});


async function loadDashboardData() {
    // Dispara em paralelo
    try {
        // Incluindo loadAgendaForDashboard()
        await Promise.all([loadPetsForDashboard(), loadEmployeesForDashboard(), loadDaycarePets(), loadAgendaForDashboard()]);
    } catch (err) {
        console.error('Erro carregando dados do dashboard:', err);
    }
}

async function loadPetsForDashboard() {
    // Implementação da função loadPetsForDashboard (inalterada)
    const token = localStorage.getItem('token');
    const petList = document.getElementById('pet-list');

    if (!petList) return;

    if (!token) {
        console.warn('Token não encontrado. Não será possível carregar pets.');
        return;
    }

    try {
        const res = await fetch('https://pettzy-backend.onrender.com/api/pets', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            // Substituir alert() por UI customizada, conforme boas práticas (Aviso: Apenas para fins de demonstração, mantive o alert por ser o padrão original, mas em apps reais deve ser evitado.)
            // alert('Sessão expirada. Faça login novamente.'); 
            window.location.href = 'Login.html';
            return;
        }

        if (!res.ok) throw new Error(`Falha ao obter pets: ${res.status}`);

        const pets = await res.json();

        // Limita a exibição (p.ex. 6 primeiros)
        const toShow = Array.isArray(pets) ? pets.slice(0, 6) : [];

        petList.innerHTML = '';

        toShow.forEach(pet => {
            const status = (pet.status || '').toLowerCase();
            const colorClass = status === 'green' ? 'green' : status === 'pink' ? 'pink' : 'yellow';

            const item = document.createElement('div');
            item.className = `pet-list-item ${colorClass}`;

            const img = document.createElement('img');
            img.className = 'pet-list-avatar';
            img.src = pet.foto || 'img/petsImages/fred.png';
            img.alt = pet.nome || 'Pet';

            const info = document.createElement('div');
            info.className = 'pet-list-info';

            const name = document.createElement('div');
            name.className = 'pet-list-name';
            name.textContent = pet.nome || '-';

            const breed = document.createElement('div');
            breed.className = 'pet-list-breed';
            breed.textContent = pet.raca || pet.especie || '-';

            const age = document.createElement('div');
            age.className = 'pet-list-age';
            age.textContent = pet.idade != null ? (pet.idade === 1 ? '1 ano' : `${pet.idade} anos`) : '';

            const owner = document.createElement('div');
            owner.className = 'pet-list-owner';
            owner.textContent = pet.Owner || pet.dono?.nome || '-';

            info.appendChild(name);
            info.appendChild(breed);
            info.appendChild(age);
            info.appendChild(owner);

            const statusEl = document.createElement('div');
            statusEl.className = 'pet-status';
            statusEl.textContent = status === 'green' ? 'Saudável' : status === 'pink' ? 'Urgente' : 'A Verificar';

            item.appendChild(img);
            item.appendChild(info);
            item.appendChild(statusEl);

            petList.appendChild(item);
        });

    } catch (err) {
        console.error('Erro ao carregar pets para dashboard:', err);
    }
}

async function loadEmployeesForDashboard() {
    // Implementação da função loadEmployeesForDashboard (inalterada)
    const token = localStorage.getItem('token');
    const employeesContainer = document.getElementById('employees-list');

    if (!employeesContainer) return;

    if (!token) {
        console.warn('Token não encontrado. Não será possível carregar funcionários.');
        return;
    }

    try {
        const res = await fetch('https://pettzy-backend.onrender.com/api/employees', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            // alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'Login.html';
            return;
        }

        if (!res.ok) throw new Error(`Falha ao obter funcionários: ${res.status}`);

        const employees = await res.json();

        // Mostrar apenas alguns (ex: 3)
        const toShow = Array.isArray(employees) ? employees.slice(0, 3) : [];

        // Limpa somente os cards existentes (mantém title e botão)
        // Remover todos os elementos .employee-card filhos
        const existingCards = Array.from(employeesContainer.querySelectorAll('.employee-card'));
        existingCards.forEach(el => el.remove());

        toShow.forEach(emp => {
            const card = document.createElement('div');
            card.className = 'employee-card';
            if (emp.cor) card.style.backgroundColor = emp.cor;

            const img = document.createElement('img');
            img.src = 'https://placehold.co/300x200?text=Funcionário';
            img.alt = emp.nome || 'Funcionário';
            img.className = 'employee-avatar';

            const info = document.createElement('div');
            info.className = 'employee-info';

            const name = document.createElement('div');
            name.className = 'employee-name';
            name.textContent = emp.nome || '-';

            const role = document.createElement('div');
            role.className = 'employee-role';
            role.textContent = emp.cargo || emp.profissao || '';

            const details1 = document.createElement('div');
            details1.className = 'employee-details';
            details1.textContent = emp.idade ? `${emp.idade} anos` : '';

            const details2 = document.createElement('div');
            details2.className = 'employee-details';
            details2.textContent = emp.vinculo ? `Em atividade, há ${emp.vinculo}` : '';

            const details3 = document.createElement('div');
            details3.className = 'employee-details';
            details3.textContent = (emp.entrada || '') + (emp.saida ? ` - Sai às ${emp.saida}` : '');

            info.appendChild(name);
            info.appendChild(role);
            if (details1.textContent) info.appendChild(details1);
            if (details2.textContent) info.appendChild(details2);
            if (details3.textContent) info.appendChild(details3);

            card.appendChild(img);
            card.appendChild(info);

            employeesContainer.insertBefore(card, employeesContainer.querySelector('.dashboard-section') || null);
            // If insertion point fails, just append
            if (!card.parentElement) employeesContainer.appendChild(card);
        });

    } catch (err) {
        console.error('Erro ao carregar funcionários para dashboard:', err);
    }
}

async function loadDaycarePets() {
    // Implementação da função loadDaycarePets (inalterada)
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('daycare-tbody');

    if (!tbody) return;

    if (!token) {
        console.warn('Token não encontrado. Não será possível carregar dados do day care.');
        return;
    }

    try {
        const res = await fetch('https://pettzy-backend.onrender.com/api/pets', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            // alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'Login.html';
            return;
        }

        if (!res.ok) throw new Error(`Falha ao obter pets: ${res.status}`);

        const pets = await res.json();
        const toShow = Array.isArray(pets) ? pets.slice(0, 4) : [];

        tbody.innerHTML = '';

        toShow.forEach(pet => {
            const status = (pet.status || '').toLowerCase();
            const statusColor = status === 'green' ? 'green' : status === 'pink' ? 'pink' : 'yellow';
            const statusText = status === 'green' ? 'Finalizado' : status === 'pink' ? 'Urgente' : 'A caminho';

            const tr = document.createElement('tr');

            // Coluna: Pet
            const tdPet = document.createElement('td');
            const divPet = document.createElement('div');
            divPet.className = 'table-pet';

            const indicator = document.createElement('div');
            indicator.className = `table-indicator ${statusColor}`;

            const imgPet = document.createElement('img');
            imgPet.src = pet.foto || 'https://placehold.co/300x200?text=Pet';
            imgPet.alt = pet.nome || 'Pet';
            imgPet.className = 'table-pet-avatar';

            const spanPet = document.createElement('span');
            spanPet.textContent = pet.nome || '-';

            divPet.appendChild(indicator);
            divPet.appendChild(imgPet);
            divPet.appendChild(spanPet);
            tdPet.appendChild(divPet);

            // Coluna: Dono
            const tdOwner = document.createElement('td');
            const divOwner = document.createElement('div');
            divOwner.className = 'table-owner';

            const imgOwner = document.createElement('img');
            imgOwner.src = 'https://placehold.co/300x200?text=Tutor';
            imgOwner.alt = pet.Owner || 'Dono';
            imgOwner.className = 'table-owner-avatar';

            const spanOwner = document.createElement('span');
            spanOwner.textContent = pet.Owner || pet.dono?.nome || '-';

            divOwner.appendChild(imgOwner);
            divOwner.appendChild(spanOwner);
            tdOwner.appendChild(divOwner);

            // Coluna: Chegada
            const tdArrival = document.createElement('td');
            tdArrival.textContent = 'Chega às 09:00'; // Fictício

            // Coluna: Saída
            const tdDeparture = document.createElement('td');
            tdDeparture.textContent = 'Sai às 16:30'; // Fictício

            // Coluna: Status
            const tdStatus = document.createElement('td');
            const divStatus = document.createElement('div');
            divStatus.className = `table-status ${statusColor === 'green' ? 'finalizado' : statusColor === 'pink' ? 'urgente' : 'a-caminho'}`;
            divStatus.textContent = statusText;
            tdStatus.appendChild(divStatus);

            tr.appendChild(tdPet);
            tr.appendChild(tdOwner);
            tr.appendChild(tdArrival);
            tr.appendChild(tdDeparture);
            tr.appendChild(tdStatus);

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Erro ao carregar day care:', err);
    }
}

/**
 * Busca os agendamentos do dia na API e renderiza-os na timeline do dashboard.
 * Presume que há um endpoint: GET /api/agenda/hoje que retorna agendamentos.
 */
async function loadAgendaForDashboard() {
    const token = localStorage.getItem('token');
    const timeline = document.getElementById('agendaTimeline');

    if (!timeline) return;

    // 1. Limpa o timeline antes de preencher
    timeline.innerHTML = '';

    // 2. Cria todos os slots de hora (07:00 até 20:00)
    const startHour = 7;
    const endHour = 20;
    const timeSlots = {}; // Para armazenar os elementos de slot para fácil acesso

    for (let hour = startHour; hour <= endHour; hour++) {
        const timeStr = `${hour < 10 ? '0' : ''}${hour}:00`;

        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';

        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = timeStr;

        const contentDiv = document.createElement('div'); // Contêiner para os appointments
        contentDiv.className = 'slot-content'; // Adicionando classe para estilização

        timeSlot.appendChild(timeLabel);
        timeSlot.appendChild(contentDiv);

        timeline.appendChild(timeSlot);
        timeSlots[timeStr] = contentDiv; // Armazena o div de conteúdo
    }

    if (!token) {
        timeline.innerHTML += '<p style="color: red; padding: 10px;">Token de autenticação não encontrado.</p>';
        return;
    }

    try {
        // 3. Busca dados da Agenda (assumindo endpoint para agendamentos de hoje)
        const res = await fetch('https://pettzy-backend.onrender.com/api/agenda/hoje', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            // alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'Login.html';
            return;
        }

        if (!res.ok) throw new Error(`Falha ao obter agendamentos: ${res.status}`);

        const appointments = await res.json();

        if (!Array.isArray(appointments) || appointments.length === 0) {
            timeline.innerHTML += '<p style="text-align: center; color: #999; margin-top: 20px;">Nenhum agendamento para hoje.</p>';
            return;
        }

        // 4. Renderiza os agendamentos
        appointments.forEach(app => {
            // A dataHora vem do backend no formato ISO (ex: '2025-05-10T10:30:00.000Z')
            const appointmentDate = new Date(app.dataHora);

            // Pega a hora cheia do agendamento (Ex: 10:30:00 -> 10:00)
            const hour = appointmentDate.getHours();
            const hourStr = `${hour < 10 ? '0' : ''}${hour}:00`;

            // Pega a hora e minuto exatos para exibição (Ex: 10:30)
            const appointmentHour = appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            const targetSlot = timeSlots[hourStr];

            if (targetSlot) {
                const colorMap = {
                    'banho': 'blue',
                    'tosa': 'orange',
                    'consulta': 'green',
                    'vacinacao': 'pink'
                };

                // Normaliza o serviço para a chave (ap.servico pode vir como "Banho" ou "banho")
                const serviceKey = app.servico ? app.servico.toLowerCase() : 'outros';
                const color = colorMap[serviceKey] || 'yellow';

                const appointmentDiv = document.createElement('div');
                appointmentDiv.className = `appointment ${color}`;

                const label = document.createElement('div');
                label.className = 'appointment-label';
                // Capitaliza a primeira letra do serviço
                label.textContent = serviceKey.charAt(0).toUpperCase() + serviceKey.slice(1);

                const time = document.createElement('div');
                time.className = 'appointment-time';
                time.textContent = `às ${appointmentHour} (${app.duracao} min)`; // Mostra a duração

                const pet = document.createElement('div');
                pet.className = 'appointment-pet';
                pet.textContent = `Pet: ${app.pet.nome || 'Não Informado'}`;

                const employee = document.createElement('div');
                employee.className = 'appointment-employee';
                employee.textContent = `Func.: ${app.funcionario.nome || 'Não Informado'}`;


                appointmentDiv.appendChild(label);
                appointmentDiv.appendChild(time);
                appointmentDiv.appendChild(pet);
                appointmentDiv.appendChild(employee);

                // Opcional: Adiciona observações como tooltip ou detalhe
                if (app.observacoes) {
                    appointmentDiv.title = `Observações: ${app.observacoes}`;
                }

                // Insere o novo agendamento no contêiner do slot de hora correspondente
                targetSlot.appendChild(appointmentDiv);
            }
        });

    } catch (err) {
        console.error('Erro ao carregar agenda para dashboard:', err);
        timeline.innerHTML += '<p style="color: red; padding: 10px;">Falha ao carregar agendamentos.</p>';
    }
}