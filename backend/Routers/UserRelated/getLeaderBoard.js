const db = require('../../config/database');

const getLeaderboard = async (req, res) => {
    try {
        // Fetch the leaderboard with rank, userId, name, and score
        const [leaderboard] = await db.promise().query(`
            SELECT 
                u.userId,
                u.name,
                lb.score,
                RANK() OVER (ORDER BY lb.score DESC) as leaderBoardRank
            FROM 
                leaderBoard lb
            JOIN 
                users u ON lb.userId = u.userId
            ORDER BY 
                lb.score DESC
        `);

        // Send the leaderboard data as a response
        res.status(200).json(leaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

module.exports = getLeaderboard;
