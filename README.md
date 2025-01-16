# Crypto Wallet Backend

This project is a backend implementation for a simple crypto wallet application. The goal is to provide functionality for user registration, wallet creation, deposits, transfers, and transaction history through RESTful APIs.

Postman Documentation : https://documenter.getpostman.com/view/12891250/2sAYQWKtNA

---

## Features

- **User Management**: Register and login functionality.
- **Wallet Operations**:
  - Create a wallet linked to a user during registration.
  - Check wallet balance.
  - Deposit funds into the wallet.
  - Transfer funds between wallets.
- **Transaction History**:
  - List top transactions for a user.
  - Retrieve a summary of top users by transaction amounts.

---

## Tech Stack

- **Node.js**: Backend runtime.
- **Express.js**: Framework for creating RESTful APIs.
- **Sequelize ORM**: For database interaction.
- **PostgreSQL**: Database for storing user, wallet, and transaction information.
- **JWT (JSON Web Token)**: For user authentication.

---

## Prerequisites

1. **Install Node.js** (v14 or later) from [Node.js official site](https://nodejs.org/).
2. **Install PostgreSQL** from [PostgreSQL official site](https://www.postgresql.org/).
3. **Install Git** from [Git official site](https://git-scm.com/).

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
DB_USERNAME=<your_database_username>
DB_PASSWORD=<your_database_password>
DB_NAME=<your_database_name>
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=<your_jwt_secret_key>
```

### 4. Database Setup

## Important

Before proceeding with the Sequelize setup, ensure that you have **pgAdmin** and **PostgreSQL** installed and running on your machine. You can download and install them from the following links:

- [pgAdmin](https://www.pgadmin.org/download/)
- [PostgreSQL](https://www.postgresql.org/download/)


#### a. Create the Database
Run the following command to create the database (ensure PostgreSQL is running):

```bash
npx sequelize-cli db:create
```

#### b. Run Migrations
Execute the migrations to set up database tables:

```bash
npx sequelize-cli db:migrate
```

#### c. Seed Initial Data (Optional)
If seeds are available, you can populate the database with sample data:

```bash
npx sequelize-cli db:seed:all
```

### 5. Start the Server

Start the application:

```bash
npm run dev
```

By default, the server will run on `http://localhost:3000`.

---

## API Documentation

### Authentication

#### POST `/register`
- **Description**: Register a new user and create a wallet.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "username": "string"
  }
  ```

#### POST `/login`
- **Description**: Log in an existing user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "string"
  }
  ```

### Wallet Operations

#### GET `/wallet/balance`
- **Description**: Retrieve the current wallet balance.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Response**:
  ```json
  {
    "balance": 1000
  }
  ```

#### POST `/wallet/deposit`
- **Description**: Deposit funds into the wallet.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Request Body**:
  ```json
  {
    "amount": 500
  }
  ```
- **Response**:
  ```json
  {
    "message": "Deposit successful",
    "balance": 1500
  }
  ```

#### POST `/wallet/transfer`
- **Description**: Transfer funds to another user's wallet.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Request Body**:
  ```json
  {
    "recipientId": 2,
    "amount": 200
  }
  ```
- **Response**:
  ```json
  {
    "message": "Transfer successful"
  }
  ```

### Transactions

#### GET `/wallet/transactions/top`
- **Description**: Retrieve the top spender along with it's amount.
- **Headers**:
  ```json
  {
    "access_token": "<token>"
  }
  ```
- **Response**:
  ```json
  [
    {
      "senderName": "string",
      "amount": 100,
    }
  ]
  ```

  #### GET `/wallet/transactions/user/top`
- **Description**: Retrieve the top transactions for a user.
- **Headers**:
  ```json
  {
    "access_token": "<token>"
  }
  ```
- **Response**:
  ```json
  [
    {
      "senderName": "string",
      "recipientName": "string",
      "amount": 100,
      "createdAt": "timestamp"
    }
  ]
  ```

---

## Testing

Run tests using:

```bash
npm test
```

---

## Future Enhancements

1. Add support for multiple currencies.
2. Implement email notifications for transactions.
3. Add pagination for transaction history.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

