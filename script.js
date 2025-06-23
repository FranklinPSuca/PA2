document.addEventListener('DOMContentLoaded', function() {
    // Función para el menú responsive
    function toggleMenu() {
        const menu = document.getElementById('menu');
        menu.classList.toggle('active');
    }

    // Productos de ejemplo (debes reemplazarlos con tus productos reales)
    const productos = [
        {
            id: 1,
            nombre: "Kit solar 1",
            precio: 290.00,
            imagen: "img/kit solar1.webp",
            descripcion: "Mini sistema de iluminación portátil con audio , iluminación y cargar dispositivos a 5Vdc, CONTENIDO:, -Un Radio, -Un Panel Solar, -3 Focos LED, -1"
        },
        {
            id: 2,
            nombre: "Reflector solar",
            precio: 105.00,
            imagen: "img/reflector_solar.webp",
            descripcion: "Reflector LED SOLAR Tipo Para anclar Ancho (mm): 330 mm Voltaje : Carga con radiación Tiempo de Carga : 6 -8 Hrs Lúmenes 7000 a 9000 lm"
        },
        {
            id: 3,
            nombre: "Regulador de carga",
            precio: 1000.00,
            imagen: "img/regulador_carga.webp",
            descripcion: "MPPT: Seguimiento ultrarrápido del Punto de Máxima Potencia"
        },
        {
            id: 4,
            nombre: "Panel solar",
            precio: 800.00,
            imagen: "img/panel_solar.webp",
            descripcion: "Basado en la oblea de silicio de gran tamaño de 210 mm y en la célula monocristalina PERC, el módulo Vertex presenta varias características de diseño innovadoras que permiten una elevada potencia de salida de más de 500 W."
        }
    ];

    // Variables del carrito
    let carrito = [];

    // Crear elementos del carrito
    const btnCarrito = document.createElement('button');
    btnCarrito.className = 'btn-carrito';
    btnCarrito.innerHTML = '🛒 <span class="contador-carrito">0</span>';
    document.body.appendChild(btnCarrito);

    const carritoContainer = document.createElement('div');
    carritoContainer.className = 'carrito-container';
    carritoContainer.innerHTML = `
        <div class="carrito-header">
            <h3>Tu Carrito</h3>
            <button class="cerrar-carrito">×</button>
        </div>
        <div class="carrito-items"></div>
        <div class="carrito-total">Total: S/ 0.00</div>
        <div class="carrito-acciones">
            <button class="btn-vaciar">Vaciar Carrito</button>
            <button class="btn-comprar">Finalizar Compra</button>
        </div>
    `;
    document.body.appendChild(carritoContainer);

    // Referencias a elementos del carrito
    const carritoItems = document.querySelector('.carrito-items');
    const carritoTotal = document.querySelector('.carrito-total');
    const contadorCarrito = document.querySelector('.contador-carrito');

    // Mostrar productos en la página
    const productosContainer = document.getElementById('productos-container');
    
    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'producto';
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-info">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="producto-precio">S/ ${producto.precio.toFixed(2)}</p>
                <button class="btn-agregar" data-id="${producto.id}">Agregar al Carrito</button>
            </div>
        `;
        productosContainer.appendChild(productoElement);
    });

    // Eventos
    btnCarrito.addEventListener('click', toggleCarrito);
    document.querySelector('.cerrar-carrito').addEventListener('click', toggleCarrito);
    document.querySelector('.btn-vaciar').addEventListener('click', vaciarCarrito);
    document.querySelector('.btn-comprar').addEventListener('click', finalizarCompra);
    
    // Delegación de eventos para los botones "Agregar al Carrito"
    productosContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-agregar')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const producto = productos.find(p => p.id === id);
            agregarAlCarrito(producto);
        }
    });

    // Funciones del carrito
    function toggleCarrito() {
        carritoContainer.style.display = carritoContainer.style.display === 'block' ? 'none' : 'block';
    }

    function agregarAlCarrito(producto) {
        const itemExistente = carrito.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        actualizarCarrito();
        mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    }

    function actualizarCarrito() {
        carritoItems.innerHTML = '';
        
        if (carrito.length === 0) {
            carritoItems.innerHTML = '<p>Tu carrito está vacío</p>';
            carritoTotal.textContent = 'Total: S/ 0.00';
            contadorCarrito.textContent = '0';
            return;
        }
        
        let total = 0;
        
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'carrito-item';
            itemElement.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-info">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-precio">S/ ${item.precio.toFixed(2)}</div>
                </div>
                <div class="item-cantidad">
                    <button class="disminuir" data-id="${item.id}">-</button>
                    <input type="text" value="${item.cantidad}" readonly>
                    <button class="aumentar" data-id="${item.id}">+</button>
                </div>
                <button class="eliminar-item" data-id="${item.id}">×</button>
            `;
            
            carritoItems.appendChild(itemElement);
        });
        
        carritoTotal.textContent = `Total: S/ ${total.toFixed(2)}`;
        contadorCarrito.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        
        // Agregar eventos a los botones de cantidad
        document.querySelectorAll('.disminuir').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                disminuirCantidad(id);
            });
        });
        
        document.querySelectorAll('.aumentar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                aumentarCantidad(id);
            });
        });
        
        document.querySelectorAll('.eliminar-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                eliminarItem(id);
            });
        });
    }

    function disminuirCantidad(id) {
        const item = carrito.find(item => item.id === id);
        
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            carrito = carrito.filter(item => item.id !== id);
        }
        
        actualizarCarrito();
    }

    function aumentarCantidad(id) {
        const item = carrito.find(item => item.id === id);
        item.cantidad++;
        actualizarCarrito();
    }

    function eliminarItem(id) {
        carrito = carrito.filter(item => item.id !== id);
        actualizarCarrito();
        mostrarNotificacion('Producto eliminado del carrito');
    }

    function vaciarCarrito() {
        carrito = [];
        actualizarCarrito();
        mostrarNotificacion('Carrito vaciado');
    }

    function finalizarCompra() {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        alert(`¡Compra finalizada!\nTotal: S/ ${total.toFixed(2)}\nGracias por tu compra.`);
        vaciarCarrito();
        toggleCarrito();
    }

    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);
        
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }
});