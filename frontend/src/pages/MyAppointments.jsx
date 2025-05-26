import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  X,
  DollarSign,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const paymentHandler = async (appointmentId) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-checkout-session`,
    { appointmentId }
  );

  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId: data.sessionId });
};

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all"); // all, upcoming, completed, cancelled

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[dateArray[1]] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getFilteredAppointments = () => {
    switch (filter) {
      case "upcoming":
        return appointments.filter(
          (app) =>
            !app.isCompleted &&
            !app.cancelled_by_user &&
            !app.cancelled_by_doctor &&
            !app.cancelled_by_admin
        );
      case "completed":
        return appointments.filter((app) => app.isCompleted);
      case "cancelled":
        return appointments.filter(
          (app) =>
            app.cancelled_by_user ||
            app.cancelled_by_doctor ||
            app.cancelled_by_admin
        );
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const getAppointmentStatus = (appointment) => {
    if (appointment.isCompleted) {
      return {
        text: "Completed",
        icon: <CheckCircle className="w-4 h-4" />,
        color: "text-green-500 bg-green-50",
      };
    } else if (appointment.cancelled_by_doctor) {
      return {
        text: "Cancelled by Doctor",
        icon: <X className="w-4 h-4" />,
        color: "text-red-600 bg-red-50",
      };
    } else if (appointment.cancelled_by_admin) {
      return {
        text: "Cancelled by Admin",
        icon: <AlertCircle className="w-4 h-4" />,
        color: "text-orange-600 bg-orange-50",
      };
    } else if (appointment.cancelled_by_user) {
      return {
        text: "Cancellation Completed",
        icon: <X className="w-4 h-4" />,
        color: "text-red-600 bg-gray-50",
      };
    } else if (appointment.payment) {
      return {
        text: "Confirmed",
        icon: <CheckCircle className="w-4 h-4" />,
        color: "text-blue-600 bg-blue-50",
      };
    } else {
      return {
        text: "Payment Pending",
        icon: <DollarSign className="w-4 h-4" />,
        color: "text-yellow-600 bg-yellow-50",
      };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-12">
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>

        <div className="flex space-x-2 mt-4 sm:mt-0 overflow-x-auto pb-2 w-full sm:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
              filter === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
              filter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${
              filter === "cancelled"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-gray-50">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No appointments found
          </p>
          <p className="text-gray-500 mt-2">
            You don't have any {filter !== "all" ? filter : ""} appointments
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => {
            const status = getAppointmentStatus(appointment);

            return (
              <div
                key={index}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4">
                  {/* Doctor Image Section */}
                  <div className="relative overflow-hidden bg-gray-50">
                    <img
                      src={appointment.docData.image}
                      alt={appointment.docData.name}
                      className="w-full h-48 md:h-full object-cover object-center"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.icon}
                        <span className="ml-1">{status.text}</span>
                      </span>
                    </div>
                  </div>

                  {/* Appointment Details Section */}
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {appointment.docData.name}
                      </h2>
                      <p className="text-md text-blue-600 font-medium mb-3">
                        {appointment.docData.speciality}
                      </p>

                      <div className="space-y-2 mt-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Location
                            </p>
                            <p className="text-gray-600 text-sm">
                              {appointment.docData.address.line1}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {appointment.docData.address.line2}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Date</p>
                            <p className="text-gray-600 text-sm">
                              {slotDateFormat(appointment.slotDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Time</p>
                            <p className="text-gray-600 text-sm">
                              {appointment.slotTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Section */}
                  <div className="p-4 flex flex-col justify-end gap-3  md:border-l">
                    {!appointment.cancelled && !appointment.isCompleted && (
                      <>
                        {!appointment.payment ? (
                          <>
                            <button
                              onClick={() => paymentHandler(appointment._id)}
                              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                              <DollarSign className="w-4 h-4" />
                              Pay Online
                            </button>
                            <button
                              onClick={() => cancelAppointment(appointment._id)}
                              className="w-full py-2.5 px-4 border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-700 rounded-md font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Cancel Appointment
                            </button>
                          </>
                        ) : (
                          <div className="w-full py-2.5 px-4 bg-green-500 hover:bg-green-700 text-white rounded-md font-medium transition-colors duration-300 flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Paid
                          </div>
                        )}
                      </>
                    )}

                    {appointment.cancelled_by_doctor &&
                      !appointment.isCompleted && (
                        <div className="text-center">
                          <p className="text-red-600 font-medium mb-2">
                            Appointment Cancelled By Doctor
                          </p>
                          <p className="text-gray-500 text-sm">
                            Please book another appointment
                          </p>
                        </div>
                      )}

                    {appointment.cancelled_by_admin &&
                      !appointment.isCompleted && (
                        <div className="text-center">
                          <p className="text-orange-600 font-medium mb-2">
                            Appointment Being Cancelled
                          </p>
                          <p className="text-gray-500 text-sm">
                            Please make another appointment
                          </p>
                        </div>
                      )}

                    {appointment.cancelled_by_user &&
                      !appointment.isCompleted && (
                        <div className="text-center">
                          <p className="text-red-600 font-medium">
                            Cancellation Completed
                          </p>
                        </div>
                      )}

                    {appointment.isCompleted && (
                      <div className="text-center">
                        <p className="text-green-600 font-medium mb-2">
                          Appointment Completed
                        </p>
                        <button className="w-full py-2.5 px-4 border border-blue-300 hover:bg-blue-50 text-blue-600 rounded-md font-medium transition-colors duration-300">
                          Book Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
