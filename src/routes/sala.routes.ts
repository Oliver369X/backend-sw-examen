import { Router } from 'express';
import { getSalas, createSala, isHostInSala, getUsuariosInSala, updateSala, getSalaById, deleteSala } from '../controllers/sala.controller';

const router = Router();

router.get('/', getSalas);
router.post('/', createSala);
router.get('/:idSala', getSalaById);
router.put('/:idSala', updateSala);
router.delete('/:idSala', deleteSala); // Eliminar sala
router.get('/:idSala/host/:idUsuario', isHostInSala);
router.get('/:idSala/usuarios', getUsuariosInSala);

export default router;
