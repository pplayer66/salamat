var mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI);
var Boutique = mongoose.model('Boutique', {
	name: String,
	salamat: String,
	salon: String,
	phone: String,
	total: String,
	about: String,
	logo: String,
	picts: String
});

module.exports = {Boutique};