import React from "react";
import {
  Code2,
  Github,
  Mail,
  Braces,
  Palette,
  Database,
  Flame,
  Coffee,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import ImageMarquee from "../../../components/UI/Marquee/LanguageMarquee";
import {
  FaReact,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaNodeJs,
} from "react-icons/fa";
import { RiTailwindCssFill, RiVercelFill } from "react-icons/ri";
import DonateHistory from "../../Public/HistoryDonate";

const AboutMe = () => {
  return (
    <>
      {" "}
      <div className="h-20"></div>
      <div className="min-h-screen flex flex-col px-6 items-center">
        <div className="flex flex-col items-center mb-10">
          <img
            src="/locket-icon.png" 
            alt="Kanade Avatar"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-semibold text-center">
            Kanade Yoisaki
          </h1>
          <p className="text-lg md:text-xl mt-2">
           Nhân vật ảo trong game Project Sekai
          </p>
        </div>
      </div>
      <div className="relative mb-10 text-center px-3 mt-6">
        <DonateHistory />
      </div>
    </>
  );
};

export default AboutMe;
