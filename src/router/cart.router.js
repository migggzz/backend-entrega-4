const {Router} = require('express');
const fs = require('fs');
const cartsFile = require ('../../cart.json');
const cartPath = 'cart.json';
const productsFile = require('../../products.json');
const cartModel = require('../models/cart.model');
const generateId = require('../controllers/generateId');
let cartss = [];

let products = productsFile || [];

const router = Router();

if(cartsFile) carts = cartsFile;


// router.get('/', (req, res) => {
//     // to do get all users
//     res.json({carts})
// })

// router.post("/",  (req, res) => {
//     const newCart = {
//       id: generateID(),
//       products: []
//     };
//     carts.push(newCart);
//     console.log(carts);
//     fs.writeFile(cartPath, JSON.stringify(carts), err => {
//         if (err) {
//           res.status(500).json({ message: "Error saving product" });
//         } else {
//             res.status(201).json({ message: "Cart created successfully", cart: newCart });
//         }
//       });
    
//   });

//   router.get("/:cid", async (req, res) => {
//     const cid = req.params.cid;
//     console.log(cid);
//     const cart = carts.find(cart => cart.id == cid);
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }
//     res.json({ products: cart.products });
//   });

//   router.post("/:cid/product/:pid", async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const cart = carts.find(cart => cart.id == cid);
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }
//     const product = products.find(product => product.id == pid);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     const existingProduct = cart.products.find(
//       cartProduct => cartProduct.product == pid
//     );
//     if (existingProduct) {
//       existingProduct.quantity++;
//     } else {
//       cart.products.push({ product: pid, quantity: 1 });
//     }
//     fs.writeFileSync(cartPath, JSON.stringify(carts));
//     res.json({ message: "Product added to cart successfully", cart });
//   });

router.get("/", async (req, res) => {
  const carts = await cartModel.find().lean().exec()
  res.json({ carts })
})

router.get("/:id", async (req, res) => {
  const id = req.params.id
  const cart = await cartModel.findOne({_id: id})
  res.json({ cart })
})

router.post("/", async (req, res) => {
  const newCart = await cartModel.create({})

  res.json({status: "Success", newCart})
})

router.delete("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid
  const productID = req.params.pid

  const cart = await cartModel.findById(cartID)
  if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

  const productIDX = cart.products.findIndex(p => p.id == productID)
  
  if (productIDX <= 0) return res.status(404).json({status: "error", error: "Product Not Found on Cart"})

  cart.products = cart.products.splice(productIDX, 1)
  await cart.save()
  
  res.json({status: "Success", cart})
})

router.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const result = await CartModel.updateOne({ _id: cid }, { $unset: { products: "" } });
    if (result.nModified > 0) {
      res.json({ message: "All products removed from the cart" });
    } else {
      res.json({ message: "Cart not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid
  const productID = req.params.pid
  const quantity= req.body.quantity || 1
  const cart = await cartModel.findById(cartID)

  let found = false
  for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i].id == productID) {
          cart.products[i].quantity++
          found = true
          break
      }
  }
  if (found == false) {
      cart.products.push({ id: productID, quantity})
  }

  await cart.save()


  res.json({status: "Success", cart})
})

module.exports = router;