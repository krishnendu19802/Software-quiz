const db = require('../../config/database');
const { encrypt } = require('../../Helper/PasswordHashing');

const addAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
        return res.status(400).json({ error: 'Name, email, and password cannot be empty' });
    }

    try {
        // Check if email already exists
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Encrypt the password
        const hashedPassword = await encrypt(password);

        // Insert the new user into the database
        await db.promise().query(
            'INSERT INTO users (name, email, password,admin) VALUES (?, ?, ?,?)',
            [name, email, hashedPassword,1]
        );

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {

        return res.status(500).json({ error: 'Database error' });
    }
}

module.exports = addAdmin;
