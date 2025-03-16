// CONECTAR CON SOCKET.IO
const socket = io();

// FUNCION PARA ELIMINAR PRODUCTO
function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}


// ESCUCHAR EL EVENTO UPDATEPRODUCTS PARA ACTUALIZAR LA LISTA
socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    // LIMPIAR LISTA
    productList.innerHTML = ''; 

    // RECORRER PRODUCTOS Y AGREGARLOS A LA LISTA
    products.forEach(product => {
        productList.innerHTML += `
            <div>
                ${product.title} - $${product.price}
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        `;
    });
});

// MANEJAR FORMULARIO PARA AGREGAR PRODUCTO
document.getElementById('addProductForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // OBTENER VALORES DEL FORMULARIO
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        status: true, 
        thumbnails: [] 
    };

    // EMITIR EL EVENTO ADDPRODUCT AL SERVIDOR
    socket.emit('addProduct', product);

    // LIMPIAR EL FORMULARIO
    document.getElementById('addProductForm').reset();
});