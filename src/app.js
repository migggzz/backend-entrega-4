const express = require('express');
const fs = require('fs');
const handlebars = require('express-handlebars');
const {Server} = require('socket.io');
const PORT = 8080;  
const productsRouter = require('./router/products.router');
const cartsRouter = require('./router/cart.router');
const viewProductsRouter = require('./router/views.router');
const realTimeRouter = require('./router/realTime.router');
const productsFile1 = "products.json";

const productsFile = require ('../products.json');
const cartsFile = "carts.json";
const writeFile = require('./controllers/writeFile');
const app = express();

let products = productsFile || [];

// app.listen(8080),() => {
//     console.log('Server is running on port 8080')
// }

const httpServer = app.listen(PORT, () => console.log('Server started'));
console.log(productsFile);
const io = new Server(httpServer);

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/view');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter);

app.use('/api/cart',cartsRouter);

app.use('/', viewProductsRouter);

app.use('/realtimeproducts', realTimeRouter);


io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('addProduct', (product) => {
    console.log(product)
    console.log(`Adding product ${product.title} with price ${product.price}`);
    products.push({...product, id: products.length + 1});
    console.log(products);

      fs.writeFile(productsFile1, JSON.stringify(products), err => {
        if (err) {
        alert({ message: "Error saving product" });
        } else {
        alert(product);
        }
    });
    
    io.emit('productAdded', products);
    });
  
    socket.on('disconnect', () => {
    console.log('A user disconnected');
    });
  });
