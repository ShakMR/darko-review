# Order Info App

Built with [Next.js](https://nextjs.org/)

## Features

- **Form Input**: Users can input their order number and ZIP code to retrieve order details.
- **Order Details Display**: Once the form is submitted, order details are displayed on a separate page.
- **Mocked API Calls**: The current app uses mocked API responses, but this can be easily replaced with actual API calls.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (Recommended latest version)
- [npm](https://www.npmjs.com/) (comes bundled with Node.js)

### Installation

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/Dragidare/order-info-app.git
    cd order-info-app

    ```

2.  **Running the App**

    After installing the dependencies, you can run the app in development mode with:

       ```bash
       npm run dev
       ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Replacing the Mocked API Call

// Maybe you can explain how this mock is done?  I know you are using next.js serverside things, but maybe they don't 
know how it works.
Currently, the app uses a mocked API response. If you wish to replace this with an actual API:

- Navigate to the file and function where the mocked API call is made ('/src/pages/api/[orderNumber].ts').
- Replace the mock function or mocked data with your actual API call using tools like `fetch` or any other API request libraries.

### Testing

To run the automated tests:

```bash
npm test
```    

This will run all tests and provide output in the terminal.
