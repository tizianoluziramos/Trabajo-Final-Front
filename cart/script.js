const CartPage = {
  cartList: document.getElementById("cartList"),
  totalPriceEl: document.getElementById("totalPrice"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  backBtn: document.getElementById("backBtn"),

  cart: JSON.parse(localStorage.getItem("cart")) || [],

  init() {
    this.renderCart();
    this.initBackButton();
  },

  renderCart() {
    this.cartList.innerHTML = "";

    if (this.cart.length === 0) {
      this.cartList.innerHTML = "<p>Tu carrito está vacío.</p>";
      this.totalPriceEl.textContent = "";
      this.checkoutBtn.disabled = true;
      return;
    }

    let total = 0;

    this.cart.forEach((product, index) => {
      total += product.price * product.quantity;

      const li = document.createElement("li");
      li.classList.add("cart-item");

      li.innerHTML = `
  <div class="cart-item-content">
    <img src="${product.images[0]}" alt="${product.name}">
    <div>
      <h3>${product.name}</h3>
      <p>Precio: ${product.price.toFixed(2)}</p>
      <label>
        Cantidad:
        <input type="number" min="1" max="${product.stock}" value="${
        product.quantity
      }" data-index="${index}" class="quantity-input">
      </label>
    </div>
  </div>
  <button class="remove-btn" data-index="${index}">Eliminar</button>
`;

      this.cartList.appendChild(li);
    });

    this.totalPriceEl.textContent = `Total: ${total.toFixed(2)}`;
    this.checkoutBtn.disabled = false;

    this.initQuantityInputs();
    this.initRemoveButtons();
  },

  initQuantityInputs() {
    const quantityInputs = this.cartList.querySelectorAll(".quantity-input");
    quantityInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        const idx = e.target.dataset.index;
        let value = parseInt(e.target.value);

        if (isNaN(value) || value < 1) value = 1;
        if (value > this.cart[idx].stock) value = this.cart[idx].stock;

        e.target.value = value;
        this.cart[idx].quantity = value;
        this.saveCart();
        this.updateTotal();
      });
    });
  },

  initRemoveButtons() {
    const removeButtons = this.cartList.querySelectorAll(".remove-btn");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const idx = e.target.dataset.index;
        this.removeFromCart(idx);
      });
    });
  },

  updateTotal() {
    const total = this.cart.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    this.totalPriceEl.textContent = `Total: ${total.toFixed(2)}`;
  },

  removeFromCart(index) {
    const removed = this.cart.splice(index, 1)[0];
    this.saveCart();
    alert(`${removed.name} eliminado del carrito`);
    this.renderCart();
  },

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  },

  initBackButton() {
    this.backBtn.addEventListener("click", () => {
      window.location.href = "/";
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "1") {
    document.body.classList.add("dark");
  }
  CartPage.init();
});
