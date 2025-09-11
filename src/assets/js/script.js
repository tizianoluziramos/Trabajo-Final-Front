import "./settings.js";
import { Notification } from "../notifymanager/script.js";

const productsMethods = {
  BASEURL: "https://68b63a83e5dc090291b124c8.mockapi.io/api/v1/",
  productsContainer: document.getElementById("products"),
  items: [],

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum) => sum + 1, 0);
    document.getElementById("cart-count").textContent = totalItems;
  },

  viewProductDetail(id) {
    window.location.href = `productinfo/?id=${id}`;
  },

  processProduct(product) {
    const li = document.createElement("li");
    li.classList.add("product-item");
    li.dataset.origin = product.origin || "Argentina"; // Guardamos el origen

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const inCart = cart.some((p) => p.id === product.id);

    const stockBanner =
      product.stock === 0
        ? `<p class="out-of-stock" style="color: red; font-weight: bold;">FUERA DE STOCK</p>`
        : "";

    // Obtenemos si se debe aplicar IVA
    const showTax = localStorage.getItem("showTax") === "1";
    const VAT_LOCAL = 0.21;
    const VAT_IMPORT = 0.1;
    let finalPrice = product.price;

    if (showTax) {
      finalPrice =
        product.origin === "Argentina"
          ? product.price * (1 + VAT_LOCAL)
          : product.price * (1 + VAT_IMPORT);
    }

    li.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.shortDescription}</p>
    <img src="${product.images[0]}" alt="${product.name}" width="150">
    <p class="product-price" data-base-price="${
      product.price
    }">Precio: ${finalPrice.toFixed(2)}</p>
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
      Notification.show(`${product.name} eliminado del carrito`);
    } else {
      cart.push({
        ...product,
        quantity: 1,
        description: product.shortDescription || "Sin descripción",
      });
      btn.textContent = "Eliminar del carrito";
      Notification.show(`${product.name} agregado al carrito`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    this.updateCartCount();
  },

  isSameData(newData) {
    return JSON.stringify(newData) === JSON.stringify(this.items);
  },

  searchbar() {
    const productSearchInput = document.getElementById("productSearch");

    function filterProducts() {
      const searchTerm = productSearchInput.value.toLowerCase();
      const productItems = document.querySelectorAll(".product-item");

      productItems.forEach((item) => {
        const name = item.querySelector("h3")?.textContent.toLowerCase() || "";
        const description =
          item.querySelector("p")?.textContent.toLowerCase() || "";

        if (name.includes(searchTerm) || description.includes(searchTerm)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    }

    productSearchInput.addEventListener("input", filterProducts);

    filterProducts();
  },

  async getData() {
    this.searchbar();
    const settingsToggle = document.getElementById("settingsToggle");
    const settingsPanel = document.getElementById("settingsPanel");
    const showStockToggle = document.getElementById("showStockToggle");

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (settingsPanel.style.left === "0px") {
          settingsPanel.style.left = "-320px";
        }
      }
    });

    showStockToggle.checked =
      (localStorage.getItem("ShowOutOfStock") || "1") === "1";

    settingsToggle.addEventListener("click", (e) => {
      e.preventDefault();
      if (settingsPanel.style.left === "0px") {
        settingsPanel.style.left = "-320px";
      } else {
        settingsPanel.style.left = "0px";
      }
    });

    showStockToggle.addEventListener("change", () => {
      localStorage.setItem(
        "ShowOutOfStock",
        showStockToggle.checked ? "1" : "0"
      );

      productsMethods.getData();
    });

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
      if (data.length === 0) {
        this.productsContainer.innerHTML =
          "<p>No hay productos disponibles.</p>";
        return;
      } else {
        const showOut = localStorage.getItem("ShowOutOfStock");
        if (showOut === "0") {
          data = data.filter((p) => p.stock > 0);
        }

        data.forEach((product) => {
          this.productsContainer.appendChild(this.processProduct(product));
        });
      }
    } catch (error) {
      console.error(error);
      this.productsContainer.innerHTML =
        "<p>Error al cargar los productos.</p>";
    }
  },
};

productsMethods.getData();
setInterval(() => productsMethods.getData(), 10000);
productsMethods.updateCartCount();
