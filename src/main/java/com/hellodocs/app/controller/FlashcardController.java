package com.hellodocs.app.controller;

import com.hellodocs.app.dto.FlashCardDTO;
import com.hellodocs.app.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping
    public ResponseEntity<List<FlashCardDTO>> getAllFlashcards() {
        List<FlashCardDTO> flashcards = flashcardService.getAllFlashCards();
        return ResponseEntity.ok(flashcards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlashCardDTO> getFlashcardById(@PathVariable Long id) {
        FlashCardDTO flashcard = flashcardService.getFlashcardById(id);
        return ResponseEntity.ok(flashcard);
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<FlashCardDTO>> getFlashcardsByDifficulty(@PathVariable String difficulty) {
        List<FlashCardDTO> flashcards = flashcardService.getFlashcardByDifficulty(difficulty);
        return ResponseEntity.ok(flashcards);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FlashCardDTO>> getFlashcardsByCategory(@PathVariable String category) {
        List<FlashCardDTO> flashcards = flashcardService.getFlashcardByCategory(category);
        return ResponseEntity.ok(flashcards);
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlashCardDTO>> searchFlashcards(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category) {

        List<FlashCardDTO> flashcards;
        if (difficulty != null && category != null) {
            flashcards = flashcardService.getFlashcardByDifficultyAndCategory(difficulty, category);
        } else if (difficulty != null) {
            flashcards = flashcardService.getFlashcardByDifficulty(difficulty);
        } else if (category != null) {
            flashcards = flashcardService.getFlashcardByCategory(category);
        } else {
            flashcards = flashcardService.getAllFlashCards();
        }

        return ResponseEntity.ok(flashcards);
    }

    @PostMapping
    public ResponseEntity<FlashCardDTO> createFlashcard(
            @Valid @RequestBody FlashCardDTO flashcardDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        FlashCardDTO createdFlashcard = flashcardService.createFlashcard(flashcardDTO, username);
        return ResponseEntity.ok(createdFlashcard);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlashCardDTO> updateFlashcard(
            @PathVariable Long id,
            @Valid @RequestBody FlashCardDTO flashcardDTO) {

        FlashCardDTO updatedFlashcard = flashcardService.updateFlashcard(id, flashcardDTO);
        return ResponseEntity.ok(updatedFlashcard);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable Long id) {
        flashcardService.deleteFlashcard(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<FlashCardDTO> incrementViewCount(@PathVariable Long id) {
        FlashCardDTO updatedFlashcard = flashcardService.incrementViewCount(id);
        return ResponseEntity.ok(updatedFlashcard);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<FlashCardDTO>> getFlashcardsPage(Pageable pageable) {
        Page<FlashCardDTO> flashcardPage = flashcardService.getFlashcardsPage(pageable);
        return ResponseEntity.ok(flashcardPage);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = flashcardService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/difficulties")
    public ResponseEntity<List<String>> getAllDifficultyLevels() {
        List<String> difficulties = flashcardService.getAllDifficultyLevel();
        return ResponseEntity.ok(difficulties);
    }
}