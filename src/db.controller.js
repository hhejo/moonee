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
