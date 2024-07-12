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
        this.isEditableForm = false;
        this.timeoutId = null;
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
                  <span id="${id}" class="edit-btn"><i class="bi bi-pencil-square"></i></span>
                  <span id="${id}" class="remove-btn remove-btn-${id} press"><i class="bi bi-trash"></i></span>
                </div>
              </li>
      `;
        })
            .join('');
        // add event listener to the delete icon
        items.forEach((item) => {
            let { id } = item;
            const removeBtn = document.querySelector(`.remove-btn-${id}`);
            if (removeBtn) {
                removeBtn.addEventListener('click', () => { });
            }
        });
    }
    updateTotalLength(length) {
        this.userInterfaceElement.totalItemElem.innerText = length.toString();
    }
    updateTotalPrice(price) {
        this.userInterfaceElement.totalPriceElem.innerText = ` $${price.toString()}`;
    }
    sendNotificationMsg(message, modifier) {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.userInterfaceElement.notificationMsgElem.innerText = message;
        this.userInterfaceElement.notificationMsgElem.classList.add(modifier);
        this.userInterfaceElement.notificationMsgElem.style.opacity = '1';
        this.timeoutId = setTimeout(() => {
            this.userInterfaceElement.notificationMsgElem.innerText = '';
            this.userInterfaceElement.notificationMsgElem.classList.remove(modifier);
            this.userInterfaceElement.notificationMsgElem.style.opacity = '0';
            this.timeoutId = null;
        }, 2500);
    }
    activateEditableForm() {
        this.isEditableForm = true;
    }
    deactivateEditableForm() {
        this.isEditableForm = false;
    }
}
// LIST_MANAGER_CLASS
class ListManager {
    constructor() {
        this._items = [];
        this.itemToEditId = '';
        this.retrieveFromStorage();
    }
    addItem(item) {
        this._items.push(item);
        this.saveToStorage();
        return true;
    }
    editItem(itemId, newItem) {
        this._items = this._items.map((item) => {
            if (item.id === itemId) {
                return newItem;
            }
            return item;
        });
        this.saveToStorage();
    }
    setItemToEditId(id) {
        this.itemToEditId = id;
    }
    clearItemToEditId(id) {
        this.itemToEditId = '';
    }
    removeItem(id) {
        const initialLength = this._items.length;
        this._items = this._items.filter((item) => item.id !== id);
        this.saveToStorage();
        return this._items.length < initialLength;
    }
    getItems() {
        return this._items;
    }
    findItem(id) {
        let itemFound = this._items.find((item) => item.id === id);
        if (itemFound !== undefined) {
            return itemFound;
        }
        return undefined;
    }
    getTotalPrice() {
        if (this._items.length === 0)
            return 0;
        const total = this._items.map((item) => item.price * item.quantity);
        const sum = total.reduce((acc, cur) => acc + cur, 0);
        return sum;
    }
    getItemsLength() {
        return this._items.length;
    }
    saveToStorage() {
        localStorage.setItem(LIST_ITEMS, JSON.stringify(this._items));
    }
    retrieveFromStorage() {
        const storedList = localStorage.getItem(LIST_ITEMS);
        this._items = storedList ? JSON.parse(storedList) : [];
    }
    clearItems() {
        this._items = [];
        this.saveToStorage();
    }
}
// STACK_CLASS
class Stack {
    constructor() {
        this._items = [];
    }
    push(state) {
        this._items.push(state);
    }
    isEmpty() {
        return this._items.length === 0;
    }
    pop() {
        if (!this.isEmpty()) {
            return this._items.pop();
        }
        return [];
    }
    peek() {
        if (!this.isEmpty()) {
            return this._items[this.getLength() - 1];
        }
        return null;
    }
    getLength() {
        return this._items.length;
    }
    clear() {
        this._items = [];
    }
    print() {
        return this._items;
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
    return uiManager;
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
const uiManager = initializeUiManager(optionsMenu, optionsMenuIcon);
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
// Validate form input
const isFormInputValid = () => {
    if (nameInput.value === '') {
        uiManager.sendNotificationMsg('list name cannot be empty', 'error-msg');
        return false;
    }
    if (priceInput.value === '') {
        uiManager.sendNotificationMsg('Price cannot be empty', 'error-msg');
        return false;
    }
    if (isNaN(parseInt(priceInput.value))) {
        uiManager.sendNotificationMsg('Price must be a number', 'error-msg');
        return false;
    }
    if (quantityInput.value === '') {
        uiManager.sendNotificationMsg('quantity cannot be empty', 'error-msg');
        return false;
    }
    return true;
};
// instantiate List
const list = new ListManager();
// initial render
uiManager.generateItem(list.getItems());
uiManager.updateTotalLength(list.getItemsLength());
uiManager.updateTotalPrice(list.getTotalPrice());
const updateUI = (message, modifier) => {
    uiManager.generateItem(list.getItems());
    uiManager.sendNotificationMsg(message, modifier);
    uiManager.updateTotalLength(list.getItemsLength());
    uiManager.updateTotalPrice(list.getTotalPrice());
};
const generateItemId = () => {
    let itemId = new Date().getTime();
    const idPattern = 'item';
    return `${idPattern}-${itemId}`;
};
const acceptItem = () => {
    let item = {
        id: generateItemId(),
        name: nameInput.value,
        price: parseInt(priceInput.value),
        quantity: parseInt(quantityInput.value),
    };
    list.addItem(item);
    uiManager.generateItem(list.getItems());
    updateUI(`${item.name} is successfully added`, 'success-msg');
    attachDeleteListener();
    attachEditListener();
};
const updateItem = () => {
    let item = {
        id: generateItemId(),
        name: nameInput.value,
        price: parseInt(priceInput.value),
        quantity: parseInt(quantityInput.value),
    };
    return item;
};
const resetForm = () => {
    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
};
// clear all items
clearItemsBtn.addEventListener('click', () => {
    if (list.getItemsLength() === 0) {
        uiManager.sendNotificationMsg('No item in the list', 'error-msg');
        return;
    }
    list.clearItems();
    uiManager.generateItem(list.getItems());
    updateUI('items cleared', 'success-msg');
});
formList.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isFormInputValid() && !uiManager.isEditableForm) {
        acceptItem();
        resetForm();
        return;
    }
    if (isFormInputValid() && uiManager.isEditableForm) {
        list.editItem(list.itemToEditId, updateItem());
        updateUI('Item updated', 'success-msg');
        uiManager.deactivateEditableForm();
        exitUpdateMode();
        attachDeleteListener();
        attachEditListener();
        return;
    }
    return;
});
const attachDeleteListener = () => {
    let deleteItemBtns = document.querySelectorAll('.remove-btn');
    deleteItemBtns.forEach((deleteBtn) => {
        let removeBtn = deleteBtn;
        removeBtn.addEventListener('click', () => {
            let id = removeBtn.id;
            list.removeItem(id);
            updateUI('Item removed', 'error-msg');
            attachDeleteListener();
            attachEditListener();
        });
    });
};
// initial render
attachDeleteListener();
const attachEditListener = () => {
    const editItemBtns = document.querySelectorAll('.edit-btn');
    editItemBtns.forEach((btn) => {
        let editBtn = btn;
        editBtn.addEventListener('click', () => {
            let id = editBtn.id;
            populateEditForm(id);
        });
    });
};
attachEditListener();
const populateEditForm = (id) => {
    let itemToEdit = list.findItem(id);
    if (itemToEdit !== undefined) {
        nameInput.value = itemToEdit.name;
        priceInput.value = itemToEdit.price.toString();
        quantityInput.value = itemToEdit.quantity.toString();
        switchToUpdateMode();
        list.setItemToEditId(itemToEdit.id);
        uiManager.activateEditableForm();
    }
    else {
        uiManager.sendNotificationMsg('item not found', 'error-msg');
        return;
    }
};
const switchToUpdateMode = () => {
    let addOrUpdateBtn = document.querySelector('.add-or-update-btn');
    checkElement(addOrUpdateBtn, 'add or update button');
    addOrUpdateBtn.innerText = 'Update item';
    addOrUpdateBtn.classList.add('modify--btn');
};
const exitUpdateMode = () => {
    let addOrUpdateBtn = document.querySelector('.add-or-update-btn');
    checkElement(addOrUpdateBtn, 'add or update button');
    addOrUpdateBtn.innerText = 'Submit';
    addOrUpdateBtn.classList.remove('modify--btn');
    resetForm();
};
