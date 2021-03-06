const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { email, name, password } = req.body;

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({ email, name, password: hashedPassword });
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Created new user.",
                userId: result._id
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                const error = new Error("No such email in a database.");
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Wrong password.");
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                { email: loadedUser.email, userId: loadedUser._id.toString() },
                "somesupersupersupersecret",
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error("Could not found a user.");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "User found",
                status: user.status
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error("Could not found a user.");
                error.statusCode = 404;
                throw error;
            }
            user.status = newStatus;
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: "User updated"
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
