import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MapPin, Zap, TriangleAlert as AlertTriangle, Camera, Navigation, Target } from 'lucide-react-native';
import { LocationData } from '@/hooks/useLocationTracking';

const { width, height } = Dimensions.get('window');

interface LiveMapProps {
  signalData: any;
  currentLocation: LocationData | null;
  locationHistory: LocationData[];
  isTracking: boolean;
  onMapPress: (location: { lat: number; lng: number }) => void;
}

export const LiveMapComponent: React.FC<LiveMapProps> = ({ 
  signalData, 
  currentLocation, 
  locationHistory, 
  isTracking, 
  onMapPress 
}) => {
  const [selectedDefect, setSelectedDefect] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'satellite' | 'terrain'>('satellite');

  // Convert real location to screen coordinates
  const locationToScreen = (location: LocationData) => {
    if (!currentLocation) return { x: 50, y: 50 };
    
    // Simple conversion - in real app would use proper map projection
    const latDiff = location.latitude - currentLocation.latitude;
    const lngDiff = location.longitude - currentLocation.longitude;
    
    return {
      x: 50 + (lngDiff * 1000), // Scale factor for demo
      y: 50 + (latDiff * 1000),
    };
  };
  // Mock map data with better positioning
  const mockDefects = [
    { id: '1', lat: 40.7128, lng: -74.0060, type: 'signal_drop', severity: 'high', x: 25, y: 35 },
    { id: '2', lat: 40.7589, lng: -73.9851, type: 'antenna_damage', severity: 'critical', x: 70, y: 20 },
    { id: '3', lat: 40.7505, lng: -73.9934, type: 'cable_issue', severity: 'medium', x: 45, y: 65 },
    { id: '4', lat: 40.7200, lng: -74.0100, type: 'power_outage', severity: 'high', x: 15, y: 80 },
  ];

  const mockSignalStrength = [
    { area: 'zone1', strength: 85, x: 20, y: 25, radius: 60 },
    { area: 'zone2', strength: 92, x: 65, y: 30, radius: 70 },
    { area: 'zone3', strength: 78, x: 40, y: 70, radius: 55 },
    { area: 'zone4', strength: 95, x: 80, y: 50, radius: 65 },
    { area: 'zone5', strength: 45, x: 30, y: 85, radius: 40 },
  ];

  // Mock towers/infrastructure
  const mockTowers = [
    { id: 't1', name: 'Tower A12', x: 25, y: 35, status: 'active' },
    { id: 't2', name: 'Tower B7', x: 70, y: 20, status: 'maintenance' },
    { id: 't3', name: 'Tower C3', x: 45, y: 65, status: 'active' },
    { id: 't4', name: 'Tower D9', x: 80, y: 50, status: 'active' },
  ];

  const getSignalColor = (strength: number) => {
    if (strength >= 90) return '#10B981'; // Green
    if (strength >= 70) return '#F59E0B'; // Yellow
    if (strength >= 50) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getSignalOpacity = (strength: number) => {
    if (strength >= 90) return 0.4;
    if (strength >= 70) return 0.5;
    if (strength >= 50) return 0.6;
    return 0.7;
  };

  const getDefectColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getTowerColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'maintenance': return '#F59E0B';
      case 'offline': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleMapPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    // Convert screen coordinates to lat/lng
    let lat, lng;
    
    if (currentLocation) {
      // Use current location as reference
      lat = currentLocation.latitude + ((locationY / height) - 0.5) * 0.01;
      lng = currentLocation.longitude + ((locationX / width) - 0.5) * 0.01;
    } else {
      // Fallback to mock coordinates
      lat = 40.7128 + (locationY / height) * 0.1;
      lng = -74.0060 + (locationX / width) * 0.1;
    }
    
    onMapPress({ lat, lng });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mapArea} onPress={handleMapPress} activeOpacity={0.8}>
        {/* Map Background with Grid */}
        <View style={[styles.mapBackground, mapMode === 'satellite' ? styles.satelliteMode : styles.terrainMode]}>
          {/* Grid Lines */}
          <View style={styles.gridContainer}>
            {[...Array(8)].map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineVertical, { left: `${(i + 1) * 12.5}%` }]} />
            ))}
            {[...Array(6)].map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: `${(i + 1) * 16.66}%` }]} />
            ))}
          </View>

          {/* Map Labels */}
          <View style={styles.mapLabels}>
            <Text style={styles.mapTitle}>Live Network Survey</Text>
            <Text style={styles.mapCoordinates}>
              {currentLocation 
                ? `${currentLocation.latitude.toFixed(4)}°N, ${Math.abs(currentLocation.longitude).toFixed(4)}°W`
                : '40.7128°N, 74.0060°W'
              }
            </Text>
            {isTracking && (
              <View style={styles.trackingIndicator}>
                <View style={styles.trackingDot} />
                <Text style={styles.trackingText}>TRACKING</Text>
              </View>
            )}
          </View>
        </View>

        {/* Signal Strength Heatmap Overlay */}
        {mockSignalStrength.map((zone) => (
          <View
            key={zone.area}
            style={[
              styles.signalZone,
              {
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: zone.radius,
                height: zone.radius,
                backgroundColor: getSignalColor(zone.strength),
                opacity: getSignalOpacity(zone.strength),
                transform: [
                  { translateX: -zone.radius / 2 },
                  { translateY: -zone.radius / 2 }
                ],
              },
            ]}
          >
            <View style={styles.signalCenter}>
              <Text style={styles.signalStrength}>{zone.strength}%</Text>
            </View>
          </View>
        ))}

        {/* Tower Infrastructure */}
        {mockTowers.map((tower) => (
          <View
            key={tower.id}
            style={[
              styles.towerMarker,
              {
                left: `${tower.x}%`,
                top: `${tower.y}%`,
                borderColor: getTowerColor(tower.status),
              },
            ]}
          >
            <View style={[styles.towerIcon, { backgroundColor: getTowerColor(tower.status) }]}>
              <Navigation size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.towerLabel}>{tower.name}</Text>
          </View>
        ))}

        {/* Defect Markers */}
        {mockDefects.map((defect) => (
          <TouchableOpacity
            key={defect.id}
            style={[
              styles.defectMarker,
              {
                left: `${defect.x}%`,
                top: `${defect.y}%`,
                borderColor: getDefectColor(defect.severity),
                backgroundColor: selectedDefect === defect.id ? getDefectColor(defect.severity) : '#FFFFFF',
              },
            ]}
            onPress={() => setSelectedDefect(selectedDefect === defect.id ? null : defect.id)}
          >
            <AlertTriangle 
              size={16} 
              color={selectedDefect === defect.id ? '#FFFFFF' : getDefectColor(defect.severity)} 
            />
          </TouchableOpacity>
        ))}

        {/* Location History Trail */}
        {locationHistory.length > 1 && (
          <View style={styles.locationTrail}>
            {locationHistory.slice(-50).map((location, index) => {
              const screenPos = locationToScreen(location);
              return (
                <View
                  key={index}
                  style={[
                    styles.trailPoint,
                    {
                      left: `${Math.max(0, Math.min(100, screenPos.x))}%`,
                      top: `${Math.max(0, Math.min(100, screenPos.y))}%`,
                      opacity: 0.3 + (index / locationHistory.length) * 0.7,
                    },
                  ]}
                />
              );
            })}
          </View>
        )}
        {/* Current Location */}
        <View style={[
          styles.currentLocation,
          currentLocation && {
            left: `${locationToScreen(currentLocation).x}%`,
            top: `${locationToScreen(currentLocation).y}%`,
          }
        ]}>
          {isTracking && <View style={styles.currentLocationPulse} />}
          <View style={styles.currentLocationCenter}>
            <Target size={16} color="#3B82F6" />
          </View>
          {currentLocation && (
            <View style={styles.locationAccuracy}>
              <Text style={styles.accuracyText}>
                ±{currentLocation.accuracy?.toFixed(0) || '?'}m
              </Text>
            </View>
          )}
        </View>

        {/* Coverage Areas */}
        <View style={styles.coverageArea1} />
        <View style={styles.coverageArea2} />
      </TouchableOpacity>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => console.log('Zoom in')}>
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => console.log('Zoom out')}>
          <Text style={styles.controlText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={() => setMapMode(mapMode === 'satellite' ? 'terrain' : 'satellite')}
        >
          <Text style={styles.controlTextSmall}>
            {mapMode === 'satellite' ? 'SAT' : 'TER'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Layer Toggle */}
      <View style={styles.layerToggle}>
        <TouchableOpacity style={[styles.layerButton, styles.activeLayer]}>
          <Zap size={16} color="#F59E0B" />
          <Text style={styles.layerText}>Signal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.layerButton}>
          <AlertTriangle size={16} color="#EF4444" />
          <Text style={styles.layerText}>Defects</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.layerButton}>
          <Navigation size={16} color="#10B981" />
          <Text style={styles.layerText}>Towers</Text>
        </TouchableOpacity>
      </View>

      {/* Signal Strength Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Signal Strength</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>90-100%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>70-89%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F97316' }]} />
            <Text style={styles.legendText}>50-69%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>{'< 50%'}</Text>
          </View>
        </View>
      </View>

      {/* Selected Defect Info */}
      {selectedDefect && (
        <View style={styles.defectInfo}>
          <View style={styles.defectHeader}>
            <AlertTriangle size={20} color={getDefectColor(mockDefects.find(d => d.id === selectedDefect)?.severity || 'medium')} />
            <Text style={styles.defectTitle}>Defect Alert</Text>
            <TouchableOpacity onPress={() => setSelectedDefect(null)}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.defectDescription}>
            {mockDefects.find(d => d.id === selectedDefect)?.type.replace('_', ' ').toUpperCase()} detected at this location
          </Text>
          <Text style={styles.defectSeverity}>
            Severity: {mockDefects.find(d => d.id === selectedDefect)?.severity.toUpperCase()}
          </Text>
          <View style={styles.defectActions}>
            <TouchableOpacity style={styles.defectAction}>
              <Camera size={16} color="#3B82F6" />
              <Text style={styles.defectActionText}>Add Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.defectAction}>
              <MapPin size={16} color="#10B981" />
              <Text style={styles.defectActionText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
  },
  satelliteMode: {
    backgroundColor: '#1a1a2e',
  },
  terrainMode: {
    backgroundColor: '#2d5016',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#374151',
    opacity: 0.3,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#374151',
    opacity: 0.3,
  },
  mapLabels: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  mapTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mapCoordinates: {
    fontSize: 12,
    color: '#D1D5DB',
    fontFamily: 'monospace',
    marginTop: 4,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  trackingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  trackingText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  signalZone: {
    position: 'absolute',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  signalCenter: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  signalStrength: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  towerMarker: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  towerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  towerLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: 'center',
  },
  defectMarker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  locationTrail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  trailPoint: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  currentLocation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  currentLocationPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    opacity: 0.3,
  },
  currentLocationCenter: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  locationAccuracy: {
    position: 'absolute',
    top: -20,
    left: -15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  accuracyText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  coverageArea1: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '35%',
    height: '25%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  coverageArea2: {
    position: 'absolute',
    top: '60%',
    right: '15%',
    width: '30%',
    height: '20%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#374151',
  },
  controlText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  controlTextSmall: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  layerToggle: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    flexDirection: 'row',
    gap: 8,
  },
  layerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  activeLayer: {
    backgroundColor: '#374151',
    borderColor: '#3B82F6',
  },
  layerText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  legendTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItems: {
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#D1D5DB',
  },
  defectInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 80,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  defectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  defectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  closeButton: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  defectDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 4,
  },
  defectSeverity: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  defectActions: {
    flexDirection: 'row',
    gap: 12,
  },
  defectAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  defectActionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});