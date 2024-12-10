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
const { generateCSRFToken, verifyCSRFToken } = require('../protection/csrfProtection');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const EmailController = require('../Controllers/EmailController');

const authenticateAppKey = require('../middleware/authenticateAppKey');
const AdminController = require('../Controllers/AdminController');
const TodoController = require('../Controllers/TodoController');

// Admin router
router.post("/install", authenticateAppKey, generateCSRFToken, AdminController.install);
router.post("/login", authenticateAppKey, generateCSRFToken, AdminController.login);

// Todo router
router.post("/todos", authenticateAppKey, generateCSRFToken, TodoController.create);
router.get("/todos", authenticateAppKey, generateCSRFToken, TodoController.getAll);
router.patch("/todos/:todoId", authenticateAppKey, generateCSRFToken, TodoController.update);
router.delete("/todos/:todoId", authenticateAppKey, generateCSRFToken, TodoController.delete);

// Email service router
router.post("/emails/forgot-password", authenticateAppKey, generateCSRFToken, EmailController.sendForgotPasswordEmail);
router.post("/emails/reset-password", authenticateAppKey,  EmailController.resetPassword);

module.exports = router;
