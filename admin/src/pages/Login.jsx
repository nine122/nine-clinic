import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmial] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(
          `${backendUrl}/api/admin/login-admin`,
          {
            email,
            password,
          }
        );
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary"> {state} </span>
          Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmial(e.target.value)}
            value={email}
            type="email"
            required
            className="border border-[#DADADA] rounded mt-1 p-2 w-full"
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
            className="border border-[#DADADA] rounded mt-1 p-2 w-full"
          />
        </div>
        <button className="bg-[#5F6FFF] text-white py-2 w-full rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-[#5F6FFF] underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-[#5F6FFF] underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
