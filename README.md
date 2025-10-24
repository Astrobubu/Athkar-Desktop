# 🌙 أذكار المسلم - Athkar Desktop

<div dir="rtl" align="center">

**برنامج سطح مكتب جميل وبسيط لأذكار الصباح والمساء**

[![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/yourusername/athkar-desktop/releases)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

<div align="center">

A beautiful and elegant desktop widget for **Islamic morning and evening Athkar** (remembrances). Stay connected with your daily spiritual practices through a clean, unobtrusive interface that sits on your desktop.

[Download Latest Release](../../releases/latest) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 **Interface**
- ✅ Clean Arabic RTL interface
- ✅ Modern minimalist design
- ✅ Always-on-top widget
- ✅ Draggable window
- ✅ Compact & unobtrusive

</td>
<td width="50%">

### 🌓 **Themes**
- ✅ Light mode (default)
- ✅ Dark mode support
- ✅ Smooth theme transitions
- ✅ Persistent preferences
- ✅ Eye-friendly colors

</td>
</tr>
<tr>
<td width="50%">

### 📿 **Athkar Content**
- ✅ آية الكرسي (Ayat al-Kursi)
- ✅ سورة الإخلاص، الفلق، الناس
- ✅ Morning supplications (صباح)
- ✅ Evening supplications (مساء)
- ✅ Authentic hadiths & benefits

</td>
<td width="50%">

### ⚙️ **Functionality**
- ✅ System tray integration
- ✅ Progress tracking
- ✅ Audio feedback (optional)
- ✅ Customizable font sizes
- ✅ Remembers position

</td>
</tr>
</table>

---

## 📥 Installation

### 💻 **Windows Installer**

1. **Download** the latest installer from [Releases](../../releases/latest)
2. **Run** `أذكار المسلم Setup 1.0.0.exe`
3. **Follow** the installation wizard
4. **Launch** from desktop shortcut or start menu

> 📌 **Note:** No administrator rights required • User installation • ~73 MB download

### 🛠️ **Build from Source**

```bash
# Clone the repository
git clone https://github.com/yourusername/athkar-desktop.git
cd athkar-desktop

# Install dependencies
npm install

# Run in development
npm start

# Build Windows installer
npm run dist
```

**Requirements:** Node.js 16+ • npm 7+ • Windows 10/11

---

## 🎯 Usage Guide

### **Main Window**

| Button | Function |
|--------|----------|
| **صباح** | Switch to morning Athkar |
| **مساء** | Switch to evening Athkar |
| **تسبيح** | Count current dhikr |
| **← →** | Navigate between Athkar |
| **⚙️** | Open settings |
| **✕** | Hide to system tray |

### **System Tray Menu**

Right-click the tray icon for quick actions:
- **إظهار** - Show window
- **إخفاء** - Hide window  
- **الإعدادات** - Open settings
- **خروج** - Quit application

💡 **Tip:** Double-click tray icon to quickly toggle window visibility

### **Settings Panel**

- **حجم الخط** - Adjust Arabic text size (14-28px)
- **تفعيل الصوت** - Enable/disable click sounds
- **الوضع الداكن** - Toggle dark/light theme
- **إعادة التعيين** - Reset all progress data

---

## 📖 Athkar Content

All content is sourced from **authentic Islamic texts**:

### Morning Athkar (أذكار الصباح)
24 supplications including:
- Ayat al-Kursi with benefits
- The three protective Suras (3× each)
- Major morning du'as from Sunnah
- Tasbih variations (10×, 100×)
- Istighfar and Salawat

### Evening Athkar (أذكار المساء)
24 supplications including:
- Ayat al-Kursi with benefits
- The three protective Suras (3× each)
- Major evening du'as from Sunnah
- Tasbih variations (10×, 100×)
- Special evening protection du'as

---

## 🏗️ Technical Stack

**Built with modern web technologies:**

- **Framework:** Electron 28.x
- **Languages:** JavaScript (ES6+), HTML5, CSS3
- **Typography:** Amiri Arabic Font
- **Icons:** Feather Icons
- **Build Tool:** electron-builder
- **Installer:** NSIS (Windows)

### **Project Structure**

```
athkar-desktop/
├── 📄 main.js                  # Electron main process + tray
├── 📄 renderer.js              # Main window logic
├── 📄 settings-renderer.js     # Settings window logic
├── 📄 index.html               # Main UI
├── 📄 settings.html            # Settings UI
├── 🎨 styles.css               # Main styles
├── 🎨 settings-styles.css      # Settings styles
├── 📚 athkar-data.json         # All Athkar content
├── ⚙️ user-settings.json       # Auto-generated preferences
└── 📁 assets/
    └── icon.png                # Application icon
```

---

## 🤝 Contributing

Contributions are **warmly welcomed**! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🎉 **Open** a Pull Request

### **Areas for Contribution**
- 🌍 Additional language support
- 📱 macOS/Linux versions
- 🎨 UI/UX improvements
- 📖 More authentic Athkar content
- 🐛 Bug fixes

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**You are free to:**
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Use privately
- ✅ Sublicense

---

## 🙏 Credits & Acknowledgments

- **Feather Icons** - Beautiful UI icons
- **Google Fonts** - Amiri Arabic typography
- **Islamic Content** - Authentic sources from Sunnah
- **Electron Community** - Amazing framework and tools

---

## 📞 Support

<div dir="rtl">

### للدعم والمساعدة

- 🐛 **عند وجود مشكلة:** [افتح Issue](../../issues/new)
- 💡 **لاقتراح ميزة:** [ميزة جديدة](../../issues/new)
- 📧 **للتواصل المباشر:** [البريد الإلكتروني](mailto:your@email.com)

جزاكم الله خيراً على دعمكم

</div>

**Found a bug?** [Report it here](../../issues/new)  
**Have a suggestion?** [Share your idea](../../issues/new)  
**Need help?** [Check existing issues](../../issues)

---

<div align="center">

**May Allah accept this work and make it beneficial for all Muslims** 🤲

⭐ **If this project helps you, consider giving it a star!** ⭐

Made with ❤️ for the Muslim Ummah

</div>
