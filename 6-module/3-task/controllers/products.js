const Product = require('../models/Product.js');


module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  const products = await Product.find({$text: {$search: `${query}`}});
  ctx.body = {products: products};
};
