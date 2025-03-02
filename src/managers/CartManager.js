// IMPORTAR MODULOS
const fs = require("fs").promises;
const path = require("path");
const ProductManager = require("./ProductManager");
// INSTANCIAR PRODUCT MANAGER
const productManager = new ProductManager();

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
  async addCart() {
    try {
      let carts = await this.loadCarts();
      let newCart;
      let products = [];
      // ASIGNAR ID AL CARRITO
      const maxId =
        carts.length > 0 ? Math.max(...carts.map((c) => c.id)) : 0;
      newCart = {id: maxId + 1, products};

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
      const selectedCart = carts.find((cart) => cart.id == id);
      return selectedCart ? selectedCart.products : undefined;
    } catch (error) {
      console.error("Error al obtener el carrito: ", error);
    }
  }

  async addProductToCart(pid, cid) {
    try {
      const carts = await this.loadCarts();
      const products = await productManager.loadProducts();
      // VERIFICAR SI EL PRODUCTO EXISTE
      const productExists = products.some(product => product.id === pid);
      if(!productExists){
        throw new Error(`El producto con ID ${pid} no existe.`);
      }
      // BUSCAR EL CARRITO POR ID UTILIZANDO FIND
      const cart = carts.find((cart) => cart.id == cid);
      // BUSCAR SI EXISTE EL PRODUCTO EN EL CARRITO
      const existingProduct = cart.products.find(
        (product) => product.product == pid
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      console.error("Error al añadir producto al carrito: ", error);
      throw new Error(error.message);
    }
  }
}

module.exports = CartManager;
