export function getEndOfWeek(date: Date): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + (5 - next.getDay() + 7) % 7);
    return next;
}

export function getStartOfWeek(date: Date): Date {
    const prev = new Date(date);
    const offset = prev.getDay();
    if (offset == 1) {
        return prev;
    } else if (offset == 0) {
        prev.setDate(prev.getDate() - 1);
    } else {
        prev.setDate(prev.getDate() - (offset + 1));
    }
    return prev;
}

export function renderMonthNames(start: Date, end: Date) {
    const months = [];
    const current = new Date(start.getFullYear(), start.getMonth());

    while (current <= end) {
        months.push(current.toLocaleString('en-GB', { month: 'short', year: '2-digit' }));
        current.setMonth(current.getMonth() + 1);
    }

    return months.map(m => <span key={ m } className = "month" > { m } </span>);
}