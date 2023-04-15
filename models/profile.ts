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
			enum: [
				'Developer',
				'Junior Developer',
				'Senior Developer',
				'Manager',
				'Student',
				'Instructor',
				'Intern',
				'NA',
			],
			default: 'NA',
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
					required: [true, 'Title is required'],
				},
				company: {
					type: String,
					required: [true, 'Company is required'],
				},
				from: {
					type: Date,
					required: [true, 'Start date is required'],
				},
				to: {
					type: Date,
				},
				current: {
					type: Boolean,
					default: false,
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
					required: [true, 'School is required'],
				},
				degree: {
					type: String,
					required: [true, 'Degree is required'],
				},
				fieldofstudy: {
					type: String,
					required: [true, 'Field of study is required'],
				},
				from: {
					type: Date,
					required: [true, 'Start date is required'],
				},
				to: {
					type: Date,
				},
				current: {
					type: Boolean,
					default: false,
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
