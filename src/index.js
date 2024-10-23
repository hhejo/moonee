let db; // DB
let [DB, OBJECT_STORE] = ['accountBook', 'items']; // DB 이름, ObjectStore 이름

/**
 *
 */
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

/**
 * DB에 item 추가
 * @param {object} item
 * @param {string} item.date
 * @param {number} item.price
 * @param {string} item.content
 */
function addItemToDB(item) {
  let transaction = db.transaction(OBJECT_STORE, 'readwrite');
  let objectStore = transaction.objectStore(OBJECT_STORE);
  let request = objectStore.add(item);
  request.onsuccess = (e) => loadItems();
  request.onerror = (e) => console.error('Error adding item:', request.error);
}

/**
 * 제출한 item을 DB에 추가
 * @param {Event} e
 */
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
    let price = +document.getElementById('price').value.trim(); // 가격
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

/**
 *
 * @param {*} item
 */
function createLi({ id, date, price, content }) {
  console.log('id, price:', price);
  let $li = document.createElement('li');
  $li.id = id;
  $li.className = 'flex w-full overflow-hidden h-12 py-1 transition';
  $li.onclick = (e) => console.log('Clicked:', id);
  $li.innerHTML = `
    <div class="flex flex-col w-full truncate">
      <span class="text-xs text-gray-400">${date}</span>
      <span class="truncate text-gray-700">${content}</span>
    </div>
    <div class="flex justify-end items-center w-28">
      <span class="text-sm ${
        price >= 0 ? 'text-sky-500' : 'text-red-500'
      }">${price}</span>
    </div>
  `;
  return $li;
}

/**
 *
 * @returns
 */
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
  return;
}
