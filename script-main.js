
const codeInput = document.querySelector('.code-input');
const keypadButtons = document.querySelectorAll('.keypad button');
const addToCartBtn = document.querySelector('button[type="submit"]');
const clearBtn = document.querySelector('button[type="reset"]');
const removeButtons = document.querySelectorAll('.remove');
const cartItemsContainer = document.querySelector('.cart-items');
const billRows = document.querySelectorAll('.bill .row');
const paymentButtons = document.querySelectorAll('.pay');
const completePurchaseBtn = document.querySelector('.complete');
const previewName = document.querySelector('.preview-name');
const previewPrice = document.querySelector('.preview-price');


let productDatabase = {};

let cartItems = [];

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:4000/api/products');
        const products = await response.json();
        productDatabase = {};
        products.forEach(p => {
            productDatabase[p.sku] = {
                id: p._id,
                name: p.name,
                price: p.sellingPrice,
                sku: p.sku
            };
            if (p.barcode) {
                productDatabase[p.barcode] = productDatabase[p.sku];
            }
        });
        console.log('Products loaded:', productDatabase);
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}

let selectedPaymentMethod = null;


document.addEventListener('DOMContentLoaded', async function() {
    await fetchProducts();
    setupKeypadListeners();
    setupCartListeners();
    setupPaymentListeners();
    updateBill();
    renderCart(); // Initial empty render
});


function setupKeypadListeners() {
    keypadButtons.forEach(button => {
        button.addEventListener('click', handleKeypadClick);
    });
    
    codeInput.addEventListener('change', updateProductPreview);
    codeInput.addEventListener('input', updateProductPreview);
    addToCartBtn.addEventListener('click', handleAddToCart);
    clearBtn.addEventListener('click', handleClear);
}

function handleKeypadClick(event) {
    const value = event.target.textContent;
    
    if (value === 'Shift') {
        codeInput.value = '';
        updateProductPreview();
    } else if (value.trim()) {
        codeInput.value += value;
        updateProductPreview();
    }
}

function handleAddToCart() {
    const code = codeInput.value;
    if (code.trim() === '') {
        alert('Please enter a product code');
        return;
    }
    
    if (!productDatabase[code]) {
        alert('Product not found in database!');
        return;
    }

    const product = productDatabase[code];
    const newItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1,
        total: product.price
    };
    
    cartItems.push(newItem);
    renderCart();
    updateBill();
    codeInput.value = '';
}

function handleClear() {
    codeInput.value = '';
    updateProductPreview();
}

function updateProductPreview() {
    const code = codeInput.value.trim();
    
    if (!code) {
        previewName.textContent = '';
        previewPrice.textContent = '';
        return;
    }
    
    if (productDatabase[code]) {
        const product = productDatabase[code];
        previewName.textContent = product.name;
        previewPrice.textContent = `Price: ₹${product.price}`;
    } else {
        previewName.textContent = '';
        previewPrice.textContent = '';
    }
}


function setupCartListeners() {
    updateRemoveButtonListeners();
}

function updateRemoveButtonListeners() {
    const removeButtons = document.querySelectorAll('.remove');
    removeButtons.forEach(button => {
        button.removeEventListener('click', handleRemoveItem);
        button.addEventListener('click', handleRemoveItem);
    });
}

function handleRemoveItem(event) {
    const cartItem = event.target.closest('.cart-item');
    const itemName = cartItem.querySelector('.item-name').textContent;
    
    cartItems = cartItems.filter(item => item.name !== itemName);
    renderCart();
    updateBill();
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    cartItems.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="item-img"></div>
            <div class="item-info">
                <p class="item-name">${item.name}</p>
            </div>
            <button class="remove">×</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });
    
    updateRemoveButtonListeners();
}


function updateBill() {
    const subtotal = calculateSubtotal();
    const tax = (subtotal * 0.18).toFixed(2); 
    const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
    
    billRows[0].querySelector('span:last-child').textContent = `₹ ${subtotal}`;
    billRows[1].querySelector('span:last-child').textContent = `₹ ${tax}`;
    billRows[2].querySelector('span:last-child').textContent = `₹ ${total}`;
}

function calculateSubtotal() {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
}

function setupPaymentListeners() {
    paymentButtons.forEach(button => {
        button.addEventListener('click', handlePaymentMethod);
    });
    
    completePurchaseBtn.addEventListener('click', handleCompletePurchase);
}

function handlePaymentMethod(event) {
    paymentButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    selectedPaymentMethod = event.target.classList[1];
    console.log('Selected payment method:', selectedPaymentMethod);
}

async function handleCompletePurchase() {
    if (cartItems.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    const subtotal = calculateSubtotal();
    const total = calculateTotal();
    
    const orderPayload = {
        orderNumber: 'ORD-' + Date.now(),
        userId: '605c72e21b71452140669b71', // Dummy Object ID since no auth flow
        items: cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            total: item.total
        })),
        totalItems: cartItems.length,
        subTotal: parseFloat(subtotal),
        grandTotal: parseFloat(total),
        paymentMethod: selectedPaymentMethod.toLowerCase(),
        paymentStatus: 'paid'
    };

    try {
        const response = await fetch('http://localhost:4000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderPayload)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Failed to complete purchase');
        }

        const orderData = await response.json();
        alert(`Purchase completed!\nOrder Number: ${orderData.orderNumber}\nTotal: ₹${total}\nPayment Method: ${selectedPaymentMethod.toUpperCase()}`);
        
        cartItems = [];
        renderCart();
        updateBill();
        selectedPaymentMethod = null;
        paymentButtons.forEach(btn => btn.classList.remove('active'));
        codeInput.value = '';
    } catch (error) {
        alert(`Error completing purchase: ${error.message}`);
    }
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    const tax = (subtotal * 0.18).toFixed(2);
    return (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
}


function searchItems(query) {
    console.log('Searching for:', query);

}
