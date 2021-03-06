const express = require("express");
const app = express.Router();
const { verifyaccesstoken } = require("./../helpers/jwt.helpers");
const { upload } = require("./../helpers/multer");
const { configcloud, uploadtocloud } = require("./../helpers/cloudinary");
const Class = require("./../models/class.model");
const ClassApplication = require("./../models/classapplication.model");
const role = require("./../helpers/role");

app.get("/all", verifyaccesstoken, async (req, res, next) => {
	try {
		const allclasses = await Class.find();
		res.status(200).send({ classes: allclasses }).populate("classowner", ["email", "mobile"]);
	} catch (error) {
		next(error);
	}
});