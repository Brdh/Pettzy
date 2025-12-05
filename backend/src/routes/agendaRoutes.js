import { Router } from 'express';
import { createAgendamento, getAgendamentos, updateAgendamento, deleteAgendamento } from '../controllers/AgendaController.js'; // Importa o Controller

const router = Router();

// POST /api/agenda
router.post('/', createAgendamento);

// GET /api/agenda
router.get('/', getAgendamentos);

// PUT /api/agenda/:id
router.put('/:id', updateAgendamento);

// DELETE /api/agenda/:id
router.delete('/:id', deleteAgendamento);

export default router;