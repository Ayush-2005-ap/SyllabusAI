import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../../src/hooks/useColors';
import { Ionicons } from '@expo/vector-icons';

const MOCK_MESSAGES = [
  { id: '1', role: 'ai',   content: "Welcome back! I've analyzed your recent notes on Schrödinger's Equation. Ready to run a quick diagnostic quiz or should we dive into the derivations?" },
  { id: '2', role: 'user', content: "Let's try the diagnostic quiz first. I'm feeling a bit shaky on the probability density interpretations." },
  { id: '3', role: 'ai',   content: "Perfect. Question 1 of 5:\n\nWhat does the square of the absolute value of the wavefunction |ψ(x,t)|² represent?" },
];

const QUIZ_OPTIONS = [
  { id: 'a', text: 'Wave-Particle Duality', correct: false },
  { id: 'b', text: 'Probability Density',   correct: true  },
  { id: 'c', text: 'Quantum Superposition', correct: false },
  { id: 'd', text: 'Energy Eigenvalue',     correct: false },
];

export default function ChatScreen() {
  const c = useColors();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(true);

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
            <Text style={[styles.aiStatus, { color: c.success }]}>Socratic Mode · Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowSettings(!showSettings)}>
          <Ionicons name="options-outline" size={24} color={c.onSurface + '80'} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={MOCK_MESSAGES}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
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
        ListFooterComponent={showQuiz ? (
          <View style={[styles.quizCard, { backgroundColor: c.surfaceContainerHigh, borderColor: c.outlineVariant + '25' }]}>
            <Text style={[styles.quizQ, { color: c.onSurface + '70' }]}>Select the correct answer:</Text>
            {QUIZ_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.quizOption,
                  { backgroundColor: c.surfaceContainerHighest },
                  selectedOption === opt.id && (opt.correct
                    ? { backgroundColor: c.success + 'bb' }
                    : { backgroundColor: c.error + 'bb' }),
                ]}
                onPress={() => setSelectedOption(opt.id)}
              >
                <Text style={[styles.quizOptionText, { color: selectedOption === opt.id ? '#fff' : c.onSurface }]}>
                  {opt.text}
                </Text>
                {selectedOption === opt.id && (
                  <Ionicons name={opt.correct ? 'checkmark-circle' : 'close-circle'} size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      />

      {/* Settings panel */}
      {showSettings && (
        <View style={[styles.settingsPanel, { backgroundColor: c.surfaceContainer }]}>
          <View style={styles.settingsHeader}>
            <Ionicons name="book" size={18} color={c.primary} />
            <Text style={[styles.settingsTitleText, { color: c.primary }]}>The Digital Dean</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)} style={{ marginLeft: 'auto' }}>
              <Ionicons name="close" size={22} color={c.onSurface + '80'} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.settingsSubtitle, { color: c.onSurface + '50' }]}>Fall 2024</Text>
          {['Guru Personality', 'Difficulty Level', 'Academic Settings', 'Panic Mode Settings'].map(item => (
            <TouchableOpacity key={item} style={[styles.settingsItem, { borderBottomColor: c.outlineVariant + '25' }]}>
              <Text style={[styles.settingsItemText, { color: c.onSurface }]}>{item}</Text>
              <Ionicons name="chevron-forward" size={16} color={c.onSurface + '50'} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <View style={[styles.inputBar, { borderTopColor: c.outlineVariant + '25', backgroundColor: c.background }]}>
          <TouchableOpacity
            onPress={() => setShowQuiz(!showQuiz)}
            style={[styles.quizMeBtn, { borderColor: c.primaryContainer + '60' }]}
          >
            <Text style={[styles.quizMeBtnText, { color: c.primary }]}>Quiz Me</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: c.onSurface, backgroundColor: c.surfaceContainerHighest + '80', borderColor: c.outlineVariant + '30' }]}
            placeholder="Ask your Guru anything..."
            placeholderTextColor={c.onSurface + '40'}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: c.primaryContainer }, !input.trim() && { opacity: 0.4 }]}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={18} color={c.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={{ height: 80 }} />
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
  bubbleText: { fontSize: 14, lineHeight: 20 },
  quizCard: { borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1 },
  quizQ: { fontSize: 12, fontWeight: '700', marginBottom: 12, letterSpacing: 0.5 },
  quizOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 8 },
  quizOptionText: { fontSize: 14, fontWeight: '500' },
  settingsPanel: { position: 'absolute', bottom: 0, right: 0, width: 280, borderTopLeftRadius: 28, paddingTop: 24, paddingHorizontal: 24, paddingBottom: 32, zIndex: 50, shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16 },
  settingsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  settingsTitleText: { fontSize: 16, fontWeight: '900', marginLeft: 8 },
  settingsSubtitle: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 },
  settingsItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  settingsItemText: { fontSize: 14, fontWeight: '500' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  quizMeBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 9999, borderWidth: 1, marginRight: 8 },
  quizMeBtnText: { fontSize: 12, fontWeight: '700' },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, fontSize: 14, borderWidth: 1 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
