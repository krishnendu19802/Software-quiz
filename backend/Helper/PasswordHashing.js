const bcrypt = require('bcrypt');

// Function to encrypt a plain text password
async function encrypt(password) {
    const saltRounds = 10; // You can adjust the number of salt rounds
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error('Error encrypting password:', err);
        throw err;
    }
}

// Function to compare a plain password and a hashed password
async function decrypt(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (err) {
        console.error('Error comparing password:', err);
        throw err;
    }
}

module.exports = {
    encrypt,
    decrypt
};
