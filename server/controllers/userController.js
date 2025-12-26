const User = require('../models/User');

exports.syncUser = async (req, res) => {
    try {
        const { clerkId, email, name, imageUrl } = req.body;

        // "Upsert" logic: If user exists, update them. If not, create them.
        const user = await User.findOneAndUpdate(
            { clerkId },
            { clerkId, email, name, imageUrl },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};