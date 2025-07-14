import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Users, MessageSquare, Phone, Video, FileText, Image } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useNSVData } from '@/hooks/useNSVData';

export default function CollaborationScreen() {
  const { collaborationData } = useNSVData();
  const [message, setMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('field-team');
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (message.trim()) {
      // Here you would implement actual message sending
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const MessageBubble = ({ msg, isOwnMessage }: any) => (
    <View style={[
      styles.messageBubble,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      {!isOwnMessage && (
        <Text style={styles.messageAuthor}>{msg.author}</Text>
      )}
      <Text style={styles.messageText}>{msg.text}</Text>
      <Text style={styles.messageTime}>{msg.time}</Text>
    </View>
  );

  const UserCard = ({ user }: any) => (
    <View style={styles.userCard}>
      <View style={[styles.userAvatar, { backgroundColor: user.color }]}>
        <Text style={styles.userInitials}>{user.initials}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>
      <View style={[styles.statusIndicator, { backgroundColor: user.online ? '#10B981' : '#6B7280' }]} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1F2937" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Team Collaboration</Text>
          <Text style={styles.headerSubtitle}>{collaborationData.activeUsers} users online</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Phone size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Video size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Channel Selector */}
      <View style={styles.channelSelector}>
        {collaborationData.channels.map((channel) => (
          <TouchableOpacity
            key={channel.id}
            style={[
              styles.channelTab,
              activeChannel === channel.id && styles.activeChannelTab
            ]}
            onPress={() => setActiveChannel(channel.id)}
          >
            <MessageSquare size={16} color={activeChannel === channel.id ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[
              styles.channelText,
              activeChannel === channel.id && styles.activeChannelText
            ]}>
              {channel.name}
            </Text>
            {channel.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{channel.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Users */}
      <View style={styles.activeUsersContainer}>
        <Text style={styles.sectionTitle}>Active Users</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.usersList}>
          {collaborationData.users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <View style={styles.messagesContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {collaborationData.messages
            .filter(msg => msg.channel === activeChannel)
            .map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isOwnMessage={msg.author === 'You'}
              />
            ))}
        </ScrollView>
      </View>

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <FileText size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachButton}>
            <Image size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: message.trim() ? 1 : 0.5 }]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  channelSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  channelTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    gap: 6,
  },
  activeChannelTab: {
    backgroundColor: '#374151',
  },
  channelText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeChannelText: {
    color: '#3B82F6',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  unreadCount: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  activeUsersContainer: {
    padding: 20,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  usersList: {
    flexDirection: 'row',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 150,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitials: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1F2937',
  },
  messageAuthor: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    backgroundColor: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  attachButton: {
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});