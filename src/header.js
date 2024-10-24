let $headerDiv = document.getElementById('headerDiv');

$headerDiv.innerHTML = /*html*/ `
  <header class="flex flex-col justify-center items-center mb-4">
    <h1 class="w-full text-3xl text-gray-700 border-b py-2">MooNee</h1>
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
      <div class="flex flex-col justify-center items-center w-full">
        <span class="text-sm text-gray-500 mb-2">지출</span>
        <span id="totalExpense" class="text-2xl text-red-500"></span>
      </div>
    </div>
  </header>
`;

export function setTotalPrice(items) {
  let [totalIncome, totalExpense, total] = [0, 0, 0];
  for (let { price } of items) {
    total += price;
    if (price >= 0) totalIncome += price;
    else totalExpense += price;
  }

  let formatComma = (val) => new Intl.NumberFormat().format(val);
  let $total = document.getElementById('total');
  $total.textContent = formatComma(Math.abs(total));
  document.getElementById('totalIncome').textContent = formatComma(
    Math.abs(totalIncome)
  );
  document.getElementById('totalExpense').textContent = formatComma(
    Math.abs(totalExpense)
  );

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
