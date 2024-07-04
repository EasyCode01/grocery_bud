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
}

type UiElement = HTMLUListElement | HTMLDivElement

const THEME_LIGHT = 'light'
const THEME_DARK = 'dark'
const HIDE_CLASS = 'hide'

interface UiManagerInterface {
  toggleOptionMenu(): string
}

interface ThemeManagerInterface {
  loadThemeState(): string
  activateLightMode(): string
  activateDarkMode(): string
  getThemeMode(): string
}

class UiManager implements UiManagerInterface {
  private isMenuOptionOpen: boolean = false
  private optionsMenu: UiElement

  constructor(optionsMenu: UiElement) {
    this.optionsMenu = optionsMenu
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
    console.log('Light mode activated')
    return 'Light mode activated'
  }

  activateDarkMode(): string {
    this._appWrapper.classList.add('dark__mode')
    this.themeMode = THEME_DARK
    localStorage.setItem('theme', JSON.stringify(this.themeMode))
    console.log('Dark mode activated')
    return 'Dark mode activated'
  }

  getThemeMode(): string {
    return this.themeMode
  }
}

class ListManager implements ListManagerInterface {
  private _items: ListItem[] = []

  addItem(item: ListItem) {
    this._items.push(item)
    console.log('Add item successfully')
    return true
  }

  removeItem(id: string): boolean {
    const initialLength = this._items.length
    this._items = this._items.filter((item) => item.id !== id)
    const itemRemoved = this._items.length < initialLength

    if (itemRemoved) {
      console.log('Removed item successfully')
      return true
    } else {
      console.log('Item not found')
      return false
    }
  }

  getItems(): ListItem[] {
    return this._items
  }
}

const uiListElement = document.querySelector(
  '.item__container'
) as HTMLUListElement | null
const uiAppElement = document.querySelector('.app') as HTMLDivElement

const lightModeButton = document.querySelector(
  '.light__switch'
) as HTMLDivElement
const darkModeButton = document.querySelector('.dark__switch') as HTMLDivElement

const optionsMenu = document.querySelector('.options__menu') as HTMLDivElement

const optionsMenuIcon = document.querySelector('.three__dots') as HTMLDivElement

const checkElement = (element: UiElement, desc: string): void => {
  if (!element) {
    throw new Error(`${desc} not found`)
  }
}

const initializeUiManager = (
  optionsMenu: HTMLDivElement,
  optionsMenuIcon: HTMLDivElement
) => {
  checkElement(optionsMenu, 'Options Menu')
  checkElement(optionsMenuIcon, 'Options Menu')

  const uiManager = new UiManager(optionsMenu)
  optionsMenuIcon.addEventListener('click', () => uiManager.toggleOptionMenu())
}

const initializeLightAndDarkModeButtons = (
  themeManager: ThemeManager,
  lightModeButton: UiElement,
  darkModeButton: UiElement
) => {
  const toggleLightAndDarkButton = (): void => {
    lightModeButton.classList.toggle(HIDE_CLASS)
    darkModeButton.classList.toggle(HIDE_CLASS)
  }

  lightModeButton.addEventListener('click', () => {
    themeManager.activateLightMode()
    toggleLightAndDarkButton()
  })

  darkModeButton.addEventListener('click', () => {
    themeManager.activateDarkMode()
    toggleLightAndDarkButton()
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
