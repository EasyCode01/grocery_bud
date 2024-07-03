"use strict";
class UiManager {
    constructor(optionsMenu) {
        this.isMenuOptionOpen = false;
        this.optionsMenu = optionsMenu;
    }
    toggleOptionMenu() {
        this.isMenuOptionOpen = !this.isMenuOptionOpen;
        if (this.isMenuOptionOpen) {
            this.optionsMenu.classList.remove('hide');
            return 'Menu options opened';
        }
        else {
            this.optionsMenu.classList.add('hide');
            return 'Menu options closed';
        }
    }
}
class ThemeManager {
    constructor(appWrapperElem) {
        this._appWrapper = appWrapperElem;
    }
    activateLightMode() {
        this._appWrapper.classList.remove('dark__mode');
        this._appWrapper.classList.add('light__mode');
        console.log('Light mode activated');
        return 'Light mode activated';
    }
    activateDarkMode() {
        this._appWrapper.classList.remove('light__mode');
        this._appWrapper.classList.add('dark__mode');
        console.log('Dark mode activated');
        return 'Dark mode activated';
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
const lightModeButton = document.querySelector('.light__switch');
const darkModeButton = document.querySelector('.dark__switch');
const optionsMenu = document.querySelector('.options__menu');
const optionsMenuIcon = document.querySelector('.three__dots');
if (optionsMenu && optionsMenuIcon) {
    const uiManager = new UiManager(optionsMenu);
    optionsMenuIcon.addEventListener('click', () => uiManager.toggleOptionMenu());
}
else {
    console.log('Option Menu not or optionsMenuIcon not found');
}
if (lightModeButton && darkModeButton && uiAppElement) {
    const themeManager = new ThemeManager(uiAppElement);
    const toggleLightAndDarkButton = () => {
        lightModeButton.classList.toggle('hide');
        darkModeButton.classList.toggle('hide');
    };
    lightModeButton.addEventListener('click', () => {
        themeManager.activateLightMode();
        toggleLightAndDarkButton();
    });
    darkModeButton.addEventListener('click', () => {
        themeManager.activateDarkMode();
        toggleLightAndDarkButton();
    });
}
else {
    console.warn('Light mode button or Dark Mode button not found');
}
