package com.hellodocs.app.service;

import com.hellodocs.app.dto.FlashCardDTO;
import com.hellodocs.app.entity.Flashcard;
import com.hellodocs.app.entity.User;
import com.hellodocs.app.exception.ResourceNotFoundException;
import com.hellodocs.app.repository.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private UserService userService;

    // Return DTOs instead of entities
    public List<FlashCardDTO> getAllFlashCards() {
        List<Flashcard> flashcards = flashcardRepository.findAll();
        return flashcards.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public FlashCardDTO getFlashcardById(Long id) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found with id " + id));
        return convertToDto(flashcard);
    }

    public List<FlashCardDTO> getFlashcardByDifficulty(String difficulty) {
        List<Flashcard> flashcards = flashcardRepository.findByDifficultyLevel(difficulty.toUpperCase());
        return flashcards.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<FlashCardDTO> getFlashcardByCategory(String category) {
        List<Flashcard> flashcards = flashcardRepository.findByCategory(category);
        return flashcards.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<FlashCardDTO> getFlashcardByDifficultyAndCategory(String difficulty, String category) {
        List<Flashcard> flashcards = flashcardRepository.findByDifficultyLevelAndCategory(difficulty.toUpperCase(), category);
        return flashcards.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return flashcardRepository.findAllCategories();
    }

    public List<String> getAllDifficultyLevel() {
        return flashcardRepository.findAllDifficultyLevels();
    }

    @Transactional
    public FlashCardDTO createFlashcard(FlashCardDTO flashcardDTO, String username) {
        User user = userService.findByUsername(username);

        Flashcard flashcard = new Flashcard();
        flashcard.setFrontContent(flashcardDTO.getFrontContent());
        flashcard.setBackContent(flashcardDTO.getBackContent());
        flashcard.setCategory(flashcardDTO.getCategory());
        flashcard.setDifficultyLevel(flashcardDTO.getDifficultyLevel().toUpperCase());
        flashcard.setExampleCode(flashcardDTO.getExampleCode());
        flashcard.setTags(flashcardDTO.getTags());
        flashcard.setLanguage(flashcardDTO.getLanguage());
        flashcard.setUser(user); // Don't forget to set the user!

        Flashcard savedFlashcard = flashcardRepository.save(flashcard);
        return convertToDto(savedFlashcard);
    }

    @Transactional
    public FlashCardDTO updateFlashcard(Long id, FlashCardDTO flashCardDTO) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found with id " + id));

        flashcard.setFrontContent(flashCardDTO.getFrontContent());
        flashcard.setBackContent(flashCardDTO.getBackContent());
        flashcard.setCategory(flashCardDTO.getCategory());
        flashcard.setDifficultyLevel(flashCardDTO.getDifficultyLevel().toUpperCase());
        flashcard.setExampleCode(flashCardDTO.getExampleCode());
        flashcard.setTags(flashCardDTO.getTags());
        flashcard.setLanguage(flashCardDTO.getLanguage());

        Flashcard updatedFlashcard = flashcardRepository.save(flashcard);
        return convertToDto(updatedFlashcard);
    }

    @Transactional
    public void deleteFlashcard(Long id) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found with id " + id));
        flashcardRepository.delete(flashcard);
    }

    @Transactional
    public FlashCardDTO incrementViewCount(Long id) {
        Flashcard flashcard = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found with id " + id));
        flashcard.setViewCount(flashcard.getViewCount() + 1);
        Flashcard updatedFlashcard = flashcardRepository.save(flashcard);
        return convertToDto(updatedFlashcard);
    }

    public Page<FlashCardDTO> getFlashcardsPage(Pageable pageable) {
        Page<Flashcard> flashcardPage = flashcardRepository.findAll(pageable);
        return flashcardPage.map(this::convertToDto);
    }

    // Helper method to convert Entity to DTO
    private FlashCardDTO convertToDto(Flashcard flashcard) {
        FlashCardDTO dto = new FlashCardDTO();
        dto.setId(flashcard.getId());
        dto.setFrontContent(flashcard.getFrontContent());
        dto.setBackContent(flashcard.getBackContent());
        dto.setCategory(flashcard.getCategory());
        dto.setDifficultyLevel(flashcard.getDifficultyLevel());
        dto.setExampleCode(flashcard.getExampleCode());
        dto.setTags(flashcard.getTags());
        dto.setLanguage(flashcard.getLanguage());
        return dto;
    }

    // Helper method to convert DTO to Entity (if needed)
    private Flashcard convertToEntity(FlashCardDTO dto) {
        Flashcard flashcard = new Flashcard();
        flashcard.setId(dto.getId());
        flashcard.setFrontContent(dto.getFrontContent());
        flashcard.setBackContent(dto.getBackContent());
        flashcard.setCategory(dto.getCategory());
        flashcard.setDifficultyLevel(dto.getDifficultyLevel());
        flashcard.setExampleCode(dto.getExampleCode());
        flashcard.setTags(dto.getTags());
        flashcard.setLanguage(dto.getLanguage());
        return flashcard;
    }
}