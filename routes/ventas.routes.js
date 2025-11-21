import { Router } from "express"
import { readFile, writeFile } from "fs/promises";
import { get_user_byId } from "../utils/usuarios.js";

const fileVentas = await readFile('./data/ventas.json', 'utf-8');
const ventasData = JSON.parse(fileVentas);

const fileVentasFront = await readFile('./data/ventasFront.json', 'utf-8');
const ventasDataFront = JSON.parse(fileVentasFront);

const router = Router();

/** codigo del modulo 3 */

router.post('/registrar', (req, res) => {

    const numeroOrden = Math.floor(Math.random() * 9000) + 1000;

    const nuevaOrden = {
      ...req.body,
      orden: numeroOrden, /** Simulamos un numero de orden, esta puede ser el id asignado automaticamente al persistir en una bd */
      fecha: new Date().toISOString()

    };

    try{
        ventasDataFront.push(nuevaOrden);
        writeFile('./data/ventasFront.json', JSON.stringify(ventasDataFront, null, 2));
        res.status(200).json('Venta registrada');
    }catch (error){
        res.status(500).json('Error al registrar venta');
    }
})

/** codigo del modulo 1 / modulo 2 */

router.get('/todos', (req, res) => {
    res.status(200).json(ventasData)
});

router.get('/buscar/:id', (req, res) =>{
    const id = parseInt(req.params.id);


    let result = {};
    ventasData.map( e =>{
        if (e.id == id){ result = e}
    });

    if(Object.keys(result).length !== 0){
        res.status(200).json(result);
    }else{
        res.status(400).json(`${id} no encontrado`)
    }
})

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

router.put('/actualizar/:id', (req, res) => {
    const ventaId = req.params.id;
    const usuarioId = req.body.id_usuario;

    try{
        const index = ventasData.findIndex(e => e.id == ventaId)
        if(index !== -1){
            ventasData[index].id_usuario = usuarioId;
            writeFile('./data/ventas.json', JSON.stringify(ventasData, null, 2));
            res.status(200).json('Usuario cambiado en esa venta');
        }
        else{
            res.status(400).json('No se encontro la venta');
        }
    }
    catch(error){
        res.send(500).json('Error al actualizar la venta');
    }
});

router.delete('/eliminar/:id', (req, res) =>{
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