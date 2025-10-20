import { Router } from "express"

const fileUsuarios = await readFile('./data/usuarios.json', 'utf-8');
const usuariosData = JSON.parse(fileUsuarios);

const router = Router();

router.post('/users/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = usuariosData.find(e => e.nombre === username && e.contraseña === password);

    if(result){
        res.status(200).json (`Bienvenido ${result.nombre} (ID: ${result.id})`)
    }else{
        res.status(400).json(`${username} no encontrado`)
    }
})

router.get('/users/find/:id', (req, res) =>{
    const id = parseInt(req.params.id);

    const result = usuariosData.find(e => e.id === id)

    if(result){
        res.status(200).json(result);
    }else{
        res.status(400).json(`${id} no encontrado`)
    }
})

export default router