 export function formatPrice(str) {
  const num = parseFloat(str);
  if (isNaN(num)) {
    return "Invalid input";
  } else {
      return num.toFixed(2);
  }
}

export function formatDate(dateString) {
  if (dateString) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
    const dateParts = dateString.split('T')[0].split('-');
    const day = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[0], 10);
    return `${day} ${months[month]} ${year}`;
  }
}
