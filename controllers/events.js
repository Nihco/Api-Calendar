const { response } = require('express')
const Evento = require('../models/Evento')

const getEventos = async (req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name')



    res.json({
        ok: true,
        msg: eventos
    })
}

const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body)

    try {
        evento.user = req.uid;
        const eventoDb = await evento.save()

        res.json({

            ok: true,
            evento: eventoDb
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        })
    }
}

const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid

    try {
        const evento = await Evento.findById(eventoId)

        if (!evento) {
            res.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            })
        }
        //
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true })

        res.json({
            ok: true,
            msg: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        })
    }
}

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid
    try {
        const evento = await Evento.findById(eventoId)

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            })
        }
        //
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de este evento'
            })
        }

        await Evento.findByIdAndDelete(eventoId)
        res.json({
            ok: true
        })

    } catch (error) {

    }


}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
// {
