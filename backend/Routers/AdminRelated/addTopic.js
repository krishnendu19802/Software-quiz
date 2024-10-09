const db = require('../../config/database');

const addTopic = async (req, res) => {
    const { topicName } = req.body;
    const userId=req.user.userId

    // Check if topic name is provided and not empty
    if (!topicName || topicName.trim() === '') {
        return res.status(400).json({ error: 'Topic name cannot be undefined or empty' });
    }

    try {
        // Check if the topic already exists in the database
        const [existingTopic] = await db.promise().query('SELECT * FROM topics WHERE topicName = ?', [topicName]);

        if (existingTopic.length > 0) {
            return res.status(400).json({ error: 'Topic already exists' });
        }

        // Insert the new topic into the database
        const [result] = await db.promise().query(
            'INSERT INTO topics (userId, topicName) VALUES (?,?)',
            [userId,topicName]
        );

        // Successful topic addition
        res.status(201).json({ message: 'Topic added successfully', topicId: result.insertId });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database error' });
    }
};

module.exports = addTopic;
