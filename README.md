#knockout.parsley.js

[Knockout.parsley.js](https://github.com/imrefazekas/knockout.parsley.js) is a very simple plugin for knockout allowing you to validate view model throgh [parsley](http://parsleyjs.org) library.

It creates all bindings and data attributes you need __automatically__, no need to learn any DOM api or to make handwork on form elements. All you have to care about is to provide the validation rules to be applied. ;)

License: [MIT](http://www.opensource.org/licenses/mit-license.php)

# Usage

To keep it simple, no special environment or tool is used just old html and plain JS. I leave the structured company development culture to you... :)

Let's have a simple form as below:

	<html>
	<head>
		<style type="text/css">
		// put here your parsley CSS styles
		</style>
		</head>
	<body>
		<div id="form-panel">
			<p>First name: <input data-bind="validValue: firstName" /></p>
			<p>Last name: <input data-bind="validValue: lastName" /></p>
		</div>

Let's add the JS dependencies: [parsley](http://parsleyjs.org), [knockout](http://knockoutjs.com), [jquery](http://jquery.com), [knockout.mapper.js](https://github.com/imrefazekas/knockout.mapper.js)

		<script src="../node_modules/jquery/dist/jquery.min.js"></script>
		<script src="../node_modules/parsleyjs/dist/parsley.min.js"></script>
		<script src="../node_modules/knockout/build/output/knockout-latest.js"></script>
		<script src="../node_modules/knockout.mapper.js/knockout.mapper.js"></script>
		<script src="../knockout.parsley.js"></script>

Let's define our model with validation rules:

		<script type="text/javascript">
		var obj = { statics: { }, methods: { } };
		obj.dataModel = {
			firstName: "Planet",
			lastName: "Earth"
		};
		obj.validation = {
			firstName: { required: true, type: "alphanum", minlength: "6" },
			lastName: { notblank: true, type: "alphanum", minlength: "6" }
		};

Let's create our knockout mappings:

		var viewModel = {};
		ko.mapObject( viewModel, obj.dataModel, obj.validation, obj.methods, obj.statics );
		ko.applyBindings( viewModel );

Let's initiate the [Knockout.parsley.js](https://github.com/imrefazekas/knockout.parsley.js) :

		ko.parsley.init( [ '#form-panel' ] );
		</script>
	</body>
	</html>

And you are done.
