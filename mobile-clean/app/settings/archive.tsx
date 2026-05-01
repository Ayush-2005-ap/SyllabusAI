import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/hooks/useColors';
import { useAppContext, SemesterArchive } from '../../src/hooks/useAppContext';

export default function ArchiveScreen() {
  const router = useRouter();
  const c = useColors();
  const { semesters, addSemester, deleteSemester } = useAppContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [newSemName, setNewSemName] = useState('');
  const [newSemGpa, setNewSemGpa] = useState('');
  const [newSemCount, setNewSemCount] = useState('');

  const cumulativeGpa = useMemo(() => {
    if (semesters.length === 0) return '0.0';
    const sum = semesters.reduce((acc, s) => acc + parseFloat(s.gpa || '0'), 0);
    return (sum / semesters.length).toFixed(2);
  }, [semesters]);

  const totalCourses = useMemo(() => {
    return semesters.reduce((acc, s) => acc + (s.subjectsCount || 0), 0);
  }, [semesters]);

  const handleAdd = async () => {
    if (!newSemName || !newSemGpa) {
      Alert.alert('Missing Info', 'Please provide at least a name and GPA.');
      return;
    }
    await addSemester({
      name: newSemName,
      gpa: newSemGpa,
      subjectsCount: parseInt(newSemCount) || 0
    });
    setModalVisible(false);
    setNewSemName('');
    setNewSemGpa('');
    setNewSemCount('');
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Archive',
      `Are you sure you want to remove "${name}" from your legacy records?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSemester(id) }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceContainerHigh }]}>
          <Ionicons name="chevron-back" size={24} color={c.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.onSurface }]}>History & Archive</Text>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: c.primaryContainer }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={c.onPrimaryContainer} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={[styles.heroIconWrap, { backgroundColor: c.primary + '15' }]}>
            <Ionicons name="archive" size={40} color={c.primary} />
          </View>
          <Text style={[styles.heroTitle, { color: c.onSurface }]}>Academic Legacy</Text>
          <Text style={[styles.heroDesc, { color: c.onSurface + '60' }]}>
            Review your past academic performance, notes, and AI insights from previous terms.
          </Text>
        </View>

        {/* Real Semester List */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: c.primary }]}>ARCHIVED SEMESTERS</Text>
          
          {semesters.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}>
              <Ionicons name="file-tray-outline" size={32} color={c.onSurface + '30'} />
              <Text style={[styles.emptyCardText, { color: c.onSurface + '50' }]}>No archived semesters yet.</Text>
            </View>
          ) : (
            semesters.map((sem) => (
              <TouchableOpacity 
                key={sem.id} 
                style={[styles.archiveCard, { backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant + '30' }]}
                onLongPress={() => confirmDelete(sem.id, sem.name)}
                activeOpacity={0.7}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.iconWrap, { backgroundColor: c.primary + '15' }]}>
                    <Ionicons name="medal" size={20} color={c.primary} />
                  </View>
                  <View>
                    <Text style={[styles.termText, { color: c.onSurface }]}>{sem.name}</Text>
                    <Text style={[styles.subText, { color: c.onSurface + '50' }]}>{sem.subjectsCount} Subjects • {sem.gpa} GPA</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => confirmDelete(sem.id, sem.name)} style={styles.deleteMiniBtn}>
                  <Ionicons name="trash-outline" size={16} color={c.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={[styles.statsSummary, { backgroundColor: c.primaryContainer + '20', borderColor: c.primary + '30' }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: c.primary }]}>{totalCourses}</Text>
            <Text style={[styles.summaryLabel, { color: c.onSurface + '60' }]}>Total Courses</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: c.outlineVariant + '40' }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: c.primary }]}>{cumulativeGpa}</Text>
            <Text style={[styles.summaryLabel, { color: c.onSurface + '60' }]}>Cumulative GPA</Text>
          </View>
        </View>

        <View style={styles.emptyPrompt}>
          <Ionicons name="cloud-upload-outline" size={24} color={c.onSurface + '30'} />
          <Text style={[styles.emptyPromptText, { color: c.onSurface + '40' }]}>
            End-of-semester data can be manually added or automatically archived here.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Semester Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: c.surfaceContainerHigh }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: c.onSurface }]}>Archive New Semester</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={c.onSurface} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: c.primary }]}>SEMESTER NAME</Text>
              <TextInput
                style={[styles.modalInput, { color: c.onSurface, backgroundColor: c.surfaceContainerLow }]}
                placeholder="e.g. Spring 2024"
                placeholderTextColor={c.onSurface + '40'}
                value={newSemName}
                onChangeText={setNewSemName}
              />
            </View>

            <View style={styles.modalRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={[styles.inputLabel, { color: c.primary }]}>GPA</Text>
                <TextInput
                  style={[styles.modalInput, { color: c.onSurface, backgroundColor: c.surfaceContainerLow }]}
                  placeholder="4.0"
                  placeholderTextColor={c.onSurface + '40'}
                  value={newSemGpa}
                  onChangeText={setNewSemGpa}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: c.primary }]}>COURSES</Text>
                <TextInput
                  style={[styles.modalInput, { color: c.onSurface, backgroundColor: c.surfaceContainerLow }]}
                  placeholder="5"
                  placeholderTextColor={c.onSurface + '40'}
                  value={newSemCount}
                  onChangeText={setNewSemCount}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: c.primary }]}
              onPress={handleAdd}
            >
              <Text style={styles.saveBtnText}>Save to Archive</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  
  content: { padding: 24 },
  heroSection: { alignItems: 'center', marginBottom: 40 },
  heroIconWrap: { width: 80, height: 80, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  heroDesc: { textAlign: 'center', fontSize: 14, lineHeight: 22, paddingHorizontal: 20 },
  
  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' },
  
  archiveCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 24, borderWidth: 1, marginBottom: 16 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  termText: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  subText: { fontSize: 13 },
  deleteMiniBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  
  emptyCard: { alignItems: 'center', justifyContent: 'center', padding: 40, borderRadius: 24, borderStyle: 'dashed', borderWidth: 1 },
  emptyCardText: { marginTop: 12, fontSize: 13, fontWeight: '600' },

  statsSummary: { flexDirection: 'row', padding: 24, borderRadius: 24, borderWidth: 1, alignItems: 'center', marginBottom: 40 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  summaryLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  divider: { width: 1, height: 30 },
  
  emptyPrompt: { alignItems: 'center', marginTop: 10 },
  emptyPromptText: { fontSize: 12, textAlign: 'center', marginTop: 12, lineHeight: 18, paddingHorizontal: 40 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  modalInput: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, fontWeight: '600' },
  modalRow: { flexDirection: 'row' },
  saveBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

