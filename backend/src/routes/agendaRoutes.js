import { Router } from 'express';
import { createAgendamento, getAgendamentos, updateAgendamento, deleteAgendamento, getAgendamentosDoDia } from '../controllers/AgendaController.js';

const router = Router();

// POST /api/agenda
router.post('/', createAgendamento);

// GET /api/agenda
router.get('/', getAgendamentos);

// GET /api/agenda/hoje - Para o dashboard
router.get('/hoje', getAgendamentosDoDia);

// PUT /api/agenda/:id
router.put('/:id', updateAgendamento);

// DELETE /api/agenda/:id
router.delete('/:id', deleteAgendamento);

export default router;