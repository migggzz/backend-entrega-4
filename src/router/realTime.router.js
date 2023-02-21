const express = require('express');
const productsFile = require('../../products.json');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('realTimeProducts',{productsFile});
});
module.exports = router;