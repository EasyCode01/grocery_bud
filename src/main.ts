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

interface UiManagerInterface {
  toggleOptionMenu(): string
}

interface ThemeManagerInterface {
  activateLightMode(): string
  activateDarkMode(): string
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
      this.optionsMenu.classList.remove('hide')
      return 'Menu options opened'
    } else {
      this.optionsMenu.classList.add('hide')
      return 'Menu options closed'
    }
  }
}

class ThemeManager implements ThemeManagerInterface {
  private _appWrapper: UiElement

  constructor(appWrapperElem: UiElement) {
    this._appWrapper = appWrapperElem
  }

  activateLightMode(): string {
    this._appWrapper.classList.remove('dark__mode')
    this._appWrapper.classList.add('light__mode')
    console.log('Light mode activated')
    return 'Light mode activated'
  }

  activateDarkMode(): string {
    this._appWrapper.classList.remove('light__mode')
    this._appWrapper.classList.add('dark__mode')
    console.log('Dark mode activated')

    return 'Dark mode activated'
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
const uiAppElement = document.querySelector('.app') as HTMLDivElement | null

const lightModeButton = document.querySelector(
  '.light__switch'
) as HTMLDivElement | null
const darkModeButton = document.querySelector(
  '.dark__switch'
) as HTMLDivElement | null

const optionsMenu = document.querySelector(
  '.options__menu'
) as HTMLDivElement | null

const optionsMenuIcon = document.querySelector(
  '.three__dots'
) as HTMLDivElement | null

if (optionsMenu && optionsMenuIcon) {
  const uiManager = new UiManager(optionsMenu)
  optionsMenuIcon.addEventListener('click', () => uiManager.toggleOptionMenu())
} else {
  console.log('Option Menu not or optionsMenuIcon not found')
}

if (lightModeButton && darkModeButton && uiAppElement) {
  const themeManager = new ThemeManager(uiAppElement)

  const toggleLightAndDarkButton = () => {
    lightModeButton.classList.toggle('hide')
    darkModeButton.classList.toggle('hide')
  }

  lightModeButton.addEventListener('click', () => {
    themeManager.activateLightMode()
    toggleLightAndDarkButton()
  })

  darkModeButton.addEventListener('click', () => {
    themeManager.activateDarkMode()
    toggleLightAndDarkButton()
  })
} else {
  console.warn('Light mode button or Dark Mode button not found')
}
