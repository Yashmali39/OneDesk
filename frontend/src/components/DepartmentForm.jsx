import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartmentForm() {
    const { user } = useAuth();
    const { id } = useParams(); // userId from URL
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
        trigger
    } = useForm({
        mode: "onTouched",
        defaultValues: {
            departmentName: "",
            departmentType: "Other",
            contactNumber: "",
            buildingName: "",
            street: "",
            areaOrVillage: "",
            cityOrTown: "",
            taluka: "",
            district: "",
            state: "Maharashtra",
            pincode: ""
        }
    });

    const stepTitles = [
        "Department Info",
        "Contact & Address"
    ];

    const nextStep = async () => {
        let fields = [];
        if (step === 1) fields = ["departmentName", "departmentType", "contactNumber"];
        if (step === 2) fields = ["buildingName", "street", "cityOrTown"];

        const valid = await trigger(fields);
        if (!valid) return;
        if (step < 2) setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const onSubmit = async (data) => {
        try {
            const payload = {
                departmentName: data.departmentName,
                departmentType: data.departmentType,
                contactNumber: data.contactNumber,
                officeAddress: {
                    buildingName: data.buildingName,
                    street: data.street,
                    areaOrVillage: data.areaOrVillage,
                    cityOrTown: data.cityOrTown,
                    taluka: data.taluka,
                    district: data.district,
                    state: data.state,
                    pincode: data.pincode
                },
                userId: id
            };

            const response = await fetch(`http://13.218.220.39:5000/department/create/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || "Failed to create department profile");

            toast.success("Department profile created successfully!");

            // Wait before navigating so toast is visible
            setTimeout(() => {
                reset();
                navigate(`/`);
            }, 1500);

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f052c] via-[#1a0f45] to-[#2d1b69] px-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow-lg p-10 w-full max-w-3xl border border-gray-200"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Create Department Profile</h1>
                    <p className="text-base text-gray-500 mt-1">{stepTitles[step - 1]}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-6">
                        <div
                            className="bg-yellow-400 h-1.5 rounded-full"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>
                    <p className="mt-3 text-xs text-gray-400">Step {step} of 2</p>
                </div>

                {step === 1 && (
                    <>
                        <input
                            {...register("departmentName", { required: "Department name is required" })}
                            placeholder="Department Name"
                            className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
                        />
                        {errors.departmentName && <p className="text-red-500 text-sm">{errors.departmentName.message}</p>}

                        <select {...register("departmentType")} className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400">
                            <option value="Water Supply">Water Supply</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Roads">Roads</option>
                            <option value="Sanitation">Sanitation</option>
                            <option value="Waste Management">Waste Management</option>
                            <option value="Public Safety">Public Safety</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                        </select>

                        <input
                            {...register("contactNumber", { required: "Contact number is required" })}
                            placeholder="Contact Number"
                            className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
                        />
                        {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>}
                    </>
                )}

                {step === 2 && (
                    <>
                        <input
                            {...register("buildingName", { required: "Building name is required" })}
                            placeholder="Building Name"
                            className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
                        />
                        {errors.buildingName && <p className="text-red-500 text-sm">{errors.buildingName.message}</p>}

                        <input
                            {...register("street", { required: "Street is required" })}
                            placeholder="Street"
                            className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
                        />
                        {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}

                        <input
                            {...register("areaOrVillage")}
                            placeholder="Area / Village"
                            className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
                        />

                        <input
                            {...register("cityOrTown", { required: "City / Town is required" })}
                            placeholder="City / Town"
                            className="w-full p-3 mb-5 border rounded-md focus:outline-yellow-400"
                        />
                        {errors.cityOrTown && <p className="text-red-500 text-sm">{errors.cityOrTown.message}</p>}

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
                    </>
                )}

                <div className="flex justify-between mt-8">
                    {step > 1 && (
                        <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 rounded-md">
                            Back
                        </button>
                    )}
                    {step < 2 ? (
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
