let $createItemFormBtnSection = document.getElementById(
  'createItemFormBtnSection'
);
let $createItemFormBtn = /*html*/ `
  <button
    id="createItemFormButton"
    class="flex justify-center items-center rounded-md bg-gray-600 text-gray-50 h-16 w-full"
    onclick="displayCreateItemFormHandler(event)"
  >
    새로운 거래 내역을 추가하세요
  </button>
`;
$createItemFormBtnSection.innerHTML = $createItemFormBtn;

function displayCreateItemFormHandler() {
  let $createItemForm = document.getElementById('createItemForm');
  $createItemForm.classList.remove('hidden');
  setTimeout(() => {
    $createItemForm.classList.remove('opacity-0');
    $createItemForm.classList.add('opacity-100');
  }, 20);
  document.getElementById('createItemFormButton').classList.add('hidden');
}
window.displayCreateItemFormHandler = displayCreateItemFormHandler;
