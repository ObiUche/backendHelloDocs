import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { Flashcard } from '../types/flashcard';

interface FlashcardFlipProps {
  flashcard: Flashcard;
  onNext: () => void;
  onPrevious: () => void;
  onMarkKnown: () => void;
  showNavigation?: boolean;
}

export const FlashcardFlip: React.FC<FlashcardFlipProps> = ({
  flashcard,
  onNext,
  onPrevious,
  onMarkKnown,
  showNavigation = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

  // Convert tags string to array
  const tagsArray = flashcard.tags 
    ? flashcard.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return Colors.success;
      case 'INTERMEDIATE': return Colors.warning;
      case 'ADVANCED': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Flashcard Container - Takes most of screen */}
      <View style={styles.cardWrapper}>
        <TouchableOpacity 
          onPress={flipCard} 
          activeOpacity={0.9} 
          style={styles.cardTouchable}
        >
          {/* FRONT CARD */}
          <Animated.View 
            style={[
              styles.card, 
              { 
                transform: [{ rotateY: frontInterpolate }],
                backfaceVisibility: 'hidden' as 'hidden'
              }
            ]}
          >
            <View style={[styles.cardInner, { borderTopColor: getDifficultyColor(flashcard.difficultyLevel) }]}>
              <View style={styles.cardContent}>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{flashcard.difficultyLevel}</Text>
                </View>
                
                <View style={styles.questionContainer}>
                  <Text style={styles.label}>Question</Text>
                  <View style={styles.textContainer}>
                    <ScrollView 
                      style={styles.scrollView}
                      contentContainerStyle={styles.scrollContent}
                      showsVerticalScrollIndicator={true}
                    >
                      <Text style={styles.questionText}>
                        {flashcard.frontContent || 'No question available'}
                      </Text>
                    </ScrollView>
                  </View>
                </View>
                
                <View style={styles.hintContainer}>
                  <IconButton icon="information" size={20} iconColor={Colors.textSecondary} />
                  <Text style={styles.hintText}>Tap card to reveal answer</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* BACK CARD */}
          <Animated.View 
            style={[
              styles.card, 
              { 
                transform: [{ rotateY: backInterpolate }],
                backfaceVisibility: 'hidden' as 'hidden'
              }
            ]}
          >
            <View style={[styles.cardInner, { borderTopColor: getDifficultyColor(flashcard.difficultyLevel) }]}>
              <View style={styles.cardContent}>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{flashcard.difficultyLevel}</Text>
                </View>
                
                <View style={styles.answerContainer}>
                  <Text style={styles.label}>Answer</Text>
                  <View style={styles.textContainer}>
                    <ScrollView 
                      style={styles.scrollView}
                      contentContainerStyle={styles.scrollContent}
                      showsVerticalScrollIndicator={true}
                    >
                      <Text style={styles.answerText}>
                        {flashcard.backContent || 'No answer available'}
                      </Text>
                    </ScrollView>
                  </View>
                </View>
                
                <View style={styles.metaSection}>
                  {flashcard.category && (
                    <View style={styles.metaInfo}>
                      <Text style={styles.metaLabel}>Category:</Text>
                      <Text style={styles.metaValue}>{flashcard.category}</Text>
                    </View>
                  )}
                  
                  {tagsArray.length > 0 && (
                    <View style={styles.tagsContainer}>
                      <Text style={styles.metaLabel}>Tags:</Text>
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tagsScroll}
                      >
                        {tagsArray.map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Controls - Fixed at bottom */}
      <View style={styles.controls}>
        <Button
          mode="outlined"
          onPress={onMarkKnown}
          icon="check-circle"
          style={styles.knownButton}
          labelStyle={styles.buttonLabel}
        >
          Mark as Known
        </Button>
        
        {showNavigation && (
          <View style={styles.navigation}>
            <IconButton 
              icon="chevron-left" 
              size={30} 
              onPress={onPrevious} 
              mode="contained"
              style={styles.navButton}
            />
            <IconButton 
              icon="chevron-right" 
              size={30} 
              onPress={onNext} 
              mode="contained"
              style={styles.navButton}
            />
          </View>
        )}
        
        <Button
          mode="contained"
          onPress={flipCard}
          icon={isFlipped ? "eye-off" : "eye"}
          style={styles.flipButton}
          labelStyle={styles.buttonLabel}
        >
          {isFlipped ? "Show Question" : "Show Answer"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  cardWrapper: {
    width: '100%',
    flex: 1,
    maxHeight: '75%',
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 16,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardInner: {
    flex: 1,
    borderRadius: 16,
    borderTopWidth: 8,
    padding: 16,
  },
  cardContent: {
    flex: 1,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  difficultyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  questionContainer: {
    flex: 1,
    marginBottom: 8,
  },
  answerContainer: {
    flex: 1,
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    minHeight: 100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 4,
  },
  answerText: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 4,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    minHeight: 40,
  },
  hintText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  metaSection: {
    marginTop: 12,
    minHeight: 40,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metaLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginRight: 6,
  },
  metaValue: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  tagsContainer: {
    marginTop: 8,
  },
  tagsScroll: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  tag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  tagText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  controls: {
    width: '100%',
    gap: 12,
    marginTop: 'auto',
    paddingBottom: 10,
  },
  knownButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    backgroundColor: Colors.primary,
  },
  flipButton: {
    width: '100%',
    backgroundColor: Colors.primary,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});