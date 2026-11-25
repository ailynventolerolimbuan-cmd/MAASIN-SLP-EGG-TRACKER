
const form = document.getElementById("sale-form");
const traysInput = document.getElementById("trays");
const priceInput = document.getElementById("price");
const dateInput = document.getElementById("sale-date");
const customerInput = document.getElementById("customer");
const salesList = document.getElementById("sales-list");
const totalSales = document.getElementById("total-sales");
const formMessage = document.getElementById("form-message");

let sales = [];
let editingId = null;

// SAVE OR UPDATE SALE
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const trays = Number(traysInput.value);
  const price = Number(priceInput.value);
  const date = dateInput.value;
  const customer = customerInput.value.trim();

  if (
    trays <= 0 || !Number.isFinite(trays) ||
    price <= 0 || !Number.isFinite(price) ||
    !date
  ) {
    formMessage.textContent = "Please enter valid sale details.";
    return;
  }

  if (editingId !== null) {
    const sale = sales.find(item => item.id === editingId);

    if (sale) {
      sale.trays = trays;
      sale.price = price;
      sale.date = date;
      sale.customer = customer;
    }

    editingId = null;
    form.querySelector("button[type='submit']").textContent = "Save sale";
    formMessage.textContent = "Order updated successfully!";
  } else {
    sales.push({
      id: Date.now() + Math.random(),
      trays: trays,
      price: price,
      date: date,
      customer: customer
    });

    formMessage.textContent = "Sale saved successfully!";
  }

  form.reset();
  renderSales();
});

// DISPLAY SALES
function renderSales() {
  salesList.innerHTML = "";

  let total = 0;

  sales.forEach(sale => {
    const amount = sale.trays * sale.price;
    total += amount;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${sale.date}</td>
      <td>${escapeHTML(sale.customer || "Walk-in customer")}</td>
      <td>${sale.trays}</td>
      <td>₱${sale.price.toFixed(2)}</td>
      <td>₱${amount.toFixed(2)}</td>
      <td>
        <button type="button" class="edit-btn" data-id="${sale.id}">
          Edit
        </button>
        <button type="button" class="delete-btn" data-id="${sale.id}">
          Delete
        </button>
      </td>
    `;

    salesList.appendChild(row);
  });

  totalSales.textContent = `₱${total.toFixed(2)}`;

  const emptyState = document.getElementById("empty-state");

  if (emptyState) {
    emptyState.style.display = sales.length === 0 ? "block" : "none";
  }
}

// EDIT AND DELETE BUTTONS
salesList.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) return;

  const id = Number(button.dataset.id);
  const sale = sales.find(item => item.id === id);

  if (!sale) return;

  // EDIT ORDER
  if (button.classList.contains("edit-btn")) {
    traysInput.value = sale.trays;
    priceInput.value = sale.price;
    dateInput.value = sale.date;
    customerInput.value = sale.customer;

    editingId = id;

    form.querySelector("button[type='submit']").textContent = "Update sale";

    formMessage.textContent = "Edit the order, then click Update sale.";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // DELETE ORDER
  if (button.classList.contains("delete-btn")) {
    if (confirm("Are you sure you want to delete this order?")) {
      sales = sales.filter(item => item.id !== id);

      if (editingId === id) {
        editingId = null;
        form.reset();
        form.querySelector("button[type='submit']").textContent = "Save sale";
      }

      renderSales();
      formMessage.textContent = "Order deleted successfully!";
    }
  }
});

// PREVENT HTML IN CUSTOMER NAME
function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}

// INITIAL DISPLAY
renderSales();
