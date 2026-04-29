import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../../src/hooks/useColors';
import { useSchedule } from '../../../src/hooks/useSchedule';
import { useSubjects } from '../../../src/hooks/useSubjects';
import { Badge } from '../../../src/components/common/Badge';
import * as DocumentPicker from 'expo-document-picker';
import api from '../../../src/services/api';
import { Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TABS = ['Topics', 'Chat', 'PYQ Analysis', 'Schedule', 'Quiz'];

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const colors = useColors();
  const styles = getStyles(colors);
  const { scheduleBlocks, fetchSchedule, updateBlock, generateSchedule, loading: scheduleLoading, fetchStats } = useSchedule();
  const { subjects, fetchTopics, topics, uploadSyllabus, updateTopic, fetchSubjects, deleteSubject } = useSubjects();
  const [activeTab, setActiveTab] = useState('Topics');
  const [isUploading, setIsUploading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatPersonality, setChatPersonality] = useState('Friendly');
  const [activeQuiz, setActiveQuiz] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const chatScrollRef = React.useRef<ScrollView>(null);
  const router = useRouter();

  const subject = subjects.find(s => s._id === id);
  const subjectTopics = topics[id as string] || [];

  useEffect(() => {
    const loadSubjectChat = async () => {
      try {
        if (!id) return;
        const saved = await AsyncStorage.getItem(`@guru_chat_${id}`);
        if (saved) setChatMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load chat', e);
      }
    };
    loadSubjectChat();
  }, [id]);

  const saveSubjectChat = async (newMsgs: any[]) => {
    try {
      if (!id) return;
      await AsyncStorage.setItem(`@guru_chat_${id}`, JSON.stringify(newMsgs));
    } catch (e) {
      console.error('Failed to save chat', e);
    }
  };

  const handleUploadSyllabus = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const file = result.assets[0];
      setIsUploading(true);
      
      await uploadSyllabus(
        id as string,
        file.uri,
        file.name,
        file.mimeType || 'application/pdf'
      );
      
      Alert.alert('Success', 'Syllabus uploaded and topics extracted successfully!');
      fetchTopics(id as string);
    } catch (err: any) {
      console.error('Upload error:', err);
      Alert.alert('Upload Failed', err.response?.data?.message || 'Failed to process syllabus. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleTopic = async (topicId: string, currentStatus: boolean) => {
    try {
      await updateTopic(topicId, { isCompleted: !currentStatus });
      fetchStats();
    } catch (err: any) {
      Alert.alert('Error', 'Failed to update topic status');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: chatInput };
    const updatedWithUser = [...chatMessages, userMsg];
    setChatMessages(updatedWithUser);
    saveSubjectChat(updatedWithUser);
    
    const currentInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await api.post('/chat', {
        subjectId: id,
        message: currentInput,
        history: chatMessages.slice(-5).map(m => ({ role: m.role, content: m.content })),
        personality: chatPersonality
      });

      const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', content: res.data.data };
      const updatedWithAi = [...updatedWithUser, aiMsg];
      setChatMessages(updatedWithAi);
      saveSubjectChat(updatedWithAi);
    } catch (err) {
      console.error('Chat error:', err);
      Alert.alert('Chat Failed', 'Could not get a response from Guru.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleUploadPYQ = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      setIsUploading(true);
      
      const formData = new FormData();
      result.assets.forEach((file, index) => {
        formData.append('pyqs', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf'
        } as any);
      });

      await api.post(`/topics/pyq/analyze/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      Alert.alert('Success', 'PYQ papers analyzed and topic probabilities updated!');
      fetchTopics(id as string);
      fetchSubjects();
    } catch (err: any) {
      console.error('PYQ Analysis error:', err);
      Alert.alert('Analysis Failed', err.response?.data?.message || 'Failed to process PYQ papers.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartQuiz = async () => {
    setIsQuizLoading(true);
    setQuizScore(null);
    try {
      const res = await api.post('/quiz/generate', { subjectId: id });
      setActiveQuiz(res.data.data);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error('Quiz Gen Error:', err);
      Alert.alert('Quiz Failed', 'Could not generate questions. Check if syllabus is uploaded.');
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (currentQuestionIndex < activeQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished
      setQuizScore(Math.floor(Math.random() * 40) + 60); // Mock final score
      setActiveQuiz([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTopics(id as string);
      fetchSubjects(); // Ensure we have latest stats
      fetchSchedule();
    }
  }, [id, fetchTopics, fetchSubjects, fetchSchedule]);

  useEffect(() => {
    if (activeTab === 'Chat') {
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages, isChatLoading, activeTab]);

  if (!subject) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Topics':
        return (
          <View style={styles.tabContent}>
            {subjectTopics.length > 0 ? (
              subjectTopics.map((topic, index) => (
                <View key={topic._id || index} style={[styles.topicItem, topic.isCompleted && styles.completedTopicItem]}>
                  <TouchableOpacity 
                    style={styles.checkbox} 
                    onPress={() => handleToggleTopic(topic._id, !!topic.isCompleted)}
                  >
                    <Ionicons 
                      name={topic.isCompleted ? "checkbox" : "square-outline"} 
                      size={24} 
                      color={topic.isCompleted ? colors.success : colors.textSecondary} 
                    />
                  </TouchableOpacity>
                  <View style={styles.topicInfo}>
                    <Text style={[styles.topicName, topic.isCompleted && styles.completedTopicText]}>{topic.name}</Text>
                    <View style={styles.topicMeta}>
                      <Badge label={topic.difficulty} type={topic.difficulty === 'Hard' ? 'danger' : 'success'} />
                      <Text style={styles.topicHours}>{topic.estimatedHours}h estimated</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.topicAction}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No topics extracted yet</Text>
                <TouchableOpacity 
                  style={[styles.uploadBtn, isUploading && { opacity: 0.7 }]} 
                  onPress={handleUploadSyllabus}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.uploadBtnText}>Upload Syllabus PDF</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 'Chat':
        return (
          <View style={[styles.tabContent, { padding: 0 }]}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>AI Learning Guru</Text>
              <Text style={styles.chatSubtitle}>Teaching from your syllabus</Text>
            </View>
            <ScrollView 
              style={styles.chatMessages} 
              contentContainerStyle={{ padding: 16 }}
              ref={chatScrollRef}
            >
              {chatMessages.length === 0 ? (
                <View style={styles.chatEmpty}>
                  <Ionicons name="sparkles-outline" size={40} color={colors.primary} />
                  <Text style={styles.chatEmptyText}>
                    Ask me anything about {subject.name}! I can explain concepts, help with derivations, or summarize topics.
                  </Text>
                </View>
              ) : (
                chatMessages.map(msg => (
                  <View 
                    key={msg.id} 
                    style={[
                      styles.chatBubble, 
                      msg.role === 'user' ? styles.userBubble : styles.aiBubble
                    ]}
                  >
                    <Text style={[styles.chatText, msg.role === 'user' ? styles.userChatText : styles.aiChatText]}>
                      {msg.content}
                    </Text>
                  </View>
                ))
              )}
              {isChatLoading && (
                <View style={[styles.chatBubble, styles.aiBubble]}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              )}
            </ScrollView>
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask Guru about this topic..."
                placeholderTextColor={colors.textSecondary}
                value={chatInput}
                onChangeText={setChatInput}
                multiline
              />
              <TouchableOpacity 
                style={[styles.chatSendBtn, !chatInput.trim() && { opacity: 0.5 }]} 
                onPress={handleSendMessage}
                disabled={!chatInput.trim() || isChatLoading}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.personalityContainer}>
              {['Friendly', 'Strict', 'Socratic', 'Panic'].map(p => (
                <TouchableOpacity 
                  key={p} 
                  onPress={() => setChatPersonality(p)}
                  style={[styles.personalityBtn, chatPersonality === p && styles.activePersonality]}
                >
                  <Text style={[styles.personalityText, chatPersonality === p && styles.activePersonalityText]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'PYQ Analysis':
        return (
          <View style={styles.tabContent}>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>Frequency vs Probability</Text>
              <Text style={styles.analysisDesc}>Upload past year questions to see which topics are most likely to appear in your exam.</Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadPYQ}>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.uploadBtnText}>Upload PYQ Papers</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'Quiz':
        return (
          <View style={styles.tabContent}>
            {activeQuiz.length > 0 ? (
              <View style={styles.quizCard}>
                <Text style={styles.quizProgress}>Question {currentQuestionIndex + 1}/{activeQuiz.length}</Text>
                <Text style={styles.questionText}>{activeQuiz[currentQuestionIndex].text}</Text>
                
                {activeQuiz[currentQuestionIndex].type === 'MCQ' || activeQuiz[currentQuestionIndex].type === 'TF' ? (
                  <View style={styles.optionsContainer}>
                    {(activeQuiz[currentQuestionIndex].options || ['True', 'False']).map((opt: string) => (
                      <TouchableOpacity 
                        key={opt} 
                        style={styles.optionBtn}
                        onPress={() => handleAnswerSubmit(opt === activeQuiz[currentQuestionIndex].correctAnswer)}
                      >
                        <Text style={styles.optionText}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View>
                    <TextInput 
                      style={styles.quizInput} 
                      placeholder="Type your answer..."
                      placeholderTextColor={colors.textSecondary}
                    />
                    <TouchableOpacity style={styles.submitBtn} onPress={() => handleAnswerSubmit(true)}>
                      <Text style={styles.submitBtnText}>Submit Answer</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.analysisCard}>
                <Ionicons name="school-outline" size={48} color={colors.primary} />
                <Text style={styles.analysisTitle}>{quizScore !== null ? `Last Score: ${quizScore}%` : 'Topic-Wise Quiz'}</Text>
                <Text style={styles.analysisDesc}>Test your knowledge with AI-generated questions covering MCQs, Short Answers and True/False.</Text>
                <TouchableOpacity 
                  style={[styles.uploadBtn, isQuizLoading && { opacity: 0.7 }]} 
                  onPress={handleStartQuiz}
                  disabled={isQuizLoading}
                >
                  {isQuizLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadBtnText}>Start Practice Quiz</Text>}
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 'Schedule':
        const subjectBlocks = scheduleBlocks.filter(b => b.subjectId?._id === id);
        return (
          <View style={styles.tabContent}>
            {subjectBlocks.length > 0 ? (
              subjectBlocks.map((item, index) => {
                const accent = item.type === 'revision' ? colors.tertiary : colors.primary;
                const startTime = new Date(item.startTime);
                const endTime = new Date(item.endTime);
                const timeRange = `${startTime.toLocaleDateString()} • ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                
                return (
                  <View key={item._id || index} style={[styles.blockCard, { backgroundColor: colors.surfaceContainerHigh + '50', borderColor: colors.cardBorder }, item.isCompleted && { opacity: 0.6 }]}>
                    <View style={[styles.blockAccent, { backgroundColor: accent }]} />
                    <View style={styles.blockContent}>
                      <View style={styles.blockMeta}>
                        <Text style={[styles.blockSubject, { color: accent }]}>{item.type.toUpperCase()}</Text>
                        <Text style={[styles.blockTime, { color: colors.textSecondary }]}>{timeRange}</Text>
                      </View>
                      <Text style={[styles.blockTopic, { color: colors.textPrimary, textDecorationLine: item.isCompleted ? 'line-through' : 'none' }]}>{item.title}</Text>
                    </View>
                    <TouchableOpacity style={[styles.completeBtn, { borderLeftColor: colors.cardBorder }]}
                      disabled={item.isCompleted}
                      onPress={() => updateBlock(item._id, { isCompleted: true })}>
                      <Ionicons 
                        name={item.isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
                        size={26} 
                        color={item.isCompleted ? colors.success : colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <View style={styles.analysisCard}>
                <Ionicons name="calendar-outline" size={48} color={colors.primary} />
                <Text style={styles.analysisTitle}>No Schedule Yet</Text>
                <Text style={styles.analysisDesc}>You haven't generated a schedule that includes this subject.</Text>
                <TouchableOpacity 
                  style={[styles.uploadBtn, { marginTop: 16 }, scheduleLoading && { opacity: 0.7 }]} 
                  onPress={async () => {
                    try {
                      await generateSchedule();
                      Alert.alert('Success', 'Smart schedule generated!');
                    } catch (err: any) {
                      Alert.alert('Error', err.response?.data?.message || 'Failed to generate schedule.');
                    }
                  }}
                  disabled={scheduleLoading}
                >
                  {scheduleLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadBtnText}>Generate Smart Schedule</Text>}
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      default:
        return (
          <View style={styles.center}>
            <Text style={{ color: colors.textSecondary }}>Coming Soon</Text>
          </View>
        );
    }
  };

  const daysLeft = subject.examDate ? Math.max(0, Math.ceil((new Date(subject.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : '--';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.subjectCode}>{subject.code}</Text>
          <Text style={styles.subjectName}>{subject.name}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push({ pathname: '/subjects/add', params: { id: subject._id } })} 
          style={styles.editBtn}
        >
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.editBtn, { marginLeft: 4 }]}
          onPress={() => {
            Alert.alert(
              'Delete Subject',
              `Remove "${subject.name}" and all its topics? This cannot be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteSubject(subject._id);
                      router.back();
                    } catch {
                      Alert.alert('Error', 'Failed to delete subject.');
                    }
                  }
                }
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={22} color="#FF453A" />
        </TouchableOpacity>
      </View>

      {/* Hero Stats */}
      <View style={styles.heroStats}>
        <View style={styles.heroStat}>
          <Text style={styles.heroValue}>{subject.completedTopics || 0}/{subject.totalTopics || 0}</Text>
          <Text style={styles.heroLabel}>Topics Done</Text>
        </View>
        <View style={[styles.heroStat, styles.heroDivider]}>
          <Text style={styles.heroValue}>{subject.progress || 0}%</Text>
          <Text style={styles.heroLabel}>Progress</Text>
        </View>
        <View style={styles.heroStat}>
          <Text style={styles.heroValue}>{daysLeft}</Text>
          <Text style={styles.heroLabel}>Days Left</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} scrollEnabled={activeTab !== 'Chat'}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
  },
  editBtn: {
    padding: 4,
  },
  subjectCode: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subjectName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.cardBorder,
  },
  heroValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  tabsContainer: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  tabsScroll: {
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  topicItem: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  completedTopicItem: {
    opacity: 0.6,
    borderColor: colors.success + '40',
  },
  checkbox: {
    marginRight: 12,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedTopicText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicHours: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 10,
  },
  topicAction: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 20,
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  analysisCard: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  analysisTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  analysisDesc: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  chatHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  chatTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  chatMessages: {
    height: 400,
  },
  chatEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    opacity: 0.6,
  },
  chatEmptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cardBackground,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chatText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userChatText: {
    color: '#fff',
  },
  aiChatText: {
    color: colors.textPrimary,
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  personalityContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  personalityBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  activePersonality: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  personalityText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  activePersonalityText: {
    color: '#fff',
  },
  quizCard: {
    backgroundColor: colors.cardBackground,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  quizProgress: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    marginBottom: 24,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionBtn: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  quizInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 20,
    height: 100,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  blockCard: { flexDirection: 'row', borderRadius: 20, marginBottom: 14, overflow: 'hidden', alignItems: 'center', borderWidth: 1 },
  blockAccent: { width: 4, alignSelf: 'stretch' },
  blockContent: { flex: 1, padding: 18 },
  blockMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  blockSubject: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  blockTime: { fontSize: 10, fontWeight: '600' },
  blockTopic: { fontSize: 15, fontWeight: '700' },
  completeBtn: { padding: 18, borderLeftWidth: 1 }
});
