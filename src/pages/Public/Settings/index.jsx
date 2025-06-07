import React, { useContext, useState, useEffect } from "react";
import { Settings2, Server, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../../context/AuthLocket";
import { showSuccess, showInfo } from "../../../components/Toast";
import { getCustomBackendUrl } from "../../../utils/backendConfig";

function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [backendUrl, setBackendUrl] = useState("");
  const [isCustomBackend, setIsCustomBackend] = useState(false);
  const [encryptKey, setEncryptKey] = useState("");
  const [showEncryptKey, setShowEncryptKey] = useState(false);
  const urlRegex = /^https?:\/\/(?:[a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+(?:\.[a-zA-Z]{2,})?(?::\d{1,5})?(?:\/[^\s]*)?$/;

  // Load backend settings when component mounts
  useEffect(() => {
    const savedUrl = getCustomBackendUrl();
    const savedIsCustom = localStorage.getItem("use_custom_backend") === "true";
    const savedEncryptKey = localStorage.getItem("custom_backend_encrypt_key");
    
    if (savedUrl) {
      setBackendUrl(savedUrl);
    }
    if (savedEncryptKey) {
      setEncryptKey(savedEncryptKey);
    }
    setIsCustomBackend(savedIsCustom);
  }, []);

  const handleSaveBackendSettings = () => {
    if (isCustomBackend) {
      if (!backendUrl) {
        showInfo("Please enter a backend URL");
        return;
      }

      if (!urlRegex.test(backendUrl)) {
        showInfo("Invalid backend URL format");
        return;
      }

      if (!encryptKey) {
        showInfo("Please enter an Encryption Key");
        return;
      }

      localStorage.setItem("custom_backend_url", backendUrl);
      localStorage.setItem("custom_backend_encrypt_key", encryptKey);
      localStorage.setItem("use_custom_backend", "true");
    } else {
      localStorage.removeItem("custom_backend_url");
      localStorage.removeItem("custom_backend_encrypt_key");
      localStorage.setItem("use_custom_backend", "false");
    }

    showSuccess("Backend settings saved successfully");
  };

  const settingsSections = [
    {
      id: "backend",
      title: "Backend Configuration",
      icon: <Server size={20} />,
      description: "Configure connection to backend server",
      customContent: (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Use custom backend</span>
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
                  <span className="label-text">Backend URL</span>
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
                  ⚠️ Only change these settings if you know what you're doing
                </span>
              </label>
            </>
          )}
          
          <button 
            className="btn btn-primary w-full"
            onClick={handleSaveBackendSettings}
          >
            Save Backend Settings
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-base-100">
      <div className="flex items-center gap-3 mb-8">
        <Settings2 className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className="card bg-base-200 shadow-xl"
          >
            <div className="card-body">
              <div className="flex items-center gap-2 mb-4">
                {section.icon}
                <h2 className="card-title">{section.title}</h2>
              </div>
              <p className="text-sm text-base-content/70 mb-4">
                {section.description}
              </p>
              {section.customContent}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsPage; 