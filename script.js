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
const CORRECT_ID = "Utari Nur Hanifah Cantik";
const CORRECT_PASS = "07-01-2025";

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
// ===== ADMIN FINAL (MASUK / CANCEL / KELUAR) =====
const ADMIN_KEY = "slayerrr";

// klik tombol "Mas EL"
function enterAdminMode() {
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  const popup = document.getElementById("adminPopup");
  const text = document.getElementById("adminPopupText");
  const btnGroup = document.getElementById("adminBtnGroup");
  const input = document.getElementById("adminPassword");

  popup.style.display = "flex";
  btnGroup.innerHTML = "";

  if (isAdmin) {
    // === SUDAH ADMIN ===
    text.innerText = "Kamu sedang di Mode Admin 👑";
    input.style.display = "none";

    btnGroup.innerHTML = `
      <button class="popup-btn" onclick="logoutAdmin()">Keluar Admin</button>
      <button class="popup-btn" onclick="closeAdminPopup()" style="background:#ccc;color:#333">
        Cancel
      </button>
    `;
  } else {
    // === BELUM ADMIN ===
    text.innerText = "Masukkan Password Mas EL 🔐";
    input.style.display = "block";
    input.value = "";

    btnGroup.innerHTML = `
      <button class="popup-btn" onclick="checkAdmin()">Masuk</button>
      <button class="popup-btn" onclick="closeAdminPopup()" style="background:#ccc;color:#333">
        Cancel
      </button>
    `;
  }
}

// tutup popup
function closeAdminPopup() {
  document.getElementById("adminPopup").style.display = "none";
  document.getElementById("adminPassword").value = "";
}

// cek password
function checkAdmin() {
  const pass = document.getElementById("adminPassword").value.trim();

  if (pass === ADMIN_KEY) {
    sessionStorage.setItem("isAdmin", "true");
    closeAdminPopup();
    showNotif("Admin Mode Aktif 👑");
  } else {
    closeAdminPopup();
    document.getElementById("adminErrorPopup").style.display = "flex";
  }
}

// logout admin
function logoutAdmin() {
  sessionStorage.removeItem("isAdmin");
  closeAdminPopup();
  showNotif("Keluar dari Mode Admin 🚪");
}

// popup error
function retryAdmin() {
  document.getElementById("adminErrorPopup").style.display = "none";
  enterAdminMode();
}

function closeAdminError() {
  document.getElementById("adminErrorPopup").style.display = "none";
}



// tombol "coba lagi"
function retryAdmin() {
  document.getElementById("adminErrorPopup").style.display = "none";
  enterAdminMode();
}

// tombol "batal"
function closeAdminError() {
  document.getElementById("adminErrorPopup").style.display = "none";
}












// ===== FIREBASE REF =====
const commentRef = firebase.database().ref("comments");

// ===== KIRIM KOMENTAR =====
function sendComment() {
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

 if (!name || !comment) {
  showNotif("Nama dan Pesan Wajib Diisi!");
  return;
}

  // ADMIN DETEKSI DARI NAMA
  const isAdminSession = sessionStorage.getItem("isAdmin") === "true";

  commentRef.push({
    name: name,
    text: comment,
    time: Date.now(),
    isAdmin: isAdminSession

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
    const side = item.isAdmin ? "right" : "left";
    const time = formatTime(item.time);

    list.innerHTML += `
      <div class="chat ${side}">
        <div class="bubble">

          <div class="name">
               ${item.name}
               ${item.isAdmin ? `<span class="admin-badge">👑</span>` : ""}
          </div>

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
let deleteTargetId = null;

function deleteComment(id) {
  deleteTargetId = id;
  document.getElementById("deleteConfirmPopup").style.display = "flex";
}

function confirmDeleteComment() {
  if (deleteTargetId) {
    commentRef.child(deleteTargetId).remove();
    deleteTargetId = null;
  }
  closeDeletePopup();
}

function closeDeletePopup() {
  document.getElementById("deleteConfirmPopup").style.display = "none";
  deleteTargetId = null;
}


let editTargetId = null;

// buka popup edit
function editComment(id) {
  editTargetId = id;

  commentRef.child(id).once("value", snap => {
    document.getElementById("editCommentInput").value = snap.val().text;
    document.getElementById("editCommentPopup").style.display = "flex";
  });
}

// simpan edit
function confirmEditComment() {
  const newText = document.getElementById("editCommentInput").value.trim();

  if (newText && editTargetId) {
    commentRef.child(editTargetId).update({ text: newText });
  }

  closeEditPopup();
}

// tutup popup
function closeEditPopup() {
  document.getElementById("editCommentPopup").style.display = "none";
  editTargetId = null;
}

function showNotif(text) {
  document.getElementById("notifText").innerText = text;
  document.getElementById("notifPopup").style.display = "flex";
}

function closeNotif() {
  document.getElementById("notifPopup").style.display = "none";
}

