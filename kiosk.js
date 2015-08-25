/* Routes */

Router.route('/', {
  template: 'factoid'
});

// Router.route('/list', {
//   template: 'list'
// });



/* Customer data schema */

// Schemas = {};

// Template.registerHelper("Schemas", Schemas);


// Schemas.Customer = new SimpleSchema({
//   firstName: {
//     type: String,
//     index: 1,
//     unique: true
//   },
//   lastName: {
//     type: String,
//     optional: true
//   },
//   age: {
//     type: Number,
//     optional: true
//   }
// });

// var Collections = {};

// Template.registerHelper("Collections", Collections);

// Customers = Collections.Customers = new Mongo.Collection('Customers');

// Customers.attachSchema(Schemas.Customer);

// Meteor.publish(null, function () {
//   return Customer.find();
// });

// Customer.allow({
//   insert: function () {
//     return true;
//   },
//   remove: function () {
//     return true;
//   }
// });



if (Meteor.isClient) {
  // Initial factoid
  Template.factoid.created = function(){
    Session.setDefault('currentFactoid', 'fact1');
  };

  var rollDice = function() {
    fact = Math.floor((Math.random() * 14) + 1);
    factName = 'fact'+fact;
    return factName;
  }

  // Select a random factoid
  var randomFact = function() {
    factName = rollDice();

    // make sure it doesn't repeat the previous fact
    while(Session.get('currentFactoid') === factName) {
      factName = rollDice();
    }

    Session.set('currentFactoid', factName);
  }

  var interval = Meteor.setInterval(randomFact, 15000);

  Template.factoid.helpers({
    currentFactoid: function() {
      return Session.get('currentFactoid');
    }
  });

  Template.factoid.events({


    // 'click button': function () {
    //   // increment the counter when button is clicked
    //   Session.set('counter', Session.get('counter') + 1);
    // }
  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

