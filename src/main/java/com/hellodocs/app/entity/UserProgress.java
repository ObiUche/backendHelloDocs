package com.hellodocs.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_id", nullable = false)
    private Flashcard flashcard;

    @Column(nullable = false)
    private int timesReviewed = 0;

    @Column(nullable = false)
    private int correctAnswers = 0;

    @Column(nullable = false)
    private int incorrectAnswers = 0;

    @Column(nullable = false)
    private double masteryLevel = 0.0;

    @Column(nullable = false)
    private LocalDateTime lastReviewed;

    private LocalDateTime nextReview;


    public UserProgress(){
        this.lastReviewed = LocalDateTime.now();
    }

    public UserProgress(User user, Flashcard flashcard){
        this();
        this.user = user;
        this.flashcard = flashcard;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Flashcard getFlashcard() {
        return flashcard;
    }

    public void setFlashcard(Flashcard flashcard) {
        this.flashcard = flashcard;
    }

    public int getTimesReviewed() {
        return timesReviewed;
    }

    public void setTimesReviewed(int timesReviewed) {
        this.timesReviewed = timesReviewed;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public int getIncorrectAnswers() {
        return incorrectAnswers;
    }

    public void setIncorrectAnswers(int incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }

    public double getMasteryLevel() {
        return masteryLevel;
    }

    public void setMasteryLevel(double masteryLevel) {
        this.masteryLevel = masteryLevel;
    }

    public LocalDateTime getLastReviewed() {
        return lastReviewed;
    }

    public void setLastReviewed(LocalDateTime lastReviewed) {
        this.lastReviewed = lastReviewed;
    }

    public LocalDateTime getNextReview() {
        return nextReview;
    }

    public void setNextReview(LocalDateTime nextReview) {
        this.nextReview = nextReview;
    }
}
