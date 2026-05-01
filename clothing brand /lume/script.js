// ════════════════════════════════════════
// DATA (mock products)
// ════════════════════════════════════════
import { products } from "./data/products.js";
import { addToCart, removeFromCart, getCart, getTotal } from "./modules/cart.js";

// ════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════
const pages = document.querySelectorAll(".page");

function goToPage(page) {
  pages.forEach(p => p.classList.remove("active"));
  document.querySelector(`#page-${page}`).classList.add("active");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-page]").forEach(el => {
  el.addEventListener("click", () => {
    goToPage(el.dataset.page);
  });
});

// ════════════════════════════════════════
// MOBILE MENU
// ════════════════════════════════════════
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

// ════════════════════════════════════════
// RENDER PRODUCTS
// ════════════════════════════════════════
const featuredGrid = document.getElementById("featuredGrid");
const shopGrid = document.getElementById("shopGrid");

function renderProducts(list, container) {
  container.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-cat">${p.cat}</div>
        <div class="product-bottom">
          <div class="product-price">$${p.price}</div>
          <button class="add-to-cart" data-id="${p.id}">Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

// initial render
renderProducts(products.slice(0, 4), featuredGrid);
renderProducts(products, shopGrid);

// ════════════════════════════════════════
// FILTER + SORT
// ════════════════════════════════════════
let currentFilter = "all";
let maxPrice = 300;
let sortType = "default";

const priceRange = document.getElementById("priceRange");
const priceLabel = document.getElementById("priceLabel");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");

document.querySelectorAll(".filter-chip").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    updateShop();
  });
});

priceRange.addEventListener("input", () => {
  maxPrice = priceRange.value;
  priceLabel.textContent = `Up to $${maxPrice}`;
  updateShop();
});

sortSelect.addEventListener("change", () => {
  sortType = sortSelect.value;
  updateShop();
});

function updateShop() {
  let filtered = products.filter(p =>
    (currentFilter === "all" || p.cat === currentFilter) &&
    p.price <= maxPrice
  );

  if (sortType === "price-asc") filtered.sort((a,b)=>a.price-b.price);
  if (sortType === "price-desc") filtered.sort((a,b)=>b.price-a.price);
  if (sortType === "name") filtered.sort((a,b)=>a.name.localeCompare(b.name));

  resultCount.textContent = `Showing ${filtered.length} items`;

  renderProducts(filtered, shopGrid);
}

// ════════════════════════════════════════
// CART
// ════════════════════════════════════════
let cart = [];

const cartBadge = document.getElementById("cartBadge");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartFooter = document.getElementById("cartFooter");

document.addEventListener("click", e => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = +e.target.dataset.id;
    const product = products.find(p => p.id === id);
    addToCart(product);
    updateCart();
    showToast("Added to bag ✨");
  }
});

function updateCart() {
  cartBadge.textContent = cart.length;

  if (getCart().length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><p>Your bag is empty!</p></div>`;
    cartFooter.style.display = "none";
    return;
  }
}

  cartFooter.style.display = "block";

  cartItems.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price}</div>
      </div>
      <button onclick="removeItem(${i})">✕</button>
    </div>
  `).join("");

  const total = getTotal();
  cartTotal.textContent = `$${total.toFixed(2)}`;

function removeItem(i) {
  removeFromCart(i);
  updateCart();
}

// ════════════════════════════════════════
// CART DRAWER
// ════════════════════════════════════════
const cartIcon = document.getElementById("cartIcon");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");

cartIcon.onclick = () => {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
};

cartClose.onclick = closeCart;
cartOverlay.onclick = closeCart;

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
}

// ════════════════════════════════════════
// AUTH MODAL
// ════════════════════════════════════════
const authModal = document.getElementById("authModal");

document.getElementById("openAuthBtn").onclick =
document.getElementById("openAuthBtnMob").onclick = () => {
  authModal.classList.add("open");
};

document.getElementById("closeModal").onclick = () => {
  authModal.classList.remove("open");
};

// switch tabs
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const formLogin = document.getElementById("formLogin");
const formSignup = document.getElementById("formSignup");

tabLogin.onclick = () => switchAuth("login");
tabSignup.onclick = () => switchAuth("signup");

function switchAuth(type) {
  tabLogin.classList.toggle("active", type === "login");
  tabSignup.classList.toggle("active", type === "signup");
  formLogin.classList.toggle("active", type === "login");
  formSignup.classList.toggle("active", type === "signup");
}

// ════════════════════════════════════════
// TOAST
// ════════════════════════════════════════
const toast = document.getElementById("toast");

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ════════════════════════════════════════
// SPARKLES ✨
// ════════════════════════════════════════
const sparkleField = document.getElementById("sparkleField");

for (let i = 0; i < 20; i++) {
  const s = document.createElement("div");
  s.className = "sparkle";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.setProperty("--dur", (2 + Math.random()*3) + "s");
  s.style.setProperty("--delay", Math.random() * 5 + "s");
  sparkleField.appendChild(s);
}