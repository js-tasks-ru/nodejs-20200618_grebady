const Message = require('../models/Message');
const Session = require('../models/Session');

module.exports.messageList = async function messages(ctx, next) {
  const user = ctx.user.displayName;
  const messages = await Message.find({user}).limit(20);
  ctx.body = {messages: [...messages]};
};
