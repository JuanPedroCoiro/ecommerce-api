// IMPORTAR LOS MODULOS
const express = require("express");
const { engine } = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");
const path = require('path');
const ProductManager = require('./managers/ProductManager');

const productsRouter = require("./routes/productsRouter");
const cartsRouter = require("./routes/cartsRouter");
const viewsRouter = require("./routes/viewsRouter");

const app = express();
// SERVIDOR HTTP
const server = http.createServer(app);
// SERVIDOR DE WEBSOCKETS
const io = new Server(server);

// INICIALIZAR PRODUCTMANAGER
const productManager = new ProductManager();

// CONFIGURACION DE HANDLEBARS
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, 'views'));

// MIDDLEWARE PARA PARSEAR JSON
app.use(express.json());
// MIDDLEWARE PARA SERVIR ARCHIVOS ESTATICOS
app.use(express.static(path.join(__dirname, "public")));
// MIDDLEWARE PARA COMPARTIR SOCKET.IO CON LAS RUTAS
app.use((req, res, next) => {
  req.io = io;
  next();
});

// USAR LAS RUTAS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// WEBSOCKETS
io.on("connection", (socket) => {
  console.log("Un usuario conectado");

  // ESCUCHAR EL EVENTO ADDPROUCT PARA AGREGAR UN PRODUCTO
  socket.on("addProduct", async (product) => {
    try {
      const addedProduct = await productManager.addProduct(product);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  // ESCUCHAR EL EVENTO DELETEPRODUCT PARA ELIMINAR EL EVENTO
  socket.on("deleteProduct", async (id) => {
    try {
      await productManager.deleteProduct(id);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// INICIALIZAR SERVIDOR
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
