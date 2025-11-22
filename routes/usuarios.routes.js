import { Router } from "express"
import { readFile, writeFile } from "fs/promises";
import { get_user_byId } from "../utils/usuarios.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { decodeToken } from "../utils/middleware.js"
import { log } from "console";
import { stat } from "fs";

const fileUsuarios = await readFile('./data/usuarios.json', 'utf-8');
const usuariosData = JSON.parse(fileUsuarios);

const SECRET = "IkGjdS3DQytluc6orOxdnCe5xByR4RlHwed06ylaed-rbJD9QWDGlfBvcq2IvVKu"

const router = Router();

/** codigo de modulo 4 */ /** USUARIO Y CONTRASEÑA DE PRUEBA "email": "seba@hotmail.com", "password": "test123" */

router.post('/createbc', (req, res) =>{
    const {id, username, apellido, email, password, direccion} = req.body

    try{

        const hashedPass = bcrypt.hashSync(password, 8)

        const id = usuariosData.length > 0 ? usuariosData[usuariosData.length-1].id + 1 : 1

        usuariosData.push({id, username, apellido, email, password:hashedPass, direccion});

        writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2));

        res.status(200).json('Usuario creado');
    
    }catch(error){

        console.log(error)
        res.status(400).json({status:false});
    }

})

router.post('/loginbc', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const result = usuariosData.find(e => e.email === email);

    if(!result){
        res.status(400).json({status:false})
    }

    const controlPass = bcrypt.compareSync(password, result.password)
    console.log(controlPass)

    if (!controlPass){
        res.status(401).json({status:false})
    }

    const token = jwt.sign({ ...result}, SECRET, {expiresIn: 86400})

    res.status(200).json(token)

})

/** Codigo del modulo 3 */

router.post('/loginfront', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const result = usuariosData.find(e => e.email === email && e.password === password);

    if (result) {

        res.status(200).json({
            username: result.username,
            apellido: result.apellido,
            email: result.email,
            direccion: result.direccion
        });
    } else {
        res.status(400).json({ error: `${email} no encontrado` });
    }
});


/** Codigo del modulo 1 / modulo 2 */

router.get('/buscar/:id', (req, res) =>{
    const id = parseInt(req.params.id);

    const result = get_user_byId(id)

    if(result){
        res.status(200).json(result);
    }else{
        res.status(400).json(`${id} no encontrado`)
    }
})

router.get('/todos', (req, res) => {

    const result = usuariosData.map(e =>{
            return{
                username : e.username,
                apellido : e.apellido,
                email : e.email
            }
        });


    try{
        res.status(200).json(result);
    }catch (error){
        res.status(500).json('Error al listar usuarios');
    }
})

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = usuariosData.find(e => e.username === username && e.password === password);

    if(result){
        res.status(200).json (`Bienvenido ${result.username} (ID: ${result.id})`)
    }else{
        res.status(400).json(`${username} no encontrado`)
    }
})

router.post('/nuevo', (req, res) => {

    const id = req.body.id;
    const username = req.body.username;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const password = req.body.password;

    const result =  {
                id : id,
                username : username,
                apellido : apellido,
                email : email,
                password : password
            };

    try{
        usuariosData.push(result);
        writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2));
        res.status(200).json('Usuario creado');
    }catch (error){
        res.status(500).json('Error al crear usuario');
    }
})

router.put('/actualizar/:id', (req, res) => {
    const userId = req.params.id;
    const userEmail = req.body.email;

    try{
        const index = usuariosData.findIndex(e => e.id == userId)
        if(index !== -1){
            usuariosData[index].email = userEmail;
            writeFile('./data/usuarios.json', JSON.stringify(usuariosData, null, 2));
            res.status(200).json('Email Actualizado');
        }
        else{
            res.status(400).json('No se encontro al usuario ');
        }
    }
    catch(error){
        res.send(500).json('Error al actualizar usuario');
    }
});

export default router 