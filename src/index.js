let db; // DB
let [DB, OBJECT_STORE] = ['accountBook', 'items']; // DB 이름, ObjectStore 이름

function openDatabase() {
  let openRequest = indexedDB.open(DB, 1);
  openRequest.onerror = (e) =>
    console.error('Database error:', e.target.errorCode);
  openRequest.onsuccess = (e) => {
    db = e.target.result;
    console.log('Database opened successfully!', db);
    loadItems();
  };
  openRequest.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(OBJECT_STORE)) {
      let keyOptions = { keyPath: 'id', autoIncrement: true };
      let objectStore = db.createObjectStore(OBJECT_STORE, keyOptions);
      objectStore.createIndex('date', 'date');
      objectStore.createIndex('content', 'content');
      objectStore.createIndex('price', 'price');
      console.log('Database - items created');
    }
  };
}
openDatabase();

function displayCreateItemFormHandler() {
  document.getElementById('createItemForm').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('createItemForm').classList.remove('opacity-0');
    document.getElementById('createItemForm').classList.add('opacity-100');
  }, 20);
  document.getElementById('createItemFormButton').classList.add('hidden');
}

function hideCreateItemFormHandler() {
  document.getElementById('date').value = '';
  document.getElementById('price').value = '';
  document.getElementById('content').value = '';
  document.getElementById('createItemForm').classList.add('hidden');
  setTimeout(() => {
    document.getElementById('createItemForm').classList.remove('opacity-100');
    document.getElementById('createItemForm').classList.add('opacity-0');
  }, 20);
  document.getElementById('createItemFormButton').classList.remove('hidden');
}

function formatPriceHandler($input) {
  let value = $input.value.replace(/\D/g, '');
  $input.value = new Intl.NumberFormat().format(value);
}

function setTotalPrice() {
  let transaction = db.transaction(OBJECT_STORE, 'readonly');
  let objectStore = transaction.objectStore(OBJECT_STORE);
  let cursorRequest = objectStore.openCursor();
  let [totalIncome, totalExpense, total] = [0, 0, 0];
  cursorRequest.onsuccess = (e) => {
    let cursor = e.target.result;
    if (cursor) {
      let { price } = cursor.value;
      if (price >= 0) totalIncome += price;
      else totalExpense += price;
      total += price;
      cursor.continue();
    }
    let $totalIncome = document.getElementById('totalIncome');
    $totalIncome.textContent = new Intl.NumberFormat().format(
      totalIncome < 0 ? -totalIncome : totalIncome
    );
    let $totalExpense = document.getElementById('totalExpense');
    $totalExpense.textContent = new Intl.NumberFormat().format(
      totalExpense < 0 ? -totalExpense : totalExpense
    );
    let $total = document.getElementById('total');
    $total.textContent = new Intl.NumberFormat().format(
      total < 0 ? -total : total
    );
    if (total > 0) {
      $total.classList.remove(...['text-gray-500', 'text-red-500']);
      $total.classList.add('text-sky-500');
    } else if (total < 0) {
      $total.classList.remove(...['text-gray-500', 'text-sky-500']);
      $total.classList.add('text-red-500');
    } else {
      $total.classList.remove(...['text-sky-500', 'text-red-500']);
      $total.classList.add('text-gray-500');
    }
  };
}

function addItemToDB(item) {
  let transaction = db.transaction(OBJECT_STORE, 'readwrite');
  let objectStore = transaction.objectStore(OBJECT_STORE);
  let request = objectStore.add(item);
  request.onsuccess = (e) => loadItems();
  request.onerror = (e) => console.error('Error adding item:', request.error);
}

function createItemHandler(e) {
  e.preventDefault();
  let item = (() => {
    let $selectedOption = document.querySelector(
      'input[name="option"]:checked'
    );
    console.log('selectedOption', $selectedOption);
    let checkedType = $selectedOption
      ? $selectedOption.nextElementSibling.textContent.trim()
      : null;
    console.log('checkedType:', checkedType);
    let date = document.getElementById('date').value.trim(); // 날짜
    let price = +document.getElementById('price').value.trim().replace(',', ''); // 가격
    console.log('price:', price);
    let content = document.getElementById('content').value.trim(); // 내용
    price = checkedType === '지출' ? -price : price;
    return { date, price, content };
  })(); // 아이템
  if (!item.date || !item.content) return;
  addItemToDB(item);
  hideCreateItemFormHandler();
}

function createItemSubmitHandler(e) {
  e.preventDefault();
}

function createLi({ id, date, price, content }) {
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

function loadItems() {
  const $itemList = document.getElementById('itemList');
  while ($itemList.firstChild) $itemList.firstChild.remove();
  let transaction = db.transaction(OBJECT_STORE, 'readonly');
  let objectStore = transaction.objectStore(OBJECT_STORE);
  let cursorRequest = objectStore.openCursor(null, 'prev');
  cursorRequest.onsuccess = (e) => {
    let cursor = e.target.result;
    if (cursor) {
      let item = cursor.value;
      let $li = createLi(item);
      $itemList.appendChild($li);
      cursor.continue();
    }
  };
  setTotalPrice();
}
