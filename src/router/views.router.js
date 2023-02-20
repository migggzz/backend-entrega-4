const express = require('express');
const productsFile = require('../../products.json');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home',{productsFile});
});
module.exports = router;