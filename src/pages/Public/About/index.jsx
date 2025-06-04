import React from "react";
import MockupiPhone from "../../../components/UI/MockupiPhone";
import FeatureList from "../../../components/UI/FeatureList";

export default function AboutLocketDio() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white text-gray-800 px-6 py-16 md:px-12 lg:px-32">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 pt-10 text-center text-purple-700">
          Giới thiệu về <span className="text-black">Locket Kanade</span>
        </h1>

        <p className="text-lg leading-8 text-gray-700 mb-10 text-center max-w-3xl mx-auto">
        Locket Kanade - nền tảng mở rộng tiện lợi cho Locket Widget giúp bạn chia sẻ ảnh, video trực tiếp lên Locket với giao diện hiện đại và tiện lợi, được crack bởi ニーゴ.
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
        <div className="w-full flex justify-center md:scale-90">
            <MockupiPhone />
          </div>
          <div className="-mt-7">
            <FeatureList/>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-2">🌐 Truy cập Locket Kanade</h2>
          <p className="text-gray-700 mb-6">
            Khám phá và bắt đầu chia sẻ những khoảnh khắc đáng nhớ của bạn.
          </p>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-full shadow-md transition duration-300"
          >
            🚀 Truy cập ngay
          </a>
        </div>
      </div>
    </section>
  );
}
