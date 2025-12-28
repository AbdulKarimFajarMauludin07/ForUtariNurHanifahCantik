/* ================= GLOBAL ================= */
let currentLayer = 1;
const totalLayer = 4;

const music = document.getElementById("bgMusic");

/* ================= LAYER CONTROL ================= */
function showLayer(n) {
  document.querySelectorAll(".layer").forEach(l => l.classList.remove("active"));
  const layer = document.getElementById("layer" + n);
  if (layer) layer.classList.add("active");

  if (!music) return;

  if (n === 3) {
    startEmojiRain();
    if (music.paused) music.play().catch(() => {});
  } else if (n === 4) {
    stopEmojiRain();
    music.pause();
    music.currentTime = 0;
  } else {
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

/* ================= RUNAWAY BUTTON ================= */
document.querySelectorAll(".runaway").forEach(btn => {
  btn.addEventListener("mouseover", () => {
    btn.style.position = "absolute";
    btn.style.left = Math.random() * 80 + "%";
    btn.style.top = Math.random() * 80 + "%";
  });
});

/* ================= MUSIC BUTTON ================= */
const musicBtn = document.getElementById("musicBtn");
if (musicBtn && music) {
  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch(() => {});
      musicBtn.textContent = "🔊";
    } else {
      music.pause();
      musicBtn.textContent = "🔇";
    }
  });
}

/* ================= EMOJI RAIN ================= */
const emojiContainer = document.getElementById("emojiRain");
const emojis = ["💖","🎉","🎈","🎁","🥳","🎂","✨","🌸","💕","🎊"];
let emojiInterval;

function startEmojiRain() {
  stopEmojiRain();
  if (!emojiContainer) return;

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
  if (emojiContainer) emojiContainer.innerHTML = "";
}

/* ================= LOGIN ================= */
const CORRECT_ID = "Utari Nur Hanifah Cantik";
const CORRECT_PASS = "07-01-2025";

function checkLogin() {
  const id = document.getElementById("loginId").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (id === CORRECT_ID && pass === CORRECT_PASS) {
    goToLayer(3); // masuk ke layer 3
  } else {
    document.getElementById("loginError").classList.add("show");
  }
}

function closeLoginError() {
  document.getElementById("loginError").classList.remove("show");
}

/* ================= AUTOPLAY VIDEO (1x) ================= */
document.addEventListener("click", () => {
  const video = document.querySelector("video");
  if (video && video.paused) {
    video.play().catch(() => {});
  }
}, { once: true });

/* ================= ADMIN MODE ================= */
const ADMIN_KEY = "slayerrr";

function enterAdminMode() {
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  const popup = document.getElementById("adminPopup");
  const text = document.getElementById("adminPopupText");
  const btnGroup = document.getElementById("adminBtnGroup");
  const input = document.getElementById("adminPassword");

  popup.style.display = "flex";
  btnGroup.innerHTML = "";

  if (isAdmin) {
    text.innerText = "Kamu sedang di Mode Admin 👑";
    input.style.display = "none";
    btnGroup.innerHTML = `
      <button onclick="logoutAdmin()">Keluar Admin</button>
      <button onclick="closeAdminPopup()">Cancel</button>
    `;
  } else {
    text.innerText = "Masukkan Password Mas EL 🔐";
    input.style.display = "block";
    input.value = "";
    btnGroup.innerHTML = `
      <button onclick="checkAdmin()">Masuk</button>
      <button onclick="closeAdminPopup()">Cancel</button>
    `;
  }
}

function closeAdminPopup() {
  document.getElementById("adminPopup").style.display = "none";
  document.getElementById("adminPassword").value = "";
}

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

function logoutAdmin() {
  sessionStorage.removeItem("isAdmin");
  closeAdminPopup();
  showNotif("Keluar dari Mode Admin 🚪");
}

function retryAdmin() {
  document.getElementById("adminErrorPopup").style.display = "none";
  enterAdminMode();
}

function closeAdminError() {
  document.getElementById("adminErrorPopup").style.display = "none";
}

/* ================= FIREBASE COMMENT ================= */
if (typeof firebase !== "undefined") {
  const commentRef = firebase.database().ref("comments");

  function sendComment() {
    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!name || !comment) {
      showNotif("Nama dan Pesan Wajib Diisi!");
      return;
    }

    commentRef.push({
      name,
      text: comment,
      time: Date.now(),
      isAdmin: sessionStorage.getItem("isAdmin") === "true"
    });

    document.getElementById("comment").value = "";
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleString("id-ID", {
      day:"2-digit", month:"short", year:"numeric",
      hour:"2-digit", minute:"2-digit"
    });
  }

  commentRef.on("value", snap => {
    const list = document.getElementById("commentList");
    const data = snap.val();
    list.innerHTML = "";

    if (!data) {
      list.innerHTML = "<p>Belum Ada Pesan 💬</p>";
      return;
    }

    const isAdmin = sessionStorage.getItem("isAdmin") === "true";

    for (let id in data) {
      const c = data[id];
      list.innerHTML += `
        <div class="chat ${c.isAdmin ? "right" : "left"}">
          <div class="bubble">
            <div class="name">${c.name} ${c.isAdmin ? "👑" : ""}</div>
            <div class="text">${c.text}</div>
            <div class="time">${formatTime(c.time)}</div>
            ${isAdmin ? `
              <button onclick="editComment('${id}')">Edit</button>
              <button onclick="deleteComment('${id}')">Hapus</button>
            ` : ""}
          </div>
        </div>
      `;
    }
    list.scrollTop = list.scrollHeight;
  });

  let editTarget = null;
  function editComment(id) {
    editTarget = id;
    commentRef.child(id).once("value", s => {
      document.getElementById("editCommentInput").value = s.val().text;
      document.getElementById("editCommentPopup").style.display = "flex";
    });
  }

  function confirmEditComment() {
    const text = document.getElementById("editCommentInput").value.trim();
    if (text && editTarget) {
      commentRef.child(editTarget).update({ text });
    }
    closeEditPopup();
  }

  function closeEditPopup() {
    document.getElementById("editCommentPopup").style.display = "none";
    editTarget = null;
  }

  let deleteTarget = null;
  function deleteComment(id) {
    deleteTarget = id;
    document.getElementById("deleteConfirmPopup").style.display = "flex";
  }

  function confirmDeleteComment() {
    if (deleteTarget) commentRef.child(deleteTarget).remove();
    closeDeletePopup();
  }

  function closeDeletePopup() {
    document.getElementById("deleteConfirmPopup").style.display = "none";
    deleteTarget = null;
  }
}

/* ================= NOTIF ================= */
function showNotif(text) {
  document.getElementById("notifText").innerText = text;
  document.getElementById("notifPopup").style.display = "flex";
}

function closeNotif() {
  document.getElementById("notifPopup").style.display = "none";
}

