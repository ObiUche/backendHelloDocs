import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, List, Text, Title } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons
              name="account-circle"
              size={80}
              color={Colors.primary}
            />
          </View>
          <Title style={styles.username}>{user?.username}</Title>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <MaterialCommunityIcons
              name={user?.role === 'ADMIN' ? 'shield' : 'account'}
              size={16}
              color="#fff"
            />
            <Text style={styles.roleText}>{user?.role}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <List.Section>
          <List.Item
            title="Study Stats"
            description="View your learning statistics"
            left={() => (
              <MaterialCommunityIcons
                name="chart-bar"
                size={24}
                color={Colors.primary}
              />
            )}
            onPress={() => Alert.alert('Info', 'Stats feature coming soon!')}
          />
          <Divider />
          <List.Item
            title="Achievements"
            description="Your badges and accomplishments"
            left={() => (
              <MaterialCommunityIcons
                name="trophy"
                size={24}
                color={Colors.warning}
              />
            )}
            onPress={() => Alert.alert('Info', 'Achievements coming soon!')}
          />
          <Divider />
          <List.Item
            title="Settings"
            description="App preferences and configuration"
            left={() => (
              <MaterialCommunityIcons
                name="cog"
                size={24}
                color={Colors.textSecondary}
              />
            )}
            onPress={() => Alert.alert('Info', 'Settings coming soon!')}
          />
        </List.Section>
      </Card>

      <Button
        mode="outlined"
        icon="logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor={Colors.error}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  profileCard: { marginBottom: 16 },
  profileContent: { alignItems: 'center' },
  avatarContainer: { marginBottom: 16 },
  username: { fontSize: 24, marginBottom: 4 },
  email: { color: Colors.textSecondary, marginBottom: 12 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleText: { color: '#fff', fontWeight: '600' },
  menuCard: { marginBottom: 16 },
  logoutButton: { borderColor: Colors.error },
});