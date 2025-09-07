const Bills = {
  getParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  async loadInvoice() {
    const paymentIcons = {
      Visa: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png",
      Mastercard:
        "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    };

    const paymentMethod = this.getParameter("paymentMethod");
    const paymentTd = document.getElementById("payment-method");
    if (paymentTd && paymentIcons[paymentMethod]) {
      paymentTd.innerHTML = `
      <div style="display:flex; justify-content:center; align-items:center; gap:5px; width:100%;">
        <img src="${paymentIcons[paymentMethod]}" alt="${paymentMethod}" style="width:24px; height:24px;">
        <span>${paymentMethod}</span>
      </div>
    `;
    }

    document.getElementById("sender-name").innerText = "E-Commerce";
    document.getElementById("sender-address").innerText =
      "101 E. Chapman Ave, Orange, CA 92866";
    document.getElementById("sender-phone").innerText = "(800) 555-1234";

    document.getElementById("recipient-name").innerText =
      this.getParameter("recipientName") || "Nombre del Cliente";
    document.getElementById("recipient-address").innerText =
      this.getParameter("recipientAddress") || "Dirección del Cliente";

    document.getElementById("invoice-id").innerText =
      this.getParameter("invoiceId") || "000001";

    const invoiceDateParam =
      this.getParameter("invoiceDate") ||
      new Date().toLocaleDateString("es-ES");
    document.getElementById("invoice-date").innerText = invoiceDateParam;

    const totalVAT = parseFloat(this.getParameter("totalVAT")) || 0;
    const itemsParam = this.getParameter("items");
    let subtotal = 0;

    if (itemsParam) {
      try {
        const items = JSON.parse(itemsParam);
        const tbody = document.querySelector("table.inventory tbody");
        if (tbody) {
          tbody.innerHTML = "";
          items.forEach((item) => {
            const rate = parseFloat(item.rate) || 0;
            const qty = parseFloat(item.qty) || 0;
            const itemSubtotal = rate * qty;
            subtotal += itemSubtotal;

            const row = document.createElement("tr");
            row.innerHTML = `
            <td><span>${item.item}</span></td>
            <td><span>${item.description || "Sin descripción"}</span></td>
            <td><span data-prefix>$</span><span>${rate.toFixed(2)}</span></td>
            <td><span>${qty}</span></td>
            <td><span data-prefix>$</span><span>${itemSubtotal.toFixed(
              2
            )}</span></td>
          `;
            tbody.appendChild(row);
          });
        }
      } catch (error) {
        console.error("Error al parsear items:", error);
      }
    }

    const quotes = parseInt(this.getParameter("quotes")) || 1;
    const balanceTable = document.querySelector("table.balance tbody");
    if (balanceTable) {
      const row = document.createElement("tr");
      row.innerHTML = `
      <th>Cuotas</th>
      <td>${quotes > 1 ? quotes : "Pago único"}</td>
    `;
      balanceTable.appendChild(row);
    }

    const totalWithVAT = subtotal + totalVAT;
    document.getElementById("amount-due").innerText = totalWithVAT.toFixed(2);

    const balanceDueElement = document.getElementById("balance-due");

    if (quotes > 1) {
      const [day, month, year] = invoiceDateParam.split("/").map(Number);
      const invoiceDate = new Date(year, month - 1, day);

      invoiceDate.setDate(invoiceDate.getDate() + 10);
      invoiceDate.setMonth(invoiceDate.getMonth() + (quotes - 1));

      document.getElementById("invoice-expiration").innerText =
        invoiceDate.toLocaleDateString("es-ES");

      document.getElementById("balance-paid").innerText = "0.00";
      if (balanceDueElement)
        balanceDueElement.innerText = totalWithVAT.toFixed(2);
    } else {
      document.getElementById("invoice-expiration").innerText = "N/A";
      document.getElementById("balance-paid").innerText =
        totalWithVAT.toFixed(2);
      if (balanceDueElement) balanceDueElement.innerText = "0.00";
    }

    const subtotalElement = document.getElementById("balance-subtotal");
    if (subtotalElement) subtotalElement.innerText = subtotal.toFixed(2);

    const vatElement = document.getElementById("total-vat");
    if (vatElement) vatElement.innerText = totalVAT.toFixed(2);
  },

  init() {
    window.addEventListener("DOMContentLoaded", () => this.loadInvoice());
  },
};

Bills.init();
