const Bills = {
  getParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  loadInvoice() {
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
    document.getElementById("invoice-date").innerText =
      this.getParameter("invoiceDate") || new Date().toLocaleDateString();

    let itemsParam = this.getParameter("items");
    let total = 0;
    if (itemsParam) {
      try {
        let items = JSON.parse(itemsParam);
        let tbody = document.querySelector("table.inventory tbody");
        tbody.innerHTML = "";

        items.forEach((it) => {
          const rate = parseFloat(it.rate) || 0;
          const qty = parseFloat(it.qty) || 0;
          const subtotal = rate * qty;
          total += subtotal;

          let row = document.createElement("tr");
          row.innerHTML = `
            <td><span>${it.item}</span></td>
            <td><span>${it.description || "Sin descripción"}</span></td>
            <td><span data-prefix>$</span><span>${rate.toFixed(2)}</span></td>
            <td><span>${qty}</span></td>
            <td><span data-prefix>$</span><span>${subtotal.toFixed(
              2
            )}</span></td>
          `;
          tbody.appendChild(row);
        });
      } catch (e) {
        console.error("Error al parsear items:", e);
      }
    }

    document.getElementById("amount-due").innerText = total.toFixed(2);
    document.getElementById("balance-total").innerText = total.toFixed(2);
    document.getElementById("balance-paid").innerText = total.toFixed(2);
    document.getElementById("balance-due").innerText = "0.00";
  },

  init() {
    window.addEventListener("DOMContentLoaded", () => this.loadInvoice());
  },
};

Bills.init();
