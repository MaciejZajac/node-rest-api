const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { body } = require("express-validator/check");

const User = require("../models/user");

router.put(
    "/signup",
    [
        body("email", "Please enter a valid email")
            .isEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject("Email address already exists.");
                    }
                });
            })
            .normalizeEmail(),
        body("password", "Password ")
            .trim()
            .isLength({ min: 5, max: 50 }),
        body("name")
            .trim()
            .not()
            .isEmpty()
    ],
    authController.signup
);

module.exports = router;
