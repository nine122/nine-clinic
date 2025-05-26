import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);
  useEffect(() => {
    aToken && getAllDoctors();
  }, [aToken]);
  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">Doctors List</h1>
      <ul className="flex flex-wrap gap-4 w-full pt-5 gap-y-6">
        {doctors.map((doctor, index) => (
          <div
            className="border border-indigo-200 max-w-56 rounded-xl overflow-hidden cursor-pointer group hover:translate-y-[-6px] transition-all duration-500"
            key={index}
          >
            <img
              src={doctor.image}
              alt=""
              className="h-56 bg-indigo-50 group-hover:bg-[#5F6FFF] transition-all duration-500"
            />
            <div className="p-4">
              <p className=" text-neutral-800 text-lg font-medium font-semibold">
                {doctor.name}
              </p>
              <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm ">
                <input
                  type="checkbox"
                  checked={doctor.available}
                  onChange={() => changeAvailability(doctor._id)}
                  className="w-4 h-5 "
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default DoctorsList;
