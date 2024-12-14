// Variables globales
let productos = [];
let carrito = [];

// Cargar productos desde JSON con fetch
async function cargarProductos() {
    try {
        const response = await fetch('../productos/productos.json');
        productos = await response.json();
        mostrarProductos(); // Renderizar productos en el DOM
        console.log(productos)
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Mostrar productos en el DOM
function mostrarProductos() {
    const productosLista = document.getElementById('productos-lista');
    productosLista.innerHTML = ''; // Limpiar antes de renderizar
    productos.forEach((producto) => {
        const template = document.getElementById('producto-template').content.cloneNode(true);
        template.querySelector('.card-title').textContent = producto.nombre;
        template.querySelector('.precio').textContent = `$${producto.precio}`;
        template.querySelector('.stock').textContent = `Stock: ${producto.stock}`;
        template.querySelector('img').src = producto.imagen;
        template.querySelector('.btn-success').addEventListener('click', () => agregarAlCarrito(producto));
        template.querySelector('.eliminar-btn').addEventListener('click', () => eliminarUnoDelCarrito(producto.id));
        productosLista.appendChild(template);
    });
}

// Agregar producto al carrito (con actualización de stock)
function agregarAlCarrito(producto) {
    if (producto.stock > 0) {
        const productoExistente = carrito.find(item => item.id === producto.id);
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                stock: producto.stock,
                imagen: producto.imagen,
                cantidad: 1
            });
            
        }
        producto.stock--;
        mostrarProductos();
        actualizarCarrito();
    } else {
        mostrarMensaje(`No hay más stock disponible de ${producto.nombre}`, 'warning');
    }
}

// Eliminar una unidad del carrito
function eliminarUnoDelCarrito(id) {
    const productoEnCarrito = carrito.find(item => item.id === id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad--; // Reducir en 1 la cantidad
        const productoOriginal = productos.find(p => p.id === id);
        productoOriginal.stock++; // Aumentar en 1 el stock

        if (productoEnCarrito.cantidad === 0) {
            carrito = carrito.filter(item => item.id !== id); // Eliminar si la cantidad es 0
        }
        mostrarProductos();
        actualizarCarrito();
        mostrarMensaje(`Eliminaste una unidad de ${productoOriginal.nombre}`, 'info');
    }
}

// Actualizar el DOM del carrito
function actualizarCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    const totalCarrito = document.getElementById('total-carrito');
    carritoLista.innerHTML = ''; // Limpiar antes de renderizar
    let total = 0;

    carrito.forEach((producto) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            ${producto.nombre} x ${producto.cantidad} - $${producto.precio * producto.cantidad}
            <button class="btn btn-sm btn-danger float-right" onclick="eliminarUnoDelCarrito(${producto.id})">Eliminar</button>
        `;
        total += producto.precio * producto.cantidad;
        carritoLista.appendChild(li);
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;
}

// Mostrar mensajes con SweetAlert2
function mostrarMensaje(mensaje, tipo) {
    Swal.fire({
        icon: tipo,
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
    });
}

// Evento del formulario para agregar nuevos productos
document.getElementById('producto-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const imagen = document.getElementById('imagen').value;

    const nuevoProducto = {
        id: productos.length + 1,
        nombre,
        precio,
        stock: cantidad,
        imagen
    };

    productos.push(nuevoProducto);
    mostrarProductos();
    e.target.reset();
});

// Cargar los productos al iniciar la página
window.addEventListener('DOMContentLoaded', cargarProductos);
 
   
 
