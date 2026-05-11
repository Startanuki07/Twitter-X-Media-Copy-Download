# ✨ Copy, Preview, and Download Tweet Media Without Leaving Your Feed


<details open>
  <summary><small style="color: #666;">Hide image</small></summary>
  <img src="https://greasyfork.s3.us-east-2.amazonaws.com/luyc9kq3bjayzn41qyeo8d94u8ap" alt="Image">
</details>

**Adds two buttons to every tweet's action bar — one for media, one for the tweet link — each with click, long-press, and right-click behaviours.**

---

> 💡 **Overview**
> After installation, a 🎞️ **Media Button** and a 🔗 **Link Button** appear on every tweet. The media button lets you copy image and video URLs, preview them inline, or download them with structured filenames. A floating **Download History Panel** tracks every file you have saved, with group-based organisation, search, and export. A lightweight settings panel, accessible by hovering the top-right corner of the page, centralises all configuration without requiring the userscript manager menu.

---

## 🎛 Toolbar Controls

After installation, two buttons are appended to the right side of every tweet's action row, alongside the native reply, retweet, and like buttons. A history tracker and settings panel are accessible from the top-right corner of any page.

| Icon | Feature Name | Where It Appears |
|---|---|---|
| 🎞️ | Media Button | Tweet action bar — rightmost position |
| 🔗 | Link Button | Tweet action bar — second from right |
| 📋 | History Panel | Top-right corner of the page (appears after first download) |
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

**Click** — Copy the tweet URL. By default this uses `x.com`. You can configure a custom domain (such as `fixupx.com` or `vxtwitter.com`) for single-click output via the settings panel. Clicking the same settings row again toggles back to `x.com`.

**Click and hold (0.5 s)** — Copy the tweet URL using the configured domain, with your configured prefix prepended in Markdown link format.

Available domains for both behaviours:

- `vxtwitter.com`
- `fixupx.com`
- `fxtwitter.com`
- `cunnyx.com`
- `fixvx.com`
- `twitter.com`
- `x.com`

---

### ⬇️ Download History Panel

Keeps a complete record of every file you’ve downloaded with no history limit.

* **Open** — Access it from the 📋 button in the top-right corner or through the History section in the Settings Panel.
* **Views** — Switch between a compact list view and a thumbnail grid. Clicking a thumbnail opens a full-size zoom overlay with multi-image navigation.
* **Search** — Instantly filter records by display name, screen name, or tweet text using the search bar.
* **Favorites** — Mark records with ♡ to protect them from bulk deletion. Favorited items are always preserved.
* **Undo** — Deleted something by mistake? A temporary undo option appears immediately after deletion.
* **Export / Import** — Export your entire history as CSV or JSON, or import a previously exported JSON file to merge records automatically without duplicates.
* **Badge** — After a tweet is downloaded, the ⭐️ button on that tweet gains a small green indicator so you can quickly identify tweets already saved in your history.

When a download finishes, a brief animation flies from the 🎞️ button to the ☄️ button to confirm the record was successfully added to history.

---

### ⭐ Groups

<details open>
  <summary><small style="color: #666;">Hide image</small></summary>
  <img src="https://greasyfork.s3.us-east-2.amazonaws.com/llgd5i0iizs5pp0bzp2rwuc7tvyd" alt="Image">
</details>

Organise downloaded media into named groups — useful for sorting by project, topic, or date range.

- **Enabling** — Turn on **Group on Download** in the Settings Panel (⭐ Groups section). After each download completes, a ⭐ button briefly appears near the 🎞️ button.
- **Assigning** — Click ⭐ to open a fan-style group picker. Select a group to tag the download record. If no groups exist yet, the picker prompts you to create one.
- **Filtering in History** — Groups appear as tabs at the top of the History Panel. Click a tab to show only records from that group. An **Ungrouped** tab shows all records not yet assigned to any group.
- **Managing** — Open the group manager from the Settings Panel. You can create, rename, choose an icon from a built-in library, set a glow colour, adjust label colour, reorder groups by dragging, and delete groups.

### 💡 Finding the Auto-Hide Toggle

There is a hidden "Auto-Hide" toggle.

- **Visibility** — This button is **invisible by default** to keep the interface clean. It only reveals itself when you **hover your mouse cursor** over the specific area.
- **Location** — Move your mouse to the **middle of the left or right vertical edge** of the panel.
- **Visual Cue** — Once hovered, a small icon consisting of **three vertical dots (⋮)** will appear. 
- **Function** — Click this icon to toggle the auto-hide behavior, allowing the panel to collapse when not in use.

---

## 🌐 Third-Party Services & Dependencies

This script generates URLs using the following domains when configured as the link target. The script itself does not contact these services — it only constructs URLs that you copy to your clipboard.

| Domain | Type | Notes |
|---|---|---|
| `vxtwitter.com` | Third-party embed converter | Enables richer Twitter embeds in other platforms |
| `fixupx.com` | Third-party embed converter | Alternative embed fixer |
| `fxtwitter.com` | Third-party embed converter | Alternative embed fixer |
| `cunnyx.com` | Third-party embed converter | Alternative embed fixer |
| `fixvx.com` | Third-party embed converter | Alternative embed fixer |
| `twitter.com` / `x.com` | Official | Native tweet URLs |

> ⚠️ The third-party domains listed above have no affiliation with this script. Review their terms and privacy policies before using them.

> 💡 **Media download** contacts Twitter's own content delivery network to fetch files you have already viewed on the timeline — no credentials are sent to any service outside of Twitter/X.

---

## ⚠️ Known Limitations

### Known Constraints

- **History capacity** — The History Panel has no fixed record limit. All download records are retained indefinitely, stored locally via the userscript manager's storage. Performance remains smooth for typical use; extremely large histories (thousands of records) may slightly increase load time when opening the panel.
- **Media download fallback** — When the primary download channel is blocked by the browser's security policy, the script automatically retries using an alternative method. Most downloads still complete; a partial-success warning (e.g. `⚠️ 2/3`) appears if any file fails under both methods.
- **Embedded "From @user" videos on the timeline** — Tweets that display another account's video under an attribution label cannot always be extracted when viewed in the feed. An API-based fallback resolves this in many cases, but it remains unreliable in the timeline view. Opening the individual tweet page resolves this consistently.

### Known Conflicts

| Situation | Impact | Recommended Action |
|---|---|---|
| Strict Content Security Policy on some pages | Media download may fall back to the secondary method | Navigate directly to `twitter.com` or `x.com` rather than embedded views |


---

## 🌍 Cross-Domain Compatibility

The script is designed primarily for `twitter.com` and `x.com`. However, the **Download History Panel** is available on any domain — making it possible to review and manage your download records without navigating back to Twitter.

All Twitter-specific features (media button injection, fetch interception, DOM scanning) are automatically disabled on other domains. Only the lightweight history panel loads, with negligible resource usage.

### Enabling on Other Domains

By default, userscript managers only run a script on the domains listed in its `@match` rules. To access the History Panel on other sites, you must manually add those domains in your manager's script settings.

**Tampermonkey**

1. Open the Tampermonkey dashboard and click the script name.
2. Go to the **Settings** tab.
3. Under **User matches**, add the domain you want, e.g. `https://discord.com/*`.
4. Save. The History Panel will appear on that site after the next page load.

**Violentmonkey**

1. Open the Violentmonkey dashboard and click the **Edit** icon for this script.
2. Switch to the **Settings** tab.
3. Under **Custom `@match`**, add the target domain, e.g. `https://discord.com/*`.
4. Save and reload the page.

**Greasemonkey**

1. On the target page, open the Greasemonkey menu and choose **Manage User Scripts**.
2. Click the script name to open its settings.
3. Add a new **Included page** entry with the domain pattern, e.g. `https://discord.com/*`.
4. Reload the page.

> 💡 The script will never inject Twitter-specific UI (media buttons, star pip, fetch hooks) on non-Twitter domains — only the History Panel sidebar loads, keeping the impact on other sites minimal.

> ⚠️ Some sites with strict Content Security Policies (e.g. certain internal tools or hardened web apps) may block userscript injection entirely. In that case no part of this script will run, regardless of the match rules configured.

---
## 

## ⚙️ Additional Features

### Settings Panel

Hover the **top-right corner** of any twitter.com or x.com page to reveal the ⚙️ button. Click it to open the panel. Changes take effect immediately without a page reload, except for language changes (which require a reload to apply).

**🔗 Link section**
- **Single-click domain** — Set the domain used when clicking 🔗. Click the same row again to toggle back to `x.com`.
- **Prefix** — Set the text prepended to media and link URLs during long-press gestures. Defaults to `[text]`.

**🎞 Media section**
- **Date format** — Toggle between Asian (`YYYY.MM.DD`) and Western (`DD.MM.YYYY`) formats used in downloaded filenames.
- **Feedback style** — Choose how the script signals completion: **Toast** (brief popup message) or **Icon Only** (button icon changes briefly).
- **Language** — Switch between nine built-in languages, or load a fully custom translation.

**⭐ Groups section**
- **Group on Download** — Master toggle. When enabled, a ⭐ button appears after each download to let you assign it to a group.
- **Glow colour** — Set a highlight colour for the group fan menu using a colour picker or preset swatches. A **Multi** toggle uses each group's individual colour instead.
- **Glow size** — Adjust the radius of the glow effect behind group icons in the fan menu.
- **Label colour** — Set the text colour used for group labels in the fan menu.
- **Manage Groups** — Open the full group manager to create, rename, reorder, and delete groups.

**🗂 History Panel section**
- **Open History** — Launch the History Panel directly from settings.
- **Dock style** — Choose the visual style of the docked edge tab: **Ruler** (subtle glowing bar), **Ghost** (faint line), or **Notch** (corner slot).
- **Hover delay** — Adjust how long (in milliseconds) you must hover over the docked tab before the panel expands.
- **Trigger distance** — Set how close (in pixels) to the screen edge the mouse must be to activate the dock hover zone, independently for left and right sides.

All settings are also accessible from the userscript manager's menu (e.g., Tampermonkey, Violentmonkey).

---

### History Panel — Dock & Hide

The History Panel can be docked to either the left or right edge of the screen, collapsing into a thin tab when not in use.

- Drag the panel to either side until it snaps into dock mode.
- Once docked, hover over the tab to expand the panel after the configured delay.
- Long-press the docked tab for 2 seconds to force-undock and return the panel to free-floating mode.
- The dock position is automatically restored the next time you visit twitter.com or x.com.

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

### First-Run Guide

On the first launch after installation, a brief spotlight overlay highlights the Settings Panel entry point and explains the primary controls. The guide appears only once after installation.

---

## 🔐 Security & Privacy Notice

> ⚠️ **This script reads session data from your active Twitter / X session to enable a fallback method — used only when the standard approach cannot retrieve video URLs from the timeline.**

| Data Type | Source | Purpose | Storage | Transmitted To |
|---|---|---|---|---|
| Anti-forgery token | Read from your browser's active Twitter / X session | Verify that requests originate from your own session when retrieving embedded video URLs | Never stored by the script | Twitter / X only |
| Session identifier | Read from your browser's active Twitter / X session | Identify your session when the standard video extraction method fails | Never stored by the script | Twitter / X only |
| Download history | Generated by the script on each download | Show past downloads in the History Panel | Saved locally on your device via the userscript manager | Not transmitted |
| Groups configuration | Created by you in the Settings Panel | Organise history records into named groups | Saved locally on your device via the userscript manager | Not transmitted |

**This script does not collect, share, or transmit your credentials to any server outside of Twitter / X.**

> 💡 **Cookie access only occurs when the standard video extraction method fails** — it is an automatic internal fallback, not an opt-in feature. No passwords, direct message content, or account credentials are read or stored at any point.
> Reviewing the source code before installation is always recommended.

---

- This userscript is primarily maintained on Greasy Fork.
- Built with AI assistance by a hobbyist developer. Bug fixes and updates may not be immediate.
- Feedback is welcome. Responses may be assisted by translation tools if needed.