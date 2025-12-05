import Agenda from "../models/AgendaModel.js";

// Create (POST)
export async function createAgendamento(req, res) {
    try {
        const { data, servico, petId, funcionarioId, duracao } = req.body;

        if (!data || !servico || !petId || !funcionarioId || !duracao) {
            return res.status(400).send({ message: "Dados incompletos. Todos os campos obrigatórios devem ser preenchidos." });
        }

        const novaDataInicio = new Date(data);
        if (isNaN(novaDataInicio)) {
            return res.status(400).send({ message: 'Data inválida.' });
        }

        const duracaoNum = Number(duracao);
        if (!Number.isFinite(duracaoNum) || duracaoNum < 15) {
            return res.status(400).send({ message: 'Duração inválida. Mínimo de 15 minutos.' });
        }

        const novaDataFim = new Date(novaDataInicio.getTime() + duracaoNum * 60000);

        // Buscar possíveis agendamentos do mesmo funcionário cujo início seja antes do fim do novo agendamento
        const possiveisConflitos = await Agenda.find({
            funcionarioId: funcionarioId,
            status: { $ne: 'cancelled' },
            data: { $lt: novaDataFim }
        });

        const conflito = possiveisConflitos.find(ev => {
            const evStart = new Date(ev.data);
            const evEnd = new Date(evStart.getTime() + ev.duracao * 60000);
            return evEnd > novaDataInicio && evStart < novaDataFim;
        });

        if (conflito) {
            return res.status(400).send({ message: "Conflito: Este funcionário já possui outro agendamento que se sobrepõe a esse horário.", conflictWith: conflito._id });
        }

        const novoAgendamento = new Agenda({
            data: novaDataInicio,
            servico,
            petId,
            funcionarioId,
            duracao: duracaoNum,
            observacoes: req.body.observacoes || ''
        });

        await novoAgendamento.save();
        res.status(201).send(novoAgendamento);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ message: "Conflito: Este funcionário já possui outro agendamento neste horário exato de início." });
        }
        console.error('Erro ao criar agendamento:', error);
        res.status(400).send({ message: 'Erro ao criar agendamento', details: error.message });
    }
}

// Read (GET)
export async function getAgendamentos(req, res) {
    try {
        const agendamentos = await Agenda.find({})
            .populate('petId', 'nome')
            .populate('funcionarioId', 'nome');

        const formattedAgendamentos = agendamentos.map(agendamento => ({
            id: agendamento._id,
            pet: agendamento.petId ? agendamento.petId.nome : 'Pet Deletado',
            service: agendamento.servico,
            funcionario: agendamento.funcionarioId ? agendamento.funcionarioId.nome : 'Func. Deletado',
            date: agendamento.data,
            time: agendamento.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            duration: agendamento.duracao,
            status: agendamento.status,
            notes: agendamento.observacoes,
        }));

        res.status(200).send(formattedAgendamentos);
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        res.status(500).send({ message: 'Erro ao buscar agendamentos.' });
    }
}

// Update (PUT)
export async function updateAgendamento(req, res) {
    try {
        const agendamento = await Agenda.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!agendamento) {
            return res.status(404).send({ message: "Agendamento não encontrado." });
        }

        res.status(200).send(agendamento);
    } catch (error) {
        res.status(400).send({ message: 'Erro ao atualizar agendamento', details: error.message });
    }
}

// Delete (DELETE)
export async function deleteAgendamento(req, res) {
    try {
        const agendamento = await Agenda.findByIdAndDelete(req.params.id);

        if (!agendamento) {
            return res.status(404).send({ message: "Agendamento não encontrado." });
        }

        res.status(200).send({ message: "Agendamento deletado com sucesso." });
    } catch (error) {
        res.status(500).send({ message: 'Erro ao deletar agendamento' });
    }
}

// Read (GET) para agendamentos do dia
export async function getAgendamentosDoDia(req, res) {
    try {
        // 1. Calcular o início de hoje (00:00:00)
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // 2. Calcular o início de amanhã (23:59:59 de hoje + 1 milissegundo)
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);

        const agendamentos = await Agenda.find({
            // Busca agendamentos entre [hoje 00:00] e [amanhã 00:00]
            data: {
                $gte: hoje,
                $lt: amanha
            },
            status: { $ne: 'cancelled' } // Ignora agendamentos cancelados
        })
            .populate('petId', 'nome') // Popula apenas o nome do pet
            .populate('funcionarioId', 'nome') // Popula apenas o nome do funcionário
            .sort({ data: 1 }); // Ordena por hora para a timeline

        const formattedAgendamentos = agendamentos.map(agendamento => ({
            id: agendamento._id,
            pet: {
                id: agendamento.petId?._id,
                nome: agendamento.petId ? agendamento.petId.nome : 'Pet Deletado'
            },
            servico: agendamento.servico,
            funcionario: {
                id: agendamento.funcionarioId?._id,
                nome: agendamento.funcionarioId ? agendamento.funcionarioId.nome : 'Func. Deletado'
            },
            // A dataHora será usada pelo frontend para extrair hora (Ex: '2025-05-10T10:00:00.000Z')
            dataHora: agendamento.data,
            duracao: agendamento.duracao, // Duração em minutos
            status: agendamento.status,
            observacoes: agendamento.observacoes,
        }));

        res.status(200).send(formattedAgendamentos);
    } catch (error) {
        console.error('Erro ao listar agendamentos do dia:', error);
        res.status(500).send({ message: 'Erro ao buscar agendamentos do dia.' });
    }
}