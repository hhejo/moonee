function showCreateItemForm() {
  let $createItemForm = document.getElementById('createItemForm');
  // $createItemForm.style.display = 'block';
  // hidden 클래스를 추가
  // 버튼도 display hidden
}

// function itemClickHandler(event) {
//   const clickedItem = event.currentTarget;

//   const storeName = clickedItem.querySelector('.title').textContent.trim();
//   const memo = clickedItem.querySelector('.content').textContent.trim();
//   const price = +clickedItem
//     .querySelector('.price')
//     .textContent.trim()
//     .split(',')
//     .join('');

//   return;
// }

function createItem(e) {
  e.preventDefault();
  let date = (() => {
    let $date = document.getElementById('date');
    return $date.value.trim();
  })();
  let price = (() => {
    let $price = document.getElementById('price');
    return +$price.value.trim();
  })();
  let content = (() => {
    let $content = document.getElementById('content');
    return $content.value.trim();
  })();
  console.log(date, price, content);

  indexedDB;
}
