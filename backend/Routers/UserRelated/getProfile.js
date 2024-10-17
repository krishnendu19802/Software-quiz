const db = require('../../config/database');

const getProfile = async (req, res) => {
    const { userId } = req.user;  // Extract userId from the token

    try {
        // Fetch user details (name, email)
        const [userDetails] = await db.promise().query(
            'SELECT name, email FROM users WHERE userId = ?',
            [userId]
        );

        if (userDetails.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, email } = userDetails[0];

        // Fetch the last 20 attempted questions in descending order of date
        const [lastQuestions] = await db.promise().query(
            `SELECT qh.topicId, qh.questionId, qh.status, qh.timestamp, t.topicName 
            FROM questionHistory qh 
            JOIN topics t ON qh.topicId = t.topicId 
            WHERE qh.userId = ? 
            ORDER BY qh.timestamp DESC 
            LIMIT 10`,
            [userId]
        );

        // Fetch the last 5 attempted quizzes in descending order of date
        const [lastQuizzes] = await db.promise().query(
            'SELECT quizId, score, timestamp FROM quizHistory WHERE userId = ? ORDER BY timestamp DESC LIMIT 5',
            [userId]
        );

        // Fetch the user's leaderboard score (if any)
        const [leaderBoardData] = await db.promise().query(
            'SELECT score FROM leaderBoard WHERE userId = ?',
            [userId]
        );

        let score = 0;
        if (leaderBoardData.length > 0) {
            score = leaderBoardData[0].score;
        }

        // Fetch the user's rank in the leaderboard (only if they have a score > 0)
        let rank = null;
        if (score > 0) {
            const [rankData] = await db.promise().query(
                "SELECT COUNT(*) AS `rank` FROM leaderBoard WHERE score > (SELECT score FROM leaderBoard WHERE userId = ?);",
                [userId]
            );
            rank = rankData[0].rank+1;
        }

        // Send profile details as response
        res.status(200).json({
            name,
            email,
            lastQuestions,
            lastQuizzes,
            score,
            rank: rank || 'Not ranked'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
    }
};

module.exports = getProfile;
