const form = document.getElementById("sale-form");
const traysInput = document.getElementById("trays");
const priceInput = document.getElementById("price");
const dateInput = document.getElementById("sale-date");
const customerInput = document.getElementById("customer");
const salesList = document.getElementById("sales-list");
const totalSales = document.getElementById("total-sales");
const formMessage = document.getElementById("form-message");
const emptyState = document.getElementById("empty-state");

const STORAGE_KEY = "maasin-slp-egg-sales";
let sales = loadSales();
let editingId = null;

function loadSales() {
  try {
    const savedSales = JSON.parse(localStorage.getItem(STORAGE_KEY));

    return Array.isArray(savedSales)
      ? savedSales.filter(sale =>
          Number.isFinite(Number(sale.trays)) &&
          Number.isFinite(Number(sale.price)) &&
          typeof sale.date === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function saveSales() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}

// Save or update a sale
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const trays = parseFloat(traysInput.value);
  const price = parseFloat(priceInput.value);
  const date = dateInput.value;
  const customer = customerInput.value.trim();

  if (!trays || trays <= 0 || !price || price <= 0 || !date) {
    formMessage.textContent = "Please enter valid sale details.";
    (!trays || trays <= 0 ? traysInput : !price || price <= 0 ? priceInput : dateInput).focus();
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
  } else {
    sales.push({
      id: Date.now(),
      trays,
      price,
      date,
      customer
    });
  }

  saveSales();
  form.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  formMessage.textContent = "Sale saved successfully!";
  renderSales();
});

// Display sales
function renderSales() {
  salesList.innerHTML = "";
  let total = 0;

  sales.forEach(sale => {
    const amount = sale.trays * sale.price;
    total += amount;

    const row = document.createElement("tr");
    const values = [
      sale.date,
      sale.customer || "Walk-in customer",
      sale.trays,
      `₱${Number(sale.price).toFixed(2)}`,
      `₱${amount.toFixed(2)}`
    ];

    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actions = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.dataset.id = sale.id;
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.dataset.id = sale.id;
    deleteButton.textContent = "Delete";

    actions.append(editButton, deleteButton);
    row.appendChild(actions);

    salesList.appendChild(row);
  });

  totalSales.textContent = `₱${total.toFixed(2)}`;
  emptyState.hidden = sales.length > 0;
}

// Edit sale
salesList.addEventListener("click", function (event) {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("edit-btn")) {
    const sale = sales.find(item => item.id === id);

    if (!sale) return;

    traysInput.value = sale.trays;
    priceInput.value = sale.price;
    dateInput.value = sale.date;
    customerInput.value = sale.customer;

    editingId = id;
    form.querySelector("button[type='submit']").textContent = "Update sale";
    formMessage.textContent = "Edit the sale details, then click Update sale.";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete sale
  if (event.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this sale?");

    if (confirmDelete) {
      sales = sales.filter(item => item.id !== id);

      if (editingId === id) {
        editingId = null;
        form.reset();
        dateInput.value = new Date().toISOString().slice(0, 10);
        form.querySelector("button[type='submit']").textContent = "Save sale";
      }

      saveSales();
      renderSales();
      formMessage.textContent = "Sale deleted successfully.";
    }
  }
});

dateInput.value = new Date().toISOString().slice(0, 10);
renderSales();
