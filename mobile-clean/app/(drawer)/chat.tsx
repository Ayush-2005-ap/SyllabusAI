import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';

const MOCK_MESSAGES = [
  {
    id: '1', role: 'ai',
    content: "Welcome back! I've analyzed your recent notes on Schrödinger's Equation. Ready to run a quick diagnostic quiz or should we dive into the derivations?"
  },
  {
    id: '2', role: 'user',
    content: "Let's try the diagnostic quiz first. I'm feeling a bit shaky on the probability density interpretations."
  },
  {
    id: '3', role: 'ai',
    content: "Perfect. Question 1 of 5:\n\nWhat does the square of the absolute value of the wavefunction |ψ(x,t)|² represent?"
  },
];

const QUIZ_OPTIONS = [
  { id: 'a', text: 'Wave-Particle Duality', correct: false },
  { id: 'b', text: 'Probability Density', correct: true },
  { id: 'c', text: 'Quantum Superposition', correct: false },
  { id: 'd', text: 'Energy Eigenvalue', correct: false },
];

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.aiInfo}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={18} color="#fff" />
          </View>
          <View>
            <Text style={styles.aiTitle}>AI GURU</Text>
            <Text style={styles.aiStatus}>Socratic Mode · Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowSettings(!showSettings)}>
          <Ionicons name="options-outline" size={24} color={colors.onSurface + '80'} />
        </TouchableOpacity>
      </View>

      {/* ── Chat messages ── */}
      <FlatList
        data={MOCK_MESSAGES}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.bubbleText, item.role === 'user' ? styles.userBubbleText : styles.aiBubbleText]}>
              {item.content}
            </Text>
          </View>
        )}
        ListFooterComponent={showQuiz ? (
          <View style={styles.quizCard}>
            <Text style={styles.quizQ}>Select the correct answer:</Text>
            {QUIZ_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.quizOption,
                  selectedOption === opt.id && (opt.correct ? styles.quizCorrect : styles.quizWrong),
                ]}
                onPress={() => setSelectedOption(opt.id)}
              >
                <Text style={[styles.quizOptionText, selectedOption === opt.id && { color: '#fff' }]}>
                  {opt.text}
                </Text>
                {selectedOption === opt.id && (
                  <Ionicons
                    name={opt.correct ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color="#fff"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      />

      {/* ── Settings drawer slide-in ── */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <View style={styles.settingsHeader}>
            <Ionicons name="book" size={18} color={colors.primary} />
            <Text style={styles.settingsTitleText}>The Digital Dean</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)} style={{ marginLeft: 'auto' }}>
              <Ionicons name="close" size={22} color={colors.onSurface + '80'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.settingsSubtitle}>Fall 2024</Text>
          {['Guru Personality', 'Difficulty Level', 'Academic Settings', 'Panic Mode Settings'].map(item => (
            <TouchableOpacity key={item} style={styles.settingsItem}>
              <Text style={styles.settingsItemText}>{item}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.onSurface + '50'} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Input bar ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputBar}>
          <TouchableOpacity onPress={() => setShowQuiz(!showQuiz)} style={styles.quizMeBtn}>
            <Text style={styles.quizMeBtnText}>Quiz Me</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask your Guru anything..."
            placeholderTextColor={colors.onSurface + '40'}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '25',
  },
  aiInfo: { flexDirection: 'row', alignItems: 'center' },
  aiAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  aiTitle: { fontSize: 11, fontWeight: '900', color: colors.primary, letterSpacing: 2 },
  aiStatus: { fontSize: 12, color: colors.success, marginTop: 1 },
  settingsBtn: { padding: 8 },

  chatList: { padding: 16, paddingBottom: 8 },
  bubble: { padding: 14, borderRadius: 20, marginBottom: 10, maxWidth: '88%' },
  aiBubble: {
    backgroundColor: colors.surfaceContainerHigh,
    alignSelf: 'flex-start', borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  userBubble: {
    backgroundColor: colors.primaryContainer,
    alignSelf: 'flex-end', borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  aiBubbleText: { color: colors.onSurface },
  userBubbleText: { color: '#fff' },

  quizCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 20, padding: 16, marginHorizontal: 0, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  quizQ: { fontSize: 12, fontWeight: '700', color: colors.onSurface + '70', marginBottom: 12, letterSpacing: 0.5 },
  quizOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 14, padding: 14, marginBottom: 8,
  },
  quizCorrect: { backgroundColor: colors.success + 'aa' },
  quizWrong: { backgroundColor: colors.error + 'aa' },
  quizOptionText: { fontSize: 14, color: colors.onSurface, fontWeight: '500' },

  settingsPanel: {
    position: 'absolute', bottom: 0, right: 0,
    width: 280, backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: 28, paddingTop: 24, paddingHorizontal: 24, paddingBottom: 32,
    zIndex: 50,
    shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.2, shadowRadius: 16,
  },
  settingsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  settingsTitleText: { fontSize: 16, fontWeight: '900', color: colors.primary, marginLeft: 8 },
  settingsSubtitle: { fontSize: 10, color: colors.onSurface + '50', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 },
  settingsItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant + '25',
  },
  settingsItemText: { fontSize: 14, color: colors.onSurface, fontWeight: '500' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 14, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: colors.outlineVariant + '25',
    backgroundColor: colors.background,
  },
  quizMeBtn: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1, borderColor: colors.primaryContainer + '60',
    marginRight: 8,
  },
  quizMeBtnText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHighest + '80',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    maxHeight: 100, color: colors.onSurface, fontSize: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
});
