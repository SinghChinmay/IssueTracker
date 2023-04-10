import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: [true, 'Please provide a comment'],
			trim: true,
		},
		issue: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Issue',
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Comment', commentSchema);
