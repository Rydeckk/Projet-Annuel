export function formatDateToLocalISOString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const trueDate = new Date(date)
    const year = trueDate.getFullYear();
    const month = pad(trueDate.getMonth() + 1); // Les mois commencent à 0
    const day = pad(trueDate.getDate());
    const hours = pad(trueDate.getHours());
    const minutes = pad(trueDate.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDateToLocalString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const trueDate = new Date(date)
    const year = trueDate.getFullYear();
    const month = pad(trueDate.getMonth() + 1); // Les mois commencent à 0
    const day = pad(trueDate.getDate());
    const hours = pad(trueDate.getHours());
    const minutes = pad(trueDate.getMinutes());

    return `${hours}:${minutes} ${day}/${month}/${year} `;
}