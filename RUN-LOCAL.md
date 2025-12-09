# Running What an AI Tools Locally

This guide will help you run the What an AI website and Keyword Density Calculator on your local machine.

## 🚀 Quick Start (30 seconds)

### Mac & Linux

**Method 1 - Double-click (Easiest):**
1. Open terminal in this folder
2. Run: `./server.sh`

Or manually:
```bash
python3 server.py
# or if that doesn't work:
python server.py
```

### Windows

**Method 1 - Double-click (Easiest):**
- Double-click `server.bat`

**Method 2 - Command Prompt:**
```cmd
python server.py
# or if that doesn't work:
py server.py
```

The server will automatically open in your default browser at: **http://localhost:8080**

---

## 📋 Requirements

### Option 1: Python (Recommended)

**Check if Python is installed:**
```bash
python --version
# or
python3 --version
```

**Install Python if needed:**

**macOS:**
```bash
# Install Homebrew if you don't have it:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3
```

**Windows:**
1. Download from: https://python.org/downloads/windows/
2. Run installer
3. **Important:** Check "Add Python to PATH" during installation

### Option 2: Node.js (Alternative)

**Check if Node.js is installed:**
```bash
node --version
```

**Install Node.js if needed:**

Download from: https://nodejs.org/

---

## 🌐 Using the Tools

Once the server is running:

### Main Website
- URL: http://localhost:8080/
- Features:
  - AI image generator landing page
  - Responsive design
  - Marketing content from data.json

### Keyword Density Calculator
- URL: http://localhost:8080/keyword-density.html
- Features:
  - Keyword Density Analysis (1-10 word combinations)
  - Highlight keywords in text (red color highlighting)
  - Extract text from JSON
  - SEO optimization insights

---

## 📁 Alternative: Direct File Access

If you can't use a local server, some tools work directly from the file system:

### Keyword Density Calculator - Works Directly!

The keyword density calculator doesn't require a server! Simply:

1. Open `keyword-density.html` directly in your browser
2. Paste your text or JSON
3. Start analyzing!

**Supported Browsers:**
- Chrome/Edge (recommended)
- Firefox
- Safari

### Main Website - Limited Functionality

If you open `index.html` directly:
- ⚠️ Will show warning with instructions
- ✅ Keyword Density Tool link will still work
- ❌ Content from data.json won't load (CORS restrictions)

---

## 🔧 Advanced Options

### Custom Port

Use a different port if 8080 is already in use:

```bash
# Python
python server.py 3000

# Node.js
node server.js 3000

# With scripts
./server.sh 3000
server.bat 3000
```

### Stopping the Server

Press **Ctrl+C** in the terminal where the server is running.

### Viewing Server Logs

The server logs all requests to the console:

```
2024-01-01 12:00:00 GET / - 200
2024-01-01 12:00:01 GET /styles.css - 200
2024-01-01 12:00:01 GET /main.js - 200
```

---

## 🐛 Troubleshooting

### Issue: "Port 8080 is already in use"

**Solution:** Use a different port
```bash
python server.py 3000
```

### Issue: "Python is not recognized"

**Solution:** Python is not installed or not in PATH.

1. Install Python from https://python.org/
2. Check "Add Python to PATH" during installation
3. Restart your terminal/command prompt

### Issue: "Access denied" or "Permission denied"

**Solution (Mac/Linux):**
```bash
chmod +x server.sh
./server.sh
```

### Issue: "No module named 'http.server'"

**Solution:** Your Python installation is incomplete. Reinstall Python.

### Issue: "Security warning" when opening files directly

**Solution:** This is normal for local files. Click "Allow" or "Keep" in your browser.

### Issue: "File not found" errors

**Solution:** Make sure you're running the command from the correct folder:
```bash
cd /path/to/whatanai
python server.py
```

---

## 💡 Tips

### For Keyword Density Calculator Users

1. **No server needed** - Works directly from file system
2. **Paste JSON** - Tool automatically extracts text from JSON structures
3. **Highlight keywords** - Click "Highlight" to visually find keywords (red color)
4. **Switch word counts** - Use 1-10 word tabs to analyze different phrase lengths

### For Developers

1. **Auto-reload** - The server automatically serves updated files
2. **Edit data.json** - Modify website content by editing the JSON file
3. **Browser dev tools** - Use F12 tools to debug JavaScript
4. **Cache cleared** - Server sends no-cache headers for development

---

## 📱 Mobile Testing

Both tools are fully responsive! Test on mobile:

1. Find your computer's IP address:
   - Mac/Linux: `ifconfig` or `ip addr`
   - Windows: `ipconfig`

2. Use that IP with the port:
   ```
   http://192.168.1.100:8080/
   ```

3. Open on your phone/tablet browser

---

## 🎯 Recommended Workflow

### For Quick Keyword Analysis:
1. Double-click `keyword-density.html`
2. Paste your content
3. Analyze instantly!

### For Full Website:
1. Run `./server.sh` (Mac/Linux) or `server.bat` (Windows)
2. Let browser auto-open
3. Access all tools from the footer link

### For Development:
1. Run local server
2. Open browser to http://localhost:8080
3. Edit files in your code editor
4. Refresh browser to see changes

---

## 📄 Files Overview

```
/Users/wuyujie/workspace/whatanai/.conductor/guangzhou/
├── index.html                 # Main website
├── keyword-density.html       # SEO tool (works without server!)
├── data.json                  # Website content
├── styles.css                 # Main stylesheet
├── keyword-density.css        # Tool stylesheet
├── main.js                    # Main JavaScript
├── keyword-density.js         # Tool JavaScript
├── server.py                  # Python server (recommended)
├── server.js                  # Node.js server (alternative)
├── server.sh                  # Mac/Linux launcher
└── server.bat                 # Windows launcher
```

---

## ❓ FAQ

**Q: Why do I need a server? Can't I just open the files?**

A: Browsers block certain features (like loading JSON) when opening local files directly. A simple server bypasses these restrictions.

**Q: Which server should I use?**

A: Python is recommended if you have it installed (most Mac/Linux systems do). The launcher scripts will automatically choose the best option.

**Q: Does the keyword density calculator work offline?**

A: Yes! It works completely offline with or without a server.

**Q: Is my data being sent anywhere?**

A: No! Everything runs locally on your machine. No data leaves your computer.

**Q: Can I use this for production?**

A: These are development tools. For production, deploy to a proper web server (Apache, Nginx, Vercel, Netlify, etc.)

---

## 📚 More Information

- See [README-KEYWORD-DENSITY.md](README-KEYWORD-DENSITY.md) for keyword density tool details
- See [README.md](README.md) for general project information
- Check browser console (F12) for debugging information

---

**Happy analyzing! 🎉**
