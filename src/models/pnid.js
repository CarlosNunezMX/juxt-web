const mongoose = require('mongoose');
const {pnidConnection} = require('../accountdb');

const PNIDSchema = new mongoose.Schema({
	access_level: {
		type: Number,
		default: 0  // 0: standard, 1: tester, 2: mod?, 3: dev
	},
	server_access_level: {
		type: String,
		default: 'prod' // everyone is in production by default
	},
	pid: {
		type: Number,
		unique: true
	},
	username: String,
	birthdate: String,
	country: String,
	mii: {
		name: String,
		data: String,
	},
});

const PNID = pnidConnection.model('PNID', PNIDSchema);

module.exports = {
	PNID,
};
