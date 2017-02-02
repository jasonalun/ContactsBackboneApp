ContactManager.module("ContactsApp", function(ContactsApp, ContactManager, Backbone, Marionette, $, _) {

	ContactsApp.Router = Marionette.AppRouter.extend({
		appRoutes : {
			"contacts(/filter/criterion::criterion)": "listContacts",
			"contacts" : "listContacts",
			"contacts/:id" : "showContact",
			"contacts/:id/edit" : "editContact"
		}
	});

	var API = {

		listContacts : function(criterion) {

			ContactManager.execute("set:active:header", "contacts");
			ContactsApp.List.Controller.listContacts(criterion);
		},

		showContact : function(id) {
			
			ContactManager.execute("set:active:header", "contacts");
			ContactsApp.Show.Controller.showContact(id);
		},

		editContact : function(id) {

			ContactManager.execute("set:active:header", "contacts");
			ContactsApp.Edit.Controller.editContact(id);
		}
	};

	ContactManager.on("contacts:list", function() {

		ContactManager.navigate("contacts");

		API.listContacts();
	});

	ContactManager.on("contact:show", function(id) {

		ContactManager.navigate("contacts/" + id);

		API.showContact(id);
	});

	ContactManager.on("contact:edit", function(id) {

		ContactManager.navigate("contacts/" + id + "/edit");
		API.editContact(id);
	});
	
	ContactManager.on("contacts:filter", function(criterion) {
		if (criterion) {
			
			ContactManager.navigate("contacts/filter/criterion:" + criterion);
			
		} else {
			
			ContactManager.navigate("contacts");
		}
	});
	
	ContactsApp.on("start", function() {

		new ContactsApp.Router({
			controller : API
		});
	});
});
