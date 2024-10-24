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
import './filter.js';

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

document.addEventListener('item-filtered', async (e) => {
  let { btnType } = e.detail;
  let items = await getAllItemsFromDB();
  let filteredItems = [];
  if (btnType === '수입') {
    for (let item of items) if (item.price > 0) filteredItems.push(item);
  } else if (btnType === '지출') {
    for (let item of items) if (item.price < 0) filteredItems.push(item);
  } else filteredItems = items;
  printItems(filteredItems);
  setTotalPrice(items);
});
