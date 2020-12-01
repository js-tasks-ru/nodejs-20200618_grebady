const Product = require('../models/Product.js');
const ObjectID = require('mongodb').ObjectID;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.request.query.subcategory;
  if (!subcategory) return next();
  const [products] = await Product.find({subcategory: `${subcategory}`});
  if (!products) {
    ctx.body = {products: []};
    return;
  }
  ctx.body = {products: [products]};
};

module.exports.productList = async function productList(ctx, next) {
  const [products] = await Product.find({});
  ctx.body = {products: [products]};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.request.path.split('/')[3];
  if (!ObjectID.isValid(id)) ctx.throw(400);
  const [product] = await Product.find({_id: `${id}`});
  if (!product) ctx.throw(404);
  ctx.body = {product: product};
};

