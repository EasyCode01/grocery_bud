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
  uiListElement: UiElement
  uiAppElement: UiElement
  activateLightMode(): string
  activateDarkMode(): string
}

class UiManager implements UiManagerInterface {
  readonly uiListElement: UiElement
  uiAppElement: UiElement

  constructor(uiListElement: UiElement, uiAppElement: UiElement) {
    this.uiListElement = uiListElement
    this.uiAppElement = uiAppElement
  }

  activateLightMode(): string {
    return `Light mode activated`
  }

  activateDarkMode(): string {
    return `Dark mode activated`
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
