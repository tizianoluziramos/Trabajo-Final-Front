const darkToggle = document.getElementById("darkModeToggle");

darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkToggle.checked);
  localStorage.setItem("darkMode", darkToggle.checked ? "1" : "0");
});

if (localStorage.getItem("darkMode") === "1") {
  document.body.classList.add("dark");
  darkToggle.checked = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkModeToggle");
  darkToggle.addEventListener("change", () => {
    document
      .getElementById("productSearch")
      .classList.toggle("dark", darkToggle.checked);
    document.body.classList.toggle("dark", darkToggle.checked);
    localStorage.setItem("darkMode", darkToggle.checked ? "1" : "0");
  });

  if (localStorage.getItem("darkMode") === "1") {
    document.body.classList.add("dark");
    document.getElementById("productSearch").classList.add("dark");
    darkToggle.checked = true;
  } else {
    document.getElementById("productSearch").classList.remove("dark");
  }
  const closeSettingsBtn = document.getElementById("closeSettings");
  const settingsPanel = document.getElementById("settingsPanel");

  closeSettingsBtn.addEventListener("click", () => {
    settingsPanel.style.left = "-320px";
  });
});

const keyboardToggle = document.getElementById("keyboardShortcutsToggle");
if (!localStorage.getItem("KeyboardShortcuts")) {
  localStorage.setItem("KeyboardShortcuts", "1");
}
keyboardToggle.checked = localStorage.getItem("KeyboardShortcuts") === "1";

let activeIndex = -1;

function getProducts() {
  return Array.from(document.querySelectorAll(".product-item"));
}

function setActiveProduct(index) {
  const products = getProducts();
  if (!products.length) return;

  if (index < 0) index = 0;
  if (index >= products.length) index = products.length - 1;

  products.forEach((p) => p.classList.remove("active"));
  activeIndex = index;
  const activeProduct = products[activeIndex];
  activeProduct.classList.add("active");
  activeProduct.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

function handleKeyboardShortcuts(e) {
  if (!keyboardToggle.checked) return;
  const products = getProducts();
  if (!products.length) return;

  if (activeIndex === -1) activeIndex = 0;

  switch (e.key) {
    case "ArrowRight":
      e.preventDefault();
      setActiveProduct(activeIndex + 1);
      break;
    case "ArrowLeft":
      e.preventDefault();
      setActiveProduct(activeIndex - 1);
      break;
    case "Enter":
      e.preventDefault();
      const product = products[activeIndex];
      if (product) product.click();
      break;
  }
}

keyboardToggle.addEventListener("change", () => {
  localStorage.setItem("KeyboardShortcuts", keyboardToggle.checked ? "1" : "0");
});

document.addEventListener("keydown", handleKeyboardShortcuts);

document.addEventListener("DOMContentLoaded", () => {
  const settingsPanel = document.getElementById("settingsPanel");
  const openBtn = document.getElementById("settingsToggle");
  const closeBtn = document.getElementById("closeSettings");

  closeBtn.addEventListener("click", () => {
    settingsPanel.classList.remove("open");
    // Si me preguntas porque carajos puse el reloader(al que me corrija)
    // Le puse esto porque:
    // - Algunas veces el boton falla, la transicion jode el boton
    // Al recargarlo hago que algunas opciones se recarguen correctamente
    // evitando errores graves en el codigo.
    location.reload();
  });
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    settingsPanel.classList.add("open");
  });
});

const taxToggle = document.getElementById("taxToggle");

taxToggle.checked = localStorage.getItem("showTax") === "1";

function updatePrices() {
  const showTax = taxToggle.checked;
  const VAT_LOCAL = 0.21;
  const VAT_IMPORT = 0.1;

  document.querySelectorAll(".product-item").forEach((li) => {
    const priceEl = li.querySelector(".product-price");
    if (!priceEl) return;

    const basePrice = parseFloat(priceEl.dataset.basePrice);
    const origin = li.dataset.origin || "Argentina";

    let finalPrice = basePrice;
    if (showTax) {
      finalPrice =
        basePrice * (origin === "Argentina" ? 1 + VAT_LOCAL : 1 + VAT_IMPORT);
    }

    priceEl.textContent = `Precio: $${finalPrice.toFixed(2)}`;
  });
}

taxToggle.addEventListener("change", () => {
  localStorage.setItem("showTax", taxToggle.checked ? "1" : "0");
});

document.addEventListener("DOMContentLoaded", () => {
  updatePrices();
});
