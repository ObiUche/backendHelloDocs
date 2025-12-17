import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    ActivityIndicator,
    Card,
    Chip,
    List,
    ProgressBar,
    Text,
    Title,
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

const mockProgressData = {
  totalFlashcards: 150,
  reviewed: 45,
  mastered: 28,
  categories: [
    { name: 'Data Structures', progress: 0.8, mastered: 12, total: 15 },
    { name: 'Algorithms', progress: 0.6, mastered: 8, total: 20 },
    { name: 'OOP', progress: 0.9, mastered: 6, total: 10 },
    { name: 'Design Patterns', progress: 0.3, mastered: 2, total: 15 },
  ],
  recentActivity: [
    { id: 1, title: 'Binary Search', category: 'Algorithms', date: 'Today', correct: true },
    { id: 2, title: 'Singleton Pattern', category: 'Design Patterns', date: 'Yesterday', correct: false },
    { id: 3, title: 'Linked Lists', category: 'Data Structures', date: '2 days ago', correct: true },
  ],
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [progressData, setProgressData] = useState(mockProgressData);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgressData(mockProgressData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProgressData();
  };

  const getMasteryPercentage = () => {
    return progressData.mastered / progressData.totalFlashcards;
  };

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
        <View>
          <Title>Welcome back, {user?.username || 'Learner'}!</Title>
          <Text style={styles.subtitle}>Track your learning progress</Text>
        </View>
        <MaterialCommunityIcons
          name="chart-line"
          size={40}
          color={Colors.primary}
        />
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons
              name="cards"
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.statNumber}>{progressData.totalFlashcards}</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons
              name="check-circle"
              size={24}
              color={Colors.success}
            />
            <Text style={styles.statNumber}>{progressData.reviewed}</Text>
            <Text style={styles.statLabel}>Reviewed</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons
              name="trophy"
              size={24}
              color={Colors.warning}
            />
            <Text style={styles.statNumber}>{progressData.mastered}</Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.masteryCard}>
        <Card.Content>
          <View style={styles.masteryHeader}>
            <Title>Overall Mastery</Title>
            <Text style={styles.percentageText}>
              {Math.round(getMasteryPercentage() * 100)}%
            </Text>
          </View>
          <ProgressBar
            progress={getMasteryPercentage()}
            color={Colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.masterySubtitle}>
            {progressData.mastered} of {progressData.totalFlashcards} flashcards mastered
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.categoriesCard}>
        <Card.Content>
          <Title>Progress by Category</Title>
          {progressData.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryStats}>
                  {category.mastered}/{category.total}
                </Text>
              </View>
              <ProgressBar
                progress={category.progress}
                color={Colors.primary}
                style={styles.categoryProgress}
              />
              <Text style={styles.categoryPercentage}>
                {Math.round(category.progress * 100)}% mastered
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.activityCard}>
        <Card.Content>
          <Title>Recent Activity</Title>
          {progressData.recentActivity.map((activity) => (
            <List.Item
              key={activity.id}
              title={activity.title}
              description={`${activity.category} • ${activity.date}`}
              left={() => (
                <MaterialCommunityIcons
                  name={activity.correct ? "check-circle" : "close-circle"}
                  size={24}
                  color={activity.correct ? Colors.success : Colors.error}
                />
              )}
              right={() => (
                <Chip
                  mode="outlined"
                  textStyle={{ fontSize: 12 }}
                  style={styles.activityChip}>
                  {activity.correct ? 'Correct' : 'Incorrect'}
                </Chip>
              )}
            />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.recommendationCard}>
        <Card.Content>
          <View style={styles.recommendationHeader}>
            <MaterialCommunityIcons
              name="lightbulb"
              size={24}
              color={Colors.warning}
            />
            <Title style={styles.recommendationTitle}>Recommendations</Title>
          </View>
          <List.Item
            title="Review Design Patterns"
            description="Lowest mastery category"
            left={() => (
              <MaterialCommunityIcons
                name="refresh"
                size={24}
                color={Colors.primary}
              />
            )}
          />
          <List.Item
            title="Challenge yourself"
            description="Try more ADVANCED difficulty cards"
            left={() => (
              <MaterialCommunityIcons
                name="trending-up"
                size={24}
                color={Colors.success}
              />
            )}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
  },
  subtitle: { color: Colors.textSecondary, marginTop: 4 },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: { flex: 1 },
  statContent: { alignItems: 'center' },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 8,
  },
  statLabel: { color: Colors.textSecondary, fontSize: 12 },
  masteryCard: { margin: 16 },
  masteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressBar: { marginVertical: 12, height: 8, borderRadius: 4 },
  masterySubtitle: { color: Colors.textSecondary, fontSize: 14 },
  categoriesCard: { margin: 16 },
  categoryItem: { marginVertical: 12 },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: { fontWeight: '600', color: Colors.text },
  categoryStats: { color: Colors.textSecondary },
  categoryProgress: { height: 6, borderRadius: 3 },
  categoryPercentage: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  activityCard: { margin: 16 },
  activityChip: { alignSelf: 'center' },
  recommendationCard: { margin: 16 },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationTitle: { marginLeft: 12 },
});