const {Router} = require('express');
const fs = require('fs');
const cartsFile = require ('../../cart.json');
const cartPath = 'cart.json';
const productsFile = require('../../products.json');
let carts = [];

let products = productsFile || [];

const router = Router();

if(cartsFile) carts = cartsFile;

function generateID() {
    let counter = carts.length;
    if (counter ==0) {
        return 1;
    } else {
        return (carts[counter-1].id)+1;
    }
  }

router.get('/', (req, res) => {
    // to do get all users
    res.json({carts})
})

router.post("/",  (req, res) => {
    const newCart = {
      id: generateID(),
      products: []
    };
    carts.push(newCart);
    console.log(carts);
    fs.writeFile(cartPath, JSON.stringify(carts), err => {
        if (err) {
          res.status(500).json({ message: "Error saving product" });
        } else {
            res.status(201).json({ message: "Cart created successfully", cart: newCart });
        }
      });
    
  });

  router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    console.log(cid);
    const cart = carts.find(cart => cart.id == cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json({ products: cart.products });
  });

  router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = carts.find(cart => cart.id == cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const product = products.find(product => product.id == pid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingProduct = cart.products.find(
      cartProduct => cartProduct.product == pid
    );
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    fs.writeFileSync(cartPath, JSON.stringify(carts));
    res.json({ message: "Product added to cart successfully", cart });
  });

module.exports = router;