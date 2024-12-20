const bcrypt = require('bcrypt');
const { Role } = require('./roles');
const { User } = require('./user');

class CreationController {
    static async createUser(req, res) {
        try {
            const { name, lastName, username, email, password, roleName } = req.body;

            if (!name || !lastName || !username || !email || !password || !roleName) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check if the role exists in the database
            const role = await Role.findOne({ where: { name: roleName } });

            if (!role) {
                console.log(`Role not found: ${roleName}`);
                return res.status(404).json({ message: "Role not found" });
            }

            console.log("Found role:", role);  // Log the role object

            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user and assign the roleId based on the found role
            const user = await User.create({
                name,
                lastName,
                username,
                email,
                password: hashedPassword,
                roleId: role.roleId,  // Ensure this works as expected
            });

            res.status(201).json({ message: 'User created successfully', user });

        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
    static async getUserByEmail(req, res) {
        try {
            const email = req.params.email;

            const user = await User.findOne({
                where: { email },
                include: Role,
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    }
}

module.exports = CreationController;