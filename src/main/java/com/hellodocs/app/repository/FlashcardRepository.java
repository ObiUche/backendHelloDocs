package com.hellodocs.app.repository;

import com.hellodocs.app.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository  extends JpaRepository<Flashcard, Long> {

    List<Flashcard> findByDifficultyLevel(String difficultyLevel);

    List<Flashcard> findByCategory(String category);

    List<Flashcard> findByLanguage(String language);

    List<Flashcard> findByDifficultyLevelAndCategory(String difficultyLevel, String category);

    @Query("SELECT f From Flashcard f WHERE LOWER(f.tags) LIKE LOWER(CONCAT('%', :tag, '%')) ")
    List<Flashcard> findByTag(@Param("tag") String tag);

    @Query("SELECT DISTINCT f.category FROM Flashcard f")
    List<String> findAllCategories();

    @Query("SELECT DISTINCT f.difficultyLevel FROM Flashcard f")
List<String> findAllDifficultyLevels();

}
