# Keyword Density Calculator

A powerful SEO tool for analyzing keyword density in text content. Built as part of the What an AI toolkit.

## Features

### ✅ Core Functionality
- **Multi-word Analysis**: Calculate keyword density for 1-10 word combinations (n-grams)
- **JSON Text Extraction**: Automatically extract text content from JSON structures
- **Real-time Analysis**: Automatic analysis with debouncing for smooth UX
- **Smart Sorting**: Results sorted by frequency and density
- **Stop Words Filtering**: Automatically filters common stop words in single-word mode

### ✅ Interactive Features
- **Keyword Highlighting**: Click "Highlight" to visually mark keywords in your text
- **Red Text Highlighting**: Keywords displayed in red color with underline effect
- **Word Count Selector**: Easy switching between 1-10 word analysis
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### ✅ Data Display
- **Keyword**: The analyzed keyword or phrase
- **Count**: Number of occurrences
- **Total**: Total number of keywords analyzed
- **Density**: Percentage density (e.g., 2.50%)

## Usage

### 1. Access the Tool
Navigate to `keyword-density.html` or click the link in the main website footer.

### 2. Input Text
Paste your text directly into the textarea. You can also paste JSON data, and the tool will automatically extract text from:
- `title`, `description`, `text`, `content` fields
- Arrays and nested objects

### 3. Select Word Count
Choose how many words to analyze:
- **1 Word**: Individual keywords (filters stop words)
- **2-10 Words**: Phrase combinations (preserves all phrases)

### 4. Analyze
Click "Analyze" or wait 1 second after typing for automatic analysis.

### 5. Review Results
- View the top 100 keywords by density
- See overall stats (Total Words, Unique Keywords)
- Click "Highlight" to visually identify keywords in your text

### 6. Highlight Keywords
Click the "Highlight" button next to any keyword to highlight all occurrences in your input text. Click again to remove highlighting.

## Technical Details

### Stop Words Filtering
Common English and Chinese stop words are filtered in 1-word mode:
- English: the, a, is, are, was, were, in, on, at, to, for, etc.
- Chinese: 的, 了, 在, 是, 我, 有, 和, etc.

### N-gram Generation
The tool generates continuous word combinations:
- Text: "AI image generator is powerful"
- 2-word: ["AI image", "image generator", "generator is", "is powerful"]
- 3-word: ["AI image generator", "image generator is", "generator is powerful"]

### Performance
- Handles texts with thousands of words
- Debounced input for smooth typing experience
- Efficient regex-based highlighting
- Top 100 results limit for optimal rendering

## Files

- `keyword-density.html` - Main page structure
- `keyword-density.css` - Styling (responsive, matches brand)
- `keyword-density.js` - Core logic and algorithms

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## SEO Best Practices

Keyword density recommendations:
- **1-3%**: Optimal range for natural SEO
- **< 1%**: May not be enough for ranking
- **> 5%**: Risk of keyword stuffing penalty

Use this tool to:
1. Identify over/under-used keywords
2. Optimize content for target keywords
3. Analyze competitor content
4. Improve on-page SEO

## Example

**Input Text:**
```
AI image generator is a powerful tool. Many AI tools can generate images. The best AI image generator creates high quality images. Use AI generator for your creative projects.
```

**Results (2-word analysis):**
| Keyword | Count | Total | Density |
|---------|-------|-------|---------|
| ai image | 3 | 18 | 16.67% |
| image generator | 3 | 18 | 16.67% |
| generator creates | 1 | 18 | 5.56% |

## License

Part of the What an AI project.
