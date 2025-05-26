import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const formStyle = "flex-1 flex flex-col gap-1";
  const inputStyle = "mt-1 border border-gray-200 rounded px-3 py-2";

  // const [docImg, setDocImg] = useState(false);
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [experience, setExperience] = useState('');
  // const [fees, setFees] = useState('');
  // const [about, setAbout] = useState('');
  // const [speciality, setSpeciality] = useState('');
  // const [degree, setDegree] = useState('');
  // const [address1, setAddress1] = useState('');
  // const [address2, setAddress2] = useState('');
  const [docDetail, setDocDetail] = useState({
    docImg: false,
    name: "",
    email: "",
    password: "",
    experience: "1 Year",
    fees: "",
    about: "",
    speciality: "General Physician",
    degree: "",
    address1: "",
    address2: "",
  });

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docDetail.docImg) {
        return toast.error("Please upload doctor image");
      }
      const formData = new FormData();
      formData.append("image", docDetail.docImg);
      formData.append("name", docDetail.name);
      formData.append("email", docDetail.email);
      formData.append("password", docDetail.password);
      formData.append("experience", docDetail.experience);
      formData.append("fees", docDetail.fees);
      formData.append("about", docDetail.about);
      formData.append("speciality", docDetail.speciality);
      formData.append("degree", docDetail.degree);
      formData.append(
        "address",
        JSON.stringify({ line1: docDetail.address1, line2: docDetail.address2 })
      );

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setDocDetail({
          docImg: false,
          name: "",
          email: "",
          password: "",
          experience: "1 Year",
          fees: "",
          about: "",
          speciality: "General Physician",
          degree: "",
          address1: "",
          address2: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              src={
                docDetail.docImg
                  ? URL.createObjectURL(docDetail.docImg)
                  : assets.upload_area
              }
              alt=""
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
            />
          </label>
          <input
            onChange={(e) =>
              setDocDetail({ ...docDetail, docImg: e.target.files[0] })
            }
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className={formStyle}>
              <p>Doctor name</p>
              <input
                type="text"
                placeholder="Name"
                required
                className={inputStyle}
                onChange={(e) =>
                  setDocDetail({ ...docDetail, name: e.target.value })
                }
                value={docDetail.name}
              />
            </div>
            <div className={formStyle}>
              <p>Doctor Email</p>
              <input
                type="email"
                placeholder="Email"
                required
                className={inputStyle}
                onChange={(e) =>
                  setDocDetail({ ...docDetail, email: e.target.value })
                }
                value={docDetail.email}
              />
            </div>
            <div className={formStyle}>
              <p>Doctor Password</p>
              <input
                type="password"
                placeholder="Password"
                required
                className={inputStyle}
                onChange={(e) =>
                  setDocDetail({ ...docDetail, password: e.target.value })
                }
                value={docDetail.password}
              />
            </div>
            <div className={formStyle}>
              <p>Experience</p>
              <select
                onChange={(e) =>
                  setDocDetail({ ...docDetail, experience: e.target.value })
                }
                value={docDetail.experience}
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Year</option>
                <option value="3 Years">3 Year</option>
                <option value="4 Years">4 Year</option>
                <option value="> 5 Years">{">"} 5 Years</option>
                <option value="> 10 Years">{">"} 10 Years</option>
                <option value="> 15 Years">{">"} 15 Years</option>
              </select>
            </div>
            <div className={formStyle}>
              <p>Fees</p>
              <input
                type="number"
                placeholder="fees"
                required
                className={inputStyle}
                onChange={(e) =>
                  setDocDetail({ ...docDetail, fees: e.target.value })
                }
                value={docDetail.fees}
              />
            </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className={formStyle}>
              <p>Speciality</p>
              <select
                onChange={(e) =>
                  setDocDetail({ ...docDetail, speciality: e.target.value })
                }
                value={docDetail.speciality}
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className={formStyle}>
              <p>Education</p>
              <input
                type="text"
                placeholder="Education"
                required
                className={inputStyle}
                onChange={(e) =>
                  setDocDetail({ ...docDetail, degree: e.target.value })
                }
                value={docDetail.degree}
              />
            </div>
            <div className={formStyle}>
              <p>Address</p>
              <input
                type="text"
                placeholder="address 1"
                required
                className={inputStyle}
                onChange={(e) =>
                  setDocDetail({ ...docDetail, address1: e.target.value })
                }
                value={docDetail.address1}
              />
              <input
                type="text"
                placeholder="address 2"
                required
                className={inputStyle}
                onChange={(e) =>
                  setDocDetail({ ...docDetail, address2: e.target.value })
                }
                value={docDetail.address2}
              />
            </div>
          </div>
        </div>
        <div className={formStyle}>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            type="text"
            placeholder="About Doctor"
            required
            rows={5}
            className="w-full px-4 pt-2 border border-gray-200 rounded"
            onChange={(e) =>
              setDocDetail({ ...docDetail, about: e.target.value })
            }
            value={docDetail.about}
          />
        </div>

        <button
          type="submit"
          className="bg-[#5F6FFF] text-white px-8 py-2 mt-4 rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
