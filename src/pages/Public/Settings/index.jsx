import React, { useContext, useState, useEffect } from "react";
import { Settings2, Server, Eye, EyeOff, RefreshCw } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthLocket";
import { showSuccess, showInfo } from "../../../components/Toast";
import { getCustomBackendUrl } from "../../../utils/backendConfig";
import { TbServerOff, TbServerBolt } from "react-icons/tb";

function SettingsPage() {
  const { user } = useContext(AuthContext);
  const [backendUrl, setBackendUrl] = useState("");
  const [isCustomBackend, setIsCustomBackend] = useState(false);
  const [encryptKey, setEncryptKey] = useState("");
  const [showEncryptKey, setShowEncryptKey] = useState(false);
  const [nodeStatus, setNodeStatus] = useState(null);
  const [isCheckingNode, setIsCheckingNode] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState(null);
  const urlRegex = /^https?:\/\/(?:[a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+(?:\.[a-zA-Z]{2,})?(?::\d{1,5})?(?:\/[^\s]*)?$/;

  const measureLatency = async (url) => {
    try {
      const startTime = performance.now();
      const response = await axios.head(`${url}/keepalive`, {
        timeout: 5000
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      return {
        isUp: response.status === 200,
        latency: `${latency}ms`,
        type: 'custom',
        name: 'Custom Node'
      };
    } catch (error) {
      return {
        isUp: false,
        latency: 'N/A',
        type: 'custom',
        name: 'Custom Node'
      };
    }
  };

  // Load backend settings when component mounts
  useEffect(() => {
    const savedUrl = getCustomBackendUrl();
    const savedIsCustom = localStorage.getItem("use_custom_backend") === "true";
    const savedEncryptKey = localStorage.getItem("custom_backend_encrypt_key");
    
    if (savedUrl) {
      setBackendUrl(savedUrl);
      checkNodeStatus(savedUrl);
    }
    if (savedEncryptKey) {
      setEncryptKey(savedEncryptKey);
    }
    setIsCustomBackend(savedIsCustom);
  }, []);

  const checkNodeStatus = async (url) => {
    if (!url || !urlRegex.test(url)) {
      setNodeStatus(null);
      setLastCheckedTime(null);
      return;
    }
    setIsCheckingNode(true);
    const status = await measureLatency(url);
    setNodeStatus(status);
    setIsCheckingNode(false);
    setRefreshCountdown(10);
    setLastCheckedTime(new Date());
  };

  // Handle refresh countdown
  useEffect(() => {
    let timer;
    if (refreshCountdown > 0) {
      timer = setInterval(() => {
        setRefreshCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [refreshCountdown]);

  useEffect(() => {
    if (isCustomBackend && backendUrl) {
      checkNodeStatus(backendUrl);
    } else {
      setNodeStatus(null);
      setLastCheckedTime(null);
    }
  }, [backendUrl, isCustomBackend]);

  const handleRefresh = () => {
    if (refreshCountdown === 0 && backendUrl) {
      checkNodeStatus(backendUrl);
    }
  };

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

      if (!nodeStatus?.isUp) {
        showInfo("Cannot save settings - node is not responding");
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

  const NodeCard = ({ data }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm opacity-70">Node Status</span>
        <button
          className={`btn btn-sm btn-ghost gap-2 ${refreshCountdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleRefresh}
          disabled={refreshCountdown > 0 || isCheckingNode}
        >
          <RefreshCw 
            size={16} 
            className={`${isCheckingNode ? 'animate-spin' : ''}`}
          />
          {refreshCountdown > 0 ? `${refreshCountdown}s` : 'Refresh'}
        </button>
      </div>
      <div className={`relative flex items-center gap-4 p-4 rounded-lg w-full overflow-hidden ${
        data.isUp ? 'bg-success/15' : 'bg-error/15'
      }`}>
        <div className="flex items-start gap-4 z-10">
          {data.isUp ? <TbServerBolt size={20} className="text-success" /> : <TbServerOff size={20} className="text-error" />}
          <div className="flex flex-col">
            <span className={`flex items-center gap-2 font-medium ${data.isUp ? 'text-success' : 'text-error'}`}>
              {data.name}
            </span>
            <span className="text-base opacity-70">Latency: {data.latency}</span>
            <span className="text-sm opacity-50">
              Last checked: {lastCheckedTime ? lastCheckedTime.toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

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
                  autoComplete="off"
                  data-lpignore="true"
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
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-lpignore="true"
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

              {nodeStatus && <NodeCard data={nodeStatus} />}

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
            disabled={isCustomBackend && (isCheckingNode || !nodeStatus?.isUp)}
          >
            {isCheckingNode ? 'Checking Node...' : 'Save Backend Settings'}
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