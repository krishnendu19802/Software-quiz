const db = require('../../config/database');

const getTopics = async (req, res) => {
    try {
        // Fetch all topics and count the number of questions for each topic
        const [topics] = await db.promise().query(`
            SELECT t.topicId, t.topicName, COUNT(q.questionId) AS questionCount
            FROM topics t
            LEFT JOIN questions q ON t.topicId = q.topicId
            GROUP BY t.topicId, t.topicName
            ORDER BY t.topicId;
        `);

        // Return the topics with their question counts
        res.status(200).json(topics);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database error' });
    }
};

module.exports = getTopics;
