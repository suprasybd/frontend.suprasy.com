export function formatDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function formatPrice(number: number) {
  return Number(number).toLocaleString('en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
  });
}
