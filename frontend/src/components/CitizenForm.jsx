import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function CitizenForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      gender: "",
      age: "",
      contactNumber: "",
      aadhaarNumber: "",
      houseNo: "",
      street: "",
      area: "",
      landmark: "",
      villageOrCity: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
      occupation: "",
      education: ""
    }
  });

  const nextStep = () => {
    const values = getValues();
    if (step === 1 && (!values.gender || !values.age)) {
      return alert("Fill all Step 1 fields");
    }
    if (step === 2 && (!values.contactNumber || !values.aadhaarNumber)) {
      return alert("Fill all Step 2 fields");
    }
    // Don't increment past step 3
    if (step < 3) setStep(prev => prev + 1);
  };


  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = async (data) => {
    if (!data.houseNo || !data.street || !data.villageOrCity) {
      return alert("Fill all Step 3 fields");
    }
    try {
      const payload = {
        profilePhoto: data.profilePhoto,
        gender: data.gender,
        age: data.age,
        contactNumber: data.contactNumber,
        aadhaarNumber: data.aadhaarNumber,
        address: {
          houseNo: data.houseNo,
          street: data.street,
          area: data.area,
          landmark: data.landmark,
          villageOrCity: data.villageOrCity,
          taluka: data.taluka,
          district: data.district,
          state: data.state,
          pincode: data.pincode
        },
        occupation: data.occupation,
        education: data.education,
        userId: id
      };

      const response = await fetch(`http://13.218.220.39:5000/citizen/create/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to create citizen profile");

      const result = await response.json();
      alert("Citizen profile created successfully!");
      reset();
      navigate(`/`);
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message);
    }
  };

  const stepTitles = [
    "Personal Info",
    "Contact & Aadhaar",
    "Address & Social Info"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f052c] via-[#1a0f45] to-[#2d1b69] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-lg p-10 w-full max-w-3xl border border-gray-200"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create Citizen Profile</h1>
          <p className="text-base text-gray-500 mt-1">{stepTitles[step - 1]}</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-6">
            <div
              className="bg-yellow-400 h-1.5 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-gray-400">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <>

            <select {...register("gender", { required: true })} className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">Gender is required</p>}

            <input
              {...register("age", { required: true })}
              placeholder="Age"
              type="number"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            {errors.age && <p className="text-red-500 text-sm">Age is required</p>}
          </>
        )}

        {step === 2 && (
          <>
            <input
              {...register("contactNumber", { required: true })}
              placeholder="Contact Number"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            {errors.contactNumber && <p className="text-red-500 text-sm">Contact number is required</p>}

            <input
              {...register("aadhaarNumber")}
              placeholder="Aadhaar Number"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
          </>
        )}

        {step === 3 && (
          <>
            <input
              {...register("houseNo")}
              placeholder="House No"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("street")}
              placeholder="Street"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("area")}
              placeholder="Area"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("landmark")}
              placeholder="Landmark"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("villageOrCity")}
              placeholder="Village / City"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("taluka")}
              placeholder="Taluka"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("district")}
              placeholder="District"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("state")}
              placeholder="State"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("pincode")}
              placeholder="Pincode"
              type="number"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />

            <input
              {...register("occupation")}
              placeholder="Occupation"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
            <input
              {...register("education")}
              placeholder="Education"
              className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
            />
          </>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 rounded-md">
              Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="px-6 py-2 bg-yellow-400 text-white rounded-md">
              Next
            </button>
          ) : (
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
