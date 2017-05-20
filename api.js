/**
 * Vicopo
 * @author https://github.com/kylekatarnls
 * https://vicopo.selfbuild.fr
 */
jQuery(function ($) {
	var _host = (location.protocol === 'http:' ? 'http:' : 'https:') + '//vicopo.selfbuild.fr';
	var _cache = {};
	var _sort = function (a, b) {
		return a.city - b.city;
	};
	var _filter = function () {
		return true;
	};
	$.extend({
		vicopoSort: function ($sort) {
			_sort = $sort;
		},
		vicopoFilter: function ($filter) {
			_filter = $filter;
		},
		vicopoPrepare: function ($cities) {
			$cities = $cities.filter(_filter);
			return $cities.sort(_sort);
		},
		vicopo: function (_input, _done) {
			_input = _input.trim();
			return this.getVicopo(/^\d+$/.test(_input) ? 'code' : 'city', _input, _done);
		},
		codePostal: function (_input, _done) {
			return this.getVicopo('code', _input, _done);
		},
		ville: function (_input, _done) {
			return this.getVicopo('city', _input, _done);
		},
		getVicopo: function (_name, _input, _done) {
			if(_input.length > 1) {
				_input = _input.trim();
				_cache[_name] = _cache[_name] || {};
				if(_cache[_name][_input]) {
					_done(_input, $.vicopoPrepare(_cache[_name][_input] || []), _name);
				} else {
					var _data = {};
					_data[_name] = _input;
					return $.getJSON(_host, _data, function (_answer) {
						_cache[_name][_input] = _answer.cities;
						_done(_answer.input, $.vicopoPrepare(_answer.cities || []), _name);
					});
				}
			} else {
				_done(_input, [], _name);
			}
		}
	});
	$.fn.extend({
		vicopoClean: function () {
			return $(this).each(function () {
				var _removeList = [];
				for(var $next = $(this).next(); $next.hasClass('vicopo-answer'); $next = $next.next()) {
					_removeList.push($next[0]);
				}
				$(_removeList).remove();
			});
		},
		vicopoTargets: function () {
			var _targets = [];
			$(this).each(function () {
				var $target = $(this);
				$('[data-vicopo]').each(function () {
					if($target.is($(this).data('vicopo'))) {
						_targets.push(this);
					}
				});
			});
			return $(_targets);
		},
		vicopoTarget: function () {
			return $(this).vicopoTargets().first();
		},
		getVicopo: function (_method, _done) {
			return $(this).keyup(function () {
				var $input = $(this);
				$[_method]($input.val(), function (_input, _cities, _name) {
					if(_input == $input.val()) {
						_done(_cities, _name, _input);
					}
				});
			});
		},
		vicopo: function (_done) {
			return $(this).getVicopo('vicopo', _done);
		},
		codePostal: function (_done) {
			return $(this).getVicopo('codePostal', _done);
		},
		ville: function (_done) {
			return $(this).getVicopo('ville', _done);
		}
	});
	var _fields = 'input, textarea, select';
	$(document).on('keyup change', _fields, function () {
		var $target = $(this);
		var _input = $target.val();
		if($target.data('vicopo-value') !== _input) {
			var _$targets = $target.data('vicopo-value', _input)
			.vicopoTargets().each(function () {
				$(this).hide().vicopoClean();
			});
			if(_$targets.length && _input.length) {
				$.vicopo(_input, function (_check, _cities) {
					if(_check === _input) {
						_$targets.each(function () {
							var $repeater = $(this).vicopoClean();
							var _$template = $repeater.clone();
							_$template.show().removeAttr('data-vicopo');
							var _$cities = [];
							$.each(_cities, function () {
								var $city = _$template.clone();
								$city.addClass('vicopo-answer');
								$city.find('[data-vicopo-code-postal]').text(this.code);
								$city.find('[data-vicopo-ville]').text(this.city);
								$city.find('[data-vicopo-val-code-postal]').val(this.code);
								$city.find('[data-vicopo-val-ville]').val(this.city);
								_$cities.push($city);
							});
							$repeater.after(_$cities);
						});
					}
				});
			}
		}
	});
	$(_fields).trigger('keyup');
});
