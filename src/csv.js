function clickExportToCSVBtnHandler() {
  let exportToCSVEvent = new CustomEvent('export-csv');
  document.dispatchEvent(exportToCSVEvent);
}
window.clickExportToCSVBtnHandler = clickExportToCSVBtnHandler;

export function exportToCSV(items) {
  items = items.filter((item) => item.id !== -1);
  if (items.length === 0) return;
  let header = Object.keys(items[0]).join(',');
  let rows = items.map((item) => Object.values(item).join(','));
  let csvContent = [header, ...rows].join('\n');
  let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  let url = URL.createObjectURL(blob);
  let $link = document.createElement('a');
  $link.setAttribute('href', url);
  $link.setAttribute('download', 'account_book.csv');
  $link.style.visibility = 'hidden';
  document.body.appendChild($link);
  $link.click();
  document.body.removeChild($link);
}
