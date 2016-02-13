/* Customer data schema */

var Schemas = {};
var Collections = {};

Meteor.isClient && Template.registerHelper("Schemas", Schemas);
Meteor.isClient && Template.registerHelper("Collections", Collections);

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

Schemas.CustomerWarranty = new SimpleSchema({
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
  address: {
    type: String,
  },
  city: {
    type: String,
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

CustomersWarranty = Collections.CustomersWarranty = new Mongo.Collection('CustomersWarranty');
CustomersWarranty.attachSchema(Schemas.CustomerWarranty);

CustomersWarranty.allow({
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

  Template.registerHelper('policyPageContent', function(){
    return Session.get('policyPageContent');
  });

  showSuccessModal = function(){
    id = Session.get('lastId');
    form = Session.get('currentForm');

    if (form == 'autoFormWarranty') {
      CustomersWarranty.update(id, {$set: {confirmed: true}}, {validate: false});
    } else {
      Customers.update(id, {$set: {confirmed: true}}, {validate: false});
    }

    Modal.hide('confirmationModal');

    setTimeout(function(){
      Modal.show('successModal');
      setTimeout(function(){
        Modal.hide('successModal');
        setTimeout(function(){
          $('.modal, .modal-backdrop').fadeOut().remove();
        }, 500);
      }, 2000);
    }, 500);
  }

  Template.customerList.helpers({
    customers: function () {
      return Customers.find({confirmed:true});
    },
    customersWarranty: function () {
      return CustomersWarranty.find({confirmed:true});
    }
  });

  Customers.find().observeChanges({
    added: function(id, fields) {
      notifyNewCustomer();
    }
  });

  CustomersWarranty.find().observeChanges({
    added: function(id, fields) {
      notifyNewCustomer();
    }
  });

  /* KIOSK DEMO MODE */

  var idleModal;

  Template.kiosk.events({
    'mousemove': function(){
      Modal.show('modeSelectionModal');
    },
    'keypress': function(){
      Modal.show('modeSelectionModal');
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
    idleModal = setTimeout(function(){ Modal.hide(); }, 30000);
  }

  Meteor.Spinner.options = {
      lines: 13, // The number of lines to draw
      length: 10, // The length of each line
      width: 5, // The line thickness
      radius: 15, // The radius of the inner circle
      corners: 0.7, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#fff', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: true, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '400px', // Top position relative to parent in px
      left: '600px', // Left position relative to parent in px
  };

};

