/*!
 * Javascript Cookie v1.5.0-pre
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory();
	} else {
		// Browser globals
		window.Cookies = factory();
	}
}(function () {
	var unallowedChars = {
		';': '%3B',
		',': '%2C',
		'"': '%22'
	};
	var unallowedCharsInName = extend(unallowedChars, {
		'=': '%3D',
		'\t': '%09'
	});
	var unallowedCharsInValue = extend(unallowedChars, {
		' ': '%20'
	});
	function encode(value, charmap) {
		for (var character in charmap) {
			value = value
				.replace(new RegExp(character, 'g'), charmap[character]);
		}
		return value;
	}

	function decode(value, charmap) {
		for (var character in charmap) {
			value = value
				.replace(new RegExp(charmap[character], 'g'), character);
		}
		return value;
	}

	function parseCookieValue(value) {
		if (value.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		return decode(value, unallowedCharsInValue);
	}

	function read(s, converter) {
		var value = parseCookieValue(s);
		return isFunction(converter) ? converter(value) : value;
	}

	function extend() {
		var key, options;
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			options = arguments[ i ];
			for (key in options) {
				result[key] = options[key];
			}
		}
		return result;
	}

	function isFunction(obj) {
		return Object.prototype.toString.call(obj) === '[object Function]';
	}

	var api = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !isFunction(value)) {
			options = extend(api.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key, unallowedCharsInName), '=', encode(String(value), unallowedCharsInValue),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()".
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift(), unallowedCharsInName),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	api.get = api.set = api;
	api.defaults = {};

	api.remove = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		api(key, '', extend(options, { expires: -1 }));
		return !api(key);
	};

	return api;
}));
