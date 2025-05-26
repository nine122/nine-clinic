import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  const cardstyle =
    "border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer";
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12 ">
        <img
          src={assets.about_image}
          alt=""
          className="w-full md:max-w-[360px] "
        />
        <div className="flex flex-col justify-center gap-6 md:w-3/4 text-sm text-gray-600">
          <p>
            Amet ex nostrud aliqua ullamco commodo laboris velit nostrud veniam
            eu sit. Amet est laborum commodo veniam nostrud dolore. Sint irure
            laboris tempor consequat culpa fugiat esse veniam occaecat. Nostrud
            excepteur et cupidatat anim culpa adipisicing amet commodo quis
            cillum ipsum. Nostrud voluptate ex enim officia reprehenderit
            consectetur laborum eiusmod quis. Irure sint minim est tempor culpa.
          </p>
          <p>
            Ex pariatur ut labore in proident. Nisi elit mollit id nulla
            adipisicing. Do in exercitation ad aute ea mollit reprehenderit qui
            labore incididunt labore nulla nostrud cillum. Lorem excepteur nulla
            sint eiusmod proident ullamco irure ipsum tempor.
          </p>
          <b className="text-gray-800">Our vision</b>
          <p>
            Reprehenderit minim commodo mollit consequat exercitation voluptate
            aliqua aliqua consectetur. Duis proident dolore est laborum ex anim
            ipsum consequat eiusmod consectetur officia commodo id. Deserunt
            excepteur duis consectetur eiusmod commodo cupidatat nostrud culpa
            ipsum magna laborum labore dolor. Irure aliqua ex tempor sint velit
            pariatur Lorem veniam cillum consectetur sint veniam est. Commodo
            ipsum pariatur elit Lorem dolore.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className={cardstyle}>
          <b>Efficiency:</b>
          <p>Veniam adipisicing adipisicing ullamco deserunt Lorem velit.</p>
        </div>
        <div className={cardstyle}>
          <b>Convenience:</b>
          <p>
            Dolor occaecat reprehenderit aliquip deserunt labore officia sit
            laboris eiusmod ullamco aute.
          </p>
        </div>
        <div className={cardstyle}>
          <b>Personalization:</b>
          <p>
            Ex reprehenderit sit duis laboris sit cillum est cupidatat Lorem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
