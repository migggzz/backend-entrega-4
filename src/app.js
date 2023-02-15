const express = require('express');
const fs = require('fs');
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/cart.router');

const productsFile = "products.json";
const cartsFile = "carts.json";

const app = express();

app.listen(8080),() => {
    console.log('Server is running on port 8080')
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', productsRouter);

app.use('/api/cart',cartsRouter)

// module.exports = {products,cart};

