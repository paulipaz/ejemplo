// app.js - Carrito de compras simple
const PRODUCTS = [
  { id: 'p1', title: 'Camiseta básica', price: 19.99, image: 'https://picsum.photos/seed/p1/400/300' },
  { id: 'p2', title: 'Pantalón cómodo', price: 39.9, image: 'https://picsum.photos/seed/p2/400/300' },
  { id: 'p3', title: 'Mochila urbana', price: 59.5, image: 'https://picsum.photos/seed/p3/400/300' },
  { id: 'p4', title: 'Gorra deportiva', price: 14.25, image: 'https://picsum.photos/seed/p4/400/300' }
];

const storageKey = 'tienda_demo_carrito_v1';
let cart = loadCart();

const els = {
  products: document.getElementById('products'),
  cartToggle: document.getElementById('cart-toggle'),
  cartCount: document.getElementById('cart-count'),
  cartPanel: document.getElementById('cart'),
  cartItems: document.getElementById('cart-items'),
  cartTotal: document.getElementById('cart-total'),
  clearBtn: document.getElementById('clear-cart'),
  checkoutBtn: document.getElementById('checkout'),
  productTpl: document.getElementById('product-tpl'),
  cartItemTpl: document.getElementById('cart-item-tpl')
};

function loadCart(){
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : {};
}
function saveCart(){
  localStorage.setItem(storageKey, JSON.stringify(cart));
  renderCart();
}

function addToCart(id, qty = 1){
  cart[id] = (cart[id] || 0) + qty;
  saveCart();
}
function setQty(id, qty){
  qty = Number(qty) || 0;
  if(qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart();
}
function removeFromCart(id){
  delete cart[id];
  saveCart();
}
function clearCart(){
  cart = {};
  saveCart();
}

function getCartItems(){
  return Object.entries(cart).map(([id, qty])=>{
    const p = PRODUCTS.find(x => x.id === id);
    return { ...p, qty };
  });
}

function formatMoney(n){ return `$${n.toFixed(2)}`; }

function renderProducts(){
  els.products.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const node = els.productTpl.content.cloneNode(true);
    node.querySelector('.product-img').src = p.image;
    node.querySelector('.product-img').alt = p.title;
    node.querySelector('.product-title').textContent = p.title;
    node.querySelector('.product-price').textContent = formatMoney(p.price);
    node.querySelector('.add-to-cart').addEventListener('click', ()=> addToCart(p.id, 1));
    els.products.appendChild(node);
  });
}

function renderCart(){
  const items = getCartItems();
  els.cartItems.innerHTML = '';
  let total = 0;
  items.forEach(item=>{
    const node = els.cartItemTpl.content.cloneNode(true);
    node.querySelector('.title').textContent = item.title;
    node.querySelector('.price').textContent = `${formatMoney(item.price)} x ${item.qty}`;
    const qtyInput = node.querySelector('.qty');
    qtyInput.value = item.qty;
    qtyInput.addEventListener('change', e => setQty(item.id, e.target.value));
    node.querySelector('.remove').addEventListener('click', ()=> removeFromCart(item.id));
    els.cartItems.appendChild(node);
    total += item.price * item.qty;
  });
  const count = items.reduce((s,i)=>s+i.qty, 0);
  els.cartCount.textContent = count;
  els.cartTotal.textContent = formatMoney(total);
}

els.cartToggle.addEventListener('click', ()=> els.cartPanel.classList.toggle('hidden'));
els.clearBtn.addEventListener('click', ()=> {
  if(confirm('¿Vaciar el carrito?')) clearCart();
});
els.checkoutBtn.addEventListener('click', async ()=>{
  const items = getCartItems();
  if(items.length === 0){ alert('El carrito está vacío'); return; }

  try {
    const res = await fetch('/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ items })
    });
    if(res.ok){
      const data = await res.json();
      alert('Pedido realizado: ' + (data.message || 'OK'));
      clearCart();
    } else {
      const text = await res.text();
      alert('Error en checkout: ' + res.status + ' ' + text);
    }
  } catch (err) {
    console.warn('Checkout falló (sin servidor):', err);
    alert('Pago simulado. Pedido completado localmente.');
    clearCart();
  }
});

renderProducts();
renderCart();