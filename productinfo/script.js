const ProductPage = {
  BASEURL: "https://68b63a83e5dc090291b124c8.mockapi.io/api/v1/",
  productId: new URLSearchParams(window.location.search).get("id"),
  product: null,
  cart: JSON.parse(localStorage.getItem("cart")) || [],

  async loadProduct() {
    try {
      const res = await fetch(this.BASEURL + "products/" + this.productId);
      if (!res.ok) throw new Error("Error al cargar producto");

      this.product = await res.json();
      this.renderProduct();
      this.initAddToCartButton();
    } catch (error) {
      console.error(error);
      document.body.innerHTML = "<p>Error al cargar el producto.</p>";
    }
  },

  renderProduct() {
    document.getElementById("name").textContent = this.product.name;
    const imageEl = document.getElementById("image");
    imageEl.src = this.product.images[0];
    imageEl.alt = this.product.name;
    document.getElementById("description").textContent =
      this.product.fullDescription;
    document.getElementById(
      "price"
    ).textContent = `$${this.product.price.toFixed(2)}`;
    document.getElementById("stock").innerHTML =
      this.product.stock > 0
        ? `Stock disponible: ${this.product.stock}`
        : `<span style="color: red; font-weight: bold;">FUERA DE STOCK</span>`;
  },

  initAddToCartButton() {
    const btn = document.getElementById("addToCartBtn");
    btn.disabled = this.product.stock < 1 ? true : false;
    btn.textContent = this.isInCart()
      ? "Eliminar del carrito"
      : "Agregar al carrito";

    btn.addEventListener("click", () => {
      if (this.isInCart()) {
        this.removeFromCart();
      } else {
        this.addToCart();
      }
      btn.textContent = this.isInCart()
        ? "Eliminar del carrito"
        : "Agregar al carrito";
    });
  },

  isInCart() {
    return this.cart.some((p) => p.id === this.product.id);
  },

  addToCart() {
    if (this.product.stock > 0) {
      this.cart.push({ ...this.product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(this.cart));
      alert(`${this.product.name} agregado al carrito`);
    } else {
      alert("Producto sin stock disponible");
    }
  },

  removeFromCart() {
    this.cart = this.cart.filter((p) => p.id !== this.product.id);
    localStorage.setItem("cart", JSON.stringify(this.cart));
    alert(`${this.product.name} eliminado del carrito`);
  },

  initBackButton() {
    document.getElementById("backBtn").addEventListener("click", () => {
      window.history.back();
    });
  },

  init() {
    this.loadProduct();
    this.initBackButton();
  },
};

ProductPage.init();
