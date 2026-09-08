/* ================================================================
  CONFIG — update the brand name, currency, and WhatsApp number here.
   ================================================================ */
const CONFIG = {
  brandName: "Syazz",
  currency: "Rp",
  whatsappNumber: "6281234567890", // replace with the store's WhatsApp number
};

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

/* ================================================================
  PRODUCT DATA — add, edit, or remove products in this array.
  All product names and designs are fictional/original.
   ================================================================ */
const products = [
  { id: 1, name: "Nike Giannis Freak 8", price: 1250000, image: "images/shoes nike/GIANNIS+FREAK+8+LE+EP.png", category: "Men", description: "Explosive basketball shoes with a responsive ride and secure fit for fast, powerful moves on court." },
  { id: 2, name: "Nike Giannis Freak 8 LX", price: 980000, image: "images/shoes nike/GIANNIS+FREAK+8+LX+EP.png", category: "New", description: "A high-cushion performance sneaker built for stability, impact protection, and quick acceleration." },
  { id: 3, name: "Nike Giannis Immortality 5", price: 1150000, image: "images/shoes nike/GIANNIS+IMMORTALITY+5+EP.png", category: "New", description: "Lightweight hoops shoe with strong traction and a springy feel for explosive play." },
  { id: 4, name: "Jordan Luka 77 PF", price: 890000, image: "images/shoes nike/JORDAN+LUKA+77+PF.png", category: "Men", description: "Responsive basketball sneaker with smooth cushioning and an agile profile for quick footwork." },
  { id: 5, name: "Nike KD19 EP", price: 1050000, image: "images/shoes nike/KD19+EP.png", category: "Popular", description: "High-performance basketball shoe designed for speed, lift, and all-court comfort." },
  { id: 6, name: "Nike Kobe 5 Protro", price: 920000, image: "images/shoes nike/Nike Kobe 5 Protro X-ray 37_5.jpg", category: "Popular", description: "Classic low-top basketball silhouette with bold styling and responsive cushioning for aggressive play." },
  { id: 7, name: "Nike Men's Sneakers", price: 870000, image: "images/shoes nike/Nike Men's Sneakers.jpg", category: "Popular", description: "Everyday lifestyle sneaker with a clean, versatile look made for casual daily wear." },
  { id: 8, name: "Nike Sneaker Three Quarter", price: 1320000, image: "images/shoes nike/Nike Mens SneakerThree Quarters Tall.jpg", category: "New", description: "Street-ready sneaker with a sleek profile, premium comfort, and modern everyday style." },
  { id: 9, name: "Air Jordan Authentic", price: 990000, image: "images/shoes nike/Nike Official Authentic AIR JORDAN Men's Comfortable and Durable Basketball Shoes AR4430-106.jpg", category: "New", description: "Iconic Jordan-inspired sneaker with a durable upper and timeless court appeal." },
  { id: 10, name: "Jordan Luka 5 PF", price: 1180000, image: "images/shoes nike/JORDAN+LUKA+5+PF.png", category: "New", description: "Performance basketball sneaker built for smooth transitions, traction, and explosive movement on the court." }
];

/* ================================================================
   TESTIMONIAL DATA
   ================================================================ */
const testimonials = [
  { name: "Achill", stars: 5, quote: "These hoops shoes are fire, ankle support is clutch. Definitely gonna cop another pair from Syazz." },
  { name: "Pagar nusantara", stars: 5, quote: "Absolute banger basketball shoes from Syazz! Took 'em out for a scrimmage today—the court grip is insane and the ankle support is solid." },
  { name: "Bagas (babi ganas)", stars: 4, quote: "Legit 100% like the pics! Syazz's support was super chill and helped me out big time with the sizing. Dope stuff." }
];

/* ================================================================
   STATE
   ================================================================ */
let cart = [];
let activeCategory = "All";
let searchTerm = "";
let activeModalProductId = null;
let modalQty = 1;

/* ================================================================
  PLACEHOLDER IMAGE — transparent empty images used instead of actual
  product photos. Replace the "image" field when real photos are available.
   ================================================================ */
function getPlaceholderImage(category) {
  const label = (category || "Product").toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="700" viewBox="0 0 800 700">
      <rect width="800" height="700" fill="#f4f4f4"/>
      <rect x="40" y="40" width="720" height="620" rx="24" fill="#ededed" stroke="#d7d7d7" stroke-width="2"/>
      <circle cx="400" cy="295" r="120" fill="#e7e7e7"/>
      <path d="M285 430c40-90 170-90 230 0v80H285v-80Z" fill="#e7e7e7"/>
      <text x="400" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="#7a7a7a" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/* ================================================================
   FORMAT HARGA
   ================================================================ */
function formatPrice(amount) {
  return CONFIG.currency + " " + amount.toLocaleString("id-ID");
}

/* ================================================================
   RENDER: FILTER CATEGORIES
   ================================================================ */
function renderFilters() {
  const filterRow = document.getElementById("filterRow");
  const categories = ["All", ...new Set(products.map(p => p.category))];

  filterRow.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === activeCategory ? "is-active" : ""}" data-category="${cat}">
      ${cat}
    </button>
  `).join("");

  filterRow.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderFilters();
      renderProducts();
    });
  });
}

/* ================================================================
   RENDER: PRODUCT GRID
   ================================================================ */
function getFilteredProducts() {
  return products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyProducts");
  const resultsCount = document.getElementById("resultsCount");
  const filtered = getFilteredProducts();

  resultsCount.textContent = filtered.length + " products";
  emptyState.hidden = filtered.length > 0;

  grid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-media" data-id="${p.id}" role="button" tabindex="0" aria-label="View details for ${p.name}">
        <img src="${p.image || getPlaceholderImage(p.category)}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });

  grid.querySelectorAll(".product-media").forEach(media => {
    media.addEventListener("click", () => openProductModal(Number(media.dataset.id)));
    media.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProductModal(Number(media.dataset.id));
      }
    });
  });
}

/* ================================================================
   RENDER: TESTIMONIALS
   ================================================================ */
function renderTestimonials() {
  const grid = document.getElementById("testimonialGrid");
  grid.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <p class="testimonial-stars" aria-label="${t.stars} out of 5 stars">${"★".repeat(t.stars)}${"☆".repeat(5 - t.stars)}</p>
      <p class="testimonial-quote">"${t.quote}"</p>
      <p class="testimonial-author">${t.name}</p>
    </div>
  `).join("");
}

/* ================================================================
   PRODUCT QUICK-VIEW MODAL
   ================================================================ */
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  activeModalProductId = productId;
  modalQty = 1;

  document.getElementById("productModalName").textContent = product.name;
  document.getElementById("productModalCategory").textContent = product.category;
  document.getElementById("productModalDesc").textContent = product.description;
  document.getElementById("productModalPrice").textContent = formatPrice(product.price);
  document.getElementById("productModalQty").textContent = modalQty;
  document.getElementById("productModalMedia").innerHTML =
    `<img src="${product.image || getPlaceholderImage(product.category)}" alt="${product.name}">`;

  document.getElementById("productOverlay").classList.add("is-open");
}

function closeProductModal() {
  document.getElementById("productOverlay").classList.remove("is-open");
  activeModalProductId = null;
}

/* ================================================================
   CART: CORE LOGIC
   ================================================================ */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, qty: 1 });
  }
  saveCart();
  renderCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
}

function updateQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart();
  renderCart();
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/* ================================================================
   CART: PERSISTENCE (localStorage)
   ================================================================ */
function saveCart() {
  localStorage.setItem("stride_cart", JSON.stringify(cart));
  updateCartCount();
}

function loadCart() {
  const saved = localStorage.getItem("stride_cart");
  cart = saved ? JSON.parse(saved) : [];
  cart = cart.map(item => {
    const product = products.find(productItem => productItem.id === item.id);
    return product && !item.image ? { ...item, image: product.image } : item;
  });
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

/* ================================================================
   RENDER: CART DRAWER
   ================================================================ */
function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const cartTotal = document.getElementById("cartTotal");

  emptyCart.hidden = cart.length > 0;

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-media">
        <img src="${item.image || getPlaceholderImage(item.category)}" alt="${item.name}">
      </div>
      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${formatPrice(item.price)}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="minus" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="plus" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}">Remove</button>
    </div>
  `).join("");

  cartTotal.textContent = formatPrice(calculateTotal());

  cartItemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const delta = btn.dataset.action === "plus" ? 1 : -1;
      updateQuantity(id, delta);
    });
  });

  cartItemsEl.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
  });
}

/* ================================================================
   CART DRAWER OPEN / CLOSE
   ================================================================ */
function openCart() {
  document.getElementById("cartDrawer").classList.add("is-open");
  document.getElementById("cartOverlay").classList.add("is-open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("is-open");
  document.getElementById("cartOverlay").classList.remove("is-open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
}

/* ================================================================
   CHECKOUT SUMMARY MODAL
   ================================================================ */
function openCheckout() {
  if (cart.length === 0) return;

  const summaryEl = document.getElementById("checkoutSummary");
  const total = calculateTotal();

  summaryEl.innerHTML = cart.map(item => `
    <div class="checkout-line">
      <span>${item.name} × ${item.qty}</span>
      <span>${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join("") + `
    <div class="checkout-total">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
  `;

  const message = cart.map(item => `- ${item.name} x${item.qty} (${formatPrice(item.price * item.qty)})`).join("%0A");
  const waLink = `https://wa.me/${CONFIG.whatsappNumber}?text=Hello, I would like to place an order:%0A${message}%0A%0ATotal: ${formatPrice(total)}`;
  document.getElementById("whatsappCheckout").setAttribute("href", waLink);

  document.getElementById("checkoutOverlay").classList.add("is-open");
}

function closeCheckout() {
  document.getElementById("checkoutOverlay").classList.remove("is-open");
}

/* ================================================================
   INIT: event listeners
   ================================================================ */
function init() {
  const brandLogo = document.getElementById("brandLogo");
  const brandNameEl = brandLogo.querySelector(".brand-name");

  if (brandNameEl) {
    brandNameEl.textContent = CONFIG.brandName;
  }

  brandLogo.setAttribute("aria-label", CONFIG.brandName);

  loadCart();
  renderFilters();
  renderProducts();
  renderCart();
  renderTestimonials();

  // nav category links jump to shop + apply filter
  document.querySelectorAll('.main-nav a[data-category]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activeCategory = link.dataset.category;
      renderFilters();
      renderProducts();
      document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
      mainNav.classList.remove("is-open");
    });
  });

  // cart drawer
  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  // checkout modal
  document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
  document.getElementById("checkoutClose").addEventListener("click", closeCheckout);
  document.getElementById("checkoutOverlay").addEventListener("click", (e) => {
    if (e.target.id === "checkoutOverlay") closeCheckout();
  });

  // product quick-view modal
  document.getElementById("productModalClose").addEventListener("click", closeProductModal);
  document.getElementById("productOverlay").addEventListener("click", (e) => {
    if (e.target.id === "productOverlay") closeProductModal();
  });
  document.getElementById("productModalMinus").addEventListener("click", () => {
    if (modalQty > 1) {
      modalQty--;
      document.getElementById("productModalQty").textContent = modalQty;
    }
  });
  document.getElementById("productModalPlus").addEventListener("click", () => {
    modalQty++;
    document.getElementById("productModalQty").textContent = modalQty;
  });
  document.getElementById("productModalAdd").addEventListener("click", () => {
    if (activeModalProductId === null) return;
    for (let i = 0; i < modalQty; i++) {
      addToCart(activeModalProductId);
    }
    closeProductModal();
  });

  // newsletter signup
  document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("newsletterSuccess").hidden = false;
    e.target.reset();
  });

  // search
  const searchToggle = document.getElementById("searchToggle");
  const searchBar = document.getElementById("searchBar");
  const searchInput = document.getElementById("searchInput");

  searchToggle.addEventListener("click", () => {
    searchBar.classList.add("is-open");
    searchInput.focus();
  });
  document.getElementById("searchClose").addEventListener("click", () => {
    searchBar.classList.remove("is-open");
    searchInput.value = "";
    searchTerm = "";
    renderProducts();
  });
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderProducts();
  });

  // login/signup placeholders — sambungkan ke sistem auth kalau perlu
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      alert("The login page is not connected yet. Replace this with your login link or modal.");
    });
  }
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      alert("The sign-up page is not connected yet. Replace this with your sign-up link or modal.");
    });
  }

  // mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // keyboard: close drawer/modal with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeCheckout();
      closeProductModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
