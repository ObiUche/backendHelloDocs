package com.hellodocs.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FlashCardDTO {

    private Long id;

    @NotBlank(message = "Front content is required")
    @Size(max = 500, message = "Front content must be less than 500 Chars")
    private String frontContent;

    @NotBlank(message = "Back content is required")
    @Size(max = 2000, message = "Back content must be less than 2000 chars")
    private String backContent;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Difficulty level is require")
    private String difficultyLevel;

    private String exampleCode;

    private String tags;

    private String language  = "java";

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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
