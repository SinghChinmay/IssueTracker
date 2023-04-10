import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Please provide an issue title'],
			trim: true,
		},
		description: {
			type: String,
			required: [true, 'Please provide an issue description'],
			trim: true,
		},
		type: {
			type: String,
			enum: ['bug', 'feature', 'improvement', 'task'],
			required: true,
		},
		priority: {
			type: String,
			enum: ['low', 'medium', 'high', 'critical'],
			required: true,
		},
		status: {
			type: String,
			enum: ['open', 'inProgress', 'resolved', 'closed'],
			required: true,
		},
		assignee: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		dueDate: {
			type: Date,
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		updatedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Issue', issueSchema);
