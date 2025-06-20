import { useState, useEffect } from "react";
import { Alert } from "react-native";

interface NetworkLog {
  id: string;
  timestamp: Date;
  url: string;
  method: string;
  status?: number;
  requestData?: any;
  responseData?: any;
  error?: string;
}

// Global store for network logs
let networkLogs: NetworkLog[] = [];
let debugSubscribers: Array<(logs: NetworkLog[]) => void> = [];

export const addNetworkLog = (log: Omit<NetworkLog, "id" | "timestamp">) => {
  const newLog: NetworkLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: new Date(),
  };

  networkLogs = [newLog, ...networkLogs.slice(0, 49)]; // Keep only last 50 logs

  // Notify subscribers
  debugSubscribers.forEach(subscriber => subscriber([...networkLogs]));

  // Console log for debugging
  console.log("🌐 Network Request:", {
    url: log.url,
    method: log.method,
    status: log.status,
    data: log.responseData,
  });
};

export const useNetworkDebug = () => {
  const [logs, setLogs] = useState<NetworkLog[]>([...networkLogs]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const subscriber = (newLogs: NetworkLog[]) => {
      setLogs(newLogs);
    };

    debugSubscribers.push(subscriber);

    return () => {
      debugSubscribers = debugSubscribers.filter(s => s !== subscriber);
    };
  }, []);

  const showLatestResponse = () => {
    const latest = logs[0];
    if (latest) {
      Alert.alert(
        `Network Response - ${latest.method} ${latest.url}`,
        `Status: ${latest.status}\n\nResponse:\n${JSON.stringify(latest.responseData, null, 2)}`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert("No network requests found");
    }
  };

  const showAllLogs = () => {
    const logSummary = logs
      .slice(0, 10)
      .map(log => `${log.method} ${log.url} - ${log.status || "pending"}`)
      .join("\n");

    Alert.alert("Recent Network Requests", logSummary || "No recent requests", [
      { text: "OK" },
    ]);
  };

  const clearLogs = () => {
    networkLogs = [];
    setLogs([]);
  };

  return {
    logs,
    showLatestResponse,
    showAllLogs,
    clearLogs,
    totalRequests: logs.length,
  };
};
