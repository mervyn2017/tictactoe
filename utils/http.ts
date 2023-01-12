export async function fetchItems(url: string): Promise<any> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Network response was not OK');
    }
    return res.json();
}
