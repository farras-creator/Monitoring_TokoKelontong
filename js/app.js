let dataGlobal = [];
let currentFilter = "all";

const container = document.getElementById("container");
const errorBox = document.getElementById("errorBox");
const summary = document.getElementById("summary");

// ================= AUTO LOAD =================
document.addEventListener("DOMContentLoaded", loadSensorData);

// ================= FETCH =================
async function loadSensorData() {
  try {
    errorBox.innerText = "";

    const res = await fetch("data/operasional&stok.json");
    if (!res.ok) throw new Error("JSON tidak ditemukan");

    dataGlobal = await res.json();

    filterData("all"); // langsung tampil semua
  } catch (err) {
    errorBox.innerText = err.message;
  }
}

// ================= STATUS =================
function getStatus(item) {
  if (item.kategori === "stok") {
    if (item.jumlah <= item.ambang_darurat) return ["DARURAT", "bg-red-500 text-white"];
    if (item.jumlah <= item.ambang_waspada) return ["WASPADA", "bg-yellow-400"];
    return ["AMAN", "bg-green-400"];
  }

  if (item.kategori === "operasional") {
    if (item.status === "ONLINE" || item.status === "BUKA")
      return ["AKTIF", "bg-green-400"];
    else
      return ["NONAKTIF", "bg-gray-400"];
  }
}

// ================= FILTER =================
function filterData(type) {
  currentFilter = type;

  let filtered =
    type === "all"
      ? dataGlobal
      : dataGlobal.filter(item => item.kategori === type);

  renderData(filtered);

  // Summary hanya untuk stok
  if (type === "operasional") {
    summary.innerHTML = ""; // sembunyikan
  } else {
    renderSummary();
  }
}

// ================= RENDER =================
function renderData(data) {
  container.innerHTML = "";

  data.forEach(item => {
    const [status, color] = getStatus(item);

    const card = document.createElement("div");
    card.className = "card bg-white p-5 rounded-xl shadow";

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold">${item.nama}</h2>
        <span class="px-3 py-1 rounded ${color}">${status}</span>
      </div>

      <div class="mt-4 text-2xl font-semibold">
        ${
          item.kategori === "stok"
            ? item.jumlah + " " + item.satuan
            : item.status
        }
      </div>

      <p class="text-sm text-gray-500 mt-2">${item.keterangan}</p>

      ${
        item.kategori === "stok"
          ? `
          <div class="mt-3 text-sm bg-gray-100 p-3 rounded-lg">
            ⚠️ Waspada: ${item.ambang_waspada} ${item.satuan}<br>
            🚨 Darurat: ${item.ambang_darurat} ${item.satuan}
          </div>
          `
          : ""
      }
    `;

    container.appendChild(card);
  });
}

// ================= SUMMARY (HANYA STOK) =================
function renderSummary() {
  const stokItems = dataGlobal.filter(item => item.kategori === "stok");

  let aman = 0, waspada = 0, darurat = 0;

  stokItems.forEach(item => {
    const status = getStatus(item)[0];
    if (status === "AMAN") aman++;
    else if (status === "WASPADA") waspada++;
    else if (status === "DARURAT") darurat++;
  });

  summary.innerHTML = `
    <div class="bg-green-200 p-4 rounded shadow">Aman<br><b>${aman}</b></div>
    <div class="bg-yellow-200 p-4 rounded shadow">Waspada<br><b>${waspada}</b></div>
    <div class="bg-red-200 p-4 rounded shadow">Darurat<br><b>${darurat}</b></div>
    <div class="bg-white p-4 rounded shadow">Total Stok<br><b>${stokItems.length}</b></div>
  `;
}