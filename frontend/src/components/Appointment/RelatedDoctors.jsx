import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [relDocs, setRelDocs] = useState([]);
  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our list of top doctors
      </p>
      <div className=" grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relDocs.slice(0, 5).map((doctor, index) => (
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
      <button
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
      >
        more...
      </button>
    </div>
  );
};

export default RelatedDoctors;
