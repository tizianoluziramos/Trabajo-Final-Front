const Success = {
  customer: {
    name: sessionStorage.getItem("customerName") || "Desconocido",
    address: sessionStorage.getItem("customerAddress") || "No proporcionada",
  },

  cart: JSON.parse(localStorage.getItem("cart")) || [],

  generateInvoiceId() {
    const id = "INV-" + Date.now();
    localStorage.setItem("invoiceId", id);
    return id;
  },

  calculateTotal() {
    const userCountry = "Argentina";
    const VAT_LOCAL = 0.21;
    const VAT_IMPORT = 0.1;

    let subtotal = 0;
    let totalIva = 0;

    this.cart.forEach((item) => {
      subtotal += item.price * item.quantity;
      const vatRate = item.origin === userCountry ? VAT_LOCAL : VAT_IMPORT;
      totalIva += item.price * item.quantity * vatRate;
    });

    this.totalIva = totalIva;
    return subtotal + totalIva;
  },

  renderCart() {
    let html = `
    <p><strong>Cliente:</strong> ${this.customer.name}</p>
    <p><strong>Dirección:</strong> ${this.customer.address}</p>
    <table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio unitario</th>
          <th>Subtotal</th>
          <th>Cuotas</th>
        </tr>
      </thead>
      <tbody>
  `;

    this.cart.forEach((item) => {
      html += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>${(item.price * item.quantity).toFixed(2)}</td>
        <td>${localStorage.getItem("quotes")}</td>
      </tr>
    `;
    });

    html += `
      </tbody>
    </table>
    <p><strong>Total pagado:</strong> ${this.calculateTotal().toFixed(
      2
    )} (incluye ${this.totalIva.toFixed(2)} de IVA)</p>
    <button id="printBtn" style="
      padding: 10px 20px;
      margin-top: 15px;
      background-color: #1d3557;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    ">Imprimir Factura</button>
   
  `;

    const orderInfoEl = document.getElementById("orderInfo");
    if (!orderInfoEl) return;
    orderInfoEl.innerHTML = html;

    const printBtn = document.getElementById("printBtn");

    if (printBtn) printBtn.addEventListener("click", () => this.printInvoice());
  },

  async printInvoice() {
    try {
      const mappedItems = this.cart.map((p) => ({
        item: p.name,
        description: p.description || "Sin descripción",
        rate: p.price,
        qty: p.quantity,
      }));

      const invoiceId =
        localStorage.getItem("invoiceId") || this.generateInvoiceId();

      const params = new URLSearchParams({
        recipientName: this.customer.name,
        recipientAddress: this.customer.address,
        invoiceId: invoiceId,
        invoiceDate: new Date().toLocaleDateString(),
        amountDue: this.calculateTotal().toFixed(2),
        totalVAT: this.totalIva.toFixed(2),
        items: JSON.stringify(mappedItems),
        quotes: localStorage.getItem("quotes"),
        paymentMethod: localStorage.getItem("paymentMethod"),
      });

      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      console.log("/pay/bills/index.html?" + params.toString());
      iframe.src = "/pay/bills/index.html?" + params.toString();
      document.body.appendChild(iframe);

      await new Promise((resolve, reject) => {
        iframe.onload = () => resolve();
        iframe.onerror = () => reject(new Error("No se pudo cargar el iframe"));
      });

      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => document.body.removeChild(iframe), 1000);
    } catch (error) {
      console.error("No se pudo imprimir la factura:", error);
    }
  },

  showEmptyModal() {
    document.body.innerHTML = "";

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
      <p>Usted no ha comprado nada</p>
      <button id="modalBackBtn" style="
        padding: 10px 20px;
        margin-top: 15px;
        background-color: #e63946;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      ">Volver al inicio</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById("modalBackBtn").addEventListener("click", () => {
      this.backToHome();
    });
  },

  async updateStock() {
    for (const item of this.cart) {
      try {
        const res = await fetch(
          `https://68b63a83e5dc090291b124c8.mockapi.io/api/v1/products/${item.id}`
        );
        if (!res.ok) throw new Error("No se pudo obtener el producto");
        const productData = await res.json();

        let newStock = productData.stock - item.quantity;
        if (newStock < 0) newStock = 0;

        const updateRes = await fetch(
          `https://68b63a83e5dc090291b124c8.mockapi.io/api/v1/products/${item.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: newStock }),
          }
        );

        const updatedData = await updateRes.json();
        console.log(
          `Stock actualizado para ${updatedData.name}: ${updatedData.stock}`
        );
      } catch (err) {
        console.error("Error actualizando stock:", err);
      }
    }
  },

  backToHome() {
    localStorage.removeItem("cart");
    localStorage.removeItem("invoiceId");
    sessionStorage.clear();
    window.location.href = "/";
  },

  async init() {
    if (!sessionStorage.getItem("customerName") || this.cart.length === 0) {
      this.showEmptyModal();
    } else {
      this.renderCart();
      await this.updateStock();
      document
        .getElementById("backBtn")
        .addEventListener("click", () => this.backToHome());
    }
  },
};

if (localStorage.getItem("darkMode") === "1") {
  document.body.classList.add("dark");
}

Success.init();
