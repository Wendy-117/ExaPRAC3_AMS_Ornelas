const products = [
  { id: 1, name: "Modelo Eco 1", category: "Running", price: 1800, stock: 12 },
  { id: 2, name: "Modelo Eco 2", category: "Urbano", price: 2100, stock: 6 },
  { id: 3, name: "Modelo Eco 3", category: "Trail", price: 2400, stock: 0 },
];

const cart = [];
const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

function stockLabel(stock) {
  if (stock === 0) return { text: "Agotado", className: "sold" };
  if (stock < 10) return { text: "Pocas unidades", className: "low" };
  return { text: "Disponible", className: "available" };
}

function formatPrice(price) {
  return `$${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
}

function renderProducts(category = "Todas") {
  const visible = category === "Todas"
    ? products
    : products.filter(product => product.category === category);

  productGrid.innerHTML = visible.map(product => {
    const stock = stockLabel(product.stock);
    return `
      <article class="product-card">
        <div class="product-image">
          <div class="mini-shoe">${product.name}</div>
        </div>
        <div class="product-info">
          <div class="product-meta">
            <h3>${product.name}</h3>
            <span class="price">${formatPrice(product.price)}</span>
          </div>
          <p class="stock ${stock.className}">${stock.text}</p>
          <button class="card-button" type="button"
            data-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
            ${product.stock === 0 ? "Agotado" : "Comprar ahora"}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderCart() {
  cartCount.textContent = cart.length;
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <span>${formatPrice(item.price)}</span>
        </div>
        <button type="button" data-remove="${index}" aria-label="Eliminar ${item.name}">Eliminar</button>
      </div>
    `).join("");
  }
  cartTotal.textContent = formatPrice(cart.reduce((sum, item) => sum + item.price, 0));
}

document.querySelector(".filters").addEventListener("click", event => {
  if (!event.target.matches(".filter")) return;
  document.querySelectorAll(".filter").forEach(button => button.classList.remove("active"));
  event.target.classList.add("active");
  renderProducts(event.target.dataset.category);
});

productGrid.addEventListener("click", event => {
  if (!event.target.matches(".card-button")) return;
  const product = products.find(item => item.id === Number(event.target.dataset.id));
  if (!product || product.stock === 0) return;
  cart.push(product);
  renderCart();
  showToast(`${product.name} agregado`);
});

cartItems.addEventListener("click", event => {
  if (!event.target.matches("[data-remove]")) return;
  cart.splice(Number(event.target.dataset.remove), 1);
  renderCart();
});

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("El carrito está vacío");
    return;
  }
  cart.length = 0;
  renderCart();
  closeCart();
  showToast("Compra confirmada");
});

renderProducts();
