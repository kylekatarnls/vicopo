/**
 * Vicopo
 * @author https://github.com/kylekatarnls
 * https://vicopo.selfbuild.fr
 */
jQuery(function ($) {
    var _host = 'https://vicopo.selfbuild.fr';
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

                    return;
                }

                var _data = {};
                _data[_name] = _input;
                return $.getJSON(_host, _data, function (_answer) {
                    _cache[_name][_input] = _answer.cities;
                    _done(_answer.input, $.vicopoPrepare(_answer.cities || []), _name);
                });
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
        vicopoFillField: function (_pattern, _city, _code) {
            return $(this).val(
                _pattern
                    .replace(/(city|ville)/ig, _city)
                    .replace(/(zipcode|code([\s_-]?postal)?)/ig, _code)
            ).vicopoTargets().vicopoClean();
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
    $(document).on('keyup change', _fields, function (_, context) {
        var $target = $(this);
        var _input = $target.val();
        if($target.data('vicopo-value') !== _input) {
            var _fill = $target.data('vicopo-get');
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
                            var _willShow = !context || !context.init || ['', true].indexOf(_$template.data('vicopo-hide-on-start')) === -1;
                            var _click = _$template.data('vicopo-click');
                            _$template.show().removeAttr('data-vicopo');
                            var _$cities = [];
                            $.each(_cities, function () {
                                var $city = _$template.clone();
                                var _code = this.code;
                                var _city = this.city;
                                $city.addClass('vicopo-answer');

                                const findInCity = function (selector) {
                                    return $city.find(selector).add($city.filter(selector));
                                };

                                findInCity('[data-vicopo-code-postal]').text(_code);
                                findInCity('[data-vicopo-ville]').text(_city);
                                findInCity('[data-vicopo-val-code-postal]').val(_code);
                                findInCity('[data-vicopo-val-ville]').val(_city);

                                if (_fill || _click) {
                                    $city.click(function () {
                                        if (_fill) {
                                            $target.vicopoFillField(_fill, _city, _code);
                                        }

                                        $.each(_click, function (_selector, _pattern) {
                                            $(_selector).vicopoFillField(_pattern, _city, _code);
                                        });
                                    });
                                }

                                _$cities.push($city);
                            });

                            if (_willShow) {
                                $repeater.after(_$cities);
                            }
                        });
                    }
                });
            }
        }
    });
    $(_fields).trigger('keyup', {init: true});
});
