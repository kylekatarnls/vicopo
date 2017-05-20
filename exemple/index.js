jQuery(function ($) {
    var _code = $('#code'), _city = $('#city'), _out = $('#output');
    var _cache = {};
    var _protocol = ~(location.protocol + '').indexOf('s') ? 'https' : 'http';
    var _host = _protocol + '://vicopo.selfbuild.fr';
    _code.keyup(function () {
        var _val = $(this).val();
        if (/^[^0-9]/.test(_val)) {
            _code.val('');
            _city.val(_val).focus().trigger('keyup');
        }
    });
    _city.keyup(function () {
        var _val = $(this).val();
        if (/^[0-9]/.test(_val)) {
            _city.val('');
            _code.val(_val).focus().trigger('keyup');
        }
    });
    function _done(_cities) {
        _out.html(_cities.map(function (_data) {
            return '<a href="#">' + _data.code + ' &nbsp; ' + _data.city + '</a>';
        }).join(''));
    }

    $.each(['code', 'city'], function (i, _name) {
        var _input = $('#' + _name).on('keyup', function () {
            var _val = _input.val();
            if (_val.length > 1) {
                _cache[_name] = _cache[_name] || {};
                if (_cache[_name][_val]) {
                    _done(_cache[_name][_val]);
                }
                var _data = {};
                _data[_name] = _val;
                $.getJSON(_host, _data, function (_answear) {
                    _cache[_name][_answear.input] = _answear.cities;
                    if (_input.val() == _answear.input) {
                        _done(_answear.cities);
                    }
                });
            }
        });
    });
    $(document).on('click', '#output a', function (e) {
        var _contents = $(this).text();
        var _space = _contents.indexOf(' ');
        if (~_space) {
            _code.val(_contents.substr(0, _space));
            _city.val(_contents.substr(_space).trim());
            _out.empty();
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
});
