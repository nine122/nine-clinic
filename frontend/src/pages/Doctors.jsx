import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Calendar, ArrowRight } from "lucide-react";

const Doctors = () => {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);
  const menuClass =
    "w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer";
  const specialityList = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Gastroenterologist",
  ];
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };
  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);
  return (
    <div>
      <p className="text-gray-600">Browse through our list of top doctors</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
        >
          Filters
        </button>
        <div
          className={`flex flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {specialityList.map((item, index) => (
            <p
              className={
                menuClass +
                ` ${speciality === `${item}` ? "bg-indigo-100 text-black" : ""}`
              }
              key={index}
              onClick={() =>
                speciality === `${item}`
                  ? navigate("/doctors")
                  : navigate(`/doctors/${item}`)
              }
            >
              {item}
            </p>
          ))}
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 gap-y-6 m-auto ">
          {filterDoc.map((doctor, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/appointment/${doctor._id}`);
                scrollTo(0, 0);
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div
                  className={`absolute flex items-center gap-3 bottom-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.available
                      ? "bg-gray-100 text-green-500"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p
                    className={`w-2 h-2 ${
                      doctor.available ? "bg-green-500" : "bg-red-500"
                    } rounded-full`}
                  ></p>
                  {doctor.available ? "Available" : "Not Available"}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold mb-1">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mb-3">
                  {doctor.speciality}
                </p>

                <div className="flex justify-end items-center mt-4">
                  <button className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Book Now</span>

                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
