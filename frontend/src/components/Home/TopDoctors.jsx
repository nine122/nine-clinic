import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Calendar, ArrowRight } from "lucide-react";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center my-16 text-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Top Doctors to Book
        </h1>
        <p className="max-w-lg mx-auto text-gray-600">
          Simply browse through our list of top-rated healthcare professionals
          and book your appointment today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {doctors.slice(0, 8).map((doctor, index) => (
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
                className="w-full h-72 object-cover object-center"
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
        className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full flex items-center shadow-md hover:shadow-lg transition-all"
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
      >
        View All Doctors
        <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );
};

export default TopDoctors;
