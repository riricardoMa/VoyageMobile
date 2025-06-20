import React, {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { Alert } from "react-native";
import { NetworkService } from "./NetworkService";
import type { NetworkError } from "./types/NetworkTypes";

interface NetworkContextType {
  networkService: NetworkService;
  isOnline: boolean;
  globalError: NetworkError | null;
  clearGlobalError: () => void;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

interface NetworkProviderProps extends PropsWithChildren {
  baseURL: string;
  enableGlobalErrorHandling?: boolean;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
  baseURL,
  enableGlobalErrorHandling = true,
}) => {
  const [networkService] = useState(() => new NetworkService(baseURL));
  const [isOnline, setIsOnline] = useState(true);
  const [globalError, setGlobalError] = useState<NetworkError | null>(null);

  const clearGlobalError = () => setGlobalError(null);

  // Setup global error handler
  React.useEffect(() => {
    if (enableGlobalErrorHandling) {
      networkService.setGlobalErrorHandler((error: NetworkError) => {
        setGlobalError(error);

        // Show user-friendly error alerts
        if (error.statusCode === 401) {
          Alert.alert("Authentication Error", "Please log in again.");
        } else if (error.statusCode === 403) {
          Alert.alert(
            "Permission Denied",
            "You do not have permission to perform this action."
          );
        } else if (error.statusCode === 500) {
          Alert.alert(
            "Server Error",
            "Something went wrong. Please try again later."
          );
        } else if (!error.statusCode) {
          Alert.alert(
            "Network Error",
            "Please check your internet connection."
          );
        } else if (error.statusCode >= 400 && error.statusCode < 500) {
          Alert.alert("Request Error", error.message);
        }
      });
    }
  }, [networkService, enableGlobalErrorHandling]);

  const value = {
    networkService,
    isOnline,
    globalError,
    clearGlobalError,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};
