function itemClickHandler(event) {
  // event.stopPropagation();
  const clickedItem = event.currentTarget;

  const storeName = clickedItem.querySelector('.title').textContent.trim();
  const memo = clickedItem.querySelector('.content').textContent.trim();
  const price = +clickedItem
    .querySelector('.price')
    .textContent.trim()
    .split(',')
    .join('');

  clickedItem.innerHTML = `
    <div class="flex w-full">
      <div class="w-16 flex flex-col justify-center items-center bg-gray-200 text-sm text-gray-700">
        <select class="appearance-none bg-gray-200">
          <option value="대분류" class="text-center">대분류</option>
        </select>
        <select class="appearance-none bg-gray-200">
          <option value="소분류" class="text-center">소분류</option>
        </select>
      </div>
      <div class="flex flex-col justify-between px-1 flex-1 w-full bg-gray-100">
        <input type="text" value="${storeName}" class="w-full text-gray-900 bg-gray-100" />
        <input type="text" value="${memo}" class="w-full h-6 text-gray-500 bg-gray-100 text-xs" />
      </div>
      <div class="w-20 flex justify-center items-center bg-gray-200 text-sm">
        <input type="number" value="${price}" class="w-full bg-gray-200 text-center" />
      </div>
    </div>
    <div>
      수정
    </div>
  `;

  // <input type="text" value="대분류" class="text-center" />
  // <input type="text" value="소분류" class="text-center" />

  return;

  // 외부 클릭 감지를 위한 이벤트 핸들러
  function handleClickOutside(event) {
    if (!clickedItem.contains(event.target)) {
      const newMainCategory = clickedItem.querySelector('select').value;
      const newSubCategory =
        clickedItem.querySelector('input[type="text"]').value;
      const newStoreName =
        clickedItem.querySelector('input[type="text"]').value;
      const newMemo = clickedItem.querySelector('textarea').value;
      const newPrice = clickedItem.querySelector('input[type="number"]').value;

      // li의 원래 형식으로 복구
      clickedItem.innerHTML = `
        <div class="w-16 p-1 flex flex-col justify-center items-center bg-gray-400 text-sm text-gray-700">
          <div>${newMainCategory}</div>
          <div>${newSubCategory}</div>
        </div>
        <div class="p-1 flex-1 w-full bg-gray-300">
          <div class="text-gray-900">${newStoreName}</div>
          <div class="text-xs text-gray-700">${newMemo}</div>
        </div>
        <div class="w-20 p-1 flex justify-center items-center bg-gray-400 text-sm">
          ${Number(newPrice).toLocaleString()} <!-- 가격을 콤마로 포맷 -->
        </div>
      `;

      // 외부 클릭 이벤트 제거
      document.removeEventListener('click', handleClickOutside);
    }
  }

  // 외부 클릭 감지 등록
  document.addEventListener('click', handleClickOutside);
}
