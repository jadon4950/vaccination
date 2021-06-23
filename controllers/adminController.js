var userModel = require('../models/userModel');
var centreModel = require('../models/centreModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require("moment");

module.exports = {
   
    addCentre: async (req, res) => {
        try {
            const query = { $and: [{ centreName: req.body.centreName }, { status: "ACTIVE", userType: "ADMIN" }] };
            const document = await centreModel.findOne(query);
            console.log(document);
            if (!req.body.centreName) {
                return res.status(404).json({ message: "centreName not define" });
            }
            else if (document) {
                return res.status(400).json({ error: "centreName already exists" });
            }

            else {
                const centreCity = req.body.centreCity;
                const location = req.body.location;

                let startTime = moment().utc().set({ hour: 9, minute: 00 });
                let endTime = moment().utc().set({ hour: 15, minute: 00 });

                var timeSlots = [];
                while (startTime <= endTime) {
                    timeSlots.push(new moment(startTime).format('HH:mm'));
                    startTime.add(30, 'minutes');

                    req.body.slots = slots;
                    var slots = [];
                    for (let i = 0; i < timeSlots.length; i++) {
                        if ( i < timeSlots.length-1) {
                              slots.push(`${timeSlots[i]}-${timeSlots[i+1]}`);
                            console.log(slots);       
                         }
                    }
                }

                const newCentre = await centreModel(req.body).save();
                res.status(201).json({ newCentre });
            }
            // }
            //})
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    centreList: async (req, res) => {
        try {
            const document = await centreModel.find({ status: "ACTIVE", userType: "ADMIN",
            location: {
                $near: {
                 $maxDistance: 5000,
                 $geometry: {
                  type: "Point",
                  coordinates: [27.057209,78.68922]
                 }
                }
              }
             }); //find((error, results) => {
            //     if (error) console.log(error);
            //     console.log(JSON.stringify(results, 0, 2));
            //    });
             //  console.log(JSON.stringify(document, 0, 2));
            res.status(201).json({ document });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    viewCentreContent: async (req, res) => {
        try {
            const viewUser = await centreModel.findOne({ _id: req.params._id, status: "ACTIVE", userType: "ADMIN" });
            console.log(viewUser);
            res.status(200).json({ viewUser });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    
    editCentreContent: async (req, res) => {
        try {
            var centreCity = req.body.centreCity;
            const updatedUser = await centreModel.findOneAndUpdate({ _id: req.params._id, status: "ACTIVE", userType: "ADMIN" }, { $set: { centreCity: centreCity } }, { new: true });
            res.status(200).json({ updatedUser });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    deleteCentreKey: async (req, res) => {
        try {
            const updatedUser = await centreModel.findOneAndUpdate({ _id: req.params._id, status: "ACTIVE", userType: "ADMIN" }, { $unset: { centreCity: res.centreCity } }, { new: true });
            res.status(200).json({ updatedUser });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    centreBlock: async (req, res) => {
        try {
            const centreStatus = await centreModel.findOne({centreName: req.body.centreName});
            console.log(centreStatus);
            if(centreStatus.status == "BLOCK"){
                return res.status(400).json({ message: "centre already BLOCK" });
            }else{
            const updatedUser = await centreModel.findByIdAndUpdate({ _id: centreStatus._id }, { $set: { status: "BLOCK" } }, { new: true });
            res.status(200).json({ updatedUser });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    centreActive: async (req, res) => {
        try {
            const centreStatus = await centreModel.findOne({centreName: req.body.centreName});
            console.log(centreStatus);
            if(centreStatus.status == "ACTIVE"){
                return res.status(400).json({ message: "centre already ACTIVE" });
            }else{
            const updatedUser = await centreModel.findByIdAndUpdate({ _id: centreStatus._id }, { $set: { status: "ACTIVE" } }, { new: true });
            res.status(200).json({ updatedUser });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    deleteCentre: async (req, res) => {
        try {
            const centreStatus = await centreModel.findOne({centreName: req.body.centreName});
            console.log(centreStatus);
            if(centreStatus == null){
                return res.status(400).json({ message: "centre already deleted" });
            }else{
            const deletedCentre = await centreModel.findByIdAndDelete({ _id: centreStatus._id });
            res.status(200).json({ deletedCentre });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    paginateCentres: async (req, res) => {
        try {
            var paginateUsers = await centreModel.find({ status: { $ne: " DELETE " } });
            console.log("paginateUsers", paginateUsers);
            if (paginateUsers) {
                var centreName = req.body.centreName;
                if (centreName) {
                    var query = {
                        centreName: { $regex: "v", $options: 'i' }
                    };
                }
                var options = {
                    //lean: true,
                    offset: 5,     //5
                    limit: 20,      //20
                };
                var paginateUsers = await centreModel.paginate(query, options);
                res.status(200).json({ paginateUsers });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

     //API for usersList
     userList: (req, res) => {
        userModel.find({ userType: "USER", status: "ACTIVE" }, (error, result) => {
            if (error) {
                return res.send({ responseCode: 500, responseMessage: "Internal server error", responseResult: error })
            } else if (result.length == 0) {
                return res.send({ responseCode: 404, responseMessage: "Data not found", responseResult: result })
            } else {
                return res.send({ responseCode: 200, responseMessage: "Details fetched successfully.", responseResult: result })
            }
        })
    },

    //API for viewUserContent
    viewUserContent: (req, res) => {
        userModel.findOne({ _id: req.params._id, status: "ACTIVE", userType: "USER" }, (err, result) => {
            if (err) {
                return res.send({ responseCode: 500, responseMessage: "Internal server error." });
            }
            else if (!result) {
                return res.send({ responseCode: 404, responseMessage: "Data not found." });
            }
            else {
                return res.send({ responseCode: 200, responseMessage: "Details have been fetched successfully.", result });
            }
        })
    },

    blockUser: async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.params._id});
            console.log(user);
            if(user.status == "BLOCK"){
                return res.status(400).json({ message: "user already BLOCK" });
            }else{
            const updatedUser = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: { status: "BLOCK" } }, { new: true });
            res.status(200).json({ updatedUser });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    activeUser: async (req, res) => {
        try {
            const user = await userModel.findOne({ _id: req.params._id});
            console.log(user);
            if(user.status == "ACTIVE"){
                return res.status(400).json({ message: "user already ACTIVE" });
            }else{
            const updatedUser = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: { status: "ACTIVE" } }, { new: true });
            res.status(200).json({ updatedUser });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }


}