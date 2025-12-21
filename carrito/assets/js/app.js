/* Carrito simple - guarda en localStorage
   - Productos de ejemplo
   - Agregar/actualizar/eliminar
   - Checkout POST /checkout (opcional)
*/

const PRODUCTS = [
  { id: 'p1', title: 'Camiseta básica', price: 19.99, image: 'https://picsum.photos/seed/p1/400/300' },
  { id: 'p2', title: 'Pantalón cómodo', price: 39.9, image: 'https://picsum.photos/seed/p2/400/300' },
  { id: 'p3', title: 'Mochila urbana', price: 59.5, image: 'https://picsum.photos/seed/p3/400/300' },
  { id: 'p4', title: 'Gorra deportiva', price: 14.25, image: 'https://picsum.photos/seed/p4/400/300' }
];

const storageKey = 'mi_carrito_v1';

let cart = loadCart();

const el = {
  products: document.getElementById('products'),
  cartToggle: document.getElementById('cart-toggle'),
  cartCount: document.getElementById('cart-count'),
  cartPanel: document.getElementById('cart'),
  cartItems: document.getElementById('cart-items'),
  cartTotal: document.getElementById('cart-total'),
  clearCartBtn: document.getElementById('clear-cart'),
  checkoutBtn: document.getElementById('checkout'),
  productTemplate: document.getElementById('product-template'),
  cartItemTemplate: document.getElementById('cart-item-template')
};

function saveCart(){
  localStorage.setItem(storageKey, JSON.stringify(cart));
  renderCart();
}
function loadCart(){
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : {};
}

function addToCart(productId, qty = 1){
  if(cart[productId]) cart[productId] += qty;
  else cart[productId] = qty;
  saveCart();
}

function removeFromCart(productId){
  delete cart[productId];
  saveCart();
}

function setQuantity(productId, qty){
  if(qty <= 0) removeFromCart(productId);
  else {
    cart[productId] = qty;
    saveCart();
  }
}

function clearCart(){
  cart = {};
  saveCart();
}

function getCartItems(){
  return Object.entries(cart).map(([id, qty])=>{
    const product = PRODUCTS.find(p=>p.id===id);
    return { ...product, qty };
  });
}

function formatMoney(n){ return `$${n.toFixed(2)}`; }

function renderProducts(){
  el.products.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const node = el.productTemplate.content.cloneNode(true);
    node.querySelector('.product-image').src = p.image;
    node.querySelector('.product-image').alt = p.title;
    node.querySelector('.product-title').textContent = p.title;
    node.querySelector('.product-price').textContent = formatMoney(p.price);
    const btn = node.querySelector('.add-to-cart');
    btn.addEventListener('click', ()=> addToCart(p.id, 1));
    el.products.appendChild(node);
  });
}

function renderCart(){
  const items = getCartItems();
  el.cartItems.innerHTML = '';
  let total = 0;
  items.forEach(item=>{
    const node = el.cartItemTemplate.content.cloneNode(true);
    node.querySelector('.cart-item-title').textContent = item.title;
    node.querySelector('.cart-item-price').textContent = `${formatMoney(item.price)} x ${item.qty}`;
    const qtyInput = node.querySelector('.cart-qty');
    qtyInput.value = item.qty;
    qtyInput.addEventListener('change', e=>{
      const v = parseInt(e.target.value, 10) || 1;
      setQuantity(item.id, v);
    });
    node.querySelector('.remove-item').addEventListener('click', ()=> removeFromCart(item.id));
    el.cartItems.appendChild(node);
    total += item.price * item.qty;
  });
  el.cartCount.textContent = items.reduce((s,i)=>s+i.qty,0);
  el.cartTotal.textContent = formatMoney(total);
}

el.cartToggle.addEventListener('click', ()=>{
  el.cartPanel.classList.toggle('hidden');
});

el.clearCartBtn.addEventListener('click', ()=>{
  if(confirm('¿Limpiar el carrito?')) clearCart();
});

el.checkoutBtn.addEventListener('click', async ()=>{
  const items = getCartItems();
  if(items.length === 0){ alert('El carrito está vacío'); return; }
  // Intentamos enviar a /checkout si existe un servidor
  try{
    const resp = await fetch('/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ items })
    });
    if(resp.ok){
      const data = await resp.json();
      alert('Pedido realizado: ' + (data.message || 'OK'));
      clearCart();
    } else {
      const text = await resp.text();
      alert('Error en checkout: ' + resp.status + ' ' + text);
    }
  } catch(err){
    // Sin servidor, simplemente simular checkout
    console.warn('No se pudo conectar al servidor de checkout:', err);
    alert('Simulación de pago completa (sin servidor).');
    clearCart();
  }
});

renderProducts();
renderCart();