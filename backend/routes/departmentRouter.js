const express = require('express');
const app = express();
const userModel = require('../models/user-model');
const router = express.Router();
const departmentModel = require('../models/department-model');
const isloggedin = require('../middlewares/isLoggedin');
const complaintModel = require('../models/complaint-model')


router.post('/create/:id', async (req, res) => {
    try {
        const {
            departmentName,
            departmentType,
            contactEmail,
            contactNumber,
            officeAddress,
            rating,
            totalReviews
        } = req.body;

        // 🏢 Create new department entry
        const department = await departmentModel.create({
            departmentName,
            departmentType,
            contactEmail,
            contactNumber,
            officeAddress: {
                buildingName: officeAddress?.buildingName,
                street: officeAddress?.street,
                areaOrVillage: officeAddress?.areaOrVillage,
                cityOrTown: officeAddress?.cityOrTown,
                taluka: officeAddress?.taluka,
                district: officeAddress?.district,
                state: officeAddress?.state || 'Maharashtra',
                pincode: officeAddress?.pincode
            },
            rating,
            totalReviews,
            totalComplaints: 0,
            resolvedComplaints: 0,
            pendingComplaints: 0,

            userId: req.params.id
        });

        // 🔗 Link department with a user (admin/official)
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.departmentId = department._id;
        await user.save();

        res.status(201).json({
            message: "Department created successfully",
            department: {
                _id: department._id,
                departmentName: department.departmentName,
                departmentType: department.departmentType,
                contactEmail: department.contactEmail,
                contactNumber: department.contactNumber,
                officeAddress: department.officeAddress,
                rating: department.rating,
                totalReviews: department.totalReviews,
                totalComplaints: department.totalComplaints,
                resolvedComplaints: department.resolvedComplaints,
                pendingComplaints: department.pendingComplaints
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/find-complaint-data/:id', async (req, res) => {
    try {
        const department = await departmentModel.findOne({ _id: req.params.id });
        if (department) {
            const complaints = await complaintModel
                .find({ _id: { $in: department.complaints } })
                // .populate("department") // replace with actual field name
                // .populate("department");

            const resolved_complaints = await complaintModel
                .find({ _id: { $in: department.complaints }, status : 'Resolved' })
            const total_complaints = department.complaints.length;
            const resolved = resolved_complaints.length;
            const pending_complaints = total_complaints - resolved
            const departmentName = department.departmentName
            const data = {
                total_complaints,
                resolved,
                pending_complaints,
                complaints,
                departmentName
            };

            res.status(200).json(data); // send structured data
        } else {
            res.status(404).json({ message: "department not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update complaint status
router.put('/update-complaint-status/:id', async (req, res) => {
    try {
        const { status } = req.body; // Get new status from request body
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // Find the complaint by ID
        const complaint = await complaintModel.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        // Update status
        complaint.status = status;
        await complaint.save();

        res.status(200).json({ message: "Status updated successfully", complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get('/find-all-departments', async (req, res) => {
  try {
    // ✅ Fetch all departments and populate related data
    const departments = await departmentModel
      .find()
      .populate({
        path: 'userId',
        select: 'firstName lastName email role', // Select useful fields only
      })
      .populate({
        path: 'complaints',
        select: 'complaintTitle department complaintType status priority description createdAt updatedAt',
      });

    // ✅ If no departments found
    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: 'No departments found' });
    }

    // ✅ Success response
    res.status(200).json({
      message: 'Departments fetched successfully',
      totalDepartments: departments.length,
      departments,
    });

  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      message: 'Server error while fetching departments',
      error: error.message,
    });
  }
});




module.exports = router;