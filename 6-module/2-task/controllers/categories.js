const Category = require('../models/Category.js');

module.exports.categoryList = async function categoryList(ctx, next) {
  const [categorises] = await Category.find({});
  ctx.body = {categories: [categorises]};
};
