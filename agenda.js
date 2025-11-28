// Agenda Application
class AgendaApp {
    constructor() {
        this.currentDate = new Date(2025, 4, 1); // May 1, 2025
        this.viewMode = 'week'; // 'day', 'week', 'month'
        this.events = this.initializeEvents();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Navigation buttons
        $('#prevBtn').on('click', () => this.previousPeriod());
        $('#nextBtn').on('click', () => this.nextPeriod());

        // View mode buttons
        $('#dayBtn').on('click', () => this.setViewMode('day'));
        $('#weekBtn').on('click', () => this.setViewMode('week'));
        $('#monthBtn').on('click', () => this.setViewMode('month'));

        // New event button
        $('.btn-novo-agendamento').on('click', () => this.openModal());

        // Modal controls
        $('#closeModalBtn').on('click', () => this.closeModal());
        $('#cancelEventBtn').on('click', () => this.closeModal());
        $('#eventForm').on('submit', (e) => this.handleEventSubmit(e));

        // Close modal on outside click
        $('#eventModal').on('click', (e) => {
            if (e.target.id === 'eventModal') {
                this.closeModal();
            }
        });

        // Search functionality
        $('#searchInput').on('keyup', () => this.filterEvents());

        // Mobile menu toggle
        $('#mobile_btn').on('click', () => this.toggleMobileMenu());
    }

    toggleMobileMenu() {
        $('#mobile_menu').toggleClass('active');
    }

    initializeEvents() {
        return [
            {
                id: 1,
                pet: 'Rex',
                service: 'Banho',
                date: new Date(2025, 4, 8),
                time: '10:00',
                duration: 60,
                status: 'confirmed',
                notes: 'Perca pouca suavidade de alergia'
            },
            {
                id: 2,
                pet: 'Luna',
                service: 'Tosa',
                date: new Date(2025, 4, 5),
                time: '14:00',
                duration: 90,
                status: 'confirmed',
                notes: 'Tosa completa'
            },
            {
                id: 3,
                pet: 'Max',
                service: 'Consulta Veterinária',
                date: new Date(2025, 4, 7),
                time: '11:00',
                duration: 30,
                status: 'pending',
                notes: 'Checkup geral'
            },
            {
                id: 4,
                pet: 'Bella',
                service: 'Vacinação',
                date: new Date(2025, 4, 9),
                time: '15:00',
                duration: 20,
                status: 'confirmed',
                notes: 'Vacina anual'
            },
            {
                id: 5,
                pet: 'Charlie',
                service: 'Banho',
                date: new Date(2025, 4, 6),
                time: '09:00',
                duration: 60,
                status: 'confirmed',
                notes: 'Banho simples'
            }
        ];
    }

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
        this.render();
    }

    nextPeriod() {
        if (this.viewMode === 'day') {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        } else if (this.viewMode === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
        } else if (this.viewMode === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.render();
    }

    getWeekDays() {
        const startDate = new Date(this.currentDate);
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    }

    getMonthDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    }

    formatDate(date) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    }

    formatDateRange(startDate, endDate) {
        const start = `${startDate.getDate()}, ${this.getMonthName(startDate.getMonth())}`;
        const end = `${endDate.getDate()}, ${this.getMonthName(endDate.getMonth())} ${endDate.getFullYear()}`;
        return `${start} - ${end}`;
    }

    getMonthName(monthIndex) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return months[monthIndex];
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            return event.date.toDateString() === date.toDateString();
        });
    }

    getEventsForTimeSlot(date, hour) {
        return this.getEventsForDate(date).filter(event => {
            const eventHour = parseInt(event.time.split(':')[0]);
            return eventHour === hour;
        });
    }

    render() {
        if (this.viewMode === 'week') {
            this.renderWeekView();
        } else if (this.viewMode === 'day') {
            this.renderDayView();
        } else if (this.viewMode === 'month') {
            this.renderMonthView();
        }
    }

    renderWeekView() {
        const days = this.getWeekDays();
        const endDate = new Date(days[6]);

        // Update date display
        $('#currentDate').text(this.formatDateRange(days[0], endDate));

        // Render day headers
        this.renderDayHeaders(days);

        // Render days grid
        this.renderDaysGrid(days);

        // Render events list
        this.renderEventsList();
    }

    renderDayView() {
        const days = [new Date(this.currentDate)];
        
        // Update date display
        $('#currentDate').text(this.formatDate(days[0]));

        // Render day headers
        this.renderDayHeaders(days);

        // Render days grid
        this.renderDaysGrid(days);

        // Render events list
        this.renderEventsList();
    }

    renderMonthView() {
        const days = this.getMonthDays();
        const monthName = this.getMonthName(this.currentDate.getMonth());
        const year = this.currentDate.getFullYear();

        // Update date display
        $('#currentDate').text(`${monthName} ${year}`);

        // Render day headers (abbreviated)
        const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        const headerHTML = weekDays.map(day => 
            `<div class="day-header"><div>${day}</div></div>`
        ).join('');
        $('#dayHeaders').html(headerHTML);

        // Render month grid
        this.renderMonthGrid(days);

        // Render events list
        this.renderEventsList();
    }

    renderDayHeaders(days) {
        const headerHTML = days.map(date => {
            const isToday = this.isToday(date);
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
            const dayNum = date.getDate();
            const monthName = this.getMonthName(date.getMonth());

            return `
                <div class="day-header ${isToday ? 'today' : ''}">
                    <div>${dayName}</div>
                    <span class="day-header-date">${dayNum} ${monthName}</span>
                </div>
            `;
        }).join('');

        $('#dayHeaders').html(headerHTML);
    }

    renderDaysGrid(days) {
        const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00
        const daysGridHTML = days.map(date => {
            const isToday = this.isToday(date);
            return `
                <div class="day-column ${isToday ? 'today' : ''}">
                    ${hours.map(hour => {
                        const events = this.getEventsForTimeSlot(date, hour);
                        const eventsHTML = events.map(event => 
                            `<div class="event-item ${event.status}" title="${event.pet} - ${event.service}">
                                <div>${event.pet}</div>
                                <div class="event-time">${event.time}</div>
                            </div>`
                        ).join('');
                        return `<div class="day-slot">${eventsHTML}</div>`;
                    }).join('')}
                </div>
            `;
        }).join('');

        $('#daysGrid').html(daysGridHTML);
    }

    renderMonthGrid(days) {
        const firstDay = new Date(days[0].getFullYear(), days[0].getMonth(), 1).getDay();
        const gridHTML = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            gridHTML.push('<div class="day-slot"></div>');
        }

        // Add day cells
        days.forEach(date => {
            const events = this.getEventsForDate(date);
            const isToday = this.isToday(date);
            const eventsHTML = events.slice(0, 2).map(event =>
                `<div class="event-item ${event.status}" title="${event.pet} - ${event.service}">
                    ${event.pet}
                </div>`
            ).join('');

            gridHTML.push(`
                <div class="day-slot ${isToday ? 'today' : ''}">
                    <div style="font-weight: 600; margin-bottom: 4px;">${date.getDate()}</div>
                    ${eventsHTML}
                    ${events.length > 2 ? `<div style="font-size: 10px; color: #999;">+${events.length - 2} mais</div>` : ''}
                </div>
            `);
        });

        // Create grid container
        const gridContainer = $('<div></div>')
            .css({
                'display': 'grid',
                'grid-template-columns': 'repeat(7, 1fr)',
                'gap': '1px',
                'background-color': '#e0e0e0',
                'padding': '1px',
                'border-radius': '8px',
                'overflow': 'hidden'
            })
            .html(gridHTML.join(''));

        $('#daysGrid').html(gridContainer);
    }

    renderEventsList() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        const filteredEvents = this.events
            .filter(event => {
                const matchesSearch = !searchTerm || 
                    event.pet.toLowerCase().includes(searchTerm) ||
                    event.service.toLowerCase().includes(searchTerm);
                return matchesSearch;
            })
            .sort((a, b) => a.date - b.date);

        const eventsHTML = filteredEvents.map(event => `
            <div class="event-card">
                <div class="event-card-title">${event.pet} - ${event.service}</div>
                <div class="event-card-meta">
                    ${event.date.toLocaleDateString('pt-BR')} às ${event.time}
                </div>
                <div class="event-card-meta" style="margin-top: 4px;">
                    Status: <span style="color: ${this.getStatusColor(event.status)}; font-weight: 600;">
                        ${this.getStatusLabel(event.status)}
                    </span>
                </div>
            </div>
        `).join('');

        $('#eventsList').html(eventsHTML || '<p style="color: #999; text-align: center; padding: 20px;">Nenhum evento encontrado</p>');
    }

    filterEvents() {
        this.renderEventsList();
    }

    getStatusColor(status) {
        const colors = {
            confirmed: '#5b814b',
            pending: '#fbc02d',
            cancelled: '#d84315'
        };
        return colors[status] || '#999';
    }

    getStatusLabel(status) {
        const labels = {
            confirmed: 'Confirmado',
            pending: 'Pendente',
            cancelled: 'Cancelado'
        };
        return labels[status] || status;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    openModal() {
        $('#eventModal').addClass('active');
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        $('#eventDate').val(today);
    }

    closeModal() {
        $('#eventModal').removeClass('active');
        $('#eventForm')[0].reset();
    }

    handleEventSubmit(e) {
        e.preventDefault();

        const newEvent = {
            id: this.events.length + 1,
            pet: $('#petName').val(),
            service: $('#serviceType').val(),
            date: new Date($('#eventDate').val()),
            time: $('#eventTime').val(),
            duration: parseInt($('#eventDuration').val()),
            status: 'confirmed',
            notes: $('#eventNotes').val()
        };

        this.events.push(newEvent);
        this.closeModal();
        this.render();

        // Show success message
        alert('Agendamento criado com sucesso!');
    }
}

// Initialize the app when DOM is ready
$(document).ready(function() {
    new AgendaApp();
});