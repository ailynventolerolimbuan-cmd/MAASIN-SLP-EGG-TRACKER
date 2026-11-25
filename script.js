
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

// Save or update a sale
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const trays = parseFloat(traysInput.value);
  const price = parseFloat(priceInput.value);
  const date = dateInput.value;
  const customer = customerInput.value.trim();

  if (!trays || trays <= 0 || !price || price <= 0 || !date) {
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
  } else {
    sales.push({
      id: Date.now(),
      trays,
      price,
      date,
      customer
    });
  }

  form.reset();
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

    row.innerHTML = `
      <td>${sale.date}</td>
      <td>${sale.customer || "Walk-in customer"}</td>
      <td>${sale.trays}</td>
      <td>₱${sale.price.toFixed(2)}</td>
      <td>₱${amount.toFixed(2)}</td>
      <td>
        <button type="button" class="edit-btn" data-id="${sale.id}">Edit</button>
        <button type="button" class="delete-btn" data-id="${sale.id}">Delete</button>
      </td>
    `;

    salesList.appendChild(row);
  });

  totalSales.textContent = `₱${total.toFixed(2)}`;
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
        form.querySelector("button[type='submit']").textContent = "Save sale";
      }

      renderSales();
      formMessage.textContent = "Sale deleted successfully.";
    }
  }
});
