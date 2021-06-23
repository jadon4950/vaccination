var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var mongoosePaginate = require('mongoose-paginate');

var schema = mongoose.Schema;

var centreKeys = new schema({
    //_id: mongoose.Schema.Types.ObjectId,
    //user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    centreName:{
        type:String
    },
    centreCity:{
        type:String
    },
    location: {
        type: { type: String },
        coordinates: []
       },
    startTime:{
        type: String
    },
    endTime:{
        type: String
    },
    timeSlots:{
        type:Array
    },
    slots:{
        type:Array
    },


    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    },
    userType: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "ADMIN"
    }


},
{
    timestamps: true
});

centreKeys.index({ location: "2dsphere" });
centreKeys.plugin(mongoosePaginate);

module.exports = mongoose.model("centre", centreKeys);

var centreModel = mongoose.model("centre", centreKeys)
centreModel.findOne({ userType: "ADMIN" }, (error, result) => {
    if (error) {
        console.log("Internal server error.")
    } else if (result) {
        console.log("Admin already created.")
    } else {
        var obj = {
            firstName: "Shubham",
            lastName: "Jadon",
            email: "jadon4950@gmail.com",
            mobileNumber: "9520014950",
            password: bcrypt.hashSync("Mobiloitte1"),
            userType: "ADMIN"
        }
        centreModel.create(obj, (saveErr, saveRes) => {
            if (saveErr) {
                console.log("Internal server error.")
            } else {
                console.log("Default admin created.", saveRes)
            }
        })
    }
})