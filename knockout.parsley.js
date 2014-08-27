/// Knockout Parsley plugin
/// (c) 2014 Imre Fazekas
/// License: MIT (http://www.opensource.org/licenses/mit-license.php)
(function (factory) {
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		factory(require("knockout"), require("jquery"), require("parsleyjs"), exports);
	} else if (typeof define === "function" && define.amd) {
		define(["knockout", "jquery", "parsleyjs", "exports"], factory);
	} else {
		factory(ko, jQuery, {}, ko.parsley = {});
	}
}(
	function (ko, $, parsley, exports) {
		var forms = [];

		if (typeof (ko) === undefined) {
			throw 'KnockoutJS not found!';
		}
		if (typeof ($().parsley) === undefined) {
			throw 'Parsley not found!';
		}

		var toString = Object.prototype.toString;
		var isArray = Array.isArray || function(obj) {
			return toString.call(obj) === '[object Array]';
		};
		var isFunction = function (obj) {
			return toString.call(obj) === "[object " + Function + "]";
		};
		var nativeForEach = Array.prototype.forEach;
		var breaker = {};
		var each = function(obj, iterator, context) {
			if (obj === null) return;
			if (nativeForEach && obj.forEach === nativeForEach) {
				obj.forEach(iterator, context);
			} else if ( isArray(obj) ) {
				for (var i = 0, l = obj.length; i < l; i+=1) {
					if (iterator.call(context, obj[i], i, obj) === breaker) return;
				}
			} else {
				for (var key in obj) {
					if (iterator.call(context, obj[key], key, obj) === breaker) return;
				}
			}
		};

		function addParsleyDataSttributes(jElement, accessor, bindingContext){
			each( accessor.rules(), function(rule, key, list) {
				var parsleyAttrName = "data-parsley-" + rule.rule;
				var attr = jElement.prop(parsleyAttrName);
				if ( (typeof attr === 'undefined' || attr === false) && !isFunction(rule.params) ) {
					jElement.prop( parsleyAttrName, rule.params );
					jElement.attr( parsleyAttrName, rule.params );
				}
			} );
		}

		function generateValidBindingHandler( name ){
			var validName = 'valid_' + name;
			ko.bindingHandlers[ validName ] = {
				init: function(element, valueAccessor, bindingContext) {
					if( ko.bindingHandlers[name].init )
						ko.bindingHandlers[name].init.apply( ko.bindingHandlers[name], arguments );
					var accessor = valueAccessor();
					var jElement = $(element);
					if(accessor.rules)
						addParsleyDataSttributes( jElement, accessor, bindingContext );
					jElement.change(function() {
						jElement.parsley().validate();
					});
				},
				update: function(element, valueAccessor, allBindings) {
					if( ko.bindingHandlers[name].update )
						ko.bindingHandlers[name].update.apply( ko.bindingHandlers[name], arguments );
				}
			};
		}
		each( [ 'textInput', 'value', 'checked' ], function(name){
			generateValidBindingHandler( name );
		});

		ko.extenders.validatable = function (observable, enable) {
			if(enable && !observable.rules) {
				observable.rules = ko.observableArray();
			}
		};
		function addRule(observable, rule) {
			observable.extend({validatable: true});
			observable.rules.push(rule);
		}
		function addExtender(ruleName) {
			if(!ko.extenders[ruleName]) {
				ko.extenders[ruleName] = function(target, options) {
					if(options.condition || options.message) {
						addRule(target, {rule: ruleName, params: options.params, condition: options.condition, message: options.message});
					} else {
						addRule(target, {rule: ruleName, params: options});
					}

					return target;
				};
			}
		}

		each( ['required', 'minlength', 'maxlength', 'length', 'min', 'max', 'element', 'range',  'pattern', 'equalto', 'mincheck', 'maxcheck', 'check', 'type'], function(value, key, list) {
			addExtender(value);
		});

		var API = (function(){
			return {
				init: function( _forms ) {
					if( isArray(_forms) )
						each( _forms, function(form, index, list){
							forms.push( form );
							$( form ).parsley();
						});
				}
			};
		}());

		ko.utils.extend(exports, API);
	}
));
