/**
 * Puzzle Generator
 * Epigraphy: The Rosetta Deduction
 * 
 * Creates procedurally generated languages, syntax structures,
 * and contextual clue sheets for infinite replayability.
 */

class PuzzleGenerator {
  constructor() {
    this.GLYPH_SYMBOLS = ["𓀀", "𓁛", "𓃀", "⚰️", "𓋹", "𓆣", "𓂀", "𓅓"];
    this.MEANING_POOL = [
      "KING", "SON", "DIED", "REST", 
      "PRIEST", "TEMPLE", "OFFERING", "ETERNAL"
    ];
    
    this.grammarClues = [
      "The verb typically appears at the end of ceremonial phrases.",
      "Titles precede names in this culture's inscriptions.",
      "The subject usually occupies the first position in declarations.",
      "Modifiers follow the nouns they describe in ritual texts.",
      "Honorific titles appear before personal names.",
    ];
  }

  /**
   * Generate a completely new puzzle
   * @returns {object} Puzzle state
   */
  generate() {
    const glyphCount = 4 + Math.floor(Math.random() * 2); // 4-5 glyphs
    const glyphs = this.shuffleArray([...this.GLYPH_SYMBOLS]).slice(0, glyphCount);
    const meanings = this.shuffleArray([...this.MEANING_POOL]).slice(0, glyphCount);
    
    // Create bijective mapping
    const indices = Array.from({length: glyphCount}, (_, i) => i);
    const shuffledIndices = this.shuffleArray([...indices]);
    
    const correctMapping = {};
    for (let i = 0; i < glyphCount; i++) {
      correctMapping[i] = meanings[shuffledIndices[i]];
    }
    
    // Generate syntax template
    const templateLength = Math.min(3 + Math.floor(Math.random() * 2), glyphCount);
    const syntaxTemplate = this.shuffleArray([...indices]).slice(0, templateLength);
    
    const validTranslationString = syntaxTemplate
      .map(idx => correctMapping[idx])
      .join(' ');
    
    // Generate contextual clues
    const fragmentClues = this.generateClues(glyphs, meanings, correctMapping, syntaxTemplate);
    
    return {
      glyphs,
      meanings,
      correctMapping,
      syntaxTemplate,
      validTranslationString,
      fragmentClues
    };
  }

  /**
   * Generate rich contextual fragment clues
   * @param {string[]} glyphs 
   * @param {string[]} meanings 
   * @param {object} correctMapping 
   * @param {number[]} syntaxTemplate 
   * @returns {object[]}
   */
  generateClues(glyphs, meanings, correctMapping, syntaxTemplate) {
    const clues = [];
    const syntaxOrder = syntaxTemplate.map(idx => correctMapping[idx]);
    
    // Clue 1: Observation fragment
    const observationClues = [
      { glyph: glyphs[syntaxTemplate[0]], clue: 'appears beside royal regalia' },
      { glyph: glyphs[syntaxTemplate[1]], clue: 'found near burial chamber entrance' },
      { glyph: glyphs[syntaxTemplate[2]], clue: 'inscribed on offering vessels' },
    ];
    
    clues.push({
      title: '🏺 Royal Chamber Mural',
      description: `A vibrant mural shows "${glyphs[syntaxTemplate[0]]} ${glyphs[syntaxTemplate[1]]} ${glyphs[syntaxTemplate[2]]}" in procession.`,
      detail: `The first symbol ${observationClues[0].clue}. The sequence appears ceremonial.`,
      type: 'observation',
      glyphs: syntaxTemplate
    });
    
    // Clue 2: Elimination fragment
    const eliminationTarget = glyphs[Math.floor(Math.random() * glyphs.length)];
    const targetIndex = glyphs.indexOf(eliminationTarget);
    const possibleEliminations = meanings.filter(m => m !== correctMapping[targetIndex]);
    const eliminatedMeaning = possibleEliminations[Math.floor(Math.random() * possibleEliminations.length)];
    
    clues.push({
      title: '⚰️ Sarcophagus Inscription',
      description: `A stone sarcophagus reads: "${eliminationTarget} is not ${eliminatedMeaning}" in accompanying hieratic text.`,
      detail: `This eliminates one possibility for ${eliminationTarget}.`,
      type: 'elimination',
      glyph: eliminationTarget,
      eliminatedMeaning: eliminatedMeaning
    });
    
    // Clue 3: Grammar clue
    const grammarClue = this.grammarClues[Math.floor(Math.random() * this.grammarClues.length)];
    
    clues.push({
      title: '📜 Grammarian\'s Notes',
      description: `A scholar's marginalia: "${grammarClue}"`,
      detail: 'This hints at the word order structure.',
      type: 'grammar',
      clue: grammarClue
    });
    
    // Clue 4: Hint placeholder
    clues.push({
      title: '🔍 Archaeologist\'s Sketch',
      description: 'A faded sketch shows partial translations from a similar dialect.',
      detail: 'Click "partial clue" button to reveal one glyph-meaning pair.',
      type: 'hint'
    });
    
    return clues;
  }

  /**
   * Fisher-Yates shuffle
   * @param {Array} array 
   * @returns {Array}
   */
  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PuzzleGenerator;
}