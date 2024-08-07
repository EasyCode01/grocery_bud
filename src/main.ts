// APP CONSTANTS
const THEME_LIGHT: string = 'light'
const THEME_DARK: string = 'dark'
const HIDE_CLASS: string = 'hide'
const LIST_ITEMS: string = 'list-items'
const UNDOSTACK_LIST: string = 'undoStack-list'
const REDO_STACK_LIST: string = 'redoStack-list'

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
  generateItem(items: ListItem[]): void
  updateTotalLength(length: number): void
  updateTotalPrice(price: number): void
  sendNotificationMsg(message: string, modifier: string): void
}

// UI MANAGER CLASS
class UiManager implements UiManagerInterface {
  private isMenuOptionOpen: boolean = false
  private optionsMenu: UiElement
  userInterfaceElement: UiElementInterface
  isEditableForm: boolean = false
  private timeoutId: number | null = null

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

  generateItem(items: ListItem[]): void {
    userInterfaeElement.itemWrapperElem.innerHTML = items
      .map((item) => {
        let { id, name, price, quantity } = item
        return `
         <li id="${id}" class="single__item">
                <span class="item__name">${name}</span>
                <span class="quantity__price">${quantity} x ${price}</span>
                <div class="actions">
                  <span id="${id}" class="edit-btn"><i class="bi bi-pencil-square"></i></span>
                  <span id="${id}" class="remove-btn remove-btn-${id} press"><i class="bi bi-trash"></i></span>
                </div>
              </li>
      `
      })
      .join('')

    // add event listener to the delete icon
    items.forEach((item) => {
      let { id } = item
      const removeBtn = document.querySelector(`.remove-btn-${id}`)
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {})
      }
    })
  }

  updateTotalLength(length: number): void {
    this.userInterfaceElement.totalItemElem.innerText = length.toString()
  }

  updateTotalPrice(price: number): void {
    this.userInterfaceElement.totalPriceElem.innerText = ` $${price.toString()}`
  }

  sendNotificationMsg(message: string, modifier: string): void {
    if (this.timeoutId !== null) {
      this.userInterfaceElement.notificationMsgElem.classList.remove(
        'success-msg'
      )
      this.userInterfaceElement.notificationMsgElem.classList.remove(
        'error-msg'
      )
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.userInterfaceElement.notificationMsgElem.innerText = message
    this.userInterfaceElement.notificationMsgElem.classList.add(modifier)
    this.userInterfaceElement.notificationMsgElem.style.opacity = '1'

    this.timeoutId = setTimeout(() => {
      this.userInterfaceElement.notificationMsgElem.innerText = ''
      this.userInterfaceElement.notificationMsgElem.classList.remove(modifier)
      this.userInterfaceElement.notificationMsgElem.style.opacity = '0'
      this.timeoutId = null
    }, 2500)
  }

  activateEditableForm(): void {
    this.isEditableForm = true
  }

  deactivateEditableForm(): void {
    this.isEditableForm = false
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
  editItem(itemId: string, newItem: ListItem): void
  setItem(list: ListItem[]): void
  setItemToEditId(id: string): void
  clearItemToEditId(id: string): void
  removeItem(id: string): boolean
  getTotalPrice(): number
  getItems(): ListItem[]
  findItem(id: string): ListItem | undefined
  getItemsLength(): number
  saveToStorage(): void
  retrieveFromStorage(): void
  clearItems(): void
}

// LIST_MANAGER_CLASS
class ListManager implements ListManagerInterface {
  private _items: ListItem[] = []
  itemToEditId: string = ''

  constructor() {
    this.retrieveFromStorage()
  }

  addItem(item: ListItem): boolean {
    this._items.push(item)
    this.saveToStorage()
    return true
  }

  editItem(itemId: string, newItem: ListItem): void {
    this._items = this._items.map((item) => {
      if (item.id === itemId) {
        return newItem
      }
      return item
    })

    this.saveToStorage()
  }

  setItem(list: ListItem[]): void {
    this._items = list
    this.saveToStorage()
  }

  setItemToEditId(id: string): void {
    this.itemToEditId = id
  }

  clearItemToEditId(id: string): void {
    this.itemToEditId = ''
  }

  removeItem(id: string): boolean {
    const initialLength = this._items.length
    this._items = this._items.filter((item) => item.id !== id)
    this.saveToStorage()

    return this._items.length < initialLength
  }

  getItems(): ListItem[] {
    return this._items
  }

  findItem(id: string): ListItem | undefined {
    let itemFound = this._items.find((item) => item.id === id)
    if (itemFound !== undefined) {
      return itemFound
    }
    return undefined
  }

  getTotalPrice(): number {
    if (this._items.length === 0) return 0
    const total: number[] = this._items.map(
      (item) => item.price * item.quantity
    )

    const sum: number = total.reduce((acc, cur) => acc + cur, 0)
    return sum
  }

  getItemsLength(): number {
    return this._items.length
  }

  saveToStorage(): void {
    localStorage.setItem(LIST_ITEMS, JSON.stringify(this._items))
  }

  retrieveFromStorage(): void {
    const storedList = localStorage.getItem(LIST_ITEMS)
    this._items = storedList ? JSON.parse(storedList) : []
  }

  clearItems(): void {
    this._items = []
    this.saveToStorage()
  }
}

// STACK INTERFACE
interface StackInterface {
  push(state: ListItem[]): void
  pop(): ListItem[]
  isEmpty(): boolean
  peek(): ListItem[] | null
  getLength(): number
  clear(): void
  print(): ListItem[][]
  saveToStorage(key: string): void
  retrieveFromStorage(key: string): void
}

// STACK_CLASS
class Stack implements StackInterface {
  private _items: ListItem[][]
  private storageKey: string
  constructor(storageKey: string) {
    this._items = []
    this.storageKey = storageKey
    this.retrieveFromStorage(this.storageKey)
  }

  push(state: ListItem[]) {
    this._items.push(state)
    this.saveToStorage(this.storageKey)
  }

  isEmpty(): boolean {
    return this._items.length === 0
  }

  pop(): ListItem[] {
    if (!this.isEmpty()) {
      this.saveToStorage(this.storageKey)
      return this._items.pop()!
    }
    return []
  }

  peek(): ListItem[] | null {
    if (!this.isEmpty()) {
      return this._items[this.getLength() - 1]
    }
    return null
  }

  getLength(): number {
    return this._items.length
  }

  clear(): void {
    this._items = []
    this.saveToStorage(this.storageKey)
  }

  print(): ListItem[][] {
    return this._items
  }

  saveToStorage(key: string): void {
    localStorage.setItem(key, JSON.stringify(this._items))
  }

  retrieveFromStorage(key: string): void {
    const storedStates = localStorage.getItem(key)
    this._items = storedStates ? JSON.parse(storedStates) : []
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
  return uiManager
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
const uiManager = initializeUiManager(optionsMenu, optionsMenuIcon)

// Accessing form Elements

const formList = document.querySelector('.grocery__form') as HTMLFormElement
const nameInput = document.querySelector('#item__input') as HTMLInputElement
const priceInput = document.querySelector('#item__price') as HTMLInputElement
const quantityInput = document.querySelector('#item__qty') as HTMLInputElement
const clearItemsBtn = document.querySelector(
  '.clear-items'
) as HTMLButtonElement
const undoButton = document.querySelector('.undo') as HTMLDivElement
const redoButton = document.querySelector('.redo') as HTMLDivElement

checkElement(formList, 'Form Element List')
checkElement(nameInput, 'name input element')
checkElement(priceInput, 'price input element')
checkElement(quantityInput, 'quantity input element')
checkElement(clearItemsBtn, 'Clear items button')
checkElement(notificationMessageElem, 'Notification message input')
checkElement(itemContainer, 'Item container')
checkElement(undoButton, 'undo button element')
checkElement(redoButton, 'redo button element')
// Validate form input
const isFormInputValid = (): boolean => {
  if (nameInput.value === '') {
    uiManager.sendNotificationMsg('list name cannot be empty', 'error-msg')
    return false
  }

  if (priceInput.value === '') {
    uiManager.sendNotificationMsg('Price cannot be empty', 'error-msg')
    return false
  }

  if (isNaN(parseInt(priceInput.value))) {
    uiManager.sendNotificationMsg('Price must be a number', 'error-msg')
    return false
  }

  if (quantityInput.value === '') {
    uiManager.sendNotificationMsg('quantity cannot be empty', 'error-msg')
    return false
  }

  return true
}

// instantiate List
const list = new ListManager()
const undoStack = new Stack(UNDOSTACK_LIST)
const redoStack = new Stack(REDO_STACK_LIST)

// initial render
uiManager.generateItem(list.getItems())
uiManager.updateTotalLength(list.getItemsLength())
uiManager.updateTotalPrice(list.getTotalPrice())

const updateUI = (message: string, modifier: string): void => {
  uiManager.generateItem(list.getItems())
  uiManager.sendNotificationMsg(message, modifier)
  uiManager.updateTotalLength(list.getItemsLength())
  uiManager.updateTotalPrice(list.getTotalPrice())
}

const generateItemId = (): string => {
  let itemId = new Date().getTime()
  const idPattern = 'item'
  return `${idPattern}-${itemId}`
}

const acceptItem = (): void => {
  let item: ListItem = {
    id: generateItemId(),
    name: nameInput.value,
    price: parseInt(priceInput.value),
    quantity: parseInt(quantityInput.value),
  }

  undoStack.push([...list.getItems()]) // copy listItem current state to undo stack
  redoStack.clear() // clear redo stack
  list.addItem(item)
  uiManager.generateItem(list.getItems())
  updateUI(`${item.name} is successfully added`, 'success-msg')
  attachDeleteListener()
  attachEditListener()
}

const updateItem = (): ListItem => {
  let item: ListItem = {
    id: generateItemId(),
    name: nameInput.value,
    price: parseInt(priceInput.value),
    quantity: parseInt(quantityInput.value),
  }

  return item
}

const resetForm = (): void => {
  nameInput.value = ''
  priceInput.value = ''
  quantityInput.value = ''
}

// clear all items
clearItemsBtn.addEventListener('click', () => {
  if (list.getItemsLength() === 0) {
    uiManager.sendNotificationMsg('No item in the list', 'error-msg')
    return
  }
  undoStack.push([...list.getItems()]) // push current  state to undoStack
  redoStack.clear() // clear redoStack
  list.clearItems()
  uiManager.generateItem(list.getItems())
  updateUI('items cleared', 'success-msg')
})

// add and edit form
formList.addEventListener('submit', (e: Event) => {
  e.preventDefault()
  if (isFormInputValid() && !uiManager.isEditableForm) {
    acceptItem()
    resetForm()
    return
  }

  if (isFormInputValid() && uiManager.isEditableForm) {
    const ItemToEdit = list
      .getItems()
      .find((item) => item.id === list.itemToEditId)
    if (ItemToEdit === undefined) {
      uiManager.sendNotificationMsg('Sorry, Item has been deleted', 'error-msg')
      resetForm()
      uiManager.deactivateEditableForm()
      exitUpdateMode()
      attachDeleteListener()
      attachEditListener()
      return
    }
    undoStack.push([...list.getItems()]) // push current state to undoStack
    redoStack.clear() // clear redoStack
    list.editItem(list.itemToEditId, updateItem())
    updateUI('Item updated', 'success-msg')
    uiManager.deactivateEditableForm()
    exitUpdateMode()
    attachDeleteListener()
    attachEditListener()
    return
  }

  return
})

const attachDeleteListener = (): void => {
  let deleteItemBtns = document.querySelectorAll('.remove-btn')
  deleteItemBtns.forEach((deleteBtn) => {
    let removeBtn = deleteBtn as HTMLSpanElement
    removeBtn.addEventListener('click', () => {
      let id = removeBtn.id
      undoStack.push([...list.getItems()]) // push curent state to undostack
      redoStack.clear() // clear redoStack
      list.removeItem(id)
      updateUI('Item removed', 'error-msg')
      attachDeleteListener()
      attachEditListener()
    })
  })
}
// initial render
attachDeleteListener()

const attachEditListener = (): void => {
  const editItemBtns = document.querySelectorAll('.edit-btn')
  editItemBtns.forEach((btn) => {
    let editBtn = btn as HTMLSpanElement
    editBtn.addEventListener('click', () => {
      let id = editBtn.id
      populateEditForm(id)
    })
  })
}

attachEditListener()

const populateEditForm = (id: string): void => {
  let itemToEdit = list.findItem(id)
  if (itemToEdit !== undefined) {
    nameInput.value = itemToEdit.name
    priceInput.value = itemToEdit.price.toString()
    quantityInput.value = itemToEdit.quantity.toString()

    switchToUpdateMode()
    list.setItemToEditId(itemToEdit.id)
    uiManager.activateEditableForm()
  } else {
    uiManager.sendNotificationMsg('item not found', 'error-msg')
    return
  }
}

const switchToUpdateMode = (): void => {
  let addOrUpdateBtn = document.querySelector(
    '.add-or-update-btn'
  ) as HTMLButtonElement
  checkElement(addOrUpdateBtn, 'add or update button')
  addOrUpdateBtn.innerText = 'Update item'
  addOrUpdateBtn.classList.add('modify--btn')
}

const exitUpdateMode = (): void => {
  let addOrUpdateBtn = document.querySelector(
    '.add-or-update-btn'
  ) as HTMLButtonElement
  checkElement(addOrUpdateBtn, 'add or update button')
  addOrUpdateBtn.innerText = 'Submit'
  addOrUpdateBtn.classList.remove('modify--btn')
  resetForm()
}

undoButton.addEventListener('click', () => {
  if (undoStack.isEmpty()) {
    uiManager.sendNotificationMsg('Nothing to undo', 'error-msg')
  } else {
    redoStack.push([...list.getItems()])
    list.clearItems()
    list.setItem(undoStack.pop())
    updateUI('undo action successful', 'success-msg')
    attachDeleteListener()
    attachEditListener()
  }
})

redoButton.addEventListener('click', () => {
  if (redoStack.isEmpty()) {
    uiManager.sendNotificationMsg('Nothing to redo', 'error-msg')
  } else {
    undoStack.push([...list.getItems()])
    list.clearItems()
    list.setItem(redoStack.pop())
    updateUI('redo action successful', 'success-msg')
    attachDeleteListener()
    attachEditListener()
  }
})
