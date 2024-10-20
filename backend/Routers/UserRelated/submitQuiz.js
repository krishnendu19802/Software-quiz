const db = require('../../config/database');

const submitQuiz = async (req, res) => {
    const { userId,email } = req.user;  // Extract userId from the token
    const { questions } = req.body;  // questions should be an array with objects containing questionId, topicId, status

    if (!questions || !Array.isArray(questions) || questions.length !== 10) {
        return res.status(400).json({ error: 'Please provide exactly 10 questions with their questionId, topicId, and status' });
    }

    let totalScore = 0;

    try {
        // Start the transaction
        await db.promise().query('START TRANSACTION');
        const [resp]=await db.promise().query('select * from users where userId=? ',[userId])
        if(resp.length===0)
            return res.status(401).send({error:'User not found'})

        // Insert each question's result into questionHistory
        for (const question of questions) {
            const { questionId, topicId, status } = question;

            // Validate the question fields
            if (!questionId || !topicId || typeof status !== 'number') {
                await db.promise().query('ROLLBACK');
                return res.status(400).json({ error: 'Invalid question data' });
            }

            // Add points for correct answers (status == 1 means correct)
            if (status === 1) {
                totalScore += 5;
            }

            // Insert into questionHistory
            await db.promise().query(
                'INSERT INTO questionHistory (userId, topicId, questionId, status) VALUES (?, ?, ?, ?)',
                [userId, topicId, questionId, status]
            );
        }

        // Insert total score into quizHistory
        const [quizResult] = await db.promise().query(
            'INSERT INTO quizHistory (userId, score) VALUES (?, ?)',
            [userId, totalScore]
        );

        // Check if the user exists in leaderBoard
        const [leaderBoardResult] = await db.promise().query(
            'SELECT score FROM leaderBoard WHERE userId = ?',
            [userId]
        );

        if (leaderBoardResult.length > 0) {
            // User exists, update their score
            const newScore = leaderBoardResult[0].score + totalScore;
            await db.promise().query(
                'UPDATE leaderBoard SET score = ? WHERE userId = ?',
                [newScore, userId]
            );
        } else {
            // User doesn't exist, create new entry in leaderBoard
            await db.promise().query(
                'INSERT INTO leaderBoard (userId, score) VALUES (?, ?)',
                [userId, totalScore]
            );
        }

        // Commit the transaction
        await db.promise().query('COMMIT');

        // Successful response
        res.status(201).json({ message: 'Quiz submitted successfully', totalScore });

    } catch (err) {
        console.error(err);
        // Rollback the transaction in case of error
        await db.promise().query('ROLLBACK');
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = submitQuiz;
