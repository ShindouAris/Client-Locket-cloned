import React, { useState, useEffect, version } from 'react';
import axios from 'axios';
import { GoServer } from "react-icons/go";
import { LuServerCog } from "react-icons/lu";
import { BsDatabaseCheck } from "react-icons/bs";
import { getBackendNodes, isUsingCustomBackend, getCustomBackendUrl } from '../../../utils/backendConfig';

const NodeInfo = () => {
  const [nodeStatuses, setNodeStatuses] = useState([]);
  const [customNodeStatus, setCustomNodeStatus] = useState(null);
  const [dbApiStatus, setDbApiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const measureLatency = async (url, endpointcheck = "keepalive", method = "head") => {
    try {
      const startTime = performance.now();
      const response = await axios[method](`${url}/${endpointcheck}`, {
        timeout: 5000
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      return {
        isUp: response.status === 200,
        latency: `${latency}ms`,
        version: response.data.version || "N/A",
        uptime: response.data.uptime || 0,
      };
    } catch (error) {
      return {
        isUp: false,
        latency: 'N/A',
      };
    }
  };

  const randomIntInRange = (a, b) => {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  };

  const checkNodes = async () => {
    try {
      setIsLoading(true);
      // Get all configured backend nodes
      const nodes = getBackendNodes();
      const statuses = await Promise.all(nodes.map(async (node, index) => {
        const status = await measureLatency(node, "keepalive", "get");
        return {
          index,
          ...status,
          type: 'api',
          name: `Node ${index + 1}`,
        };
      }));

      // Check custom backend if enabled
      if (isUsingCustomBackend()) {
        const customUrl = getCustomBackendUrl();
        const status = await measureLatency(customUrl, "keepalive", "get");
        setCustomNodeStatus({
          ...status,
          type: 'custom',
          name: 'Custom Node',
        });
      } else {
        setCustomNodeStatus(null);
      }

      
      try {
        const dbApiUrl = import.meta.env.VITE_BASE_API_URL_DB;
        const status = await measureLatency(dbApiUrl, "status", "get");
        setDbApiStatus({
          ...status,
          type: 'db',
          name: 'Cơ sở dữ liệu',
        });
      } catch (error) {
        setDbApiStatus({
          isUp: false,
          latency: 'N/A',
          type: 'db',
          name: 'Cơ sở dữ liệu',
        });
      }

      setNodeStatuses(statuses);
    } catch (error) {
      console.error('Error checking nodes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkNodes();

    // Set up periodic checks every 5 minutes
    const interval = setInterval(checkNodes, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (uptime) => {
    if (uptime !== "N/A" && uptime !== 0){
      const now = Date.now();
      const seconds = Math.floor((now - uptime * 1000) / 1000);
      if (seconds < 60) return `${seconds} giây trước`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} phút trước`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} giờ trước`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days} ngày trước`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months} tháng trước`;
      const years = Math.floor(months / 12);
      return `${years} năm trước`;
    } else {
      return "N/A";
    }
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'custom':
        return <LuServerCog />;
      case 'db':
        return <BsDatabaseCheck />;
      default:
        return <GoServer />;
    }
  };

  const getBackgroundImage = (type) => {
    switch (type) {
      case 'custom':
        return "/custom.png";
      case 'db':
        return "/db.png";
      default:
        return `/node_random_image${randomIntInRange(1, 4)}.png`;
    }
  };

  const LoadingCard = () => (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-lg w-full min-h-[200px] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
      <div className="relative w-24 h-24 mb-4">
        <img 
          src="/node_random_image1.png" 
          alt="Server" 
          className="w-full h-full object-contain animate-pulse"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-blue-700 mb-2">Đang kiểm tra máy chủ...</h3>
        <p className="text-sm text-blue-600 opacity-75">Chờ một chút, Mafuyu đang kiểm tra máy chủ...</p>
      </div>
    </div>
  );

  const NodeCard = ({ data }) => (
    <div className={`relative flex items-center gap-4 p-6 rounded-lg w-full min-h-[120px] overflow-hidden ${
      data.isUp ? 'bg-green-100' : 'bg-red-100'
    } animate-fadeIn`}>
      {/* Background Image */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-32 opacity-60"
        style={{
          backgroundImage: `url("${getBackgroundImage(data.type)}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
          backgroundSize: 'contain'
        }}
      />
      
      {/* Content */}
      <div className="flex items-start gap-4 z-10">
        <div className={`w-3 h-3 rounded-full mt-1 ${
          data.isUp ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <div className="flex flex-col">
          <span className={`flex items-center gap-2 text-lg font-medium ${data.isUp ? 'text-green-700' : 'text-red-700'}`}>
            {getNodeIcon(data.type)} {data.name}
          </span>
          <span className="text-base text-gray-600 mt-2">Version: {data.version}</span>
          <span className="text-base text-gray-600 mt-2">Uptime: {formatUptime(data.uptime)}</span>
          <span className="text-base text-gray-600 mt-2">Latency: {data.latency}</span>
          <span className="text-sm text-gray-500 mt-1">Last checked: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Bảng thông tin trạng thái hoạt động của máy chủ</h2>
        <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-blue-700">Theo dõi trạng thái hoạt động của máy chủ</p>
          <p className="text-sm text-blue-600">
          Bảng thông tin này hiển thị trạng thái hoạt động của tất cả máy chủ.
          Độ trễ được đo theo thời gian thực bằng cách sử dụng số liệu hiệu suất.
          Dữ liệu được cập nhật sau mỗi 5 phút.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          {isLoading ? (
            <LoadingCard />
          ) : (
            <>
              {dbApiStatus && (
                <NodeCard data={dbApiStatus} />
              )}
              {customNodeStatus && (
                <NodeCard data={customNodeStatus} />
              )}
              {nodeStatuses.map((node) => (
                <NodeCard key={node.index} data={node} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeInfo;

// Add this at the end of the file
const styles = document.createElement('style');
styles.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(styles);
