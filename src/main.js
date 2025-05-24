import { verifyToken } from './crypto.js';

// Configuración de IndexedDB
const dbName = 'SecurePointsDB';
const storeName = 'points';
let db;

async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      db = request.result;
      db.createObjectStore(storeName, { keyPath: 'timestamp' });
    };
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

// Guardar token en IndexedDB
async function saveToken(token) {
  const isValid = await verifyToken(token);
  if (!isValid) {
    document.getElementById('message').textContent = 'Token inválido, posible manipulación.';
    return false;
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(token);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

// Sumar y mostrar puntos válidos
async function showPoints() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = async () => {
      let totalPoints = 0;
      for (const token of request.result) {
        if (await verifyToken(token)) {
          totalPoints += token.puntos;
        }
      }
      document.getElementById('points').textContent = totalPoints;
      resolve(totalPoints);
    };
    request.onerror = () => reject(request.error);
  });
}

// Simular juego: pedir token al servidor
async function simulateGame() {
  try {
    const response = await fetch('/api/generate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: 'juan123', puntos: 10 })
    });
    const token = await response.json();
    const saved = await saveToken(token);
    if (saved) {
      document.getElementById('message').textContent = 'Puntos guardados con éxito!';
      showPoints();
    }
  } catch (error) {
    document.getElementById('message').textContent = 'Error al obtener puntos: ' + error.message;
  }
}

// Inicializar
initDB().then(() => {
  window.simulateGame = simulateGame;
  window.showPoints = showPoints;
  showPoints();
}).catch(error => {
  document.getElementById('message').textContent = 'Error al inicializar DB: ' + error.message;
});
