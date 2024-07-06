"use strict";
// APP CONSTANTS
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';
const HIDE_CLASS = 'hide';
const LIST_ITEMS = 'list-items';
// THEME_MANAGER_CLASS
class ThemeManager {
    constructor(appWrapperElem) {
        this.themeMode = '';
        this._appWrapper = appWrapperElem;
        this.loadThemeState();
    }
    loadThemeState() {
        const storedTheme = localStorage.getItem('theme');
        this.themeMode = storedTheme ? JSON.parse(storedTheme) : THEME_LIGHT;
        this.applyTheme(this.themeMode);
        return `${this.themeMode} theme`;
    }
    applyTheme(theme) {
        theme === THEME_LIGHT ? this.activateLightMode() : this.activateDarkMode();
    }
    activateLightMode() {
        this._appWrapper.classList.remove('dark__mode');
        this.themeMode = THEME_LIGHT;
        localStorage.setItem('theme', JSON.stringify(this.themeMode));
        return 'Light mode activated';
    }
    activateDarkMode() {
        this._appWrapper.classList.add('dark__mode');
        this.themeMode = THEME_DARK;
        localStorage.setItem('theme', JSON.stringify(this.themeMode));
        return 'Dark mode activated';
    }
    getThemeMode() {
        return this.themeMode;
    }
}
// UI MANAGER CLASS
class UiManager {
    constructor(optionsMenu, userInterfaceElement) {
        this.isMenuOptionOpen = false;
        this.optionsMenu = optionsMenu;
        this.userInterfaceElement = userInterfaceElement;
    }
    toggleOptionMenu() {
        this.isMenuOptionOpen = !this.isMenuOptionOpen;
        if (this.isMenuOptionOpen) {
            this.optionsMenu.classList.remove(HIDE_CLASS);
            return 'Menu options opened';
        }
        else {
            this.optionsMenu.classList.add(HIDE_CLASS);
            return 'Menu options closed';
        }
    }
    generateItem(items) {
        userInterfaeElement.itemWrapperElem.innerHTML = items
            .map((item) => {
            let { id, name, price, quantity } = item;
            return `
         <li id="${id}" class="single__item">
                <span class="item__name">${name}</span>
                <span class="quantity__price">${quantity} x ${price}</span>
                <div class="actions">
                  <span><i class="bi bi-pencil-square"></i></span>
                  <span class="remove-btn-${id} press"><i class="bi bi-trash"></i></span>
                </div>
              </li>
      `;
        })
            .join('');
    }
}
// LIST_MANAGER_CLASS
class ListManager {
    constructor(listWrapper) {
        this._items = [];
        this.listWrapper = listWrapper;
        this.retrieveFromStorage();
    }
    addItem(item) {
        this._items.push(item);
        this.saveToStorage();
        return true;
    }
    saveToStorage() {
        localStorage.setItem(LIST_ITEMS, JSON.stringify(this._items));
    }
    retrieveFromStorage() {
        const storedList = localStorage.getItem(LIST_ITEMS);
        this._items = storedList ? JSON.parse(storedList) : [];
    }
    getItems() {
        return this._items;
    }
    clearItems() {
        this._items = [];
    }
    getItemsLength() {
        return this._items.length;
    }
    getTotalPrice() {
        const total = this._items.map((item) => item.price * item.quantity);
        const sum = total.reduce((acc, cur) => acc + cur, 0);
        return sum;
    }
    // not sorted
    removeItem(id) {
        const initialLength = this._items.length;
        this._items = this._items.filter((item) => item.id !== id);
        this.saveToStorage();
        const itemRemoved = this._items.length < initialLength;
        if (itemRemoved) {
            return true;
        }
        else {
            return false;
        }
    }
}
//////////// Access DOM ELEMENTS /////////////////////////
const uiListElement = document.querySelector('.item__container');
const uiAppElement = document.querySelector('.app');
const lightModeButton = document.querySelector('.light__switch');
const darkModeButton = document.querySelector('.dark__switch');
const optionsMenu = document.querySelector('.options__menu');
const optionsMenuIcon = document.querySelector('.three__dots');
let totalPriceElem = document.querySelector('#total__price');
let totalItemElem = document.querySelector('.cart__total');
let itemContainer = document.querySelector('.item__container');
let notificationMessageElem = document.querySelector('.notification__msg');
////////////// initialize functions ////////////////////
const checkElement = (element, desc) => {
    if (!element) {
        throw new Error(`${desc} not found`);
    }
};
const toggleHideClass = (element1, element2) => {
    element1.classList.toggle(HIDE_CLASS);
    element2.classList.toggle(HIDE_CLASS);
};
// User interface elements
const userInterfaeElement = {
    totalPriceElem,
    totalItemElem,
    itemWrapperElem: uiListElement,
    notificationMsgElem: notificationMessageElem,
};
const initializeUiManager = (optionsMenu, optionsMenuIcon) => {
    checkElement(optionsMenu, 'Options Menu');
    checkElement(optionsMenuIcon, 'Options Menu');
    checkElement(userInterfaeElement.totalPriceElem, 'total price element');
    checkElement(userInterfaeElement.totalItemElem, 'total item element');
    checkElement(userInterfaeElement.itemWrapperElem, 'item wrpper element');
    checkElement(userInterfaeElement.notificationMsgElem, 'notification message element');
    const uiManager = new UiManager(optionsMenu, userInterfaeElement);
    optionsMenuIcon.addEventListener('click', () => uiManager.toggleOptionMenu());
};
const initializeLightAndDarkModeButtons = (themeManager, lightModeButton, darkModeButton) => {
    lightModeButton.addEventListener('click', () => {
        themeManager.activateLightMode();
        toggleHideClass(lightModeButton, darkModeButton);
    });
    darkModeButton.addEventListener('click', () => {
        themeManager.activateDarkMode();
        toggleHideClass(lightModeButton, darkModeButton);
    });
};
const setInitialButtonState = (themeManager, lightModeButton, darkModeButton) => {
    if (themeManager.getThemeMode() === THEME_LIGHT) {
        lightModeButton.classList.add(HIDE_CLASS);
        darkModeButton === null || darkModeButton === void 0 ? void 0 : darkModeButton.classList.remove(HIDE_CLASS);
    }
    else {
        darkModeButton === null || darkModeButton === void 0 ? void 0 : darkModeButton.classList.add(HIDE_CLASS);
        lightModeButton === null || lightModeButton === void 0 ? void 0 : lightModeButton.classList.remove(HIDE_CLASS);
    }
};
const initializeThemeManager = (uiAppElement, lightModeButton, darkModeButton) => {
    checkElement(uiAppElement, 'Ui app Element');
    checkElement(lightModeButton, 'light mode button');
    checkElement(darkModeButton, 'dark mode button');
    const themeManager = new ThemeManager(uiAppElement);
    setInitialButtonState(themeManager, lightModeButton, darkModeButton);
    initializeLightAndDarkModeButtons(themeManager, lightModeButton, darkModeButton);
};
initializeThemeManager(uiAppElement, lightModeButton, darkModeButton);
initializeUiManager(optionsMenu, optionsMenuIcon);
// Accessing form Elements
const formList = document.querySelector('.grocery__form');
const nameInput = document.querySelector('#item__input');
const priceInput = document.querySelector('#item__price');
const quantityInput = document.querySelector('#item__qty');
const clearItemsBtn = document.querySelector('.clear-items');
checkElement(formList, 'Form Element List');
checkElement(nameInput, 'name input element');
checkElement(priceInput, 'price input element');
checkElement(quantityInput, 'quantity input element');
checkElement(clearItemsBtn, 'Clear items button');
checkElement(notificationMessageElem, 'Notification message input');
checkElement(itemContainer, 'Item container');
// send notification
let timeoutId = null;
const sendNotificationMsg = (element, message, modifier) => {
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    element.innerText = message;
    element.classList.add(modifier);
    element.style.opacity = '1';
    timeoutId = setTimeout(() => {
        element.innerText = '';
        element.classList.remove(modifier);
        element.style.opacity = '0';
        timeoutId = null;
    }, 2500);
};
// Validate form input
const validateFormInput = () => {
    if (nameInput.value === '') {
        sendNotificationMsg(notificationMessageElem, 'Name list cannot be empty', 'error-msg');
        return false;
    }
    if (priceInput.value === '') {
        sendNotificationMsg(notificationMessageElem, 'Price cannot be empty', 'error-msg');
        return false;
    }
    if (isNaN(parseInt(priceInput.value))) {
        sendNotificationMsg(notificationMessageElem, 'Price must be a number', 'error-msg');
        return false;
    }
    if (quantityInput.value === '') {
        sendNotificationMsg(notificationMessageElem, 'quantity cannot be empty', 'error-msg');
        return false;
    }
    return true;
};
// generate id
let itemId = 0;
const generateItemId = () => {
    itemId++;
    const idPattern = 'item';
    return `${idPattern}-${itemId}`;
};
// intantiate List
const list = new ListManager(itemContainer);
const acceptItem = () => {
    let item = {
        id: generateItemId(),
        name: nameInput.value,
        price: parseInt(priceInput.value),
        quantity: parseInt(quantityInput.value),
    };
    list.addItem(item);
    console.log(list.getItems());
    sendNotificationMsg(notificationMessageElem, `${item.name} is successfully added`, 'success-msg');
};
const resetForm = () => {
    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
};
// clear all items
clearItemsBtn.addEventListener('click', () => {
    list.clearItems();
});
formList.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateFormInput()) {
        acceptItem();
        resetForm();
    }
});
