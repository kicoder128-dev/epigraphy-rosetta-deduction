/**
 * UI Renderer
 * Epigraphy: The Rosetta Deduction
 * 
 * Handles all DOM manipulation and visual updates
 * for the game interface.
 */

class UIRenderer {
  constructor() {
    this.elements = {
      glyphDisplay: document.getElementById('glyphDisplay'),
      contextClue: document.getElementById('contextClue'),
      fragmentsContainer: document.getElementById('fragmentsContainer'),
      logicGrid: document.getElementById('logicGrid'),
      cspStatus: document.getElementById('cspStatus'),
      deductionLog: document.getElementById('deductionLog'),
      deducedSyntax: document.getElementById('deducedSyntax'),
      translationInput: document.getElementById('translationInput'),
      messageBox: document.getElementById('messageBox')
    };
  }

  /**
   * Render glyph symbols on the temple wall
   * @param {string[]} glyphs 
   * @param {number[]} partialReveals 
   */
  renderGlyphs(glyphs, partialReveals = []) {
    this.elements.glyphDisplay.innerHTML = glyphs.map((g, idx) => `
      <span class="glyph ${partialReveals.includes(idx) ? 'partial-clue' : ''}" 
            data-index="${idx}" 
            title="Glyph ${idx + 1}">
        ${g}
      </span>
    `).join('');
  }

  /**
   * Render fragment clue cards
   * @param {object[]} fragmentClues 
   */
  renderFragments(fragmentClues) {
    this.elements.fragmentsContainer.innerHTML = fragmentClues.map(clue => `
      <div class="fragment-card ${clue.type === 'elimination' ? 'revealed' : ''}">
        <div class="context-text">${clue.title}</div>
        <div style="font-size:0.85rem; margin:0.3rem 0;">${clue.description}</div>
        <div class="clue-detail">${clue.detail}</div>
      </div>
    `).join('');
  }

  /**
   * Render the logic matrix grid
   * @param {CSPEngine} cspEngine 
   * @param {string[]} glyphs 
   * @param {string[]} meanings 
   */
  renderMatrix(cspEngine, glyphs, meanings) {
    this.elements.logicGrid.innerHTML = glyphs.map((glyph, idx) => {
      const assigned = cspEngine.playerAssignments[idx] || '';
      const available = cspEngine.getAvailableMeanings(idx);
      const isConstrained = cspEngine.eliminatedDomains[idx]?.size > 0;
      
      return `
        <div class="row">
          <span class="glyph-small ${isConstrained ? 'constrained' : ''}">${glyph}</span>
          <div class="options">
            ${meanings.map(mean => {
              const isSelected = (cspEngine.playerAssignments[idx] === mean);
              const isEliminated = cspEngine.eliminatedDomains[idx]?.has(mean);
              const isUnavailable = !available.includes(mean) && !isSelected;
              
              let classes = 'meaning-btn';
              if (isSelected) classes += ' selected';
              if (isEliminated || isUnavailable) classes += ' eliminated';
              if (isSelected && !cspEngine.runConsistencyCheck()) classes += ' conflict';
              
              return `<button class="${classes}" 
                data-glyph="${idx}" 
                data-meaning="${mean}"
                ${isEliminated || isUnavailable ? 'disabled' : ''}>
                ${mean}
              </button>`;
            }).join('')}
          </div>
          <span style="font-size:0.8rem; color:#4d3820; min-width:60px;">
            ${assigned ? '→ ' + assigned : ''}
          </span>
        </div>
      `;
    }).join('');
  }

  /**
   * Update CSP status indicator
   * @param {CSPEngine} cspEngine 
   */
  updateCSPStatus(cspEngine) {
    const consistent = cspEngine.runConsistencyCheck();
    const assignedCount = cspEngine.getAssignmentCount();
    const totalGlyphs = cspEngine.glyphs.length;
    
    let statusText, color;
    
    if (!consistent) {
      statusText = '⚠️ CSP CONFLICT: impossible state detected';
      color = '#aa3a2e';
    } else if (assignedCount === totalGlyphs) {
      statusText = '✅ all glyphs assigned · matrix fully consistent';
      color = '#2f5a1e';
    } else {
      statusText = `🔷 ${assignedCount}/${totalGlyphs} assigned · constraints satisfied`;
      color = '#5e4326';
    }
    
    this.elements.cspStatus.innerHTML = statusText;
    this.elements.cspStatus.style.color = color;
  }

  /**
   * Update syntax hint display
   * @param {CSPEngine} cspEngine 
   * @param {number[]} syntaxTemplate 
   */
  updateSyntaxHint(cspEngine, syntaxTemplate) {
    if (cspEngine.isComplete()) {
      const ordered = syntaxTemplate
        .map(idx => cspEngine.playerAssignments[idx] || '?')
        .join(' ');
      this.elements.deducedSyntax.innerHTML = 
        `📐 Your deduced phrase: [${ordered}] (from fragment sequence)`;
    } else {
      const partial = syntaxTemplate
        .map(idx => cspEngine.playerAssignments[idx] || '?')
        .join(' ');
      this.elements.deducedSyntax.innerHTML = 
        `📐 Current reading: [${partial}] · assign all ${cspEngine.glyphs.length} glyphs`;
    }
  }

  /**
   * Show message in the message box
   * @param {string} message 
   * @param {string} type - 'success', 'error', or 'info'
   */
  showMessage(message, type = 'info') {
    this.elements.messageBox.innerHTML = message;
    this.elements.messageBox.className = `message-box ${type}`;
  }

  /**
   * Clear message box
   */
  clearMessage() {
    this.elements.messageBox.innerHTML = '';
    this.elements.messageBox.className = 'message-box';
  }

  /**
   * Update deduction log
   * @param {string} text 
   */
  updateDeductionLog(text) {
    this.elements.deductionLog.innerHTML = text;
  }

  /**
   * Update context clue badge
   * @param {string} text 
   */
  updateContextClue(text) {
    this.elements.contextClue.innerText = text;
  }

  /**
   * Clear translation input
   */
  clearTranslationInput() {
    this.elements.translationInput.value = '';
  }

  /**
   * Get translation input value
   * @returns {string}
   */
  getTranslationInput() {
    return this.elements.translationInput.value.trim().toUpperCase();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIRenderer;
}