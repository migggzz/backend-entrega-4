const {Router} = require('express');
const fs = require('fs');
const ProductModel = require('../models/product.model');
const mongoose = require('mongoose');
// const uuid = require("uuid/v4");
const productsFile = require('../../products.json');
const productsFile1 = "products.json";
const generateId = require('../controllers/generateId');
let products = [];


const router = Router();

if(productsFile) products = productsFile;


router.get('/', async (req, res) => {
  let query = {};
  if (req.query.q) {
    const searchTerm = req.query.q;
    // const searchField = req.query.field;
    // if (searchTerm && searchField) {
    //   // si se dan los dos parametros, se busca por el campo
    //   query[searchField] = searchTerm;
    // }
    query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        // { price: { $regex: searchTerm, $options: 'i' } },
        // { stock: parseInt({ $regex: searchTerm, $options: 'i' } )},
        { code: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
        // { status: { $regex: searchTerm, $options: 'i' } },
      ]
    };
  }
  const options = {
    page: req.query.page || 1, 
    limit: req.query.limit || 10, 
    sort: req.query.sort || null,
    lean: true
  };

  const products1 = await ProductModel.paginate(query,options, function(err,result){
    if(err) json.status(500).json({message: "Error getting products"});
    res.json(result)
  })

  // res.json(products1)

})

router.get("/view", async (req, res) => {
  // const products1 = await ProductModel.find().lean().exec()
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if(!page) page =1;
  if(!limit) limit = 5;
  const products1 = await ProductModel.paginate({},{page,limit, lean: true});
  products1.prevLink = products1.hasPrevPage ? `/api/products/view?page=${products1.prevPage}&limit=${limit}` : '';
  products1.nextLink = products1.hasNextPage ? `/api/products/view?page=${products1.nextPage}&limit=${limit}` : '';
  if(products1)console.log('found products from the db')
  res.render('realTimeProducts2', 
    products1
  )
})


router.get("/:pid", async (req, res) => {
// Buscar pot id
  const id1 = req.params.pid;
thing = await ProductModel.findOne({ _id: id1 }).lean().exec();
// thing2 = JSON.stringify(thing);

if(thing){
  res.json(thing)}
else{
  res.json({ message: "Product not found" });
};
});

router.post("/", async (req, res) => {

const{title,description,code,price,status,stock,category,thumbnails} = req.body;

if(!title || !description || !code || !price || !status || !stock || !category){res.status(404).send("faltan parametros")}
console.log(req.params)
console.log(req.body)
if (products.find(p => p.code == code)) {
  console.log("El producto ya existe, no se puede agregar");
  res.status(404).send("El producto ya existe, no se puede agregar" );
}
else{
  const product1 = {
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

  try {
    // const product = req.body
    if (!product1.title) {
        return res.status(400).json({
            message: "Error Falta el nombre del producto"
        })
    }

  const productAdded = await ProductModel.create(product1)
        req.io.emit('updatedProducts', await ProductModel.find().lean().exec());
        // await ProductModel.find().lean().exec()
        res.json({
            status: "Success",
            productAdded
        })
    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }

  products.push(product1);
  console.log(products)

  fs.writeFile(productsFile1, JSON.stringify(products), err => {
    if (err) {
      res.status(500).json({ message: "Error saving product" });
    } else {
      res.status(201).json(product1);
    }
  });
}
  // const product = {
  //   id: generateId(),
  //   title: title,
  //   description: description,
  //   code: code,
  //   price: price,
  //   status: req.params.status || true,
  //   stock: stock,
  //   category: category,
  //   thumbnails: thumbnails || []
  // };

  // products.push(product);
  // console.log(products)

  // fs.writeFile(productsFile1, JSON.stringify(products), err => {
  //   if (err) {
  //     res.status(500).json({ message: "Error saving product" });
  //   } else {
  //     res.status(201).json(product);
  //   }
  // });
});

router.put("/:pid", async  (req, res) => {
  console.log(req.params.pid)
  // const product1 = products.find(p => p.id == req.params.pid);
  // if(product1 == -1) res.status(404).send("El producto no existe");
  
  // const { title, description, code, price, status, stock, category, thumbnails } = req.body;



  // const productIndex = products.findIndex(p => p.id == req.params.pid);

  // if (productIndex == -1) {
  //   res.status(404).json({ message: "Product not found" });
  // } else {


  //   products[productIndex] = {
  //     ...products[productIndex],
  //     title: req.body.title || products[productIndex].title,
  //     description: req.body.description || products[productIndex].description,
  //     code: req.body.code || products[productIndex].code,
  //     price: req.body.price || products[productIndex].price,
  //     status: req.body.status || products[productIndex].status,
  //    stock: req.body.stock || products[productIndex].stock,
  //     category: req.body.category || products[productIndex].category,
  //    thumbnails: req.body.thumbnails || products[productIndex].thumbnails,
  //   }

  //   res.send({thing:"the following has been modified",...products});
  
  
  // };

  const id = req.params.pid
  const productToUpdate = req.body

  const product = await ProductModel.updateOne({
      _id: id
  }, productToUpdate)
  // req.io.emit('updatedProducts', await ProductModel.find().lean().exec());
  await ProductModel.find().lean().exec();
  res.json({
      status: "Success",
      product
  })
  // fs.writeFile(productsFile1, JSON.stringify(products), err => {
  //   if (err) {
  //     res.status(500).json({ message: "Error saving product" });
  //   } else {
  //     // res.status(201).json(products);
  //     return
  //   }
  // });
    
  })

  router.delete("/:pid", async (req, res) => {
    // const productIndex = products.findIndex(p => p.id == req.params.pid);
    // if (productIndex == -1) {
    //   res.status(404).json({ message: "Product not found" });
    // } else {
    //   products.splice(productIndex, 1);
    //   return res.status(204).json({products})
    //     }

    const id = req.params.pid
    const productDeleted = await ProductModel.deleteOne({_id: id})

    // req.io.emit('updatedProducts', await ProductModel.find().lean().exec());
    await ProductModel.find().lean().exec()
    res.json({
        status: "Success",
        massage: "Product Deleted!",
        productDeleted
    })

      });


module.exports = router;