import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../../src/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/services/api';
import { useSubjects } from '../../src/hooks/useSubjects';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

export default function ChatScreen() {
  const c = useColors();
  const { subjects } = useSubjects();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState('Friendly');
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

    const subjectId = subjects[0]._id; // Currently defaults to the first subject
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    
    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    saveMessages(updatedWithUser);
    setInput('');
    setLoading(true);

    try {
      // Map history excluding the initial welcome message
      const history = messages.filter(m => m.id !== '1').map(m => ({ role: m.role, content: m.content }));
      
      const res = await api.post('/chat', {
        subjectId,
        message: userMsg.content,
        history,
        personality
      });

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: res.data.data || res.data.response || "No response received." };
      const updatedWithAi = [...updatedWithUser, aiMsg];
      setMessages(updatedWithAi);
      saveMessages(updatedWithAi);
    } catch (err: any) {
      console.error('Chat API Error:', err.response?.data || err.message);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', content: "Oops, something went wrong connecting to the Guru. Please ensure the backend is running." }]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    }
  };

  const handlePersonalityChange = (newPersonality: string) => {
    setPersonality(newPersonality);
    setShowSettings(false);
    
    const msg: Message = { id: Date.now().toString(), role: 'ai', content: `Switched personality to ${newPersonality} mode!` };
    const updated = [...messages, msg];
    setMessages(updated);
    saveMessages(updated);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.outlineVariant + '25' }]}>
        <View style={styles.aiInfo}>
          <View style={[styles.aiAvatar, { backgroundColor: c.primaryContainer }]}>
            <Ionicons name="sparkles" size={18} color="#fff" />
          </View>
          <View>
            <Text style={[styles.aiTitle, { color: c.primary }]}>AI GURU</Text>
            <Text style={[styles.aiStatus, { color: c.success }]}>{personality} Mode · Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowSettings(!showSettings)}>
          <Ionicons name="options-outline" size={24} color={c.onSurface + '80'} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble,
            item.role === 'user'
              ? [styles.userBubble, { backgroundColor: c.primaryContainer }]
              : [styles.aiBubble, { backgroundColor: c.surfaceContainerHigh, borderColor: c.outlineVariant + '30' }]
          ]}>
            <Text style={[styles.bubbleText, { color: item.role === 'user' ? '#fff' : c.onSurface }]}>
              {item.content}
            </Text>
          </View>
        )}
        ListFooterComponent={loading ? (
          <View style={[styles.bubble, styles.aiBubble, { backgroundColor: c.surfaceContainerHigh, borderColor: c.outlineVariant + '30', alignSelf: 'flex-start', paddingVertical: 18, width: 80, alignItems: 'center' }]}>
            <ActivityIndicator size="small" color={c.primary} />
          </View>
        ) : null}
      />

      {/* Settings panel */}
      {showSettings && (
        <View style={[styles.settingsPanel, { backgroundColor: c.surfaceContainer }]}>
          <View style={styles.settingsHeader}>
            <Ionicons name="book" size={18} color={c.primary} />
            <Text style={[styles.settingsTitleText, { color: c.primary }]}>Guru Settings</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)} style={{ marginLeft: 'auto' }}>
              <Ionicons name="close" size={22} color={c.onSurface + '80'} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.settingsSubtitle, { color: c.onSurface + '50' }]}>Select Personality</Text>
          {['Friendly', 'Strict', 'Socratic', 'Panic'].map(item => (
            <TouchableOpacity key={item} onPress={() => handlePersonalityChange(item)} style={[styles.settingsItem, { borderBottomColor: c.outlineVariant + '25' }]}>
              <Text style={[styles.settingsItemText, { color: personality === item ? c.primary : c.onSurface }]}>{item} Mode</Text>
              {personality === item && <Ionicons name="checkmark" size={16} color={c.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <View style={[styles.inputBar, { borderTopColor: c.outlineVariant + '25', backgroundColor: c.background }]}>
          <TextInput
            style={[styles.input, { color: c.onSurface, backgroundColor: c.surfaceContainerHighest + '80', borderColor: c.outlineVariant + '30' }]}
            placeholder="Ask your Guru anything..."
            placeholderTextColor={c.onSurface + '40'}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: c.primaryContainer }, (!input.trim() || loading) && { opacity: 0.4 }]}
            disabled={!input.trim() || loading}
            onPress={handleSend}
          >
            <Ionicons name="send" size={18} color={c.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={{ height: 85 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  aiInfo: { flexDirection: 'row', alignItems: 'center' },
  aiAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  aiTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  aiStatus: { fontSize: 12, marginTop: 1 },
  settingsBtn: { padding: 8 },
  bubble: { padding: 14, borderRadius: 20, marginBottom: 10, maxWidth: '88%' },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1 },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 22 },
  settingsPanel: { position: 'absolute', bottom: 0, right: 0, width: 280, borderTopLeftRadius: 28, paddingTop: 24, paddingHorizontal: 24, paddingBottom: 32, zIndex: 50, shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16 },
  settingsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  settingsTitleText: { fontSize: 16, fontWeight: '900', marginLeft: 8 },
  settingsSubtitle: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 },
  settingsItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  settingsItemText: { fontSize: 14, fontWeight: '500' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, fontSize: 14, borderWidth: 1 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
