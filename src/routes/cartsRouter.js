// IMPORTAR MODULOS
const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const cartManager = new CartManager();

// AÑADIR NUEVO CARRITO
router.post("/", async (req, res) => {
  const productsToAdd = req.body;
  try {
    const newCart = await cartManager.addCart(productsToAdd);
    console.log(newCart);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

// OBTENER PRODUCTOS DEL CARRITO
router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cartProducts = await cartManager.getCartProducts(cartId);
    res.status(200).json(cartProducts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// AÑADIR PRODUCTO AL CARRITO
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  try {
    const updatedCart = await cartManager.addProductToCart(productId, cartId);
    console.log(updatedCart, "updatedcart en router");
    res.status(200).json({
      message: "Producto agregado al carrito correctamente",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
