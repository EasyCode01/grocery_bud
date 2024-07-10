# Grocery Bud

## Description

The purpose of the Grocery Bud app is to help users take down a list of items they wish to purchase with an estimated price and quantity. The app allows users to create and manage shopping lists, helping them organize what they need to buy. It calculates the total cost of all items in the list, helping users stay within their budget and avoid overspending. Users can easily add, edit, or delete items from their lists, making it flexible to adjust their shopping needs. The undo and redo functionality allows users to revert or repeat recent changes, providing a safeguard against mistakes. The theme mode feature lets users switch between light and dark modes for a more comfortable and personalized shopping experience.

## Key Features and Benefits

- **Create and Manage Lists:** Users can create new shopping lists, and edit or delete existing ones.
- **Calculate Total Cost:** Automatically calculates the total cost for the items in the list.
- **Undo/Redo Functionality:** Allows users to undo or redo changes to their lists.
- **Theme Mode:** Provides a choice between light and dark modes.
- **User-Friendly Interface:** Intuitive design for easy list management and cost calculation.

## Installation Instructions

1. **Download Node.js:** Ensure you have Node.js installed on your machine. You can download it from [Node.js](https://nodejs.org/).

2. **Clone the Repository:** Open your terminal and run the following command to clone the repository:

   ```bash
   git clone <repository-url>
   ```

3. **Install Dependencies:** Navigate to the project directory and install the project dependencies specified in the `package.json` file by running:

   ```bash
   npm install
   ```

4. **Start the Application:** Use the following command to start the application:

   ```bash
   npx tsc -w
   ```

## Usage Instructions

1. **Enter your list in the list input.**
2. **Enter the amount in the amount input.**
3. **Enter the quantity in the quantity input.**
4. **Add item.**
5. **Edit items as needed.**
6. **Delete a single item if necessary.**
7. **Clear all items if required.**
8. **Undo an action.**
9. **Redo an action.**
10. **Switch theme mode between light and dark.**

## Code Structure

# Code Structure

## Constants:

- `THEME_LIGHT`
- `THEME_DARK`
- `HIDE_CLASS`
- `LIST_ITEMS`

## Type Definitions:

- `UiElement`: Union type for HTML elements

## Interfaces:

- `ThemeManagerInterface`: Interface for theme management
- `UiElementInterface`: Interface for UI elements
- `UiManagerInterface`: Interface for UI management
- `ListItem`: Interface for list items
- `ListManagerInterface`: Interface for list management

## Classes:

- `ThemeManager`: Manages theme state and application
- `UiManager`: Manages UI interactions and updates
- `ListManager`: Manages list items, storage, and retrieval

## DOM Access and Initialization:

- Functions to access and validate DOM elements
- Functions to initialize UI and theme managers
- Functions to handle form input and item manipulation

## Event Listeners:

- Listeners for form submission, item deletion, item editing, and theme switching

## Code Examples

To be provided.

## Contributing

To be provided.

## Contact Information

Author: Oyedijo Ezekiel  
Email: [ezekielayodele1@gmail.com](mailto:ezekielayodele1@gmail.com)  
LinkedIn: [Ezekiel Oyedijo](https://www.linkedin.com/in/ezekiel-oyedijo-58a9b5183)
