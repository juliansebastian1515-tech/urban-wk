let cart = [];

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, image: image, quantity: 1 });
    }
    updateCart();
    showNotification('Producto agregado al carrito');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${(item.price * item.quantity).toLocaleString()} COP</p>
                    <button onclick="removeFromCart(${index})" style="color:red; background:none; border:none; cursor:pointer;">Eliminar</button>
                </div>
            </div>
        `).join('');
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `$${totalPrice.toLocaleString()} COP`;
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('active');
}

function toggleMenu() {
    document.getElementById('mobile-menu').classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    let message = '¡Hola! Quiero realizar un pedido:%0A%0A';
    let total = 0;
    cart.forEach(item => {
        message += `• ${item.name} - $${item.price.toLocaleString()} x ${item.quantity}%0A`;
        total += item.price * item.quantity;
    });
    message += `%0ATotal: $${total.toLocaleString()} COP`;
    window.open(`https://wa.me/573112223344?text=${message}`, '_blank');
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.textContent = msg;
    notif.style.cssText = 'position:fixed; top:90px; right:20px; background:#111; color:white; padding:15px; z-index:3000; font-weight:bold;';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}