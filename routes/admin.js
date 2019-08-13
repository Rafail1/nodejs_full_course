const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
router.get('/add-product', (req, res, next) => {
    console.log("Miidle 2");
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/product', (req, res) => {
    console.log(req.body.title);
    res.redirect('/');
})

module.exports = router;
