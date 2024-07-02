"use strict";
class UiManager {
    constructor(uiListElement, uiAppElement) {
        this.uiListElement = uiListElement;
        this.uiAppElement = uiAppElement;
    }
    activateLightMode() {
        return `Light mode activated`;
    }
    activateDarkMode() {
        return `Dark mode activated`;
    }
}
class ListManager {
    constructor() {
        this._items = [];
    }
    addItem(item) {
        this._items.push(item);
        console.log('Add item successfully');
        return true;
    }
    removeItem(id) {
        const initialLength = this._items.length;
        this._items = this._items.filter((item) => item.id !== id);
        const itemRemoved = this._items.length < initialLength;
        if (itemRemoved) {
            console.log('Removed item successfully');
            return true;
        }
        else {
            console.log('Item not found');
            return false;
        }
    }
    getItems() {
        return this._items;
    }
}
const uiListElement = document.querySelector('.item__container');
const uiAppElement = document.querySelector('.app');
if (uiListElement && uiAppElement) {
    const uiManger = new UiManager(uiListElement, uiAppElement);
}
