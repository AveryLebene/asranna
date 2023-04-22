import React from "react";
import year from "./helpers/date";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer">
      <div className=" socials ">
        <a href="https://github.com/AveryLebene">
          <AiFillGithub className=" " size={20} color="#d1d1d1" />
        </a>
        <a href="https://www.linkedin.com/in/avery-lebene-korto-046293253/">
          <AiFillLinkedin className="" size={20} color="#d1d1d1" />
        </a>
      </div>
      <p className="footnote ">
        {" "}
        <span> © {year} </span>
      </p>
      <p className=" footnote">
        A PROJECT BY <a href="https://github.com/AveryLebene">AVERY</a>{" "}
      </p>
    </div>
  );
};

export default Footer;
