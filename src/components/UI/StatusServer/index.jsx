import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../../../context/AppContext";
import BouncyLoader from "../Loading/Bouncy";
import * as utils from "../../../utils";
import { RiEmotionHappyLine } from "react-icons/ri";
import { TbMoodCrazyHappy } from "react-icons/tb";
import { getBackendNodes } from "../../../utils/backendConfig";

const StatusServer = () => {
  const { useloading } = useApp();
  const { isStatusServer, setIsStatusServer } = useloading;
  const [nodeStatuses, setNodeStatuses] = useState([]); // Track status as array to maintain order

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Get all configured backend nodes
        const nodes = getBackendNodes();
        const statuses = await Promise.all(nodes.map(async (node, index) => {
          try {
            const response = await axios.get(`${node}/keepalive`, {
              timeout: 5000
            });
            return { index, isUp: response.status === 200 };
          } catch (error) {
            return { index, isUp: false };
          }
        }));

        setNodeStatuses(statuses);
        setIsStatusServer(statuses.some(status => status.isUp));
      } catch (error) {
        setIsStatusServer(false);
      }
    };

    // Initial check
    checkServer();

    // Set up periodic checks
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  // If there's only one node or custom backend is used, show simple status
  const nodes = getBackendNodes();
  if (nodes.length <= 1) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {isStatusServer === null ? (
          <>
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-warning animate-bounce"></div>
            </div>
            <span className="text-orange-600 font-medium">
              Server is running <BouncyLoader size={20} color="orange" />{" "}
            </span>
          </>
        ) : isStatusServer ? (
          <>
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-success animate-ping"></div>
              <div className="status status-success"></div>
            </div>
            <span className="text-green-600 font-medium flex items-center">
              Server is live <RiEmotionHappyLine className="ml-1" />{" "}
            </span>
          </>
        ) : (
          <>
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-error"></div>
            </div>
            <span className="text-red-600 font-medium flex items-center">
              Server is down <TbMoodCrazyHappy className="ml-1" />{" "}
            </span>
          </>
        )}
      </div>
    );
  }

  // Show detailed status for multiple nodes
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        {isStatusServer === null ? (
          <>
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-warning animate-bounce"></div>
            </div>
            <span className="text-orange-600 font-medium">
              Checking servers <BouncyLoader size={20} color="orange" />{" "}
            </span>
          </>
        ) : isStatusServer ? (
          <>
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-success animate-ping"></div>
              <div className="status status-success"></div>
            </div>
            <span className="text-green-600 font-medium flex items-center">
              Load balancer active <RiEmotionHappyLine className="ml-1" />{" "}
            </span>
          </>
        ) : (
          <>
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-error"></div>
            </div>
            <span className="text-red-600 font-medium flex items-center">
              All servers down <TbMoodCrazyHappy className="ml-1" />{" "}
            </span>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        {nodeStatuses.map(({ index, isUp }) => (
          <div 
            key={index} 
            className={`flex items-center gap-2 p-2 rounded ${
              isUp ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              isUp ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={isUp ? 'text-green-700' : 'text-red-700'}>
              Node - {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusServer;
