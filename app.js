if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/deutsch/service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) => console.log("Service Worker Registration Failed", err));
}

let db;
const request = indexedDB.open("myDatabase", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB is ready");
};

// Function to store data in IndexedDB
function saveUser(id, name) {
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");
    store.put({ id, name });
}


document.getElementById("save").addEventListener("click", () => {
    saveUser(2, "Jane Doe");
});