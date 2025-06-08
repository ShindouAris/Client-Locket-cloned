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
const DonationInfo = () => {

  const BankAccount = import.meta.env.VITE_BANK_ACCOUNT;
  const BankName = import.meta.env.VITE_BANK_NAME;
  const BankAccountName = import.meta.env.VITE_BANK_ACCOUNT_NAME;

  return {
    BankAccount,
    BankName,
    BankAccountName,
  }
}

const AboutMe = () => {
  const bankinfor = DonationInfo();
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
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mb-10 relative">
          <h2 className="text-2xl font-semibold mb-6 text-center">Hỗ trợ dự án này</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-lg w-64 h-64 flex items-center justify-center">
                <img
                  src="/banking_infor.png"
                  alt="Donation QR Code"
                  className="max-w-full max-h-full"
                />
              </div>
              <p className="mt-4 text-center text-gray-600">Buy me a coffee</p>
            </div>
            <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Thông tin</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Tài khoản ngân hàng:</p>
                  <p className="text-gray-600">{bankinfor.BankAccount}</p>
                </div>
                <div>
                  <p className="font-medium">Tên tài khoản:</p>
                  <p className="text-gray-600">{bankinfor.BankAccountName}</p>
                </div>
                <div>
                  <p className="font-medium">Tên ngân hàng:</p>
                  <p className="text-gray-600">{bankinfor.BankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mt-4">
                    Sự ủng hộ của bạn giúp duy trì dự án và nâng cấp hệ thống. Cảm ơn bạn! 💖
                  </p>
                </div>
              </div>
            </div>
          </div>
          <img
            src="/aligatou.png"
            alt="Donation Image" 
            className="absolute bottom-0 right-0 opacity-20 w-1/4"
          />
        </div>
      </div>
      <div className="relative mb-10 text-center px-3 mt-6">
        <DonateHistory />
      </div>
    </>
  );
};

export default AboutMe;
