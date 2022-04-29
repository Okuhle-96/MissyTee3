// add code in here to create an API with ExpressJS
const express = require('express');
const app = express();

require('dotenv').config();

const garments = require('./garments.json');
const jwt = require('jsonwebtoken');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));

const userAccess = {
	username: 'Okuhle-96'
};

app.post('/api/login', function (req, res) {

	const {
		username
	} = req.body;
	if (username == userAccess.username) {
		const accesKey = generateAccessToken({
			username
		});
		res.json({
			accesKey
		})
	} else {
		res.json({
			message: 'Please enter a registered user.',
			status: 401
		})
	}
})

const authanticateToken = (req, res, next) => {

	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(" ")[1];

	if (token === null) return res.sendStatus(401)

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)
		req.user = user
		console.log(user);
		next()
	})
}

const generateAccessToken = (user) => {
	return jwt.sign(user, 'secretKey', {
		expiresIn: '24h'
	});
}

app.get('/api/posts', authanticateToken, function (req, res) {
	res.json({
		garments: garments
	})
})

app.get('/api/garments', function (req, res) {

	const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = garments.filter(garment => {

		if (gender != 'All' && season != 'All') {
			return garment.gender === gender &&
				garment.season === season;
		} else if (gender != 'All') {
			return garment.gender === gender
		} else if (season != 'All') {
			return garment.season === season
		}
		return true;
	});

	res.json({
		garments: filteredGarments
	});
})

app.get('/api/garments/price/:price', function (req, res) {
	const maxPrice = Number(req.params.price);
	const filteredGarments = garments.filter(garment => {
		if (maxPrice > 0) {
			return garment.price <= maxPrice;
		}
		return true;
	});

	res.json({
		garments: filteredGarments
	});
});

app.post('/api/garments', (req, res) => {


	const {
		description,
		img,
		gender,
		season,
		price
	} = req.body;

	if (!description || !img || !price) {
		res.json({
			status: 'error',
			message: 'Required data not supplied',
		});
	} else {
		garments.push({
			description,
			img,
			gender,
			season,
			price
		});

		res.json({
			status: 'success',
			message: 'New garment added.',
		});
	}

});

const PORT = process.env.PORT || 4017;

app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});