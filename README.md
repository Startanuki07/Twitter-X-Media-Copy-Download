# ✨ Copy, Preview, and Download Tweet Media Without Leaving Your Feed

<details open>
  <summary><small style="color: #666;">Hide image</small></summary>
  <img src="https://greasyfork.s3.us-east-2.amazonaws.com/luyc9kq3bjayzn41qyeo8d94u8ap" alt="Image">
</details>

**Adds two buttons to every tweet's action bar — one for media (images and videos), one for the tweet link — each with click, long-press, and right-click behaviours.**

---

> 💡 **Overview**
> After installation, a 🎞️ **Media Button** and a 🔗 **Link Button** appear on every tweet. The media button lets you copy image and video URLs, preview them inline, or download them with structured filenames. The link button copies the tweet URL in either its native form or a third-party embed-friendly format. A lightweight settings panel, accessible by hovering the top-right corner of the page, centralises all configuration without requiring the userscript manager menu.

## 🎛 Toolbar Controls

After installation, two buttons are appended to the right side of every tweet's action row, alongside the native reply, retweet, and like buttons.

| Icon | Feature Name | Where It Appears |
|---|---|---|
| 🎞️ | Media Button | Tweet action bar — rightmost position |
| 🔗 | Link Button | Tweet action bar — second from right |
| ⚙️ | Settings Panel | Top-right corner of the page (hover to reveal) |

---

## 🚀 Core Features

### 🎞️ Media Button

Handles image and video URLs attached to any tweet.

**Left-click** — Copy all media URLs to the clipboard as plain text, one per line.

**Left-click and hold (0.5 s)** — Copy media URLs with your configured prefix prepended in Markdown link format.

```
/* Output format when prefix is set:
   [prefix](https://pbs.twimg.com/.../photo.jpg)
   [prefix](https://video.twimg.com/.../video.mp4) */
```

**Middle-click** — Open an inline preview:
- Videos open in a **floating player** with volume memory, keyboard navigation (← → ↑ ↓), and an Escape key shortcut to close.
- Images open in a **card-style lightbox** with a fan layout, dot pagination, and click-to-focus navigation between multiple photos.

**Right-click** — Download all media files directly to your device. A circular progress indicator appears on the button during the download. Files are saved with the following structured filename:

```
/* [twitter] DisplayName(@screenname)_YYYY.MM.DD_tweettext_tweetID_1.jpg
   Example: [twitter] Jane(@janedoe)_2026.04.09_Hello world_1234567890_1.jpg */
```

If one or more files fail to download, the button displays a warning with a partial success count (e.g., `⚠️ 2/3`).

---

### 🔗 Link Button

Handles the tweet URL, with configurable domain output.

**Click** — Copy the tweet URL. By default this uses `x.com`. You can optionally configure a custom domain (such as `fixupx.com` or `vxtwitter.com`) for single-click output via the settings panel.

**Click and hold (0.5 s)** — Copy the tweet URL using the **Long-Press Domain**, with your configured prefix prepended in Markdown link format. The long-press domain is configured separately from the single-click domain.

Available domains for both behaviours:

- `vxtwitter.com`
- `fixupx.com`
- `fxtwitter.com`
- `cunnyx.com`
- `fixvx.com`
- `twitter.com`
- `x.com`

> ⚠️ The domains listed above (excluding `twitter.com` and `x.com`) are independent third-party services with no affiliation to this script. Evaluate them before use.

---

## 🧪 Known Limitations

Videos embedded via the **"From @user"** attribution format — where the tweet card links to a `/i/status/` URL rather than a standard user status path — cannot be extracted when viewed on the timeline. Opening the individual tweet page resolves this; extraction works correctly in that context.

This is a structural limitation of how Twitter delivers that category of embedded content in the timeline feed, and is not expected to be addressed in the near term.

---

## ⚙️ Additional Features

### Settings Panel

Hover the **top-right corner** of any twitter.com or x.com page to reveal the ⚙️ settings button. Click it to open the panel. Changes take effect immediately without a page reload, except for language changes (which require a reload to apply).

The panel exposes the following options:

- **Single-click domain** — Set the domain used when clicking 🔗. Toggle back to `x.com` by clicking the same row again.
- **Prefix** — Set the text prepended to media and link URLs when using the long-press gesture. Defaults to `[text]`.
- **Date format** — Toggle between Asian (`YYYY.MM.DD`) and Western (`DD.MM.YYYY`) formats used in downloaded filenames.
- **Language** — Switch the script UI among nine built-in languages.
- **Help** — Opens the built-in usage reference.

All settings are also accessible from the userscript manager's menu (e.g., Tampermonkey, Violentmonkey).

---

### 🌐 Language Support

Nine languages are built in: **English, 繁體中文, 简体中文, 日本語, 한국어, Español, Português (BR), Français, Русский**.

A **Custom Language** option is available via the Language panel:

1. Click **Export Template** to download a pre-filled JSON file with all UI strings in English.
2. Translate the values in the file. Keys, placeholders such as `{lang}`, HTML tags, and emoji must be left unchanged.
3. Click **Import Translation** and select the edited file.
4. Reload the page to apply.

A loaded custom language can be cleared at any time from the same panel, reverting the UI to English.

> Due to increasing maintenance costs, official translations are currently maintained up to Russian. Additional languages may be added based on user demand.

---

- This userscript is primarily maintained on Greasy Fork.
- Built with AI assistance by a hobbyist developer. Bug fixes and updates may not be immediate.
- Feedback is welcome. Responses may be assisted by translation tools if needed.