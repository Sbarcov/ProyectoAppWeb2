import { Router } from "express"
import { readFile, writeFile } from "fs/promises";
import { get_user_byId } from "../utils/usuarios.js";

const fileVentas = await readFile('./data/ventas.json', 'utf-8');
const ventasData = JSON.parse(fileVentas);

const router = Router();

router.get('/all', (req, res) => {
    res.status(200).json(ventasData)
});

router.post('/fechas/completo', (req, res) => {
    const desde = req.body.from;
    const hasta = req.body.to;


    try{
        const result = ventasData.filter(e => e.fecha >= desde && e.fecha <= hasta)

        if(result){
            res.status(200).json(result);
        }
        else{
            res.status(400).json('No se encontro ventas registradas en esas fechas');
        }
    }
    catch(error){
        res.send(500).json('Error al buscar ventas');
    }
});

router.post('/fechas/total', (req, res) => {
    const desde = req.body.from;
    const hasta = req.body.to;


    try{
        const arr = ventasData.filter(e => e.fecha >= desde && e.fecha <= hasta)

        const result = arr.map(e =>{
            return{
                cliente : get_user_byId(e.id_usuario).username,
                fecha : e.fecha,
                total : e.total
            }
        });

        if(result){
            res.status(200).json(result);
        }
        else{
            res.status(400).json('No se encontro ventas registradas en esas fechas');
        }
    }
    catch(error){
        res.send(500).json('Error al buscar ventas');
    }
});

router.delete('/delete/:id', (req, res) =>{
    const ventaId = req.params.id;

    try{
        const index = ventasData.findIndex(e => e.id == ventaId)
        if(index !== -1){
            ventasData.splice(index, 1);
            writeFile('./data/ventas.json', JSON.stringify(ventasData, null, 2));
            res.status(200).json('Registro de venta Eliminado');
        }
        else{
            res.status(400).json('No se encontro venta registrada');
        }
    }
    catch(error){
        res.send(500).json('Error al eliminar venta registrada');
    }

 });export default router