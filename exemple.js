var vicopo = require('vicopo')();

vicopo(75001, function (err, answear) {
	if (err) {
		throw err;
	}
	console.log(answear[0].city); // PARIS-1ER-ARRONDISSEMENT
});

var secureVicopo = require('vicopo')('https');

secureVicopo('paris', function (err, answear) {
	if (err) {
		throw err;
	}
	console.log(answear.length);
});
