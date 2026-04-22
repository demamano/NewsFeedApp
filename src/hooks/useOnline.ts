import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useOnline(): boolean {
  const [online, setOnline] = useState<boolean>(true);
  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      const isConnected =
        state.isConnected !== false && state.isInternetReachable !== false;
      setOnline(!!isConnected);
    });
    NetInfo.fetch().then(state => {
      const isConnected =
        state.isConnected !== false && state.isInternetReachable !== false;
      setOnline(!!isConnected);
    });
    return () => unsub();
  }, []);
  return online;
}
