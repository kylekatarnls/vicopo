/**
 * Vicopo
 * @author https://github.com/kylekatarnls
 * https://vicopo.selfbuild.fr
 */
(function (w) {
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

    function getXMLHttpRequest() {
        if (w.XMLHttpRequest || w.ActiveXObject) {
            if (w.ActiveXObject) {
                try {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                } catch(e) {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            }

            return new XMLHttpRequest();
        }

        return null;
    }

    function getJSON(url, callback) {
        if ('fetch' in w) {
            fetch(url).then(function (response) {
                response.json().then(callback);
            });

            return;
        }

        var xhr = getXMLHttpRequest();

        if (!xhr) {
            return;
        }

        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                callback(JSON.parse(this.responseText));
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    var _host = 'https://vicopo.selfbuild.fr';
    var _cache = {};
    var _sort = function (a, b) {
        return a.city - b.city;
    };
    var _filter = function () {
        return true;
    };

    function vicopoSort($sort) {
        _sort = $sort;
    }

    function vicopoFilter($filter) {
        _filter = $filter;
    }

    function vicopoPrepare($cities) {
        $cities = $cities.filter(_filter);

        return $cities.sort(_sort);
    }

    function getVicopo(_name, _input, _done) {
        _input = _input.trim();

        if (_input.length > 1) {
            _cache[_name] = _cache[_name] || {};

            if(_cache[_name][_input]) {
                _done(_input, vicopoPrepare(_cache[_name][_input] || []), _name);

                return;
            }

            return getJSON(_host + '?' + _name + '=' + encodeURIComponent(_input), function (_answer) {
                _cache[_name][_input] = _answer.cities;
                _done(_answer.input, vicopoPrepare(_answer.cities || []), _name);
            });
        }

        _done(_input, [], _name);
    }

    function vicopo(_input, _done) {
        _input = _input.trim();

        return getVicopo(/^\d+$/.test(_input) ? 'code' : 'city', _input, _done);
    }

    function codePostal(_input, _done) {
        return getVicopo('code', _input, _done);
    }

    function ville(_input, _done) {
        return getVicopo('city', _input, _done);
    }

    function NodeList(nodes) {
        this.nodes = 'length' in nodes ? nodes : [nodes];
    }

    function $(nodes) {
        return new NodeList(typeof nodes === 'string' ? document.querySelectorAll(nodes) : nodes);
    }

    var methods = {
        each: function (callback) {
            [].forEach.call(this.nodes, callback);

            return this;
        },
        remove: function () {
            this.each(function (elt) {
                elt.parentNode.removeChild(elt);
            });
        },
        next: function () {
            return $(this.nodes[0].nextSibling);
        },
        data: function (key) {
            if (arguments.length < 2) {
                const attribute = this.nodes[0].getAttribute('data-' + key);

                try {
                    return JSON.parse(attribute);
                } catch (e) {
                    return attribute;
                }
            }

            var json = JSON.stringify(arguments[1]);

            return this.each(function (elt) {
                elt.setAttribute('data-' + key, json);
            });
        },
        hasClass: function (className) {
            return (' ' + this.nodes[0] + ' ').indexOf((' ' + className + ' ')) !== -1;
        },
        addClass: function (className) {
            return this.each(function (elt) {
                elt.className += ' ' + className;
            });
        },
        find: function (selector) {
            var _elements = [];
            this.each(function (elt) {
                $(elt.querySelectorAll(selector)).each(function (foundElement) {
                    _elements.push(foundElement);
                });
            });

            return $(_elements);
        },
        val: function () {
            if (!arguments.length) {
                return this.nodes[0].value;
            }

            return this.each(function (elt) {
                elt.value = arguments[0];
            });
        },
        text: function () {
            if (!arguments.length) {
                return this.nodes[0].innerText;
            }

            return this.each(function (elt) {
                elt.innerText = arguments[0];
            });
        },
        hide: function () {
            return this.each(function (elt) {
                elt.style.display = 'none';
            });
        },
        show: function () {
            return this.each(function (elt) {
                elt.style.display = '';
            });
        },
        removeAttr: function (key) {
            return this.each(function (elt) {
                elt.removeAttribute(key);
            });
        },
        on: function (events, callback) {
            this.each(function (elt) {
                events.forEach(function (event) {
                    if (elt.addEventListener) {
                        elt.addEventListener(event, callback, false);

                        return;
                    }

                    if (elt.attachEvent) {
                        elt.attachEvent('on' + event, callback);

                        return;
                    }

                    elt['on' + event] = callback;
                });
            });
        },
        keyup: function (callback) {
            this.on(['keyup', 'change'], callback);
        },
        click: function (callback) {
            this.on(['click'], callback);
        },
        vicopoClean: function () {
            return this.each(function (elt) {
                var _removeList = [];

                for(var $next = $(elt).next(); $next.hasClass('vicopo-answer'); $next = $next.next()) {
                    _removeList.push($next[0]);
                }

                $(_removeList).remove();
            });
        },
        vicopoTargets: function () {
            var _targets = [];

            this.each(function (elt) {
                var $target = $(elt);

                $('[data-vicopo]').each(function (elt) {
                    if ([].indexOf.call(document.querySelectorAll($(elt).data('vicopo')), $target.nodes[0]) !== -1) {
                        _targets.push(elt);
                    }
                });
            });

            return $(_targets);
        },
        vicopoTarget: function () {
            return $(this).vicopoTargets().nodes[0];
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
                _method($input.val(), function (_input, _cities, _name) {
                    if(_input === $input.val()) {
                        _done(_cities, _name, _input);
                    }
                });
            });
        },
        vicopo: function (_done) {
            return $(this).getVicopo(vicopo, _done);
        },
        codePostal: function (_done) {
            return $(this).getVicopo(codePostal, _done);
        },
        ville: function (_done) {
            return $(this).getVicopo(ville, _done);
        }
    };

    for (var name in methods) {
        NodeList.prototype[name] = methods[name];
    }

    function checkValue(element) {
        var $target = $(element);
        var _input = $target.val();

        if ($target.data('vicopo-value') !== _input) {
            var _fill = $target.data('vicopo-get');
            var _$targets = $target.data('vicopo-value', _input)
                .vicopoTargets().each(function (elt) {
                    $(elt).hide().vicopoClean();
                });

            if (_$targets.nodes.length && _input.length) {
                vicopo(_input, function (_check, _cities) {
                    if(_check === _input) {
                        _$targets.each(function (elt) {
                            var repeater = $(elt).vicopoClean().nodes[0];
                            var _$template = $(repeater.cloneNode(true));
                            var _click = _$template.data('vicopo-click');
                            _$template.show().removeAttr('data-vicopo');

                            $(_cities).each(function (_city, _code) {
                                var $city = $(_$template.nodes[0].cloneNode(true));
                                $city.addClass('vicopo-answer');
                                $city.find('[data-vicopo-code-postal]').text(_code);
                                $city.find('[data-vicopo-ville]').text(_city);
                                $city.find('[data-vicopo-val-code-postal]').val(_code);
                                $city.find('[data-vicopo-val-ville]').val(_city);

                                if (_fill || _click) {
                                    $city.click(function () {
                                        if (_fill) {
                                            $target.vicopoFillField(_fill, _city, _code);
                                        }

                                        if (typeof _click === 'object') {
                                            for (var _selector in _click) {
                                                $(_selector).vicopoFillField(_click[_selector], _city, _code);
                                            }
                                        }
                                    });
                                }

                                repeater.appendChild($city.nodes[0]);
                            });
                        });
                    }
                });
            }
        }
    }

    var _fields = 'input, textarea, select';
    $(document).keyup(function (event) {
        checkValue(event.target || event.srcElement);
    });
    $(_fields).each(checkValue);

    w.vicopo = {
        checkValue: checkValue,
        getXMLHttpRequest: getXMLHttpRequest,
        getJSON: getJSON,
        vicopoSort: vicopoSort,
        vicopoFilter: vicopoFilter,
        vicopoPrepare: vicopoPrepare,
        getVicopo: getVicopo,
        codePostal: codePostal,
        ville: ville,
        NodeList: NodeList,
        vicopo: vicopo,
        $: $
    };
})((typeof globalThis !== 'undefined' && globalThis) ||
    (typeof self !== 'undefined' && self) ||
    (typeof global !== 'undefined' && global) ||
    (typeof window !== 'undefined' && window) ||
    {});