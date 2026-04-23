let dataGlobal = [];

const container = document.getElementById("container");
const errorBox = document.getElementById("errorBox");
const summary = document.getElementById("summary");

// ================= FETCH =================
async function loadSensorData() {
  try {
    errorBox.innerText = "";

    const res = await fetch("data/input.json");

    if (!res.ok) throw new Error("JSON tidak ditemukan");

    dataGlobal = await res.json();

    renderData(dataGlobal);
    renderSummary();

  } catch (err) {
    errorBox.innerText = err.message;
  }
}

// ================= STATUS =================
function getStatus(item) {
  if (item.kategori === "stok") {
    if (item.jumlah <= item.ambang_bahaya) return ["DARURAT", "bg-red-500 text-white pulse"];
    if (item.jumlah <= item.ambang_waspada) return ["WASPADA", "bg-yellow-400"];
    return ["AMAN", "bg-green-400"];
  }

  if (item.kategori === "operasional") {
    if (item.status === "ONLINE" || item.status === "BUKA") return ["AMAN", "bg-green-400"];
    return ["DARURAT", "bg-red-500 text-white"];
  }
}

// ================= RENDER =================
function renderData(data) {
  container.innerHTML = "";

  data.forEach((item, index) => {
    const [status, color] = getStatus(item);

    const card = document.createElement("div");
    card.className = "card bg-white p-5 rounded-xl shadow";

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold">${item.nama}</h2>
        <span class="px-3 py-1 rounded ${color}">${status}</span>
      </div>

      <div class="mt-4 text-2xl font-semibold">
        ${item.kategori === "stok" ? item.jumlah + " " + item.satuan : item.status}
      </div>

      <p class="text-sm text-gray-500 mt-2">${item.keterangan}</p>

      <div class="mt-4 flex gap-2">
        ${
          item.kategori === "stok"
          ? `<button onclick="restock(${index})" class="bg-blue-500 text-white px-3 py-1 rounded">Restock</button>`
          : `<button onclick="toggleStatus(${index})" class="bg-purple-500 text-white px-3 py-1 rounded">Toggle</button>`
        }
      </div>
    `;

    container.appendChild(card);
  });
}

// ================= INTERAKSI =================
function restock(index) {
  dataGlobal[index].jumlah += 5;
  renderData(dataGlobal);
  renderSummary();
}

function toggleStatus(index) {
  const item = dataGlobal[index];

  item.status = (item.status === "ONLINE" || item.status === "BUKA")
    ? "OFFLINE"
    : "ONLINE";

  renderData(dataGlobal);
}

// ================= FILTER =================
function filterData(type) {
  if (type === "all") {
    renderData(dataGlobal);
  } else {
    const filtered = dataGlobal.filter(item => item.kategori === type);
    renderData(filtered);
  }
}

// ================= SUMMARY =================
function renderSummary() {
  let total = dataGlobal.length;
  let bahaya = dataGlobal.filter(i => getStatus(i)[0] === "DARURAT").length;

  summary.innerHTML = `
    <div class="bg-white p-4 rounded shadow">Total Item<br><b>${total}</b></div>
    <div class="bg-red-200 p-4 rounded shadow">Bahaya<br><b>${darurat}</b></div>
    <div class="bg-yellow-200 p-4 rounded shadow">Waspada</div>
    <div class="bg-green-200 p-4 rounded shadow">Aman</div>
  `;
}