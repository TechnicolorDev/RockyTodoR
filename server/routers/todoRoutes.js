///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                  !THIS IS ROUTER FOR THIS APP!                                                           //
//          This part is very easy to do if you are making modification and custom endpoints                                //
//                                                                                                                          //
//                                           EXAMPLE                                                                        //
//                                                                                                                          //
//  router.{methode}("PATH_OF_API", authenticateAppKey, generateCSRFToken/verifyCSRFToken, {Controller_NAME}.{your_methode) //                                                                                  //
//                                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const bcrypt = require('bcrypt');
const { Admin, Todo } = require('../database/database');
const { generateCSRFToken, verifyCSRFToken, nonSessionCSRFToken, sessionCSRFToken} = require('../protection/csrfProtection');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const EmailController = require('../Controllers/EmailController');

const authenticateAppKey = require('../middleware/authenticateAppKey');
const AdminController = require('../Controllers/AdminController');
const TodoController = require('../Controllers/TodoController');
const ChangeColorsController = require("../Controllers/Colors/ChangeColors");
const CreationController = require('../Controllers/admin/CreationController');

// Admin router
// Admin router
router.post("/install", authenticateAppKey, nonSessionCSRFToken, AdminController.install);
router.post("/login", authenticateAppKey, sessionCSRFToken, AdminController.login);
router.get("/login", authenticateAppKey, AdminController.checkLogin);  // No CSRF token needed for GET
router.post("/logout", authenticateAppKey, AdminController.logOut);

// Todo router
router.post("/todos", authenticateAppKey, verifyCSRFToken, TodoController.create);  // CSRF token for POST
router.get("/todos", authenticateAppKey, TodoController.getAll);  // No CSRF token needed for GET
router.patch("/todos/:todoId", authenticateAppKey, verifyCSRFToken, TodoController.update);  // CSRF token for PATCH
router.delete("/todos/:todoId", authenticateAppKey, verifyCSRFToken, TodoController.delete);  // CSRF token for DELETE

// Email service router
router.post("/emails/forgot-password", authenticateAppKey,  EmailController.sendForgotPasswordEmail);  // CSRF token for POST
router.post("/emails/reset-password", authenticateAppKey,  EmailController.resetPassword);  // No CSRF token needed for POST

// Admin controller
router.get("/admin/colors", authenticateAppKey, ChangeColorsController.getColors);  // No CSRF token needed for GET
router.post("/admin/colors", authenticateAppKey, verifyCSRFToken, ChangeColorsController.updateColor);  // CSRF token for POST
router.post("/admin/colors/reset", authenticateAppKey, verifyCSRFToken, ChangeColorsController.resetColors);  // CSRF token for POST

// Admin user router
router.post("/admin/users/create", authenticateAppKey, verifyCSRFToken, CreationController.createUser);  // CSRF token for POST

// Csrf protector
module.exports = router;

