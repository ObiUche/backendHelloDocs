// app/(public)/profile.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Card, ProgressBar, Text, Title } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function GuestProfileScreen() {
  const router = useRouter();
  const { guestProgress, getGuestProgressCount, canAddMoreGuestProgress } = useAuth();
  
  const progressCount = getGuestProgressCount();
  const progressPercentage = progressCount / 50; // 50 is the limit

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={100}
            color={Colors.primary}
          />
          <Title style={styles.title}>Welcome Guest!</Title>
          <Text style={styles.subtitle}>
            Login to save your progress and unlock all features
          </Text>
          
          {progressCount > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Your Guest Progress</Text>
                <Text style={styles.progressCount}>{progressCount}/50 cards</Text>
              </View>
              <ProgressBar 
                progress={progressPercentage} 
                color={Colors.primary}
                style={styles.progressBar}
              />
              <Text style={styles.progressNote}>
                {progressCount >= 50 
                  ? "You've reached the limit! Login to continue."
                  : `${50 - progressCount} cards remaining before login required`}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          icon="login"
          onPress={() => router.push('/(public)/login')}
          style={styles.loginButton}
          contentStyle={styles.buttonContent}
        >
          Login to Save Progress
        </Button>

        <Button
          mode="outlined"
          icon="account-plus"
          onPress={() => router.push('/(public)/register')}
          style={styles.registerButton}
          contentStyle={styles.buttonContent}
        >
          Create Account
        </Button>
      </View>

      <View style={styles.featuresCard}>
        <Card style={styles.featuresInnerCard}>
          <Card.Content>
            <Title style={styles.featuresTitle}>Login to unlock:</Title>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>Save your learning progress</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>Track statistics & achievements</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.featureText}>Unlimited card reviews</Text>
            </View>
            {progressCount > 0 && (
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
                <Text style={styles.featureText}>Save your {progressCount} reviewed cards</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  card: {
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 28,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  progressCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressNote: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  loginButton: {
    paddingVertical: 6,
  },
  registerButton: {
    paddingVertical: 6,
  },
  buttonContent: {
    height: 48,
  },
  featuresCard: {
    marginTop: 'auto',
  },
  featuresInnerCard: {
    backgroundColor: Colors.surface,
  },
  featuresTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
});