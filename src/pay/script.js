import { Notification } from "../assets/notifymanager/script.js";

const CheckoutPage = {
  form: document.getElementById("paymentForm"),
  backBtn: document.getElementById("backBtn"),
  totalAmountDiv: document.getElementById("totalAmount"),
  checkoutBtn: document.getElementById("submitBtn"),

  cart: JSON.parse(localStorage.getItem("cart")) || [],
  total: 0,

  updateInstallmentInfo() {
    const select = document.getElementById("installments");
    const infoDiv = document.getElementById("installmentInfo");
    const months = parseInt(select.value);
    const amountPerMonth = this.total / months;

    localStorage.setItem("quotes", months);

    infoDiv.textContent =
      months > 1
        ? `Pagás en ${months} cuotas de ${amountPerMonth.toFixed(2)}`
        : "Pagás en un único pago";
  },

  init() {
    this.calculateTotal();
    this.renderTotal();
    this.initInputs();
    this.initForm();
    this.initBackButton();
  },

  calculateTotal() {
    const userCountry = "Argentina";
    const VAT_LOCAL = 0.21;
    const VAT_IMPORT = 0.1;

    this.subtotal = this.cart.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);

    this.totalIva = this.cart.reduce((sum, product) => {
      const vatRate = product.origin === userCountry ? VAT_LOCAL : VAT_IMPORT;
      return sum + product.price * product.quantity * vatRate;
    }, 0);

    this.total = this.subtotal + this.totalIva;
  },

  renderTotal() {
    if (this.totalIva > 0) {
      this.totalAmountDiv.textContent = `Total a pagar: ${this.total.toFixed(
        2
      )} (incluye ${this.totalIva.toFixed(2)} de IVA)`;
    } else {
      this.totalAmountDiv.textContent = `Total a pagar: ${this.total.toFixed(
        2
      )}`;
    }
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
    document.getElementById("installments").addEventListener("change", () => {
      this.updateInstallmentInfo();
    });

    this.updateInstallmentInfo();
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

      const amountToPay = this.total;

      setTimeout(() => {
        const cardNumber = document
          .getElementById("cardNumber")
          .value.replace(/\s+/g, "");
        const cardType = this.getCardType(cardNumber);
        localStorage.setItem("paymentMethod", cardType);

        resolve(`Pago exitoso de ${amountToPay.toFixed(2)}`);
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
    modal.className = "custom-modal";
    modal.innerHTML = `
  <p>¿Acepta hacer la compra?</p>
  <div class="modal-buttons">
    <button id="confirmYes" class="btn-yes">Sí</button>
    <button id="confirmNo" class="btn-no">No</button>
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
          window.location.href = "/pay/success/";
        })
        .catch((err) => {
          Notification.show(`❌ ${err}`);
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

      const confirmBuy = localStorage.getItem("confirmBuy") === "1";

      if (confirmBuy) {
        this.showConfirmModal();
      } else {
        sessionStorage.setItem(
          "customerName",
          document.getElementById("cardName").value
        );
        sessionStorage.setItem(
          "customerAddress",
          document.getElementById("address").value
        );

        this.processPayment()
          .then(() => {
            window.location.href = "/pay/success";
          })
          .catch((err) => {
            Notification.show(`❌ ${err}`);
            self.checkoutBtn.disabled = false;
            self.checkoutBtn.textContent = "Pagar";
          });
      }
    });
  },

  initBackButton() {
    this.backBtn.addEventListener("click", () => {
      window.location.href = "/cart";
    });
  },
};

if (localStorage.getItem("darkMode") === "1") {
  document.body.classList.add("dark");
}
CheckoutPage.init();
