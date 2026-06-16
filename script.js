let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    updateCart();
    showNotification('Producto agregado al carrito');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {

    localStorage.setItem('cart', JSON.stringify(cart));

    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    if (cartCount) {
        cartCount.textContent =
            cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    if (!cartItems || !cartTotalPrice) return;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Tu carrito está vacío</p>';

    } else {

        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">

                <div>
                    <h4>${item.name}</h4>

                    <p>
                        $${(item.price * item.quantity).toLocaleString()} COP
                    </p>

                    <button
                        onclick="removeFromCart(${index})"
                        style="
                            color:red;
                            background:none;
                            border:none;
                            cursor:pointer;
                        ">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    cartTotalPrice.textContent =
        `$${totalPrice.toLocaleString()} COP`;
}

function toggleCart() {

    const modal = document.getElementById('cart-modal');

    if (modal) {
        modal.classList.toggle('active');
    }
}

function toggleMenu() {

    const menu = document.getElementById('mobile-menu');

    if (menu) {
        menu.classList.toggle('active');
    }
}

function checkout() {

    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    document.getElementById('checkout-form').style.display = 'block';

    toggleCart();

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

function showNotification(msg) {

    const notif = document.createElement('div');

    notif.textContent = msg;

    notif.style.cssText = `
        position:fixed;
        top:90px;
        right:20px;
        background:#111;
        color:white;
        padding:15px;
        z-index:3000;
        font-weight:bold;
        border-radius:8px;
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 2000);
}
function mostrarQR() {

    const metodo =
        document.getElementById("metodoPago").value;

    const qr =
        document.getElementById("contenedorQR");

    if (metodo === "Nequi") {

        qr.innerHTML = `
            <h4>Escanea y paga por Nequi</h4>
            <img src="imagenes/nequi.jpg"
                 width="250">
        `;

    } else if (metodo === "Bancolombia") {

        qr.innerHTML = `
            <h4>Escanea y paga por Bancolombia</h4>
            <img src="imagenes/bancolombia.jpg"
                 width="250">
        `;

    } else if (metodo === "Daviplata") {

        qr.innerHTML = `
            <h4>Escanea y paga por Daviplata</h4>
            <img src="imagenes/daviplata.jpg"
                 width="250">
        `;

    } else {

        qr.innerHTML = "";
    }
}

function enviarPedidoWhatsapp() {

    const nombre =
        document.getElementById('clienteNombre').value;

    const telefono =
        document.getElementById('clienteTelefono').value;

    const direccion =
        document.getElementById('clienteDireccion').value;

    const ciudad =
        document.getElementById('clienteCiudad').value;

    const pago =
        document.getElementById('metodoPago').value;

    if(
        !nombre ||
        !telefono ||
        !direccion ||
        !ciudad ||
        !pago
    ){
        alert("Completa todos los campos");
        return;
    }

    let total = 0;

    let mensaje =
        `*NUEVO PEDIDO URBAN W&K*%0A%0A`;

    mensaje +=
        `👤 Cliente: ${nombre}%0A`;

    mensaje +=
        `📱 Teléfono: ${telefono}%0A`;

    mensaje +=
        `📍 Dirección: ${direccion}%0A`;

    mensaje +=
        `🏙️ Ciudad: ${ciudad}%0A`;

    mensaje +=
        `💳 Pago: ${pago}%0A%0A`;

    mensaje +=
        `🛒 PRODUCTOS:%0A`;

    cart.forEach(item => {

        mensaje +=
            `• ${item.name} x${item.quantity}%0A`;

        total +=
            item.price * item.quantity;
    });

    mensaje +=
        `%0A💰 Total: $${total.toLocaleString()} COP`;

    mensaje +=
        `%0A%0AAdjunto comprobante de pago.`;

    window.open(
        `https://wa.me/573142043137?text=${mensaje}`,
        '_blank'
    );

    cart = [];

    localStorage.removeItem('cart');

    updateCart();

    document.getElementById('checkout-form').style.display = 'none';
}
