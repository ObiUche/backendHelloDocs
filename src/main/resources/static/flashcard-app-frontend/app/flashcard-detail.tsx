import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { FlashcardService } from '../services/api';
import { Flashcard } from '../types/flashcard';

export default function FlashcardDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadFlashcard();
  }, [id]);

  const loadFlashcard = async () => {
    try {
      const flashcards = await FlashcardService.getAllFlashcards();
      const found = flashcards.find(f => f.id.toString() === id);
      setFlashcard(found || null);
    } catch (error) {
      console.error('Error loading flashcard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!flashcard) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color={Colors.error} />
        <Text style={styles.errorText}>Flashcard not found</Text>
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  // Convert tags string to array
  const tagsArray = flashcard.tags 
    ? flashcard.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={[styles.difficultyBadge, 
              { backgroundColor: 
                flashcard.difficultyLevel === 'BEGINNER' ? Colors.success :
                flashcard.difficultyLevel === 'INTERMEDIATE' ? Colors.warning :
                Colors.error
              }]}>
              <Text style={styles.difficultyText}>{flashcard.difficultyLevel}</Text>
            </View>
            
            {flashcard.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{flashcard.category}</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Question</Text>
            <Text style={styles.question}>{flashcard.frontContent}</Text>
            
            <Button mode="outlined" onPress={() => setShowAnswer(!showAnswer)}
              icon={showAnswer ? "eye-off" : "eye"} style={styles.toggleButton}>
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </Button>

            {showAnswer && (
              <View style={styles.answerContainer}>
                <Text style={styles.label}>Answer</Text>
                <Text style={styles.answer}>{flashcard.backContent}</Text>
              </View>
            )}

            {tagsArray.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text style={styles.label}>Tags</Text>
                <View style={styles.tagsList}>
                  {tagsArray.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {flashcard.exampleCode && (
              <View style={styles.codeContainer}>
                <Text style={styles.label}>Example Code</Text>
                <View style={styles.codeBlock}>
                  <Text style={styles.codeText}>{flashcard.exampleCode}</Text>
                </View>
              </View>
            )}

            {flashcard.language && (
              <View style={styles.metaInfo}>
                <MaterialCommunityIcons name="translate" size={16} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{flashcard.language}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: Colors.text, marginVertical: 20 },
  card: { margin: 16, borderRadius: 12 },
  header: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  difficultyBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  difficultyText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  categoryBadge: { backgroundColor: Colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  categoryText: { color: Colors.text, fontSize: 14 },
  content: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  question: { fontSize: 20, fontWeight: '600', color: Colors.text, lineHeight: 28, marginBottom: 20 },
  toggleButton: { marginVertical: 16 },
  answerContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  answer: { fontSize: 18, color: Colors.text, lineHeight: 26 },
  tagsContainer: { marginTop: 20 },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: { backgroundColor: Colors.background, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: Colors.border },
  tagText: { fontSize: 14, color: Colors.textSecondary },
  codeContainer: { marginTop: 20 },
  codeBlock: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginTop: 8 },
  codeText: { fontFamily: 'monospace', fontSize: 12, color: '#333' },
  metaInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  metaText: { marginLeft: 8, color: Colors.textSecondary, fontSize: 14 },
});