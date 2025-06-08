import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoServer } from "react-icons/go";
import { LuServerCog } from "react-icons/lu";
import { BsDatabaseCheck } from "react-icons/bs";
import { getBackendNodes, isUsingCustomBackend, getCustomBackendUrl } from '../../../utils/backendConfig';
import { API_URL } from '../../../utils/API/apiRoutes';

const NodeInfo = () => {
  const [nodeStatuses, setNodeStatuses] = useState([]);
  const [customNodeStatus, setCustomNodeStatus] = useState(null);
  const [dbApiStatus, setDbApiStatus] = useState(null);

  const measureLatency = async (url) => {
    try {
      const startTime = performance.now();
      const response = await axios.get(`${url}/keepalive`, {
        timeout: 5000
      });
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      return {
        isUp: response.status === 200,
        latency: `${latency}ms`,
      };
    } catch (error) {
      return {
        isUp: false,
        latency: 'N/A',
      };
    }
  };

  const checkNodes = async () => {
    try {
      // Get all configured backend nodes
      const nodes = getBackendNodes();
      const statuses = await Promise.all(nodes.map(async (node, index) => {
        const status = await measureLatency(node);
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
        const status = await measureLatency(customUrl);
        setCustomNodeStatus({
          ...status,
          type: 'custom',
          name: 'Custom Node',
        });
      } else {
        setCustomNodeStatus(null);
      }

      // Check DB API server using the configured URL from apiRoutes
      try {
        const dbApiUrl = import.meta.env.VITE_BASE_DB_API_URL || import.meta.env.VITE_BASE_API_URL;
        const status = await measureLatency(dbApiUrl);
        setDbApiStatus({
          ...status,
          type: 'db',
          name: 'DB API Server',
        });
      } catch (error) {
        setDbApiStatus({
          isUp: false,
          latency: 'N/A',
          type: 'db',
          name: 'DB API Server',
        });
      }

      setNodeStatuses(statuses);
    } catch (error) {
      console.error('Error checking nodes:', error);
    }
  };

  useEffect(() => {
    // Initial check
    checkNodes();

    // Set up periodic checks every 5 minutes
    const interval = setInterval(checkNodes, 300000);
    return () => clearInterval(interval);
  }, []);

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
        return "/node.png";
    }
  };

  const NodeCard = ({ data }) => (
    <div className={`relative flex items-center gap-4 p-6 rounded-lg w-full min-h-[120px] overflow-hidden ${
      data.isUp ? 'bg-green-100' : 'bg-red-100'
    }`}>
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
          <span className="text-base text-gray-600 mt-2">Latency: {data.latency}</span>
          <span className="text-sm text-gray-500 mt-1">Last checked: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Node Health Dashboard</h2>
        <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-blue-700">Real-time Node Monitoring</p>
          <p className="text-sm text-blue-600">
            This dashboard shows the health status of all backend nodes. 
            Latency is measured in real-time using performance metrics. 
            Data is updated every 5 minutes.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          {dbApiStatus && (
            <NodeCard data={dbApiStatus} />
          )}
          {customNodeStatus && (
            <NodeCard data={customNodeStatus} />
          )}
          {nodeStatuses.map((node) => (
            <NodeCard key={node.index} data={node} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NodeInfo;
