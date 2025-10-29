import NetInfo from '@react-native-community/netinfo';

/**
 * Check if device is connected to the internet
 * @returns Promise<boolean> - true if connected, false otherwise
 */
export const checkInternetConnection = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

/**
 * Subscribe to network state changes
 * @param callback - Function to call when network state changes
 * @returns Unsubscribe function
 */
export const subscribeToNetworkChanges = (
  callback: (isConnected: boolean) => void
) => {
  return NetInfo.addEventListener(state => {
    callback(state.isConnected ?? false);
  });
};

/**
 * Get detailed network information
 */
export const getNetworkInfo = async () => {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected ?? false,
    type: state.type,
    isInternetReachable: state.isInternetReachable ?? false,
  };
};
