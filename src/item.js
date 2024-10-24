function deleteItemHandler(id) {
  let itemDeleteEvent = new CustomEvent('item-deleted', { detail: { id } });
  document.dispatchEvent(itemDeleteEvent);
}

export function createItemLiElement({ id, date, price, content }) {
  let $li = document.createElement('li');
  $li.id = id;
  $li.className =
    'flex w-full overflow-hidden h-14 py-1 rounded-md transition duration-75 hover:bg-gray-50';
  $li.onclick = () => deleteItemHandler(id);
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
