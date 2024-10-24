function deleteItemHandler(id) {
  console.log(id);
  let itemDeleteEvent = new CustomEvent('item-deleted', { detail: { id } });
  document.dispatchEvent(itemDeleteEvent);
  return;
  let deleteId = id;
  let transaction = db.transaction(OBJECT_STORE, 'readwrite');
  let objectStore = transaction.objectStore(OBJECT_STORE);
  let request = objectStore.delete(deleteId);
  request.onsuccess = () => {};
  // request.onsuccess = () => loadItems();
  request.onerror = () => console.error('Error deleting item:', request.error);
}

export function createItemLiElement({ id, date, price, content }) {
  let $li = document.createElement('li');
  $li.id = id;
  $li.className =
    'flex w-full overflow-hidden h-14 py-1 rounded-md transition duration-75 hover:bg-gray-50';
  $li.onclick = () => deleteItemHandler(id);
  // $li.onclick = function deleteLi() {
  //   let deleteId = id;
  //   let transaction = db.transaction(OBJECT_STORE, 'readwrite');
  //   let objectStore = transaction.objectStore(OBJECT_STORE);
  //   let request = objectStore.delete(deleteId);
  //   // request.onsuccess = () => loadItems();
  //   request.onerror = () =>
  //     console.error('Error deleting item:', request.error);
  // };
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

export function printItems(items) {
  const $itemList = document.getElementById('itemList');
  while ($itemList.firstChild) $itemList.firstChild.remove();
  for (let item of items) {
    let $li = createItemLiElement(item);
    $itemList.appendChild($li);
  }
}
