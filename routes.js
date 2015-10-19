/* Routes */

Router.route('/', {
  template: 'kiosk'
});

Router.route('/test', {
  template: 'testcase'
});

Router.route('/customer', {
  template: 'customerForm'
});

Router.route('/list', {
  template: 'customerList'
});

Router.route('/build', {
  template: 'build'
});
