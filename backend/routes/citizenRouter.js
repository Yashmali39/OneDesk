const express = require('express');
const app = express();
const userModel = require('../models/user-model');
const router = express.Router();
const citizenModel = require('../models/citizen-model');
const complaintModel = require('../models/complaint-model');
const departmentModel = require('../models/department-model')
const isloggedin = require('../middlewares/isLoggedin');
const upload = require("../utils/s3Upload");


router.post('/create/:id', async (req, res) => {
    try {
        const {
            profilePhoto,
            fullName,
            gender,
            age,
            contactNumber,
            email,
            aadhaarNumber,
            address,
            occupation,
            education
        } = req.body;

        // Create citizen entry
        const citizen = await citizenModel.create({
            profilePhoto,
            fullName,
            gender,
            age,
            contactNumber,
            email,
            aadhaarNumber,
            address: {
                houseNo: address.houseNo,
                street: address.street,
                area: address.area,
                landmark: address.landmark,
                villageOrCity: address.villageOrCity,
                taluka: address.taluka,
                district: address.district,
                state: address.state,
                pincode: address.pincode
            },
            occupation,
            education,
            userId: req.params.id
        });

        // Link citizen with the user
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.citizenId = citizen._id;
        await user.save();

        res.status(201).json({
            message: "Citizen profile created successfully",
            citizen: {
                _id: citizen._id,
                fullName: citizen.fullName,
                gender: citizen.gender,
                age: citizen.age,
                contactNumber: citizen.contactNumber,
                email: citizen.email,
                aadhaarNumber: citizen.aadhaarNumber,
                address: citizen.address,
                occupation: citizen.occupation,
                education: citizen.education,
                userId: citizen.userId,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/find-complaint-data/:id', async (req, res) => {
    try {
        const citizen = await citizenModel.findOne({ _id: req.params.id });
        if (citizen) {
            const complaints = await complaintModel
                .find({ _id: { $in: citizen.complaints } })
                // .populate("department") // replace with actual field name
                // .populate("citizen");


            const total_complaints = citizen.complaints.length;
            const resolve_complaints = citizen.resolvedComplaints.length;
            const pending_complaints = total_complaints - resolve_complaints;

            const data = {
                total_complaints,
                resolve_complaints,
                pending_complaints,
                complaints
            };

            res.status(200).json(data); // send structured data
        } else {
            res.status(404).json({ message: "Citizen not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const upload = require("../utils/s3Upload");

router.post(
  "/send-complaint/:id",
  upload.array("images", 5),   // ✅ S3 upload middleware
  async (req, res) => {
    try {
      const citizenId = req.params.id;
      const body = req.body || {};

      // Destructure fields
      const {
        complaintTitle,
        department,
        complaintType,
        description,
      } = body;

      // Address handling
      const addressFromBody = body.address || {};
      const {
        houseNumber,
        street,
        areaOrVillage,
        cityOrTown,
        taluka,
        district,
        state,
        pincode,
        landmark
      } = addressFromBody;

      const address = {
        houseNumber: houseNumber ?? body["address.houseNumber"] ?? body.houseNumber ?? "",
        street: street ?? body["address.street"] ?? body.street ?? "",
        areaOrVillage: areaOrVillage ?? body["address.areaOrVillage"] ?? body.areaOrVillage ?? "",
        cityOrTown: cityOrTown ?? body["address.cityOrTown"] ?? body.cityOrTown ?? "",
        taluka: taluka ?? body["address.taluka"] ?? body.taluka ?? "",
        district: district ?? body["address.district"] ?? body.district ?? "",
        state: state ?? body["address.state"] ?? body.state ?? "Maharashtra",
        pincode: pincode ?? body["address.pincode"] ?? body.pincode ?? "",
        landmark: landmark ?? body["address.landmark"] ?? body.landmark ?? ""
      };

      // ✅ 1) Check citizen
      const citizen = await citizenModel.findById(citizenId);
      if (!citizen) {
        return res.status(404).json({ message: "Citizen not found" });
      }

      // ✅ 2) Find department
      const dept = await departmentModel.findOne({
        $or: [
          { departmentName: department },
          { departmentType: department }
        ]
      });

      if (!dept) {
        return res.status(404).json({ message: "Department not found" });
      }

      // ✅ 3) Validate required fields
      if (!complaintTitle || !description || !complaintType) {
        return res.status(400).json({
          message: "Missing required fields: complaintTitle, complaintType, description"
        });
      }

      // 🔥 ✅ 4) GET S3 IMAGE URLs
      const imageUrls = req.files?.map(file => file.location) || [];

      // ✅ 5) Create complaint
      const complaint = new complaintModel({
        complaintTitle: complaintTitle.trim(),
        department,
        complaintType,
        description: description.trim(),
        address,
        images: imageUrls,   // 🔥 S3 URLs stored here

        citizenId: citizen._id,
        departmentID: dept._id
      });

      const savedComplaint = await complaint.save();

      // ✅ 6) Update citizen
      if (!Array.isArray(citizen.complaints)) citizen.complaints = [];
      citizen.complaints.push(savedComplaint._id);
      await citizen.save();

      // ✅ 7) Update department
      if (!Array.isArray(dept.complaints)) dept.complaints = [];
      dept.complaints.push(savedComplaint._id);
      await dept.save();

      // ✅ RESPONSE
      return res.status(201).json({
        message: "Complaint submitted successfully",
        complaint: savedComplaint,
      });

    } catch (err) {
      console.error("Error submitting complaint:", err);
      return res.status(500).json({
        message: "Server error while submitting complaint",
        error: err.message,
      });
    }
  }
);


module.exports = router;