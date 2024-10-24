function clickFilterBtnHandler(e) {
  let btnType = e.target.textContent.trim();

  let filterEvent = new CustomEvent('item-filtered', { detail: { btnType } });
  document.dispatchEvent(filterEvent);

  let $allFilterBtn = document.getElementById('allFilterBtn');
  let $incomeFilterBtn = document.getElementById('incomeFilterBtn');
  let $expenseFilterBtn = document.getElementById('expenseFilterBtn');

  switch (btnType) {
    case '수입':
      $allFilterBtn.classList.remove(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      $allFilterBtn.classList.add('text-gray-300');
      $incomeFilterBtn.classList.remove('text-gray-300');
      $incomeFilterBtn.classList.add(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      $expenseFilterBtn.classList.remove(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      $expenseFilterBtn.classList.add('text-gray-300');
      return;
    case '지출':
      $allFilterBtn.classList.remove(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      $allFilterBtn.classList.add('text-gray-300');
      $incomeFilterBtn.classList.remove(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      $incomeFilterBtn.classList.add('text-gray-300');
      $expenseFilterBtn.classList.remove('text-gray-300');
      $expenseFilterBtn.classList.add(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      return;
    case '전체':
      $allFilterBtn.classList.remove('text-gray-300');
      $allFilterBtn.classList.add(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      $incomeFilterBtn.classList.remove(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      $incomeFilterBtn.classList.add('text-gray-300');
      $expenseFilterBtn.classList.remove(
        'text-gray-700',
        'border-b-2',
        'border-gray-700'
      );
      $expenseFilterBtn.classList.add('text-gray-300');
      return;
  }
}
window.clickFilterBtnHandler = clickFilterBtnHandler;
