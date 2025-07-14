import { useState, useEffect } from 'react';

export const useNSVData = () => {
  const [signalData, setSignalData] = useState({
    signalStrength: 87,
    coverage: 94,
    anomalies: 3,
  });

  const [isConnected, setIsConnected] = useState(true);

  const [surveyStats] = useState({
    todayCount: 12,
    totalSurveys: 145,
    avgDuration: '2.5h',
    efficiency: 89,
    recentActivity: [
      {
        title: 'Signal drop detected',
        description: 'Coverage anomaly at Tower A12',
        location: 'Grid 4A',
        time: '2m ago',
        color: '#EF4444',
      },
      {
        title: 'Survey completed',
        description: 'Sector 5 inspection finished',
        location: 'Grid 5B',
        time: '15m ago',
        color: '#10B981',
      },
      {
        title: 'Equipment issue',
        description: 'Antenna alignment problem',
        location: 'Grid 3C',
        time: '32m ago',
        color: '#F59E0B',
      },
    ],
  });

  const [alerts] = useState([
    {
      id: '1',
      title: 'Critical Signal Drop',
      description: 'Signal strength dropped below 30% at Tower A12. Immediate attention required.',
      severity: 'critical',
      location: 'Grid 4A, Tower A12',
      time: '2m ago',
    },
    {
      id: '2',
      title: 'Equipment Malfunction',
      description: 'Antenna rotation mechanism not responding. Manual intervention needed.',
      severity: 'high',
      location: 'Grid 3C, Tower B7',
      time: '15m ago',
    },
    {
      id: '3',
      title: 'Coverage Gap Detected',
      description: 'Network coverage gap identified in residential area. Planning required.',
      severity: 'medium',
      location: 'Grid 5B, Sector 8',
      time: '32m ago',
    },
    {
      id: '4',
      title: 'Routine Maintenance Due',
      description: 'Scheduled maintenance window approaching for Tower C3.',
      severity: 'low',
      location: 'Grid 2A, Tower C3',
      time: '1h ago',
    },
    {
      id: '5',
      title: 'Power Fluctuation',
      description: 'Irregular power readings detected. Backup systems activated.',
      severity: 'high',
      location: 'Grid 1D, Tower D9',
      time: '2h ago',
    },
  ]);

  const [collaborationData] = useState({
    activeUsers: 8,
    channels: [
      { id: 'field-team', name: 'Field Team', unread: 2 },
      { id: 'control-room', name: 'Control Room', unread: 0 },
      { id: 'maintenance', name: 'Maintenance', unread: 1 },
    ],
    users: [
      { id: '1', name: 'John Smith', role: 'Field Engineer', initials: 'JS', color: '#3B82F6', online: true },
      { id: '2', name: 'Sarah Johnson', role: 'Tech Lead', initials: 'SJ', color: '#10B981', online: true },
      { id: '3', name: 'Mike Davis', role: 'Supervisor', initials: 'MD', color: '#F59E0B', online: false },
      { id: '4', name: 'Lisa Chen', role: 'Analyst', initials: 'LC', color: '#EF4444', online: true },
    ],
    messages: [
      {
        id: '1',
        channel: 'field-team',
        author: 'John Smith',
        text: 'Signal strength looking good in sector 4A. Moving to next location.',
        time: '2m ago',
      },
      {
        id: '2',
        channel: 'field-team',
        author: 'You',
        text: 'Copy that. Watch out for the power lines in that area.',
        time: '1m ago',
      },
      {
        id: '3',
        channel: 'control-room',
        author: 'Sarah Johnson',
        text: 'Reviewing the anomaly data from this morning. Everything looks within parameters.',
        time: '5m ago',
      },
      {
        id: '4',
        channel: 'field-team',
        author: 'Mike Davis',
        text: 'Team, remember to document all defects with photos. Quality control is important.',
        time: '10m ago',
      },
      {
        id: '5',
        channel: 'maintenance',
        author: 'Lisa Chen',
        text: 'Maintenance window scheduled for Tower C3 tomorrow 2-4 PM.',
        time: '15m ago',
      },
    ],
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalData(prev => ({
        ...prev,
        signalStrength: Math.max(50, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 10)),
        coverage: Math.max(80, Math.min(100, prev.coverage + (Math.random() - 0.5) * 5)),
      }));

      // Simulate connection status changes
      if (Math.random() < 0.05) {
        setIsConnected(prev => !prev);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    signalData,
    isConnected,
    surveyStats,
    alerts,
    collaborationData,
  };
};