export type BankHoliday = {
    id: string;
    title: string;
    date: string;
    notes: string;
};

export async function fetchBankHolidays() {
    const response = await fetch("https://www.gov.uk/bank-holidays.json");
    const data = await response.json();
    return data;
}