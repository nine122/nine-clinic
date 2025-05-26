import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const {
    dToken,
    dashboardData,
    getDashboardData,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);
  const cardStyle =
    "flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-500";
  useEffect(() => {
    getDashboardData();
  }, [dToken]);
  return (
    dashboardData && (
      <div className="m-5 max-h-[90vh] overflow-y-scroll">
        <div className="flex flex-wrap gap-3">
          <div className={cardStyle}>
            <img src={assets.earning_icon} alt="" className="w-14" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency} {dashboardData.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>

          <div className={cardStyle}>
            <img src={assets.appointments_icon} alt="" className="w-14" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashboardData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          <div className={cardStyle}>
            <img src={assets.patients_icon} alt="" className="w-14" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashboardData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashboardData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 border-b hover:bg-gray-100"
              >
                <img
                  src={item.userData.image}
                  alt=""
                  className="rounded-full w-10"
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
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
                  <p className="text-green-400 text-sm font-medium">
                    Completed
                  </p>
                ) : (
                  !item.cancelled && (
                    <div className="flex">
                      <img
                        src={assets.cancel_icon}
                        alt=""
                        onClick={() => cancelAppointment(item._id)}
                      />
                      <img
                        src={assets.tick_icon}
                        alt=""
                        onClick={() => completeAppointment(item._id)}
                      />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
