import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { appointments, aToken, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[90vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-3 border-b">
          <p></p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] max-sm:gap-2 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                src={item.userData.image}
                alt=""
                className="w-8 rounded-full"
              />
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)},{item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                src={item.docData.image}
                alt=""
                className="w-8 rounded-full bg-gray-200"
              />
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency} {item.amount}
            </p>
            {item.cancelled_by_admin && (
              <p className="text-red-400 text-sm font-medium">
                Cancelled By Admin
              </p>
            )}
            {item.cancelled_by_doctor && (
              <p className="text-red-400 text-sm font-medium">
                Cancelled By Doctor
              </p>
            )}
            {item.cancelled_by_user && (
              <p className="text-red-400 text-sm font-medium">
                Cancelled By Patient
              </p>
            )}

            {item.isCompleted ? (
              <p className="text-green-600 text-sm font-medium">Completed</p>
            ) : (
              !item.cancelled && (
                <img
                  onClick={() => {
                    cancelAppointment(item._id);
                  }}
                  src={assets.cancel_icon}
                  alt=""
                  className="w-10 cursor-pointer"
                />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
