const mongoose = require("mongoose");
const Job = require("../models/job.model");
const Applicant = require("../models/applicant.model");
const Application = require("../models/application.model");
const Save = require("../models/savejob.model");

exports.apply = async (req, res, next) => {
	try {
		//console.log(req.body);
		//console.log(req.payload.id);
		const jobData = await Job.findById(req.params.jobId);
		if (!jobData) throw new Error("enter valid job id");

		const find = await Application.findOne({ jobId: req.params.jobId, applicantId: req.payload.id });

		if (!find) {
			console.log("inside if");
			console.log(find);
			const newApplication = new Application({
				jobId: req.params.jobId,
				applicantId: req.payload.id,
				recruiterId: jobData.recruiter,
				resume: req.body.resume,
			});
			await newApplication.save();
			res.status(201).send({ message: "inside if application created", subscribed: newApplication.status });
		} else {
			console.log("inside else");
			console.log(find);
			let query = {
				$and: [{ jobId: req.params.jobId }, { applicantId: req.payload.id }],
			};
			const cancellapplication = await Application.findOneAndDelete({ jobId: req.params.jobId, applicantId: req.payload.id });
			res.status(201).send({ message: "inside else application destroyed", status: "Apply" });
		}
	} catch (err) {
		next(err);
	}
};

exports.fetchApplied = async (req, res, next) => {
	try {
		//console.log(req.body);
		console.log(req.payload.id);

		const appliedJobs = await Application.find({ applicantId: req.payload.id });

		res.status(200).send(appliedJobs);
	} catch (err) {
		next(err);
	}
};

exports.save = async (req, res, next) => {
	try {
		//console.log(req.body);
		//console.log(req.payload.id);
		req.body.applicantId = req.payload.id;
		req.body.jobId = req.params.jobId;
		const SaveJob = new Save(req.body);
		const savejob = await SaveJob.save();
		res.status(200).send(savejob);
	} catch (err) {
		next(err);
	}
};
