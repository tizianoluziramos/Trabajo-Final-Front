const CheckoutPage = {
  form: document.getElementById("paymentForm"),
  backBtn: document.getElementById("backBtn"),
  totalAmountDiv: document.getElementById("totalAmount"),
  checkoutBtn: document.getElementById("submitBtn"),

  cart: JSON.parse(localStorage.getItem("cart")) || [],
  total: 0,

  init() {
    this.calculateTotal();
    this.renderTotal();
    this.initInputs();
    this.initForm();
    this.initBackButton();
  },

  calculateTotal() {
    this.total = this.cart.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  },

  renderTotal() {
    this.totalAmountDiv.textContent = `Total a pagar: $${this.total.toFixed(
      2
    )}`;
    this.checkoutBtn.disabled = this.cart.length === 0;
  },

  validateLuhn(number) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  },

  getCardType(number) {
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) return "Visa";
    if (/^5[1-5][0-9]{14}$/.test(number)) return "Mastercard";
    return null;
  },

  validateForm() {
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
    let valid = true;

    const number = document
      .getElementById("cardNumber")
      .value.replace(/\s+/g, "");
    const exp = document.getElementById("cardExp").value.trim();
    const cvv = document.getElementById("cardCVV").value.trim();

    const type = this.getCardType(number);

    if (!type) {
      document.getElementById("numberError").textContent =
        "Solo Visa o Mastercard válidas";
      valid = false;
    } else if (!this.validateLuhn(number)) {
      document.getElementById("numberError").textContent =
        "Número de tarjeta inválido";
      valid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
      document.getElementById("expError").textContent =
        "Formato inválido MM/AA";
      valid = false;
    } else {
      const [month, year] = exp.split("/").map(Number);
      const today = new Date();
      const expiry = new Date(2000 + year, month - 1, 1);
      if (expiry < today) {
        document.getElementById("expError").textContent = "Tarjeta vencida";
        valid = false;
      }
    }

    if (!/^\d{3}$/.test(cvv)) {
      document.getElementById("cvvError").textContent = "CVV inválido";
      valid = false;
    }

    this.checkoutBtn.disabled = !valid || this.cart.length === 0;
    return valid;
  },

  initInputs() {
    document.getElementById("cardNumber").addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "").substring(0, 16);
      e.target.value = val.match(/.{1,4}/g)?.join(" ") || "";
      this.validateForm();
    });

    document.getElementById("cardExp").addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "").substring(0, 4);
      if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2);
      e.target.value = val;
      this.validateForm();
    });

    document.getElementById("cardCVV").addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3);
      this.validateForm();
    });
  },

  processPayment() {
    return new Promise((resolve, reject) => {
      this.checkoutBtn.disabled = true;
      this.checkoutBtn.textContent = "Procesando...";

      setTimeout(() => {
        const success = Math.random() > 0.1;
        if (success) resolve("Pago exitoso");
        else reject("Error en el pago, inténtalo de nuevo");
      }, 2000);
    });
  },

  showConfirmModal() {
    const self = this;
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = 1000;

    const modal = document.createElement("div");
    modal.style.background = "#fff";
    modal.style.padding = "30px";
    modal.style.borderRadius = "10px";
    modal.style.textAlign = "center";
    modal.style.minWidth = "300px";

    modal.innerHTML = `
    <p>¿Acepta hacer la compra?</p>
    <div style="margin-top: 15px;">
      <button id="confirmYes" style="
        padding: 10px 20px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
      ">Sí</button>
      <button id="confirmNo" style="
        padding: 10px 20px;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      ">No</button>
    </div>
  `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById("confirmYes").addEventListener("click", () => {
      document.body.removeChild(overlay);

      sessionStorage.setItem(
        "customerName",
        document.getElementById("cardName").value
      );
      sessionStorage.setItem(
        "customerAddress",
        document.getElementById("address").value
      );

      self
        .processPayment()
        .then(() => {
          window.location.href = "/pay/success";
        })
        .catch((err) => {
          alert(`❌ ${err}`);
          self.checkoutBtn.disabled = false;
          self.checkoutBtn.textContent = "Pagar";
        });
    });

    document.getElementById("confirmNo").addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
  },

  initForm() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!this.validateForm()) return;

      this.showConfirmModal();
    });
  },

  initBackButton() {
    this.backBtn.addEventListener("click", () => {
      window.location.href = "/cart";
    });
  },
};

CheckoutPage.init();
