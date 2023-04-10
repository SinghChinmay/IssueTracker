import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide a project name'],
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		members: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
				role: {
					type: String,
					enum: ['admin', 'project_manager', 'developer', 'viewer'],
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Project', projectSchema);
