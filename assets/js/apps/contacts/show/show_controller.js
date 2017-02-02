ContactManager.module("ContactsApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _) {

	Show.Controller = {

		showContact : function(id) {

			console.log("Fetch is about to occur on contact id#" + id);

			var fetchingContact = ContactManager.request("contact:entity", id, {
				error : function(xhr, responseText, error) {
					console.log("Some error happened (processed in error callback)");
				}
			});
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

			}).fail(function(response) {
				console.log("Some error happened (processed in deferred's fail callback)");
				if (response.status === 404) {
					var contactView = new Show.MissingContact();
					ContactManager.regions.main.show(contactView);
				} else {
					alert("An unprocessed error happened. Please try again!");
				}
			});
		}
	};
});
