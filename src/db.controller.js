import { db, OBJECT_STORE } from './db-init';

export function getAllItemsFromDB() {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(OBJECT_STORE, 'readonly');
    let objectStore = transaction.objectStore(OBJECT_STORE);
    let index = objectStore.index('date');
    let cursorRequest = index.openCursor(null, 'prev');
    let items = [];
    let prevDate = '';
    cursorRequest.onsuccess = (e) => {
      let cursor = e.target.result;
      if (cursor) {
        let item = cursor.value;
        if (prevDate !== item.date)
          items.push({ date: item.date, price: '', content: '', id: -1 });
        items.push(item);
        prevDate = item.date;
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
