const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  
  Product.findAll().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
  .getCart()
  .then(cart => {
    return cart.getProducts()
  }).then(products => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  }).catch(console.error);
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart().then(cart => {
      fetchedCart = cart;
      return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
      let product;
      if(products.length) {
        product = products[0];
      }
      console.log(product);

      if(product) {
         const oldQuantity = product.cartItem.quantity;
         newQuantity = oldQuantity + 1;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      console.log(newQuantity);
      return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(console.error);
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart => {
    return cart.getProducts({where: {id: prodId}})
  })
  .then(([product]) => {
    return product.cartItem.destroy();
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(console.error)
};

exports.postOrder = (req, res, next) => {
  let fetchedProducts;
  let fetchedCart;
  req.user.getCart().then(cart => {
    fetchedCart = cart;
    return cart.getProducts();
  }).then(products => {
    fetchedProducts = products;
    return req.user.createOrder();
  })
  .then(order => {
    return order.addProducts(fetchedProducts.map(product => {
      product.orderItem = {quantity: product.cartItem.quantity};
      return product;
    }))
  })
  .then(result => {
    return fetchedCart.setProducts(null);
  }).then(result => {
    res.redirect('/orders');
  })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']}).then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      orders,
      pageTitle: 'Your Orders'
    });
  })
  
};