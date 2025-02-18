// IMPORTAR LOS MODULOS
const express = require('express');
const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');

const app = express();

// MIDDLEWARE PARA PARSEAR JSON
app.use(express.json());

// USAR LAS RUTAS DE PRODUCTOS Y CARRITOS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// INICIALIZAR SERVIDOR
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});