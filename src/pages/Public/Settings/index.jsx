import React, { useContext, useState, useEffect } from "react";
import { Settings2, Bell, Shield, Palette, User, Server, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../../context/AuthLocket";
import { showSuccess, showInfo } from "../../../components/Toast";

function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [backendUrl, setBackendUrl] = useState("");
  const [isCustomBackend, setIsCustomBackend] = useState(false);
  const [encryptKey, setEncryptKey] = useState("");
  const [showEncryptKey, setShowEncryptKey] = useState(false);
  const urlRegex = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})?(?::\d{1,5})?(?:\/[^\s]*)?$/;

  // Load backend settings when component mounts
  useEffect(() => {
    const savedBackendUrl = localStorage.getItem("custom_backend_url");
    const savedIsCustom = localStorage.getItem("use_custom_backend") === "true";
    const savedEncryptKey = localStorage.getItem("custom_backend_encrypt_key");
    if (savedBackendUrl) {
      setBackendUrl(savedBackendUrl);
    }
    if (savedEncryptKey) {
      setEncryptKey(savedEncryptKey);
    }
    setIsCustomBackend(savedIsCustom);
  }, []);

  const handleSaveBackendSettings = () => {
    if (isCustomBackend && !backendUrl) {
      showInfo("Vui lòng nhập URL backend");
      return;
    }
    if (isCustomBackend && !urlRegex.test(backendUrl)) {
      showInfo("URL backend không hợp lệ");
      return;
    }

    if (isCustomBackend && !encryptKey) {
      showInfo("Vui lòng nhập Encryption Key");
      return;
    }

    if (isCustomBackend) {
      localStorage.setItem("custom_backend_url", backendUrl);
      localStorage.setItem("custom_backend_encrypt_key", encryptKey);
      localStorage.setItem("use_custom_backend", "true");
    } else {
      localStorage.removeItem("custom_backend_url");
      localStorage.removeItem("custom_backend_encrypt_key");
      localStorage.setItem("use_custom_backend", "false");
    }

    showSuccess("Đã lưu cài đặt backend");
  };

  const settingsSections = [
    {
      id: "backend",
      title: "Cấu hình Backend",
      icon: <Server size={20} />,
      description: `Tùy chỉnh kết nối đến máy chủ backend`,
      customContent: (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Sử dụng backend tùy chỉnh</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isCustomBackend}
                onChange={(e) => setIsCustomBackend(e.target.checked)}
              />
            </label>
          </div>
          
          {isCustomBackend && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">URL Backend</span>
                </label>
                <input
                  type="text"
                  placeholder="https://api.example.com"
                  className="input input-bordered w-full"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Encryption Key</span>
                </label>
                <div className="relative">
                  <input
                    type={showEncryptKey ? "text" : "password"}
                    placeholder="Enter encryption key"
                    className="input input-bordered w-full pr-10"
                    value={encryptKey}
                    onChange={(e) => setEncryptKey(e.target.value)}
                    autoCorrect="off"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowEncryptKey(!showEncryptKey)}
                  >
                    {showEncryptKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="label">
                <span className="label-text-alt text-warning">
                  ⚠️ Chỉ thay đổi nếu bạn biết mình đang làm gì
                </span>
              </label>
            </>
          )}
          
          <button 
            className="btn btn-primary w-full"
            onClick={handleSaveBackendSettings}
          >
            Lưu cài đặt Backend
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-base-100">
      <div className="flex items-center gap-3 mb-8">
        <Settings2 className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Cài đặt</h1>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-3">
                {section.icon}
                <h2 className="card-title">{section.title}</h2>
              </div>
              <p className="text-base-content/70 mb-4">{section.description}</p>
              
              {section.customContent ? (
                section.customContent
              ) : (
                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="text-base-content/70">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsPage; 