import express from "express";
import {
  appointmentComplete,
  doctorAppointments,
  doctorList,
  loginDoctor,
  appointmentCancel,
  doctorDashboard,
  getProfile,
  updateProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.post("/appointments", authDoctor, doctorAppointments);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.post("/dashboard", authDoctor, doctorDashboard);
doctorRouter.post("/profile", authDoctor, getProfile);
doctorRouter.post("/update-profile", authDoctor, updateProfile);

export default doctorRouter;
