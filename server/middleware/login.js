/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                 !DEPRECATION WARNING!                                           //
//                      This is the first version of login endpoint!                               //
//         Do not use it or copy its code since it does not have any security meassures!           //
//                                                                                                 //
//                                 SimpleTodo TimeMachine                                          //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const bcrypt = require('bcrypt');
const { Admin } = require('../database/database');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Find admin
        const admin = await Admin.findOne({ where: { email } });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Set session
        req.session.adminId = admin.id;

        res.status(200).json({ message: 'Login successful.', adminId: admin.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed.' });
    }
});

module.exports = router;
