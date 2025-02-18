// IMPORTAR MODULOS
const fs = require("fs").promises;
const path = require("path");

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/carts.json");
  }

  // CARGAR CARRITOS
  async loadCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error cargando carritos:", error);
      return [];
    }
  }

  // GUARDAR CARRITOS
  async saveCarts(carts) {
    try {
      await fs.writeFile(
        this.filePath,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("Error guardando los productos: ", error);
    }
  }

  // CREAR CARRITO
  async addCart(products) {
    try {
      let carts = await this.loadCarts();
      let newCart;
      if (carts.length == 0) {
        newCart = { id: 1, products };
      } else {
        newCart = {
          id: carts.length + 1,
          products,
        };
      }
      carts.push(newCart);
      await this.saveCarts(carts);
      return newCart;
    } catch (error) {
      console.error("Error al crear carrito:", error);
    }
  }

  // OBTENER PRODUCTOS DEL CARRITO
  async getCartProducts(id) {
    try {
      const carts = await this.loadCarts();
      for (let i = 0; i < carts.length; i++) {
        let cart = carts[i];
        if (cart.id == id) {
          return cart.products;
        }
      }
    } catch (error) {
      console.error("Error al obtener el carrito: ", error);
    }
  }

  async addProductToCart(pid, cid) {
    try {
      const carts = await this.loadCarts();
      // BUSCAR EL CARRITO POR ID UTILIZANDO FIND
      const cart = carts.find((cart) => cart.id == cid);
      // BUSCAR SI EXISTE EL PRODUCTO EN EL CARRITO
      const existingProduct = cart.products.find((product) => product.product == pid);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      console.error("Error al añadir producto al carrito: ", error);
    }
  }
}

module.exports = CartManager;
