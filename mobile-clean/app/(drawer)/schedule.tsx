import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../../src/hooks/useColors';
import { useSchedule } from '../../src/hooks/useSchedule';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [showConfidence, setShowConfidence] = useState(false);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  
  const { scheduleBlocks, fetchSchedule, generateSchedule, updateBlock, loading } = useSchedule();
  const c = useColors();

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleGenerate = async () => {
    try {
      await generateSchedule();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Please ensure you have added subjects and extracted topics first.';
      Alert.alert('Scheduling Error', msg);
    }
  };

  const handleComplete = (id: string) => {
    setActiveBlock(id);
    setShowConfidence(true);
  };

  const submitRating = async (rating: number) => {
    if (activeBlock) {
      await updateBlock(activeBlock, { isCompleted: true, confidenceRating: rating });
      setShowConfidence(false);
      setActiveBlock(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[styles.semester, { color: c.primary }]}>AUTUMN TERM • WEEK 8</Text>
            <Text style={[styles.title, { color: c.onSurface }]}>Schedule</Text>
          </View>
          {scheduleBlocks.length === 0 && (
            <TouchableOpacity 
              style={[styles.generateBtn, { backgroundColor: c.primaryContainer }]} 
              onPress={handleGenerate}
              disabled={loading}
            >
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>Auto-Generate</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Week strip */}
      <View style={[styles.weekStrip, { borderColor: c.outlineVariant + '30' }]}>
        {DAYS.map(day => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(day)}
            style={[styles.dayBtn, selectedDay === day && { backgroundColor: c.primaryContainer }]}
          >
            <Text style={[styles.dayText, { color: selectedDay === day ? '#fff' : c.onSurface + '60' }]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading state */}
      {loading && <ActivityIndicator style={{ marginTop: 20 }} color={c.primary} />}

      {/* Blocks */}
      <FlatList
        data={scheduleBlocks}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const accent = item.type === 'revision' ? c.tertiary : c.primary;
          const startTime = new Date(item.startTime);
          const endTime = new Date(item.endTime);
          const timeRange = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          
          return (
            <View style={[styles.blockCard, { backgroundColor: c.surfaceContainerHigh + '50', borderColor: c.outlineVariant + '20' }, item.isCompleted && { opacity: 0.6 }]}>
              <View style={[styles.blockAccent, { backgroundColor: accent }]} />
              <View style={styles.blockContent}>
                <View style={styles.blockMeta}>
                  <Text style={[styles.blockSubject, { color: accent }]}>{item.subjectId?.name || 'Subject'}</Text>
                  <Text style={[styles.blockTime, { color: c.onSurface + '50' }]}>{timeRange}</Text>
                </View>
                <Text style={[styles.blockTopic, { color: c.onSurface, textDecorationLine: item.isCompleted ? 'line-through' : 'none' }]}>{item.title}</Text>
              </View>
              <TouchableOpacity style={[styles.completeBtn, { borderLeftColor: c.outlineVariant + '20' }]}
                disabled={item.isCompleted}
                onPress={() => handleComplete(item._id)}>
                <Ionicons 
                  name={item.isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
                  size={30} 
                  color={item.isCompleted ? c.success : c.outlineVariant} 
                />
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={!loading ? (
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Ionicons name="calendar-outline" size={64} color={c.onSurface + '20'} />
            <Text style={{ color: c.onSurface + '50', marginTop: 16 }}>No sessions found.</Text>
            <TouchableOpacity 
              style={[styles.bigGenerateBtn, { backgroundColor: c.primary, marginTop: 24 }]} 
              onPress={handleGenerate}
            >
              <Text style={{ color: '#fff', fontWeight: '800' }}>Generate Smart Schedule</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      />

      {/* Confidence modal */}
      {showConfidence && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: c.surfaceContainer }]}>
            <Text style={[styles.modalTitle, { color: c.onSurface }]}>Session Complete! 🎉</Text>
            <Text style={[styles.modalSub, { color: c.onSurface + '70' }]}>
              How confident are you with the{'\n'}topics discussed today?
            </Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity
                  key={n}
                  style={[styles.ratingBtn, { backgroundColor: c.surfaceContainerHigh, borderColor: c.outlineVariant + '40' }]}
                  onPress={() => submitRating(n)}
                >
                  <Text style={[styles.ratingNum, { color: c.onSurface }]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.ratingLabels}>
              <Text style={[styles.ratingLabelText, { color: c.onSurface + '50' }]}>Not at all</Text>
              <Text style={[styles.ratingLabelText, { color: c.onSurface + '50' }]}>Fully confident</Text>
            </View>
            <TouchableOpacity onPress={() => setShowConfidence(false)}>
              <Text style={[styles.skipRatingText, { color: c.primary }]}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  semester: { fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  weekStrip: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 8 },
  dayBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999 },
  dayText: { fontSize: 13, fontWeight: '700' },
  blockCard: { flexDirection: 'row', borderRadius: 20, marginBottom: 14, overflow: 'hidden', alignItems: 'center', borderWidth: 1 },
  blockAccent: { width: 4, alignSelf: 'stretch' },
  blockContent: { flex: 1, padding: 18 },
  blockMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  blockSubject: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  blockTime: { fontSize: 10, fontWeight: '600' },
  blockTopic: { fontSize: 17, fontWeight: '700' },
  completeBtn: { padding: 18, borderLeftWidth: 1 },
  generateBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  bigGenerateBtn: { paddingHorizontal: 32, paddingVertical: 18, borderRadius: 16 },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', zIndex: 100 },
  modal: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 48 },
  modalTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  modalSub: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ratingBtn: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  ratingNum: { fontSize: 18, fontWeight: '800' },
  ratingLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  ratingLabelText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  skipRatingText: { alignSelf: 'center', fontSize: 13, fontWeight: '700' },
});
