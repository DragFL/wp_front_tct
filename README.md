# WP FullStack Test - Frontend

This project is the frontend part of the WP FullStack Test. It is a React application that simulates a storefront.

## How to run it

In the project directory, you can run:

### `npm install`

Installs all the dependencies required for the project.

### `npm start`

Runs the app in the development mode.\nOpen [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\nYou may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Implementation

The project is a single-page application built with React. It uses Redux for state management and Material-UI for the components. The application is divided into the following main components:

*   **NavBar:** The top navigation bar that includes the cart icon.
*   **ProductList:** The main component that displays the list of products.
*   **ProductCard:** A card that displays the information of a single product.
*   **CartModal:** A modal that shows the items in the cart.
*   **PaymentModal:** A modal for the payment process.
*   **SummaryModal:** A modal that shows the summary of the purchase.

The state of the application is managed by Redux. There are three main slices:

*   **productSlice:** Manages the state of the products.
*   **cartSlice:** Manages the state of the cart.
*   **themeSlice:** Manages the state of the theme.

## What's missing

This is only the frontend part of the challenge. The backend integration is missing. 

* **Missing backend endpoints**
* **Missing logic to connect the frontend with the backend**
* **Make the UI prettier.**