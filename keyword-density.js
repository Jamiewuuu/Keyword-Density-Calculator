// Keyword Density Calculator
class KeywordDensityCalculator {
    constructor() {
        this.currentWordCount = 1;
        this.highlightedKeywords = new Set();
        // 密度分母是否剔除虚词：false = 页面总词数（默认，行业标准口径），true = 仅实词
        this.excludeStopWordsFromTotal = false;
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

    // 停用词表：无意义虚词不进入分析结果（英文统一小写；中文含典型虚词单字和常用双字虚词）
    // 注意：中文按单字切分，单字虚词会导致包含它的中文词组被整条过滤，如需保留请自行删减此表
    static STOP_WORDS = new Set([
        // 英文冠词/介词/连词/代词/系动词/助动词等
        'a', 'an', 'the', 'and', 'or', 'but', 'nor', 'so', 'yet',
        'of', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
        'into', 'through', 'during', 'before', 'after', 'above', 'below',
        'to', 'from', 'up', 'down', 'out', 'off', 'over', 'under',
        'again', 'further', 'then', 'once', 'here', 'there',
        'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
        'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own',
        'same', 'than', 'too', 'very', 'just', 'now', 'also',
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
        'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
        'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
        'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
        'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
        'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
        'if', 'because', 'until', 'while', 'as',
        "it's", "don't", "isn't", "wasn't", "won't", "can't", "doesn't", "didn't",
        "aren't", "hasn't", "haven't", "couldn't", "shouldn't", "wouldn't",
        "that's", "what's", "there's", "i'm", "i've", "i'll", "you're", "we're", "they're", "let's",
        // 中文虚词单字
        '的', '了', '着', '过', '是', '在', '和', '与', '及', '或', '而', '被', '把',
        '吗', '呢', '吧', '啊', '呀', '哦', '嘛', '之', '其', '此', '也', '就', '都',
        '很', '太', '又', '再', '才', '还', '们', '个', '你', '我', '他', '她', '它', '咱',
        // 中文双字虚词
        '这个', '那个', '这些', '那些', '这样', '那样',
        '我们', '你们', '他们', '她们', '它们', '自己',
        '什么', '怎么', '怎样', '哪个', '哪些', '哪里', '为什么', '怎么样',
        '但是', '可是', '不过', '然而', '因为', '所以', '如果', '虽然', '既然',
        '无论', '不管', '只要', '只有', '除非', '而且', '并且', '或者', '还是',
        '以及', '甚至', '对于', '关于', '由于', '通过', '按照', '依照', '根据', '除了',
        '可以', '应该', '必须', '可能',
    ]);

    isStopWord(token) {
        return KeywordDensityCalculator.STOP_WORDS.has(token);
    }

    generateNGrams(tokens, n) {
        const ngrams = [];

        if (n === 1) {
            // 虚词不单独进入结果（如 the / 的 / 了）
            return tokens.filter(token => !this.isStopWord(token));
        }

        for (let i = 0; i <= tokens.length - n; i++) {
            const window = tokens.slice(i, i + n);
            // 词组中任意位置含虚词则整条跳过：
            // 保证结果都是原文中真实连续出现的纯实词组合，而不是删掉虚词后拼出的假词组
            if (window.some(token => this.isStopWord(token))) continue;
            ngrams.push(this.joinNgramTokens(window));
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
            const hasResults = this.analyze(text);
            // 只有真正产出了结果才附加短文本提醒，避免覆盖"无结果"的错误提示
            if (hasResults) {
                this.addShortTextWarning(tokens.length);
            }
            return;
        }

        this.analyze(text);
    }

    analyze(text) {
        // Get ALL tokens for analysis (no filtering for 1-word mode as per requirement)
        const allTokens = this.toTokens(text);

        // Use all tokens for analysis (including stop words for 1-word mode)
        const tokensForAnalysis = allTokens;

        // 密度分母：默认为页面总词数（含虚词）；开关打开时只统计实词
        // Total 列、Total Words 统计、密度分母三者始终用同一个数，保证口径一致
        const totalWords = this.excludeStopWordsFromTotal
            ? allTokens.filter(token => !this.isStopWord(token)).length
            : allTokens.length;

        // Generate n-grams from analysis tokens
        const ngrams = this.generateNGrams(tokensForAnalysis, this.currentWordCount);

        if (ngrams.length === 0) {
            // 过滤虚词后可能一条结果都不剩（如整段输入全是 the/of/的/了）
            this.showNoResults('No results: all words were filtered out as stop words, or the text is too short for this mode.');
            return false;
        }

        const { frequency } = this.calculateFrequency(ngrams);

        // Convert to array and sort by count (descending)
        const results = Object.entries(frequency)
            .map(([keyword, count]) => ({
                keyword,
                count,
                total: totalWords, // Use actual word count instead of ngram count
                // 密度 = 关键词完整出现次数 ÷ 页面总词数 × 100，分母与 Total 列保持一致
                density: parseFloat(this.calculateDensity(count, totalWords))
            }))
            .sort((a, b) => b.count - a.count || b.density - a.density);

        this.displayResults(results);
        // Use original token count (allTokens) for Total Words, so it's consistent across modes
        this.updateStats(totalWords, results.length);
        return true;
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
                <td class="keyword-cell">${this.escapeHtml(result.keyword)}</td>
                <td class="count-cell">${result.count}</td>
                <td class="total-cell">${result.total}</td>
                <td class="density-cell">${result.density}%</td>
                <td class="text-center">
                    <button class="row-highlight-btn${this.highlightedKeywords.has(result.keyword) ? ' is-active' : ''}"
                            data-keyword="${this.escapeHtml(result.keyword)}"
                            onclick="calculator.toggleHighlight('${this.escapeHtmlAttribute(result.keyword)}')">
                        <i class="fas ${this.highlightedKeywords.has(result.keyword) ? 'fa-eye-slash' : 'fa-highlighter'}"></i>
                        ${this.highlightedKeywords.has(result.keyword) ? 'Unhighlight' : 'Highlight'}
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
            <div class="warning-box">
                <p>⚠️ Short text detected: Only ${wordCount} words found.</p>
                <p class="warning-sub">For more meaningful SEO analysis, consider using longer text (50+ words).</p>
            </div>
        `;
        noResults.classList.remove('hidden');
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
                    <div class="empty-icon warning">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <h4 class="nr-title mb-1">No Text Entered</h4>
                    <p class="nr-sub">Please paste or type your text above before analyzing</p>
                `;
            } else if (message !== null) {
                // Custom error message
                noResults.innerHTML = `<div class="error-box">${message}</div>`;
            } else {
                // If message is null, restore default HTML (Ready for Analysis)
                noResults.innerHTML = `
                    <div class="empty-icon">
                        <i class="fas fa-chart-pie text-xl"></i>
                    </div>
                    <h4 class="nr-title mb-1">Ready for Analysis</h4>
                    <p class="nr-sub">Enter your text above and click "Analyze Now"</p>
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

    // 分母虚词开关：切换后用当前文本重新分析
    const excludeStopwordsToggle = document.getElementById('exclude-stopwords');
    if (excludeStopwordsToggle) {
        excludeStopwordsToggle.addEventListener('change', () => {
            calculator.excludeStopWordsFromTotal = excludeStopwordsToggle.checked;
            const text = calculator.getTextInputValue().trim();
            if (text) {
                calculator.handleAnalyze();
            }
        });
    }

    // Show initial "Ready for Analysis" state
    calculator.showNoResults();
});
