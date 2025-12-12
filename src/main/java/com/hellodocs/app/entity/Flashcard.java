package com.hellodocs.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "flashcards")
public class Flashcard {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String frontContent;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String backContent;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String difficultyLevel;

    @Column(nullable = false)
    private String language = "java";

    @Column(columnDefinition = "TEXT")
    private String exampleCode;

    @Column(length = 1000)
    private String tags;

    @Column(nullable = false)
    private int viewCount = 0;

    @Column(nullable = false)
    private int masteryScore = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Flashcard(){
        this.createdAt = LocalDateTime.now();
    }

    public Flashcard(String frontContent, String backContent,
                     String category , String difficultyLevel){
        this();
        this.frontContent = frontContent;
        this.backContent = backContent;
        this.category = category;
        this.difficultyLevel = difficultyLevel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFrontContent() {
        return frontContent;
    }

    public void setFrontContent(String frontContent) {
        this.frontContent = frontContent;
    }

    public String getBackContent() {
        return backContent;
    }

    public void setBackContent(String backContent) {
        this.backContent = backContent;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getExampleCode() {
        return exampleCode;
    }

    public void setExampleCode(String exampleCode) {
        this.exampleCode = exampleCode;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public int getMasteryScore() {
        return masteryScore;
    }

    public void setMasteryScore(int masteryScore) {
        this.masteryScore = masteryScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @PreUpdate
    protected void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }
}
