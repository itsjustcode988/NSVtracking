import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, Wifi, Database, Shield, MapPin, Camera, Download, LogOut } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [gpsTracking, setGpsTracking] = useState(true);

  const SettingsGroup = ({ title, children }: any) => (
    <View style={styles.settingsGroup}>
      <Text style={styles.groupTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingsItem = ({ icon: Icon, title, subtitle, onPress, showSwitch, switchValue, onSwitchChange }: any) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <Icon size={20} color="#3B82F6" />
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#374151', true: '#3B82F6' }}
          thumbColor={switchValue ? '#FFFFFF' : '#9CA3AF'}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1F2937" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Configure your NSV app</Text>
        </View>
        <Settings size={24} color="#3B82F6" />
      </View>

      <ScrollView style={styles.content}>
        {/* Notifications */}
        <SettingsGroup title="Notifications">
          <SettingsItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive alerts for anomalies and updates"
            showSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
          />
        </SettingsGroup>

        {/* Data & Sync */}
        <SettingsGroup title="Data & Sync">
          <SettingsItem
            icon={Wifi}
            title="Auto Sync"
            subtitle="Automatically sync data when connected"
            showSwitch={true}
            switchValue={autoSync}
            onSwitchChange={setAutoSync}
          />
          <SettingsItem
            icon={Database}
            title="Offline Mode"
            subtitle="Enable offline data collection"
            showSwitch={true}
            switchValue={offlineMode}
            onSwitchChange={setOfflineMode}
          />
          <SettingsItem
            icon={Download}
            title="Data Export"
            subtitle="Export survey data and reports"
            onPress={() => console.log('Export data')}
          />
        </SettingsGroup>

        {/* Location & Camera */}
        <SettingsGroup title="Location & Camera">
          <SettingsItem
            icon={MapPin}
            title="GPS Tracking"
            subtitle="Enable precise location tracking"
            showSwitch={true}
            switchValue={gpsTracking}
            onSwitchChange={setGpsTracking}
          />
          <SettingsItem
            icon={Camera}
            title="Camera Settings"
            subtitle="Configure photo quality and storage"
            onPress={() => console.log('Camera settings')}
          />
        </SettingsGroup>

        {/* Accessibility */}
        <SettingsGroup title="Accessibility">
          <SettingsItem
            icon={Shield}
            title="High Contrast Mode"
            subtitle="Improve visibility in bright conditions"
            showSwitch={true}
            switchValue={highContrast}
            onSwitchChange={setHighContrast}
          />
        </SettingsGroup>

        {/* Account */}
        <SettingsGroup title="Account">
          <SettingsItem
            icon={LogOut}
            title="Sign Out"
            subtitle="Log out of your account"
            onPress={() => console.log('Sign out')}
          />
        </SettingsGroup>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>NSV Mobile App v1.0.0</Text>
          <Text style={styles.appBuild}>Build 2024.1.1</Text>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  settingsGroup: {
    marginTop: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingsContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    padding: 40,
  },
  appVersion: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  appBuild: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});