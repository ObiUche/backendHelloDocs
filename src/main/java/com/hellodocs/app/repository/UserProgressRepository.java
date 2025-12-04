package com.hellodocs.app.repository;

import com.hellodocs.app.entity.User;
import com.hellodocs.app.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress,Long>{


    Optional<UserProgress> findByUserAndFlashcardId(User user, Long flashcardId);

    List<UserProgress> findByUser(User user);

    @Query("SELECT up FROM UserProgress up WHERE up.user = :user AND up.masteryLevel < 0.8")
    List<UserProgress> findWeakAreaByUser(@Param("user") User user);

    @Query("SELECT up.flashcard.difficultyLevel, COUNT(up) , AVG(up.masteryLevel) "+
            "FROM UserProgress  up WHERE up.user = :user GROUP BY up.flashcard.difficultyLevel")
    List<Object[]> findProgressSummaryByUser(@Param("user") User user);
    
    
}
