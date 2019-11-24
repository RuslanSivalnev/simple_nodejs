const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
	const candidate = await User.findOne({email: req.body.email});
	if (candidate) {
		// проверка пароля, пользователь сеществует
		const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
		if (passwordResult) {
			//генирация токена, пароли совпали
			const token = jwt.sign({
				email: candidate.email,
				userId: candidate._id
			}, keys.jwt, {expiresIn: 60 * 60});

			res.status(200).json({
				token: `Bearer ${token}`
			});
		} else {
			//пароли не совпали
			res.status(401).json({
				message: 'password not valid, try again'
			})
		}
	} else {
		// пользователя нет, ошибка
		res.status(404).json({
			message: 'user not found'
		})

	}
};
module.exports.register = async function (req, res) {
	const candidate = await User.findOne({email: req.body.email});

	if (candidate) {
		res.status(409).json({
			message: "such email already exists"
		})
	} else {
		const salt = bcrypt.genSaltSync(10);

		const user = new User({
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, salt)
		});

		try {
			await user.save();
			res.status(201).json(user)
		} catch (err) {
			errorHandler(res, err);
		}
	}
};
