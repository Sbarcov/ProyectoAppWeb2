/** - Manejo de fechas en Js -   
 import dayjs from "dayjs";

console.log("Chau chau");

const fechaActual = dayjs();

console.log("Formato BD");
console.log(fechaActual.format('YYYY-MM-DD'));
**/

import express from 'express';
import dot from "dotenv";
import { readFile, writeFile } from "fs/promises";
import { write } from 'fs';
dot.config();

const app = express();
const port = process.env.TEST_PORT || 3001;

app.use(express.json());

app.listen(port, () =>{
    console.log(`Servidor Activo - Puerto ${port}`)
});

const file = await readFile('./StoreData/productos.json', 'utf-8');
const productos = JSON.parse(file);

const objetos = [
    {name: 'Auto', color:'Rojo'},
    {name: 'Arbol', color:'Verde'},
    {name: 'Rio', color:'Azul'},
    {name: 'Casa', color:'Amarilla'}
];

const colorDe = (objeto) =>{
    return objeto.find(e => e.name == objeto);
};

/** -- GET -- */
app.get('/colorde/:objeto', (req, res) =>{
    const obj = req.params.objeto;

    /** Forma con map */
    let result = {};
    objetos.map( e =>{
        if (e.name == obj){ result = e}
    });
    /** Forma con find
    const result = objetos.find(e => e.name == obj);
    **/
   
    /** Manejo del response */
    if(result){
       return res.status(200).json(result)
    }else{
      return  res.send(400)
    }

    /** Prueba en postman
     * localhost:3000/colorde/Rio
     */
});

/** -- POST -- */
app.post('/colordepost',(req, res)=>{
    console.log(req.headers.apikey) /** header siempre en minusculas */
    /** console.log(req.headers)  --->  headers sin parametros devuelve todos los headers*/
    const obj = req.body.objeto

    const result = objetos.find(e => e.name == obj);

    if(result){
       return res.status(200).json(result)
    }else{
      return  res.send(400)
    }

        /** Prueba en postman
     * localhost:3000/colordepost
     * body --->  {"objeto":"Rio"}
     * header ---> key: ApiKey(aca puede estar en mayus), value: 123asd
     */

});


/** -- PUT -- */
app.get('/productos', (req, res) => {
    res.status(200).json(productos)
});

app.put('/productos/update/:id', (req, res) => {
    const prodId = req.params.id;
    const prodPrecio = req.body.precio;

    try{
        const index = productos.findIndex(e => e.id == prodId)
        if(index !== -1){
            productos[index].precio = prodPrecio;
            writeFile('./StoreData/productos.json', JSON.stringify(productos));
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

/** Prueba en postman
     * localhost:3000/productos/update/102
     * body --->  {"precio": 25.99}
     */