import React from "react";
import year from "./helpers/date";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer">
      <div className=" socials ">
        <a href="https://github.com/AveryLebene">
          <AiFillGithub className=" " size={24} color="#d1d1d1" />
        </a>
        <a href="https://www.linkedin.com/in/avery-lebene-korto-046293253/">
          <AiFillLinkedin className="" size={24} color="#d1d1d1" />
        </a>
      </div>
      <p className="text-center ">
        {" "}
        <span> © {year} </span>
      </p>
      <p className="font-thin text-center">A PROJECT BY AVERY</p>
    </div>
  );
};

export default Footer;
