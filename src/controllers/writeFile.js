


 function writeFile(thing){

    const productFile = require ('../../products.json');

    let products = productFile || [];

    const productsFile1 = "products.json";
    
    console.log(productFile);

    const{title,description,code,price,status,stock,category,thumbnails} = thing;


    if(!title || !description || !code || !price || !status || !stock || !category){console.log("Faltan datos")}
    // console.log(req.params)
    // console.log(req.body)
    if (products.find(p => p.code == code)) {
    console.log("El producto ya existe, no se puede agregar");
    console.log("El producto ya existe, no se puede agregar" );
    }
    else{
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
        console.log({ message: "Error saving product" });
        } else {
        console.log(product);
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
    };

module.exports = writeFile;