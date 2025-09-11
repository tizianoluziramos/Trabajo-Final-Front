import { Notification } from "/assets/notifymanager/script.js";

const ProductPage = {
  BASEURL: "https://68b63a83e5dc090291b124c8.mockapi.io/api/v1/",
  productId: new URLSearchParams(window.location.search).get("id"),
  product: null,
  cart: JSON.parse(localStorage.getItem("cart")) || [],

  reviewSender() {
    const submitBtn = document.getElementById("submitReviewBtn");
    submitBtn.addEventListener("click", async () => {
      const name = document.getElementById("reviewName").value.trim();
      const comment = document.getElementById("reviewComment").value.trim();
      const rating = parseInt(document.getElementById("reviewRating").value);

      if (!name || !comment) {
        Notification.show("Por favor completa tu nombre y comentario");
        return;
      }

      const newReview = { name, comment, rating };

      if (!this.product.reviews) this.product.reviews = [];
      this.product.reviews.push(newReview);

      try {
        const res = await fetch(`${this.BASEURL}products/${this.productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...this.product }),
        });

        if (!res.ok) throw new Error("Error al guardar la reseña");

        this.product = await res.json();
        this.renderReviews();

        document.getElementById("reviewName").value = "";
        document.getElementById("reviewComment").value = "";
        document.getElementById("reviewRating").value = "5";

        Notification.show("¡Gracias por tu reseña!");
      } catch (error) {
        console.error(error);
        Notification.show("No se pudo enviar la reseña. Intenta de nuevo.");
      }
    });
  },

  async loadProduct() {
    try {
      const res = await fetch(this.BASEURL + "products/" + this.productId);
      if (!res.ok) throw new Error("Error al cargar producto");

      this.product = await res.json();
      this.renderProduct();
      this.initAddToCartButton();
      this.reviewSender();
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
    const seller = document.getElementById("seller");
    seller.textContent = `Vendido por: ${this.product.seller}`;
    seller.addEventListener("click", () => {
      window.open(this.product.sellerUrl, "_blank");
    });
    document.getElementById("origin").textContent = `Origen: ${
      this.product.origin ? this.product.origin : "Desconocido"
    }`;
    document.getElementById("description").textContent =
      this.product.fullDescription;
    document.getElementById(
      "price"
    ).textContent = `$${this.product.price.toFixed(2)}`;
    document.getElementById("stock").innerHTML =
      this.product.stock > 0
        ? `Stock disponible: ${this.product.stock}`
        : `<span style="color: red; font-weight: bold;">FUERA DE STOCK</span>`;
    this.renderReviews();
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

  renderReviews() {
    const reviewsContainer = document.getElementById("reviews");
    reviewsContainer.innerHTML = ""; // Limpiar antes de renderizar

    if (!this.product.reviews || this.product.reviews.length === 0) {
      reviewsContainer.textContent = "No hay reseñas aún.";
      return;
    }

    this.product.reviews.forEach((review) => {
      const reviewEl = document.createElement("div");
      reviewEl.classList.add("review");
      reviewEl.innerHTML = `
      <strong>${review.name}</strong> 
      - <span>${"⭐".repeat(review.rating)}</span>
      <p>${review.comment}</p>
    `;
      reviewsContainer.appendChild(reviewEl);
    });
  },

  addToCart() {
    if (this.product.stock > 0) {
      this.cart.push({ ...this.product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(this.cart));
      Notification.show(`${this.product.name} agregado al carrito`);
    } else {
      Notification.show("Producto sin stock disponible");
    }
  },

  removeFromCart() {
    this.cart = this.cart.filter((p) => p.id !== this.product.id);
    localStorage.setItem("cart", JSON.stringify(this.cart));
    Notification.show(`${this.product.name} eliminado del carrito`);
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

if (localStorage.getItem("darkMode") === "1") {
  document.body.classList.add("dark");
}
ProductPage.init();
