const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Session = require('../models/Session');
const Product = require('../models/Product');

module.exports.checkout = async (ctx, next) => {
  const {product, phone, address} = ctx.request.body;

  const header = ctx.request.get('Authorization');
  if (!header) return next();

  const token = header.split(' ')[1];
  if (!token) return next();

  const session = await Session.findOne({token}).populate('user');
  const {user} = session;
  const order = await new Order({user, product, phone, address});
  await order.save();
  const objJSONProduct = await Product.findOne({_id: product});
  await sendMail({
    template: 'order-confirmation',
    locals: {product: objJSONProduct},
    to: `${user.email}`,
    subject: 'Заказ оформлен',
  });
  ctx.body = {order: order._id};
  return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const header = ctx.request.get('Authorization');
  if (!header) return next();

  const token = header.split(' ')[1];
  if (!token) return next();

  const session = await Session.findOne({token});
  if (!session) {
    ctx.throw(401, 'Неверный аутентификационный токен');
  }
  const {user} = session;

  const orders = await Order.find({user});
  ctx.body = {orders};
  return next();
};
