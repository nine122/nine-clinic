import React, { useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const {
    dToken,
    getProfileData,
    profileData,
    backendUrl,
    getDashboardData,
    setProfileData,
  } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        fees: profileData.fees,
        address: profileData.address,
        available: profileData.available,
      };
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
      getDashboardData();
    }
  }, [dToken]);
  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              src={profileData.image}
              className="bg-[#D9D9D9]/80 w-full sm:max-w-64 rounded-lg"
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            <p>{profileData.name}</p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:{" "}
              </p>
              <p className="text-sm text-gray-600 max-w-[700px]">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4 ">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>
            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>
            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type="checkbox"
              />
              <label>Available</label>
            </div>
            {isEdit ? (
              <button
                onClick={() => updateProfile()}
                className="border border-[#5F6FFF] mt-5 text-sm px-4 py-1 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all duration-300  "
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="border border-[#5F6FFF] mt-5 text-sm px-4 py-1 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all duration-300  "
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
