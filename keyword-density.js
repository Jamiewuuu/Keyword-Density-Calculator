// Keyword Density Calculator
class KeywordDensityCalculator {
    constructor() {
        this.currentWordCount = 1;
        this.highlightedKeywords = new Set();
        this.initializeEventListeners();
        this.renderHighlightedTags();
    }

    initializeEventListeners() {
        // Analyze button
        document.getElementById('analyze-btn').addEventListener('click', () => {
            this.handleAnalyze();
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearAll();
        });

        // Text input change (auto-analyze with debounce)
        let debounceTimer;
        document.getElementById('text-input').addEventListener('input', () => {
            const text = this.getTextInputValue().trim();
            if (text) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.handleAnalyze();
                }, 1000);
            }
        });

        // Handle paste to only keep plain text
        document.getElementById('text-input').addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }

    getTextInputValue() {
        const contentEditable = document.getElementById('text-input');
        // Get plain text, ignoring any HTML tags
        return contentEditable.innerText || contentEditable.textContent || '';
    }

    cleanText(text) {
        // Remove extra whitespace and newlines but preserve content
        text = text.replace(/\s+/g, ' ').trim();

        if (!text) return '';

        // Convert to lowercase
        text = text.toLowerCase();

        // Remove special characters but keep alphanumeric, spaces, apostrophes, and Chinese
        // Note: Hyphens are removed (replaced with space) to split compound words
        text = text.replace(/[^\w\s\u4e00-\u9fa5']/g, ' ');

        // Replace remaining hyphens and dashes with space
        text = text.replace(/[-\u2013\u2014]+/g, ' ');

        // Remove extra spaces again
        text = text.replace(/\s+/g, ' ').trim();

        return text;
    }

    getWordCount(text) {
        // Simply count words by splitting on whitespace (similar to wc -w)
        // This includes JSON keys, values, and all content without filtering
        return text.trim().split(/\s+/).filter(token => token.length > 0).length;
    }

    getCleanWordCount(text) {
        // Count words after cleaning (to match Total Words in results)
        // This ensures consistency between input stats and analysis results
        return this.toTokens(text).length;
    }

    toTokens(text) {
        // 统一分词入口：清洗 → 中文按单字切分 → 按空白拆分
        const cleaned = this.cleanText(text);
        if (!cleaned) return [];

        // 中文没有空格分隔，必须按单字切开，n-gram 才能统计出完整的中文词组
        // （如「关键词密度」= 连续 5 个字）；英文单词、数字串保持完整不拆
        const segmented = cleaned.replace(/([\u4e00-\u9fa5])/g, ' $1 ');

        return segmented.split(/\s+/).filter(token => token.length > 0);
    }

    tokenize(text) {
        return this.toTokens(text);
    }

    joinNgramTokens(tokens) {
        // 拼接 n-gram：相邻都是中文时不加空格（还原成连续词组，方便展示和高亮匹配），
        // 其余情况（英文、数字、中英相邻）用空格分隔
        const isCJK = (ch) => /[\u4e00-\u9fa5]/.test(ch);
        return tokens.reduce((acc, token) => {
            if (!acc) return token;
            const separator = isCJK(acc[acc.length - 1]) && isCJK(token[0]) ? '' : ' ';
            return acc + separator + token;
        }, '');
    }

    generateNGrams(tokens, n) {
        const ngrams = [];

        if (n === 1) {
            return tokens;
        }

        for (let i = 0; i <= tokens.length - n; i++) {
            ngrams.push(this.joinNgramTokens(tokens.slice(i, i + n)));
        }

        return ngrams;
    }

    calculateFrequency(ngrams) {
        const frequency = {};
        const total = ngrams.length;

        ngrams.forEach(ngram => {
            frequency[ngram] = (frequency[ngram] || 0) + 1;
        });

        return { frequency, total };
    }

    calculateDensity(count, totalWords) {
        if (totalWords === 0) return 0;
        return ((count / totalWords) * 100).toFixed(2);
    }

    getAllNGrams(tokens) {
        const allNGrams = {};

        for (let n = 1; n <= 5; n++) {
            allNGrams[n] = this.generateNGrams(tokens, n);
        }

        return allNGrams;
    }

    handleAnalyze() {
        const text = this.getTextInputValue().trim();

        if (!text) {
            this.showNoResults('no_input'); // 特殊标记表示用户主动点击但无输入
            return;
        }

        // Tokenize the text
        const tokens = this.tokenize(text);

        // Check if we have any tokens
        if (tokens.length === 0) {
            this.showNoResults('No valid words found. Please check your input text.');
            return;
        }

        // For short texts (less than 10 words), show a warning but continue
        if (tokens.length < 5) {
            this.analyze(text);
            this.addShortTextWarning(tokens.length);
            return;
        }

        this.analyze(text);
    }

    analyze(text) {
        // Get ALL tokens for analysis (no filtering for 1-word mode as per requirement)
        const allTokens = this.toTokens(text);

        // Use all tokens for analysis (including stop words for 1-word mode)
        const tokensForAnalysis = allTokens;

        // Generate n-grams from analysis tokens
        const ngrams = this.generateNGrams(tokensForAnalysis, this.currentWordCount);

        if (ngrams.length === 0) {
            this.showNoResults('Not enough words for this analysis.');
            return;
        }

        const { frequency } = this.calculateFrequency(ngrams);

        // Convert to array and sort by count (descending)
        const results = Object.entries(frequency)
            .map(([keyword, count]) => ({
                keyword,
                count,
                total: allTokens.length, // Use actual word count instead of ngram count
                // 密度 = 关键词完整出现次数 ÷ 页面总词数 × 100，分母与 Total 列保持一致
                density: parseFloat(this.calculateDensity(count, allTokens.length))
            }))
            .sort((a, b) => b.count - a.count || b.density - a.density);

        this.displayResults(results);
        // Use original token count (allTokens) for Total Words, so it's consistent across modes
        this.updateStats(allTokens.length, results.length);
    }

    displayResults(results) {
        const tbody = document.getElementById('results-tbody');
        const resultsContainer = document.getElementById('results-container');
        const noResults = document.getElementById('no-results');

        // Clear existing results
        tbody.innerHTML = '';

        // Limit to top 100 results
        const displayResults = results.slice(0, 100);

        displayResults.forEach(result => {
            const row = document.createElement('tr');
            row.className = 'table-row-hover';

            row.innerHTML = `
                <td class="keyword-cell font-mono text-gray-900">${this.escapeHtml(result.keyword)}</td>
                <td class="count-cell text-center font-medium text-gray-900">${result.count}</td>
                <td class="total-cell text-center text-gray-600">${result.total}</td>
                <td class="density-cell text-center font-medium" style="color: var(--primary-color);">${result.density}%</td>
                <td class="text-center">
                    <button class="px-2 py-1 text-xs rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors ${this.highlightedKeywords.has(result.keyword) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'text-gray-600'}"
                            data-keyword="${this.escapeHtml(result.keyword)}"
                            onclick="calculator.toggleHighlight('${this.escapeHtmlAttribute(result.keyword)}')">
                        ${this.highlightedKeywords.has(result.keyword) ? '<i class="fas fa-eye-slash mr-1"></i>Unhighlight' : '<i class="fas fa-highlighter mr-1"></i>Highlight'}
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    updateStats(totalWords, uniqueKeywords) {
        document.getElementById('total-words').textContent = totalWords.toLocaleString();
        document.getElementById('unique-keywords').textContent = uniqueKeywords.toLocaleString();
    }

    showNoResults(message = null) {
        // Note: This method is overridden in DOMContentLoaded to properly manage loading state
        // The base implementation here just updates stats display

        if (message) {
            const noResults = document.getElementById('no-results');
            if (noResults) {
                noResults.innerHTML = `<p>${message}</p>`;
            }
        }

        document.getElementById('total-words').textContent = '0';
        document.getElementById('unique-keywords').textContent = '0';
    }

    addShortTextWarning(wordCount) {
        const noResults = document.getElementById('no-results');
        noResults.innerHTML = `
            <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                <p style="color: #856404; margin-bottom: 10px;">
                    <strong>⚠️ Short text detected:</strong> Only ${wordCount} words found.
                </p>
                <p style="color: #856404; font-size: 0.9rem;">
                    For more meaningful SEO analysis, consider using longer text (50+ words).
                </p>
            </div>
        `;
    }

    renderHighlightedTags() {
        const container = document.getElementById('highlighted-tags');
        const tagsContainer = document.getElementById('tags-container');
        const countElement = document.getElementById('highlighted-count');

        if (this.highlightedKeywords.size === 0) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');

        // Update count display
        countElement.textContent = `${this.highlightedKeywords.size} keyword${this.highlightedKeywords.size > 1 ? 's' : ''}`;

        // Display in order of addition (Set preserves insertion order)
        const keywords = Array.from(this.highlightedKeywords);
        tagsContainer.innerHTML = keywords.map(keyword => `
            <span class="keyword-tag">
                ${this.escapeHtml(keyword)}
                <i class="fas fa-times remove-tag" data-keyword="${this.escapeHtmlAttribute(keyword)}" title="Remove highlight"></i>
            </span>
        `).join('');

        // Bind remove events to each tag's X button
        tagsContainer.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const keyword = e.target.dataset.keyword;
                this.toggleHighlight(keyword);
            });
        });
    }

    toggleHighlight(keyword) {
        if (this.highlightedKeywords.has(keyword)) {
            this.highlightedKeywords.delete(keyword);
        } else {
            this.highlightedKeywords.add(keyword);
        }

        this.applyKeywordHighlight();
        this.renderHighlightedTags();
        this.handleAnalyze(); // Re-render to update button states
    }

    applyKeywordHighlight() {
        const contentEditable = document.getElementById('text-input');
        const text = this.getTextInputValue();

        if (!text || this.highlightedKeywords.size === 0) {
            // Remove all highlights
            this.removeAllHighlights(contentEditable);
            return;
        }

        // Get current selection to restore later
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        let cursorOffset = 0;
        if (range && contentEditable.contains(range.commonAncestorContainer)) {
            cursorOffset = this.getCursorOffset(contentEditable, range);
        }

        // Remove existing highlights first
        this.removeAllHighlights(contentEditable);

        // Create regex for all highlighted keywords (escape special characters)
        const keywords = Array.from(this.highlightedKeywords);
        const sortedKeywords = keywords.sort((a, b) => b.length - a.length); // Longest first

        // Escape keywords for regex
        const escapedKeywords = sortedKeywords.map(keyword => {
            return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        });

        // Build regex with word boundaries for multi-word
        let regex;
        if (this.currentWordCount === 1) {
            // For single words, use word boundaries
            regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
        } else {
            // For phrases, match directly
            regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
        }

        // Apply highlights by wrapping matches in spans
        this.applyHighlightToElement(contentEditable, regex);

        // Restore cursor position
        if (cursorOffset !== null) {
            this.setCursorPosition(contentEditable, Math.min(cursorOffset, text.length));
        }
    }

    removeAllHighlights(container) {
        // Remove all highlight spans but keep text content
        const highlights = container.querySelectorAll('.highlight-red');
        highlights.forEach(span => {
            const parent = span.parentNode;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        });

        // Normalize text nodes
        container.normalize();
    }

    applyHighlightToElement(element, regex) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const matches = [];
            let match;

            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0]
                });
            }

            if (matches.length > 0) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                matches.forEach(m => {
                    // Add text before match
                    if (m.start > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex, m.start)));
                    }

                    // Add highlighted match
                    const span = document.createElement('span');
                    span.className = 'highlight-red';
                    span.textContent = m.text;
                    fragment.appendChild(span);

                    lastIndex = m.end;
                });

                // Add remaining text
                if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                }

                // Replace text node with fragment
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    getCursorOffset(container, range) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let offset = 0;
        let node;
        while (node = walker.nextNode()) {
            if (node === range.startContainer) {
                return offset + range.startOffset;
            }
            offset += node.textContent.length;
        }
        return offset;
    }

    setCursorPosition(container, offset) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let currentOffset = 0;
        let node;
        while (node = walker.nextNode()) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
                const range = document.createRange();
                range.setStart(node, offset - currentOffset);
                range.collapse(true);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                return true;
            }
            currentOffset += nodeLength;
        }
        return false;
    }

    clearAll() {
        const contentEditable = document.getElementById('text-input');
        const wordCountEl = document.getElementById('input-word-count');
        const charCountEl = document.getElementById('input-char-count');

        contentEditable.innerHTML = '';
        this.highlightedKeywords.clear();
        this.renderHighlightedTags();
        this.showNoResults();

        // Reset input stats
        if (wordCountEl) wordCountEl.textContent = '0';
        if (charCountEl) charCountEl.textContent = '0';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeHtmlAttribute(text) {
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
}

// Initialize calculator when DOM is loaded
let calculator;
document.addEventListener('DOMContentLoaded', function() {
    calculator = new KeywordDensityCalculator();

    // Update input stats on text change
    const textInput = document.getElementById('text-input');
    const wordCountEl = document.getElementById('input-word-count');
    const charCountEl = document.getElementById('input-char-count');

    if (textInput && wordCountEl && charCountEl) {
        const updateStats = () => {
            const text = calculator.getTextInputValue();
            // Use getCleanWordCount() to ensure consistency with Total Words in analysis results
            // This matches the logic used in analyze() method
            const wordCount = text.trim() ? calculator.getCleanWordCount(text) : 0;
            const cleanText = text.replace(/\s/g, ''); // Remove all whitespace for char count
            wordCountEl.textContent = wordCount;
            charCountEl.textContent = cleanText.length;
        };

        textInput.addEventListener('input', updateStats);
        updateStats();
    }

    // Add loading state management
    const originalHandleAnalyze = calculator.handleAnalyze.bind(calculator);
    calculator.handleAnalyze = function() {
        const loadingState = document.getElementById('loading-state');
        const resultsContainer = document.getElementById('results-container');
        const noResults = document.getElementById('no-results');

        if (loadingState) loadingState.classList.remove('hidden');
        if (resultsContainer) resultsContainer.classList.add('hidden');
        if (noResults) noResults.classList.add('hidden');

        setTimeout(() => {
            originalHandleAnalyze();
            if (loadingState) loadingState.classList.add('hidden');
        }, 100);
    };

    // Override displayResults to show container
    const originalDisplayResults = calculator.displayResults.bind(calculator);
    calculator.displayResults = function(results) {
        originalDisplayResults(results);
        const resultsContainer = document.getElementById('results-container');
        const noResults = document.getElementById('no-results');

        if (resultsContainer && results.length > 0) {
            resultsContainer.classList.remove('hidden');
        }
        if (noResults) noResults.classList.add('hidden');
    };

    // Override showNoResults
    const originalShowNoResults = calculator.showNoResults.bind(calculator);
    calculator.showNoResults = function(message = null) {
        originalShowNoResults(message);
        const loadingState = document.getElementById('loading-state');
        const resultsContainer = document.getElementById('results-container');
        const noResults = document.getElementById('no-results');

        // Hide loading and results, show no-results
        if (loadingState) loadingState.classList.add('hidden');
        if (resultsContainer) resultsContainer.classList.add('hidden');

        if (noResults) {
            // Handle no input case with specific message
            if (message === 'no_input') {
                noResults.innerHTML = `
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: rgba(245, 158, 11, 0.1);">
                        <i class="fas fa-file-alt text-xl" style="color: var(--warning);"></i>
                    </div>
                    <h4 class="text-gray-600 font-medium mb-1">No Text Entered</h4>
                    <p class="text-gray-500 text-sm">Please paste or type your text above before analyzing</p>
                `;
            } else if (message !== null) {
                // Custom error message
                noResults.innerHTML = `<div style="background: #fee; border: 1px solid #fcc; padding: 10px; border-radius: 4px; color: #c00;">${message}</div>`;
            } else {
                // If message is null, restore default HTML (Ready for Analysis)
                noResults.innerHTML = `
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: rgba(84, 66, 222, 0.1);">
                        <i class="fas fa-chart-pie text-xl" style="color: var(--primary-color);"></i>
                    </div>
                    <h4 class="text-gray-600 font-medium mb-1">Ready for Analysis</h4>
                    <p class="text-gray-500 text-sm">Enter your text above and click "Analyze Now"</p>
                `;
            }
            noResults.classList.remove('hidden');
        }
    };

    // Auto-analyze when word count tab changes (moved to Results section)
    const wordCountTabs = document.querySelectorAll('.word-count-tab');
    wordCountTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.word-count-tab').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');

            // Update current word count
            const newCount = parseInt(e.target.dataset.count);
            calculator.currentWordCount = newCount;

            // Auto-analyze if there's text
            const text = calculator.getTextInputValue().trim();
            if (text) {
                calculator.handleAnalyze();
            }
        });
    });

    // Show initial "Ready for Analysis" state
    calculator.showNoResults();
});
