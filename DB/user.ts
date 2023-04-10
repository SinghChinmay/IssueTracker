/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';
import { hash } from '../util/hashing';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide a name'],
			validate: {
				validator: (value: string) => value.length > 2,
				message: 'Name must be longer than 2 characters',
			},
		},
		email: {
			type: String,
			required: [true, 'Please provide an email'],
			unique: true,
			validate: {
				validator: (value: string) => {
					const re = /\S+@\S+\.\S+/;
					return re.test(value);
				},
				message: 'Please provide a valid email',
			},
		},
		password: {
			type: String,
			required: [true, 'Please provide a strong password'],
			select: false,
			validate: {
				validator: (value: string) => {
					const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
					return re.test(value);
				},
				message:
					'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number, and no special characters',
			},
		},
		passwordHash: {
			type: String,
			select: false,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
			select: false,
		},
	},
	{
		timestamps: true,
	},
);

// pre save hook to hash password
// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
	this.passwordHash = hash(this.password);
	this.password = undefined as any;
	next();
});

// create middleware to delete data from response
userSchema.post('save', (doc, next) => {
	doc.passwordHash = undefined as any;
	doc.password = undefined as any;
	next();
});

export default mongoose.model('User', userSchema);
