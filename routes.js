/* Routes */

Router.route('/', {
  template: 'kiosk'
});

Router.route('/demo', {
  template: 'demo'
});

Router.route('/customer', {
  template: 'customerForm'
});

Router.route('/list', {
  template: 'customerList'
});

Router.route('/policy', {
  template: 'policiesNew'
});

Router.route('/build', {
  template: 'build'
});

Router.route('/tablet', {
  template: 'policiesTablet'
});