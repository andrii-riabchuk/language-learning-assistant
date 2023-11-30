export function toCsv(data: string[]) {
  const csvContent = "data:text/csv;charset=utf-8," + data.join(",");

  const encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}

export function toClip(data: string[]) {
  navigator.clipboard.writeText(data.map((word) => word + "\n").join(""));
}
