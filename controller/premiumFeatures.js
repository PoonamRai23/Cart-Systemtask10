const User = require('../models/user');
const Expense = require('../models/expense');

const getUserLeaderBoard = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'expenses',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'expenses',
                },
            },
            {
                $addFields: {
                    totalExpense: { $sum: '$expenses.price' },
                },
            },
            {
                $sort: { totalExpense: -1 },
            },
        ]);

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = {
    getUserLeaderBoard,
};
