import express from 'express';
import cors from 'cors'; /** Se instalo modulo cors */
import dot from "dotenv";
import { readFile, writeFile } from "fs/promises";
import userRouter from './routes/usuarios.routes.js';
import prodRouter from './routes/productos.routes.js';
import ventaRouter from './routes/ventas.routes.js';
dot.config();

const app = express();
const port = process.env.TEST_PORT || 3001;

app.use(cors());
app.use(express.json());

app.listen(port, () =>{
    console.log(`Servidor Activo - Puerto ${port}`)
});

app.use('/usuarios', userRouter);
app.use('/productos', prodRouter);
app.use('/ventas', ventaRouter);


