<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Routes

### Authentication

- Register
  - `POST /api/auth/register`
    - Register a new user with name, email, password, and address.

- Login
  - `POST /api/auth/login`
    - Authenticate user with email and password.

### Products

- Add Product
  - `POST /api/products`
    - Add a new product with name, price, stock, and description.

- Get Products
  - `GET /api/products`
    - Retrieve all products.

### Users

- Add to Cart
  - `POST /api/cart/add/:productid`
    - Add a specified quantity of a product to the user's cart.

- View User Cart
  - `GET /api/cart/:userId`
    - Retrieve the user's cart contents.

- Update Cart
  - `PUT /api/cart/update`
    - Update the quantity of a product in the user's cart.

- Remove Product from Cart
  - `DELETE /api/cart/remove/:productid`
    - Remove a product from the user's cart.

- Order History
  - `GET /api/users/:userid/orders`
    - Retrieve the order history for a user.

### Orders

- Create New Order
  - `POST /api/orders`
    - Create a new order with selected products.

- Get Order
  - `GET /api/orders/:orderid`
    - Retrieve details of a specific order.

- Update Order Status
  - `PUT /api/orders/:orderid/status`
    - Update the status of a specific order.

- Apply Coupon
  - `POST /api/orders/apply-coupon`
    - Apply a coupon to the order.

## Postman Collection

You can view the API documentation and test requests using the Postman collection:

[View Postman Collection](https://warped-space-529444.postman.co/workspace/Team-Workspace~72549520-0748-49eb-834b-b42255e87b3a/collection/27558883-23dab52e-0aad-4b68-aff9-a0c2c80d4dba?action=share&creator=27558883)

---

*Fares Elsadek*



