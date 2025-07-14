import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Activity, MapPin, Clock, Download } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useNSVData } from '@/hooks/useNSVData';

export default function DashboardScreen() {
  const { signalData, surveyStats } = useNSVData();
  const [activeTab, setActiveTab] = useState('overview');

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon size={20} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statChange}>
        {change > 0 ? (
          <TrendingUp size={16} color="#10B981" />
        ) : (
          <TrendingDown size={16} color="#EF4444" />
        )}
        <Text style={[styles.changeText, { color: change > 0 ? '#10B981' : '#EF4444' }]}>
          {change > 0 ? '+' : ''}{change}%
        </Text>
      </View>
    </View>
  );

  const RecentActivity = ({ activity }: any) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIndicator, { backgroundColor: activity.color }]} />
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <View style={styles.activityMeta}>
          <MapPin size={12} color="#9CA3AF" />
          <Text style={styles.activityLocation}>{activity.location}</Text>
          <Clock size={12} color="#9CA3AF" />
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1F2937" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Survey Dashboard</Text>
          <Text style={styles.headerSubtitle}>Real-time NSV analytics</Text>
        </View>
        <TouchableOpacity style={styles.exportButton}>
          <Download size={20} color="#3B82F6" />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['overview', 'performance', 'locations'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Signal Strength"
            value={`${signalData.signalStrength}%`}
            change={+12}
            icon={Activity}
            color="#3B82F6"
          />
          <StatCard
            title="Coverage Area"
            value={`${signalData.coverage}%`}
            change={+8}
            icon={MapPin}
            color="#10B981"
          />
          <StatCard
            title="Anomalies"
            value={signalData.anomalies}
            change={-15}
            icon={TrendingDown}
            color="#EF4444"
          />
          <StatCard
            title="Surveys Today"
            value={surveyStats.todayCount}
            change={+25}
            icon={TrendingUp}
            color="#F59E0B"
          />
        </View>

        {/* Performance Chart Placeholder */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Signal Strength Over Time</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>Interactive chart would go here</Text>
            <Text style={styles.chartSubtext}>Real-time signal strength visualization</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {surveyStats.recentActivity.map((activity, index) => (
            <RecentActivity key={index} activity={activity} />
          ))}
        </View>

        {/* Survey Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Survey Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{surveyStats.totalSurveys}</Text>
              <Text style={styles.summaryLabel}>Total Surveys</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{surveyStats.avgDuration}</Text>
              <Text style={styles.summaryLabel}>Avg Duration</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{surveyStats.efficiency}%</Text>
              <Text style={styles.summaryLabel}>Efficiency</Text>
            </View>
          </View>
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  statCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flex: 1,
    minWidth: '45%',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    margin: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
  },
  chartText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  chartSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  activityContainer: {
    margin: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityLocation: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  summaryContainer: {
    margin: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});