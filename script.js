// =========================
// DATA AWAL
// =========================
const stockItems = [
  { nama: "Telur Ayam (1 dus)", stok: 3, ambang: 5, satuan: "dus", emoji: "🥚" },
  { nama: "Minyak Goreng 1L", stok: 7, ambang: 10, satuan: "botol", emoji: "🧴" },
  { nama: "Beras 5kg", stok: 12, ambang: 8, satuan: "karung", emoji: "🍚" }
];

let transactions = [
  { waktu: "19:42", no: "TRX-047", barang: "Mie + Telur", total: 18000, kasir: "Budi" },
  { waktu: "19:35", no: "TRX-046", barang: "Beras + Gula", total: 92000, kasir: "Siti" }
];

// =========================
// FORMAT
// =========================
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

// =========================
// RENDER TABLE (DOM)
// =========================
function renderTable() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  transactions.forEach(trx => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${trx.waktu}</td>
      <td>${trx.no}</td>
      <td>${trx.barang}</td>
      <td>${formatRupiah(trx.total)}</td>
      <td>${trx.kasir}</td>
    `;

    tbody.appendChild(row);
  });
}

// =========================
// THRESHOLD ALARM
// =========================
function checkStockAlarm() {
  stockItems.forEach(item => {
    if (item.stok <= item.ambang) {
      console.log("⚠️ Alarm:", item.nama, "stok kritis!");
    }
  });
}

// =========================
// EVENT HANDLING
// =========================
function refreshDashboard() {
  renderTable();
  checkStockAlarm();
  document.getElementById("last-update").textContent =
    new Date().toLocaleString("id-ID");
}

// =========================
// NAVIGASI
// =========================
function showSection(section) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById(section).classList.add("active");
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  renderTable();
  checkStockAlarm();
});

// agar bisa dipanggil dari HTML
window.refreshDashboard = refreshDashboard;
window.showSection = showSection;
