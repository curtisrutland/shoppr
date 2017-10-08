const createId = (size: number) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    size = Math.floor(size);
    let text = "";
    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

export class ShoppingListItem {
    id: string;
    text: string;
    checked: boolean;
    constructor(text?: string, checked?: boolean) {
        this.checked = checked == null ? false : checked;
        this.text = text;
        this.id = createId(10);
    }
}

export class ShoppingList {
    id: string;
    title: string;
    items: ShoppingListItem[];
    constructor(title?: string, items?: ShoppingListItem[]) {
        this.items = items == null ? [] : items;
        this.title = title == null ? "" : title;
        this.id = createId(10);
    }
}