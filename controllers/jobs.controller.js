// const mongoose = require("mongoose");
// const Job = require("../models/job.model");
// const Application = require("../models/application.model");
// const { doctocloud, uploadtocloud } = require("./../helpers/cloudinary");

// exports.post = async (req, res, next) => {
// 	try {
// 		//console.log(req.body);
// 		//console.log(req.payload.id);
// 		req.body.recruiter = req.payload.id;
// 		const job = new Job(req.body);
// 		const createnewjob = await job.save();

// 		res.status(200).send(job);
// 	} catch (err) {
// 		next(err);
// 	}
// };

// exports.get = async (req, res, next) => {
// 	try {
// 		const jobs = await Job.find();
// 		res.status(200).send(jobs);
// 	} catch (err) {
// 		next(err);
// 	}
// };

// exports.getbyCity = async (req, res, next) => {
// 	try {
// 		console.log(req.params.city);

// 		const jobs = await Job.find({ city: req.params.city });

// 		res.status(200).send(jobs);
// 	} catch (err) {
// 		next(err);
// 	}
// };

// exports.getOne = async (req, res, next) => {
// 	try {
// 		//	console.log(req.params.jobId);

// 		const job = await Job.findById(req.params.jobId);

// 		res.status(200).send(job);
// 	} catch (err) {
// 		next(err);
// 	}
// };

// exports.putOne = async (req, res, next) => {
// 	try {
// 		console.log(req.params.jobId);

// 		const jobId = req.params.jobId;
// 		const job = await Job.findById(jobId);
// 		if (!job) throw res.send(`No job associated with id: ${jobId}`);

// 		if (job) {
// 			job.name = req.body.name;
// 			job.title = req.body.title;
// 			job.address = req.body.address;
// 			job.company = req.body.company;
// 			job.industry = req.body.industry;
// 			job.type = req.body.type;
// 			job.function = req.body.function;
// 			job.city = req.body.city;
// 			job.description = req.body.description;

// 			const updatedJob = await job.save();
// 		}
// 		res.status(200).send(job);
// 	} catch (err) {
// 		next(err);
// 	}
// };

// exports.deleteOne = async (req, res, next) => {
// 	try {
// 		//	console.log(req.params.jobId);

// 		const deleteJob = await Job.findByIdAndDelete(req.params.jobId);

// 		res.status(200).send(`Job with id: ${req.params.jobId} is deleted`);
// 	} catch (err) {
// 		next(err);
// 	}
// };

// exports.byActivaty = async (req, res, next) => {
// 	try {
// 		const getbyActivity = await Job.find({ activities: req.params.name }).populate("recruiter", ["email", "mobile"]);
// 		res.status(200).send({ getbyactivity });
// 	} catch (error) {
// 		next(error);
// 	}
// };

// exports.list = async (req, res, next) => {
// 	try {
// 		const query = {
// 			$and: [{ recruiterId: req.payload.id }, { status: "Applied" }],
// 		};
// 		const application = await Application.find(query).populate("applicantId").populate("jobId");

// 		res.status(200).send({ application: application, count: application.length });
// 	} catch (error) {
// 		next(error);
// 	}
// };
// exports.accepted = async (req, res, next) => {
// 	try {
// 		const query = {
// 			$and: [{ recruiterId: req.payload.id }, { status: "Confirmed" }],
// 		};
// 		const application = await Application.find(query).populate("applicantId").populate("jobId");

// 		res.status(200).send({ application: application, count: application.length });
// 	} catch (error) {
// 		next(error);
// 	}
// };
// exports.rejected = async (req, res, next) => {
// 	try {
// 		const query = {
// 			$and: [{ recruiterId: req.payload.id }, { status: "Rejected" }],
// 		};
// 		const application = await Application.find(query).populate("applicantId").populate("jobId");

// 		res.status(200).send({ application: application, count: application.length });
// 	} catch (error) {
// 		next(error);
// 	}
// };

// exports.image = async (req, res, next) => {
// 	try {
// 		const job = await Job.findById(req.params.jobId);
// 		if (!job) throw new Error("enter valid job id");
// 		if (!req.file) throw new Error("enter image");

// 		const path = req.file.path;
// 		const resulturl = await uploadtocloud(path);
// 		//  req.body.image = resulturl.url;
// 		job.image = resulturl.url;

// 		const job1 = await job.save();
// 		res.status(201).send({ job: job1 });
// 	} catch (error) {
// 		next(error);
// 	}
// };

// exports.myfile = async (req, res, next) => {
// 	try {
// 		const job = await Job.findById(req.params.jobId);
// 		if (!job) throw new Error("enter valid class id");
// 		if (!req.file) throw new Error("Upolad file");

// 		const path = req.file.path;
// 		const resulturl = await doctocloud(path);
// 		//  req.body.image = resulturl.url;
// 		job.resume = resulturl.url;

// 		const job1 = await job.save();
// 		res.status(201).send({ job: job1 });
// 	} catch (error) {
// 		next(error);
// 	}
// };

// exports.jobHomepage = async (req, res, next) => {
// 	try {
// 		const Hospital = await Job.find({ activities: "Hospital" }).count();
// 		const Technical = await Job.find({ activities: "Technical" }).count();
// 		const Sport = await Job.find({ activities: "Sport" }).count();
// 		const Cenimatics = await Job.find({ activities: "Cenimatics" }).count();
// 		const Cooking = await Job.find({ activities: "Cooking" }).count();
// 		const Performance = await Job.find({ activities: "Performance" }).count();
// 		const Programming = await Job.find({ activities: "Hospital" }).count();

// 		res.status(200).send({
// 			Hospital,
// 			Technical,
// 			Sport,
// 			Cenimatics,
// 			Cooking,
// 			Performance,
// 			Programming,
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };
