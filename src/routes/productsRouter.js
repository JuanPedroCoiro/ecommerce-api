// IMPORTAR MODULOS
const express = require("express");
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// OBTENER TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

// OBTENER UN PRODUCTO POR SU ID
router.get("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// AGREGAR UN NUEVO PRODUCTO
router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ACTUALIZAR UN PRODUCTO
router.post("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// ELIMINAR UN PRODUCTO
router.delete("/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
        const result = await productManager.deleteProduct(productId);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;