# Keyword Density Calculator - UI States

This document defines the state management logic for the Keyword Density Calculator UI.

## UI States Matrix

### 1. Initial State (Page Load)

**Trigger**: DOMContentLoaded event

**Display**:
- 📊 Icon: Pie chart (`fa-chart-pie`)
- 🎨 Style: Primary purple background (`rgba(84, 66, 222, 0.1)`)
- 📝 Title: "Ready for Analysis"
- 🔔 Message: "Enter your text above and click 'Analyze Now'"
- 📊 Stats: Total Words = 0, Unique = 0
- 📥 Input Stats: 0 words, 0 chars

**Code**:
```javascript
calculator.showNoResults(); // No parameters = null
```

---

### 2. Clear Button Clicked

**Trigger**: User clicks Clear button or Ctrl+A+Delete

**Behavior**:
1. Clear input box innerHTML
2. Clear highlighted keywords Set
3. Remove all keyword highlights from DOM
4. Reset input stats (0 words, 0 chars)
5. Reset analysis stats (0 total, 0 unique)
6. Show initial state UI

**Display**:
- 📊 Icon: Pie chart
- 🎨 Style: Primary purple background
- 📝 Title: "Ready for Analysis"
- 🔔 Message: "Enter your text above and click 'Analyze Now'"
- 📊 Stats: Total Words = 0, Unique = 0
- 📥 Input Stats: 0 words, 0 chars

**Code**:
```javascript
clearAll() {
    contentEditable.innerHTML = '';
    this.highlightedKeywords.clear();
    this.renderHighlightedTags();
    this.showNoResults(); // No parameters = null

    // Reset input stats
    if (wordCountEl) wordCountEl.textContent = '0';
    if (charCountEl) charCountEl.textContent = '0';
}
```

---

### 3. Empty Input + Analyze Button Clicked

**Trigger**: User clicks "Analyze Now" button with empty input

**Display**:
- 📁 Icon: File/Folder (`fa-file-alt`)
- 🎨 Style: Warning orange background (`rgba(245, 158, 11, 0.1)`)
- 📝 Title: "No Text Entered"
- 🔔 Message: "Please paste or type your text above before analyzing"
- 📊 Stats: Total Words = 0, Unique = 0
- 📥 Input Stats: 0 words, 0 chars
- ⚠️ No loading spinner (instant feedback)

**Code**:
```javascript
handleAnalyze() {
    const text = this.getTextInputValue().trim();

    if (!text) {
        this.showNoResults('no_input'); // Special marker
        return;
    }
    // ... continue with analysis
}

showNoResults(message = null) {
    if (message === 'no_input') {
        // Show No Text Entered UI
        noResults.innerHTML = `
            <div style="background: rgba(245, 158, 11, 0.1);">
                <i class="fas fa-file-alt" style="color: var(--warning);"></i>
            </div>
            <h4>No Text Entered</h4>
            <p>Please paste or type your text above before analyzing</p>
        `;
    }
}
```

---

### 4. Short Text Warning

**Trigger**: Auto-analyze detects text with < 5 words

**Display**:
- ⚠️ Icon: Warning triangle
- 🎨 Style: Warning yellow background (`#fff3cd` border, `#ffc107`)
- 📝 Title: "Short text detected"
- 🔔 Message: "Only X words found. For more meaningful SEO analysis, consider using longer text (50+ words)."
- 📊 Stats: Shows actual analysis results
- ⚠️ Warning appears above results (doesn't block analysis)

**Code**:
```javascript
if (tokens.length < 5) {
    this.analyze(text);
    this.addShortTextWarning(tokens.length);
    return;
}

addShortTextWarning(wordCount) {
    noResults.innerHTML = `
        <div style="background: #fff3cd; border: 2px solid #ffc107;">
            <p><strong>⚠️ Short text detected:</strong> Only ${wordCount} words found.</p>
            <p>For more meaningful SEO analysis, consider using longer text (50+ words).</p>
        </div>
    `;
}
```

---

### 5. Success State (With Results)

**Trigger**: Analysis completes successfully

**Display**:
- 📊 Results table with top 100 keywords
- 📈 Stats: Actual Total Words, Actual Unique Keywords count
- 🎨 Keyword highlighting buttons (if any keywords highlighted)
- 📊 Density percentages in purple
- 📋 Column headers: Keyword | Count | Total | Density | Action

**Code**:
```javascript
// Hide no-results and loading
noResults.classList.add('hidden');
loadingState.classList.add('hidden');

// Show results container
resultsContainer.classList.remove('hidden');

// Populate results table
results.forEach(result => {
    // Add row to tbody with actual data
});

// Update stats
document.getElementById('total-words').textContent = totalWords;
document.getElementById('unique-keywords').textContent = uniqueKeywords;
```

---

### 6. Loading State (During Analysis)

**Trigger**: Analysis starts (button click or auto-analyze)

**Display**:
- ⏳ Spinner animation
- 📝 Text: "Analyzing your text..."
- 📊 Stats updated in background
- 🥷 Results container and no-results container hidden

**Code**:
```javascript
if (loadingState) loadingState.classList.remove('hidden');
if (resultsContainer) resultsContainer.classList.add('hidden');
if (noResults) noResults.classList.add('hidden');

setTimeout(() => {
    originalHandleAnalyze();
    if (loadingState) loadingState.classList.add('hidden');
}, 100);
```

---

## State Transition Diagram

```
┌─────────────────────────────────────────────────┐
│     Initial State (Page Load)                  │
│    📊 Ready for Analysis                       │
└────────────────┬────────────────────────────────┘
                 │
                 │ User pastes text
                 ↓
         ┌──────────────────┐
         │  Loading State   │◄─────────────────┐
         │   ⏳ Analyzing   │                  │
         └──┬───────────────┘                  │
            │                                  │
            │ Analysis complete                │
            ↓                                  │
    ┌──────────────────┐                      │
    │  Success State   │                      │
    │   📊 Results     │                      │
    │   with Keywords  │                      │
    └────┬─────────────┘                      │
         │                                  │
         │ User clicks Clear                │
         │ or Ctrl+A+Delete                 │
         ↓                                  │
┌──────────────────────────────────────────┐ │
│   Clear Button Clicked                   │ │
│   📊 Ready for Analysis                  │ │
└────────────┬─────────────────────────────┘ │
             │                              │
             │ User clicks Analyze          │
             │ (empty input)                │
             ↓                              │
    ┌──────────────────┐                   │
    │ ⚠️ No Text       │                   │
    │    Entered       │───────────────────┘
    │   📁 Warning     │
    └──────────────────┘
             │
             │ User pastes text
             │ (< 5 words)
             ↓
    ┌──────────────────┐
    │ ⚠️ Short Text    │
    │   Warning +      │
    │   Results Shown  │
    └──────────────────┘
```

---

## Implementation Details

### Messages Parameter

The `showNoResults(message)` function accepts three types of parameters:

| Parameter | Type | Result |
|-----------|------|--------|
| `null` | No value | 📊 Ready for Analysis (default) |
| `'no_input'` | String marker | 📁 No Text Entered (error) |
| Custom string | Error message | ❌ Custom error message (red) |

### Base vs Override

**Base class method** (simplified):
```javascript
showNoResults(message = null) {
    if (message) {
        // Update message display
        noResults.innerHTML = `<p>${message}</p>`;
    }
    document.getElementById('total-words').textContent = '0';
    document.getElementById('unique-keywords').textContent = '0';
}
```

**DOM override method** (enhances base):
```javascript
calculator.showNoResults = function(message = null) {
    // Call base first (resets stats)
    originalShowNoResults(message);

    // Then handle UI state
    const loadingState = document.getElementById('loading-state');
    const resultsContainer = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');

    // Hide loading and results
    if (loadingState) loadingState.classList.add('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');

    // Show appropriate no-results UI
    if (noResults) {
        if (message === 'no_input') {
            // 📁 No Text Entered UI
        } else if (message !== null) {
            // ❌ Custom error UI
        }
        // Else message is null → 📊 Ready for Analysis UI
        noResults.classList.remove('hidden');
    }
};
```

---

## Stateful Elements

### Element IDs and Roles

| Element ID | Role | States |
|------------|------|--------|
| `text-input` | Contenteditable div | Holds user text, triggers input event |
| `input-word-count` | Input stats | Updates on input (0 when empty) |
| `input-char-count` | Input stats | Updates on input (0 when empty, removes whitespace) |
| `total-words` | Analysis stats | Updates after analysis (0 when no results) |
| `unique-keywords` | Analysis stats | Updates after analysis (0 when no results) |
| `loading-state` | Loading UI | `hidden` when not loading |
| `results-container` | Results table | `hidden` when no analysis/results |
| `no-results` | No results UI | Shows different content based on message parameter |
| `results-tbody` | Results rows | Populated with analysis results |

---

## Edge Cases and Behavior

### 1. Fast Typing + Immediate Clear

**Scenario**: User types then immediately hits Clear

**Behavior**:
- Debounced analysis may not fire (if < 1s)
- Clear immediately shows 📊 Ready for Analysis
- Input stats reset to 0/0
- Any loading states cancelled

### 2. Highlight Then Clear

**Scenario**: User highlights keywords then clears

**Behavior**:
- Highlighted keywords Set cleared
- DOM highlights removed
- Tags UI hidden
- Shows 📊 Ready for Analysis

### 3. Word Count Tab Change After Clear

**Scenario**: Clear text, then change 1-10 word tab

**Behavior**:
- Word count changes internally (`currentWordCount`)
- UI updates active tab styling
- **No analysis triggered** (text is empty)
- Still shows 📊 Ready for Analysis

### 4. Rapid Analyze Button Clicks

**Scenario**: User rapidly clicks Analyze button (empty input)

**Behavior**:
- First click: Shows 📁 No Text Entered
- Subsequent clicks: May flash loading spinner briefly (100ms), then back to 📁 No Text Entered
- Stats remain at 0

### 5. Paste JSON Then Clear

**Scenario**: User pastes JSON (e.g., `{}` or `{"text": "hello"}`), then clears

**Behavior**:
- On paste: Attempts auto-analysis if valid text extracted
- On clear: 📊 Ready for Analysis
- JSON parsing errors don't crash (try-catch not needed, text extracted as-is)

---

## Testing Checklist

Use this checklist to verify all states work correctly:

- [ ] Fresh page load shows 📊 Ready for Analysis
- [ ] Initial stats: 0 words, 0 chars, Total=0, Unique=0
- [ ] Type text → input stats update in real-time
- [ ] Type text + wait 1s → auto-analysis triggers
- [ ] Click Analyze with empty input → 📁 No Text Entered
- [ ] Click Analyze with <5 words → ⚠️ Short text warning + results
- [ ] Click Analyze with normal text → 📊 Results display
- [ ] Click Clear → 📊 Ready for Analysis (all reset)
- [ ] Highlight keywords → Tags appear
- [ ] Clear after highlighting → Highlights removed, tags hidden
- [ ] Change word count tab → Tab active state updates
- [ ] During analysis → ⏳ Loading spinner shows
- [ ] Results table → Scrolls horizontally if many columns
- [ ] Mobile view → All elements visible and functional
- [ ] Paste JSON → Text extracted and analyzed
- [ ] Rapid clicks → No crashes, state remains consistent
- [ ] Clear then click Analyze → 📁 No Text Entered (not 📊 Ready)

---

## Constants and Magic Numbers

| Constant | Value | Used For |
|----------|-------|----------|
| Debounce delay | 1000ms | Auto-analysis after typing stops |
| Short text threshold | 5 words | Show warning under this length |
| Results limit | 100 rows | Max keywords to display in table |
| Loading minimum | 100ms | Show loading spinner at least this long |
| Word count range | 1-10 | Supported n-gram lengths |
