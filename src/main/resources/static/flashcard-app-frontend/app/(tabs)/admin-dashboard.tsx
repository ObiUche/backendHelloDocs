import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Chip,
    Divider,
    Modal,
    Portal,
    Text,
    TextInput,
    Title,
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { FlashcardService } from '../../services/api';
import { Flashcard } from '../../types/flashcard';

export default function AdminDashboard() {
  const { user, getToken } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    frontContent: '',
    backContent: '',
    category: '',
    difficultyLevel: 'BEGINNER',
    exampleCode: '',
    tags: '',
    language: 'java',
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [flashcardsData, categoriesData, difficultiesData] = await Promise.all([
        FlashcardService.getAllFlashcards(),
        FlashcardService.getCategories(),
        FlashcardService.getDifficultyLevels(),
      ]);
      
      setFlashcards(flashcardsData);
      setCategories(categoriesData);
      setDifficulties(difficultiesData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCreateFlashcard = async () => {
    try {
      const token = getToken();
      if (!token) {
        Alert.alert('Error', 'You need to be logged in');
        return;
      }

      const response = await fetch('http://172.20.10.5:8080/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Flashcard created successfully');
        setModalVisible(false);
        resetForm();
        loadData();
      } else {
        const error = await response.text();
        throw new Error(error || 'Failed to create flashcard');
      }
    } catch (error: any) {
      console.error('Error creating flashcard:', error);
      Alert.alert('Error', error.message || 'Failed to create flashcard');
    }
  };

  const handleDeleteFlashcard = async (id: number) => {
    try {
      const token = getToken();
      if (!token) {
        Alert.alert('Error', 'You need to be logged in');
        return;
      }

      const response = await fetch(`http://172.20.10.5:8080/api/flashcards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Flashcard deleted successfully');
        setDeleteModalVisible(false);
        loadData();
      } else {
        const error = await response.text();
        throw new Error(error || 'Failed to delete flashcard');
      }
    } catch (error: any) {
      console.error('Error deleting flashcard:', error);
      Alert.alert('Error', error.message || 'Failed to delete flashcard');
    }
  };

  const resetForm = () => {
    setFormData({
      frontContent: '',
      backContent: '',
      category: '',
      difficultyLevel: 'BEGINNER',
      exampleCode: '',
      tags: '',
      language: 'java',
    });
  };

  const confirmDelete = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setDeleteModalVisible(true);
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons name="shield-lock" size={64} color={Colors.error} />
        <Title style={styles.errorTitle}>Access Denied</Title>
        <Text>Admin privileges required</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Title>Admin Dashboard</Title>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => setModalVisible(true)}
          style={styles.createButton}>
          Create Flashcard
        </Button>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{flashcards.length}</Text>
            <Text style={styles.statLabel}>Total Flashcards</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{categories.length}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </Card.Content>
        </Card>
      </View>

      <Divider style={styles.divider} />

      <Title style={styles.sectionTitle}>Manage Flashcards</Title>
      
      {flashcards.map((flashcard) => (
        <Card key={flashcard.id} style={styles.flashcardCard}>
          <Card.Content>
            <View style={styles.flashcardHeader}>
              <Chip
                style={[
                  styles.difficultyChip,
                  {
                    backgroundColor:
                      flashcard.difficultyLevel === 'BEGINNER' ? Colors.success :
                      flashcard.difficultyLevel === 'INTERMEDIATE' ? Colors.warning :
                      Colors.error,
                  },
                ]}>
                {flashcard.difficultyLevel}
              </Chip>
              <Chip style={styles.categoryChip}>{flashcard.category}</Chip>
            </View>
            <Title numberOfLines={2}>{flashcard.frontContent}</Title>
            <Text numberOfLines={2} style={styles.backContent}>
              {flashcard.backContent}
            </Text>
            {flashcard.tags && (
              <View style={styles.tagsContainer}>
                {flashcard.tags.split(',').map((tag, index) => (
                  <Chip key={index} mode="outlined" style={styles.tagChip}>
                    {tag.trim()}
                  </Chip>
                ))}
              </View>
            )}
            <View style={styles.actions}>
              <Button
                mode="outlined"
                icon="pencil"
                onPress={() => {
                  Alert.alert('Info', 'Edit functionality to be implemented');
                }}>
                Edit
              </Button>
              <Button
                mode="contained"
                icon="delete"
                buttonColor={Colors.error}
                onPress={() => confirmDelete(flashcard)}>
                Delete
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <ScrollView>
            <Title>Create New Flashcard</Title>
            
            <TextInput
              label="Question/Front Content *"
              value={formData.frontContent}
              onChangeText={(text) => setFormData({ ...formData, frontContent: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            
            <TextInput
              label="Answer/Back Content *"
              value={formData.backContent}
              onChangeText={(text) => setFormData({ ...formData, backContent: text })}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            
            <TextInput
              label="Category *"
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              style={styles.input}
            />
            
            <Text style={styles.label}>Difficulty Level</Text>
            <View style={styles.chipContainer}>
              {difficulties.map((difficulty) => (
                <Chip
                  key={difficulty}
                  selected={formData.difficultyLevel === difficulty}
                  onPress={() => setFormData({ ...formData, difficultyLevel: difficulty })}
                  style={styles.difficultyChip}>
                  {difficulty}
                </Chip>
              ))}
            </View>
            
            <TextInput
              label="Example Code (Optional)"
              value={formData.exampleCode}
              onChangeText={(text) => setFormData({ ...formData, exampleCode: text })}
              multiline
              numberOfLines={6}
              style={styles.input}
            />
            
            <TextInput
              label="Tags (comma-separated)"
              value={formData.tags}
              onChangeText={(text) => setFormData({ ...formData, tags: text })}
              style={styles.input}
            />
            
            <TextInput
              label="Language"
              value={formData.language}
              onChangeText={(text) => setFormData({ ...formData, language: text })}
              style={styles.input}
            />
            
            <View style={styles.modalActions}>
              <Button onPress={() => setModalVisible(false)}>Cancel</Button>
              <Button
                mode="contained"
                onPress={handleCreateFlashcard}
                disabled={!formData.frontContent || !formData.backContent || !formData.category}>
                Create
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Title>Delete Flashcard</Title>
          <Text style={styles.deleteText}>
            Are you sure you want to delete this flashcard?
          </Text>
          {selectedFlashcard && (
            <Card style={styles.previewCard}>
              <Card.Content>
                <Text style={styles.previewTitle}>{selectedFlashcard.frontContent}</Text>
                <Text numberOfLines={2}>{selectedFlashcard.backContent}</Text>
              </Card.Content>
            </Card>
          )}
          <View style={styles.modalActions}>
            <Button onPress={() => setDeleteModalVisible(false)}>Cancel</Button>
            <Button
              mode="contained"
              buttonColor={Colors.error}
              onPress={() => selectedFlashcard && handleDeleteFlashcard(selectedFlashcard.id)}>
              Delete
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorTitle: { color: Colors.error, marginVertical: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
  },
  createButton: { marginLeft: 8 },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    color: Colors.textSecondary,
  },
  divider: { marginHorizontal: 16, marginVertical: 8 },
  sectionTitle: { paddingHorizontal: 16, paddingVertical: 8 },
  flashcardCard: { margin: 16 },
  flashcardHeader: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  difficultyChip: { marginRight: 8 },
  categoryChip: { backgroundColor: Colors.border },
  backContent: { color: Colors.textSecondary, marginVertical: 8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginVertical: 8 },
  tagChip: { marginRight: 4 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  input: { marginBottom: 12 },
  label: { marginBottom: 8, color: Colors.textSecondary },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  deleteText: { marginVertical: 16 },
  previewCard: { marginVertical: 16 },
  previewTitle: { fontWeight: 'bold', marginBottom: 8 },
});