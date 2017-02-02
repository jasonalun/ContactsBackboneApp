ContactManager.module("ContactsApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _) {
	
	
	Show.MissingContact = Marionette.ItemView.extend({
		template: "#missing-contact-view"
	});

	Show.Contact = Marionette.ItemView.extend({
		template : "#contact-view",
		events: {
			"click js-list-contacts": "showList",
			"click a.js-edit": "editClicked"
		},
		
		showClicked: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.trigger("contact:list");
		},
		
		editClicked: function(e) {
			e.preventDefault();
			this.trigger("contact:edit", this.model);
		},
	});
	
	
}); 