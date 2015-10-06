/* Customer data schema */

Schemas = {};

Meteor.isClient && Template.registerHelper("Schemas", Schemas);

Schemas.Customer = new SimpleSchema({
  firstName: {
    type: String,
    index: false
  },
  lastName: {
    type: String,
  },
  emailAddress: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  companyName: {
    type: String,
    optional: true
  },
  postalCode: {
    type: String,
  },
  mobileNumber: {
    type: Number
  },
  phoneNumber: {
    type: Number,
    optional: true
  },
  howDidYouFindUs: {
    type: String,
    // optional: true
  },
  confirmed: {
    type: Boolean,
    optional: true
  }

});

var Collections = {};

Meteor.isClient && Template.registerHelper("Collections", Collections);

Customers = Collections.Customers = new Mongo.Collection('Customers');

Customers.attachSchema(Schemas.Customer);


Customers.allow({
  insert: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});


/* Customer data kiosk form */


if (Meteor.isClient) {

  Modal.allowMultiple = true;

  var hooksObject = {
    onSuccess: function(formType, result) {
      // Initial submission
      if (formType == 'insert') {
        id = this.docId;
        fields = this.insertDoc;

        console.log(id);
        console.log(fields);

        Session.set('lastId', id);
        Session.set('confirmInformation', fields);

        Modal.show('confirmationModal');
        // Modal.show('successModal');
        // successModal = setTimeout(function(){ Modal.hide('successModal'); }, 5000);
      }
    }
  };

  AutoForm.hooks({
    customerData: hooksObject
  });


  function notifyNewCustomer()
  {
    if (Notification.permission==="granted") {
      var notification = new Notification("New Customer Queued", {
        body: 'A customer has finished entering their personal details'
      });

      notification.onclick = function(e) {
        window.focus();
      }
    }
  }

  Template.registerHelper('confirmInformation', function(){
    return Session.get('confirmInformation');
  });

  Template.registerHelper('acquisitionOptions', function(){
    return {
      CSRH: "Web Search",
      CREF: "Someone Told You About Us",
      _CREF: "Walk-in"
    };
  });

  showSuccessModal = function(){
    id = Session.get('lastId');

    Customers.update(id, {$set: {confirmed: true}}, {validate: false});

    Modal.hide();

    setTimeout(function(){ Modal.show('successModal'); }, 500);
    setTimeout(function(){ Modal.hide('successModal'); }, 5000);
  }

  Template.customerList.helpers({
    customers: function () {
      // return Customers.find();
      return Customers.find({confirmed:true});
    }
  });

  Customers.find().observeChanges({
    added: function(id, fields) {
      notifyNewCustomer();
      // Modal.hide('customerFormModal');
    }
  });











  var idleModal;

  Template.dick.events({
    'mousemove': function(){
      Modal.show('customerFormModal');
    },
    'keypress': function(){
      Modal.show('customerFormModal');
    }
  });

  Template.customerFormModal.events({
    'mousemove': function(){
      modalTimeout();
    },
    'keypress': function(){
      modalTimeout();
    }
  });

  Template.customerFormModal.rendered = function(){
    modalTimeout();
  }

  function modalTimeout(){
    clearTimeout(idleModal);
    // Modal.show('customerFormModal');
    idleModal = setTimeout(function(){ Modal.hide('customerFormModal'); }, 5000);
  }

};









/* Factoid 'demo' */

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










