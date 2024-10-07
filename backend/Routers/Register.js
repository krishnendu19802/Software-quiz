const db = require('../config/database');
const { encrypt } = require('../Helper/PasswordHashing');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    

    // Check if all required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    try {
        // Check if the email already exists in the database
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already exists' }); // Using 400 instead of 409
        }

        // Encrypt the password using the encrypt function
        const hashedPassword = await encrypt(password);

        // Insert the new user into the database
        const [result] = await db.promise().query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // Successful registration
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error' });
    }
};

module.exports = register;
