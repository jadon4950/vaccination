
var centreModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports = {

    registration: async (req, res) => {
        try {
            const query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: "ACTIVE", userType: "USER" }] }
            const document = await userModel.findOne(query);
            console.log(document);
            if (!req.body.email && !req.body.mobileNumber) {
                return res.status(404).json({ message: "email & mobileNumber not define" });
            }
            else if (document) {
                return res.status(400).json({ error: "email & mobileNumber already exists" });
            }
            else {
                const fullName = req.body.fullName;
                const aadharNumber = req.body.aadharNumber;
                req.body.password = bcrypt.hashSync(req.body.password);
         
           // const userPic = await commonFunction.uploadImage(req.body.profileImage);

             //   console.log("line no 31", userPic);
                // saving the data
                const newUser = await userModel(req.body).save();
                if (newUser) {
                    console.log("line no 35", newUser)
                    res.json({ status: "success", message: "Registration successfull", data: newUser });
                }
                else {
                    res.status(404).json({ message: "error occured" });
                }
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    userLogin: async (req, res) => {
        try {
            const query = { email: req.body.email, status: "ACTIVE" }
            const document = await userModel.findOne(query);
            if (!document) {
                return res.status(404).json({ message: "Incorrect email" });
            }
            else {

                if (bcrypt.compareSync(req.body.password, document.password)) {
                    var token = jwt.sign({ _id: document._id, email: document.email }, 'testing', { expiresIn: '1h' });

                    res.json({ status: "success", message: "user found!!!", data: { token: token, _id: document._id, email: document.email } });

                }
                else if (req.body.password != document.password) {

                    return res.status(404).json({ message: "password not matched." });
                }
                else {
                    res.json({ status: "error", message: "Error inquired during login", data: null });
                }
            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
}