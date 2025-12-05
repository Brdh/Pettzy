// Agenda Application
class AgendaApp {
    // URL base da sua API
    API_URL = 'http://localhost:3000/api/agenda';
    // URLs para buscar as referências
    PETS_URL = 'http://localhost:3000/api/pets';
    FUNCIONARIOS_URL = 'http://localhost:3000/api/employees';

    constructor() {
        this.currentDate = new Date(); // Inicia com a data atual
        this.viewMode = 'week';
        this.events = []; // Agora carregado da API
        this.pets = []; // Lista de pets para o modal
        this.funcionarios = []; // Lista de funcionários para o modal
        this.init();
    }

    async init() {
        this.setupEventListeners();
        // 1. Carrega dados iniciais da API
        await this.loadInitialData();
        if (typeof this.render === 'function') this.render();
    }

    setupEventListeners() {
        // ... (Seus event listeners existentes)
        $('#prevBtn').on('click', () => { this.previousPeriod(); this.render(); });
        $('#nextBtn').on('click', () => { this.nextPeriod(); this.render(); });
        $('#dayBtn').on('click', () => this.setViewMode('day'));
        $('#weekBtn').on('click', () => this.setViewMode('week'));
        $('#monthBtn').on('click', () => this.setViewMode('month'));
        $('.btn-novo-agendamento').on('click', () => this.openModal());
        $('#closeModalBtn').on('click', () => this.closeModal());
        $('#cancelEventBtn').on('click', () => this.closeModal());
        $('#eventForm').on('submit', (e) => this.handleEventSubmit(e));
        $('#eventModal').on('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.closeModal();
            }
        });
        $('#searchInput').on('keyup', () => this.filterEvents());
        $('#mobile_btn').on('click', () => this.toggleMobileMenu());
    }

    toggleMobileMenu() {
        $('#mobile_menu').toggleClass('active');
    }

    // 🔄 NOVO: Carrega Pets, Funcionários e Eventos da API
    async loadInitialData() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Usuário não autenticado. Redirecionando para login.');
                window.location.href = 'Login.html';
                return;
            }
            // Requisição 1: Pets
            const petsResponse = await fetch(this.PETS_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (petsResponse.status === 401) {
                localStorage.removeItem('token');
                alert('Sessão expirada. Faça login novamente.');
                window.location.href = 'Login.html';
                return;
            }
            this.pets = await petsResponse.json();

            // Requisição 2: Funcionários (Você precisará criar esta rota e controller no backend)
            const funcsResponse = await fetch(this.FUNCIONARIOS_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (funcsResponse.status === 401) {
                localStorage.removeItem('token');
                alert('Sessão expirada. Faça login novamente.');
                window.location.href = 'Login.html';
                return;
            }
            this.funcionarios = await funcsResponse.json();

            // Requisição 3: Eventos
            await this.fetchEvents(token);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            alert('Não foi possível carregar os dados da API. Verifique o console.');
        }
    }

    // 🔄 NOVO: Busca Agendamentos na API
    async fetchEvents() {
        try {
            // Se receber um token por parâmetro (ou buscar do localStorage)
            const token = arguments[0] || localStorage.getItem('token');
            const response = await fetch(this.API_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                alert('Sessão expirada. Faça login novamente.');
                window.location.href = 'Login.html';
                return;
            }
            if (!response.ok) throw new Error('Erro ao buscar agendamentos.');

            const data = await response.json();
            // Mapeia os dados brutos da API para o formato esperado pelo frontend
            // Normaliza campos úteis: start (Date), end (Date), isoDate (YYYY-MM-DD)
            this.events = data.map(event => {
                const start = event.date ? new Date(event.date) : null;
                const durationMin = Number(event.duration) || 0;
                const end = start ? new Date(start.getTime() + durationMin * 60000) : null;
                const isoDate = start ? start.toISOString().split('T')[0] : null;
                const time = event.time || (start ? start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '');

                return {
                    id: event.id,
                    pet: event.pet, // Nome do Pet (populado pelo backend)
                    funcionario: event.funcionario, // Nome do Funcionário (populado pelo backend)
                    service: event.service,
                    // start/end como Date para facilitar comparações
                    start,
                    end,
                    isoDate,
                    time,
                    duration: durationMin,
                    status: event.status,
                    notes: event.notes,
                    raw: event // guarda original para depuração
                };
            });

            if (typeof this.render === 'function') this.render(); // Renderiza após carregar os dados
            // Também atualiza a lista simples de próximos eventos (sidebar)
            if (typeof this.renderEventsList === 'function') this.renderEventsList();
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            // Poderia mostrar uma mensagem de erro na interface
        }
    }

    // Método para ser chamado após navegação de período
    async updatePeriod() {
        // No momento, recarregamos todos os eventos, mas o ideal seria
        // filtrar os eventos no backend (ex: GET /api/agenda?start=X&end=Y)
        await this.fetchEvents();
        this.render();
    }

    // ... (Seus métodos getWeekDays, getMonthDays, formatDate, etc. continuam os mesmos) ...

    setViewMode(mode) {
        this.viewMode = mode;
        // Update button states
        $('#dayBtn').toggleClass('active', mode === 'day');
        $('#weekBtn').toggleClass('active', mode === 'week');
        $('#monthBtn').toggleClass('active', mode === 'month');
        this.render();
    }

    previousPeriod() {
        if (this.viewMode === 'day') {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        } else if (this.viewMode === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
        } else if (this.viewMode === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        }
        this.updatePeriod();
    }

    nextPeriod() {
        if (this.viewMode === 'day') {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        } else if (this.viewMode === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
        } else if (this.viewMode === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.updatePeriod();
    }

    // ... (Seus métodos de formatação, getEventsForDate, getEventsForTimeSlot continuam os mesmos) ...
    // ... (Seus métodos renderWeekView, renderDayView, renderMonthView, renderDayHeaders, renderDaysGrid, renderMonthGrid continuam os mesmos) ...
    // ... (Seus métodos renderEventsList, filterEvents, getStatusColor, getStatusLabel, isToday continuam os mesmos) ...

    // Render dispatcher (defensivo caso as funções específicas não estejam implementadas)
    render() {
        try {
            if (this.viewMode === 'day' && typeof this.renderDayView === 'function') {
                return this.renderDayView();
            }
            if (this.viewMode === 'week' && typeof this.renderWeekView === 'function') {
                return this.renderWeekView();
            }
            if (this.viewMode === 'month' && typeof this.renderMonthView === 'function') {
                return this.renderMonthView();
            }
            // fallback: if none of the specific renderers exist, try generic renderEventsList
            if (typeof this.renderEventsList === 'function') {
                return this.renderEventsList();
            }
            // no-op if nothing implemented yet
            return;
        } catch (err) {
            console.error('Erro em render():', err);
        }
    }

    // --- Helpers e renderização do calendário (versão simples) ---
    formatDateShort(date) {
        const options = { weekday: 'short', day: '2-digit', month: 'short' };
        try {
            return date.toLocaleDateString('pt-BR', options);
        } catch (e) {
            return '';
        }
    }

    getWeekDays() {
        const days = [];
        const start = new Date(this.currentDate);
        // Ajusta para começar na segunda-feira
        const day = start.getDay(); // 0 (Sun) - 6 (Sat)
        const diffToMonday = (day + 6) % 7; // 0=>Mon, 6=>Sun
        start.setDate(start.getDate() - diffToMonday);

        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    }

    getEventsForDate(date) {
        if (!date) return [];
        const iso = date.toISOString().split('T')[0];
        return this.events.filter(ev => ev.isoDate === iso);
    }

    renderDayHeaders() {
        const container = $('#dayHeaders');
        if (!container.length) return;
        container.empty();

        const days = this.getWeekDays();
        days.forEach(d => {
            const div = $(`<div class="day-header">${this.formatDateShort(d)}</div>`);
            container.append(div);
        });
    }

    renderDaysGrid() {
        const grid = $('#daysGrid');
        if (!grid.length) return;
        grid.empty();

        const days = this.getWeekDays();
        days.forEach(d => {
            const col = $(`<div class="day-column"></div>`);
            const dateLabel = $(`<div class="day-column-date">${d.toLocaleDateString('pt-BR')}</div>`);
            col.append(dateLabel);

            const events = this.getEventsForDate(d);
            if (events.length === 0) {
                col.append('<div class="no-events">—</div>');
            } else {
                events.forEach(ev => {
                    const evTime = ev.time || (ev.start ? ev.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '');
                    const evHtml = $(`<div class="calendar-event">
                        <div class="calendar-event-time">${evTime}</div>
                        <div class="calendar-event-info">
                            <div class="calendar-event-pet">${ev.pet || 'Pet'}</div>
                            <div class="calendar-event-service">${ev.service || ''}</div>
                        </div>
                    </div>`);
                    col.append(evHtml);
                });
            }

            grid.append(col);
        });
    }

    renderWeekView() {
        // Atualiza header e grades
        this.renderDayHeaders();
        this.renderDaysGrid();
    }

    openModal() {
        $('#eventModal').addClass('active');
        const today = new Date().toISOString().split('T')[0];
        $('#eventDate').val(today);

        // 🔄 NOVO: Popular os Selects
        this.populatePetSelect();
        this.populateFuncionarioSelect();
    }

    populatePetSelect() {
        const petSelect = $('#petName');
        petSelect.empty().append('<option value="">Selecione um Pet</option>');
        this.pets.forEach(pet => {
            petSelect.append(`<option value="${pet._id}">${pet.nome}</option>`);
        });
    }

    populateFuncionarioSelect() {
        const funcSelect = $('#funcionarioId'); // NOVO ID: Adicione este select no seu HTML
        funcSelect.empty().append('<option value="">Selecione um Funcionário</option>');
        this.funcionarios.forEach(func => {
            funcSelect.append(`<option value="${func._id}">${func.nome}</option>`);
        });
    }

    closeModal() {
        $('#eventModal').removeClass('active');
        $('#eventForm')[0].reset();
    }

    // 🚀 NOVO: Envio de Dados para a API
    async handleEventSubmit(e) {
        e.preventDefault();

        const dataInput = $('#eventDate').val();
        const timeInput = $('#eventTime').val();

        // Combina Data e Hora para o formato ISO Date exigido pelo Backend
        const combinedDateTime = new Date(`${dataInput}T${timeInput}:00`);

        // CUIDADO: O campo petName do HTML agora deve guardar o ID do Pet
        const petId = $('#petName').val();

        // NOVO CAMPO: ID do Funcionário
        const funcionarioId = $('#funcionarioId').val();

        const newEventData = {
            petId: petId,
            funcionarioId: funcionarioId, // OBRIGATÓRIO no seu esquema
            servico: $('#serviceType').val(), // 'servico' é o nome no Schema
            data: combinedDateTime.toISOString(), // Envia como ISO Date string
            duracao: parseInt($('#eventDuration').val()), // 'duracao' é o nome no Schema
            observacoes: $('#eventNotes').val(), // 'observacoes' é o nome no Schema
            status: 'pending' // Começa como pendente
        };

        if (!petId || !funcionarioId) {
            alert('Por favor, selecione um Pet e um Funcionário.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(newEventData),
            });

            const result = await response.json();

            if (response.ok) {
                this.closeModal();
                await this.fetchEvents(); // Recarrega os eventos para incluir o novo
                alert('Agendamento criado com sucesso!');
            } else {
                // Trata erros de validação/conflito do backend
                alert(`Erro ao criar agendamento: ${result.message || 'Verifique os dados.'}`);
            }
        } catch (error) {
            console.error('Erro na comunicação com a API:', error);
            alert('Erro de conexão ao salvar agendamento.');
        }
    }

    // Simples render para o sidebar de próximos eventos — útil para debug e confirmação
    renderEventsList() {
        try {
            const container = $('#eventsList');
            if (!container.length) return;

            container.empty();

            const upcoming = this.events
                .filter(ev => ev.start)
                .sort((a, b) => a.start - b.start)
                .slice(0, 10);

            if (upcoming.length === 0) {
                container.append('<p>Nenhum agendamento encontrado.</p>');
                return;
            }

            upcoming.forEach(ev => {
                const time = ev.time || (ev.start ? ev.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-');
                const date = ev.isoDate || (ev.start ? ev.start.toLocaleDateString('pt-BR') : '-');
                const pet = ev.pet || 'Pet indisponível';
                const service = ev.service || '-';

                const item = $(
                    `<div class="event-item">
                        <strong>${pet}</strong>
                        <div class="event-meta">${date} • ${time} • ${service}</div>
                    </div>`
                );

                container.append(item);
            });
        } catch (err) {
            console.error('Erro em renderEventsList:', err);
        }
    }
}

// Initialize the app when DOM is ready
$(document).ready(function () {
    new AgendaApp();
});