const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
	{
		recruiter: {
			type: Schema.Types.ObjectId,
			ref: "Recruiter",
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		company: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		industry: {
			type: String,
			required: true,
		},
		classtype: {
			type: String,
			required: true,
			enum: ["Fulltime", "Parttime", "Remote"],
		},
		resume: {
			type: String,
		},
    image:{
			type: String,
    },
		address: {
			type: String,
			required: true,
		},
		function: {
			type: String,
			required: true,
		},
		skills: {
			type: [String],
			required: true,
		},
		activities: {
			type: String,
			required: true,
			enum: ["Hospital", "Technical", "Sport", "Cenimatics", "Cooking", "Performance", "Programming"],
		},
		vacancy: {
			type: Number,
			min: [1, "enter minimum vacancy 1"],
			max: [10, "enter max vacancy of 10"],
		},
		salary: {
			type: Number,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Job", jobSchema);
