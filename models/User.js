const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid email address' });
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [
        {
            token: {
                type: String,
                require: true
            }
        }
    ]
})

//hash the password before the saving user
userSchema.pre('save', async function (next) {
    const user = this;
    //hash the password if it was modified
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.statics.findByCredintials = async function (email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error({ error: 'Invalid login credintials ! ' });
    }
    else {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error({ error: ' Invalid login credintials !' })
        }
        return user;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;