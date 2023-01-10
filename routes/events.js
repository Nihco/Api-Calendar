
const { validarCampos } = require('../middlewares/validar-campos')
const { Router } = require("express");
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require("express-validator");
const { isDate } = require('../helpers/isDate');
const router = Router();
//Events routes

router.use(validarJWT)


//obtener eventos
router.get('/',getEventos)

//Crear un nuevo evento
router.post('/',
    [
        check('title', 'titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos

    ],    crearEvento)

//Actualizar Evento
router.put('/:id', actualizarEvento)

//borrar evento
router.delete('/:id', eliminarEvento)

module.exports = router