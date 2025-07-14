import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert as AlertTriangle, Bell, CircleCheck as CheckCircle, Circle as XCircle, Clock, MapPin } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useNSVData } from '@/hooks/useNSVData';

export default function AlertsScreen() {
  const { alerts } = useNSVData();
  const [filter, setFilter] = useState('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return XCircle;
      case 'high': return AlertTriangle;
      case 'medium': return Bell;
      case 'low': return CheckCircle;
      default: return Bell;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const AlertCard = ({ alert }: any) => {
    const IconComponent = getSeverityIcon(alert.severity);
    const color = getSeverityColor(alert.severity);

    return (
      <View style={[styles.alertCard, { borderLeftColor: color }]}>
        <View style={styles.alertHeader}>
          <IconComponent size={20} color={color} />
          <View style={styles.alertInfo}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={[styles.alertSeverity, { color }]}>
              {alert.severity.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.alertTime}>{alert.time}</Text>
        </View>
        <Text style={styles.alertDescription}>{alert.description}</Text>
        <View style={styles.alertFooter}>
          <View style={styles.alertLocation}>
            <MapPin size={14} color="#9CA3AF" />
            <Text style={styles.locationText}>{alert.location}</Text>
          </View>
          <View style={styles.alertActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.acknowledgeButton]}>
              <Text style={styles.acknowledgeText}>Acknowledge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1F2937" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Alerts & Notifications</Text>
          <Text style={styles.headerSubtitle}>{filteredAlerts.length} active alerts</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Bell size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
          <TouchableOpacity
            key={severity}
            style={[
              styles.filterTab,
              filter === severity && styles.activeFilterTab,
              { borderColor: getSeverityColor(severity) }
            ]}
            onPress={() => setFilter(severity)}
          >
            <Text style={[
              styles.filterText,
              filter === severity && styles.activeFilterText,
              { color: filter === severity ? getSeverityColor(severity) : '#9CA3AF' }
            ]}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alert Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{alerts.filter(a => a.severity === 'critical').length}</Text>
          <Text style={styles.statLabel}>Critical</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{alerts.filter(a => a.severity === 'high').length}</Text>
          <Text style={styles.statLabel}>High</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{alerts.filter(a => a.severity === 'medium').length}</Text>
          <Text style={styles.statLabel}>Medium</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{alerts.filter(a => a.severity === 'low').length}</Text>
          <Text style={styles.statLabel}>Low</Text>
        </View>
      </View>

      {/* Alerts List */}
      <ScrollView style={styles.alertsList}>
        {filteredAlerts.length === 0 ? (
          <View style={styles.emptyState}>
            <CheckCircle size={48} color="#10B981" />
            <Text style={styles.emptyTitle}>No alerts found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' 
                ? 'All systems are operating normally' 
                : `No ${filter} severity alerts at this time`
              }
            </Text>
          </View>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))
        )}
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
  settingsButton: {
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#1F2937',
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  activeFilterTab: {
    backgroundColor: '#374151',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  alertsList: {
    flex: 1,
    padding: 20,
  },
  alertCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertInfo: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  alertSeverity: {
    fontSize: 12,
    fontWeight: '700',
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#374151',
  },
  acknowledgeButton: {
    backgroundColor: '#3B82F6',
  },
  actionText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  acknowledgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
});