/**
 * Constraint Satisfaction Problem (CSP) Engine
 * Epigraphy: The Rosetta Deduction
 * 
 * Implements arc consistency, domain elimination,
 * and logical paradox detection for glyph-meaning assignments.
 */

class CSPEngine {
  constructor(glyphs, meanings, correctMapping) {
    this.glyphs = glyphs;
    this.meanings = meanings;
    this.correctMapping = correctMapping;
    this.playerAssignments = {};
    this.eliminatedDomains = {};
    
    this.initialize();
  }

  /**
   * Initialize player assignments and domain tracking
   */
  initialize() {
    this.playerAssignments = {};
    this.eliminatedDomains = {};
    
    for (let i = 0; i < this.glyphs.length; i++) {
      this.playerAssignments[i] = null;
      this.eliminatedDomains[i] = new Set();
    }
  }

  /**
   * Assign a meaning to a glyph
   * @param {number} glyphIndex - Index of the glyph
   * @param {string} meaning - Meaning to assign
   * @returns {boolean} - Whether assignment was successful
   */
  assignMeaning(glyphIndex, meaning) {
    if (this.eliminatedDomains[glyphIndex]?.has(meaning)) {
      return false; // Meaning is eliminated for this glyph
    }
    
    if (this.playerAssignments[glyphIndex] === meaning) {
      this.playerAssignments[glyphIndex] = null; // Toggle off
      return true;
    }
    
    this.playerAssignments[glyphIndex] = meaning;
    return true;
  }

  /**
   * Check if a specific assignment would create a conflict
   * @param {number} glyphIndex 
   * @param {string} meaning 
   * @returns {boolean}
   */
  hasAssignmentConflict(glyphIndex, meaning) {
    for (let [idx, val] of Object.entries(this.playerAssignments)) {
      if (parseInt(idx) !== glyphIndex && val === meaning) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get available meanings for a glyph considering current assignments
   * @param {number} glyphIndex 
   * @returns {string[]}
   */
  getAvailableMeanings(glyphIndex) {
    const usedMeanings = new Set(
      Object.values(this.playerAssignments).filter(v => v !== null)
    );
    
    return this.meanings.filter(meaning => 
      !usedMeanings.has(meaning) && 
      !this.eliminatedDomains[glyphIndex]?.has(meaning)
    );
  }

  /**
   * Run full CSP consistency check
   * @returns {boolean} - Whether current state is consistent
   */
  runConsistencyCheck() {
    const usedMeanings = new Map();
    
    // Build reverse mapping
    for (let [idx, mean] of Object.entries(this.playerAssignments)) {
      if (mean !== null) {
        usedMeanings.set(mean, parseInt(idx));
      }
    }
    
    // Check for empty domains
    for (let i = 0; i < this.glyphs.length; i++) {
      if (this.playerAssignments[i] !== null) continue;
      
      const available = this.meanings.filter(m => 
        !usedMeanings.has(m) && !this.eliminatedDomains[i]?.has(m)
      );
      
      if (available.length === 0) {
        return false; // Domain wipeout - contradiction
      }
    }
    
    // Check for duplicate assignments
    const assignedValues = Object.values(this.playerAssignments).filter(v => v !== null);
    if (new Set(assignedValues).size !== assignedValues.length) {
      return false;
    }
    
    return true;
  }

  /**
   * Eliminate a meaning from a glyph's domain
   * @param {number} glyphIndex 
   * @param {string} meaning 
   */
  eliminateFromDomain(glyphIndex, meaning) {
    if (this.eliminatedDomains[glyphIndex]) {
      this.eliminatedDomains[glyphIndex].add(meaning);
    }
  }

  /**
   * Check if all glyphs are assigned
   * @returns {boolean}
   */
  isComplete() {
    return Object.values(this.playerAssignments)
      .filter(v => v !== null).length === this.glyphs.length;
  }

  /**
   * Get assignment count
   * @returns {number}
   */
  getAssignmentCount() {
    return Object.values(this.playerAssignments).filter(v => v !== null).length;
  }

  /**
   * Reset all player assignments
   */
  reset() {
    this.initialize();
  }

  /**
   * Validate a translation string against current assignments
   * @param {number[]} syntaxTemplate - Order of glyph indices
   * @param {string} inputTranslation - Player's input
   * @returns {object} - Validation result
   */
  validateTranslation(syntaxTemplate, inputTranslation) {
    if (!this.isComplete()) {
      return {
        valid: false,
        message: 'Assign a meaning to every glyph first.',
        type: 'error'
      };
    }

    if (!this.runConsistencyCheck()) {
      return {
        valid: false,
        message: 'CSP conflict detected! Check for duplicate or impossible assignments.',
        type: 'error'
      };
    }

    const playerTranslation = syntaxTemplate
      .map(idx => this.playerAssignments[idx])
      .join(' ');

    if (inputTranslation !== playerTranslation) {
      return {
        valid: false,
        message: `Input doesn't match your assignments. Based on your matrix: "${playerTranslation}"`,
        type: 'error',
        expectedTranslation: playerTranslation
      };
    }

    const correctTranslation = syntaxTemplate
      .map(idx => this.correctMapping[idx])
      .join(' ');

    if (inputTranslation === correctTranslation) {
      return {
        valid: true,
        message: '🏆 CORRECT! The ancient script yields its true meaning. Excellent deduction!',
        type: 'success',
        isCorrect: true
      };
    }

    return {
      valid: true,
      message: 'Your assignments are consistent but don\'t match the hidden truth. Re-examine the clues.',
      type: 'info',
      isCorrect: false
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CSPEngine;
}