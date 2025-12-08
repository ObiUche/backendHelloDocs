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


@Service
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private UserService userService;

    public List<Flashcard> getAllFlashCards(){
        return flashcardRepository.findAll();
    }

    public Flashcard getFlashcardById(Long id){
        return flashcardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found with id " + id));
    }

    public List<Flashcard> getFlashcardByCategory(String category){
        return flashcardRepository.findByCategory(category);
    }

    public List<Flashcard> getFlashcardByDifficultyAndCategory(String difficulty, String category){
        return flashcardRepository.findByDifficultyLevelAndCategory(difficulty.toUpperCase(),category);
    }

    public List<String> getAllCategories(){
        return flashcardRepository.findAllCategories();
    }

    public List<String> getAllDifficultyLevel(){
        return flashcardRepository.findAllDifficultyLevels();
    }

    @Transactional
    public Flashcard createFlashcard(FlashCardDTO flashcardDTO, String username){
        User user = userService.findByUsername(username);

        Flashcard flashcard = new Flashcard();
        flashcard.setFrontContent(flashcardDTO.getFrontContent());
        flashcard.setBackContent(flashcardDTO.getBackContent());
        flashcard.setCategory(flashcardDTO.getCategory());
        flashcard.setDifficultyLevel(flashcardDTO.getDifficultyLevel().toUpperCase());
        flashcard.setExampleCode(flashcardDTO.getExampleCode());
        flashcard.setTags(flashcardDTO.getTags());
        flashcard.setLanguage(flashcardDTO.getLanguage());

        return flashcardRepository.save(flashcard);
    }

    @Transactional
    public Flashcard updateFlashcard(Long id, FlashCardDTO flashCardDTO){
        Flashcard flashcard = getFlashcardById(id);

        flashcard.setFrontContent(flashCardDTO.getFrontContent());
        flashcard.setBackContent(flashCardDTO.getBackContent());
        flashcard.setCategory(flashCardDTO.getCategory());
        flashcard.setDifficultyLevel(flashCardDTO.getDifficultyLevel().toUpperCase());;
        flashcard.setExampleCode(flashCardDTO.getExampleCode());
        flashcard.setTags(flashCardDTO.getTags());
        flashcard.setLanguage(flashCardDTO.getLanguage());

        return flashcardRepository.save(flashcard);

    }

    @Transactional
    public void deleteFlashcard(Long id){
        Flashcard flashcard = getFlashcardById(id);
        flashcardRepository.delete(flashcard);
    }

    @Transactional
    public Flashcard incrementViewCount(Long id){
        Flashcard flashcard = getFlashcardById(id);
        flashcard.setViewCount(flashcard.getViewCount() + 1);
        return flashcardRepository.save(flashcard);
    }

    public Page<Flashcard> getFlashcardsPage(Pageable pageable){
        return flashcardRepository.findAll(pageable);
    }

}
