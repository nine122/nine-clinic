import React from "react";
import { assets } from "../../assets/assets";

const DoctorInfo = ({ docInfo, currencySymbol }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <img
        src={docInfo.image}
        alt=""
        className="bg-primary w-full sm:max-w-72 rounded-lg"
      />

      <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
        <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
          {docInfo.name}{" "}
          <img src={assets.verified_icon} alt="" className="w-5" />
        </p>
        <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
          <p>
            {docInfo.degree} - {docInfo.speciality}
          </p>
          <button className="py-0.5 px-2 rounded-full text-xs border">
            {docInfo.experience}
          </button>
        </div>

        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
          About <img src={assets.info_icon} alt="" />
        </p>
        <p className="text-sm text-gray-500 max-w-[700px] mt-1">
          {docInfo.about}
        </p>

        <p className="text-gray-600 mt-4 font-medium">
          Appointment fee:{" "}
          <span className="text-gray-600">
            {currencySymbol}
            {docInfo.fees}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DoctorInfo;
