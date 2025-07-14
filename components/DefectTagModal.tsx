import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { X, Camera, MapPin, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface DefectTagModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  location: { lat: number; lng: number } | null;
}

export const DefectTagModal: React.FC<DefectTagModalProps> = ({
  visible,
  onClose,
  onSubmit,
  location,
}) => {
  const [defectType, setDefectType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);

  const defectTypes = [
    { id: 'signal_drop', label: 'Signal Drop', icon: '📶' },
    { id: 'antenna_damage', label: 'Antenna Damage', icon: '📡' },
    { id: 'cable_issue', label: 'Cable Issue', icon: '🔌' },
    { id: 'power_outage', label: 'Power Outage', icon: '⚡' },
    { id: 'equipment_failure', label: 'Equipment Failure', icon: '⚠️' },
  ];

  const severityLevels = [
    { id: 'low', label: 'Low', color: '#10B981' },
    { id: 'medium', label: 'Medium', color: '#3B82F6' },
    { id: 'high', label: 'High', color: '#F59E0B' },
    { id: 'critical', label: 'Critical', color: '#EF4444' },
  ];

  const handleSubmit = () => {
    if (!defectType || !severity || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const defectData = {
      type: defectType,
      severity,
      description,
      location,
      photoTaken,
      timestamp: new Date().toISOString(),
    };

    onSubmit(defectData);
    resetForm();
  };

  const resetForm = () => {
    setDefectType('');
    setSeverity('');
    setDescription('');
    setPhotoTaken(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const takePhoto = () => {
    // In a real app, this would open the camera
    setPhotoTaken(true);
    Alert.alert('Success', 'Photo captured successfully');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Report Defect</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        {location && (
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#3B82F6" />
            <Text style={styles.locationText}>
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </Text>
          </View>
        )}

        {/* Defect Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Defect Type *</Text>
          <View style={styles.optionsGrid}>
            {defectTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionCard,
                  defectType === type.id && styles.selectedOption,
                ]}
                onPress={() => setDefectType(type.id)}
              >
                <Text style={styles.optionIcon}>{type.icon}</Text>
                <Text style={styles.optionLabel}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Severity Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Severity Level *</Text>
          <View style={styles.severityContainer}>
            {severityLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.severityOption,
                  { borderColor: level.color },
                  severity === level.id && { backgroundColor: level.color },
                ]}
                onPress={() => setSeverity(level.id)}
              >
                <Text style={[
                  styles.severityText,
                  severity === level.id && { color: '#FFFFFF' },
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe the defect in detail..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Photo Capture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo Evidence</Text>
          <TouchableOpacity
            style={[styles.photoButton, photoTaken && styles.photoTaken]}
            onPress={takePhoto}
          >
            <Camera size={24} color={photoTaken ? '#10B981' : '#3B82F6'} />
            <Text style={[styles.photoText, photoTaken && styles.photoTakenText]}>
              {photoTaken ? 'Photo Captured' : 'Take Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <AlertTriangle size={20} color="#FFFFFF" />
            <Text style={styles.submitText}>Submit Defect Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1F2937',
    margin: 20,
    padding: 12,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#374151',
    minWidth: '30%',
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E40AF',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  severityOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#1F2937',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: 100,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#374151',
  },
  photoTaken: {
    borderColor: '#10B981',
    backgroundColor: '#065F46',
  },
  photoText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  photoTakenText: {
    color: '#10B981',
  },
  footer: {
    padding: 20,
    marginTop: 'auto',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
  },
  submitText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});