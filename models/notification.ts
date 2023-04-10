import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		issue: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Issue',
			required: true,
		},
		type: {
			type: String,
			enum: ['comment', 'status_change', 'assignment', 'due_date', 'custom'],
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Notification', notificationSchema);
