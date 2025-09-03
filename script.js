const productsMethods = {
  BASEURL: "https://68b63a83e5dc090291b124c8.mockapi.io/api/v1/",
  productsContainer: document.getElementById("products"),
  items: [],

  viewProductDetail(id) {
    window.location.href = `productinfo/?id=${id}`;
  },

  processProduct(product) {
    const li = document.createElement("li");
    li.classList.add("product-item");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const inCart = cart.some((p) => p.id === product.id);

    const stockBanner =
      product.stock === 0
        ? `<p class="out-of-stock" style="color: red; font-weight: bold;">FUERA DE STOCK</p>`
        : "";

    li.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.shortDescription}</p>
    <img src="${product.images[0]}" alt="${product.name}" width="150">
    <p>Precio: $${product.price.toFixed(2)}</p>
    ${stockBanner}
    <button id="cartBtn-${product.id}" ${product.stock === 0 ? "disabled" : ""}>
      ${inCart ? "Eliminar del carrito" : "Agregar al carrito"}
    </button>
  `;

    li.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        this.viewProductDetail(product.id);
      }
    });

    const cartBtn = li.querySelector(`#cartBtn-${product.id}`);
    cartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleCart(product.id);
    });

    return li;
  },

  toggleCart(id) {
    const product = this.items.find((p) => p.id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((p) => p.id === id);
    const btn = document.getElementById(`cartBtn-${id}`);

    if (index >= 0) {
      cart.splice(index, 1);
      btn.textContent = "Agregar al carrito";
      alert(`${product.name} eliminado del carrito`);
    } else {
      cart.push({ ...product, quantity: 1 });
      btn.textContent = "Eliminar del carrito";
      alert(`${product.name} agregado al carrito`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  },

  isSameData(newData) {
    return JSON.stringify(newData) === JSON.stringify(this.items);
  },

  async getData() {
    try {
      const res = await fetch(this.BASEURL + "products");
      if (!res.ok) throw new Error("Error al obtener productos");

      let data = await res.json();
      if (this.isSameData(data)) return;

      this.items = data;

      data.sort((a, b) => {
        if (a.stock === 0 && b.stock > 0) return 1;
        if (a.stock > 0 && b.stock === 0) return -1;
        if (a.stock === 0 && b.stock === 0) {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });

      this.productsContainer.innerHTML = "";
      data.forEach((product) => {
        this.productsContainer.appendChild(this.processProduct(product));
      });
    } catch (error) {
      console.error(error);
      this.productsContainer.innerHTML =
        "<p>Error al cargar los productos.</p>";
    }
  },
};

productsMethods.getData();
setInterval(() => productsMethods.getData(), 5000);
