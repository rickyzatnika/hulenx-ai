"use client";
import { toast } from "react-toastify";
import { TbEyeClosed } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useState } from "react";

const FormRegister = ({ setActiveButton }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleConfirmVisible = () => {
    setConfirmVisible((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confPassword = e.target[3].value;

    if (!name || !email || !password || !confPassword) {
      toast.error("field required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password harus lebih dari 6 karakter");
      return;
    }
    if (password !== confPassword) {
      toast.error("Password dan Konfirmasi Password harus sama");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const errorData = await res.json();

      if (res.status === 201) {
        const timeoutId = setTimeout(() => {
          setLoading(false);
          setActiveButton("login");
          toast.success("Registrasi berhasil, Silahkan Login");
        }, 3000);
        return () => clearTimeout(timeoutId);
      } else {
        toast.error(errorData?.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Internal Server error!! Try again later");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
      <input
        type="text"
        placeholder="Nama Pengguna"
        name="name"
        className="placeholder:text-sm placeholder:text-gray-500 focus:dark:placeholder-transparent  focus:placeholder-transparent placeholder:dark:text-gray-100/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-[#ddd] dark:text-gray-100 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-[#372777]"
      />
      <input
        type="email"
        placeholder="example@gmail.com"
        name="email"
        className="placeholder:text-sm placeholder:text-gray-500 focus:dark:placeholder-transparent  focus:placeholder-transparent placeholder:dark:text-gray-100/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-[#ddd] dark:text-gray-100 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-[#372777]"
      />
      <div className="flex items-center justify-between relative">
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          name="password"
          className="placeholder:text-sm placeholder:text-gray-500 focus:dark:placeholder-transparent  focus:placeholder-transparent placeholder:dark:text-gray-100/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-[#ddd] dark:text-gray-100 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-[#372777]"
        />
        <div className="absolute right-3 cursor-pointer">
          {!passwordVisible ? (
            <TbEyeClosed
              className="text-gray-400/80"
              onClick={() => handlePasswordVisible()}
            />
          ) : (
            <MdOutlineRemoveRedEye
              className="text-green-400"
              onClick={handlePasswordVisible}
            />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between relative">
        <input
          type={confirmVisible ? "text" : "password"}
          placeholder="Konfirmasi Password"
          className="placeholder:text-sm placeholder:text-gray-500 focus:dark:placeholder-transparent  focus:placeholder-transparent placeholder:dark:text-gray-100/80 px-4 py-3 rounded  w-full border-gray-300 border-2 bg-transparent text-[#ddd] dark:text-gray-300 outline-none  focus:outline-none focus:ring-0 focus:border-2   focus:border-[#372777]"
        />
        <div className="absolute right-3 cursor-pointer">
          {!confirmVisible ? (
            <TbEyeClosed
              className="text-gray-300/80"
              onClick={() => handleConfirmVisible()}
            />
          ) : (
            <MdOutlineRemoveRedEye
              className="text-green-400"
              onClick={handleConfirmVisible}
            />
          )}
        </div>
      </div>
      <button
        disabled={loading}
        className="px-4 py-3 rounded uppercase transition-all duration-150 ease-linear bg-gradient-to-tr from-[#413572] to-[#413572] text-[#ddd]  hover:text-white"
        type="submit"
      >
        {loading ? (
          <div className="flex gap-2 items-center justify-center">
            <span className=" text-white">Loading... </span>
            <span className="loader"></span>
          </div>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

export default FormRegister;
