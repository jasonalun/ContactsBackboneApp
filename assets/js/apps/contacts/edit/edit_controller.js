ContactManager.module("ContactsApp.Edit", function(Edit, ContactManager, Backbone, Marionette, $, _) {
	Edit.Controller = {
		editContact : function(id) {
			
			var loadingView = new ContactManager.Common.Views.Loading({
				title : "Loading...",
				message : "Data loading is delayed to demonstrate using a loading view."
			});
			
			ContactManager.regions.main.show(loadingView);

			var fetchingContact = ContactManager.request("contact:entity", id);
			
			$.when(fetchingContact).done(function(contact) {
				
				var view;
				
				if (contact !== undefined) {
					
					view = new Edit.Contact({
						model : contact,
						generateTitle: true
					});
					
					view.on("form:submit", function(data) {
						
						if (contact.save(data)) {
							
							ContactManager.trigger("contact:show", contact.id);
							
						} else {
							
							view.triggerMethod("form:data:invalid", contact.validationError);
						}
					
					});
					
				} else {
					
					view = new ContactManager.ContactsApp.Show.MissingContact();
				}

				ContactManager.regions.main.show(view);
			});
		}
	};
}); 