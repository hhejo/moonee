let $headerDiv = document.getElementById('headerDiv');
$headerDiv.innerHTML = /*html*/ `
  <header class="flex flex-col justify-center items-center mb-4">
    <div class="w-full flex justify-between items-center border-b">
      <h1 class="text-4xl text-gray-700 py-3 cursor-pointer">MooNee</h1>
      <div class="cursor-pointer">
        <div class="rounded-md w-7 h-0.5 mb-2 bg-gray-500"></div>
        <div class="rounded-md w-7 h-0.5 mb-2 bg-gray-500"></div>
        <div class="rounded-md w-7 h-0.5 bg-gray-500"></div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center w-full h-52">
      <span class="text-lg text-gray-500">OOO님, 안녕하세요 😃</span>
      <span class="text-lg text-gray-500 mb-3">이번 달의 거래 내역</span>
      <span id="total" class="text-5xl"></span>
    </div>
    <div class="flex w-full rounded-md border border-gray-200 h-28">
      <div class="flex flex-col justify-center items-center w-full">
        <span class="text-sm text-gray-500 mb-2">수입</span>
        <span id="totalIncome" class="text-2xl text-sky-500"></span>
      </div>
      <div class="w-0.5 h-full bg-gray-200"></div>
      <div class="flex flex-col justify-center items-center w-full">
        <span class="text-sm text-gray-500 mb-2">지출</span>
        <span id="totalExpense" class="text-2xl text-red-500"></span>
      </div>
    </div>
  </header>
`;

export function setTotalPrice(items) {
  let [totalIncome, totalExpense, total] = [0, 0, 0];
  for (let { id, price } of items) {
    if (id === -1) continue;
    total += price;
    if (price >= 0) totalIncome += price;
    else totalExpense += price;
  }
  [totalIncome, totalExpense] = [totalIncome, totalExpense].map(Math.abs);
  let setComma = (val) => new Intl.NumberFormat().format(val);
  let $total = document.getElementById('total');
  $total.textContent = setComma(Math.abs(total));
  document.getElementById('totalIncome').textContent = setComma(totalIncome);
  document.getElementById('totalExpense').textContent = setComma(totalExpense);
  if (total > 0) {
    $total.classList.remove('text-gray-500', 'text-red-500');
    $total.classList.add('text-sky-500');
  } else if (total < 0) {
    $total.classList.remove('text-gray-500', 'text-sky-500');
    $total.classList.add('text-red-500');
  } else {
    $total.classList.remove('text-sky-500', 'text-red-500');
    $total.classList.add('text-gray-500');
  }
}
