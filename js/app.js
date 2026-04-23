const btnLoad = document.getElementById("btnLoad");
const sensorContainer = document.getElementById("sensorContainer");
const errorBox = document.getElementById("errorBox");

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function getStatus(item) {
  if (item.kategori === "stok") {
    if (item.nilai <= item.ambang_bahaya) {
      return {
        label: "BAHAYA",
        className: "status-bahaya"
      };
    } else if (item.nilai <= item.ambang_waspada) {
      return {
        label: "WASPADA",
        className: "status-waspada"
      };
    } else {
      return {
        label: "AMAN",
        className: "status-aman"
      };
    }
  }

  if (item.kategori === "operasional") {
    const nilai = String(item.nilai).toUpperCase();

    if (nilai === "ONLINE" || nilai === "BUKA") {
      return {
        label: "AMAN",
        className: "status-aman"
      };
    } else if (nilai === "TERGANGGU") {
      return {
        label: "WASPADA",
        className: "status-waspada"
      };
    } else {
      return {
        label: "BAHAYA",
        className: "status-bahaya"
      };
    }
  }

  return {
    label: "TIDAK DIKENALI",
    className: "status-waspada"
  };
}

function renderData(data) {
  sensorContainer.innerHTML = "";

  data.forEach((item) => {
    const status = getStatus(item);

    const card = document.createElement("div");
    card.className = "card-sensor bg-white rounded-2xl shadow p-5 border border-gray-100";

    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">${item.nama}</h3>
          <p class="text-sm text-gray-500 mt-1">Kategori: ${item.kategori}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-sm font-semibold ${status.className}">
          ${status.label}
        </span>
      </div>

      <div class="mt-5">
        <p class="text-sm text-gray-500">Nilai</p>
        <p class="text-2xl font-bold text-gray-900">
          ${item.nilai} <span class="text-base font-medium text-gray-500">${item.satuan}</span>
        </p>
      </div>

      ${
        item.kategori === "stok"
          ? `
        <div class="mt-4 text-sm text-gray-600">
          <p>Ambang Waspada: <strong>${item.ambang_waspada} ${item.satuan}</strong></p>
          <p>Ambang Bahaya: <strong>${item.ambang_bahaya} ${item.satuan}</strong></p>
        </div>
        `
          : `
        <div class="mt-4 text-sm text-gray-600">
          <p>Status operasional toko ditentukan dari kondisi: <strong>${item.nilai}</strong></p>
        </div>
        `
      }
    `;

    sensorContainer.appendChild(card);
  });
}

async function loadSensorData() {
  try {
    clearError();

    const response = await fetch("data/sensor.json");
    if (!response.ok) {
      throw new Error("Gagal membaca file JSON.");
    }

    const data = await response.json();
    renderData(data);
  } catch (error) {
    sensorContainer.innerHTML = "";
    showError("Terjadi kesalahan saat memuat data: " + error.message);
  }
}

btnLoad.addEventListener("click", loadSensorData);