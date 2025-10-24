# 🚀 GitHub Repository Setup Guide

Follow these steps to create a GitHub repository and publish your first release.

---

## 📋 Prerequisites

- GitHub account
- Git installed locally (already done ✓)
- Repository initialized (already done ✓)
- Installer built (already done ✓)

---

## 🔧 Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"+"** → **"New repository"**
3. Fill in details:
   - **Repository name:** `athkar-desktop`
   - **Description:** `🌙 أذكار المسلم - Beautiful Islamic Athkar Desktop Widget for Windows`
   - **Visibility:** Public
   - **DO NOT** initialize with README (we already have one)
4. Click **"Create repository"**

---

## 🌐 Step 2: Link Local Repo to GitHub

```bash
# Navigate to project folder
cd "D:\Apps\AthkarDesktop"

# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/athkar-desktop.git

# Verify remote was added
git remote -v
```

---

## 📤 Step 3: Push to GitHub

```bash
# Push main branch
git push -u origin master

# Push tags
git push --tags
```

Enter your GitHub credentials when prompted.

---

## 🎉 Step 4: Create GitHub Release

### Option A: Using GitHub CLI (Recommended)

```bash
# Check if gh is installed
gh --version

# Create release with installer
gh release create v1.0.0 \
  "dist/أذكار المسلم Setup 1.0.0.exe" \
  --title "Release v1.0.0 - أذكار المسلم Desktop" \
  --notes-file RELEASE_NOTES.md
```

### Option B: Using GitHub Web Interface

1. Go to your repository on GitHub
2. Click **"Releases"** → **"Create a new release"**
3. Fill in:
   - **Tag:** `v1.0.0` (should be auto-detected)
   - **Release title:** `Release v1.0.0 - أذكار المسلم Desktop`
   - **Description:** Copy content from `RELEASE_NOTES.md`
4. **Attach files:**
   - Drag and drop: `dist/أذكار المسلم Setup 1.0.0.exe`
5. Click **"Publish release"**

---

## ✅ Step 5: Verify Release

Check that your release appears at:
```
https://github.com/YOUR_USERNAME/athkar-desktop/releases
```

Users can now download the installer!

---

## 📝 Step 6: Update README Links

The README currently has placeholder links. Update these:

1. Edit `README.md`
2. Replace `yourusername` with your GitHub username:
   - `https://github.com/yourusername/athkar-desktop/releases`
   - Badge links
3. Commit and push:
   ```bash
   git add README.md
   git commit -m "Update README with actual GitHub links"
   git push
   ```

---

## 🎨 Optional: Add Topics to Repository

On your GitHub repository page:
1. Click **"About"** ⚙️ (gear icon)
2. Add topics:
   - `islam`
   - `athkar`
   - `desktop-app`
   - `electron`
   - `windows`
   - `arabic`
   - `muslim`
   - `dhikr`
   - `prayer`
3. Click **"Save changes"**

---

## 📢 Optional: Enable Discussions & Issues

1. Go to **Settings** → **General**
2. Under **Features**:
   - ✅ Enable **Issues**
   - ✅ Enable **Discussions** (optional)
3. Save changes

---

## 🔐 Optional: Add Topics & Description

```bash
# Using GitHub CLI
gh repo edit --description "🌙 أذكار المسلم - Beautiful Islamic Athkar Desktop Widget for Windows" \
  --homepage "https://github.com/YOUR_USERNAME/athkar-desktop"

gh repo edit --add-topic islam,athkar,electron,windows,arabic,muslim,desktop-app
```

---

## 📊 Repository Structure Check

Your repo should now have:
- ✅ Source code
- ✅ README.md with badges
- ✅ LICENSE (MIT)
- ✅ CHANGELOG.md
- ✅ .gitignore
- ✅ Release v1.0.0 with installer
- ✅ Git tag v1.0.0

---

## 🎯 What Users See

When someone visits your repo:

1. **README** - Beautiful formatted documentation
2. **Releases** - Download link for installer
3. **Code** - Full source code
4. **License** - MIT open source
5. **Topics** - Discoverable tags

---

## 🚀 Promote Your Release

Share on:
- Reddit: r/islam, r/opensource
- Twitter/X with hashtags: #Islam #Athkar #OpenSource
- Islamic forums
- Muslim developer communities
- LinkedIn

---

## 🔄 Future Updates

When you make changes:

```bash
# Make your changes
git add .
git commit -m "Description of changes"

# Update version in package.json
# Build new installer
npm run dist

# Create new tag
git tag -a v1.1.0 -m "Release v1.1.0 - New features"

# Push
git push
git push --tags

# Create new release on GitHub
gh release create v1.1.0 \
  "dist/أذكار المسلم Setup 1.1.0.exe" \
  --title "Release v1.1.0" \
  --notes "What's new in this version"
```

---

## 📞 Need Help?

- **GitHub Docs:** https://docs.github.com
- **gh CLI Docs:** https://cli.github.com/manual/
- **Git Docs:** https://git-scm.com/doc

---

<div align="center">

**May Allah accept this work** 🤲

**Your app is now open source and available to the world!**

</div>
