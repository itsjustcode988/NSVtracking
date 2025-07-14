import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

export interface LocationTrackingState {
  currentLocation: LocationData | null;
  locationHistory: LocationData[];
  isTracking: boolean;
  hasPermission: boolean;
  error: string | null;
  accuracy: Location.LocationAccuracy;
}

export const useLocationTracking = () => {
  const [state, setState] = useState<LocationTrackingState>({
    currentLocation: null,
    locationHistory: [],
    isTracking: false,
    hasPermission: false,
    error: null,
    accuracy: Location.LocationAccuracy.High,
  });

  const watchSubscription = useRef<Location.LocationSubscription | null>(null);
  const locationHistoryRef = useRef<LocationData[]>([]);

  // Request location permissions
  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setState(prev => ({
          ...prev,
          error: 'Location permission denied',
          hasPermission: false,
        }));
        return false;
      }

      // Request background permissions for continuous tracking
      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      
      setState(prev => ({
        ...prev,
        hasPermission: true,
        error: null,
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Permission error: ${error}`,
        hasPermission: false,
      }));
      return false;
    }
  };

  // Start location tracking
  const startTracking = async () => {
    if (!state.hasPermission) {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;
    }

    try {
      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: state.accuracy,
      });

      const locationData: LocationData = {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
        altitude: initialLocation.coords.altitude,
        accuracy: initialLocation.coords.accuracy,
        speed: initialLocation.coords.speed,
        heading: initialLocation.coords.heading,
        timestamp: initialLocation.timestamp,
      };

      setState(prev => ({
        ...prev,
        currentLocation: locationData,
        isTracking: true,
        error: null,
      }));

      // Start continuous tracking
      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: state.accuracy,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every meter
        },
        (location) => {
          const newLocationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            accuracy: location.coords.accuracy,
            speed: location.coords.speed,
            heading: location.coords.heading,
            timestamp: location.timestamp,
          };

          // Add to history (keep last 1000 points)
          locationHistoryRef.current = [
            ...locationHistoryRef.current.slice(-999),
            newLocationData,
          ];

          setState(prev => ({
            ...prev,
            currentLocation: newLocationData,
            locationHistory: locationHistoryRef.current,
          }));
        }
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Tracking error: ${error}`,
        isTracking: false,
      }));
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
      watchSubscription.current = null;
    }

    setState(prev => ({
      ...prev,
      isTracking: false,
    }));
  };

  // Set tracking accuracy
  const setAccuracy = (accuracy: Location.LocationAccuracy) => {
    setState(prev => ({
      ...prev,
      accuracy,
    }));

    // Restart tracking with new accuracy if currently tracking
    if (state.isTracking) {
      stopTracking();
      setTimeout(() => startTracking(), 100);
    }
  };

  // Clear location history
  const clearHistory = () => {
    locationHistoryRef.current = [];
    setState(prev => ({
      ...prev,
      locationHistory: [],
    }));
  };

  // Get distance traveled
  const getDistanceTraveled = (): number => {
    if (locationHistoryRef.current.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < locationHistoryRef.current.length; i++) {
      const prev = locationHistoryRef.current[i - 1];
      const curr = locationHistoryRef.current[i];
      
      // Calculate distance using Haversine formula
      const R = 6371000; // Earth's radius in meters
      const dLat = (curr.latitude - prev.latitude) * Math.PI / 180;
      const dLon = (curr.longitude - prev.longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(prev.latitude * Math.PI / 180) * Math.cos(curr.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      totalDistance += distance;
    }

    return totalDistance;
  };

  // Initialize permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchSubscription.current) {
        watchSubscription.current.remove();
      }
    };
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking,
    setAccuracy,
    clearHistory,
    getDistanceTraveled,
    requestPermissions,
  };
};