import './db.init.js';
import {
  getAllItemsFromDB,
  addItemToDB,
  deleteItemFromDB,
} from './db.controller.js';
import { setTotalPrice } from './header.js';
import './create-form.js';
import './create-form-btn.js';
import { printItems } from './item.js';
import { getFilteredItems } from './filter.js';
import { exportToCSV } from './csv.js';

// DB 연결
document.addEventListener('db-opened', async () => {
  let items = await getAllItemsFromDB();
  printItems(items);
  setTotalPrice(items);
});

// 아이템 추가
document.addEventListener('item-added', async (e) => {
  let { item } = e.detail;
  await addItemToDB(item);
  let items = await getAllItemsFromDB();
  printItems(items);
  setTotalPrice(items);
});

// 아이템 삭제
document.addEventListener('item-deleted', async (e) => {
  let { id } = e.detail;
  await deleteItemFromDB(id);
  let items = await getAllItemsFromDB();
  printItems(items);
  setTotalPrice(items);
});

// 아이템 필터
document.addEventListener('item-filtered', async (e) => {
  let { btnType } = e.detail;
  let items = await getAllItemsFromDB();
  let filteredItems = getFilteredItems(btnType, items);
  printItems(filteredItems);
  setTotalPrice(items);
});

// CSV로 내보내기
document.addEventListener('export-csv', async (e) => {
  let items = await getAllItemsFromDB();
  exportToCSV(items);
});
