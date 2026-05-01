import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '../../src/hooks/useColors';
import { useSubjects } from '../../src/hooks/useSubjects';
import { useAppContext } from '../../src/hooks/useAppContext';
import api from '../../src/services/api';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

export default function ChatScreen() {
  const c = useColors();
  const { subjects } = useSubjects();
  const { settings, panicMode } = useAppContext();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const personality = panicMode ? 'Panic' : (settings.personality.charAt(0).toUpperCase() + settings.personality.slice(1));
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: "Hello! I am your AI Guru. I have analyzed your syllabus documents. What would you like to learn today?" }
  ]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const saved = await AsyncStorage.getItem('@guru_chat_history');
        if (saved) {
          setMessages(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    };
    loadMessages();
  }, []);

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem('@guru_chat_history', JSON.stringify(newMessages));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (subjects.length === 0) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: "Please add a subject and upload a syllabus first before we can chat!" }]);
      setInput('');
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    saveMessages(updatedWithUser);
    setInput('');
    setLoading(true);

    try {
      const subjectId = subjects[0]._id; // Default to first subject
      const history = messages.filter(m => m.id !== '1').map(m => ({ role: m.role, content: m.content }));
      
      const res = await api.post('/chat', {
        subjectId,
        message: userMsg.content,
        personality,
        history,
      });

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: res.data.data || res.data.response || "No response received." 
      };
      const updatedWithAi = [...updatedWithUser, aiMsg];
      setMessages(updatedWithAi);
      saveMessages(updatedWithAi);
      
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (err: any) {
      console.error('Chat API Error:', err.response?.data || err.message);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: "Oops, something went wrong connecting to the Guru. Please ensure the backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.outlineVariant + '20' }]}>
        <View style={styles.aiInfo}>
          <View style={[styles.aiAvatar, { backgroundColor: c.primaryContainer }]}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </View>
          <View>
            <Text style={[styles.aiTitle, { color: c.primary }]}>AI GURU</Text>
            <Text style={[styles.aiStatus, { color: c.onSurface + '60' }]}>
              {loading ? 'Thinking...' : `${personality} Mode`}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowSettings(!showSettings)}>
          <Ionicons name="options-outline" size={24} color={c.onSurface} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={loading ? [...messages, { id: 'loading', role: 'ai', content: '...' }] : messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble,
            item.role === 'user' 
              ? [styles.userBubble, { backgroundColor: c.primaryContainer }] 
              : [styles.aiBubble, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '20' }]
          ]}>
            {item.id === 'loading' ? (
              <ActivityIndicator size="small" color={c.primary} style={{ padding: 4 }} />
            ) : (
              <Text style={[
                styles.bubbleText, 
                { color: item.role === 'user' ? '#fff' : c.onSurface }
              ]}>
                {item.content}
              </Text>
            )}
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <View style={[styles.inputBar, { backgroundColor: c.background, borderTopColor: c.outlineVariant + '20' }]}>
          <TextInput
            style={[styles.input, { color: c.onSurface, backgroundColor: c.surfaceContainerHighest + '50', borderColor: c.outlineVariant + '20' }]}
            placeholder="Ask your Guru anything..."
            placeholderTextColor={c.onSurface + '40'}
            value={input}
            onChangeText={setInput}
            multiline={false}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity 
            onPress={handleSend}
            disabled={!input.trim() || loading}
            style={[styles.sendBtn, { backgroundColor: c.primaryContainer }, (!input.trim() || loading) && { opacity: 0.4 }]}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Settings Overlay */}
      {showSettings && (
        <View style={[styles.settingsPanel, { backgroundColor: c.surfaceContainerHigh }]}>
          <View style={styles.settingsHeader}>
            <Text style={[styles.settingsTitle, { color: c.onSurface }]}>Guru Personality</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => { setShowSettings(false); router.push('/settings/ai-personality'); }}
          >
            <Text style={[styles.settingItemText, { color: c.onSurface }]}>Change Personality</Text>
            <Ionicons name="chevron-forward" size={18} color={c.onSurface + '40'} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: c.outlineVariant + '30' }]} />
          
          <TouchableOpacity style={styles.settingLink} onPress={() => { setShowSettings(false); router.push('/settings/academic-settings'); }}>
            <Ionicons name="settings-outline" size={16} color={c.onSurface + '80'} />
            <Text style={[styles.settingLinkText, { color: c.onSurface + '80' }]}>Academic Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingLink} onPress={() => { setShowSettings(false); router.push('/settings/notification-prefs'); }}>
            <Ionicons name="notifications-outline" size={16} color={c.onSurface + '80'} />
            <Text style={[styles.settingLinkText, { color: c.onSurface + '80' }]}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingLink} onPress={() => { setShowSettings(false); router.push('/settings/panic-mode'); }}>
            <Ionicons name="flash-outline" size={16} color={c.error} />
            <Text style={[styles.settingLinkText, { color: c.error }]}>Panic Mode</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  aiInfo: { flexDirection: 'row', alignItems: 'center' },
  aiAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  aiTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  aiStatus: { fontSize: 12, marginTop: 1 },
  settingsBtn: { padding: 8 },
  messageList: { padding: 20, paddingBottom: 30 },
  bubble: { padding: 14, borderRadius: 20, marginBottom: 10, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleText: { fontSize: 14, lineHeight: 22 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, marginBottom: 80 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, fontSize: 14, borderWidth: 1 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  settingsPanel: { position: 'absolute', top: 70, right: 20, borderRadius: 16, padding: 16, width: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5, zIndex: 10 },
  settingsTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  settingItemText: { fontSize: 15, fontWeight: '500' },
  divider: { height: 1, marginVertical: 12 },
  settingLink: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  settingLinkText: { fontSize: 13, fontWeight: '600', marginLeft: 10 },
});
