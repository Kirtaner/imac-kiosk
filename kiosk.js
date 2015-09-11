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
    Session.setDefault('currentFactoid', rollDice());
    Session.setDefault('currentAnimation', 'anim1');
  };

  var rollDice = function() {
    fact = Math.floor((Math.random() * 14) + 1);
    // fact = Math.floor((Math.random() * 3) + 1);
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

    animation = 'anim'+Math.floor((Math.random() * 5) + 1);

    while(Session.get('currentAnimation') === animation) {
      animation = 'anim'+Math.floor((Math.random() * 5) + 1);
    }

    Session.set('currentFactoid', factName);
    Session.set('currentAnimation', animation);
    // Meteor.setTimeout(function(){
    //   Session.set('currentAnimation', animation);
    // },4000);
  }

  var randomTitleAnim = function() {
    animations = Array('bounce','tada','rubberBand','swing','jello','wobble','flip');
    titleAnimation = animations[Math.floor(Math.random()*animations.length)];
    Session.set('dykAnimation', 'animated '+titleAnimation);
  }

  var randomFactInterval = Meteor.setInterval(randomFact, 12000);
  var randomTitleAnimInterval = Meteor.setInterval(randomTitleAnim, 12000);
  // var randomAnimationInterval = Meteor.setInterval(randomAnimation, 1000);

  Template.registerHelper('currentFactoid', function(){
    return Session.get('currentFactoid');
  });

  Template.registerHelper('currentAnimation', function(){
    return Session.get('currentAnimation');
  });

  Template.registerHelper('dykAnimation', function(){
    return Session.get('dykAnimation');
  });

  Template.factoid.helpers({

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
