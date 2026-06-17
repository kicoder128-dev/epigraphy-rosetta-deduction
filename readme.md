# 🏺 Epigraphy: The Rosetta Deduction

> *Return of the Obra Dinn meets historical linguistics and cryptanalysis*

A browser-based archaeological deciphering game where you play as an archaeologist decoding a lost ancient language using formal logic matrices and constraint satisfaction problem (CSP) solving.

## 🎮 Gameplay

You discover fragments of text alongside murals, graves, and broken mechanisms. Instead of auto-translating with "skill points," you must use **inductive reasoning, pattern analysis, and contextual hypothesis testing** to decipher the ancient script.

### Core Mechanics

- **Logic Matrix**: Assign hypothesized meanings to glyph symbols
- **CSP Engine**: A constraint satisfaction solver validates your deductions in real-time
- **Contextual Clues**: Fragment descriptions provide observational, eliminative, and grammatical hints
- **Notebook Validation**: Submit complete translations only when all logical constraints are satisfied

### The Brain Loop

1. Find fragments with glyph inscriptions and contextual clues
2. Link specific symbols to hypothesized meanings based on context
3. Use conditional deduction to determine syntax structure (SOV, SVO, VSO)
4. Validate your complete logical set in the field notebook

## 🧠 CSP Engine

The game uses a proper **Constraint Satisfaction Problem** solver:

- Each glyph is a variable with meanings as domain values
- Elimination passes run on every assignment
- Arc consistency checks prevent logical paradoxes
- Procedurally generated puzzles for infinite replayability

## 🚀 Quick Start

1. Clone the repository
2. Open `index.html` in a modern browser
3. Start deciphering!

```bash
git clone https://github.com/yourusername/epigraphy-rosetta-deduction.git
cd epigraphy-rosetta-deduction
# Open index.html in your browser