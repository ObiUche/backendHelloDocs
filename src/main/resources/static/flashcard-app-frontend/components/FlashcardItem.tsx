import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { Flashcard } from '../types/flashcard';

interface FlashcardItemProps {
  flashcard: Flashcard;
  onPress?: () => void;
}

export const FlashcardItem: React.FC<FlashcardItemProps> = ({
  flashcard,
  onPress,
}) => {
  // Convert tags string to array for display
  const tagsArray = flashcard.tags 
    ? flashcard.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return Colors.success;
      case 'INTERMEDIATE': return Colors.warning;
      case 'ADVANCED': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            {/* FRONT CONTENT (QUESTION) */}
            <Text style={styles.question} numberOfLines={3}>
              {flashcard.frontContent || 'No question available'}
            </Text>
            
            {/* DIFFICULTY & CATEGORY */}
            <View style={styles.metaContainer}>
              <View style={[styles.difficultyBadge, { 
                backgroundColor: getDifficultyColor(flashcard.difficultyLevel) 
              }]}>
                <Text style={styles.difficultyText}>{flashcard.difficultyLevel}</Text>
              </View>
              
              {flashcard.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{flashcard.category}</Text>
                </View>
              )}
            </View>
            
            {/* TAGS */}
            {tagsArray.length > 0 && (
              <View style={styles.tagsContainer}>
                {tagsArray.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
                {tagsArray.length > 3 && (
                  <Text style={styles.moreTags}>+{tagsArray.length - 3} more</Text>
                )}
              </View>
            )}
            
            {/* BACK CONTENT PREVIEW (ANSWER) */}
            <Text style={styles.previewAnswer} numberOfLines={2}>
              <Text style={styles.answerLabel}>Answer: </Text>
              {flashcard.backContent || 'No answer available'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    marginVertical: 8, 
    borderRadius: 12, 
    elevation: 2,
    backgroundColor: Colors.background,
  },
  header: { flex: 1 },
  question: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: Colors.text, 
    marginBottom: 12,
    lineHeight: 22,
  },
  metaContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 8, 
    gap: 8 
  },
  difficultyBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  difficultyText: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  categoryBadge: { 
    backgroundColor: Colors.border, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 4 
  },
  categoryText: { 
    color: Colors.textSecondary, 
    fontSize: 12 
  },
  tagsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    alignItems: 'center', 
    marginBottom: 8, 
    gap: 4 
  },
  tag: { 
    backgroundColor: Colors.background, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: Colors.border 
  },
  tagText: { 
    fontSize: 11, 
    color: Colors.textSecondary 
  },
  moreTags: { 
    fontSize: 11, 
    color: Colors.textSecondary, 
    fontStyle: 'italic' 
  },
  previewAnswer: { 
    fontSize: 14, 
    color: Colors.textSecondary,
    marginTop: 4,
  },
  answerLabel: {
    fontWeight: '600',
    color: Colors.text,
  },
});