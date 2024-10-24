let $createItemFormSection = document.getElementById('createItemFormSection');
let $createItemForm = /*html*/ `
  <form
    id="createItemForm"
    onsubmit="createItemSubmitHandler(event)"
    class="flex flex-col justify-center items-center mt-6 gap-3 transition-opacity opacity-0 hidden"
  >
    <h2 class="w-full text-lg mb-2">거래 내역 추가</h2>
    <!-- 수입 | 지출 버튼 -->
    <div class="w-full flex gap-2 h-11">
      <label class="w-1/2">
        <input type="radio" name="option" class="hidden peer" />
        <div
          class="flex justify-center items-center h-full cursor-pointer text-sm border border-sky-400 text-sky-500 rounded-md peer-checked:bg-sky-300 peer-checked:text-white transition-colors duration-75"
        >
          수입
        </div>
      </label>
      <label class="w-1/2">
        <input type="radio" name="option" class="hidden peer" checked />
        <div
          class="flex justify-center items-center h-full cursor-pointer text-sm border border-red-400 text-red-500 rounded-md peer-checked:bg-red-300 peer-checked:text-white transition-colors duration-75"
        >
          지출
        </div>
      </label>
    </div>
    <!-- 날짜 -->
    <div class="flex items-center w-full">
      <label for="date" class="w-10 text-sm text-gray-800">날짜</label>
      <input
        id="date"
        name="date"
        type="date"
        class="w-full text-gray-800 p-1.5 outline-none border-b-2 border-gray-100 focus:border-b-gray-800 transition cursor-pointer"
      />
    </div>
    <!-- 금액 -->
    <div class="flex items-center w-full">
      <label for="price" class="w-10 text-sm text-gray-700">금액</label>
      <input
        id="price"
        name="price"
        type="text"
        class="w-full text-gray-800 p-1.5 outline-none border-b-2 border-gray-100 focus:border-b-gray-800 transition"
        value="0"
        oninput="formatPriceHandler(this)"
      />
    </div>
    <!-- 내용 -->
    <div class="flex items-center w-full mb-2">
      <label for="content" class="w-10 text-sm text-gray-700">내용</label>
      <input
        id="content"
        name="content"
        type="text"
        class="w-full text-gray-800 p-1.5 outline-none border-b-2 border-gray-100 focus:border-b-gray-800 transition"
      />
    </div>
    <!-- 저장 | 취소 버튼 -->
    <div class="w-full flex gap-2 h-11">
      <button
        onclick="hideCreateItemFormHandler(event)"
        class="w-4/12 rounded-md bg-gray-50 border border-gray-400 text-sm text-gray-900"
      >
        취소하기
      </button>
      <button
        onclick="createItemHandler(event)"
        class="w-8/12 rounded-md bg-gray-600 text-gray-50 text-sm"
      >
        저장하기
      </button>
    </div>
  </form>
`;
$createItemFormSection.innerHTML = $createItemForm;

export function hideCreateItemFormHandler() {
  document.getElementById('date').value = '';
  document.getElementById('price').value = '';
  document.getElementById('content').value = '';
  let $createItemForm = document.getElementById('createItemForm');
  $createItemForm.classList.add('hidden');
  setTimeout(() => {
    $createItemForm.classList.remove('opacity-100');
    $createItemForm.classList.add('opacity-0');
  }, 20);
  document.getElementById('createItemFormButton').classList.remove('hidden');
}
window.hideCreateItemFormHandler = hideCreateItemFormHandler;

function formatPriceHandler($input) {
  let value = $input.value.replace(/\D/g, '');
  $input.value = new Intl.NumberFormat().format(value);
}
window.formatPriceHandler = formatPriceHandler;

function getEnteredItem() {
  let $selectedOption = document.querySelector('input[name="option"]:checked');
  let checkedType = $selectedOption
    ? $selectedOption.nextElementSibling.textContent.trim()
    : null;
  let date = document.getElementById('date').value.trim(); // 날짜
  let price = +document.getElementById('price').value.trim().replace(',', ''); // 가격
  let content = document.getElementById('content').value.trim(); // 내용
  price = checkedType === '지출' ? -price : price;
  return { date, price, content };
}

async function createItemHandler(e) {
  e.preventDefault();
  let item = getEnteredItem();
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
