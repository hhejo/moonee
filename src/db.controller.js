import { db, OBJECT_STORE } from './db.init';

export function getAllItemsFromDB() {
  return new Promise((resolve, reject) => {
    let items = [];
    let transaction = db.transaction(OBJECT_STORE, 'readonly');
    let objectStore = transaction.objectStore(OBJECT_STORE);
    let cursorRequest = objectStore.openCursor(null, 'prev');
    cursorRequest.onsuccess = (e) => {
      let cursor = e.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      } else resolve(items);
    };
    cursorRequest.onerror = (e) => reject(e);
  });
}

export function addItemToDB(item) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(OBJECT_STORE, 'readwrite');
    let objectStore = transaction.objectStore(OBJECT_STORE);
    let request = objectStore.add(item);
    request.onsuccess = () => resolve();
    request.onerror = (e) => console.error('Add error:', request.error);
  });
}

export function deleteItemFromDB(id) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(OBJECT_STORE, 'readwrite');
    let objectStore = transaction.objectStore(OBJECT_STORE);
    let request = objectStore.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = (e) => console.error('Delete error:', request.error);
  });
}
