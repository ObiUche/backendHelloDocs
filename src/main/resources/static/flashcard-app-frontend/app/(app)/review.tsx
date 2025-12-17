import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, SegmentedButtons } from 'react-native-paper';
import { FlashcardFlip } from '../../components/FlashcardFlip';
import { Colors } from '../../constants/Colors';
import { Styles } from '../../constants/Styles';
import { useAuth } from '../../context/AuthContext';
import { FlashcardService } from '../../services/api';
import { Flashcard } from '../../types/flashcard';

export default function ReviewScreen() {
  const router = useRouter();
  const { user, addGuestProgress, guestProgress, getGuestProgressCount } = useAuth();
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
      
      // Filter out cards already known
      const unknownCards = cards.filter(card => {
        // If user is logged in, check knownCards set
        if (user) {
          return !knownCards.has(card.id);
        }
        // If guest, check guest progress
        return !guestProgress.some(progress => progress.flashcardId === card.id);
      });
      
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
    
    if (!user) {
      // User is guest - use guest progress
      const success = addGuestProgress(currentCard.id, true);
      
      if (!success) {
        // Show login prompt if limit reached
        Alert.alert(
          'Guest Limit Reached',
          'You have reviewed 50 cards as a guest. Login to continue saving your progress.',
          [
            { text: 'Later', style: 'cancel' },
            { 
              text: 'Login Now', 
              onPress: () => router.push('/(public)/login') 
            },
          ]
        );
        return;
      }
      
      // Continue with guest flow - remove card from current session
      const remainingCards = flashcards.filter(card => card.id !== currentCard.id);
      setFlashcards(remainingCards);
      
      if (remainingCards.length === 0) {
        Alert.alert(
          'Great Job!', 
          `You've reviewed all cards in this set! ${guestProgress.length} cards saved in guest session.`,
          [{ 
            text: 'OK', 
            onPress: () => {
              // Optionally suggest login if guest has progress
              if (guestProgress.length > 0) {
                Alert.alert(
                  'Save Your Progress',
                  `Would you like to login to save your ${guestProgress.length} reviewed cards?`,
                  [
                    { text: 'Not Now', style: 'cancel' },
                    { 
                      text: 'Login', 
                      onPress: () => router.push('/(public)/login') 
                    },
                  ]
                );
              }
            } 
          }]
        );
      } else if (currentIndex >= remainingCards.length) {
        setCurrentIndex(remainingCards.length - 1);
      }
    } else {
      // User is authenticated - original logic
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
    }
  };

  const resetKnownCards = () => {
    if (!user) {
      // For guests, show login prompt instead of reset
      Alert.alert(
        'Save Your Progress',
        'Login to save your progress before resetting.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => router.push('/(public)/login') 
          },
        ]
      );
      return;
    }
    
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

  // Calculate stats for display
  const guestProgressCount = getGuestProgressCount();
  const masteredCount = user ? knownCards.size : guestProgressCount;
  const toReviewCount = flashcards.length;

  if (flashcards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="trophy-outline" size={80} color={Colors.success} />
        <Text style={styles.emptyTitle}>Review Complete!</Text>
        <Text style={styles.emptyText}>
          {masteredCount > 0
            ? `You've reviewed ${masteredCount} card${masteredCount !== 1 ? 's' : ''}!`
            : 'No cards available for review.'}
        </Text>
        
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{masteredCount}</Text>
                <Text style={styles.statLabel}>
                  {user ? 'Mastered' : 'Reviewed'}
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{toReviewCount}</Text>
                <Text style={styles.statLabel}>To Review</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Guest-specific messages */}
        {!user && guestProgressCount > 0 && (
          <Card style={styles.guestCard}>
            <Card.Content>
              <MaterialCommunityIcons name="information" size={24} color={Colors.warning} />
              <Text style={styles.guestText}>
                {guestProgressCount >= 50 
                  ? 'You\'ve reached the guest limit! Login to continue.'
                  : `You have ${guestProgressCount} reviewed cards. Login to save them!`}
              </Text>
              <Button
                mode="contained"
                onPress={() => router.push('/(public)/login')}
                style={styles.loginPromptButton}
                icon="login"
              >
                Login to Save Progress
              </Button>
            </Card.Content>
          </Card>
        )}

        <View style={styles.actionButtons}>
          <Button 
            mode="contained" 
            onPress={() => setReviewMode(reviewMode === 'all' ? 'difficulty' : 'all')} 
            icon="refresh" 
            style={styles.actionButton}
          >
            Switch Review Mode
          </Button>
          
          {user && masteredCount > 0 && (
            <Button 
              mode="outlined" 
              onPress={resetKnownCards} 
              icon="restart" 
              style={styles.actionButton}
            >
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
                {masteredCount} {user ? 'mastered' : 'reviewed'} • {flashcards.length} to review
                {!user && guestProgressCount >= 50 && ' • Limit reached!'}
              </Text>
            </View>
            
            <TouchableOpacity onPress={resetKnownCards} style={styles.resetButton}>
              <MaterialCommunityIcons 
                name={user ? "restart" : "login"} 
                size={20} 
                color={Colors.textSecondary} 
              />
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
                  <Button 
                    key={level} 
                    mode={selectedDifficulty === level ? 'contained' : 'outlined'}
                    onPress={() => setSelectedDifficulty(level)} 
                    style={styles.difficultyButton} 
                    compact
                  >
                    {level}
                  </Button>
                ))}
              </View>
            </View>
          )}

          {/* Guest progress indicator */}
          {!user && guestProgressCount > 0 && (
            <View style={styles.guestProgressIndicator}>
              <MaterialCommunityIcons name="progress-clock" size={16} color={Colors.primary} />
              <Text style={styles.guestProgressText}>
                Guest progress: {guestProgressCount}/50 cards
              </Text>
              {guestProgressCount >= 40 && (
                <Text style={styles.guestProgressWarning}>
                  {guestProgressCount >= 50 
                    ? 'Limit reached!' 
                    : `${50 - guestProgressCount} cards remaining`}
                </Text>
              )}
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

      {/* Login prompt for guests with progress */}
      {!user && guestProgressCount > 0 && guestProgressCount < 50 && (
        <Card style={styles.loginPromptCard}>
          <Card.Content style={styles.loginPromptContent}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color={Colors.warning} />
            <View style={styles.loginPromptTextContainer}>
              <Text style={styles.loginPromptTitle}>
                Save Your Progress!
              </Text>
              <Text style={styles.loginPromptSubtitle}>
                Login now to save your {guestProgressCount} reviewed cards.
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => router.push('/(public)/login')}
              compact
              style={styles.loginPromptButtonSmall}
            >
              Login
            </Button>
          </Card.Content>
        </Card>
      )}

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
    marginBottom: 20 
  },
  guestCard: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
    backgroundColor: Colors.warning + '20',
    borderColor: Colors.warning,
    borderWidth: 1,
  },
  guestText: {
    marginTop: 8,
    marginBottom: 12,
    color: Colors.text,
    textAlign: 'center',
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
  loginPromptButton: {
    marginTop: 12,
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
  guestProgressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    gap: 8,
  },
  guestProgressText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  guestProgressWarning: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
  },
  loginPromptCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: Colors.warning + '20',
    borderColor: Colors.warning,
    borderWidth: 1,
  },
  loginPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginPromptTextContainer: {
    flex: 1,
  },
  loginPromptTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  loginPromptSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  loginPromptButtonSmall: {
    paddingHorizontal: 12,
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