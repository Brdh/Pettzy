import mongoose from "mongoose";

const AgendaSchema = new mongoose.Schema({
    data: {
        type: Date,
        required: [true, 'A data e hora do agendamento são obrigatórias.']
    },

    servico: {
        type: String,
        required: [true, 'O tipo de serviço é obrigatório.'],
        enum: ['banho', 'tosa', 'consulta', 'vacinacao'],
        trim: true
    },

    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: [true, 'O Pet é obrigatório.']
    },

    funcionarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'O Funcionário é obrigatório.']
    },

    duracao: {
        type: Number,
        required: [true, 'A duração do serviço é obrigatória.'],
        min: [15, 'A duração mínima é de 15 minutos.']
    },

    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'], // Alinhado com o agenda.js
        default: 'pending'
    },

    observacoes: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

AgendaSchema.index({ data: 1, funcionarioId: 1 }, { unique: true });

export default mongoose.model('Agenda', AgendaSchema);
