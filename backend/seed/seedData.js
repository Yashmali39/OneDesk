// backend/seed/seedData.js
const mongoose = require("mongoose");
const faker = require("@faker-js/faker").faker;
const bcrypt = require("bcrypt");
const connectDB = require("../config/mongoose-connection");

const User = require("../models/user-model");
const Citizen = require("../models/citizen-model");
const Department = require("../models/department-model");
const Complaint = require("../models/complaint-model");

const SALT_ROUNDS = 10;
const PLAIN_PASSWORD = "123456"; // default password for all users
let credentials = [];

const departmentTypes = [
  "Water Supply",
  "Electricity",
  "Roads",
  "Sanitation",
  "Waste Management",
  "Public Safety",
  "Health",
  "Other"
];

const complaintTitles = [
  "Water leakage in main pipeline",
  "Frequent power cuts in locality",
  "Potholes on main road",
  "Garbage not collected for a week",
  "Street lights not working",
  "Public park maintenance required",
  "Health center shortage of staff",
  "Illegal dumping near river",
  "Traffic signal malfunction",
  "Sanitation workers strike"
];

const complaintDescriptions = [
  "There is a major leakage in the main water pipeline causing waterlogging in the streets.",
  "Our area faces daily power cuts affecting businesses and homes.",
  "The main road is full of potholes, causing accidents and vehicle damage.",
  "Garbage collection has not occurred for over a week leading to hygiene issues.",
  "Several street lights are not working causing darkness and safety concerns.",
  "The public park is poorly maintained with broken benches and overgrown grass.",
  "The local health center is understaffed leading to long waiting times for patients.",
  "Illegal dumping of waste is happening near the river affecting water quality.",
  "Traffic signal at the intersection is not functioning causing traffic jams.",
  "Sanitation workers have gone on strike causing accumulation of waste in the area."
];

// Helper to convert string zipcodes to numbers (simple 5-6 digit)
const fixZip = (zip) => {
  const num = parseInt(zip.replace(/\D/g, "").slice(0, 6));
  return isNaN(num) ? 400001 : num;
};

async function seed() {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Citizen.deleteMany({}),
      Department.deleteMany({}),
      Complaint.deleteMany({})
    ]);

    console.log("Creating citizen users...");
    const citizenUsersData = Array.from({ length: 50 }).map(() => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return {
        firstName,
        lastName,
        email: faker.internet.email(firstName, lastName).toLowerCase(),
        password: PLAIN_PASSWORD,
        role: "citizen"
      };
    });

    const citizenUsersToInsert = await Promise.all(
      citizenUsersData.map(async (u) => {
        const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
        return { ...u, password: hash };
      })
    );

    const citizenUsers = await User.insertMany(citizenUsersToInsert);

    // Save credentials for teacher
    citizenUsers.forEach((u, idx) => {
      credentials.push({ email: citizenUsersData[idx].email, password: PLAIN_PASSWORD, role: "citizen" });
    });

    console.log("Creating citizens...");
    const citizensData = citizenUsers.map(u => ({
      userId: u._id,
      age: faker.number.int({ min: 18, max: 70 }),
      gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
      contactNumber: faker.phone.number("##########"),
      address: {
        houseNo: faker.location.buildingNumber(),
        street: faker.location.street(),
        area: faker.location.city(),
        landmark: faker.location.street(),
        villageOrCity: faker.location.city(),
        taluka: faker.location.city(),
        district: faker.location.city(),
        state: "Maharashtra",
        pincode: fixZip(faker.location.zipCode())
      }
    }));

    const citizens = await Citizen.insertMany(citizensData);

    console.log("Creating department users...");
    const deptUsersData = departmentTypes.map((type) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return {
        firstName,
        lastName,
        email: faker.internet.email(firstName, lastName).toLowerCase(),
        password: PLAIN_PASSWORD,
        role: "department"
      };
    });

    const deptUsersToInsert = await Promise.all(
      deptUsersData.map(async (u) => {
        const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
        return { ...u, password: hash };
      })
    );

    const deptUsers = await User.insertMany(deptUsersToInsert);

    // Save credentials for teacher
    deptUsers.forEach((u, idx) => {
      credentials.push({ email: deptUsersData[idx].email, password: PLAIN_PASSWORD, role: "department" });
    });

    console.log("Creating departments...");
    const departmentsData = departmentTypes.map((type, i) => ({
      userId: deptUsers[i]._id,
      departmentName: `${type} Department`,
      departmentType: type,
      contactNumber: faker.phone.number("##########"),
      officeAddress: {
        buildingName: faker.company.name(),
        street: faker.location.street(),
        areaOrVillage: faker.location.city(),
        cityOrTown: faker.location.city(),
        taluka: faker.location.city(),
        district: faker.location.city(),
        state: "Maharashtra",
        pincode: fixZip(faker.location.zipCode())
      },
      rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
      totalReviews: faker.number.int({ min: 0, max: 100 })
    }));

    const departments = await Department.insertMany(departmentsData);

    console.log("Creating complaints...");
    const complaintsData = Array.from({ length: 100 }).map(() => {
      const randomCitizen = faker.helpers.arrayElement(citizens);
      const randomDepartment = faker.helpers.arrayElement(departments);
      const randomIndex = faker.number.int({ min: 0, max: complaintTitles.length - 1 });

      return {
        complaintTitle: complaintTitles[randomIndex],
        description: complaintDescriptions[randomIndex],
        complaintType: faker.helpers.arrayElement(["Water", "Electricity", "Roads", "Sanitation", "Health", "Other"]),
        department: randomDepartment.departmentName,
        citizenId: randomCitizen._id,
        departmentID: randomDepartment._id,
        status: faker.helpers.arrayElement(["Pending", "In Progress", "Resolved"]),
        address: randomCitizen.address
      };
    });

    const complaints = await Complaint.insertMany(complaintsData);

    console.log("Linking complaints to citizens and departments...");
    for (const complaint of complaints) {
      await Citizen.findByIdAndUpdate(complaint.citizenId, { $push: { complaints: complaint._id } });
      await Department.findByIdAndUpdate(complaint.departmentID, { $push: { complaints: complaint._id } });
    }

    console.log("✅ Seeding completed successfully!");
    console.log("Here are the dummy credentials for demonstration:");
    console.table(credentials);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
