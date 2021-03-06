ContactManager.module("ContactsApp.List", function(List, ContactManager, Backbone, Marionette, $, _) {

	List.Controller = {

		listContacts : function(criterion) {

			var loadingView = new ContactManager.Common.Views.Loading();

			ContactManager.regions.main.show(loadingView);

			var fetchingContacts = ContactManager.request("contact:entities");

			var contactsListLayout = new List.Layout();
			var contactsListPanel = new List.Panel();

			$.when(fetchingContacts).done(function(contacts) {

				var filteredContacts = ContactManager.Entities.FilteredCollection({
					collection : contacts,
					filterFunction : function(filterCriterion) {
						var criterion = filterCriterion.toLowerCase();
						return function(contact) {
							if (contact.get("firstName").toLowerCase().indexOf(criterion) !== -1 
							|| contact.get("lastName").toLowerCase().indexOf(criterion) !== -1 
							|| contact.get("phoneNumber").toLowerCase().indexOf(criterion) !== -1) {
								return contact;
							}
						};
					}
				});
				if (criterion) {
					filteredContacts.filter(criterion);
					contactsListPanel.once("show", function() {
						contactsListPanel.triggerMethod("set:filter:criterion", criterion);
					});
				}
				var contactsListView = new List.Contacts({
					collection : filteredContacts
				});

				contactsListPanel.on("contacts:filter", function(filterCriterion) {
					filteredContacts.filter(filterCriterion);
				});

				contactsListLayout.on("show", function() {
					contactsListLayout.panelRegion.show(contactsListPanel);
					contactsListLayout.contactsRegion.show(contactsListView);
				});

				contactsListPanel.on("contacts:filter", function(filterCriterion) {
					filteredContacts.filter(filterCriterion);
					ContactManager.trigger("contacts:filter", filterCriterion);
				});

				contactsListPanel.on("contact:new", function() {
					var newContact = new ContactManager.Entities.Contact();

					var view = new ContactManager.ContactsApp.New.Contact({
						model : newContact
					});

					view.on("form:submit", function(data) {
						var contactSaved = newContact.save(data, {
							success : function() {
								contacts.add(newContact);
								view.trigger("dialog:close");
								var newContactView = contactsListView.children.findByModel(newContact);
								// check whether the new contact view is displayed (it could be
								// invisible due to the current filter criterion)
								if (newContactView) {
									newContactView.flash("success");
								}
							}
						});
						if (!contactSaved) {
							view.triggerMethod("form:data:invalid", newContact.validationError);
						}
					});
					
					ContactManager.regions.dialog.show(view);

				});

				contactsListView.on("childview:contact:show", function(childView, args) {
					ContactManager.trigger("contact:show", childView.model.id);
				});

				contactsListView.on("childview:contact:edit", function(childView, args) {
					var view = new ContactManager.ContactsApp.Edit.Contact({
						model : childView.model
					});

					view.on("form:submit", function(data) {

						if (childView.model.save(data)) {
							view.trigger("dialog:close");
							childView.render();
							childView.flash("success");

						} else {

							view.triggerMethod("form:data:invalid", args.model.validationError);

						}
					});

					ContactManager.regions.dialog.show(view);
				});

				contactsListView.on("childview:contact:delete", function(childView, args) {
					args.model.destroy();
				});

				ContactManager.regions.main.show(contactsListLayout);
			});
		}
	};

});
