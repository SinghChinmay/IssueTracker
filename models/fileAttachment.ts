import mongoose from 'mongoose';

const fileAttachmentSchema = new mongoose.Schema(
	{
		issue: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Issue',
			required: true,
		},
		uploader: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		fileName: {
			type: String,
			required: true,
		},
		fileURL: {
			type: String,
			required: true,
		},
		fileType: {
			type: String,
			required: true,
		},
		fileSize: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('FileAttachment', fileAttachmentSchema);
