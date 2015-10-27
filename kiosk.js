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

  Template.registerHelper('policyPane', function(){
    return Session.get('policyPane');
  });

  Template.registerHelper('policyPaneUrl', function(){
    return Session.get('policyPaneUrl');
  });

  showSuccessModal = function(){
    id = Session.get('lastId');

    Customers.update(id, {$set: {confirmed: true}}, {validate: false});

    Modal.hide('confirmationModal');

    setTimeout(function(){
      Modal.show('successModal');
      setTimeout(function(){
        Modal.hide('successModal');
        setTimeout(function(){
          $('.modal, .modal-backdrop').remove();
        }, 500);
      }, 2000);
    }, 500);
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


  /* KIOSK DEMO MODE */

  var idleModal;

  Template.kiosk.events({
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

  Template.modeSelectionModal.events({
    'mousemove': function(){
      modalTimeout();
    },
    'keypress': function(){
      modalTimeout();
    }
  });

  Template.policyModal.events({
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

  Template.modeSelectionModal.rendered = function(){
    modalTimeout();
  }

  Template.policyModal.rendered = function(){
    modalTimeout();
  }

  function modalTimeout(){
    clearTimeout(idleModal);
    idleModal = setTimeout(function(){ Modal.hide('customerFormModal'); }, 30000);
  }

};

