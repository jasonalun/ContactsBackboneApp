ContactManager.module("AboutApp", function(AboutApp, ContactManager, Backbone, Marionette, $, _) {
	
	AboutApp.Router = Marionette.AppRouter.extend({
		appRoutes : {
			"about" : "showAbout"
		}
	});

	var API = {
		
		showAbout : function() {
			ContactManager.execute("set:active:header", "about");
			AboutApp.Show.Controller.showAbout();
		}
	};

	ContactManager.on("about:show", function() {
		ContactManager.navigate("about");
		API.showAbout();
	});

	AboutApp.on("start", function() {
		new AboutApp.Router({
			controller : API
		});
	});
}); 