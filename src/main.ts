// APP CONSTANTS
const THEME_LIGHT = 'light'
const THEME_DARK = 'dark'
const HIDE_CLASS = 'hide'
const LIST_ITEMS: string = 'list-items'

// UI ELEMENT
type UiElement = HTMLUListElement | HTMLDivElement

// THEME MANAGER INTERFACE
interface ThemeManagerInterface {
  loadThemeState(): string
  activateLightMode(): string
  activateDarkMode(): string
  getThemeMode(): string
}

// THEME_MANAGER_CLASS
class ThemeManager implements ThemeManagerInterface {
  private _appWrapper: UiElement
  private themeMode: string = ''

  constructor(appWrapperElem: UiElement) {
    this._appWrapper = appWrapperElem
    this.loadThemeState()
  }

  loadThemeState(): string {
    const storedTheme = localStorage.getItem('theme')
    this.themeMode = storedTheme ? JSON.parse(storedTheme) : THEME_LIGHT
    this.applyTheme(this.themeMode)
    return `${this.themeMode} theme`
  }

  applyTheme(theme: string): void {
    theme === THEME_LIGHT ? this.activateLightMode() : this.activateDarkMode()
  }

  activateLightMode(): string {
    this._appWrapper.classList.remove('dark__mode')
    this.themeMode = THEME_LIGHT
    localStorage.setItem('theme', JSON.stringify(this.themeMode))
    return 'Light mode activated'
  }

  activateDarkMode(): string {
    this._appWrapper.classList.add('dark__mode')
    this.themeMode = THEME_DARK
    localStorage.setItem('theme', JSON.stringify(this.themeMode))
    return 'Dark mode activated'
  }

  getThemeMode(): string {
    return this.themeMode
  }
}

// UI MANAGER INTERFACE
interface UiElementInterface {
  totalPriceElem: HTMLSpanElement
  totalItemElem: HTMLSpanElement
  itemWrapperElem: HTMLUListElement
  notificationMsgElem: HTMLDivElement
}

interface UiManagerInterface {
  userInterfaceElement: UiElementInterface

  // method signature
  toggleOptionMenu(): string
}

// UI MANAGER CLASS
class UiManager implements UiManagerInterface {
  private isMenuOptionOpen: boolean = false
  private optionsMenu: UiElement
  userInterfaceElement: UiElementInterface

  constructor(
    optionsMenu: UiElement,
    userInterfaceElement: UiElementInterface
  ) {
    this.optionsMenu = optionsMenu
    this.userInterfaceElement = userInterfaceElement
  }

  toggleOptionMenu(): string {
    this.isMenuOptionOpen = !this.isMenuOptionOpen

    if (this.isMenuOptionOpen) {
      this.optionsMenu.classList.remove(HIDE_CLASS)
      return 'Menu options opened'
    } else {
      this.optionsMenu.classList.add(HIDE_CLASS)
      return 'Menu options closed'
    }
  }
}

// LISITEM INTERFACE
interface ListItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface ListManagerInterface {
  addItem(item: ListItem): boolean
  removeItem(id: string): boolean
  getItems(): ListItem[]
  generateItem(): void
  saveToStorage(): void
  retrieveFromStorage(): void
}

// LIST_MANAGER_CLASS
class ListManager implements ListManagerInterface {
  private _items: ListItem[] = []
  private listWrapper: UiElement

  constructor(listWrapper: UiElement) {
    this.listWrapper = listWrapper
    this.retrieveFromStorage()
    this.generateItem()
  }

  addItem(item: ListItem): boolean {
    this._items.push(item)
    this.saveToStorage()
    this.generateItem()
    return true
  }

  saveToStorage(): void {
    localStorage.setItem(LIST_ITEMS, JSON.stringify(this._items))
  }

  retrieveFromStorage(): void {
    const storedList = localStorage.getItem(LIST_ITEMS)
    this._items = storedList ? JSON.parse(storedList) : []
  }

  removeItem(id: string): boolean {
    const initialLength = this._items.length
    this._items = this._items.filter((item) => item.id !== id)
    this.saveToStorage()
    this.generateItem()

    const itemRemoved = this._items.length < initialLength

    if (itemRemoved) {
      return true
    } else {
      return false
    }
  }

  generateItem(): void {
    this.listWrapper.innerHTML = this._items
      .map((item) => {
        let { id, name, price, quantity } = item
        return `
         <li id="${id}" class="single__item">
                <span class="item__name">${name}</span>
                <span class="quantity__price">${quantity} x ${price}</span>
                <div class="actions">
                  <span><i class="bi bi-pencil-square"></i></span>
                  <span class="remove-btn-${id} press"><i class="bi bi-trash"></i></span>
                </div>
              </li>
      `
      })
      .join('')

    // add event listener to the delete icon
    this._items.forEach((item) => {
      let { id } = item
      const removeBtn = document.querySelector(`.remove-btn-${id}`)
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          this.removeItem(`${id}`)
        })
      }
    })
  }

  getItems(): ListItem[] {
    return this._items
  }

  getItemsLength(): number {
    return this._items.length
  }

  clearItems(): void {
    this._items = []

    this.generateItem()
    this.getItemsLength()
    this.saveToStorage()
  }
}

//////////// Access DOM ELEMENTS /////////////////////////

const uiListElement = document.querySelector(
  '.item__container'
) as HTMLUListElement
const uiAppElement = document.querySelector('.app') as HTMLDivElement

const lightModeButton = document.querySelector(
  '.light__switch'
) as HTMLDivElement
const darkModeButton = document.querySelector('.dark__switch') as HTMLDivElement

const optionsMenu = document.querySelector('.options__menu') as HTMLDivElement

const optionsMenuIcon = document.querySelector('.three__dots') as HTMLDivElement

let totalPriceElem = document.querySelector('#total__price') as HTMLSpanElement

let totalItemElem = document.querySelector('.cart__total') as HTMLSpanElement

let itemContainer = document.querySelector(
  '.item__container'
) as HTMLUListElement

let notificationMessageElem = document.querySelector(
  '.notification__msg'
) as HTMLDivElement

////////////// initialize functions ////////////////////

const checkElement = (element: HTMLElement, desc: string): void => {
  if (!element) {
    throw new Error(`${desc} not found`)
  }
}

const toggleHideClass = (element1: UiElement, element2: UiElement): void => {
  element1.classList.toggle(HIDE_CLASS)
  element2.classList.toggle(HIDE_CLASS)
}

// User interface elements
const userInterfaeElement: UiElementInterface = {
  totalPriceElem,
  totalItemElem,
  itemWrapperElem: uiListElement,
  notificationMsgElem: notificationMessageElem,
}

const initializeUiManager = (
  optionsMenu: HTMLDivElement,
  optionsMenuIcon: HTMLDivElement
) => {
  checkElement(optionsMenu, 'Options Menu')
  checkElement(optionsMenuIcon, 'Options Menu')
  checkElement(userInterfaeElement.totalPriceElem, 'total price element')
  checkElement(userInterfaeElement.totalItemElem, 'total item element')
  checkElement(userInterfaeElement.itemWrapperElem, 'item wrpper element')
  checkElement(
    userInterfaeElement.notificationMsgElem,
    'notification message element'
  )

  const uiManager = new UiManager(optionsMenu, userInterfaeElement)
  optionsMenuIcon.addEventListener('click', () => uiManager.toggleOptionMenu())
}

const initializeLightAndDarkModeButtons = (
  themeManager: ThemeManager,
  lightModeButton: UiElement,
  darkModeButton: UiElement
) => {
  lightModeButton.addEventListener('click', () => {
    themeManager.activateLightMode()
    toggleHideClass(lightModeButton, darkModeButton)
  })

  darkModeButton.addEventListener('click', () => {
    themeManager.activateDarkMode()
    toggleHideClass(lightModeButton, darkModeButton)
  })
}

const setInitialButtonState = (
  themeManager: ThemeManager,
  lightModeButton: UiElement,
  darkModeButton: UiElement
): void => {
  if (themeManager.getThemeMode() === THEME_LIGHT) {
    lightModeButton.classList.add(HIDE_CLASS)
    darkModeButton?.classList.remove(HIDE_CLASS)
  } else {
    darkModeButton?.classList.add(HIDE_CLASS)
    lightModeButton?.classList.remove(HIDE_CLASS)
  }
}

const initializeThemeManager = (
  uiAppElement: UiElement,
  lightModeButton: UiElement,
  darkModeButton: UiElement
) => {
  checkElement(uiAppElement, 'Ui app Element')
  checkElement(lightModeButton, 'light mode button')
  checkElement(darkModeButton, 'dark mode button')

  const themeManager = new ThemeManager(uiAppElement)

  setInitialButtonState(themeManager, lightModeButton, darkModeButton)

  initializeLightAndDarkModeButtons(
    themeManager,
    lightModeButton,
    darkModeButton
  )
}

initializeThemeManager(uiAppElement, lightModeButton, darkModeButton)
initializeUiManager(optionsMenu, optionsMenuIcon)

// Accessing form Elements

const formList = document.querySelector('.grocery__form') as HTMLFormElement
const nameInput = document.querySelector('#item__input') as HTMLInputElement
const priceInput = document.querySelector('#item__price') as HTMLInputElement
const quantityInput = document.querySelector('#item__qty') as HTMLInputElement
const clearItemsBtn = document.querySelector(
  '.clear-items'
) as HTMLButtonElement

checkElement(formList, 'Form Element List')
checkElement(nameInput, 'name input element')
checkElement(priceInput, 'price input element')
checkElement(quantityInput, 'quantity input element')
checkElement(clearItemsBtn, 'Clear items button')
checkElement(notificationMessageElem, 'Notification message input')
checkElement(itemContainer, 'Item container')

// send notification
let timeoutId: number | null = null

const sendNotificationMsg = (
  element: HTMLDivElement,
  message: string,
  modifier: string
) => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  element.innerText = message
  element.classList.add(modifier)
  element.style.opacity = '1'

  timeoutId = setTimeout(() => {
    element.innerText = ''
    element.classList.remove(modifier)
    element.style.opacity = '0'
    timeoutId = null
  }, 2500)
}

// Validate form input
const validateFormInput = (): boolean => {
  if (nameInput.value === '') {
    sendNotificationMsg(
      notificationMessageElem,
      'Name list cannot be empty',
      'error-msg'
    )
    return false
  }

  if (priceInput.value === '') {
    sendNotificationMsg(
      notificationMessageElem,
      'Price cannot be empty',
      'error-msg'
    )
    return false
  }

  if (isNaN(parseInt(priceInput.value))) {
    sendNotificationMsg(
      notificationMessageElem,
      'Price must be a number',
      'error-msg'
    )
    return false
  }

  if (quantityInput.value === '') {
    sendNotificationMsg(
      notificationMessageElem,
      'quantity cannot be empty',
      'error-msg'
    )
    return false
  }

  return true
}

// generate id
let itemId: number = 0
const generateItemId = (): string => {
  itemId++
  const idPattern = 'item'
  return `${idPattern}-${itemId}`
}

// intantiate List
const list = new ListManager(itemContainer)

const acceptItem = (): void => {
  let item: ListItem = {
    id: generateItemId(),
    name: nameInput.value,
    price: parseInt(priceInput.value),
    quantity: parseInt(quantityInput.value),
  }

  list.addItem(item)
  console.log(list.getItems())

  sendNotificationMsg(
    notificationMessageElem,
    `${item.name} is successfully added`,
    'success-msg'
  )
}

const resetForm = (): void => {
  nameInput.value = ''
  priceInput.value = ''
  quantityInput.value = ''
}

// clear all items
clearItemsBtn.addEventListener('click', () => {
  list.clearItems()
})

formList.addEventListener('submit', (e: Event) => {
  e.preventDefault()
  if (validateFormInput()) {
    acceptItem()
    resetForm()
  }
})
