const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const productSchema =  mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: Array,

})

// mongoose.set("strictQuery", false);
productSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel;

