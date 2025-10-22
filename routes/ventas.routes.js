import { Router } from "express"
import { readFile, writeFile } from "fs/promises";

const fileVentas = await readFile('./data/ventas.json', 'utf-8');
const ventasData = JSON.parse(fileVentas);

const router = Router();

router.get('/all', (req, res) => {
    res.status(200).json(ventasData)
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