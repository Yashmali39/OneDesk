import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

export default function Signin() {
  const { setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const watchRole = watch("role");

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://13.218.220.39:5000/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create user");
      }

      const user = result.user;

      // Save in context
      setIsLoggedIn(true);
      setUser(user);

      // Show success toast
      toast.success("User created successfully!", {
        onClose: () => {
          if (user.role === "citizen") {
            navigate(`/citizen-form/${user._id}`);
          } else if (user.role === "department") {
            navigate(`/department-form/${user._id}`);
          }
        },
        autoClose: 2000 // 2 seconds
        
      });
       reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center p-6 gap-8 shadow-md w-[550px] border border-slate-300 rounded-md bg-white"
      >
        <div className="text-3xl font-bold">Create Your Account</div>

        {/* First / Last Name */}
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <input
              className="p-2 w-full border border-slate-300 rounded-xl"
              placeholder="First Name"
              {...register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "Minimum length is 2" },
                maxLength: { value: 20, message: "Maximum length is 20" }
              })}
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="flex-1">
            <input
              className="p-2 w-full border border-slate-300 rounded-xl"
              placeholder="Last Name"
              {...register("lastName", {
                required: "Last name is required",
                minLength: { value: 2, message: "Minimum length is 2" },
                maxLength: { value: 20, message: "Maximum length is 20" }
              })}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="w-full">
          <input
            className="p-2 w-full border border-slate-300 rounded-xl"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="w-full">
          <input
            type="password"
            className="p-2 w-full border border-slate-300 rounded-xl"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 4, message: "Minimum length is 4" },
              maxLength: { value: 16, message: "Maximum length is 16" }
            })}
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Role Selection */}
        <div className="w-full">
          <label className="block mb-2 font-semibold">
            Are you a citizen or a department?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="citizen"
                {...register("role", { required: true })}
              />
              Citizen
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="department"
                {...register("role", { required: true })}
              />
              Department
            </label>
          </div>
          {errors.role && (
            <p className="text-red-600 text-sm">Please select one</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 w-full"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
