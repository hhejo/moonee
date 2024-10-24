import { db, OBJECT_STORE } from './db.init.js';
import { getAllItemsFromDB } from './db.controller.js';
import { setTotalPrice } from './header.js';
import { hideCreateItemFormHandler } from './create-form.js';
import './create-form-btn.js';

document.addEventListener('db-opened', async (e) => {
  console.log('Database opened event received:', db);
  let items = await getAllItemsFromDB();
  printItems(items);
  setTotalPrice(items);
});

document.addEventListener('item-added', async (e) => {
  let { item } = e.detail;
  await addItemToDB(item);
  let items = await getAllItemsFromDB();
  printItems(items);
  setTotalPrice(items);
});

function addItemToDB(item) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(OBJECT_STORE, 'readwrite');
    let objectStore = transaction.objectStore(OBJECT_STORE);
    let request = objectStore.add(item);
    request.onsuccess = () => resolve();
    request.onerror = (e) => console.error('Error adding item:', request.error);
  });
}

async function createItemHandler(e) {
  e.preventDefault();
  let item = (() => {
    let $selectedOption = document.querySelector(
      'input[name="option"]:checked'
    );
    let checkedType = $selectedOption
      ? $selectedOption.nextElementSibling.textContent.trim()
      : null;
    let date = document.getElementById('date').value.trim(); // 날짜
    let price = +document.getElementById('price').value.trim().replace(',', ''); // 가격
    let content = document.getElementById('content').value.trim(); // 내용
    price = checkedType === '지출' ? -price : price;
    return { date, price, content };
  })(); // 아이템
  if (!item.date || !item.content) return;
  let itemAddEvent = new CustomEvent('item-added', { detail: { item } });
  document.dispatchEvent(itemAddEvent);
  hideCreateItemFormHandler();
}
window.createItemHandler = createItemHandler;

function createItemSubmitHandler(e) {
  e.preventDefault();
}
window.createItemSubmitHandler = createItemSubmitHandler;

function createItemLiElement({ id, date, price, content }) {
  let $li = document.createElement('li');
  $li.id = id;
  $li.className =
    'flex w-full overflow-hidden h-14 py-1 rounded-md transition duration-75 hover:bg-gray-50';
  $li.onclick = function deleteLi() {
    let deleteId = id;
    let transaction = db.transaction(OBJECT_STORE, 'readwrite');
    let objectStore = transaction.objectStore(OBJECT_STORE);
    let request = objectStore.delete(deleteId);
    request.onsuccess = () => loadItems();
    request.onerror = () =>
      console.error('Error deleting item:', request.error);
  };
  $li.innerHTML = `
    <div class="flex flex-col w-full truncate">
      <span class="text-xs text-gray-300">${date}</span>
      <span class="flex items-center truncate text-gray-600 h-full">${content}</span>
    </div>
    <div class="flex justify-end items-center w-28">
      <span class="text-sm ${
        price >= 0
          ? price === 0
            ? 'text-gray-400'
            : 'text-sky-400'
          : 'text-red-400'
      }">${new Intl.NumberFormat().format(price < 0 ? -price : price)}</span>
    </div>
  `;
  return $li;
}

function printItems(items) {
  const $itemList = document.getElementById('itemList');
  while ($itemList.firstChild) $itemList.firstChild.remove();
  for (let item of items) {
    let $li = createItemLiElement(item);
    $itemList.appendChild($li);
  }
}
