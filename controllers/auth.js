const { response } = require('express')
// const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }
        usuario = new Usuario(req.body)

        //encriptar pass
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save()

        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        // const errors = validationResult(req)

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el admin'
        })
    }
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body
    try {

        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }

        const validPassowrd = bcrypt.compareSync(password, usuario.password)
        if (!validPassowrd) {
            return res.status(400).json({
                ok: false,
                msg: 'Passowrd incorrecto'
            })
        }

        const token = await generarJWT(usuario.id, usuario.name)
        //generar nuestro jwt
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

};

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req;

    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        token
    })
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}