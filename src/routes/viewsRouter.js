const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const productManager = new ProductManager();


// Ruta para la página principal
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts(); // Obtener los productos
        res.render('home', { products }); // Renderizar la vista 'home' con los productos
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

module.exports = router;