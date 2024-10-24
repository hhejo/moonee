import { db, OBJECT_STORE } from './db.init.js';
import { getAllItemsFromDB } from './db.controller.js';
import './header.js';
import './create-form-btn.js';
import './create-form.js';

document.addEventListener('db-opened', async (e) => {
  // let db = e.detail.db;
  console.log('Database opened event received:', db);
  let items = await getAllItemsFromDB();
  printItems(items);
});

document.addEventListener('', (e) => {});

function setTotalPrice(items) {
  let [totalIncome, totalExpense, total] = [0, 0, 0];
  for (let { price } of items) {
    total += price;
    if (price >= 0) totalIncome += price;
    else totalExpense += price;
  }

  let formatComma = (val) => new Intl.NumberFormat().format(val);
  let $total = document.getElementById('total');
  $total.textContent = formatComma(Math.abs(total));
  document.getElementById('totalIncome').textContent = formatComma(
    Math.abs(totalIncome)
  );
  document.getElementById('totalExpense').textContent = formatComma(
    Math.abs(totalExpense)
  );

  if (total > 0) {
    $total.classList.remove('text-gray-500', 'text-red-500');
    $total.classList.add('text-sky-500');
  } else if (total < 0) {
    $total.classList.remove('text-gray-500', 'text-sky-500');
    $total.classList.add('text-red-500');
  } else {
    $total.classList.remove('text-sky-500', 'text-red-500');
    $total.classList.add('text-gray-500');
  }
}

function addItemToDB(item) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(OBJECT_STORE, 'readwrite');
    let objectStore = transaction.objectStore(OBJECT_STORE);
    let request = objectStore.add(item);
    request.onsuccess = () => {
      printItems();
      resolve();
    };
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
  await addItemToDB(item);
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
            ? 'text-gray-700'
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
  setTotalPrice(items);
}
