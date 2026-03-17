
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


const productDatabase = {
    '5509': { name: 'Gildan Ultra cotton', price: 200 },
    '1001': { name: 'Reynolds Sharpie', price: 500 },
    '2001': { name: 'Shampoo', price: 800 },
    '3001': { name: 'Dettol', price: 900 }
};

let cartItems = [
    { id: 1, name: 'Gildan Ultra cotton', price: 1200 },
    { id: 2, name: '1x Reynolds Sharpie', price: 500 },
    { id: 3, name: 'Shampoo', price: 800 },
    { id: 4, name: 'Dettol', price: 900 }
];

let selectedPaymentMethod = null;


document.addEventListener('DOMContentLoaded', function() {
    setupKeypadListeners();
    setupCartListeners();
    setupPaymentListeners();
    updateBill();
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
    
    const newItem = {
        id: Date.now(),
        name: `Product ${code}`,
        price: (Math.random() * 50 + 5).toFixed(2)
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

function handleCompletePurchase() {
    if (cartItems.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    const total = calculateTotal();
    alert(`Purchase completed!\nTotal: ₹${total}\nPayment Method: ${selectedPaymentMethod.toUpperCase()}`);
    

    cartItems = [];
    renderCart();
    updateBill();
    selectedPaymentMethod = null;
    paymentButtons.forEach(btn => btn.classList.remove('active'));
    codeInput.value = '';
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    const tax = (subtotal * 0.18).toFixed(2);
    return (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
}


function searchItems(query) {
    console.log('Searching for:', query);

}
