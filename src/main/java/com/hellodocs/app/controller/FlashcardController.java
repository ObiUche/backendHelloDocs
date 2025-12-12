package com.hellodocs.app.controller;

import com.hellodocs.app.dto.FlashCardDTO;
import com.hellodocs.app.entity.Flashcard;
import com.hellodocs.app.service.FlashcardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping
    public ResponseEntity<List<Flashcard>> getAllFlashcards() {
        return ResponseEntity.ok(flashcardService.getAllFlashCards());
    }

    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> getFlashcardsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Flashcard> flashcardPage = flashcardService.getFlashcardsPage(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("flashcards", flashcardPage.getContent());
        response.put("currentPage", flashcardPage.getNumber());
        response.put("totalItems", flashcardPage.getTotalElements());
        response.put("totalPages", flashcardPage.getTotalPages());

        return ResponseEntity.ok(response);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Flashcard> getFlashcardById(@PathVariable Long id) {
        Flashcard flashcard = flashcardService.getFlashcardById(id);
        flashcardService.incrementViewCount(id);
        return ResponseEntity.ok(flashcard);
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<Flashcard>> getFlashcardsByDifficulty(@PathVariable String level) {
        return ResponseEntity.ok(flashcardService.getFlashcardByDifficulty(level));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Flashcard>> getFlashcardsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(flashcardService.getFlashcardByCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(flashcardService.getAllCategories());
    }

    @GetMapping("/difficulty-levels")
    public ResponseEntity<List<String>> getAllDifficultyLevels() {
        return ResponseEntity.ok(flashcardService.getAllDifficultyLevel());
    }

    @GetMapping("filter")
    public ResponseEntity<List<Flashcard>> getFlashcardsByDifficultyAndCategory(
            @RequestParam String difficulty,
            @RequestParam String category
    ) {
        return ResponseEntity.ok(flashcardService.getFlashcardByDifficultyAndCategory(difficulty, category));
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Flashcard> createFlashcard(
            @Valid @RequestBody FlashCardDTO flashCardDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        Flashcard flashcard = flashcardService.createFlashcard(flashCardDTO, userDetails.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(flashcard);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Flashcard> updateFlashcard(
            @PathVariable Long id,
            @Valid @RequestBody FlashCardDTO flashCardDTO) {
        Flashcard flashcard = flashcardService.updateFlashcard(id, flashCardDTO);
        return ResponseEntity.ok(flashcard);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable Long id) {
        flashcardService.deleteFlashcard(id);
        return ResponseEntity.noContent().build();
    }


}