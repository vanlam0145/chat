const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const userSchema = mongoose.Schema({
    username: { type: String },
    fullname: { type: String, default: '' },
    email: { type: String, unique: true },
    password: { type: String, default: '' },
    userImage: { type: String, default: 'default.png' },
    facebook: { type: String, default: '' },
    fbTokens: Array,
    google: { type: String, default: '' },
    ggTokens: Array,
    dateCreate: { type: Date, default: Date(Date.now()) },
    sentRequest: [{
        username: { type: String, default: '' }
    }],
    request: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String, default: '' },
    }],
    friendsList: [{
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        friendName: { type: String, default: '' },
    }],
    totalRequest: { type: Number, default: 0 },
})
userSchema.methods.encryptPassword = function (password) {
    var salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, salt);
}
userSchema.methods.comparePassword = function (password) {
    return bcryptjs.compareSync(password, this.password)
}
module.exports = mongoose.model('User', userSchema);