const router = require('express').Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

//Route for USER
router.post('/registration',userController.registration);
router.put('/userLogin',userController.userLogin);

//Route for ADMIN
router.post('/addCentre',adminController.addCentre);
router.get('/centreList',adminController.centreList);
router.get('/viewCentreContent/:_id',adminController.viewCentreContent);
router.put('/editCentreContent/:_id',adminController.editCentreContent);
router.put('/deleteCentreKey/:_id',adminController.deleteCentreKey);
router.put('/centreActive',adminController.centreActive);
router.put('/centreBlock',adminController.centreBlock);
router.put('/deleteCentre',adminController.deleteCentre);
router.get('/paginateCentres',adminController.paginateCentres);

router.get('/userList',adminController.userList);
router.get('/viewUserContent/:_id',adminController.viewUserContent);
router.put('/blockUser/:_id',adminController.blockUser);
router.put('/activeUser/:_id',adminController.activeUser);


module.exports=router;

