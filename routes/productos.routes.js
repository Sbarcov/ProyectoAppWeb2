import { Router } from "express"
import { readFile, writeFile } from "fs/promises";


const fileProductos = await readFile('./data/productos.json', 'utf-8');
const productosData = JSON.parse(fileProductos);

const router = Router();

/** CÓDIGO DEL MODULO 3*/

const fileProductosFront = await readFile('./data/productosFront.json', 'utf-8');
const productosFrontData = JSON.parse(fileProductosFront);

const fileCategoriasFront = await readFile('./data/categoriasFront.json', 'utf-8');
const CategoriasFrontData = JSON.parse(fileCategoriasFront);

router.get('/allproducts', (req, res) => {
    res.status(200).json(productosFrontData)
});

router.get('/allcategories', (req, res) => {
    res.status(200).json(CategoriasFrontData)
});

/** CÓDIGO DEL MODULO 1 / MODULO 2 */

router.get('/todos', (req, res) => {
    res.status(200).json(productosData)
});

router.get('/buscar/:id', (req, res) =>{
    const id = parseInt(req.params.id);


    let result = {};
    productosData.map( e =>{
        if (e.id == id){ result = e}
    });

    if(Object.keys(result).length !== 0){
        res.status(200).json(result);
    }else{
        res.status(400).json(`${id} no encontrado`)
    }
})

router.post('/nuevo', (req, res) => {

    const id = req.body.id;
    const nombre = req.body.nombre;
    const desc = req.body.desc;
    const precio = req.body.precio;
    const imagen = req.body.imagen;

    const result =  {
                id : id,
                nombre : nombre,
                desc : desc,
                precio : precio,
                imagen : imagen
            };

    try{
        productosData.push(result);
        writeFile('./data/productos.json', JSON.stringify(productosData, null, 2));
        res.status(200).json('Producto creado');
    }catch (error){
        res.status(500).json('Error al crear producto');
    }
})

router.post('/nuevo/autorizado', (req, res) => {

    const header = req.header('clave');

    if (!header || header !== '123abc') {
    return res.status(401).json({ error: 'Acceso no autorizado. header requerido o inválido.' });
  }

    const id = req.body.id;
    const nombre = req.body.nombre;
    const desc = req.body.desc;
    const precio = req.body.precio;
    const imagen = req.body.imagen;

    const result =  {
                id : id,
                nombre : nombre,
                desc : desc,
                precio : precio,
                imagen : imagen
            };

    try{
        productosData.push(result);
        writeFile('./data/productos.json', JSON.stringify(productosData, null, 2));
        res.status(200).json('Producto creado');
    }catch (error){
        res.status(500).json('Error al crear producto');
    }
})

router.put('/actualizar/:id', (req, res) => {
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