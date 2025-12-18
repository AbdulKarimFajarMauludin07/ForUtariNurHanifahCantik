let currentLayer = 1;
const totalLayer = 4;

/* ===== LAYER CONTROL ===== */
function showLayer(n) {
  document.querySelectorAll(".layer").forEach(l => l.classList.remove("active"));
  document.getElementById("layer" + n).classList.add("active");

  const music = document.getElementById("bgMusic");

  if (n === 3) {
    startEmojiRain();
    if (music.paused) {
      music.play().catch(() => {});
    }
  } 
  else if (n === 4) {
    stopEmojiRain();
    music.pause();              // ⬅️ INI KUNCINYA
    music.currentTime = 0;      // ⬅️ RESET BIAR BENERAN BERENTI
  } 
  else {
    stopEmojiRain();
    music.pause();
  }
}


function nextLayer() {
  if (currentLayer < totalLayer) {
    currentLayer++;
    showLayer(currentLayer);
  }
}

function prevLayer() {
  if (currentLayer > 1) {
    currentLayer--;
    showLayer(currentLayer);
  }
}

function goToFirst() {
  currentLayer = 1;
  showLayer(currentLayer);
}

/* ===== BUTTON LARI ===== */
document.querySelectorAll(".runaway").forEach(btn => {
  btn.addEventListener("mouseover", () => {
    btn.style.position = "absolute";
    btn.style.left = Math.random() * 80 + "%";
    btn.style.top = Math.random() * 80 + "%";
  });
});

function closeAlert() {
  loginAlert.style.display = "none";
}

/* ===== MUSIC ===== */
const music = document.getElementById("bgMusic");
const btn = document.getElementById("musicBtn");

btn.addEventListener("click", () => {
  if(music.paused){
    music.play();
    btn.textContent = "🔊";
  } else {
    music.pause();
    btn.textContent = "🔇";
  }
});

/* ===== EMOJI RAIN ===== */
const emojiContainer = document.getElementById("emojiRain");
const emojis = ["💖","🎉","🎈","🎁","🥳","🎂","✨","🌸","💕","🎊"];
let emojiInterval;

function startEmojiRain() {
  stopEmojiRain();
  emojiInterval = setInterval(() => {
    const e = document.createElement("div");
    e.className = "emoji";
    e.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.left = Math.random() * 100 + "vw";
    e.style.animationDuration = Math.random() * 3 + 4 + "s";
    emojiContainer.appendChild(e);
    setTimeout(() => e.remove(), 7000);
  }, 300);
}

function stopEmojiRain() {
  clearInterval(emojiInterval);
  emojiContainer.innerHTML = "";
}

/* ===== KONFIRMASI LANJUT ===== */
function openConfirm() {
  document.getElementById("confirmBox").style.display = "flex";
}

function closeConfirm() {
  document.getElementById("confirmBox").style.display = "none";
}

function confirmNext() {
  closeConfirm();
  nextLayer();
}
/* ===== BATAL LARI DI POPUP ===== */
document.addEventListener("mouseover", e => {
  if (e.target.classList.contains("runaway-confirm")) {
    const btn = e.target;
    const parent = btn.closest(".confirm-card");

    const maxX = parent.clientWidth - btn.offsetWidth;
    const maxY = parent.clientHeight - btn.offsetHeight;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    btn.style.position = "absolute";
    btn.style.left = x + "px";
    btn.style.top = y + "px";
  }
});
const CORRECT_ID = "Utari Nur Hanifah";
const CORRECT_PASS = "Utari Cantik Banget";

function checkLogin() {
  const id = document.getElementById("loginId").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (id === CORRECT_ID && pass === CORRECT_PASS) {
    showLayer(3);
  } else {
    document.getElementById("loginError").style.display = "flex";
  }
}

function closeLoginError() {
  document.getElementById("loginError").style.display = "none";
  document.getElementById("loginPass").value = "";
}
document.addEventListener("click", () => {
  const video = document.querySelector("video");
  if (video && video.paused) {
    video.play().catch(() => {});
  }
}, { once: true });






// ===== FIREBASE COMMENT FINAL FIX =====

// ===== ADMIN =====
const ADMIN_KEY = "utaricantik";

function enterAdminMode() {
  const key = prompt("Mas EL Passwordnya:");
  if (key === ADMIN_KEY) {
    sessionStorage.setItem("isAdmin", "true");
    alert("Selamat Datang Mas EL 👋 ");
    location.reload();
  } else {
    alert("Ops! Password Kamu Salah 🙅‍♂️");
  }
}

// ===== FIREBASE REF =====
const commentRef = firebase.database().ref("comments");

// ===== KIRIM KOMENTAR =====
function sendComment() {
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment) {
    alert("Nama dan Pesan Wajib Diisi!");
    return;
  }

  // ADMIN DETEKSI DARI NAMA
  const isAdminUser = name.toLowerCase() === "mas el";

  commentRef.push({
    name: name,
    text: comment,
    time: Date.now(),
    isAdmin: isAdminUser
  });

  document.getElementById("comment").value = "";
}

// ===== FORMAT WAKTU =====
function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ===== TAMPILKAN KOMENTAR =====
commentRef.on("value", snapshot => {
  const data = snapshot.val();
  const list = document.getElementById("commentList");
  list.innerHTML = "";

  if (!data) {
    list.innerHTML = "<p style='text-align:center'>Belum Ada Pesan 💬</p>";
    return;
  }

  const isAdminSession = sessionStorage.getItem("isAdmin") === "true";

  for (let id in data) {
    const item = data[id];
    const time = formatTime(item.time);

    // POSISI CHAT
    const side = item.isAdmin ? "right" : "left";

    list.innerHTML += `
      <div class="chat ${side}">
        <div class="bubble">
          <div class="name">${item.name}</div>
          <div class="text">${item.text}</div>
          <div class="time">${time}</div>

          ${
            isAdminSession
              ? `<div class="admin-btn">
                   <button onclick="editComment('${id}')">Edit</button>
                   <button onclick="deleteComment('${id}')">Hapus</button>
                 </div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  list.scrollTop = list.scrollHeight;
});

// ===== ADMIN ACTION =====
function deleteComment(id) {
  if (confirm("Hapus komentar ini?")) {
    commentRef.child(id).remove();
  }
}

function editComment(id) {
  commentRef.child(id).once("value", snap => {
    const oldText = snap.val().text;
    const newText = prompt("Edit komentar:", oldText);

    if (newText && newText.trim() !== "") {
      commentRef.child(id).update({ text: newText });
    }
  });
}
