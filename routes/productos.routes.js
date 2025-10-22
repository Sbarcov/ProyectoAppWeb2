import { Router } from "express"
import { readFile, writeFile } from "fs/promises";

const fileProductos = await readFile('./data/productos.json', 'utf-8');
const productosData = JSON.parse(fileProductos);

const router = Router();

router.get('/all', (req, res) => {
    res.status(200).json(productosData)
});

router.put('/update/:id', (req, res) => {
    const prodId = req.params.id;
    const prodPrecio = req.body.precio;

    try{
        const index = productosData.findIndex(e => e.id == prodId)
        if(index !== -1){
            productosData[index].precio = prodPrecio;
            writeFile('./data/productos.json', JSON.stringify(productosData, null, 2));
            res.status(200).json('Precio Actualizado');
        }
        else{
            res.status(400).json('No se encontro el producto');
        }
    }
    catch(error){
        res.send(500).json('Error al actualizar el precio');
    }
});

export default router