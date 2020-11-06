const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const { UserInputError } = require('apollo-server')
const { SECRET_KEY } = require('../../config')

varlidateRegisterInput = (
    username,
    password,
    confirmPassword,
    email
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        const regularEx = /^([!#-\'*+\/-9=?A-Z^-~\\\\-]{1,64}(\.[!#-\'*+\/-9=?A-Z^-~\\\\-]{1,64})*|"([\]!#-[^-~\ \t\@\\\\]|(\\[\t\ -~]))+")@([0-9A-Z]([0-9A-Z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Z]([0-9A-Z-]{0,61}[0-9A-Za-z])?))+$/i;
        if (!email.match(regularEx)) {
            errors.email = 'Email must be a valid email address';
        }
    }
    if (password === '') {
        errors.password = 'Password must not empty';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
}

validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty'
    }
    if (password.trim() === '') {
        errors.password = 'Password must not be empty'
    }

    return ({
        errors,
        valid: Object.keys(errors).length < 1
    })
}

generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY,
        {
            expiresIn: '1h'
        }
    )
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);

            //fail login input validation
            if (!valid) {
                throw new UserInputError('Username or password errors', { errors })
            }
            const user = await User.findOne({ username });
            // fail user name
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors });
            }

            // fail password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong password or username';
                throw new UserInputError('Wrong password or username', { errors });
            }

            //successful login
            const token = generateToken(user)
            return {
                ...user._doc,
                id: user.id,
                token
            }
        },

        async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) { // parent, args, context, info
            // Validate user data
            const { valid, errors } = varlidateRegisterInput(username, password, confirmPassword, email)
            if (!valid) {
                throw new UserInputError('Error', { errors })
            }
            // Check from existed user

            const user = await User.findOne({ username })

            if (user) {
                throw new UserInputError('Username existed', {
                    errors: {
                        username: 'This username existed'
                    }
                })
            }
            // encrypt password, create auth token
            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res.id,
                token
            }
        }
    }
}