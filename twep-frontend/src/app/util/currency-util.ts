const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
export function formatCurrency(value: string | number): string {
    const parsedValue = Number(value);
    if(Number.isNaN(parsedValue)){
        return 'NaN'
    }
    return currencyFormatter.format(parsedValue);
}