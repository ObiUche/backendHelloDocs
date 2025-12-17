import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, SegmentedButtons } from 'react-native-paper';
import { FlashcardFlip } from '../../components/FlashcardFlip';
import { Colors } from '../../constants/Colors';
import { Styles } from '../../constants/Styles';
import { FlashcardService } from '../../services/api';
import { Flashcard } from '../../types/flashcard';

export default function ReviewScreen() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState<'all' | 'difficulty'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('BEGINNER');
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadFlashcards();
  }, [reviewMode, selectedDifficulty]);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      let cards: Flashcard[];
      
      if (reviewMode === 'difficulty') {
        cards = await FlashcardService.getFlashcardsWithFilters({
          difficultyLevel: selectedDifficulty,
        });
      } else {
        cards = await FlashcardService.getAllFlashcards();
      }
      
      const unknownCards = cards.filter(card => !knownCards.has(card.id));
      setFlashcards(unknownCards);
      setCurrentIndex(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to load flashcards for review');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(flashcards.length - 1);
    }
  };

  const handleMarkKnown = () => {
    if (flashcards.length === 0) return;
    
    const currentCard = flashcards[currentIndex];
    const newKnownCards = new Set(knownCards);
    newKnownCards.add(currentCard.id);
    setKnownCards(newKnownCards);

    const remainingCards = flashcards.filter(card => card.id !== currentCard.id);
    setFlashcards(remainingCards);
    
    if (remainingCards.length === 0) {
      Alert.alert('Congratulations!', 'You\'ve marked all cards in this set as known!', 
        [{ text: 'OK', onPress: () => setCurrentIndex(0) }]);
    } else if (currentIndex >= remainingCards.length) {
      setCurrentIndex(remainingCards.length - 1);
    }
  };

  const resetKnownCards = () => {
    Alert.alert('Reset Progress', 'Are you sure you want to reset all known cards?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive',
        onPress: () => {
          setKnownCards(new Set());
          loadFlashcards();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading review session...</Text>
      </View>
    );
  }

  if (flashcards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="trophy-outline" size={80} color={Colors.success} />
        <Text style={styles.emptyTitle}>Review Complete!</Text>
        <Text style={styles.emptyText}>
          {knownCards.size > 0
            ? `You've mastered ${knownCards.size} card${knownCards.size !== 1 ? 's' : ''}!`
            : 'No cards available for review.'}
        </Text>
        
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{knownCards.size}</Text>
                <Text style={styles.statLabel}>Mastered</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>To Review</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actionButtons}>
          <Button mode="contained" onPress={() => setReviewMode(reviewMode === 'all' ? 'difficulty' : 'all')} 
            icon="refresh" style={styles.actionButton}>
            Switch Review Mode
          </Button>
          
          {knownCards.size > 0 && (
            <Button mode="outlined" onPress={resetKnownCards} icon="restart" style={styles.actionButton}>
              Reset Progress
            </Button>
          )}
        </View>
      </View>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <View style={Styles.screenContainer}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Card {currentIndex + 1} of {flashcards.length}
              </Text>
              <Text style={styles.statsText}>
                {knownCards.size} mastered • {flashcards.length} to review
              </Text>
            </View>
            
            <TouchableOpacity onPress={resetKnownCards} style={styles.resetButton}>
              <MaterialCommunityIcons name="restart" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <SegmentedButtons
            value={reviewMode}
            onValueChange={setReviewMode}
            buttons={[
              { value: 'all', label: 'All Cards', icon: 'cards' },
              { value: 'difficulty', label: 'By Difficulty', icon: 'filter' },
            ]}
            style={styles.segmentedButtons}
          />

          {reviewMode === 'difficulty' && (
            <View style={styles.difficultySelector}>
              <Text style={styles.selectorLabel}>Select Difficulty:</Text>
              <View style={styles.difficultyButtons}>
                {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => (
                  <Button key={level} mode={selectedDifficulty === level ? 'contained' : 'outlined'}
                    onPress={() => setSelectedDifficulty(level)} style={styles.difficultyButton} compact>
                    {level}
                  </Button>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Main Flashcard Area */}
      <FlashcardFlip
        flashcard={currentCard}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onMarkKnown={handleMarkKnown}
        showNavigation={flashcards.length > 1}
      />

      {/* Dots Navigation - Only show if multiple cards */}
      {flashcards.length > 1 && (
        <View style={styles.dotsContainer}>
          {flashcards.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
              onPress={() => setCurrentIndex(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 12, 
    color: Colors.textSecondary 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  emptyTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: Colors.text, 
    marginTop: 20 
  },
  emptyText: { 
    fontSize: 16, 
    color: Colors.textSecondary, 
    textAlign: 'center', 
    marginTop: 8, 
    marginBottom: 30 
  },
  statsCard: { 
    width: '100%', 
    maxWidth: 300, 
    marginBottom: 30 
  },
  statRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  stat: { 
    alignItems: 'center' 
  },
  statNumber: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: Colors.primary 
  },
  statLabel: { 
    fontSize: 14, 
    color: Colors.textSecondary 
  },
  actionButtons: { 
    width: '100%', 
    maxWidth: 300, 
    gap: 12 
  },
  actionButton: { 
    width: '100%' 
  },
  headerCard: { 
    margin: 16, 
    marginBottom: 8 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  progressContainer: { 
    flex: 1 
  },
  progressText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: Colors.text 
  },
  statsText: { 
    fontSize: 14, 
    color: Colors.textSecondary, 
    marginTop: 2 
  },
  resetButton: { 
    padding: 8 
  },
  segmentedButtons: { 
    marginBottom: 12 
  },
  difficultySelector: { 
    marginTop: 8 
  },
  selectorLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: Colors.text, 
    marginBottom: 8 
  },
  difficultyButtons: { 
    flexDirection: 'row', 
    gap: 8 
  },
  difficultyButton: { 
    flex: 1 
  },
  dotsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 10,
    paddingBottom: 20,
    gap: 8 
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: Colors.border 
  },
  dotActive: { 
    backgroundColor: Colors.primary, 
    width: 14, 
    height: 14, 
    borderRadius: 7 
  },
});