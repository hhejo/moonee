let [db, DB, OBJECT_STORE] = [null, 'accountBook', 'items'];

function openDatabase() {
  let openRequest = indexedDB.open(DB, 1);
  openRequest.onerror = (e) =>
    console.error('Database error:', e.target.errorCode);
  openRequest.onsuccess = (e) => {
    db = e.target.result;
    let dbOpenEvent = new CustomEvent('db-opened', { detail: { db } });
    document.dispatchEvent(dbOpenEvent);
  };
  openRequest.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(OBJECT_STORE)) {
      let keyOptions = { keyPath: 'id', autoIncrement: true };
      let objectStore = db.createObjectStore(OBJECT_STORE, keyOptions);
      objectStore.createIndex('date', 'date');
      objectStore.createIndex('content', 'content');
      objectStore.createIndex('price', 'price');
    }
  };
}

openDatabase();

export { db, OBJECT_STORE };
