import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSubjects } from '../../../src/hooks/useSubjects';
import { SubjectCard } from '../../../src/components/subjects/SubjectCard';
import { colors } from '../../../src/utils/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SubjectsScreen() {
  const router = useRouter();
  const { subjects, loading, fetchSubjects } = useSubjects();

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  if (loading && subjects.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <SubjectCard 
            subject={item} 
            onPress={() => router.push(`/subjects/${item._id}`)} 
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No subjects added yet</Text>
            <Text style={styles.emptySubtext}>Add your first subject to get started with your syllabus.</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/subjects/add')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
