ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _) {

	Entities.Contact = Backbone.Model.extend({
		urlRoot : "http://127.0.0.1:8080/contacts/",
		defaults : {
			firstName : "",
			lastName : "",
			phoneNumber : ""
		},

		idAttribute : "_id",

		validate : function(attrs, options) {
			var errors = {};
			if (!attrs.firstName) {
				errors.firstName = "Can't be blank";
			} else if (attrs.firstName.length < 2) {
				errors.firstName = " is too short";
			}
			if (!attrs.lastName) {
				errors.lastName = "Can't be blank";
			} else {
				if (attrs.lastName.length < 2) {
					errors.lastName = " is too short";
				}
			}
			if (! _.isEmpty(errors)) {
				return errors;
			}
		}
	});

	Entities.ContactCollection = Backbone.Collection.extend({

		url : "http://127.0.0.1:8080/contacts/",
		model : Entities.Contact,
		comparator : "lastName"
	});

	var API = {

		getContactEntities : function() {

			var contacts = new Entities.ContactCollection();
			var defer = $.Deferred();
			contacts.fetch({
				success : function(data) {
					defer.resolve(data);
				}
			});

			return defer.promise();
		},

		getContactEntity : function(contactId, options) {
			
			var contact = new Entities.Contact({
				_id : contactId
			});
			
			var defer = $.Deferred();
			
			options || ( options = {});
			defer.then(options.success, options.error);
			
			var response = contact.fetch(_.omit(options, 'success', 'error'));
			
			response.done(function() {
				defer.resolveWith(response, [contact]);
			});
			
			response.fail(function() {
				defer.rejectWith(response, arguments);
			});
			
			return defer.promise();
		}
	};

	ContactManager.reqres.setHandler("contact:entities", function() {
		return API.getContactEntities();
	});

	ContactManager.reqres.setHandler("contact:entity", function(id, options) {
		return API.getContactEntity(id, options);
	});
});
