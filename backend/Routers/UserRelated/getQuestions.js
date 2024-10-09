const db = require('../../config/database');

const getQuestions = async (req, res) => {
    const { topicId } = req.params;
    console.log(topicId)
    // Check if topicId is provided and valid
    if (!topicId || isNaN(topicId)) {
        return res.status(400).json({ error: 'Please provide a valid topic ID' });
    }

    try {
        // Check if the topic exists in the database
        const [existingTopic] = await db.promise().query('SELECT topicId FROM topics WHERE topicId = ?', [topicId]);

        if (existingTopic.length === 0) {
            return res.status(400).json({ error: 'Topic not found' });
        }

        // Fetch 10 random questions from the given topic
        const [questions] = await db.promise().query(
            'SELECT questionId, statement, option1, option2, option3, option4, ansIndex FROM questions WHERE topicId = ? ORDER BY RAND() LIMIT 10',
            [topicId]
        );

        if (questions.length === 0) {
            return res.status(400).json({ error: 'No questions found for this topic' });
        }

        // Return the random questions
        res.status(200).json(questions);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database error' });
    }
};

module.exports = getQuestions;
