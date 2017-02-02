ContactManager.module("ContactsApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _) {

	Show.Controller = {
		
		showContact : function(id) {
			
			console.log("Fetch is about to occur on contact id#" + id);
			
			var fetchingContact = ContactManager.request("contact:entity", id);
			
			var loadingView = new ContactManager.Common.Views.Loading();

			ContactManager.regions.main.show(loadingView);
			
			$.when(fetchingContact).done(function(contact) {
				var contactView;
				console.log(contact);
				if (contact !== undefined) {
					
					contactView = new Show.Contact({						
						model : contact
					});
					
					contactView.on("contact:edit", function(contact) {
						
						ContactManager.trigger("contact:edit", contact.id);
					});
				} else {
					
					contactView = new Show.MissingContact();
				}

				ContactManager.regions.main.show(contactView);
			});
		}
	};
});
