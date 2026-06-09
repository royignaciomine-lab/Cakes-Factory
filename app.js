import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";

// 🔥 CONFIG FIREBASE (REEMPLAZA ESTO)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 👤 usuario actual
let userActual = null;

// ⭐ estrellas
let estrellas = 0;

// =======================
// 🔐 LOGIN CON GOOGLE
// =======================
window.login = async function () {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  userActual = result.user;

  document.getElementById("user").innerText =
    "👤 " + userActual.displayName;
};

// =======================
// ⭐ SELECCION DE ESTRELLAS
// =======================
window.setStars = function (n) {
  estrellas = n;
  renderStars();
};

function renderStars() {
  const cont = document.getElementById("stars");
  cont.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    cont.innerHTML += `
      <span onclick="setStars(${i})" style="font-size:30px;cursor:pointer">
        ${i <= estrellas ? "⭐" : "☆"}
      </span>
    `;
  }
}

renderStars();

// =======================
// 📤 ENVIAR RESEÑA
// =======================
window.enviar = async function () {
  const comentario = document.getElementById("comentario").value;

  if (!userActual) return alert("Debes iniciar sesión");
  if (estrellas === 0) return alert("Selecciona estrellas");
  if (comentario.trim() === "") return alert("Escribe un comentario");

  await addDoc(collection(db, "resenas"), {
    nombre: userActual.displayName,
    comentario,
    estrellas,
    fecha: serverTimestamp()
  });

  document.getElementById("comentario").value = "";

  cargar();
};

// =======================
// 📖 MOSTRAR RESEÑAS
// =======================
async function cargar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snap = await getDocs(collection(db, "resenas"));

  snap.forEach(doc => {
    const d = doc.data();

    lista.innerHTML += `
      <div style="
        background:white;
        padding:10px;
        margin:10px;
        border-radius:10px;
      ">
        <b>${d.nombre}</b><br>
        ${"⭐".repeat(d.estrellas)}<br>
        ${d.comentario}
      </div>
    `;
  });
}

cargar();
