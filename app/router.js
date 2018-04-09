
module.exports = app => {
  // app.redirect('/', '/ssr', 302);
  app.get('/(editor|editor/.*|courseEntry)?', app.controller.spa.ssr);
  // app.get('/editor(/.+)?', app.controller.spa.editor);
  // app.get('/ssr(/.+)?', app.controller.spa.ssr);
  app.get('/redux(/.+)?', app.controller.spa.redux);
  app.get('/client(/.+)?', app.controller.spa.client);
};
