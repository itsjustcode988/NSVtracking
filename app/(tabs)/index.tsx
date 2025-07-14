import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Wifi, MapPin, Zap, TriangleAlert as AlertTriangle, Plus, Navigation, Play, Square } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { LiveMapComponent } from '@/components/LiveMap';
import { DefectTagModal } from '@/components/DefectTagModal';
import { useNSVData } from '@/hooks/useNSVData';
import { useLocationTracking } from '@/hooks/useLocationTracking';

export default function LiveMapScreen() {
  const [isDefectModalVisible, setIsDefectModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { signalData, isConnected } = useNSVData();
  const {
    currentLocation,
    locationHistory,
    isTracking,
    hasPermission,
    error: locationError,
    startTracking,
    stopTracking,
    getDistanceTraveled,
  } = useLocationTracking();

  const handleMapPress = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    setIsDefectModalVisible(true);
  };

  const handleDefectSubmit = (defectData: any) => {
    // Add current location to defect data
    const defectWithLocation = {
      ...defectData,
      actualLocation: currentLocation,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Defect submitted:', defectWithLocation);
    Alert.alert('Success', 'Defect report submitted successfully');
    setIsDefectModalVisible(false);
  };

  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1F2937" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Live NSV Survey</Text>
          <View style={styles.connectionStatus}>
            <Wifi size={16} color={isConnected ? '#10B981' : '#EF4444'} />
            <Text style={[styles.connectionText, { color: isConnected ? '#10B981' : '#EF4444' }]}>
              {isConnected ? 'Connected' : 'Offline'}
            </Text>
            <Navigation size={16} color={hasPermission && currentLocation ? '#10B981' : '#EF4444'} />
            <Text style={[styles.connectionText, { color: hasPermission && currentLocation ? '#10B981' : '#EF4444' }]}>
              {hasPermission && currentLocation ? 'GPS Active' : 'No GPS'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, isTracking && styles.trackingActive]} 
            onPress={toggleTracking}
          >
            {isTracking ? (
              <Square size={20} color="#EF4444" />
            ) : (
              <Play size={20} color="#10B981" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Camera size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Signal Strength Indicators */}
      <View style={styles.metricsBar}>
        <View style={styles.metric}>
          <Zap size={18} color="#F59E0B" />
          <Text style={styles.metricValue}>{signalData.signalStrength}%</Text>
          <Text style={styles.metricLabel}>Signal</Text>
        </View>
        <View style={styles.metric}>
          <Wifi size={18} color="#10B981" />
          <Text style={styles.metricValue}>{signalData.coverage}%</Text>
          <Text style={styles.metricLabel}>Coverage</Text>
        </View>
        <View style={styles.metric}>
          <AlertTriangle size={18} color="#EF4444" />
          <Text style={styles.metricValue}>{signalData.anomalies}</Text>
          <Text style={styles.metricLabel}>Anomalies</Text>
        </View>
        <View style={styles.metric}>
          <MapPin size={18} color="#3B82F6" />
          <Text style={styles.metricValue}>
            {currentLocation ? `${currentLocation.accuracy?.toFixed(0) || 'N/A'}m` : 'N/A'}
          </Text>
          <Text style={styles.metricLabel}>GPS Accuracy</Text>
        </View>
      </View>

      {/* Location Info Bar */}
      {currentLocation && (
        <View style={styles.locationBar}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Current Position:</Text>
            <Text style={styles.locationCoords}>
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.locationStats}>
            <Text style={styles.locationStat}>
              Speed: {currentLocation.speed ? `${(currentLocation.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}
            </Text>
            <Text style={styles.locationStat}>
              Distance: {(getDistanceTraveled() / 1000).toFixed(2)} km
            </Text>
          </View>
        </View>
      )}

      {/* Location Error */}
      {locationError && (
        <View style={styles.errorBar}>
          <AlertTriangle size={16} color="#EF4444" />
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}
      {/* Live Map */}
      <View style={styles.mapContainer}>
        <LiveMapComponent
          signalData={signalData}
          currentLocation={currentLocation}
          locationHistory={locationHistory}
          isTracking={isTracking}
          onMapPress={handleMapPress}
        />
        
        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setIsDefectModalVisible(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Defect Tagging Modal */}
      <DefectTagModal
        visible={isDefectModalVisible}
        onClose={() => setIsDefectModalVisible(false)}
        onSubmit={handleDefectSubmit}
        location={selectedLocation || (currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  trackingActive: {
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  metricsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  locationBar: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  locationInfo: {
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  locationCoords: {
    fontSize: 14,
    color: '#3B82F6',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  locationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationStat: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  errorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#FEF2F2',
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});