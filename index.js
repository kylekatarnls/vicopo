module.exports = function (protocol) {
	protocol = protocol || 'https';
	var url = 'https://vicopo.selfbuild.fr/search/';
	switch (protocol) {
		case 'https':
			break;
		case 'http':
			url = 'http://vicopo.selfbuild.fr/search/';
			break;
		default:
			throw new Error(protocol + ' protocol not supported');
	}
	var transport = require(protocol);
	return function (search, done) {
		transport.get(url + encodeURIComponent(search), function (res) {
			var data = '';
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function () {
				var result;
				try {
					result = JSON.parse(data);
				} catch(e) {
					return done(new Error('Cannot parse Vicopo answear:\n' + e + '\n' + data));
				}
				if (result.cities) {
					done(null, result.cities);
				} else {
					done(new Error('The answear should contains a cities list:\n' + data));
				}
			});
		})
		.on('error', done);
	};
};
