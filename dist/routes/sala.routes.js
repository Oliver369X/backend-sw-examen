"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sala_controller_1 = require("../controllers/sala.controller");
const router = (0, express_1.Router)();
router.get('/', sala_controller_1.getSalas);
router.post('/', sala_controller_1.createSala);
router.get('/:idSala', sala_controller_1.getSalaById);
router.put('/:idSala', sala_controller_1.updateSala);
router.delete('/:idSala', sala_controller_1.deleteSala); // Eliminar sala
router.get('/:idSala/host/:idUsuario', sala_controller_1.isHostInSala);
router.get('/:idSala/usuarios', sala_controller_1.getUsuariosInSala);
exports.default = router;
