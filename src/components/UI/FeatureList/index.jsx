import React from "react";
import {
  Camera,
  Video,
  Upload,
  Paintbrush,
  Palette,
  Sparkles,
  Rocket,
  Users,
  Server,
  JapaneseYen,
} from "lucide-react";

const features = [
  {
    icon: <Camera className="w-8 h-8 text-blue-500" />,
    title: "Chụp ảnh nhanh",
    description: "Chỉ với một click, ghi lại khoảnh khắc đáng nhớ.",
  },
  {
    icon: <Video className="w-8 h-8 text-red-500" />,
    title: "Quay video",
    description: "Giữ nút để quay video tối đa 10 giây.",
  },
  {
    icon: <Upload className="w-8 h-8 text-green-600" />,
    title: "Đăng ảnh & video",
    description: "Tải ảnh hoặc video từ máy lên tường nhà bạn.",
  },
  {
    icon: <Paintbrush className="w-8 h-8 text-purple-600" />,
    title: "Đổi màu caption",
    description: "Tuỳ chỉnh màu sắc caption cho thật nổi bật.",
  },
  {
    icon: <JapaneseYen className="w-8 h-8 text-orange-600" />,
    title: "Mọi tính năng đều miễn phí",
    description: "Với việc sử dụng hệ thống Backend tùy chỉnh, bạn có thể tải lên bài viết mà không lo bị giới hạn.",
  },
  {
    icon: <Server className="w-8 h-8 text-orange-600" />,
    title: "Tùy chỉnh hệ thống backend",
    description: "Với việc sử dụng backend mã nguồn mở, bạn có thể kiểm soát những gì được lưu.",
  }
];

const FeatureList = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-lovehouse font-bold text-center mb-2">
        ✨Locket Kanade Feature
      </h2>
      <div className="grid sm:grid-cols-2 gap-2">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-row items-center gap-4 p-5 bg-base-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="">{feature.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-base-content">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureList;
