const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema(
	{
		jobId: {
			type: Schema.Types.ObjectId,
			ref: "Job",
			required: true,
		},
		applicantId: {
			type: Schema.Types.ObjectId,
			ref: "Applicant",
			required: true,
		},
		recruiterId: {
			type: Schema.Types.ObjectId,
			ref: "Recruiter",
			required: true,
		},

		resume: {
			type: String,
			required: true,
		},
		cover_letter: {
			type: String,
		},
		status: {
			type: String,
			enum: ["Applied", "Confirmed", "Rejected"],
			default: "Applied",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Application", applicationSchema);
