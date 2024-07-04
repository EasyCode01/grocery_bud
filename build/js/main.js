"use strict";
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';
const HIDE_CLASS = 'hide';
class UiManager {
    constructor(optionsMenu) {
        this.isMenuOptionOpen = false;
        this.optionsMenu = optionsMenu;
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
}
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
        console.log('Light mode activated');
        return 'Light mode activated';
    }
    activateDarkMode() {
        this._appWrapper.classList.add('dark__mode');
        this.themeMode = THEME_DARK;
        localStorage.setItem('theme', JSON.stringify(this.themeMode));
        console.log('Dark mode activated');
        return 'Dark mode activated';
    }
    getThemeMode() {
        return this.themeMode;
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
const checkElement = (element, desc) => {
    if (!element) {
        throw new Error(`${desc} not found`);
    }
};
const toggleHideClass = (element1, element2) => {
    element1.classList.toggle(HIDE_CLASS);
    element2.classList.toggle(HIDE_CLASS);
};
const initializeUiManager = (optionsMenu, optionsMenuIcon) => {
    checkElement(optionsMenu, 'Options Menu');
    checkElement(optionsMenuIcon, 'Options Menu');
    const uiManager = new UiManager(optionsMenu);
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
