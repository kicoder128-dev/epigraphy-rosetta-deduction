/**
 * Main Game Controller
 * Epigraphy: The Rosetta Deduction
 * 
 * Orchestrates the CSP engine, puzzle generator, and UI renderer.
 */

(function() {
  'use strict';

  // Wait for DOM and dependencies
  if (typeof CSPEngine === 'undefined' || 
      typeof PuzzleGenerator === 'undefined' || 
      typeof UIRenderer === 'undefined') {
    console.error('Required modules not loaded. Check script order.');
    return;
  }

  const puzzleGenerator = new PuzzleGenerator();
  const ui = new UIRenderer();
  
  let cspEngine = null;
  let currentPuzzle = null;
  let partialReveals = [];

  /**
   * Initialize a new puzzle
   */
  function initNewPuzzle() {
    currentPuzzle = puzzleGenerator.generate();
    
    cspEngine = new CSPEngine(
      currentPuzzle.glyphs,
      currentPuzzle.meanings,
      currentPuzzle.correctMapping
    );
    
    partialReveals = [];
    
    // Apply elimination clues
    currentPuzzle.fragmentClues.forEach(clue => {
      if (clue.type === 'elimination') {
        const glyphIndex = currentPuzzle.glyphs.indexOf(clue.glyph);
        if (glyphIndex >= 0) {
          cspEngine.eliminateFromDomain(glyphIndex, clue.eliminatedMeaning);
        }
      }
    });
    
    // Render everything
    renderAll();
    
    // Update UI state
    ui.updateContextClue('🌀 new language generated');
    ui.clearMessage();
    ui.clearTranslationInput();
    ui.updateDeductionLog('');
  }

  /**
   * Render all UI components
   */
  function renderAll() {
    ui.renderGlyphs(currentPuzzle.glyphs, partialReveals);
    ui.renderFragments(currentPuzzle.fragmentClues);
    ui.renderMatrix(cspEngine, currentPuzzle.glyphs, currentPuzzle.meanings);
    ui.updateCSPStatus(cspEngine);
    ui.updateSyntaxHint(cspEngine, currentPuzzle.syntaxTemplate);
    
    // Attach matrix button handlers
    attachMatrixHandlers();
  }

  /**
   * Attach click handlers to meaning buttons
   */
  function attachMatrixHandlers() {
    document.querySelectorAll('.meaning-btn:not(.eliminated)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const glyphIdx = parseInt(btn.dataset.glyph);
        const meaning = btn.dataset.meaning;
        
        cspEngine.assignMeaning(glyphIdx, meaning);
        
        renderAll();
      });
    });
  }

  /**
   * Handle translation validation
   */
  function handleValidation() {
    const input = ui.getTranslationInput();
    
    if (!input) {
      ui.showMessage('Please enter a translation hypothesis.', 'error');
      return;
    }
    
    const result = cspEngine.validateTranslation(
      currentPuzzle.syntaxTemplate, 
      input
    );
    
    ui.showMessage(result.message, result.type);
    
    if (result.isCorrect) {
      ui.updateDeductionLog('🎉 Puzzle solved! Generate a new language for another challenge.');
    }
  }

  /**
   * Reset player assignments
   */
  function handleReset() {
    cspEngine.reset();
    partialReveals = [];
    
    // Re-apply elimination clues
    currentPuzzle.fragmentClues.forEach(clue => {
      if (clue.type === 'elimination') {
        const glyphIndex = currentPuzzle.glyphs.indexOf(clue.glyph);
        if (glyphIndex >= 0) {
          cspEngine.eliminateFromDomain(glyphIndex, clue.eliminatedMeaning);
        }
      }
    });
    
    renderAll();
    ui.clearMessage();
    ui.clearTranslationInput();
    ui.updateDeductionLog('');
  }

  /**
   * Reveal a partial clue for an unassigned glyph
   */
  function handleHint() {
    if (cspEngine.isComplete()) {
      ui.showMessage('All glyphs already assigned!', 'info');
      return;
    }
    
    const unassigned = [];
    for (let i = 0; i < cspEngine.glyphs.length; i++) {
      if (!cspEngine.playerAssignments[i]) {
        unassigned.push(i);
      }
    }
    
    if (unassigned.length === 0) return;
    
    const randomIndex = unassigned[Math.floor(Math.random() * unassigned.length)];
    const correctMeaning = cspEngine.correctMapping[randomIndex];
    
    partialReveals.push(randomIndex);
    
    ui.updateDeductionLog(
      `💡 Partial reveal: ${currentPuzzle.glyphs[randomIndex]} might relate to ${correctMeaning}...`
    );
    
    renderAll();
  }

  /**
   * Handle new puzzle generation
   */
  function handleNewPuzzle() {
    initNewPuzzle();
  }

  // Event Listeners
  document.getElementById('validateBtn').addEventListener('click', handleValidation);
  document.getElementById('resetDeduction').addEventListener('click', handleReset);
  document.getElementById('hintBtn').addEventListener('click', handleHint);
  document.getElementById('newPuzzleBtn').addEventListener('click', handleNewPuzzle);

  // Allow Enter key to validate
  document.getElementById('translationInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleValidation();
    }
  });

  // Initialize first puzzle
  initNewPuzzle();

  console.log('🏺 Epigraphy: The Rosetta Deduction - Initialized');
  console.log('   CSP Engine active · Procedural generation ready');
})();