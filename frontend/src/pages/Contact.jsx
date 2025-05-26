import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500 pt-10">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm ">
        <img
          src={assets.contact_image}
          alt=""
          className="w-full md:max-w-[360px] "
        />
        <div className="flex flex-col justify-center gap-6 items-start">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className="text-gray-500">
            3437 OFFICE STATION
            <br /> Suite 3424, NY
          </p>
          <p className="text-gray-500">
            TEL: (342) 3424-3424 <br /> email: info@nineclinic
          </p>
          <p className="font-semibold text-lg text-gray-600">
            Careers at Nineclinic
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
