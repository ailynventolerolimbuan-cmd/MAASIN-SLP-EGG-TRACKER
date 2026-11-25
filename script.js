const STORAGE_KEY = "maasin-slp-egg-sales";

const saleForm = document.querySelector("#sale-form");
const traysInput = document.querySelector("#trays");
const priceInput = document.querySelector("#price");
const dateInput = document.querySelector("#sale-date");
const customerInput = document.querySelector("#customer");
const formMessage = document.querySelector("#form-message");
const salesList = document.querySelector("#sales-list");
const totalSales = document.querySelector("#total-sales");
const emptyState = document.querySelector("#empty-state");

let sales = loadSales();

function loadSales() {
  try {
    const savedSales = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedSales) ? savedSales : [];
  } catch {
    return [];
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP"
  }).format(amount);
}

function formatDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function renderSales() {
  salesList.replaceChildren();

  let grandTotal = 0;

  sales.forEach((sale) => {
    const saleTotal = sale.trays * sale.price;
    grandTotal += saleTotal;

    const row = document.createElement("tr");
    const values = [
      formatDate(sale.date),
      sale.customer || "Walk-in",
      sale.trays,
      formatCurrency(sale.price),
      formatCurrency(saleTotal)
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    salesList.append(row);
  });

  totalSales.textContent = formatCurrency(grandTotal);
  emptyState.hidden = sales.length > 0;
}

saleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const trays = Number(traysInput.value);
  const price = Number(priceInput.value);
  const date = dateInput.value;
  const customer = customerInput.value.trim();

  if (!Number.isFinite(trays) || trays <= 0) {
    formMessage.textContent = "Enter a valid number of trays.";
    traysInput.focus();
    return;
  }

  if (!Number.isFinite(price) || price <= 0) {
    formMessage.textContent = "Enter a valid price per tray.";
    priceInput.focus();
    return;
  }

  if (!date) {
    formMessage.textContent = "Select a sale date.";
    dateInput.focus();
    return;
  }

  sales.unshift({ trays, price, date, customer });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));

  renderSales();
  saleForm.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
  formMessage.textContent = "Sale saved successfully.";
});

dateInput.value = new Date().toISOString().split("T")[0];
renderSales();
