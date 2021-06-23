var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userKeys = new schema({

    fullName:{
        type: String
    },
    mobileNumber:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    aadharNumber: {
        type:String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },
    userType: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }

},
{
    timestamps: true
});
module.exports = mongoose.model("user", userKeys)