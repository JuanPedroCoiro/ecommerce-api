// IMPORTAR MODULOS
const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, "../data/products.json");
  }

  // CARGAR PRODUCTOS
  async loadProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
      return [];
    }
  }

  // GUARDAR LISTA DE PRODUCTOS
  async saveProducts(products) {
    try {
      await fs.writeFile(
        this.filePath,
        JSON.stringify(products, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("Error guardando productos: ", error);
    }
  }

  // OBTENER PRODUCTOS
  async getProducts() {
    try {
      let products = await this.loadProducts();
      return products;  
    } catch (error) {
      console.error("Error al obtener productos: ", error);
      return [];
    }
  }

  // OBTENER PRODUCTO POR ID
  async getProductById(id) {
    try {
      let products = await this.loadProducts();
      let product = products.find(product => product.id == id);
      if(!product){
        throw new Error("No se encontro un producto con ese id");
      }
      return product;
    } catch (error) {
      console.error("Error al obtener el producto: ", error);
      throw error;
    }
  }

  // AGREGAR PRDUCTO
  async addProduct(product) {
    try {
      const products = await this.loadProducts();
      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        product.status === undefined ||
        !product.stock ||
        !product.category ||
        !product.thumbnails
      ) {
        throw new Error("Todos los campos son obligatorios");
      }
  
      // VALIDAR QUE EL CODIGO DEL PRODUCTO NO ESTE REPETIDO
      const existingProduct = products.find((p) => p.code === product.code);
      if (existingProduct) {
        throw new Error(`El código ${product.code} ya está en uso`);
      }
      // ASIGNAR ID AL PRODUCTO
      const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
      product.id = maxId + 1;
      // GUARDAR PRODUCTO EN LA LISTA
      products.push(product);
      await this.saveProducts(products);

      return product;
    } catch (error) {
      console.error("Error al añadir producto: ", error);
      throw new Error(error.message);
    }
  }

  // ACTUALIZAR PRODUCTO
  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.loadProducts();
      const product = products.find(p => p.id == id);
      if(product){
        Object.assign(product, updatedProduct);
        await this.saveProducts(products);
        return product;
      }
      return null;
    } catch (error) {
      console.error("Error al actualizar producto: ", error);
    }
  }

  // ELIMINAR PRODUCTO
  async deleteProduct(id) {
    try {
      let products = await this.loadProducts();
      // FILTRAR LOS PRODUCTOS PARA ELIMINAR LOS QUE TIENEN ESE ID
      let filteredProducts = products.filter((p) => p.id !== id);

      await this.saveProducts(filteredProducts);
    } catch (error) {
      console.error("Erro deleting products: ", error);
    }
  }
}

module.exports = ProductManager;
