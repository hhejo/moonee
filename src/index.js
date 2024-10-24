import './db.init.js';
import {
  getAllItemsFromDB,
  addItemToDB,
  deleteItemFromDB,
} from './db.controller.js';
import { setTotalPrice } from './header.js';
import { hideCreateItemFormHandler } from './create-form.js';
import './create-form-btn.js';
import { printItems } from './item.js';

document.addEventListener('db-opened', async () => {
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

document.addEventListener('item-deleted', async (e) => {
  let { id } = e.detail;
  await deleteItemFromDB(id);
  let items = await getAllItemsFromDB();
  printItems(items);
  setTotalPrice(items);
});

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
