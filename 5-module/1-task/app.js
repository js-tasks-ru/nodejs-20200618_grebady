const path = require('path');
const Koa = require('koa');
const app = new Koa();
const ErrorConnectionReset = require('./ErrorConnectReset.js');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('@koa/router');
const router = new Router();
let clients = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = await new Promise((resolve, reject) => {
    clients.push(resolve);
    ctx.res.on('close', ()=>{
      const indexToDelete = clients.indexOf(resolve);
      clients.splice(indexToDelete, 1); // delete a disconnected user
      const error = new ErrorConnectionReset('Connection closed');
      reject(error);
    });
  });

  let message;
  try {
    message = await promise;
  } catch (err) {
    if (err.code === 'ECONNRESET') {
      console.log(err.code);
      return;
    }
    throw err;
  }
  ctx.response.body = message;
});

router.post('/publish', async (ctx, next) => {
  const lastMessage = ctx.request.body.message;

  if (!lastMessage) {
    ctx.throw(400);
  }

  clients.forEach((resolve) => resolve(String(lastMessage)));
  clients = [];
  ctx.status = 200;
});

app.use(router.routes());

module.exports = app;
