const {Router} = require('express');
const fs = require('fs');
// const uuid = require("uuid/v4");
const productsFile = require('../../products.json');
const productsFile1 = "products.json";
let products = [];

// products.push({name:"asdasd",price:123,description:"asdasd",id:1})


const router = Router();

if(productsFile) products = productsFile;

function generateId() {
  let counter = products.length;
  if (counter ==0) {
      return 1;
  } else {
      return (products[counter-1].id)+1;
  }
}


router.get('/', (req, res) => {
    // to do get all users or a limit of users
  const limit = parseInt(req.query.limit) || products.length;
  res.status(200).json(products.slice(0, limit));
})

router.get("/:pid", (req, res) => {
  const product = products.find(p => p.id == req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

router.post("/", (req, res) => {

const{title,description,code,price,status,stock,category,thumbnails} = req.body;


if(!title || !description || !code || !price || !status || !stock || !category){res.status(404).send("faltan parametros")}
console.log(req.params)
console.log(req.body)
if (products.find(p => p.code === code)) {
  console.log("El producto ya existe, no se puede agregar");
  res.status(404).send("El producto ya existe, no se puede agregar" );
}
  const product = {
    id: generateId(),
    title: title,
    description: description,
    code: code,
    price: price,
    status: req.params.status || true,
    stock: stock,
    category: category,
    thumbnails: thumbnails || []
  };

  products.push(product);
  console.log(products)

  fs.writeFile(productsFile1, JSON.stringify(products), err => {
    if (err) {
      res.status(500).json({ message: "Error saving product" });
    } else {
      res.status(201).json(product);
    }
  });
});

router.put("/:pid", (req, res) => {
  console.log(req.params.pid)
  // const product1 = products.find(p => p.id == req.params.pid);
  // if(product1 == -1) res.status(404).send("El producto no existe");
  
  // const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  // if (title) products[product1].title = title;
  // if (description) products[product1].description = description;
  // if (code) products[product1].code = code;
  // if (price) products[product1].price = price;
  // if (status) products[product1].status = status;
  // if (stock) products[product1].stock = stock;
  // if (category) products[product1].category = category;
  // if (thumbnails) products[product1].thumbnails = thumbnails;

  const productIndex = products.findIndex(p => p.id == req.params.pid);

  if (productIndex == -1) {
    res.status(404).json({ message: "Product not found" });
  } else {


    // products[productIndex] = {
    //   ...products[productIndex],
    //   if (title) {title: req.body.title},
    //   if (description) {description: req.body.description},
    //   if (code) {code: req.body.code},
    //   if (price) {price: req.body.price},
    //   if (status){status: req.body.status},
    //   if(stock ){stock: req.body.stock},
    //   if(category){category: req.body.category},
    //   if(thumbnails){thumbnails: req.body.thumbnails},
    // }
    products[productIndex] = {
      ...products[productIndex],
      title: req.body.title || products[productIndex].title,
      description: req.body.description || products[productIndex].description,
      code: req.body.code || products[productIndex].code,
      price: req.body.price || products[productIndex].price,
      status: req.body.status || products[productIndex].status,
     stock: req.body.stock || products[productIndex].stock,
      category: req.body.category || products[productIndex].category,
     thumbnails: req.body.thumbnails || products[productIndex].thumbnails,
    }

    res.send({thing:"the following has been modified",...products});
  
  
  };

  fs.writeFile(productsFile1, JSON.stringify(products), err => {
    if (err) {
      res.status(500).json({ message: "Error saving product" });
    } else {
      // res.status(201).json(products);
      return
    }
  });
    
  })

  router.delete("/:pid", (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.pid);
    if (productIndex == -1) {
      res.status(404).json({ message: "Product not found" });
    } else {
      products.splice(productIndex, 1);
      
      return res.status(204).json({products})
        }
      });


module.exports = router;