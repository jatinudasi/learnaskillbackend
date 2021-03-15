const express = require("express");
const app = express.Router();
const { verifyaccesstoken } = require("./../helpers/jwt.helpers");
const { upload } = require("./../helpers/multer");
const { configcloud, uploadtocloud } = require("./../helpers/cloudinary");
const Class = require("./../models/class.model");
const ClassApplication = require("./../models/classapplication.model");
const role = require("./../helpers/role");
//all the classes

app.get("/all", verifyaccesstoken, async (req, res, next) => {
  try {
    const allclasses = await Class.find().populate("classowner", [
      "email",
      "mobile",
    ]);
    res.status(200).send({ classes: allclasses });
  } catch (error) {
    next(error);
  }
});
//apply route
app.post(
  "/apply/:classid",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Applicant),
  async (req, res, next) => {
    try {
      let clas = await Class.findById(req.params.classid);
      if (!clas) throw new Error("enter valid class id");

      // const query ={$and:[{classid:req.params.classid },{ applicantid:req.payload.id}]}
      // const find = await ClassApplication.find($and[({ classid: req.params.classid }, { applicantid: req.payload.id })]);
      // const find = await ClassApplication.find(query);

      const find = await ClassApplication.findOne({
        classid: req.params.classid,
        applicantid: req.payload.id,
      });
      // console.log("find---",find)
      // if (!find) {
      // 	console.log("inside if");

      // let query = {
      // 	$and:[{ classid: req.params.id }, { applicantid: req.payload.id }],
      // };

      // const find = await ClassApplication.findOne(query);
      if (!find) {
        console.log("inside if");
        console.log(find);
        const newapplication = new ClassApplication({
          classid: req.params.classid,
          applicantid: req.payload.id,
          recruiterid: clas.classowner,
        });
        await newapplication.save();
        res.status(201).send({
          message: "inside if application created",
          subscribed: newapplication.status,
        });
      } else {
        console.log("inside else");
        console.log(find);
        let query = {
          $and: [{ classid: req.params.id }, { applicantid: req.payload.id }],
        };
        const cancellapplication = await ClassApplication.findOneAndDelete({
          classid: req.params.classid,
          applicantid: req.payload.id,
        });
        //  const cancellapplication = await ClassApplication.findOneAndDelete(query);
        res.status(201).send({
          message: "inside else application destroyed",
          status: "Apply",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);
// app.post(
//   "/apply/:classid",
//   verifyaccesstoken,
//   role.checkRole(role.ROLES.Applicant),
//   async (req, res, next) => {
//     try {
//       let clas = await Class.findById(req.params.classid);
//       if (!clas) throw new Error("enter valid class id");

//       // const query ={$and:[{classid:req.params.classid },{ applicantid:req.payload.id}]}
//       // const find = await ClassApplication.find($and[({ classid: req.params.classid }, { applicantid: req.payload.id })]);
//       // const find = await ClassApplication.find(query);

//       const find = await ClassApplication.findOne({
//         classid: req.params.classid,
//         applicantid: req.payload.id,
//       });
//       // console.log("find---",find)
//       // if (!find) {
//       // 	console.log("inside if");

//       // let query = {
//       // 	$and:[{ classid: req.params.id }, { applicantid: req.payload.id }],
//       // };

//       // const find = await ClassApplication.findOne(query);
//       if (!find) {
//         console.log("inside if");
//         console.log(find);
//         const newapplication = new ClassApplication({
//           classid: req.params.classid,
//           applicantid: req.payload.id,
//           recruiterid: clas.classowner,
//         });
//         await newapplication.save();
//         res.status(201).send({
//           message: "inside if application created",
//           subscribed: newapplication.status,
//         });
//       } else {
//         console.log("inside else");
//         console.log(find);
//         let query = {
//           $and: [{ classid: req.params.id }, { applicantid: req.payload.id }],
//         };
//         const cancellapplication = await ClassApplication.findOneAndDelete({
//           classid: req.params.classid,
//           applicantid: req.payload.id,
//         });
//         //  const cancellapplication = await ClassApplication.findOneAndDelete(query);
//         res.status(201).send({
//           message: "inside else application destroyed",
//           status: "Apply",
//         });
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// );

//get all programming class
app.get("/category/:name", async (req, res, next) => {
  try {
    const getbyactivity = await Class.find({
      activities: req.params.name,
    }).populate("classowner", ["email", "mobile"]);
    res.status(200).send({ getbyactivity });
  } catch (error) {
    next(error);
  }
});
//getting a specific class
app.get("/:id", verifyaccesstoken, async (req, res, next) => {
  try {
    const specificclass = await Class.findById(
      req.params.id
    ).populate("classowner", ["email", "mobile"]);
    if (!specificclass) res.status(400).send("enter valid id");
    let query = {
      $and: [{ classid: req.params.id }, { applicantid: req.payload.id }],
    };
    // let query ={$and:[{price:{$gte:lowervalue}},{price:{$lte:uppervalue}}]}

    const subscribed = await ClassApplication.findOne(query);

    if (!subscribed)
      res.status(200).send({ class: specificclass, subscribed: "Apply" });
    else
      res
        .status(200)
        .send({ class: specificclass, subscribed: subscribed.status });
  } catch (error) {
    next(error);
  }
});
//getting all the class that the recruiter has made
app.get("/my", verifyaccesstoken, async (req, res, next) => {
  try {
    const myclasses = await Class.find({ classowner: req.payload.id });
    res.status(200).send({ my: myclasses });
  } catch (error) {
    next(error);
  }
});

// creating a class
// app.post('/',verifyaccesstoken,upload.single('image'),configcloud,async(req,res,next)=>{

app.post(
  "/",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  async (req, res, next) => {
    try {
      console.log(req.body);
      const {
        classname,
        category,
        address,
        city,
        fees,
        duration,
        vacancy,
        firstname,
        lastname,
        activities,
        classtype,
      } = req.body;
      console.log(req.payload);
      req.body.classowner = req.payload.id;
      console.log("---------", req.body);
      if (
        !classname ||
        !category ||
        !address ||
        !city ||
        !fees ||
        !duration ||
        !vacancy ||
        !firstname ||
        !lastname ||
        !activities ||
        !classtype
      )
        throw new Error("enter all the details");

      // const path = req.file.path
      // const resulturl = await uploadtocloud(path);
      // req.body.image = resulturl.url;

      const clas = new Class(req.body);
      await clas.save();
      //console.log(req.body)
      // req.body.image = resulturl.url;
      res.status(201).send({ clas: clas });
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/:classid/image",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  upload.single("image"),
  configcloud,
  async (req, res, next) => {
    try {
      const clas = await Class.findById(req.params.classid);
      // let clas2 = await Class.find({ _id: req.params.classid });
      // console.log(`----------------------------------------------------------${clas}`);
      // console.log(`----------------------------------------------------------${clas2}`);
      if (!clas) throw new Error("enter valid class id");
      if (!req.file) throw new Error("enter image");

      const path = req.file.path;
      const resulturl = await uploadtocloud(path);
      //  req.body.image = resulturl.url;
      clas.image = resulturl.url;

      const clas1 = await clas.save();
      res.status(201).send({ class: clas1 });
    } catch (error) {
      next(error);
    }
  }
);

//deleting a class by id
app.delete(
  "/:id",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  async (req, res, next) => {
    try {
      const classapplication = await ClassApplication.deleteMany({
        classid: req.params.id,
      });
      const del = await Class.findByIdAndDelete(req.params.id);
      console.log(
        "class applications delted due to class deletion",
        classapplication
      );
      res.send(del);
    } catch (error) {
      next(error);
    }
  }
);

//route to get all the student list who had applied

app.get(
  "/student/list",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  async (req, res, next) => {
    try {
      const query = {
        $and: [{ recruiterid: req.payload.id }, { status: "Applied" }],
      };
      const application = await ClassApplication.find(query)
        .populate("applicantid")
        .populate("classid");

      res
        .status(200)
        .send({ application: application, count: application.length });
    } catch (error) {
      next(error);
    }
  }
);
app.get(
  "/student/list/accepted",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  async (req, res, next) => {
    try {
      const query = {
        $and: [{ recruiterid: req.payload.id }, { status: "Confirmed" }],
      };
      const application = await ClassApplication.find(query)
        .populate("applicantid")
        .populate("classid");

      res
        .status(200)
        .send({ application: application, count: application.length });
    } catch (error) {
      next(error);
    }
  }
);
app.get(
  "/student/list/rejected",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  async (req, res, next) => {
    try {
      const query = {
        $and: [{ recruiterid: req.payload.id }, { status: "Rejected" }],
      };
      const application = await ClassApplication.find(query)
        .populate("applicantid")
        .populate("classid");

      res
        .status(200)
        .send({ application: application, count: application.length });
    } catch (error) {
      next(error);
    }
  }
);
// to accept student request to join the class
app.get(
  "/accepted/:applicationid",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  async (req, res, next) => {
    try {
      const findid = await ClassApplication.findByIdAndUpdate(
        req.params.applicationid,
        { status: "Confirmed" }
      );
      console.log("find id", findid);
      if (!findid) throw new Error("enter valid application id");
      res.status(200).send({ id: findid });
    } catch (error) {
      next(error);
    }
  }
);
//to reject request of student to join the class
app.get(
  "/rejected/:applicationid",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  async (req, res, next) => {
    try {
      const findbyid = await ClassApplication.findById(
        req.params.applicationid
      );
      if (!findbyid) throw new Error("enter valid application id");
      const findid = await ClassApplication.findByIdAndUpdate(
        req.params.applicationid,
        { status: "Rejected" }
      );
      console.log("find id", findid);
      res.status(200).send({ id: findid });
    } catch (error) {
      next(error);
    }
  }
);
//filter by city

app.get("/category/filter/:name", async (req, res, next) => {
  try {
    // let type = req.query.classtype;
    // let city = req.query.city;

    // classtype = type.split(",");
    // cities = city.split(",");
    // console.log(classtype);
    // console.log(cities);

    // let citiesarr = [];
    // let classtypearr =[];

    // for (let i = 0; i < cities.length; i++) {
    // 	citiesarr.push({city:cities[i]});
    // }

    // for (let i = 0; i < classtype.length; i++) {
    // 	classtypearr.push({classtype:classtype[i]});
    // }

    // console.log("cities",citiesarr);
    // console.log("classtype",classtypearr)

    // console.log(arr);

    // let query = {$or: [...arr]}

    //  let query ={$and:[{ activities:req.params.name},{$or:[{city:"Mumbai"},{city:"Pune"}]}]}
    // const mycity =[];
    // for(let i=0;i<req.query.citiesarr.length;i++){
    // 	mycity.push({city:req.query.citiesarr[i]});
    // }
    // console.log(mycity)

    // const classtypesjatin =[];
    // for(let i=0;i<req.query.classtypearr.length;i++){
    // 	classtypesjatin.push({classtype:req.query.classtypearr[i]});
    // }
    // console.log(classtypesjatin)

    // if(req.query.citiesarr&&req.query.classtypearr)
    // {
    // console.log("both array given",req.query.citiesarr,req.query.classtypearr)
    //  query ={$and:[{ activities:req.params.name},{$or:[...req.query.citiesarr]},{$or:[...req.query.classtypearr]}]}
    // }
    // else if(req.query.citiesarr){
    // 	console.log("cities array given",req.query.citiesarr);
    // 	query ={$and:[{ activities:req.params.name},{$or:[...req.query.citiesarr]}]}
    // }else if(req.query.classtypearr){
    // 	console.log("classtype array given",req.query.classtypearr);
    // 	query ={$and:[{ activities:req.params.name},{$or:[...req.query.classtypearr]}]}
    // }
    // else{
    // 	res.status(500).send("enter proper details")
    // }

    if (req.query.citiesarr && req.query.classtypearr) {
      const mycity = [];
      for (let i = 0; i < req.query.citiesarr.length; i++) {
        mycity.push({ city: req.query.citiesarr[i] });
      }
      console.log(mycity);
      const classtypesjatin = [];
      for (let i = 0; i < req.query.classtypearr.length; i++) {
        classtypesjatin.push({ classtype: req.query.classtypearr[i] });
      }
      console.log(classtypesjatin);
      console.log(
        "both array given",
        req.query.citiesarr,
        req.query.classtypearr
      );
      query = {
        $and: [
          { activities: req.params.name },
          { $or: [...mycity] },
          { $or: [...classtypesjatin] },
        ],
      };
    } else if (req.query.citiesarr) {
      const mycity = [];
      for (let i = 0; i < req.query.citiesarr.length; i++) {
        mycity.push({ city: req.query.citiesarr[i] });
      }
      console.log(mycity);
      console.log("cities array given", req.query.citiesarr);
      query = { $and: [{ activities: req.params.name }, { $or: [...mycity] }] };
    } else if (req.query.classtypearr) {
      const classtypesjatin = [];
      for (let i = 0; i < req.query.classtypearr.length; i++) {
        classtypesjatin.push({ classtype: req.query.classtypearr[i] });
      }
      console.log(classtypesjatin);
      console.log("classtype array given", req.query.classtypearr);
      query = {
        $and: [{ activities: req.params.name }, { $or: [...classtypesjatin] }],
      };
    } else {
      res.status(500).send("enter proper details");
    }

    //  query ={$and:[{ activities:req.params.name},{$or:[...citiesarr]},{$or:[...classtypearr]}]}
    console.log("query", query);
    const filter = await Class.find(query);
    console.log(filter);

    res.status(200).send({ classtype: filter });
  } catch (error) {
    next(error);
  }
});
//for city purporse
app.get("/city/:city", async (req, res, next) => {
  try {
    console.log("inside city");
    const bycity = await Class.find({
      city: req.params.city,
    });
    res.status(200).send({ city: bycity });
  } catch (error) {
    next(error);
  }
});

app.get(
  "/classdashboard",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Recruiter),
  async (req, res, next) => {
    try {
      console.log(req.payload);
      const pending = await ClassApplication.find({
        recruiterid: req.payload.id,
        status: "Applied",
      }).count();
      const accepted = await ClassApplication.find({
        recruiterid: req.payload.id,
        status: "Confirmed",
      }).count();
      const rejected = await ClassApplication.find({
        recruiterid: req.paypayload.id,
        status: "Rejected",
      }).count();
      res
        .status(200)
        .send({ pending: pending, accepted: accepted, rejected: rejected });
    } catch (error) {
      next(error);
    }
  }
);

//for class applicant to know class list
app.get(
  "/my/subscribed/classes",
  verifyaccesstoken,
  role.checkRole(role.ROLES.Applicant),
  async (req, res, next) => {
    const query = { applicantid: req.payload.id };

    const myclasses = await Classapplication.find(query)
      .populate("classid")
      .populate("recruiterid");

    res.status(200).send({ myclasses: myclasses });
  }
);

//trying pagination
app.get("/category/pagination/:name/:limit/:page", async (req, res, next) => {
  try {
    let { page, limit, name } = req.params;
    page = Number(page);
    limit = Number(limit);
    const total = await Class.find({ activities: name }).count();
    const getbyactivity = await Class.find({ activities: name })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("classowner", ["email", "mobile"]);
    res.status(200).send({ getbyactivity, total: total });
  } catch (error) {
    next(error);
  }
});

app.get("/category/filter/:name/:limit/:page", async (req, res, next) => {
  try {
    // let type = req.query.classtype;
    // let city = req.query.city;

    // classtype = type.split(",");
    // cities = city.split(",");
    // console.log(classtype);
    // console.log(cities);

    // let citiesarr = [];
    // let classtypearr =[];

    // for (let i = 0; i < cities.length; i++) {
    // 	citiesarr.push({city:cities[i]});
    // }

    // for (let i = 0; i < classtype.length; i++) {
    // 	classtypearr.push({classtype:classtype[i]});
    // }

    // console.log("cities",citiesarr);
    // console.log("classtype",classtypearr)

    // console.log(arr);

    // let query = {$or: [...arr]}

    //  let query ={$and:[{ activities:req.params.name},{$or:[{city:"Mumbai"},{city:"Pune"}]}]}
    // const mycity =[];
    // for(let i=0;i<req.query.citiesarr.length;i++){
    // 	mycity.push({city:req.query.citiesarr[i]});
    // }
    // console.log(mycity)

    // const classtypesjatin =[];
    // for(let i=0;i<req.query.classtypearr.length;i++){
    // 	classtypesjatin.push({classtype:req.query.classtypearr[i]});
    // }
    // console.log(classtypesjatin)

    // if(req.query.citiesarr&&req.query.classtypearr)
    // {
    // console.log("both array given",req.query.citiesarr,req.query.classtypearr)
    //  query ={$and:[{ activities:req.params.name},{$or:[...req.query.citiesarr]},{$or:[...req.query.classtypearr]}]}
    // }
    // else if(req.query.citiesarr){
    // 	console.log("cities array given",req.query.citiesarr);
    // 	query ={$and:[{ activities:req.params.name},{$or:[...req.query.citiesarr]}]}
    // }else if(req.query.classtypearr){
    // 	console.log("classtype array given",req.query.classtypearr);
    // 	query ={$and:[{ activities:req.params.name},{$or:[...req.query.classtypearr]}]}
    // }
    // else{
    // 	res.status(500).send("enter proper details")
    // }

    let { page, limit } = req.params;
    page = Number(page);
    limit = Number(limit);

    if (req.query.citiesarr.length && req.query.classtypearr.length) {
      const mycity = [];
      for (let i = 0; i < req.query.citiesarr.length; i++) {
        mycity.push({ city: req.query.citiesarr[i] });
      }
      console.log(mycity);
      const classtypesjatin = [];
      for (let i = 0; i < req.query.classtypearr.length; i++) {
        classtypesjatin.push({ classtype: req.query.classtypearr[i] });
      }
      console.log(classtypesjatin);
      console.log(
        "both array given",
        req.query.citiesarr,
        req.query.classtypearr
      );
      query = {
        $and: [
          { activities: req.params.name },
          { $or: [...mycity] },
          { $or: [...classtypesjatin] },
        ],
      };
    } else if (req.query.citiesarr.length) {
      const mycity = [];
      for (let i = 0; i < req.query.citiesarr.length; i++) {
        mycity.push({ city: req.query.citiesarr[i] });
      }
      console.log(mycity);
      console.log("cities array given", req.query.citiesarr);
      query = { $and: [{ activities: req.params.name }, { $or: [...mycity] }] };
    } else if (req.query.classtypearr.length) {
      const classtypesjatin = [];
      for (let i = 0; i < req.query.classtypearr.length; i++) {
        classtypesjatin.push({ classtype: req.query.classtypearr[i] });
      }
      console.log(classtypesjatin);
      console.log("classtype array given", req.query.classtypearr);
      query = {
        $and: [{ activities: req.params.name }, { $or: [...classtypesjatin] }],
      };
    } else {
      res.status(500).send("enter proper details");
    }

    //  query ={$and:[{ activities:req.params.name},{$or:[...citiesarr]},{$or:[...classtypearr]}]}
    console.log("query", query);
    const total = await Class.find(query).count();
    const filter = await Class.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    console.log(filter);

    res.status(200).send({ classtype: filter, total: total });
  } catch (error) {
    next(error);
  }
});

app.get("/home/homepage", async (req, res, next) => {
  try {
    const Hospital = await Class.find({ activities: "Hospital" }).count();
    const Technical = await Class.find({ activities: "Technical" }).count();
    const Sport = await Class.find({ activities: "Sport" }).count();
    const Cenimatics = await Class.find({ activities: "Cenimatics" }).count();
    const Cooking = await Class.find({ activities: "Cooking" }).count();
    const Performance = await Class.find({ activities: "Performance" }).count();
    const Programming = await Class.find({ activities: "Hospital" }).count();

    res.status(200).send({
      Hospital,
      Technical,
      Sport,
      Cenimatics,
      Cooking,
      Performance,
      Programming,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = app;
