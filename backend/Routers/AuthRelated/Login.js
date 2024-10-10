const db = require('../../config/database');
const { decrypt } = require('../../Helper/PasswordHashing');
const jwt = require('jsonwebtoken');
const login = async (req, res) => {
    // console.log('Hi')

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password' });
    }

    try {
        // Use db.promise().query to return a promise
        const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

        // Compare the password
        const isPasswordMatch = await decrypt(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Successful login
        const token = jwt.sign(
            { userId: user.userId, email: user.email, admin:user.admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
         );
        res.status(200).json({ message: 'Login successful',token, user: { name:user.name, email: user.email,admin:user.admin } });

    } catch (err) {
        return res.status(500).json({ error: 'Database error' });
    }
}

module.exports = login;
