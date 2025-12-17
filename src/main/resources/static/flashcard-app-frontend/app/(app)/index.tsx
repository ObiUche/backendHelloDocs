import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ActivityIndicator, Button, Card, FAB, Searchbar } from 'react-native-paper';
import { FlashcardItem } from '../../components/FlashcardItem';
import { Colors } from '../../constants/Colors';
import { Styles } from '../../constants/Styles';
import { FlashcardService } from '../../services/api';
import { FilterOptions, Flashcard } from '../../types/flashcard';

export default function BrowseScreen() {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterFlashcards();
  }, [searchQuery, flashcards]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cards, cats, diffs] = await Promise.all([
        FlashcardService.getAllFlashcards(),
        FlashcardService.getCategories(),
        FlashcardService.getDifficultyLevels(),
      ]);
      setFlashcards(cards);
      setFilteredFlashcards(cards);
      setCategories(cats);
      setDifficulties(diffs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load flashcards. Please check your connection.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterFlashcards = () => {
    let filtered = [...flashcards];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => {
        const frontText = card.frontContent?.toLowerCase() || '';
        const backText = card.backContent?.toLowerCase() || '';
        const tagsString = card.tags || '';
        const tagsArray = tagsString.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        
        return (
          frontText.includes(query) ||
          backText.includes(query) ||
          tagsArray.some(tag => tag.includes(query))
        );
      });
    }

    if (filters.difficultyLevel) {
      filtered = filtered.filter(card => card.difficultyLevel === filters.difficultyLevel);
    }
    if (filters.category) {
      filtered = filtered.filter(card => card.category === filters.category);
    }
    if (filters.language) {
      filtered = filtered.filter(card => card.language === filters.language);
    }

    setFilteredFlashcards(filtered);
  };

  const applyFilters = async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    try {
      setLoading(true);
      const filteredCards = await FlashcardService.getFlashcardsWithFilters(newFilters);
      setFlashcards(filteredCards);
    } catch (error) {
      Alert.alert('Error', 'Failed to apply filters');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    loadData();
  };

  const handleFlashcardPress = (flashcard: Flashcard) => {
    router.push({
      pathname: '/flashcard-detail',
      params: { id: flashcard.id.toString() }
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Searchbar
        placeholder="Search flashcards..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <MaterialCommunityIcons name="filter-variant" size={20} color={Colors.primary} />
        <Text style={styles.filterButtonText}>
          Filters {Object.keys(filters).length > 0 ? `(${Object.keys(filters).length})` : ''}
        </Text>
      </TouchableOpacity>

      {showFilters && (
        <Card style={styles.filtersCard}>
          <Card.Content>
            <Text style={styles.filterTitle}>Difficulty</Text>
            <View style={styles.filterOptions}>
              {difficulties.map(level => (
                <Button
                  key={level}
                  mode={filters.difficultyLevel === level ? 'contained' : 'outlined'}
                  onPress={() => applyFilters({ ...filters, difficultyLevel: level })}
                  style={styles.filterButtonSmall}
                >
                  {level}
                </Button>
              ))}
            </View>

            <Text style={styles.filterTitle}>Category</Text>
            <View style={styles.filterOptions}>
              {categories.slice(0, 5).map(category => (
                <Button
                  key={category}
                  mode={filters.category === category ? 'contained' : 'outlined'}
                  onPress={() => applyFilters({ ...filters, category })}
                  style={styles.filterButtonSmall}
                >
                  {category}
                </Button>
              ))}
            </View>

            <Button mode="text" onPress={clearFilters} style={styles.clearButton} icon="close-circle">
              Clear All Filters
            </Button>
          </Card.Content>
        </Card>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading flashcards...</Text>
      </View>
    );
  }

  return (
    <View style={Styles.screenContainer}>
      <FlatList
        data={filteredFlashcards}
        renderItem={({ item }) => (
          <FlashcardItem flashcard={item} onPress={() => handleFlashcardPress(item)} />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cards-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>No flashcards found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || Object.keys(filters).length > 0
                ? 'Try changing your search or filters'
                : 'Add your first flashcard!'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      />
      
      <FAB icon="plus" style={styles.fab} onPress={() => Alert.alert('Add New', 'Implement create flashcard screen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: 16 },
  searchBar: { marginBottom: 12, elevation: 0, backgroundColor: Colors.background },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: 12, borderRadius: 8, marginBottom: 16 },
  filterButtonText: { marginLeft: 8, color: Colors.primary, fontWeight: '600' },
  filtersCard: { marginBottom: 16 },
  filterTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 8 },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterButtonSmall: { marginRight: 4, marginBottom: 4 },
  clearButton: { marginTop: 8 },
  listContent: { padding: 16, paddingBottom: 80 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: Colors.textSecondary },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: Colors.text, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: Colors.primary },
});