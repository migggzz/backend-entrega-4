const express = require('express');
const fs = require('fs');
const handlebars = require('express-handlebars');
const {Server} = require('socket.io');
const PORT = 8080;  
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/cart.router');
const viewProductsRouter = require('./router/views.router');

const productsFile = "products.json";
const cartsFile = "carts.json";

const app = express();

// app.listen(8080),() => {
//     console.log('Server is running on port 8080')
// }

const httpServer = app.listen(PORT, () => console.log('Server started'));
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/view');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter);

app.use('/api/cart',cartsRouter);

app.use('/', viewProductsRouter);


