const cart = [];

const cartPanel = document.getElementById('cart-panel');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');

// ICONA DEL CARRET A LA NAVBAR
const cartIconLink = document.querySelector('.bi-cart3')?.closest('a');

// ---- SELECCIÓ DE TALLA + ADD TO CART PER PRODUCTE ----
document.querySelectorAll('.product-card').forEach(card => {
  const sizeButtons = card.querySelectorAll('.size-btn');
  let selectedSize = null;

  // Quan clico una talla
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // treure active de totes
      sizeButtons.forEach(b => b.classList.remove('active'));
      // posar active a la clicada
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  });

  // Botó Add to cart
  const addBtn = card.querySelector('.add-to-cart');
  if (!addBtn) return;

  addBtn.addEventListener('click', e => {
    e.preventDefault();

    if (!selectedSize) {
      alert('Please choose a size first.');
      return;
    }

    const name = addBtn.dataset.product;
    const price = parseFloat(addBtn.dataset.price || '0');

    cart.push({ name, size: selectedSize, price });
    renderCart();
    openCart();
  });
});

// ---- RENDERITZAR CARRET ----
function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const li = document.createElement('li');
    li.className = 'cart-item d-flex justify-content-between align-items-start mb-2';

    li.innerHTML = `
      <div>
        <div class="fw-semibold">${item.name}</div>
        <div class="small text-white-50">Size: ${item.size}</div>
      </div>
      <div class="text-end">
        <div>${item.price.toFixed(2)} €</div>
        <button class="btn btn-link text-white-50 p-0 small remove-item" data-index="${index}">
          Remove
        </button>
      </div>
    `;

    cartItemsContainer.appendChild(li);
  });

  cartTotalEl.textContent = total.toFixed(2) + ' €';

  // Botons de "Remove"
  cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index, 10);
      cart.splice(index, 1);
      renderCart();
    });
  });
}

// ---- OBRIR / TANCAR CARRET ----
function openCart() {
  cartPanel.classList.add('open');
  cartBackdrop.classList.remove('d-none');
}

function closeCart() {
  cartPanel.classList.remove('open');
  cartBackdrop.classList.add('d-none');
}

document.getElementById('cart-close').addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

// Obrir el carret des de la icona de la navbar
if (cartIconLink) {
  cartIconLink.addEventListener('click', e => {
    e.preventDefault();
    openCart();
  });
}