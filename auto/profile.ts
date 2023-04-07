import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		avatar: {
			type: String,
		},
		bio: {
			type: String,
		},
		website: {
			type: String,
		},
		location: {
			type: String,
		},
		profileType: {
			type: String,
			required: true,
			enum: [
				'Developer',
				'Junior Developer',
				'Senior Developer',
				'Manager',
				'Student or Learning',
				'Instructor or Teacher',
				'Intern',
				'Other',
			],
		},
		skills: {
			type: [String],
		},
		githubUsername: {
			type: String,
		},
		experience: [
			{
				title: {
					type: String,
				},
				company: {
					type: String,
				},
				from: {
					type: Date,
				},
				to: {
					type: Date,
				},
				current: {
					type: Boolean,
				},
				description: {
					type: String,
				},
			},
		],
		education: [
			{
				school: {
					type: String,
				},
				degree: {
					type: String,
				},
				fieldofstudy: {
					type: String,
				},
				from: {
					type: Date,
				},
				to: {
					type: Date,
				},
				current: {
					type: Boolean,
				},
				description: {
					type: String,
				},
			},
		],
		social: {
			twitter: {
				type: String,
			},
			facebook: {
				type: String,
			},
			linkedin: {
				type: String,
			},
			instagram: {
				type: String,
			},
		},
		username: {
			type: String,
			unique: true,
			required: true,
		},
		// internal fields
		role: {
			type: String,
			default: 'user',
			required: true,
			enum: ['user', 'admin'],
			select: false,
		},
		status: {
			type: String,
			default: 'active',
			required: true,
			enum: ['active', 'inactive'],
			select: false,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Profile', profileSchema);
