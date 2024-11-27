function showInputs() {
  const type = document.getElementById('calculationType').value;
  const inputsContainer = document.getElementById('inputs');
  inputsContainer.innerHTML = ''; // Kosongkan input sebelumnya

  // Tampilkan input sesuai dengan jenis perhitungan yang dipilih
  if (type === 'simpleInterest' || type === 'compoundInterest') {
    inputsContainer.innerHTML = `
      <div class="form-group">
        <label for="modal">Modal (M):</label>
        <input type="number" id="modal" placeholder="Masukkan Modal" required>
      </div>
      <div class="form-group">
        <label for="rate">Bunga (%):</label>
        <input type="number" id="rate" placeholder="Masukkan Bunga" required>
      </div>
      <div class="form-group">
        <label for="time">Jangka Waktu (n):</label>
        <input type="number" id="time" placeholder="Masukkan Jangka Waktu" required>
      </div>
    `;
  } else if (type === 'annuity') {
    inputsContainer.innerHTML = `
      <div class="form-group">
        <label for="modal">Modal (M):</label>
        <input type="number" id="modal" placeholder="Masukkan Modal" required>
      </div>
      <div class="form-group">
        <label for="rate">Bunga (%):</label>
        <input type="number" id="rate" placeholder="Masukkan Bunga" required>
      </div>
      <div class="form-group">
        <label for="time">Jangka Waktu (n):</label>
        <input type="number" id="time" placeholder="Masukkan Jangka Waktu" required>
      </div>
      <div class="form-group">
        <label for="period">Periode (m) (Untuk Sisa Pinjaman):</label>
        <input type="number" id="period" placeholder="Masukkan Periode" required>
      </div>
    `;
  }
}

function calculate() {
  const type = document.getElementById('calculationType').value;
  const M = parseFloat(document.getElementById("modal").value);
  const r = parseFloat(document.getElementById("rate").value) / 100;
  const n = parseInt(document.getElementById("time").value);
  const m = parseInt(document.getElementById("period") ? document.getElementById("period").value : 0);

  // Validasi input
  if (isNaN(M) || isNaN(r) || isNaN(n) || M <= 0 || r <= 0 || n <= 0 || (m && m <= 0)) {
    alert("Mohon masukkan nilai yang valid!");
    return;
  }

  let resultText = "";

  if (type === 'simpleInterest') {
    const I = M * r * n;
    const Mn = M * (1 + r * n);
    resultText = `
      <strong>Hasil Bunga Tunggal:</strong><br>
      Bunga (I): Rp ${formatCurrency(I)}<br>
      Modal setelah Bunga (Mn): Rp ${formatCurrency(Mn)}
    `;
  } else if (type === 'compoundInterest') {
    const MnComp = M * Math.pow(1 + r, n);
    resultText = `
      <strong>Hasil Bunga Majemuk:</strong><br>
      Modal setelah Bunga Majemuk (Mn): Rp ${formatCurrency(MnComp)}
    `;
  } else if (type === 'annuity') {
    // Menghitung Angsuran Pertama (a1)
    const a1 = M * r / (Math.pow(1 + r, n) - 1);
    
    // Menghitung Besar Anuitas (A)
    const A = M * r / (1 - Math.pow(1 + r, -n));
    
    // Menghitung Modal setelah Bunga Majemuk (Mn)
    const MnComp = M * Math.pow(1 + r, n);
    
    // Menghitung Bunga ke-n (bn)
    const bn = A - (a1 * Math.pow(1 + r, n - 1));
    
    // Menghitung Sisa Pinjaman setelah periode ke-m (Sm)
    const Sm = (M * Math.pow(1 + r, m) - M) / r;
    
    resultText = `
      <strong>Hasil Anuitas:</strong><br>
      Angsuran Pertama (a1): Rp ${formatCurrency(a1)}<br>
      Besar Anuitas (A): Rp ${formatCurrency(A)}<br>
      Modal setelah Bunga Majemuk (Mn): Rp ${formatCurrency(MnComp)}<br>
      Bunga pada periode ke-${n} (bn): Rp ${formatCurrency(bn)}<br>
      Sisa Pinjaman setelah periode ke-${m} (Sm): Rp ${formatCurrency(Sm)}
    `;
  }

  document.getElementById("result").innerHTML = resultText;
}

// Fungsi untuk memformat angka sebagai mata uang dengan titik pemisah ribuan
function formatCurrency(value) {
  return value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2
  });
}
