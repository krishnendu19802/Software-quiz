const db = require('../../config/database');

const addQuestion = async (req, res) => {
    const { topicName, statement, option1, option2, option3, option4, ansIndex } = req.body;
    const userId = req.user.userId;
    // console.log(req.body)

    // Check if all required fields are present and non-empty
    if (
        !topicName || topicName.trim() === '' ||
        !statement || statement.trim() === '' ||
        !option1 || option1.trim() === '' ||
        !option2 || option2.trim() === '' ||
        !option3 || option3.trim() === '' ||
        !option4 || option4.trim() === '' ||
        ansIndex===undefined|| typeof ansIndex !== 'number'
    ) {
        return res.status(400).json({ error: 'Please provide valid topic name, statement, options, and answer index' });
    }

    try {
        // Check if the topic exists in the database
        const [existingTopic] = await db.promise().query('SELECT topicId FROM topics WHERE topicName = ?', [topicName]);

        if (existingTopic.length === 0) {
            return res.status(400).json({ error: 'Topic not found' });
        }

        const topicId = existingTopic[0].topicId;

        // Insert the question into the database
        const [result] = await db.promise().query(
            'INSERT INTO questions (userId, topicId, statement, option1, option2, option3, option4, ansIndex) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, topicId, statement, option1, option2, option3, option4, ansIndex]
        );

        // Successful question addition
        res.status(201).json({ message: 'Question added successfully', questionId: result.insertId });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database error' });
    }
};

module.exports = addQuestion;
