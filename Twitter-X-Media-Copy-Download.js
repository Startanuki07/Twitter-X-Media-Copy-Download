// ==UserScript==
// @name         Twitter / X — Media Copy & Download
// @name:zh-TW   Twitter / X — 媒體複製與下載
// @name:zh-CN   Twitter / X — 媒体复制与下载
// @name:ja      Twitter / X — メディアコピー & ダウンロード
// @name:ko      Twitter / X — 미디어 복사 & 다운로드
// @name:es      Twitter / X — Copiar y Descargar Medios
// @name:pt-BR   Twitter / X — Copiar e Baixar Mídia
// @name:fr      Twitter / X — Copier & Télécharger les Médias
// @name:ru      Twitter / X — Копирование и загрузка медиа
// @namespace    https://greasyfork.org/en/users/1575945-star-tanuki07
// @version      2.7.2.10
// @homepageURL  https://github.com/Startanuki07
// @license      MIT
// @author       Star_tanuki07
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      twitter.com
// @connect      x.com
// @connect      twimg.com
// @run-at       document-idle
// @description      One-click media copy & download on every tweet, with download history.
// @description:zh-TW 在每則推文一鍵複製連結與下載媒體，附下載紀錄。
// @description:zh-CN 在每条推文一键复制链接与下载媒体，附下载记录。
// @description:ja    ツイートごとにURLコピーとメディアダウンロードをワンクリックで。ダウンロード履歴付き。
// @description:ko    모든 트윗에서 원클릭으로 URL 복사 및 미디어 다운로드. 다운로드 기록 포함.
// @description:es    Copia enlaces y descarga medios en un clic por tweet, con historial de descargas.
// @description:pt-BR Copie links e baixe mídias com um clique em cada tweet, com histórico de downloads.
// @description:fr    Copiez des liens et téléchargez des médias en un clic par tweet, avec historique.
// @description:ru    Копирование ссылок и скачивание медиа в один клик на каждом твите. С историей загрузок.
// ==/UserScript==

(function () {
    'use strict';

    const _escHtml = s => String(s)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#39;');

    const KEY_PREFIX_TEXT = 'discord_prefix_text';
    const KEY_LANG = 'app_language';
    const KEY_LINK_DOMAIN_CLICK = 'app_link_domain_click';
    const KEY_CLICK_MODE_CUSTOM = 'app_link_click_mode_custom';
    const KEY_DATE_FORMAT = 'app_date_format';
    const KEY_CUSTOM_LANG = 'app_custom_lang_json';
    const KEY_VIDEO_VOLUME = 'app_video_volume';
    const KEY_ONBOARDING_DONE  = 'app_onboarding_done';
    const KEY_FEEDBACK_STYLE   = 'app_feedback_style';
    const KEY_SEEN_FEATURES    = 'app_seen_features';
    const KEY_SP_GROUP_OPEN    = 'app_sp_group_open';
    const KEY_GEAR_DOT_SEEN    = 'app_gear_dot_seen';
    const KEY_HISTORY_RECORDS   = 'app_history_records';
    const KEY_HISTORY_PANEL_POS = 'app_history_panel_pos';
    const KEY_HISTORY_VIEW_MODE = 'app_history_view_mode';
    const KEY_HIST_PINNED       = 'app_hist_pinned';
    const KEY_DOCK_STYLE        = 'app_dock_style';
    const KEY_DOCK_HOVER_DELAY  = 'app_dock_hover_delay';
    const KEY_DOCK_TRIGGER_L    = 'app_dock_trigger_l';
    const KEY_DOCK_TRIGGER_R    = 'app_dock_trigger_r';
    const KEY_DOCK_PERSISTED    = 'app_dock_persisted';
    const KEY_GROUP_ON_DOWNLOAD = 'app_group_on_download';
    const KEY_GROUPS            = 'app_media_groups';
    const KEY_GROUP_PANEL_CFG   = 'app_group_panel_cfg';
    const KEY_GEAR_VISIBLE      = 'app_gear_visible';
    const KEY_GEAR_CORNER       = 'app_gear_corner';

    const NEW_FEATURE_IDS = [
        'feedback_style',
        'history_panel',
        'dock_style',
        'sp_feedback_picker',
        'sp_date_picker',
        'sp_dock_picker',
        'sp_trigger_dist',
        'sp_slider_controls',
        'sp_dock_persist',
        'sp_group_on_dl',
        'sp_group_glow_color',
        'sp_group_glow_size',
        'sp_group_text_color',
        'sp_corner_position',
        'sp_feedback_pulse',
        'sp_feedback_flash',
        'sp_feedback_slide',
    ];

    const DOMAIN_LIST = [
        "vxtwitter.com",
        "fixupx.com",
        "fxtwitter.com",
        "cunnyx.com",
        "fixvx.com",
        "twitter.com",
        "x.com"
    ];

    const TR = {
        'en': {
            langName: 'English',
            menu_domain_click: '🔗 Set "Single-Click" Behavior',
            menu_domain_long: '🔗 Set "Long-Press" Domain',
            menu_prefix: '⚙️ Set Custom Prefix (Discord)',
            menu_lang: '🌐 Change Language',
            menu_help: '📖 Help / Manual',
            prompt_prefix: 'Enter custom prefix (e.g., [text]):',
            prompt_lang: 'Select language (enter number):\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: 'Select domain (Enter Number):\n',
            status_default: 'Default (x.com)',
            status_custom: 'Custom',
            btn_tooltip: 'Left Click: Copy Media Links\nMiddle Click: Preview Video / Image Lightbox\nRight Click: Download Files',
            link_tooltip: 'Click: Copy ',
            link_tooltip_long: '\nLong Press: Copy prefix + ',
            msg_prefix_copied: 'Prefix Copied',
            msg_copied: 'Copied',
            msg_downloaded: 'Downloaded',
            msg_no_media: '❌ No Media',
            play_btn_tooltip: 'Click: Preview Video in Floating Player',
            btn_switch_to_video: 'Switch to Video',
            btn_switch_to_image: 'Switch to Image',
            msg_no_video: '❌ No Video',
            reload_msg: 'Settings Saved',
            toast_domain_click: '🔗 Single-Click Domain → ',
            toast_domain_long: '🔗 Long-Press Domain → ',
            toast_prefix: '⚙️ Discord Prefix → ',
            toast_date_fmt: '📅 Date Format → ',
            toast_lang_pending: '🌐 Language change will apply after reload.',
            confirm_lang_reload: 'Language changed to {lang}.\nReload page now to apply?',
            menu_date_format: '📅 Date Format',
            status_date_asian: 'Asian (YYYY.MM.DD)',
            status_date_western: 'Western (DD.MM.YYYY)',
            help_title: 'Twitter Media Copy Button - Manual',
            help_content: `
                <p><b>🖱️ Media Button (🎞️):</b><br>
                • <b>Left Click:</b> Copy media links (images / video URLs).<br>
                • <b>Long Press (0.5s):</b> Copy links with custom prefix (Markdown format, for Discord).<br>
                • <b>Middle Click:</b> Preview — floating video player or image lightbox.<br>
                • <b>Right Click:</b> Force download all media with structured filenames.<br>
                  (Format: <code>[twitter] Name(@ID)_Date_Text_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Link Button (🔗):</b><br>
                • <b>Click:</b> Copy tweet link (default: x.com, or custom click domain).<br>
                • <b>Long Press:</b> Copy with custom prefix + long-press embed domain (e.g. fixupx).</p>
                <hr>
                <p><b>📋 Download History:</b><br>
                • Right-click downloads are automatically logged.<br>
                • Downloaded tweets show a 🟢 badge on the 🎞️ button.<br>
                • Click 📋 (top-right) to browse history: list / thumbnail view, search, export CSV / JSON.</p>
                <hr>
                <p><b>⚙️ Settings Panel:</b><br>
                • Hover the top-right corner → 📋 history / ⚙️ gear button appears.<br>
                • Configure: click domain, long-press domain, Discord prefix, date format, language, feedback style.</p>
                <hr>
                <hr>
                <p><b>⭐ Groups &amp; ⊞ Gallery:</b><br>
                • <b>Groups:</b> In ⚙️ Settings → <b>⭐ Groups</b>, enable <b>Group on Download</b>. After each right-click download, a ⭐ button briefly appears at the screen edge — hover or click to assign the media to a group via a fan-style picker.<br>
                • <b>Gallery:</b> Inside the floating video player or image lightbox, click the <b>⊞ grid button</b> to open a side panel and browse all media found on the current page.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Disclaimer:</b><br>
                Embed domains (e.g. fixupx, vxtwitter) are third-party services unaffiliated with this script.</p>
            `,
            onboard_title: '⚙ Settings Panel',
            onboard_body:  'Hover the top-right corner to reveal the settings button. Click it to quickly manage domains, prefix, language and more — no script manager menu needed.',
            onboard_got_it: 'Got it!',
            onboard_step1_title: '📋 Twitter / X — Media Buttons',
            onboard_step1_body:  'This script adds a Copy button and a Download button directly to every tweet with photos or videos. Hover any media tweet to see them in the action bar.',
            onboard_next: 'Next →',
            menu_feedback_style:    '🔔 Feedback Style',
            status_feedback_toast:  'Toast',
            status_feedback_icon:   'Icon Only',
            status_feedback_silent: 'Silent',
            status_feedback_pulse:  'Pulse Ring',
            status_feedback_flash:  'Flash Sweep',
            status_feedback_slide:  'Slide Up',
            status_on:  'On',
            status_off: 'Off',
            toast_feedback_style:   '🔔 Feedback Style → ',
        },
        'zh-TW': {
            langName: '繁體中文',
            menu_domain_click: '🔗 設定「單擊」行為模式',
            menu_domain_long: '🔗 設定「長按」網址域名',
            menu_prefix: '⚙️ 設定 Discord 前綴文字',
            menu_lang: '🌐 切換語言 (Change Language)',
            menu_help: '📖 使用說明書',
            prompt_prefix: '請輸入自定義前綴（例如 [text]）：',
            prompt_lang: '請輸入數字選擇語言：\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: '請輸入數字選擇域名：\n',
            status_default: '預設 (x.com)',
            status_custom: '自定義',
            btn_tooltip: '左鍵：複製媒體連結\n中鍵：預覽影片 / 圖片燈箱\n右鍵：強制下載檔案',
            link_tooltip: '點擊：複製 ',
            link_tooltip_long: '\n長按：複製前綴 + ',
            msg_prefix_copied: '前綴已複製',
            msg_copied: '已複製',
            msg_downloaded: '已下載',
            msg_no_media: '❌ 無媒體',
            play_btn_tooltip: '點擊：在浮動播放器中預覽影片',
            btn_switch_to_video: '切換至影片',
            btn_switch_to_image: '切換至圖片',
            msg_no_video: '❌ 無影片',
            reload_msg: '設定已儲存',
            toast_domain_click: '🔗 單擊域名 → ',
            toast_domain_long: '🔗 長按域名 → ',
            toast_prefix: '⚙️ Discord 前綴 → ',
            toast_date_fmt: '📅 日期格式 → ',
            toast_lang_pending: '🌐 語言已變更，重新載入後生效。',
            confirm_lang_reload: '語言已切換為 {lang}。\n立即重新載入頁面以套用？',
            menu_date_format: '📅 日期格式',
            status_date_asian: '亞洲慣用 (YYYY.MM.DD)',
            status_date_western: '歐美慣用 (DD.MM.YYYY)',
            help_title: '推特媒體腳本 — 說明書',
            help_content: `
                <p><b>🖱️ 媒體按鈕 (🎞️)：</b><br>
                • <b>左鍵單擊：</b> 複製推文中所有圖片/影片連結。<br>
                • <b>長按 (0.5秒)：</b> 複製含自定義前綴的連結，例如 <code>[text](url)</code>（方便 Discord 嵌入）。<br>
                • <b>中鍵點擊：</b> 開啟浮動影片播放器或圖片燈箱。<br>
                • <b>右鍵點擊：</b> 下載全部媒體，自動生成結構化檔名。<br>
                  (格式：<code>[twitter] 暱稱(@ID)_日期_內文_ID.副檔名</code>)</p>
                <hr>
                <p><b>🔗 連結按鈕 (🔗)：</b><br>
                • <b>單擊：</b> 複製推文網址（x.com 或自定義單擊域名）。<br>
                • <b>長按：</b> 複製前綴 + 長按域名網址（如 fixupx.com）。</p>
                <hr>
                <p><b>📋 下載履歷：</b><br>
                • 右鍵下載後自動記錄。<br>
                • 滑鼠移至右上角 → 點擊 🕐 開啟履歷面板。<br>
                • 支援列表/縮圖切換、搜尋、Shift 區間選取、批次刪除、CSV/JSON 匯出。</p>
                <hr>
                <p><b>⚙️ 設定面板：</b><br>
                • 將滑鼠移至右上角，顯示齒輪 ⚙️ 與履歷 🕐 按鈕。<br>
                • 點擊 ⚙️ 可設定：單擊域名、長按域名、Discord 前綴、提示風格、日期格式、語言。</p>
                <hr>
                <hr>
                <p><b>⭐ 媒體分組 &amp; ⊞ 頁面相簿：</b><br>
                • <b>分組：</b>在 ⚙️ 設定 → <b>⭐ Groups</b> 中開啟 <b>Group on Download</b>。右鍵下載後，畫面邊角短暫出現 ⭐ 按鈕，hover 或點擊可用扇形選單將媒體歸入群組。<br>
                • <b>頁面相簿：</b>在浮動影片播放器或圖片燈箱中，點擊上方 <b>⊞ 田字鈕</b>，可在側欄瀏覽當前頁面上找到的所有媒體。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免責聲明：</b><br>
                fixupx / vxtwitter 等域名皆為第三方服務，與本腳本無關，請僅使用您信任的域名。</p>
            `,
            onboard_title: '⚙ 設定面板',
            onboard_body:  '將滑鼠移至右上角即可叫出設定按鈕，點擊後可快速管理域名、前綴、語言等設定，無需開啟腳本管理器選單。',
            onboard_got_it: '知道了！',
            onboard_step1_title: '📋 Twitter / X — 媒體按鈕',
            onboard_step1_body:  '本腳本會在所有含有圖片或影片的推文上直接注入「複製連結」與「下載」按鈕，滑鼠移到媒體推文的操作列即可看到它們。',
            onboard_next: '下一步 →',
            menu_feedback_style:    '🔔 提示風格',
            status_feedback_toast:  'Toast 提示',
            status_feedback_icon:   '僅圖示',
            status_feedback_silent: '靜默（僅圖示）',
            status_feedback_pulse:  '脈衝光環',
            status_feedback_flash:  '閃光掃描',
            status_feedback_slide:  '文字滑入',
            status_on:  '開啟',
            status_off: '關閉',
            toast_feedback_style:   '🔔 提示風格 → ',
        },
        'zh-CN': {
            langName: '简体中文',
            menu_domain_click: '🔗 设置“单击”行为模式',
            menu_domain_long: '🔗 设置“长按”网址域名',
            menu_prefix: '⚙️ 设置 Discord 前缀文字',
            menu_lang: '🌐 切换语言 (Change Language)',
            menu_help: '📖 使用说明书',
            prompt_prefix: '请输入自定义前缀（例如 [text]）：',
            prompt_lang: '请输入数字选择语言：\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: '请输入数字选择域名：\n',
            status_default: '默认 (x.com)',
            status_custom: '自定义',
            btn_tooltip: '左键：复制媒体链接\n中键：预览视频 / 图片灯箱\n右键：强制下载文件',
            link_tooltip: '点击：复制 ',
            link_tooltip_long: '\n长按：复制前缀 + ',
            msg_prefix_copied: '前缀已复制',
            msg_copied: '已复制',
            msg_downloaded: '已下载',
            msg_no_media: '❌ 无媒体',
            play_btn_tooltip: '点击：在浮动播放器中预览视频',
            btn_switch_to_video: '切换至视频',
            btn_switch_to_image: '切换至图片',
            msg_no_video: '❌ 无视频',
            reload_msg: '设置已保存',
            toast_domain_click: '🔗 单击域名 → ',
            toast_domain_long: '🔗 长按域名 → ',
            toast_prefix: '⚙️ Discord 前缀 → ',
            toast_date_fmt: '📅 日期格式 → ',
            toast_lang_pending: '🌐 语言已变更，重新载入后生效。',
            confirm_lang_reload: '语言已切换为 {lang}。\n立即重新载入页面以应用？',
            menu_date_format: '📅 日期格式',
            status_date_asian: '亚洲惯用 (YYYY.MM.DD)',
            status_date_western: '欧美惯用 (DD.MM.YYYY)',
            help_title: '推特媒体脚本 — 说明书',
            help_content: `
                <p><b>🖱️ 媒体按钮 (🎞️)：</b><br>
                • <b>左键单击：</b> 复制推文中所有图片/视频链接。<br>
                • <b>长按 (0.5秒)：</b> 复制含自定义前缀的链接，例如 <code>[text](url)</code>（方便 Discord 嵌入）。<br>
                • <b>中键单击：</b> 打开浮动视频播放器或图片灯箱。<br>
                • <b>右键单击：</b> 下载全部媒体，自动生成结构化文件名。<br>
                  (格式：<code>[twitter] 昵称(@ID)_日期_内文_ID.扩展名</code>)</p>
                <hr>
                <p><b>🔗 链接按钮 (🔗)：</b><br>
                • <b>单击：</b> 复制推文链接（x.com 或自定义单击域名）。<br>
                • <b>长按：</b> 复制前缀 + 长按域名链接（如 fixupx.com）。</p>
                <hr>
                <p><b>📋 下载历史：</b><br>
                • 右键下载后自动记录。<br>
                • 鼠标移至右上角 → 点击 🕐 打开历史面板。<br>
                • 支持列表/缩略图切换、搜索、Shift 区间选择、批量删除、CSV/JSON 导出。</p>
                <hr>
                <p><b>⚙️ 设置面板：</b><br>
                • 将鼠标移至右上角，显示齿轮 ⚙️ 与历史 🕐 按钮。<br>
                • 点击 ⚙️ 可设置：单击域名、长按域名、Discord 前缀、提示风格、日期格式、语言。</p>
                <hr>
                <hr>
                <p><b>⭐ 媒体分组 &amp; ⊞ 页面相册：</b><br>
                • <b>分组：</b>在 ⚙️ 设置 → <b>⭐ Groups</b> 中开启 <b>Group on Download</b>。右键下载后，屏幕边角短暂出现 ⭐ 按钮，悬停或点击可通过扇形选单将媒体归入分组。<br>
                • <b>页面相册：</b>在浮动视频播放器或图片灯箱中，点击上方 <b>⊞ 田字按钮</b>，可在侧栏浏览当前页面找到的所有媒体。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免责声明：</b><br>
                fixupx / vxtwitter 等域名均为第三方服务，与本脚本无关，请仅使用您信任的域名。</p>
            `,
            onboard_title: '⚙ 设置面板',
            onboard_body:  '将鼠标移到右上角即可呼出设置按钮，点击后可快速管理域名、前缀、语言等设置，无需打开脚本管理器菜单。',
            onboard_got_it: '知道了！',
            onboard_step1_title: '📋 Twitter / X — 媒体按钮',
            onboard_step1_body:  '本脚本会在所有含图片或视频的推文上直接注入「复制链接」与「下载」按钮，鼠标移到媒体推文的操作栏即可看到它们。',
            onboard_next: '下一步 →',
            menu_feedback_style:    '🔔 提示风格',
            status_feedback_toast:  'Toast 提示',
            status_feedback_icon:   '仅图标',
            status_feedback_silent: '静默（仅图标）',
            status_feedback_pulse:  '脉冲光环',
            status_feedback_flash:  '闪光扫描',
            status_feedback_slide:  '文字滑入',
            status_on:  '开启',
            status_off: '关闭',
            toast_feedback_style:   '🔔 提示风格 → ',
        },
        'ja': {
            langName: '日本語',
            menu_domain_click: '🔗 クリック動作設定',
            menu_domain_long: '🔗 長押しURLドメイン設定',
            menu_prefix: '⚙️ プレフィックス設定 (Discord)',
            menu_lang: '🌐 言語変更 (Change Language)',
            menu_help: '📖 ヘルプ / 説明書',
            prompt_prefix: 'カスタムプレフィックスを入力（例: [text]）：',
            prompt_lang: '番号を入力して言語を選択：\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: 'ドメインの番号を入力：\n',
            status_default: 'デフォルト (x.com)',
            status_custom: 'カスタム',
            btn_tooltip: '左：メディアリンクをコピー\n中：動画プレビュー / 画像ライトボックス\n右：ファイルをダウンロード',
            link_tooltip: 'クリック：コピー ',
            link_tooltip_long: '\n長押し：プレフィックス付きコピー ',
            msg_prefix_copied: 'プレフィックス付',
            msg_copied: 'コピー完了',
            msg_downloaded: 'ダウンロード完了',
            msg_no_media: '❌ メディアなし',
            play_btn_tooltip: 'クリック：フローティングプレーヤーで動画を再生',
            btn_switch_to_video: '動画に切り替え',
            btn_switch_to_image: '画像に切り替え',
            msg_no_video: '❌ 動画なし',
            reload_msg: '設定が保存されました',
            toast_domain_click: '🔗 クリックドメイン → ',
            toast_domain_long: '🔗 長押しドメイン → ',
            toast_prefix: '⚙️ Discordプレフィックス → ',
            toast_date_fmt: '📅 日付フォーマット → ',
            toast_lang_pending: '🌐 言語を変更しました。再読み込み後に反映されます。',
            confirm_lang_reload: '言語を {lang} に変更しました。\n今すぐページを再読み込みしますか？',
            menu_date_format: '📅 日付フォーマット',
            status_date_asian: 'アジア式 (YYYY.MM.DD)',
            status_date_western: '欧米式 (DD.MM.YYYY)',
            help_title: 'Twitter メディアスクリプト — マニュアル',
            help_content: `
                <p><b>🖱️ メディアボタン (🎞️)：</b><br>
                • <b>左クリック：</b> ツイート内の画像/動画URLをすべてコピー。<br>
                • <b>長押し (0.5秒)：</b> カスタムプレフィックス付きでコピー（例：<code>[text](url)</code>、Discord向け）。<br>
                • <b>中クリック：</b> フローティング動画プレーヤーまたは画像ライトボックスを開く。<br>
                • <b>右クリック：</b> 全メディアをダウンロード（構造化ファイル名）。<br>
                  (形式：<code>[twitter] 名前(@ID)_日付_本文_ID.拡張子</code>)</p>
                <hr>
                <p><b>🔗 リンクボタン (🔗)：</b><br>
                • <b>クリック：</b> ツイートURLをコピー（x.com またはカスタムドメイン）。<br>
                • <b>長押し：</b> プレフィックス + 長押しドメインURLをコピー（例：fixupx.com）。</p>
                <hr>
                <p><b>📋 ダウンロード履歴：</b><br>
                • 右クリックダウンロードは自動記録。<br>
                • 右上にカーソルを合わせ → 🕐 をクリックして履歴パネルを開く。<br>
                • リスト/サムネイル表示、検索、Shift選択一括削除、CSV/JSONエクスポート対応。</p>
                <hr>
                <p><b>⚙️ 設定パネル：</b><br>
                • 右上隅にカーソルを合わせると ⚙️ と 🕐 ボタンが表示される。<br>
                • ⚙️ をクリックして設定：クリックドメイン、長押しドメイン、プレフィックス、通知スタイル、日付形式、言語。</p>
                <hr>
                <hr>
                <p><b>⭐ グループ &amp; ⊞ ギャラリー：</b><br>
                • <b>グループ：</b>⚙️ 設定 → <b>⭐ Groups</b> で <b>Group on Download</b> を有効にすると、右クリックダウンロード後に画面端へ ⭐ が短時間表示されます。ホバーまたはクリックするとファン型の選択メニューが開き、グループに分類できます。<br>
                • <b>ギャラリー：</b>フローティング動画プレーヤーまたは画像ライトボックスで上部の <b>⊞ グリッドボタン</b> をクリックすると、現在のページで見つかったすべてのメディアをサイドパネルで閲覧できます。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免責事項：</b><br>
                fixupx / vxtwitter 等のドメインは第三者サービスであり、このスクリプトとは無関係です。信頼できるドメインのみご使用ください。</p>
            `,
            onboard_title: '⚙ 設定パネル',
            onboard_body:  '右上隅にカーソルを合わせると設定ボタンが現れます。クリックすればスクリプト管理器を開かずにドメイン・プレフィックス・言語などをすばやく管理できます。',
            onboard_got_it: 'わかった！',
            onboard_step1_title: '📋 Twitter / X — メディアボタン',
            onboard_step1_body:  '画像や動画を含むすべてのツイートに「リンクをコピー」と「ダウンロード」ボタンを直接追加します。メディアツイートにカーソルを合わせると操作バーに表示されます。',
            onboard_next: '次へ →',
            menu_feedback_style:    '🔔 フィードバックスタイル',
            status_feedback_toast:  'トースト通知',
            status_feedback_icon:   'アイコンのみ',
            status_feedback_silent: 'サイレント（アイコンのみ）',
            status_feedback_pulse:  'パルスリング',
            status_feedback_flash:  'フラッシュスイープ',
            status_feedback_slide:  'スライドアップ',
            status_on:  'オン',
            status_off: 'オフ',
            toast_feedback_style:   '🔔 フィードバックスタイル → ',
        },
        'ko': {
            langName: '한국어',
            menu_domain_click: '🔗 클릭 동작 설정',
            menu_domain_long: '🔗 길게 누르기 도메인 설정',
            menu_prefix: '⚙️ 접두사 설정 (Discord)',
            menu_lang: '🌐 언어 변경 (Change Language)',
            menu_help: '📖 도움말 / 설명서',
            prompt_prefix: '사용자 지정 접두사 입력 (예: [text]):',
            prompt_lang: '숫자를 입력하여 언어 선택:\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: '도메인 번호를 선택하세요:\n',
            status_default: '기본 (x.com)',
            status_custom: '사용자 지정',
            btn_tooltip: '왼쪽: 미디어 링크 복사\n가운데: 동영상 미리보기 / 이미지 라이트박스\n오른쪽: 파일 다운로드',
            link_tooltip: '클릭: 복사 ',
            link_tooltip_long: '\n길게 누르기: 접두사 포함 복사 ',
            msg_prefix_copied: '접두사 복사됨',
            msg_copied: '복사 완료',
            msg_downloaded: '다운로드 완료',
            msg_no_media: '❌ 미디어 없음',
            play_btn_tooltip: '클릭: 플로팅 플레이어에서 동영상 재생',
            btn_switch_to_video: '동영상으로 전환',
            btn_switch_to_image: '이미지로 전환',
            msg_no_video: '❌ 동영상 없음',
            reload_msg: '설정이 저장되었습니다',
            toast_domain_click: '🔗 클릭 도메인 → ',
            toast_domain_long: '🔗 길게 누르기 도메인 → ',
            toast_prefix: '⚙️ Discord 접두사 → ',
            toast_date_fmt: '📅 날짜 형식 → ',
            toast_lang_pending: '🌐 언어가 변경되었습니다. 새로고침 후 적용됩니다.',
            confirm_lang_reload: '언어가 {lang}(으)로 변경되었습니다.\n지금 페이지를 새로고침하시겠습니까?',
            menu_date_format: '📅 날짜 형식',
            status_date_asian: '아시아식 (YYYY.MM.DD)',
            status_date_western: '서양식 (DD.MM.YYYY)',
            help_title: '트위터 미디어 스크립트 — 설명서',
            help_content: `
                <p><b>🖱️ 미디어 버튼 (🎞️)：</b><br>
                • <b>좌클릭：</b> 트윗 내 모든 이미지/동영상 URL 복사。<br>
                • <b>길게 누르기 (0.5초)：</b> 커스텀 접두사 포함 복사（예：<code>[text](url)</code>, Discord용）。<br>
                • <b>중간 클릭：</b> 동영상 플레이어 또는 이미지 라이트박스 열기。<br>
                • <b>우클릭：</b> 모든 미디어 다운로드（구조화된 파일명 자동 생성）。<br>
                  (형식：<code>[twitter] 이름(@ID)_날짜_본문_ID.확장자</code>)</p>
                <hr>
                <p><b>🔗 링크 버튼 (🔗)：</b><br>
                • <b>클릭：</b> 트윗 URL 복사（x.com 또는 커스텀 도메인）。<br>
                • <b>길게 누르기：</b> 접두사 + 길게 누르기 도메인 URL 복사（예：fixupx.com）。</p>
                <hr>
                <p><b>📋 다운로드 기록：</b><br>
                • 우클릭 다운로드 후 자동 기록。<br>
                • 오른쪽 상단에 마우스를 올려 → 🕐 클릭으로 기록 패널 열기。<br>
                • 목록/썸네일 보기, 검색, Shift 범위 선택, 일괄 삭제, CSV/JSON 내보내기 지원。</p>
                <hr>
                <p><b>⚙️ 설정 패널：</b><br>
                • 오른쪽 상단에 마우스를 올리면 ⚙️ 와 🕐 버튼이 나타납니다。<br>
                • ⚙️ 클릭으로 설정：클릭 도메인, 길게 누르기 도메인, 접두사, 알림 스타일, 날짜 형식, 언어。</p>
                <hr>
                <hr>
                <p><b>⭐ 그룹 &amp; ⊞ 갤러리：</b><br>
                • <b>그룹：</b>⚙️ 설정 → <b>⭐ Groups</b>에서 <b>Group on Download</b>를 활성화하세요. 우클릭 다운로드 후 화면 가장자리에 ⭐ 버튼이 잠깐 표시됩니다. 호버하거나 클릭하면 부채꼴 선택 메뉴가 열려 미디어를 그룹에 분류할 수 있습니다.<br>
                • <b>갤러리：</b>플로팅 동영상 플레이어 또는 이미지 라이트박스에서 상단의 <b>⊞ 그리드 버튼</b>을 클릭하면 현재 페이지의 모든 미디어를 사이드 패널에서 탐색할 수 있습니다.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 면책 조항：</b><br>
                fixupx / vxtwitter 등은 본 스크립트와 무관한 제3자 서비스입니다. 신뢰할 수 있는 도메인만 사용하세요。</p>
            `,
            onboard_title: '⚙ 설정 패널',
            onboard_body:  '오른쪽 상단 모서리에 마우스를 올리면 설정 버튼이 나타납니다. 클릭하면 스크립트 관리자 없이 도메인, 접두사, 언어 등을 빠르게 관리할 수 있습니다.',
            onboard_got_it: '알겠어요!',
            onboard_step1_title: '📋 Twitter / X — 미디어 버튼',
            onboard_step1_body:  '이 스크립트는 사진이나 동영상이 포함된 모든 트윗에 링크 복사 및 다운로드 버튼을 직접 추가합니다. 미디어 트윗에 마우스를 올리면 작업 표시줄에서 확인할 수 있습니다.',
            onboard_next: '다음 →',
            menu_feedback_style:    '🔔 피드백 스타일',
            status_feedback_toast:  '토스트',
            status_feedback_icon:   '아이콘만',
            status_feedback_silent: '조용히 (아이콘만)',
            status_feedback_pulse:  '펄스 링',
            status_feedback_flash:  '플래시 스윕',
            status_feedback_slide:  '슬라이드 업',
            status_on:  '켜짐',
            status_off: '꺼짐',
            toast_feedback_style:   '🔔 피드백 스타일 → ',
        },
        'es': {
            langName: 'Español',
            menu_domain_click: '🔗 Configurar comportamiento de "clic"',
            menu_domain_long: '🔗 Configurar dominio de "pulsación larga"',
            menu_prefix: '⚙️ Configurar prefijo personalizado (Discord)',
            menu_lang: '🌐 Cambiar idioma (Change Language)',
            menu_help: '📖 Ayuda / Manual',
            prompt_prefix: 'Ingrese el prefijo personalizado (ej. [texto]):',
            prompt_lang: 'Ingrese un número para seleccionar el idioma:\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: 'Seleccione el número del dominio:\n',
            status_default: 'Predeterminado (x.com)',
            status_custom: 'Personalizado',
            btn_tooltip: 'Clic izq: Copiar enlaces de medios\nClic central: Ver video / Galería de imágenes\nClic der: Descargar archivos',
            link_tooltip: 'Clic: Copiar ',
            link_tooltip_long: '\nPulsación larga: Copiar prefijo + ',
            msg_prefix_copied: 'Prefijo copiado',
            msg_copied: 'Copiado',
            msg_downloaded: 'Descargado',
            msg_no_media: '❌ Sin medios',
            play_btn_tooltip: 'Clic: Ver video en reproductor flotante',
            btn_switch_to_video: 'Cambiar a vídeo',
            btn_switch_to_image: 'Cambiar a imagen',
            msg_no_video: '❌ Sin video',
            reload_msg: 'Configuración guardada',
            toast_domain_click: '🔗 Dominio de clic → ',
            toast_domain_long: '🔗 Dominio de pulsación larga → ',
            toast_prefix: '⚙️ Prefijo de Discord → ',
            toast_date_fmt: '📅 Formato de fecha → ',
            toast_lang_pending: '🌐 Idioma cambiado. Se aplicará al recargar.',
            confirm_lang_reload: 'Idioma cambiado a {lang}.\n¿Recargar la página ahora?',
            menu_date_format: '📅 Formato de fecha',
            status_date_asian: 'Asiático (YYYY.MM.DD)',
            status_date_western: 'Occidental (DD.MM.YYYY)',
            help_title: 'Botón de copia de medios de Twitter - Manual',
            help_content: `
                <p><b>🖱️ Botón de medios (🎞️):</b><br>
                • <b>Clic izquierdo:</b> Copiar enlaces de imágenes/videos.<br>
                • <b>Pulsación larga (0.5s):</b> Copiar con prefijo personalizado (formato Markdown, para Discord).<br>
                • <b>Clic central:</b> Vista previa——reproductor de video flotante o galería de imágenes.<br>
                • <b>Clic derecho:</b> Descargar todos los medios con nombres de archivo estructurados.<br>
                  (Formato: <code>[twitter] Nombre(@ID)_Fecha_Texto_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Botón de enlace (🔗):</b><br>
                • <b>Clic:</b> Copiar enlace del tweet (predeterminado x.com, o dominio personalizado de clic).<br>
                • <b>Pulsación larga:</b> Copiar con prefijo + dominio de pulsación larga (ej. fixupx).</p>
                <hr>
                <p><b>📋 Historial de descargas:</b><br>
                • Se registra automáticamente tras descargar con clic derecho.<br>
                • Los tweets descargados muestran un 🟢 badge en el botón 🎞️.<br>
                • Clic en 📋 (esquina superior derecha): vista lista/miniaturas, búsqueda, exportar CSV/JSON.</p>
                <hr>
                <p><b>⚙️ Panel de configuración:</b><br>
                • Pasa el ratón por la esquina superior derecha → aparecen 📋 y ⚙️.<br>
                • Configura: dominio de clic, dominio de pulsación larga, prefijo Discord, formato de fecha, idioma, estilo de notificación.</p>
                <hr>
                <hr>
                <p><b>⭐ Grupos &amp; ⊞ Galería:</b><br>
                • <b>Grupos:</b> En ⚙️ Ajustes → <b>⭐ Groups</b>, activa <b>Group on Download</b>. Tras descargar con clic derecho, aparece ⭐ brevemente en el borde de la pantalla — pasa el cursor o haz clic para abrir el selector en abanico y asignar a un grupo.<br>
                • <b>Galería:</b> En el reproductor flotante o el visor de imágenes, haz clic en el <b>botón de cuadrícula ⊞</b> para abrir un panel lateral y explorar todos los medios de la página actual.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Aviso legal:</b><br>
                Los dominios de conversión (ej. fixupx, vxtwitter) son servicios de terceros sin relación con este script.</p>
            `,
            onboard_title: '⚙ Panel de Configuración',
            onboard_body:  'Mueve el cursor a la esquina superior derecha para revelar el botón de configuración. Haz clic para gestionar dominios, prefijo, idioma y más sin abrir el administrador de scripts.',
            onboard_got_it: '¡Entendido!',
            onboard_step1_title: '📋 Twitter / X — Botones de Medios',
            onboard_step1_body:  'Este script añade botones de Copiar y Descargar directamente a todos los tweets con fotos o videos. Pasa el cursor sobre cualquier tweet con medios para verlos en la barra de acciones.',
            onboard_next: 'Siguiente →',
            menu_feedback_style:    '🔔 Estilo de Aviso',
            status_feedback_toast:  'Toast',
            status_feedback_icon:   'Solo icono',
            status_feedback_silent: 'Silencioso (solo icono)',
            status_feedback_pulse:  'Anillo de Pulso',
            status_feedback_flash:  'Destello Rápido',
            status_feedback_slide:  'Deslizar Texto',
            status_on:  'Activado',
            status_off: 'Desactivado',
            toast_feedback_style:   '🔔 Estilo de Aviso → ',
        },
        'pt-BR': {
            langName: 'Português (BR)',
            menu_domain_click: '🔗 Configurar comportamento de "clique"',
            menu_domain_long: '🔗 Configurar domínio de "pressão longa"',
            menu_prefix: '⚙️ Configurar prefixo personalizado (Discord)',
            menu_lang: '🌐 Mudar idioma (Change Language)',
            menu_help: '📖 Ajuda / Manual',
            prompt_prefix: 'Digite o prefixo personalizado (ex. [texto]):',
            prompt_lang: 'Digite um número para selecionar o idioma:\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: 'Selecione o número do domínio:\n',
            status_default: 'Padrão (x.com)',
            status_custom: 'Personalizado',
            btn_tooltip: 'Clique esq: Copiar links de mídia\nClique do meio: Visualizar vídeo / Galeria de imagens\nClique dir: Baixar arquivos',
            link_tooltip: 'Clique: Copiar ',
            link_tooltip_long: '\nPressão longa: Copiar prefixo + ',
            msg_prefix_copied: 'Prefixo copiado',
            msg_copied: 'Copiado',
            msg_downloaded: 'Baixado',
            msg_no_media: '❌ Sem mídia',
            play_btn_tooltip: 'Clique: Reproduzir vídeo no player flutuante',
            btn_switch_to_video: 'Trocar para vídeo',
            btn_switch_to_image: 'Trocar para imagem',
            msg_no_video: '❌ Sem vídeo',
            reload_msg: 'Configurações salvas',
            toast_domain_click: '🔗 Domínio de clique → ',
            toast_domain_long: '🔗 Domínio de pressão longa → ',
            toast_prefix: '⚙️ Prefixo do Discord → ',
            toast_date_fmt: '📅 Formato de data → ',
            toast_lang_pending: '🌐 Idioma alterado. Será aplicado ao recarregar.',
            confirm_lang_reload: 'Idioma alterado para {lang}.\nRecarregar a página agora?',
            menu_date_format: '📅 Formato de data',
            status_date_asian: 'Asiático (YYYY.MM.DD)',
            status_date_western: 'Ocidental (DD.MM.YYYY)',
            help_title: 'Botão de cópia de mídia do Twitter - Manual',
            help_content: `
                <p><b>🖱️ Botão de mídia (🎞️):</b><br>
                • <b>Clique esquerdo:</b> Copiar links de imagens/vídeos.<br>
                • <b>Pressão longa (0.5s):</b> Copiar com prefixo personalizado (formato Markdown, para Discord).<br>
                • <b>Clique do meio:</b> Visualizar——player de vídeo flutuante ou galeria de imagens.<br>
                • <b>Clique direito:</b> Baixar todas as mídias com nomes de arquivo estruturados.<br>
                  (Formato: <code>[twitter] Nome(@ID)_Data_Texto_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Botão de link (🔗):</b><br>
                • <b>Clique:</b> Copiar link do tweet (padrão x.com, ou domínio de clique personalizado).<br>
                • <b>Pressão longa:</b> Copiar com prefixo + domínio de pressão longa (ex. fixupx).</p>
                <hr>
                <p><b>📋 Histórico de downloads:</b><br>
                • Registrado automaticamente após download com clique direito.<br>
                • Tweets baixados mostram 🟢 badge no botão 🎞️.<br>
                • Clique em 📋 (canto superior direito): lista/miniaturas, pesquisa, exportar CSV/JSON.</p>
                <hr>
                <p><b>⚙️ Painel de configurações:</b><br>
                • Passe o mouse pelo canto superior direito → 📋 e ⚙️ aparecem.<br>
                • Configure: domínio de clique, domínio de pressão longa, prefixo Discord, formato de data, idioma, estilo de aviso.</p>
                <hr>
                <hr>
                <p><b>⭐ Grupos &amp; ⊞ Galeria:</b><br>
                • <b>Grupos:</b> Em ⚙️ Configurações → <b>⭐ Groups</b>, ative <b>Group on Download</b>. Após baixar com clique direito, ⭐ aparece brevemente na borda da tela — passe o mouse ou clique para abrir o seletor em leque e atribuir a um grupo.<br>
                • <b>Galeria:</b> No player flutuante ou lightbox de imagens, clique no <b>botão de grade ⊞</b> para abrir um painel lateral e explorar todas as mídias da página atual.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Aviso legal:</b><br>
                Os domínios de conversão (ex. fixupx, vxtwitter) são serviços de terceiros sem relação com este script.</p>
            `,
            onboard_title: '⚙ Painel de Configurações',
            onboard_body:  'Passe o mouse no canto superior direito para revelar o botão de configurações. Clique para gerenciar domínios, prefixo, idioma e mais sem abrir o gerenciador de scripts.',
            onboard_got_it: 'Entendi!',
            onboard_step1_title: '📋 Twitter / X — Botões de Mídia',
            onboard_step1_body:  'Este script adiciona botões de Copiar e Baixar diretamente em todos os tweets com fotos ou vídeos. Passe o mouse sobre qualquer tweet com mídia para vê-los na barra de ações.',
            onboard_next: 'Próximo →',
            menu_feedback_style:    '🔔 Estilo de Aviso',
            status_feedback_toast:  'Toast',
            status_feedback_icon:   'Só ícone',
            status_feedback_silent: 'Silencioso (só ícone)',
            status_feedback_pulse:  'Anel de Pulso',
            status_feedback_flash:  'Varredura Flash',
            status_feedback_slide:  'Deslizar Texto',
            status_on:  'Ativado',
            status_off: 'Desativado',
            toast_feedback_style:   '🔔 Estilo de Aviso → ',
        },
        'fr': {
            langName: 'Français',
            menu_domain_click: '🔗 Configurer le comportement "clic"',
            menu_domain_long: '🔗 Configurer le domaine "appui long"',
            menu_prefix: '⚙️ Configurer le préfixe personnalisé (Discord)',
            menu_lang: '🌐 Changer de langue (Change Language)',
            menu_help: '📖 Aide / Manuel',
            prompt_prefix: 'Entrez le préfixe personnalisé (ex. [texte]) :',
            prompt_lang: 'Entrez un numéro pour sélectionner la langue :\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: 'Sélectionnez le numéro du domaine :\n',
            status_default: 'Par défaut (x.com)',
            status_custom: 'Personnalisé',
            btn_tooltip: 'Clic gauche : Copier les liens médias\nClic milieu : Aperçu vidéo / Galerie images\nClic droit : Télécharger les fichiers',
            link_tooltip: 'Clic : Copier ',
            link_tooltip_long: '\nAppui long : Copier préfixe + ',
            msg_prefix_copied: 'Préfixe copié',
            msg_copied: 'Copié',
            msg_downloaded: 'Téléchargé',
            msg_no_media: '❌ Aucun média',
            play_btn_tooltip: 'Clic : Lire la vidéo dans le lecteur flottant',
            btn_switch_to_video: 'Basculer vers la vidéo',
            btn_switch_to_image: 'Basculer vers l\'image',
            msg_no_video: '❌ Aucune vidéo',
            reload_msg: 'Paramètres enregistrés',
            toast_domain_click: '🔗 Domaine clic → ',
            toast_domain_long: '🔗 Domaine appui long → ',
            toast_prefix: '⚙️ Préfixe Discord → ',
            toast_date_fmt: '📅 Format de date → ',
            toast_lang_pending: '🌐 Langue modifiée. Sera appliqué au rechargement.',
            confirm_lang_reload: 'Langue changée en {lang}.\nRecharger la page maintenant ?',
            menu_date_format: '📅 Format de date',
            status_date_asian: 'Asiatique (YYYY.MM.DD)',
            status_date_western: 'Occidental (DD.MM.YYYY)',
            help_title: 'Bouton de copie de médias Twitter - Manuel',
            help_content: `
                <p><b>🖱️ Bouton média (🎞️) :</b><br>
                • <b>Clic gauche :</b> Copier les liens des images/vidéos.<br>
                • <b>Appui long (0.5s) :</b> Copier avec préfixe personnalisé (format Markdown, pour Discord).<br>
                • <b>Clic central :</b> Aperçu——lecteur vidéo flottant ou galerie d'images.<br>
                • <b>Clic droit :</b> Télécharger tous les médias avec noms de fichiers structurés.<br>
                  (Format : <code>[twitter] Nom(@ID)_Date_Texte_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Bouton lien (🔗) :</b><br>
                • <b>Clic :</b> Copier le lien du tweet (x.com par défaut, ou domaine de clic personnalisé).<br>
                • <b>Appui long :</b> Copier avec préfixe + domaine appui long (ex. fixupx).</p>
                <hr>
                <p><b>📋 Historique des téléchargements :</b><br>
                • Enregistré automatiquement après téléchargement par clic droit.<br>
                • Les tweets téléchargés affichent un 🟢 badge sur le bouton 🎞️.<br>
                • Cliquez sur 📋 (coin supérieur droit) : liste/miniatures, recherche, export CSV/JSON.</p>
                <hr>
                <p><b>⚙️ Panneau de paramètres :</b><br>
                • Survolez le coin supérieur droit → 📋 et ⚙️ apparaissent.<br>
                • Configurez : domaine de clic, domaine d'appui long, préfixe Discord, format de date, langue, style de retour.</p>
                <hr>
                <hr>
                <p><b>⭐ Groupes &amp; ⊞ Galerie :</b><br>
                • <b>Groupes :</b> Dans ⚙️ Paramètres → <b>⭐ Groups</b>, activez <b>Group on Download</b>. Après chaque téléchargement par clic droit, ⭐ apparaît brièvement en bordure d'écran — survolez ou cliquez pour ouvrir le sélecteur en éventail et classer le média dans un groupe.<br>
                • <b>Galerie :</b> Dans le lecteur flottant ou le visionneur d'images, cliquez sur le <b>bouton de grille ⊞</b> pour ouvrir un panneau latéral et parcourir tous les médias de la page actuelle.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Avertissement :</b><br>
                Les domaines de conversion (ex. fixupx, vxtwitter) sont des services tiers sans lien avec ce script.</p>
            `,
            onboard_title: '⚙ Panneau de Paramètres',
            onboard_body:  'Survolez le coin supérieur droit pour afficher le bouton de paramètres. Cliquez pour gérer les domaines, le préfixe, la langue et plus en utilisant le panneau de paramètres intégré.',
            onboard_got_it: "Compris !",
            onboard_step1_title: '📋 Twitter / X — Boutons Médias',
            onboard_step1_body:  "Ce script ajoute des boutons Copier et Télécharger directement sur tous les tweets avec des photos ou vidéos. Survolez n'importe quel tweet avec des médias pour les voir dans la barre d'actions.",
            onboard_next: 'Suivant →',
            menu_feedback_style:    '🔔 Style de Retour',
            status_feedback_toast:  'Toast',
            status_feedback_icon:   'Icône seul',
            status_feedback_silent: 'Silencieux (icône seul)',
            status_feedback_pulse:  'Anneau de Pulse',
            status_feedback_flash:  'Balayage Flash',
            status_feedback_slide:  'Glissement Texte',
            status_on:  'Activé',
            status_off: 'Désactivé',
            toast_feedback_style:   '🔔 Style de Retour → ',
        },
        'ru': {
            langName: 'Русский',
            menu_domain_click: '🔗 Настроить поведение «клика»',
            menu_domain_long: '🔗 Настроить домен «долгого нажатия»',
            menu_prefix: '⚙️ Настроить префикс (Discord)',
            menu_lang: '🌐 Изменить язык (Change Language)',
            menu_help: '📖 Справка / Руководство',
            prompt_prefix: 'Введите префикс (например [текст]):',
            prompt_lang: 'Введите номер для выбора языка:\n1. English\n2. 繁體中文\n3. 简体中文\n4. 日本語\n5. 한국어\n6. Español\n7. Português (BR)\n8. Français\n9. Русский\n10. ✏️ Custom Language',
            prompt_domain: 'Выберите номер домена:\n',
            status_default: 'По умолчанию (x.com)',
            status_custom: 'Пользовательский',
            btn_tooltip: 'Левый клик: Копировать медиа-ссылки\nСредний клик: Просмотр видео / Галерея изображений\nПравый клик: Скачать файлы',
            link_tooltip: 'Клик: Копировать ',
            link_tooltip_long: '\nДолгое нажатие: Копировать с префиксом ',
            msg_prefix_copied: 'Префикс скопирован',
            msg_copied: 'Скопировано',
            msg_downloaded: 'Загружено',
            msg_no_media: '❌ Нет медиа',
            play_btn_tooltip: 'Клик: Воспроизвести видео во всплывающем плеере',
            btn_switch_to_video: 'Переключить на видео',
            btn_switch_to_image: 'Переключить на изображение',
            msg_no_video: '❌ Нет видео',
            reload_msg: 'Настройки сохранены',
            toast_domain_click: '🔗 Домен клика → ',
            toast_domain_long: '🔗 Домен долгого нажатия → ',
            toast_prefix: '⚙️ Префикс Discord → ',
            toast_date_fmt: '📅 Формат даты → ',
            toast_lang_pending: '🌐 Язык изменён. Применится после перезагрузки.',
            confirm_lang_reload: 'Язык изменён на {lang}.\nПерезагрузить страницу сейчас?',
            menu_date_format: '📅 Формат даты',
            status_date_asian: 'Азиатский (YYYY.MM.DD)',
            status_date_western: 'Западный (DD.MM.YYYY)',
            help_title: 'Кнопка копирования медиа Twitter - Руководство',
            help_content: `
                <p><b>🖱️ Кнопка медиа (🎞️):</b><br>
                • <b>Левый клик:</b> Копировать ссылки на изображения/видео.<br>
                • <b>Долгое нажатие (0.5с):</b> Копировать с префиксом (формат Markdown, для Discord).<br>
                • <b>Средний клик:</b> Предпросмотр——всплывающий видеоплеер или галерея изображений.<br>
                • <b>Правый клик:</b> Принудительно скачать все медиафайлы со структурированными именами.<br>
                  (Формат: <code>[twitter] Имя(@ID)_Дата_Текст_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Кнопка ссылки (🔗):</b><br>
                • <b>Клик:</b> Копировать ссылку на твит (по умолчанию x.com, или пользовательский домен).<br>
                • <b>Долгое нажатие:</b> Копировать с префиксом + домен долгого нажатия (напр. fixupx).</p>
                <hr>
                <p><b>📋 История загрузок:</b><br>
                • Автоматически записывается после правого клика.<br>
                • Скачанные твиты показывают 🟢 значок на кнопке 🎞️.<br>
                • Нажмите 📋 (верхний правый угол): список/миниатюры, поиск, экспорт CSV/JSON.</p>
                <hr>
                <p><b>⚙️ Панель настроек:</b><br>
                • Наведите курсор в правый верхний угол → появятся 📋 и ⚙️.<br>
                • Настройте: домен клика, домен долгого нажатия, префикс Discord, формат даты, язык, стиль уведомлений.</p>
                <hr>
                <hr>
                <p><b>⭐ Группы &amp; ⊞ Галерея:</b><br>
                • <b>Группы:</b> В ⚙️ Настройках → <b>⭐ Groups</b> включите <b>Group on Download</b>. После каждой загрузки правой кнопкой мыши у края экрана кратко появляется ⭐ — наведите курсор или нажмите, чтобы открыть веерный выбор и отнести медиа к группе.<br>
                • <b>Галерея:</b> В плавающем видеоплеере или лайтбоксе нажмите <b>кнопку сетки ⊞</b> — откроется боковая панель со всеми медиафайлами текущей страницы.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Отказ от ответственности:</b><br>
                Домены конвертации (fixupx, vxtwitter и др.) — сторонние сервисы, не связанные с этим скриптом. Используйте только те домены, которым доверяете.</p>
            `,
            onboard_title: '⚙ Панель настроек',
            onboard_body:  'Наведите курсор в правый верхний угол, чтобы показать кнопку настроек. Нажмите для быстрого управления доменами, префиксом, языком и другими параметрами.',
            onboard_got_it: 'Понятно!',
            onboard_step1_title: '📋 Twitter / X — Кнопки медиа',
            onboard_step1_body:  'Скрипт добавляет кнопки «Копировать» и «Скачать» прямо на все твиты с фотографиями или видео. Наведите курсор на медиатвит, чтобы увидеть их на панели действий.',
            onboard_next: 'Далее →',
            menu_feedback_style:    '🔔 Стиль уведомлений',
            status_feedback_toast:  'Тост',
            status_feedback_icon:   'Только иконка',
            status_feedback_silent: 'Тихий (только иконка)',
            status_feedback_pulse:  'Пульсирующее кольцо',
            status_feedback_flash:  'Вспышка',
            status_feedback_slide:  'Текст снизу',
            status_on:  'Включено',
            status_off: 'Выключено',
            toast_feedback_style:   '🔔 Стиль уведомлений → ',
        }
    };

    function getAppLanguage() {
        let lang = GM_getValue(KEY_LANG, null);
        if (!lang) {
            const navLang = navigator.language || 'en';
            if (navLang.toLowerCase().startsWith('zh-cn')) lang = 'zh-CN';
            else if (navLang.toLowerCase().startsWith('zh')) lang = 'zh-TW';
            else if (navLang.toLowerCase().startsWith('ja')) lang = 'ja';
            else if (navLang.toLowerCase().startsWith('ko')) lang = 'ko';
            else if (navLang.toLowerCase().startsWith('pt')) lang = 'pt-BR';
            else if (navLang.toLowerCase().startsWith('fr')) lang = 'fr';
            else if (navLang.toLowerCase().startsWith('ru')) lang = 'ru';
            else if (navLang.toLowerCase().startsWith('es')) lang = 'es';
            else lang = 'en';
            GM_setValue(KEY_LANG, lang);
        }
        if (lang === 'custom') {
            try {
                const raw = GM_getValue(KEY_CUSTOM_LANG, null);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed && parsed.langName) {
                        TR['custom'] = parsed;
                        return 'custom';
                    }
                }
            } catch(e) {}
            return 'en';
        }
        return TR[lang] ? lang : 'en';
    }

    const CURRENT_LANG = getAppLanguage();
    const T = TR[CURRENT_LANG];

    let _cachedDateFormat = GM_getValue(KEY_DATE_FORMAT, 'asian');
    function _refreshDateFormatCache() {
        _cachedDateFormat = GM_getValue(KEY_DATE_FORMAT, 'asian');
    }

    function _readSettings() {
        return {
            clickCustom:    GM_getValue(KEY_CLICK_MODE_CUSTOM, false),
            clickDomain:    GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com'),
            prefix:         GM_getValue(KEY_PREFIX_TEXT, '[text]'),
            fmt:            GM_getValue(KEY_DATE_FORMAT, 'asian'),
            fbStyle:        GM_getValue(KEY_FEEDBACK_STYLE, 'toast'),
            dockStyle:      GM_getValue(KEY_DOCK_STYLE, 'ruler'),
            dockHoverDelay: parseInt(GM_getValue(KEY_DOCK_HOVER_DELAY, '500'), 10) || 500,
            dockTriggerL:   parseInt(GM_getValue(KEY_DOCK_TRIGGER_L, '80'), 10) || 80,
            dockTriggerR:   parseInt(GM_getValue(KEY_DOCK_TRIGGER_R, '80'), 10) || 80,
        };
    }

    function showToast(message) {
        const existing = document.getElementById('tm-reload-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'tm-reload-toast';
        toast.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #1d9bf0; color: white; padding: 10px 20px;
            border-radius: 9999px; box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            font-family: system-ui, -apple-system, sans-serif; font-size: 14px; font-weight: bold;
            z-index: 999999; display: flex; align-items: center; gap: 8px;
            transition: opacity 0.3s ease-in-out; opacity: 0; pointer-events: none;
            white-space: nowrap; max-width: 90vw; overflow: hidden; text-overflow: ellipsis;
        `;
        const toastSpan = document.createElement('span');
        toastSpan.textContent = message;
        toast.appendChild(toastSpan);
        document.body.appendChild(toast);

        requestAnimationFrame(() => { toast.style.opacity = '1'; });

        setTimeout(() => {
            if (toast) {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }
        }, 2500);
    }

    function sanitizeHelpHtml(htmlString, container) {
        const ALLOWED_TAGS = new Set(['P','B','BR','HR','CODE','UL','LI','A','SPAN']);
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        function walk(srcNode, destParent) {
            srcNode.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    destParent.appendChild(document.createTextNode(child.textContent));
                    return;
                }
                if (child.nodeType !== Node.ELEMENT_NODE) return;
                const tag = child.tagName.toUpperCase();
                if (!ALLOWED_TAGS.has(tag)) {
                    destParent.appendChild(document.createTextNode(child.textContent));
                    return;
                }
                const el = document.createElement(tag === 'A' ? 'a' : tag);
                if (tag === 'A') {
                    const href = child.getAttribute('href');
                    if (href && /^https?:\/\//i.test(href)) {
                        el.href = href;
                        el.rel  = 'noopener noreferrer';
                        el.target = '_blank';
                    }
                }
                if ((tag === 'P' || tag === 'SPAN') && child.hasAttribute('style')) {
                    const raw = child.getAttribute('style');
                    const safe = raw.split(';')
                        .filter(rule => /^\s*(color|font-size)\s*:/i.test(rule))
                        .join(';');
                    if (safe) el.setAttribute('style', safe);
                }
                walk(child, el);
                destParent.appendChild(el);
            });
        }

        walk(doc.body, container);
    }

    function showHelpModal() {
        const old = document.getElementById('tm-copy-help-modal');
        if (old) old.remove();

        const curLang = GM_getValue(KEY_LANG, 'en');
        const curT = TR[curLang] || TR['en'];

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const C = dark ? {
            overlay: 'rgba(0,0,0,0.82)',
            panel:   '#16202b',
            text:    '#e7e9ea',
            border:  '#2f3336',
            sub:     '#8b98a5',
        } : {
            overlay: 'rgba(0,0,0,0.7)',
            panel:   '#ffffff',
            text:    '#333333',
            border:  '#eeeeee',
            sub:     '#536471',
        };

        const modal = document.createElement('div');
        modal.id = 'tm-copy-help-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: ${C.overlay}; z-index: 99999;
            display: flex; align-items: center; justify-content: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: ${C.panel}; color: ${C.text}; padding: 25px; border-radius: 12px;
            width: 90%; max-width: 500px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-family: sans-serif; line-height: 1.6; position: relative;
            max-height: 90vh; overflow-y: auto;
        `;

        const title = document.createElement('h2');
        title.textContent = curT.help_title;
        title.style.cssText = `margin-top: 0; border-bottom: 2px solid ${C.border}; padding-bottom: 10px; font-size: 1.2rem; color: ${C.text};`;

        const body = document.createElement('div');
        body.style.cssText = `font-size: 14px; color: ${C.text};`;
        sanitizeHelpHtml(curT.help_content, body);

        if (dark) {
            const style = document.createElement('style');
            style.textContent = `#tm-copy-help-modal code { background: #1e2732; border-radius: 4px; padding: 1px 5px; color: #8b98a5; }`;
            content.appendChild(style);
        }

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;
        closeBtn.style.cssText = `
            position: absolute; top: 10px; right: 12px; border: none; background: none;
            width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: ${C.sub}; border-radius: 5px;
        `;
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        content.appendChild(closeBtn);
        content.appendChild(title);
        content.appendChild(body);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    function showLangPickerModal() {
        const old = document.getElementById('tm-lang-picker-modal');
        if (old) old.remove();

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const C = dark ? {
            overlay:     'rgba(0,0,0,0.82)',
            panel:       '#16202b',
            text:        '#e7e9ea',
            sub:         '#8b98a5',
            border:      '#2f3336',
            rowBg:       '#1e2732',
            rowHover:    '#2d3741',
            activeBg:    '#1e3a4f',
            activeBorder:'#1d9bf0',
            activeText:  '#1d9bf0',
            customBg:    '#2b2510',
            customBorder:'#7a5c00',
            customText:  '#f4c430',
            customHover: '#332c10',
        } : {
            overlay:     'rgba(0,0,0,0.72)',
            panel:       '#ffffff',
            text:        '#0f1419',
            sub:         '#536471',
            border:      '#eff3f4',
            rowBg:       '#ffffff',
            rowHover:    '#f7f9f9',
            activeBg:    '#e8f5fe',
            activeBorder:'#1d9bf0',
            activeText:  '#1d9bf0',
            customBg:    '#fffbea',
            customBorder:'#e0a800',
            customText:  '#7a5700',
            customHover: '#fff8d6',
        };

        const LANG_MAP = [
            { code: 'en',    label: 'English' },
            { code: 'zh-TW', label: '繁體中文' },
            { code: 'zh-CN', label: '简体中文' },
            { code: 'ja',    label: '日本語' },
            { code: 'ko',    label: '한국어' },
            { code: 'es',    label: 'Español' },
            { code: 'pt-BR', label: 'Português (BR)' },
            { code: 'fr',    label: 'Français' },
            { code: 'ru',    label: 'Русский' },
        ];

        const currentCode = GM_getValue(KEY_LANG, 'en');

        const modal = document.createElement('div');
        modal.id = 'tm-lang-picker-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: ${C.overlay}; z-index: 999999;
            display: flex; align-items: center; justify-content: center;
            font-family: system-ui, -apple-system, sans-serif;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: ${C.panel}; color: ${C.text}; padding: 24px 20px 20px;
            border-radius: 16px; width: 92%; max-width: 420px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.35); position: relative;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;
        closeBtn.style.cssText = `
            position: absolute; top: 12px; right: 14px; border: none; background: none;
            width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: ${C.sub}; border-radius: 5px;
        `;
        closeBtn.onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };

        const title = document.createElement('h3');
        title.textContent = '🌐 ' + T.menu_lang.replace(/^🌐\s*/, '');
        title.style.cssText = `margin: 0 0 16px; font-size: 1rem; color: ${C.text}; padding-right: 24px;`;

        const list = document.createElement('div');
        list.style.cssText = 'display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;';

        const applyLang = (code) => {
            modal.remove();
            GM_setValue(KEY_LANG, code);
            GM_deleteValue(KEY_ONBOARDING_DONE);
            const newT = TR[code] || TR['en'];
            const confirmMsg = T.confirm_lang_reload.replace('{lang}', newT.langName);
            if (confirm(confirmMsg)) {
                location.reload();
            } else {
                showToast(newT.toast_lang_pending);
            }
        };

        LANG_MAP.forEach(({ code, label }) => {
            const btn = document.createElement('button');
            const isActive = (code === currentCode);
            btn.textContent = (isActive ? '★ ' : '') + label;
            btn.style.cssText = `
                width: 100%; padding: 9px 14px; border-radius: 9999px; text-align: left;
                border: 2px solid ${isActive ? C.activeBorder : C.border};
                background: ${isActive ? C.activeBg : C.rowBg};
                color: ${isActive ? C.activeText : C.text};
                font-size: 14px; font-weight: ${isActive ? '700' : '400'};
                cursor: pointer; transition: border-color 0.15s, background 0.15s;
            `;
            btn.onmouseenter = () => {
                if (!isActive) { btn.style.borderColor = C.sub; btn.style.background = C.rowHover; }
            };
            btn.onmouseleave = () => {
                if (!isActive) { btn.style.borderColor = C.border; btn.style.background = C.rowBg; }
            };
            btn.onclick = () => applyLang(code);
            list.appendChild(btn);
        });

        const hr = document.createElement('hr');
        hr.style.cssText = `border: none; border-top: 1px solid ${C.border}; margin: 4px 0 10px;`;

        const customBtn = document.createElement('button');
        const hasCustom = !!GM_getValue(KEY_CUSTOM_LANG, null);
        const isCustomActive = (currentCode === 'custom');
        customBtn.textContent = (isCustomActive ? '★ ' : '') + '✏️ Custom Language' + (hasCustom && !isCustomActive ? ' (loaded)' : '');
        customBtn.style.cssText = `
            width: 100%; padding: 9px 14px; border-radius: 9999px; text-align: left;
            border: 2px solid ${isCustomActive ? C.activeBorder : C.customBorder};
            background: ${isCustomActive ? C.activeBg : C.customBg};
            color: ${isCustomActive ? C.activeText : C.customText};
            font-size: 14px; font-weight: ${isCustomActive ? '700' : '500'};
            cursor: pointer; transition: border-color 0.15s, background 0.15s;
        `;
        customBtn.onmouseenter = () => {
            if (!isCustomActive) customBtn.style.background = C.customHover;
        };
        customBtn.onmouseleave = () => {
            if (!isCustomActive) customBtn.style.background = C.customBg;
        };
        customBtn.onclick = () => {
            modal.remove();
            showCustomLangPanel();
        };

        panel.appendChild(closeBtn);
        panel.appendChild(title);
        panel.appendChild(list);
        panel.appendChild(hr);
        panel.appendChild(customBtn);
        modal.appendChild(panel);
        document.body.appendChild(modal);
    }

    const CUSTOM_LANG_HOW_TO = [
        "English:       Export → translate the values → Import",
        "Deutsch:       Exportieren → Werte übersetzen → Importieren",
        "Français:      Exporter → traduire les valeurs → Importer",
        "Español:       Exportar → traducir los valores → Importar",
        "Italiano:      Esporta → traduci i valori → Importa",
        "Português:     Exportar → traduzir os valores → Importar",
        "Русский:       Экспорт → перевести значения → Импорт",
        "Українська:    Експорт → перекласти значення → Імпорт",
        "ภาษาไทย:       ส่งออก → แปลค่า → นำเข้า",
        "Türkçe:        Dışa aktar → değerleri çevir → İçe aktar",
        "Polski:        Eksportuj → przetłumacz wartości → Importuj",
        "Čeština:       Exportovat → přeložit hodnoty → Importovat",
        "Română:        Exportați → traduceți valorile → Importați",
        "Magyar:        Exportálás → értékek fordítása → Importálás",
        "Ελληνικά:      Εξαγωγή → μετάφραση τιμών → Εισαγωγή",
        "العربية:       تصدير ← ترجمة القيم ← استيراد",
        "עברית:         ייצוא ← תרגום הערכים ← ייבוא",
        "فارسی:         صادر کردن ← ترجمه مقادیر ← وارد کردن",
        "हिन्दी:        निर्यात → मान अनुवाद करें → आयात",
        "বাংলা:         রপ্তানি → মান অনুবাদ করুন → আমদানি",
        "Indonesia:     Ekspor → terjemahkan nilai → Impor",
        "Bahasa Melayu: Eksport → terjemah nilai → Import",
        "Filipino:      I-export → isalin ang mga halaga → I-import",
        "Tiếng Việt:    Xuất → dịch các giá trị → Nhập",
        "Nederlands:    Exporteren → waarden vertalen → Importeren",
        "Svenska:       Exportera → översätt värdena → Importera",
        "Kiswahili:     Hamisha → tafsiri maadili → Ingiza",
        "한국어:         내보내기 → 값 번역 → 가져오기",
        "日本語:         エクスポート → 値を翻訳 → インポート",
        "繁體中文:       匯出 → 翻譯內容 → 匯入",
        "简体中文:       导出 → 翻译内容 → 导入",
    ];

    function buildExportTemplate() {
        const base = Object.assign({}, TR['en']);
        const template = {
            _note: "Translate the VALUES only. Do NOT change the KEYS. Keep {placeholders} like {lang} untouched. Preserve HTML tags and emoji as-is. Set \"langName\" to your language's native name.",
            langName: "My Custom Language",
            menu_domain_click: base.menu_domain_click,
            menu_domain_long: base.menu_domain_long,
            menu_prefix: base.menu_prefix,
            menu_lang: base.menu_lang,
            menu_help: base.menu_help,
            prompt_prefix: base.prompt_prefix,
            prompt_lang: base.prompt_lang,
            prompt_domain: base.prompt_domain,
            status_default: base.status_default,
            status_custom: base.status_custom,
            btn_tooltip: base.btn_tooltip,
            link_tooltip: base.link_tooltip,
            link_tooltip_long: base.link_tooltip_long,
            msg_prefix_copied: base.msg_prefix_copied,
            msg_copied: base.msg_copied,
            msg_downloaded: base.msg_downloaded,
            msg_no_media: base.msg_no_media,
            play_btn_tooltip: base.play_btn_tooltip,
            btn_switch_to_video: base.btn_switch_to_video,
            btn_switch_to_image: base.btn_switch_to_image,
            msg_no_video: base.msg_no_video,
            reload_msg: base.reload_msg,
            toast_domain_click: base.toast_domain_click,
            toast_domain_long: base.toast_domain_long,
            toast_prefix: base.toast_prefix,
            toast_date_fmt: base.toast_date_fmt,
            toast_lang_pending: base.toast_lang_pending,
            confirm_lang_reload: base.confirm_lang_reload,
            menu_date_format: base.menu_date_format,
            status_date_asian: base.status_date_asian,
            status_date_western: base.status_date_western,
            menu_feedback_style: base.menu_feedback_style,
            status_feedback_toast: base.status_feedback_toast,
            status_feedback_icon: base.status_feedback_icon,
            status_feedback_silent: base.status_feedback_silent,
            status_feedback_pulse: base.status_feedback_pulse,
            status_feedback_flash: base.status_feedback_flash,
            status_feedback_slide: base.status_feedback_slide,
            status_on:  base.status_on,
            status_off: base.status_off,
            toast_feedback_style: base.toast_feedback_style,
            help_title: base.help_title,
            help_content: base.help_content.trim(),
            onboard_title: base.onboard_title,
            onboard_body:  base.onboard_body,
            onboard_got_it: base.onboard_got_it,
            onboard_step1_title: base.onboard_step1_title,
            onboard_step1_body:  base.onboard_step1_body,
            onboard_next: base.onboard_next,
        };
        return template;
    }

    function showCustomLangPanel() {
        const old = document.getElementById('tm-custom-lang-modal');
        if (old) old.remove();

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const C = dark ? {
            overlay:      'rgba(0,0,0,0.82)',
            panel:        '#16202b',
            text:         '#e7e9ea',
            sub:          '#8b98a5',
            border:       '#2f3336',
            guideBg:      '#1e2732',
            guideText:    '#8b98a5',
            exportBorder: '#1d9bf0',
            exportText:   '#1d9bf0',
            exportBg:     '#16202b',
            exportHover:  '#1e2f3f',
            importBg:     '#1d9bf0',
            importHover:  '#1a8cd8',
            clearBorder:  '#e0245e',
            clearText:    '#e0245e',
            clearBg:      '#16202b',
            clearHover:   '#2a1520',
        } : {
            overlay:      'rgba(0,0,0,0.75)',
            panel:        '#ffffff',
            text:         '#0f1419',
            sub:          '#536471',
            border:       '#eff3f4',
            guideBg:      '#f7f9f9',
            guideText:    '#536471',
            exportBorder: '#1d9bf0',
            exportText:   '#1d9bf0',
            exportBg:     '#ffffff',
            exportHover:  '#e8f5fe',
            importBg:     '#1d9bf0',
            importHover:  '#1a8cd8',
            clearBorder:  '#e0245e',
            clearText:    '#e0245e',
            clearBg:      '#ffffff',
            clearHover:   '#fdf0f2',
        };

        const existingJson = GM_getValue(KEY_CUSTOM_LANG, null);
        const hasCustom = !!existingJson;

        const modal = document.createElement('div');
        modal.id = 'tm-custom-lang-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: ${C.overlay}; z-index: 999999;
            display: flex; align-items: center; justify-content: center;
            font-family: system-ui, -apple-system, sans-serif;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: ${C.panel}; color: ${C.text}; padding: 28px 28px 24px;
            border-radius: 16px; width: 95%; max-width: 640px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.35); position: relative;
            max-height: 90vh; overflow-y: auto;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;
        closeBtn.style.cssText = `
            position: absolute; top: 12px; right: 14px; border: none; background: none;
            width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: ${C.sub}; border-radius: 5px;
        `;
        closeBtn.onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };

        const title = document.createElement('h3');
        title.textContent = '✏️ Custom Language';
        title.style.cssText = `margin: 0 0 6px; font-size: 1.1rem; color: ${C.text};`;

        const statusLine = document.createElement('p');
        statusLine.style.cssText = `margin: 0 0 16px; font-size: 13px; color: ${C.sub};`;

        if (hasCustom) {
            try {
                const parsed = JSON.parse(existingJson);
                statusLine.textContent = '';
                const starText = document.createTextNode('★ Active: ');
                const boldEl   = document.createElement('b');
                boldEl.textContent = parsed.langName || 'Custom';
                statusLine.appendChild(starText);
                statusLine.appendChild(boldEl);
                statusLine.style.color = '#1d9bf0';
            } catch(e) {
                statusLine.textContent = '⚠️ Saved data is corrupted.';
                statusLine.style.color = '#e0245e';
            }
        } else {
            statusLine.textContent = 'No custom language loaded.';
        }

        const hr = document.createElement('hr');
        hr.style.cssText = `border: none; border-top: 1px solid ${C.border}; margin: 0 0 12px;`;

        const guideBox = document.createElement('div');
        guideBox.style.cssText = `
            background: ${C.guideBg}; border: 1px solid ${C.border}; border-radius: 8px;
            padding: 10px 14px; margin-bottom: 16px;
            font-size: 12px; font-family: monospace; line-height: 1.8;
            color: ${C.guideText}; white-space: pre;
        `;
        guideBox.textContent = CUSTOM_LANG_HOW_TO.join('\n');

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap;';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '📤 Export Template';
        exportBtn.style.cssText = `
            flex: 1; min-width: 140px; padding: 10px 16px; border-radius: 9999px;
            border: 2px solid ${C.exportBorder}; background: ${C.exportBg}; color: ${C.exportText};
            font-size: 14px; font-weight: 700; cursor: pointer;
            transition: background 0.15s;
        `;
        exportBtn.onmouseenter = () => { exportBtn.style.background = C.exportHover; };
        exportBtn.onmouseleave = () => { exportBtn.style.background = C.exportBg; };
        exportBtn.onclick = () => {
            const template = buildExportTemplate();
            const jsonStr = JSON.stringify(template, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'twitter-media-copy-custom-lang.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            showToast('📤 Template exported!');
        };

        const importBtn = document.createElement('button');
        importBtn.textContent = '📥 Import Translation';
        importBtn.style.cssText = `
            flex: 1; min-width: 140px; padding: 10px 16px; border-radius: 9999px;
            border: none; background: ${C.importBg}; color: #fff;
            font-size: 14px; font-weight: 700; cursor: pointer;
            transition: background 0.15s;
        `;
        importBtn.onmouseenter = () => { importBtn.style.background = C.importHover; };
        importBtn.onmouseleave = () => { importBtn.style.background = C.importBg; };
        importBtn.onclick = () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json,application/json';
            fileInput.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => {
                    try {
                        const parsed = JSON.parse(ev.target.result);
                        if (!parsed.langName) throw new Error('Missing "langName" field.');
                        const merged = Object.assign({}, TR['en'], parsed);
                        delete merged._note;
                        GM_setValue(KEY_CUSTOM_LANG, JSON.stringify(merged));
                        GM_setValue(KEY_LANG, 'custom');
                        GM_deleteValue(KEY_ONBOARDING_DONE);
                        TR['custom'] = merged;
                        modal.remove();
                        showToast(`✅ Loaded: ${merged.langName}`);
                        if (confirm(`Custom language "${merged.langName}" loaded.\nReload page now to apply?`)) {
                            location.reload();
                        }
                    } catch(err) {
                        alert(`❌ Import failed: ${err.message}\n\nMake sure the file is valid JSON and contains a "langName" field.`);
                    }
                };
                reader.readAsText(file, 'UTF-8');
            };
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        };

        btnRow.appendChild(exportBtn);
        btnRow.appendChild(importBtn);
        panel.appendChild(closeBtn);
        panel.appendChild(title);
        panel.appendChild(statusLine);
        panel.appendChild(hr);
        panel.appendChild(guideBox);
        panel.appendChild(btnRow);

        if (hasCustom) {
            const clearBtn = document.createElement('button');
            clearBtn.textContent = '🗑️ Clear Custom';
            clearBtn.style.cssText = `
                width: 100%; margin-top: 10px; padding: 9px 16px; border-radius: 9999px;
                border: 2px solid ${C.clearBorder}; background: ${C.clearBg}; color: ${C.clearText};
                font-size: 13px; font-weight: 600; cursor: pointer;
                transition: background 0.15s;
            `;
            clearBtn.onmouseenter = () => { clearBtn.style.background = C.clearHover; };
            clearBtn.onmouseleave = () => { clearBtn.style.background = C.clearBg; };
            clearBtn.onclick = () => {
                if (!confirm('Remove custom language and revert to English?')) return;
                GM_deleteValue(KEY_CUSTOM_LANG);
                GM_setValue(KEY_LANG, 'en');
                delete TR['custom'];
                modal.remove();
                showToast('🗑️ Custom language cleared.');
                if (confirm('Reverted to English.\nReload page now?')) location.reload();
            };
            panel.appendChild(clearBtn);
        }

        modal.appendChild(panel);
        document.body.appendChild(modal);
    }

    function selectDomain(key) {
        let msg = T.prompt_domain;
        DOMAIN_LIST.forEach((d, index) => {
            msg += `${index + 1}. ${d}\n`;
        });
        const input = prompt(msg, "");
        if (input !== null) {
            const index = parseInt(input.trim()) - 1;
            if (!isNaN(index) && DOMAIN_LIST[index]) {
                GM_setValue(key, DOMAIN_LIST[index]);
                return true;
            } else if (input.trim() !== "") {
                const cleanDomain = input.trim();
                if (/^[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}(\.[a-zA-Z0-9\-]{1,63})*\.[a-zA-Z]{2,}$/.test(cleanDomain)) {
                    GM_setValue(key, cleanDomain);
                    return true;
                } else {
                    alert(`Invalid domain: "${cleanDomain}"\nPlease enter a plain domain (e.g. fixupx.com), without http:// or paths.`);
                }
            }
        }
        return false;
    }

    let menuIds = [];
    function registerMenus() {
        menuIds.forEach(id => GM_unregisterMenuCommand(id));
        menuIds = [];

        const currentPrefix = GM_getValue(KEY_PREFIX_TEXT, '[text]');
        const clickCustom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false);
        const clickDomain = GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com');
        const clickStatusText = clickCustom ? `${T.status_custom} (${clickDomain})` : T.status_default;

        menuIds.push(GM_registerMenuCommand(T.menu_domain_click + ` [${clickStatusText}]`, () => {
            if (!clickCustom) {
                if(selectDomain(KEY_LINK_DOMAIN_CLICK)) {
                    GM_setValue(KEY_CLICK_MODE_CUSTOM, true);
                    const newDomain = GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com');
                    showToast(T.toast_domain_click + newDomain);
                    registerMenus();
                }
            } else {
                GM_setValue(KEY_CLICK_MODE_CUSTOM, false);
                showToast(T.toast_domain_click + 'x.com');
                registerMenus();
            }
        }));

        menuIds.push(GM_registerMenuCommand(T.menu_prefix + ` (${currentPrefix})`, () => {
            const newPrefix = prompt(T.prompt_prefix, currentPrefix);
            if (newPrefix !== null) {
                GM_setValue(KEY_PREFIX_TEXT, newPrefix);
                showToast(T.toast_prefix + (newPrefix || '(empty)'));
                registerMenus();
            }
        }));

        menuIds.push(GM_registerMenuCommand(T.menu_lang + ` [${T.langName}]`, () => {
            showLangPickerModal();
        }));

        const currentFmt = GM_getValue(KEY_DATE_FORMAT, 'asian');
        const fmtStatusText = currentFmt === 'western' ? T.status_date_western : T.status_date_asian;
        menuIds.push(GM_registerMenuCommand(T.menu_date_format + ` [${fmtStatusText}]`, () => {
            const newFmt = currentFmt === 'western' ? 'asian' : 'western';
            GM_setValue(KEY_DATE_FORMAT, newFmt);
            _refreshDateFormatCache();
            const newLabel = newFmt === 'western' ? T.status_date_western : T.status_date_asian;
            showToast(T.toast_date_fmt + newLabel);
            registerMenus();
        }));

        menuIds.push(GM_registerMenuCommand(T.menu_help, showHelpModal));

        menuIds.push(GM_registerMenuCommand('⚙️ Open Settings Panel', () => {
            const wrapper = document.getElementById('tm-settings-wrapper');
            if (!wrapper) return;
            wrapper.style.display = '';
            wrapper.setAttribute('data-open', 'true');
            const panel = document.getElementById('tm-settings-panel');
            if (panel) panel.style.display = 'block';
        }));

        menuIds.push(GM_registerMenuCommand('📋 Open History Panel', () => {
            showHistoryPanel();
        }));

        const gearVisible = GM_getValue(KEY_GEAR_VISIBLE, true);
        const gearStatusText = gearVisible ? 'Visible' : 'Hidden';
        menuIds.push(GM_registerMenuCommand(`👁 Corner Buttons [${gearStatusText}]`, () => {
            const next = !GM_getValue(KEY_GEAR_VISIBLE, true);
            GM_setValue(KEY_GEAR_VISIBLE, next);
            const wrapper = document.getElementById('tm-settings-wrapper');
            if (wrapper) wrapper.style.display = next ? '' : 'none';
            showToast(next ? '👁 Corner buttons: Visible' : '👁 Corner buttons: Hidden');
            registerMenus();
        }));
    }
    registerMenus();

    const _isTwitterDomain = ['twitter.com', 'x.com'].includes(location.hostname);

    let _lcRcResizeHandler = null;
    function _applyGearCorner(corner) {
        const wrapper = document.getElementById('tm-settings-wrapper');
        if (!wrapper) return;
        const wMap = {
            tr: { top: '12px',  right: '12px', bottom: 'auto', left: 'auto'  },
            tl: { top: '12px',  right: 'auto', bottom: 'auto', left: '12px'  },
            br: { top: 'auto',  right: '12px', bottom: '12px', left: 'auto'  },
            bl: { top: 'auto',  right: 'auto', bottom: '12px', left: '12px'  },
            tc: { top: '12px',  right: 'auto', bottom: 'auto', left: '50%'   },
            bc: { top: 'auto',  right: 'auto', bottom: '12px', left: '50%'   },
            lc: { top: '50%',   right: 'auto', bottom: 'auto', left: '12px'  },
            rc: { top: '50%',   right: '12px', bottom: 'auto', left: 'auto'  },
            cc: { top: '50%',   right: 'auto', bottom: 'auto', left: '50%'   },
        };
        const wPos = wMap[corner] || wMap['tr'];
        wrapper.style.top    = wPos.top;
        wrapper.style.right  = wPos.right;
        wrapper.style.bottom = wPos.bottom;
        wrapper.style.left   = wPos.left;
        wrapper.style.transform = (corner === 'tc' || corner === 'bc') ? 'translateX(-50%)'
                                : (corner === 'lc' || corner === 'rc') ? 'translateY(-50%)'
                                : (corner === 'cc')                    ? 'translate(-50%, -50%)'
                                : '';

        const panel = document.getElementById('tm-settings-panel');
        if (!panel) return;
        const isBottom = corner === 'br' || corner === 'bl' || corner === 'bc';
        const isLeft   = corner === 'tl' || corner === 'bl' || corner === 'lc';
        const isCenter = corner === 'tc' || corner === 'bc' || corner === 'cc';
        panel.style.top         = isBottom ? 'auto' : 'calc(100% - 21px)';
        panel.style.bottom      = isBottom ? 'calc(100% - 21px)' : 'auto';
        panel.style.right       = isLeft   ? 'auto' : isCenter ? 'auto' : '4px';
        panel.style.left        = isLeft   ? '4px'  : isCenter ? '50%'  : 'auto';
        panel.style.transform = '';
        panel.classList.toggle('tm-panel-hcenter', isCenter);
        panel.classList.toggle('tm-panel-bottom',  isCenter && isBottom);
        if (corner === 'lc') { panel.style.left = '100%'; panel.style.right = 'auto'; }
        if (corner === 'rc') { panel.style.right = '100%'; panel.style.left = 'auto'; }
        panel.style.transformOrigin = (isBottom ? 'bottom' : 'top') + ' ' + (isLeft ? 'left' : isCenter ? 'center' : 'right');

        if (corner === 'lc' || corner === 'rc' || corner === 'cc') {
            const _calcLcRcPos = () => {
                const vpH2    = window.innerHeight;
                const wH2     = wrapper.offsetHeight || 50;
                const pH2     = panel.scrollHeight   || 540;
                const maxH2   = Math.min(pH2, vpH2 - 20);
                const wTVP2   = vpH2 / 2 - wH2 / 2;
                const pTVP2   = Math.max(8, Math.min((vpH2 - maxH2) / 2, vpH2 - maxH2 - 8));
                panel.style.top       = Math.round(pTVP2 - wTVP2) + 'px';
                panel.style.maxHeight = maxH2 + 'px';
                panel.style.overflowY = pH2 > maxH2 ? 'auto' : '';
            };
            _calcLcRcPos();
            if (corner !== 'cc') {
                panel.style.transformOrigin = 'center ' + (corner === 'lc' ? 'left' : 'right');
            }
            const _hdr = panel.querySelector('.tm-sp-header');
            if (_hdr) { _hdr.style.position = 'sticky'; _hdr.style.top = '0'; _hdr.style.zIndex = '2'; }
            if (_lcRcResizeHandler) window.removeEventListener('resize', _lcRcResizeHandler);
            _lcRcResizeHandler = _calcLcRcPos;
            window.addEventListener('resize', _lcRcResizeHandler, { passive: true });
        } else {
            if (_lcRcResizeHandler) {
                window.removeEventListener('resize', _lcRcResizeHandler);
                _lcRcResizeHandler = null;
            }
            const _hdr = panel.querySelector('.tm-sp-header');
            if (_hdr) { _hdr.style.position = ''; _hdr.style.top = ''; _hdr.style.zIndex = ''; }
            panel.style.maxHeight = '';
            panel.style.overflowY = '';
        }
    }

    function _triggerLoadRing() {
        setTimeout(() => {
            const gear = document.getElementById('tm-settings-gear-btn');
            const wrapper = document.getElementById('tm-settings-wrapper');
            const ref = gear ? gear.getBoundingClientRect() : wrapper?.getBoundingClientRect();
            if (!ref) return;
            const cx = ref.left + ref.width  / 2;
            const cy = ref.top  + ref.height / 2;
            if (cx === 0 && cy === 0) return;
            const ring = document.createElement('div');
            ring.className = 'tm-load-ring';
            ring.style.cssText = `left:${Math.round(cx - 26)}px; top:${Math.round(cy - 26)}px;`;
            document.body.appendChild(ring);
            setTimeout(() => ring.remove(), 2000);
        }, 600);
    }

    let _cornerAnimEndHandler = null;

    function _animateWrapperToCorner(corner) {
        const wrapper = document.getElementById('tm-settings-wrapper');
        if (!wrapper) { _applyGearCorner(corner); return; }

        _applyGearCorner(corner);

        const gear = document.getElementById('tm-settings-gear-btn');
        const ref  = gear ? gear.getBoundingClientRect() : wrapper.getBoundingClientRect();
        const cx   = ref.left + ref.width  / 2;
        const cy   = ref.top  + ref.height / 2;

        const pulse = document.createElement('div');
        pulse.className = 'tm-corner-pulse';
        pulse.style.cssText = `left:${Math.round(cx - 38)}px; top:${Math.round(cy - 38)}px;`;

        const RING_TOTAL = 6;
        let doneCount = 0;
        [0, 150, 300, 900, 1050, 1200].forEach(delay => {
            const ring = document.createElement('div');
            ring.className = 'tm-pulse-ring';
            ring.style.animationDelay = delay + 'ms';
            ring.addEventListener('animationend', () => {
                doneCount++;
                if (doneCount === RING_TOTAL) pulse.remove();
            }, { once: true });
            pulse.appendChild(ring);
        });

        document.body.appendChild(pulse);
    }

    function _initSettingsPanel() {
        const _applyGearVisibility = () => {
            const wrapper = document.getElementById('tm-settings-wrapper');
            if (wrapper && !GM_getValue(KEY_GEAR_VISIBLE, true)) {
                wrapper.style.display = 'none';
            }
        };
        if (document.body) {
            createSettingsPanel();
            _applyGearVisibility();
            _applyGearCorner(GM_getValue(KEY_GEAR_CORNER, 'tr'));
            _triggerLoadRing();
            if (_isTwitterDomain) _initStarPip();
            if (GM_getValue(KEY_HIST_PINNED, false)) setTimeout(showHistoryPanel, 800);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                createSettingsPanel();
                _applyGearVisibility();
                _applyGearCorner(GM_getValue(KEY_GEAR_CORNER, 'tr'));
                _triggerLoadRing();
                if (_isTwitterDomain) _initStarPip();
                if (GM_getValue(KEY_HIST_PINNED, false)) setTimeout(showHistoryPanel, 800);
            }, { once: true });
        }
    }

    function _initStarPip() {
        if (document.getElementById('tm-star-pip')) return;

        const pip = document.createElement('button');
        pip.id        = 'tm-star-pip';
        pip.className = 'tm-star-pip';
        pip.title     = 'Group this download';
        pip.textContent = '⭐';

        pip.addEventListener('mouseenter', () => {
            if (!_fanOpen && getGroups().length) openGroupFan();
        });
        pip.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            if (_fanOpen) closeGroupFan(); else openGroupFan();
        });
        document.body.appendChild(pip);
    }

    function showOnboardingOverlay() {
        if (GM_getValue(KEY_ONBOARDING_DONE, false)) return;

        const wrapperEl = document.getElementById('tm-settings-wrapper');
        const gearEl    = document.getElementById('tm-settings-gear-btn');
        if (!wrapperEl || !gearEl) { setTimeout(showOnboardingOverlay, 400); return; }

        const obStyle = document.createElement('style');
        obStyle.id = 'tm-ob-style';
        obStyle.textContent = `
            @keyframes tm-ob-pulse-ring {
                0%   { transform:translate(-50%,-50%) scale(1);    opacity:0.9; }
                70%  { transform:translate(-50%,-50%) scale(1.55); opacity:0;   }
                100% { transform:translate(-50%,-50%) scale(1.55); opacity:0;   }
            }
            @keyframes tm-ob-fadein { from { opacity:0; } to { opacity:1; } }
            @keyframes tm-ob-card-in {
                from { opacity:0; transform:translateY(10px) scale(0.96); }
                to   { opacity:1; transform:translateY(0)    scale(1);    }
            }
            #tm-ob-overlay {
                position:fixed; inset:0; z-index:999985;
                pointer-events:all;
                animation: tm-ob-fadein 0.45s ease forwards;
            }
            #tm-ob-ring {
                position:fixed; border-radius:50%; pointer-events:none;
                border: 2px solid rgba(29,155,240,0.85);
                animation: tm-ob-pulse-ring 1.7s cubic-bezier(0.215,0.61,0.355,1) infinite;
                z-index:999988;
            }
            #tm-ob-card {
                position:fixed; z-index:999989;
                animation: tm-ob-card-in 0.4s 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
                pointer-events:all;
            }
            #tm-ob-got-it {
                width:100%; padding:9px; border-radius:9999px;
                border:none; background:#1d9bf0; color:#fff;
                font-size:14px; font-weight:700; cursor:pointer;
                text-align:center; display:block; transition:background 0.15s;
            }
            #tm-ob-got-it:hover { background:#1a8cd8; }
            #tm-ob-next {
                width:100%; padding:9px; border-radius:9999px;
                border:none; background:rgba(29,155,240,.15); color:#1d9bf0;
                font-size:14px; font-weight:700; cursor:pointer;
                text-align:center; display:block; margin-bottom:8px;
                transition:background 0.15s;
            }
            #tm-ob-next:hover { background:rgba(29,155,240,.26); }
            .tm-ob-dots { display:flex; gap:5px; justify-content:center; margin-bottom:12px; }
            .tm-ob-dot  { width:6px; height:6px; border-radius:50%; display:inline-block; }
        `;
        document.head.appendChild(obStyle);

        const dark     = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const cardBg   = dark ? '#16202b' : '#ffffff';
        const cardText = dark ? '#e7e9ea' : '#0f1419';
        const cardSub  = dark ? '#8b98a5' : '#536471';
        const arrowClr = dark ? '#16202b' : '#ffffff';
        const cardW    = 280;

        let _overlay, _ring, _card;

        const _mkOverlay = (cx, cy, r1, r2) => {
            const el = document.createElement('div');
            el.id = 'tm-ob-overlay';
            el.style.background = cx !== null
                ? `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r1}px, rgba(0,0,0,0.80) ${r2}px)`
                : 'rgba(0,0,0,0.78)';
            return el;
        };

        const _mkRing = (cx, cy, r1) => {
            if (cx === null) return null;
            const el = document.createElement('div');
            el.id = 'tm-ob-ring';
            el.style.cssText = `width:${r1*2}px;height:${r1*2}px;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);`;
            return el;
        };

        const _mkCard = (left, top, arrowRight) => {
            const el = document.createElement('div');
            el.id = 'tm-ob-card';
            el.style.cssText = `
                width:${cardW}px; left:${left}px; top:${top}px;
                background:${cardBg}; border-radius:14px;
                box-shadow:0 8px 32px rgba(0,0,0,0.32);
                padding:18px 18px 14px;
            `;
            if (arrowRight !== null) {
                const a = document.createElement('div');
                a.style.cssText = `
                    position:absolute; top:-10px; right:${arrowRight}px; width:0; height:0;
                    border-left:10px solid transparent; border-right:10px solid transparent;
                    border-bottom:10px solid ${arrowClr};
                `;
                el.appendChild(a);
            }
            return el;
        };

        const _mkDots = (active) => {
            const d = document.createElement('div');
            d.className = 'tm-ob-dots';
            [0, 1].forEach(i => {
                const s = document.createElement('span');
                s.className = 'tm-ob-dot';
                s.style.background = i === active ? '#1d9bf0' : 'rgba(29,155,240,.3)';
                d.appendChild(s);
            });
            return d;
        };

        const _fadeOut = (els, cb) => {
            els.filter(Boolean).forEach(el => {
                el.style.transition = 'opacity 0.2s ease';
                el.style.opacity = '0';
            });
            setTimeout(cb, 230);
        };

        const _cleanup = () => {
            [_overlay, _ring, _card, obStyle].forEach(el => el?.remove());
            wrapperEl.style.removeProperty('opacity');
            wrapperEl.style.removeProperty('transition');
        };

        function renderStep1() {
            const btn = document.querySelector(`article .${BUTTON_CLASS}`);
            let cx = null, cy = null, r1 = 0, r2 = 0, arrowRight = null;
            let cardLeft, cardTop;

            if (btn) {
                const rect = btn.getBoundingClientRect();
                cx = rect.left + rect.width  / 2;
                cy = rect.top  + rect.height / 2;
                r1 = Math.max(rect.width, rect.height) / 2 + 14;
                r2 = r1 + 20;
                cardLeft = Math.max(8, Math.min(cx - cardW / 2, window.innerWidth - cardW - 8));
                const spaceBelow = window.innerHeight - (cy + r2 + 10);
                cardTop = spaceBelow >= 190 ? cy + r2 + 10
                                             : Math.max(8, cy - r2 - 200);
            } else {
                cardTop  = Math.round(window.innerHeight * 0.30);
                cardLeft = Math.max(8, Math.min(Math.round(window.innerWidth / 2 - cardW / 2),
                                                window.innerWidth - cardW - 8));
            }

            _overlay = _mkOverlay(cx, cy, r1, r2);
            _ring    = _mkRing(cx, cy, r1);
            _card    = _mkCard(cardLeft, cardTop, arrowRight);

            const titleEl = document.createElement('div');
            titleEl.style.cssText = `font-size:15px;font-weight:700;color:${cardText};margin-bottom:8px;`;
            titleEl.textContent = T.onboard_step1_title || '📋 Twitter / X — Media Buttons';

            const bodyEl = document.createElement('div');
            bodyEl.style.cssText = `font-size:13px;color:${cardSub};line-height:1.55;margin-bottom:14px;`;
            bodyEl.textContent = T.onboard_step1_body ||
                'This script adds a Copy button and a Download button directly to every tweet with photos or videos. Hover any media tweet to see them in the action bar.';

            const nextBtn = document.createElement('button');
            nextBtn.id = 'tm-ob-next';
            nextBtn.textContent = T.onboard_next || 'Next →';
            nextBtn.addEventListener('click', e => {
                e.stopPropagation();
                _fadeOut([_overlay, _ring, _card], () => {
                    _overlay?.remove(); _ring?.remove(); _card?.remove();
                    renderStep2();
                });
            });

            _card.appendChild(titleEl);
            _card.appendChild(bodyEl);
            _card.appendChild(_mkDots(0));
            _card.appendChild(nextBtn);

            document.body.appendChild(_overlay);
            if (_ring) document.body.appendChild(_ring);
            document.body.appendChild(_card);
            _overlay.addEventListener('click', () => nextBtn.click());
        }

        function renderStep2() {
            wrapperEl.style.setProperty('opacity', '1', 'important');
            wrapperEl.style.setProperty('transition', 'none', 'important');

            const rect = wrapperEl.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const r1 = Math.ceil(Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2)) + 10;
            const r2 = r1 + 20;

            const cardLeft = Math.max(8, Math.min(cx - cardW / 2, window.innerWidth - cardW - 8));
            const cardTop  = cy + r2 + 10;

            _overlay = _mkOverlay(cx, cy, r1, r2);
            _ring    = _mkRing(cx, cy, r1);
            _card    = _mkCard(cardLeft, cardTop, 16);

            const titleEl = document.createElement('div');
            titleEl.style.cssText = `font-size:15px;font-weight:700;color:${cardText};margin-bottom:8px;`;
            titleEl.textContent = T.onboard_title || '⚙ Settings Panel';

            const bodyEl = document.createElement('div');
            bodyEl.style.cssText = `font-size:13px;color:${cardSub};line-height:1.55;margin-bottom:14px;`;
            bodyEl.textContent = T.onboard_body ||
                'Hover the top-right corner to reveal the settings button. Click it to quickly manage domains, prefix, language and more.';

            const gotItBtn = document.createElement('button');
            gotItBtn.id = 'tm-ob-got-it';
            gotItBtn.textContent = T.onboard_got_it || 'Got it!';
            gotItBtn.addEventListener('click', e => {
                e.stopPropagation();
                GM_setValue(KEY_ONBOARDING_DONE, true);
                _fadeOut([_overlay, _ring, _card], () => {
                    _cleanup();
                    setTimeout(showHistoryPanel, 150);
                });
            });

            _card.appendChild(titleEl);
            _card.appendChild(bodyEl);
            _card.appendChild(_mkDots(1));
            _card.appendChild(gotItBtn);

            document.body.appendChild(_overlay);
            document.body.appendChild(_ring);
            document.body.appendChild(_card);
            _overlay.addEventListener('click', () => {
                GM_setValue(KEY_ONBOARDING_DONE, true);
                _fadeOut([_overlay, _ring, _card], () => {
                    _cleanup();
                    setTimeout(showHistoryPanel, 150);
                });
            });
        }

        renderStep1();
    }

    setTimeout(showOnboardingOverlay, 1200);
    _initSettingsPanel();

    function showDomainPickerModal(key, onSuccess) {
        const old = document.getElementById('tm-domain-picker-modal');
        if (old) old.remove();

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const C = dark ? {
            overlay: 'rgba(0,0,0,0.82)', panel: '#16202b', text: '#e7e9ea',
            sub: '#8b98a5', border: '#2f3336', rowBg: '#1e2732',
            rowHover: '#2d3741', activeBg: '#1e3a4f',
            activeBorder: '#1d9bf0', activeText: '#1d9bf0',
        } : {
            overlay: 'rgba(0,0,0,0.72)', panel: '#ffffff', text: '#0f1419',
            sub: '#536471', border: '#eff3f4', rowBg: '#ffffff',
            rowHover: '#f7f9f9', activeBg: '#e8f5fe',
            activeBorder: '#1d9bf0', activeText: '#1d9bf0',
        };

        const currentVal = GM_getValue(key, 'x.com');

        const modal = document.createElement('div');
        modal.id = 'tm-domain-picker-modal';
        modal.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:${C.overlay};z-index:9999999;
            display:flex;align-items:center;justify-content:center;
            font-family:system-ui,-apple-system,sans-serif;
        `;
        const panel = document.createElement('div');
        panel.style.cssText = `
            background:${C.panel};color:${C.text};padding:22px 18px 18px;
            border-radius:16px;width:92%;max-width:360px;
            box-shadow:0 8px 32px rgba(0,0,0,0.35);position:relative;
        `;
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;
        closeBtn.style.cssText = `position:absolute;top:12px;right:14px;border:none;
            background:none;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:${C.sub};border-radius:5px;`;
        closeBtn.onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };

        const title = document.createElement('h3');
        title.textContent = T.menu_domain_click.replace(/^🔗\s*/, '');
        title.style.cssText = `margin:0 0 14px;font-size:0.95rem;color:${C.text};padding-right:24px;`;

        const list = document.createElement('div');
        list.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

        DOMAIN_LIST.forEach(domain => {
            const isActive = domain === currentVal;
            const btn = document.createElement('button');
            btn.textContent = (isActive ? '★ ' : '') + domain;
            btn.style.cssText = `
                width:100%;padding:8px 14px;border-radius:9999px;text-align:left;
                border:2px solid ${isActive ? C.activeBorder : C.border};
                background:${isActive ? C.activeBg : C.rowBg};
                color:${isActive ? C.activeText : C.text};
                font-size:13px;font-weight:${isActive ? '700' : '400'};
                cursor:pointer;transition:border-color 0.15s,background 0.15s;
            `;
            btn.onmouseenter = () => { if (!isActive) { btn.style.borderColor = C.sub; btn.style.background = C.rowHover; } };
            btn.onmouseleave = () => { if (!isActive) { btn.style.borderColor = C.border; btn.style.background = C.rowBg; } };
            btn.onclick = () => {
                GM_setValue(key, domain);
                modal.remove();
                if (onSuccess) onSuccess(domain);
            };
            list.appendChild(btn);
        });

        panel.appendChild(closeBtn);
        panel.appendChild(title);
        panel.appendChild(list);
        modal.appendChild(panel);
        document.body.appendChild(modal);
    }

    function isFeatureNew(id) {
        if (!NEW_FEATURE_IDS.includes(id)) return false;
        try {
            const seen = JSON.parse(GM_getValue(KEY_SEEN_FEATURES, '[]'));
            return !seen.includes(id);
        } catch(_) { return true; }
    }

    function markFeatureSeen(id) {
        try {
            const seen = JSON.parse(GM_getValue(KEY_SEEN_FEATURES, '[]'));
            if (!seen.includes(id)) {
                seen.push(id);
                GM_setValue(KEY_SEEN_FEATURES, JSON.stringify(seen));
            }
        } catch(_) {}
    }

    function createSettingsPanel() {
        const existingWrapper = document.getElementById('tm-settings-wrapper');
        if (existingWrapper) existingWrapper.remove();
        const existingStyle = document.getElementById('tm-settings-panel-style');
        if (existingStyle) existingStyle.remove();

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const C = dark ? {
            panel:     '#16202b',
            header:    '#1e2732',
            text:      '#e7e9ea',
            sub:       '#8b98a5',
            border:    '#2f3336',
            rowHover:  '#1e2732',
            badge:     '#1d9bf0',
            gearFg:    '#e7e9ea',
            gearBg:    'rgba(255,255,255,0.08)',
        } : {
            panel:     '#ffffff',
            header:    '#f7f9f9',
            text:      '#0f1419',
            sub:       '#536471',
            border:    '#eff3f4',
            rowHover:  '#f7f9f9',
            badge:     '#1d9bf0',
            gearFg:    '#536471',
            gearBg:    'rgba(0,0,0,0.06)',
        };

        const panelStyle = document.createElement('style');
        panelStyle.id = 'tm-settings-panel-style';
        panelStyle.textContent = `
            
            #tm-settings-wrapper {
                position: fixed; top: 12px; right: 12px; z-index: 999990;
                width: 90px; height: 50px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #tm-settings-wrapper:hover, #tm-settings-wrapper[data-open="true"] {
                opacity: 1;
            }
            #tm-settings-wrapper:hover #tm-dismiss-btn,
            #tm-settings-wrapper:hover #tm-refresh-hist-btn {
                opacity: 1 !important;
            }

            #tm-history-btn {
                position: absolute; right: 28px; top: 2px;
                width: 44px; height: 44px;
                border-radius: 50%; border: none; background: transparent;
                cursor: pointer; padding: 0;
                display: flex; align-items: center; justify-content: center;
                color: ${C.gearFg};
                z-index: 3; opacity: 1;
                transform: scale(1) translateX(0);
                transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            #tm-history-btn svg { width: 24px; height: 24px; display: block; }

            #tm-settings-gear-btn {
                position: absolute; right: 4px; top: 6px;
                width: 36px; height: 36px;
                border-radius: 50%; border: none; background: transparent;
                cursor: pointer; padding: 0;
                display: flex; align-items: center; justify-content: center;
                color: ${C.gearFg};
                z-index: 1; opacity: 0.5;
                transform: scale(0.9) translateX(0);
                transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            #tm-settings-gear-btn svg { width: 20px; height: 20px; display: block; transition: transform 0.3s ease; }

            @keyframes tm-pulse-ring {
                0%   { transform: scale(0.10); opacity: 0.85; }
                45%  { opacity: 0.5; }
                75%  { opacity: 0; }
                100% { transform: scale(0.88); opacity: 0; }
            }
            
            @keyframes tm-load-ring {
                0%   { transform: scale(0.08); opacity: 0.55; }
                50%  { opacity: 0.28; }
                100% { transform: scale(1.1);  opacity: 0; }
            }
            .tm-load-ring {
                position: fixed; border-radius: 50%;
                width: 52px; height: 52px;
                pointer-events: none; z-index: 9999998;
                border: 1.5px solid #1d9bf0;
                animation: tm-load-ring 0.9s cubic-bezier(0.1,0,0.4,1) infinite;
            }
            .tm-corner-pulse {
                position: fixed; border-radius: 50%;
                width: 76px; height: 76px;
                pointer-events: none; z-index: 9999998;
            }
            .tm-pulse-ring {
                position: absolute; inset: 0; border-radius: 50%;
                border: 2.5px solid #1d9bf0;
                animation: tm-pulse-ring 0.52s cubic-bezier(0.15,0,0.5,1) forwards;
            }

            @keyframes tm-spin-once {
                from { transform: rotate(0deg); }
                to   { transform: rotate(-360deg); }
            }
            #tm-refresh-hist-btn.tm-refreshing svg {
                animation: tm-spin-once 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            #tm-settings-wrapper[data-focus="hist"] #tm-history-btn {
                transform: scale(1.15);
                background: ${C.gearBg};
            }

            #tm-settings-wrapper[data-focus="gear"] #tm-settings-gear-btn,
            #tm-settings-wrapper[data-open="true"] #tm-settings-gear-btn {
                z-index: 4;
                opacity: 1;
                transform: scale(1.3) translateX(-12px); 
                background: ${C.gearBg};
            }

            #tm-settings-wrapper[data-focus="gear"] #tm-history-btn,
            #tm-settings-wrapper[data-open="true"] #tm-history-btn {
                z-index: 1;
                opacity: 0.35;
                transform: scale(0.75) translateX(26px); 
                background: transparent;
            }

            #tm-settings-wrapper[data-open="true"] #tm-settings-gear-btn svg {
                transform: rotate(90deg);
            }

            #tm-settings-panel {
                position: absolute; top: calc(100% - 21px); right: 4px;
                width: 300px; background: ${C.panel};
                border-radius: 14px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10);
                border: 1px solid ${C.border};
                font-family: system-ui, -apple-system, sans-serif;
                
                overflow-y: auto;
                overflow-x: hidden;
                max-height: calc(100vh - 60px);
                transform-origin: top right;
                transform: scale(0.88) translateY(-8px); opacity: 0;
                transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease;
                pointer-events: none;
            }
            #tm-settings-wrapper[data-open="true"] #tm-settings-panel {
                transform: scale(1) translateY(0); opacity: 1;
                pointer-events: all;
            }

            #tm-settings-panel.tm-panel-hcenter {
                transform: translateX(-50%) scale(0.88) translateY(-8px);
            }
            #tm-settings-panel.tm-panel-hcenter.tm-panel-bottom {
                transform: translateX(-50%) scale(0.88) translateY(8px);
            }
            #tm-settings-wrapper[data-open="true"] #tm-settings-panel.tm-panel-hcenter {
                transform: translateX(-50%) scale(1) translateY(0);
            }

            .tm-sp-header { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; padding: 11px 14px 10px; background: ${C.header}; border-bottom: 1px solid ${C.border}; font-size: 12px; font-weight: 700; color: ${C.sub}; letter-spacing: 0.04em; text-transform: uppercase; }
            
            .tm-sp-group-header {
                padding: 8px 14px 5px;
                font-size: 10px; font-weight: 800; letter-spacing: 0.08em;
                text-transform: uppercase; color: ${C.sub};
                background: ${C.header};
                border-bottom: 1px solid ${C.border};
                border-top: 1px solid ${C.border};
                user-select: none;
                opacity: 0.7;
            }
            .tm-sp-group-header:first-of-type { border-top: none; }
            .tm-sp-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; gap: 8px; border-bottom: 1px solid ${C.border}; cursor: pointer; transition: background 0.1s; }
            .tm-sp-row:last-child { border-bottom: none; }
            .tm-sp-row:hover { background: ${C.rowHover}; }
            .tm-sp-row-left { display:flex; flex-direction:column; gap:1px; min-width:0; }
            .tm-sp-row-label { font-size: 12px; color: ${C.sub}; white-space: nowrap; }
            .tm-sp-row-value { font-size: 13px; color: ${C.text}; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .tm-sp-arrow { font-size: 11px; color: ${C.sub}; flex-shrink: 0; margin-left: 4px; opacity: 0.5; }
            
            .tm-sp-picker {
                display: none; flex-direction: column;
                background: ${C.panel};
                border-top: 1px solid ${C.border};
                padding: 6px 10px 8px;
                gap: 4px;
            }
            .tm-sp-picker.open { display: flex; }
            .tm-sp-picker-opt {
                display: flex; align-items: center; gap: 8px;
                padding: 6px 10px; border-radius: 8px; border: none;
                background: transparent; cursor: pointer; text-align: left;
                font-size: 12px; color: ${C.text};
                transition: background 0.1s;
                width: 100%;
            }
            .tm-sp-picker-opt:hover { background: ${C.rowHover}; }
            .tm-sp-picker-opt.active {
                background: rgba(29,155,240,0.10);
                color: #1d9bf0; font-weight: 700;
            }
            .tm-sp-picker-opt .tm-sp-opt-check {
                width: 14px; flex-shrink: 0;
                font-size: 11px; color: #1d9bf0;
            }
            
            .tm-sp-group-header {
                display: flex; align-items: center; gap: 5px;
                cursor: pointer;
                transition: opacity 0.15s;
            }
            .tm-sp-group-header:hover { opacity: 1 !important; }
            .tm-sp-group-chevron {
                margin-left: auto; flex-shrink: 0;
                opacity: 0.5;
                transition: transform 0.2s ease;
                display: inline-flex; align-items: center;
            }
            .tm-sp-group-header.collapsed .tm-sp-group-chevron {
                transform: rotate(-90deg);
            }
            .tm-sp-group-body {
                overflow: hidden;
                max-height: 600px;
                transition: max-height 0.28s cubic-bezier(0.4,0,0.2,1),
                            opacity 0.2s ease;
                opacity: 1;
            }
            .tm-sp-group-body.collapsed {
                max-height: 0;
                opacity: 0;
                pointer-events: none;
            }
            
            .tm-sp-help-badge {
                display: inline-flex; align-items: center; justify-content: center;
                width: 13px; height: 13px; flex-shrink: 0;
                opacity: 0.45; cursor: help;
                transition: opacity 0.15s;
            }
            .tm-sp-help-badge:hover { opacity: 0.9; }
            .tm-sp-help-badge svg { width: 13px; height: 13px; }
            
            .tm-sp-slider-row {
                padding: 7px 14px 8px;
                border-bottom: 1px solid ${C.border};
                display: flex; flex-direction: column; gap: 4px;
            }
            .tm-sp-slider-header {
                display: flex; align-items: center; justify-content: space-between;
            }
            .tm-sp-slider-label { font-size: 12px; color: ${C.sub}; }
            .tm-sp-slider-value {
                font-size: 12px; font-weight: 600; color: #1d9bf0;
                min-width: 40px; text-align: right;
            }
            .tm-sp-slider {
                -webkit-appearance: none; appearance: none;
                width: 100%; height: 3px; border-radius: 2px;
                background: ${C.border}; outline: none; cursor: pointer;
                accent-color: #1d9bf0;
            }
            .tm-sp-slider::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none;
                width: 14px; height: 14px; border-radius: 50%;
                background: #1d9bf0; cursor: pointer;
                box-shadow: 0 1px 4px rgba(29,155,240,0.4);
                transition: box-shadow 0.15s;
            }
            .tm-sp-slider::-webkit-slider-thumb:hover {
                box-shadow: 0 0 0 4px rgba(29,155,240,0.18);
            }
            .tm-sp-slider::-moz-range-thumb {
                width: 14px; height: 14px; border-radius: 50%; border: none;
                background: #1d9bf0; cursor: pointer;
            }
            
            .tm-sp-disabled-child {
                opacity: 0.32;
                pointer-events: none;
                cursor: default;
                user-select: none;
                transition: opacity 0.18s ease;
            }
            .tm-sp-disabled-child .tm-sp-slider {
                cursor: default;
                accent-color: rgba(255,255,255,.2);
            }
            
            #tm-dock-spotlight {
                position: fixed; inset: 0; z-index: 9999990;
                pointer-events: all;
                animation: tm-spotlight-fadein 0.22s ease;
            }
            @keyframes tm-spotlight-fadein {
                from { opacity: 0; }
                to   { opacity: 1; }
            }
            #tm-dock-spotlight-canvas {
                position: absolute; inset: 0;
                pointer-events: none;
            }
            .tm-dock-spotlight-step {
                position: absolute;
                background: rgba(29,155,240,0.12);
                border: 2px solid rgba(29,155,240,0.75);
                border-radius: 8px;
                pointer-events: none;
                animation: tm-spotlight-pulse 1.8s ease-in-out infinite;
            }
            @keyframes tm-spotlight-pulse {
                0%,100% { box-shadow: 0 0 0 0 rgba(29,155,240,0.4); }
                50%      { box-shadow: 0 0 0 6px rgba(29,155,240,0); }
            }
            .tm-dock-spotlight-label {
                position: absolute;
                background: rgba(15,20,25,0.92);
                color: #e7e9ea;
                font-size: 11px; font-weight: 600;
                padding: 5px 10px; border-radius: 6px;
                white-space: nowrap;
                pointer-events: none;
                border: 1px solid rgba(29,155,240,0.35);
            }
            #tm-dock-spotlight-dismiss {
                position: absolute; bottom: 32px; left: 50%;
                transform: translateX(-50%);
                padding: 8px 22px; border-radius: 99px; border: none;
                background: #1d9bf0; color: #fff;
                font-size: 13px; font-weight: 700; cursor: pointer;
                box-shadow: 0 4px 16px rgba(29,155,240,0.4);
                transition: background 0.15s;
            }
            #tm-dock-spotlight-dismiss:hover { background: #1a8cd8; }

            @keyframes tm-sp-new-pulse {
                0%, 100% { box-shadow: 0 0 0 0   rgba(29,155,240,0.55); }
                50%       { box-shadow: 0 0 0 4px rgba(29,155,240,0);    }
            }
            .tm-sp-new-badge { font-size: 9px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 6px; border-radius: 9999px; flex-shrink: 0; background: #1d9bf0; color: #fff; animation: tm-sp-new-pulse 1.8s ease-in-out infinite; margin-right: 2px; }

            .tm-fb-demo {
                flex-shrink: 0;
                display: inline-flex; align-items: center; justify-content: center;
                width: 52px; height: 22px;
                pointer-events: none;
                overflow: visible;
            }
            
            .tm-fb-demo-toast-bubble {
                display: inline-flex; align-items: center; gap: 3px;
                padding: 2px 6px; border-radius: 99px;
                background: rgba(29,155,240,0.13); color: #1d9bf0;
                font-size: 9px; font-weight: 700; white-space: nowrap;
                border: 1px solid rgba(29,155,240,0.28);
                opacity: 0;
                transform: translateY(6px) scale(0.85);
            }
            .tm-fb-playing.tm-fb-demo-toast .tm-fb-demo-toast-bubble {
                animation: tm-fb-toast-in 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
            }
            @keyframes tm-fb-toast-in {
                0%   { opacity: 0; transform: translateY(6px) scale(0.85); }
                55%  { opacity: 1; transform: translateY(0)   scale(1);    }
                80%  { opacity: 1; transform: translateY(0)   scale(1);    }
                100% { opacity: 0; transform: translateY(-3px) scale(0.9); }
            }
            
            .tm-fb-demo-icon-wrap {
                display: inline-flex; align-items: center; justify-content: center;
                width: 22px; height: 22px; border-radius: 50%;
                background: rgba(29,155,240,0.10);
                border: 1.5px solid rgba(29,155,240,0.25);
                color: #1d9bf0;
                opacity: 0;
                transform: scale(0.4);
            }
            .tm-fb-playing.tm-fb-demo-icon .tm-fb-demo-icon-wrap {
                animation: tm-fb-icon-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
            }
            .tm-fb-demo-icon-svg {
                stroke: #1d9bf0;
            }
            @keyframes tm-fb-icon-pop {
                0%   { opacity: 0; transform: scale(0.3) rotate(-15deg); }
                55%  { opacity: 1; transform: scale(1.15) rotate(3deg); }
                75%  { opacity: 1; transform: scale(0.95) rotate(0deg); }
                85%  { opacity: 1; transform: scale(1) rotate(0deg);    }
                100% { opacity: 0; transform: scale(1) rotate(0deg);    }
            }
            
            .tm-fb-demo-silent-text {
                font-size: 9px; font-weight: 700; color: ${C.sub};
                white-space: nowrap;
                opacity: 0;
            }
            .tm-fb-playing.tm-fb-demo-silent .tm-fb-demo-silent-text {
                animation: tm-fb-silent-fade 1.1s ease forwards;
            }
            @keyframes tm-fb-silent-fade {
                0%   { opacity: 0.9; }
                30%  { opacity: 0.9; }
                100% { opacity: 0;   }
            }

            .tm-fb-demo-pulse-wrap {
                position: relative;
                width: 22px; height: 22px;
                display: inline-flex; align-items: center; justify-content: center;
            }
            .tm-fb-demo-pulse-ring {
                position: absolute; inset: -1px; border-radius: 50%;
                border: 1.5px solid rgba(29,155,240,0.7);
                opacity: 0; transform: scale(0.9);
            }
            .tm-fb-playing.tm-fb-demo-pulse .tm-fb-demo-pulse-ring:nth-child(1) {
                animation: tm-fb-pulse-ring 1.0s ease-out 0.05s forwards;
            }
            .tm-fb-playing.tm-fb-demo-pulse .tm-fb-demo-pulse-ring:nth-child(2) {
                animation: tm-fb-pulse-ring 1.0s ease-out 0.28s forwards;
            }
            .tm-fb-playing.tm-fb-demo-pulse .tm-fb-demo-pulse-ring:nth-child(3) {
                animation: tm-fb-pulse-ring 1.0s ease-out 0.52s forwards;
            }
            @keyframes tm-fb-pulse-ring {
                0%   { opacity: 0.8; transform: scale(0.9); }
                100% { opacity: 0;   transform: scale(2.4); }
            }
            .tm-fb-demo-pulse-icon {
                width: 20px; height: 20px; border-radius: 50%;
                background: rgba(29,155,240,0.10);
                border: 1.5px solid rgba(29,155,240,0.25);
                display: flex; align-items: center; justify-content: center;
                color: #1d9bf0;
                z-index: 1; position: relative;
            }
            .tm-fb-playing.tm-fb-demo-pulse .tm-fb-demo-pulse-icon {
                animation: tm-fb-pulse-icon-flash 0.35s ease 0.05s forwards;
            }
            @keyframes tm-fb-pulse-icon-flash {
                0%   { background: rgba(29,155,240,0.10); }
                40%  { background: rgba(29,155,240,0.42); }
                100% { background: rgba(29,155,240,0.10); }
            }

            .tm-fb-demo-flash-box {
                width: 34px; height: 18px; border-radius: 4px;
                background: rgba(29,155,240,0.08);
                border: 1px solid rgba(29,155,240,0.20);
                display: flex; align-items: center; justify-content: center;
                overflow: hidden; position: relative;
            }
            .tm-fb-demo-flash-sweep {
                position: absolute; inset: 0;
                background: linear-gradient(90deg, transparent 0%, rgba(29,155,240,0.55) 50%, transparent 100%);
                transform: translateX(-100%); opacity: 0;
            }
            .tm-fb-demo-flash-check {
                color: #1d9bf0; font-size: 10px;
                position: relative; z-index: 1; opacity: 0;
            }
            .tm-fb-playing.tm-fb-demo-flash .tm-fb-demo-flash-check {
                animation: tm-fb-flash-fade 1.1s ease forwards;
            }
            .tm-fb-playing.tm-fb-demo-flash .tm-fb-demo-flash-sweep {
                animation: tm-fb-flash-sweep 0.55s ease 0.08s forwards;
            }
            @keyframes tm-fb-flash-sweep {
                0%   { transform: translateX(-100%); opacity: 1; }
                100% { transform: translateX(110%);  opacity: 1; }
            }
            @keyframes tm-fb-flash-fade {
                0%   { opacity: 0; }
                15%  { opacity: 1; }
                75%  { opacity: 1; }
                100% { opacity: 0; }
            }

            .tm-fb-demo-slide-clip {
                overflow: hidden; height: 16px;
                display: flex; align-items: center;
            }
            .tm-fb-demo-slide-text {
                font-size: 9px; font-weight: 700; color: ${C.sub};
                white-space: nowrap;
                transform: translateY(14px); opacity: 0;
            }
            .tm-fb-playing.tm-fb-demo-slide .tm-fb-demo-slide-text {
                animation: tm-fb-slide-up 1.1s cubic-bezier(0.34,1.3,0.64,1) forwards;
            }
            @keyframes tm-fb-slide-up {
                0%   { transform: translateY(14px); opacity: 0; }
                28%  { transform: translateY(0);     opacity: 1; }
                72%  { transform: translateY(0);     opacity: 1; }
                100% { transform: translateY(-8px);  opacity: 0; }
            }

            @keyframes tm-fb-btn-pulse {
                0%   { box-shadow: 0 0 0 0   rgba(29,155,240,0.65), 0 0 0 0   rgba(29,155,240,0.3); }
                55%  { box-shadow: 0 0 0 7px rgba(29,155,240,0),    0 0 0 14px rgba(29,155,240,0); }
                100% { box-shadow: 0 0 0 0   rgba(29,155,240,0),    0 0 0 0   rgba(29,155,240,0); }
            }
            .tm-anim-pulse {
                border-radius: 50%;
                animation: tm-fb-btn-pulse 0.62s ease-out forwards;
            }
            
            @keyframes tm-fb-btn-flash {
                0%   { background: transparent; }
                25%  { background: rgba(29,155,240,0.28); }
                100% { background: transparent; }
            }
            .tm-anim-flash {
                border-radius: 4px;
                animation: tm-fb-btn-flash 0.55s ease forwards;
            }
            
            @keyframes tm-anim-slide-up-text {
                0%   { opacity: 0; transform: translateY(5px); }
                28%  { opacity: 1; transform: translateY(0);   }
                72%  { opacity: 1; transform: translateY(0);   }
                100% { opacity: 0; transform: translateY(-4px); }
            }
            .tm-anim-pop-text.tm-slide {
                animation: tm-anim-slide-up-text 0.9s cubic-bezier(0.34,1.2,0.64,1) forwards;
            }

            @keyframes tm-float-new-pulse {
                0%, 100% { box-shadow: 0 0 0 0   rgba(249, 24, 128, 0.6); }
                50%       { box-shadow: 0 0 0 4px rgba(249, 24, 128, 0);    }
            }
            .tm-float-new-badge {
                position: absolute; top: -2px; right: -4px;
                font-size: 8px; font-weight: 800; letter-spacing: 0.04em;
                text-transform: uppercase; padding: 2px 4px;
                border-radius: 4px; background: #f91880; color: #fff;
                animation: tm-float-new-pulse 1.8s ease-in-out infinite;
                pointer-events: none; z-index: 5;
            }
            
            .tm-gear-notify-dot {
                position: absolute; top: 1px; right: 1px;
                width: 7px; height: 7px; border-radius: 50%;
                background: #ff6b35;
                border: 1.5px solid var(--tm-gear-dot-border, #16202b);
                pointer-events: none; z-index: 6;
                animation: tm-dot-notify-pulse 2.2s ease-in-out infinite;
            }
            @keyframes tm-dot-notify-pulse {
                0%,100% { box-shadow: 0 0 0 0 rgba(255,107,53,0.55); }
                50%     { box-shadow: 0 0 0 4px rgba(255,107,53,0); }
            }

            #tm-settings-wrapper[data-absorb="true"] {
                opacity: 1 !important;
                
            }
            
            #tm-settings-wrapper[data-absorb="true"] #tm-history-btn {
                z-index: 3 !important;
                opacity: 1 !important;
            }
            #tm-settings-wrapper[data-absorb="true"] #tm-settings-gear-btn {
                opacity: 0.35 !important;
                transform: scale(0.88) translateX(0) !important;
                z-index: 1 !important;
            }
            @keyframes tm-hist-absorb-bounce {
                0%   { transform: scale(1)    translateX(0); filter: none; }
                18%  { transform: scale(1.42) translateX(0); filter: drop-shadow(0 0 10px rgba(29,155,240,0.95)); }
                38%  { transform: scale(0.88) translateX(0); filter: drop-shadow(0 0  5px rgba(29,155,240,0.5)); }
                58%  { transform: scale(1.18) translateX(0); filter: drop-shadow(0 0  7px rgba(29,155,240,0.7)); }
                75%  { transform: scale(0.95) translateX(0); filter: none; }
                100% { transform: scale(1)    translateX(0); filter: none; }
            }
            
            #tm-history-btn.tm-absorbing {
                animation: tm-hist-absorb-bounce 0.75s cubic-bezier(0.36,0.07,0.19,0.97) forwards;
                transition: none !important;
            }

            .tm-star-pip {
                position: fixed;
                width: 18px; height: 18px;
                border-radius: 50%; border: none;
                background: transparent;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: 99996;
                box-shadow: none; outline: none; pointer-events: none;
                transform: scale(0); opacity: 0;
                transition: transform .38s cubic-bezier(.34,1.56,.64,1), opacity .25s ease;
                font-size: 13px; line-height: 1;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,.5));
            }
            .tm-star-pip.tm-popped { transform: scale(1); opacity: 1; pointer-events: all; }
            .tm-star-pip:hover     { transform: scale(1.35) !important; }
            .tm-star-pip.tm-escaping,
            .tm-star-pip.tm-escaping:hover { transform: scale(0.7) translate(-6px, 2px) !important; pointer-events: none !important; }
            
            .tm-fan-node {
                position: fixed;
                width: 36px; height: 36px;
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: 99994; pointer-events: none;
            }
            .tm-fan-node.tm-spawned { pointer-events: all; }
            .tm-fan-node-inner {
                width: 32px; height: 32px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                position: relative;
                background: transparent;
                transition: transform .18s cubic-bezier(.34,1.56,.64,1);
            }
            .tm-fan-node:hover .tm-fan-node-inner { transform: scale(1.15); }
            .tm-fan-glow {
                position: absolute; inset: -6px; border-radius: 50%;
                opacity: 0; transition: opacity .3s; pointer-events: none;
            }
            .tm-fan-node.tm-spawned .tm-fan-glow { opacity: 1; }
            .tm-fan-icon { font-size: 15px; line-height: 1; position: relative; z-index: 2; }
            .tm-fan-count { display: none; }  
            .tm-fan-label {
                position: absolute; bottom: -1px; left: 50%;
                transform: translateX(-50%);
                font-size: 9px; color: rgba(255,255,255,.7);
                white-space: nowrap; pointer-events: none;
                opacity: 0; transition: opacity .25s .12s;
                text-shadow: 0 1px 4px rgba(0,0,0,.9);
            }
            .tm-fan-node.tm-spawned .tm-fan-label { opacity: 1; }  
            
            .tm-ripple-ring {
                position: fixed; border-radius: 50%; pointer-events: none;
                border: 1px solid rgba(255,210,50,.45);
                animation: tm-ring-out .52s cubic-bezier(.2,.6,.4,1) forwards;
                z-index: 99993;
            }
            @keyframes tm-ring-out {
                0%   { transform: scale(1)   translate(-50%,-50%); opacity: .85; }
                100% { transform: scale(3.8) translate(-50%,-50%); opacity: 0; }
            }
            
            @keyframes tm-float-a { 0%,100%{transform:translate(0,0)} 33%{transform:translate(2.2px,-2.8px)} 66%{transform:translate(-1.8px,2.1px)} }
            @keyframes tm-float-b { 0%,100%{transform:translate(0,0)} 28%{transform:translate(-2.5px,-2.0px)} 68%{transform:translate(2.8px,1.8px)} }
            @keyframes tm-float-c { 0%,100%{transform:translate(0,0)} 42%{transform:translate(1.9px,2.6px)} 74%{transform:translate(-2.2px,-1.8px)} }
            @keyframes tm-float-d { 0%,100%{transform:translate(0,0)} 22%{transform:translate(2.6px,1.5px)} 62%{transform:translate(-1.5px,-2.8px)} }
            @keyframes tm-float-e { 0%,100%{transform:translate(0,0)} 36%{transform:translate(-2.8px,1.2px)} 71%{transform:translate(1.6px,-2.4px)} }
            .tm-float-a { animation: tm-float-a 3.4s ease-in-out infinite; }
            .tm-float-b { animation: tm-float-b 4.1s ease-in-out infinite .6s; }
            .tm-float-c { animation: tm-float-c 3.8s ease-in-out infinite 1.1s; }
            .tm-float-d { animation: tm-float-d 4.5s ease-in-out infinite .3s; }
            .tm-float-e { animation: tm-float-e 3.6s ease-in-out infinite 1.8s; }
            
            .tm-group-modal-overlay {
                position: fixed; inset: 0;
                background: rgba(0,0,0,.65);
                z-index: 99998;
                display: flex; align-items: center; justify-content: center;
                opacity: 0; pointer-events: none;
                transition: opacity .2s;
            }
            .tm-group-modal-overlay.tm-show {
                opacity: 1; pointer-events: all;
            }
            .tm-group-modal-box {
                background: #1a1f2e;
                border: 0.5px solid rgba(255,255,255,.13);
                border-radius: 14px; padding: 18px 20px; width: 230px;
                max-height: calc(100dvh - 48px);
                overflow: hidden;
                display: flex; flex-direction: column;
                transform: scale(.88) translateY(10px);
                transition: transform .26s cubic-bezier(.34,1.56,.64,1);
            }
            .tm-group-modal-overlay.tm-show .tm-group-modal-box {
                transform: scale(1) translateY(0);
            }
            .tm-group-modal-title {
                font-size: 14px; color: rgba(255,255,255,.92);
                margin-bottom: 14px; font-weight: 600;
                letter-spacing: .01em;
            }
            .tm-group-modal-input {
                width: 100%;
                background: rgba(255,255,255,.08);
                border: 1px solid rgba(255,255,255,.18);
                border-radius: 8px; padding: 8px 11px;
                font-size: 13px; color: #e7e9ea; outline: none;
                transition: border-color .15s;
                box-sizing: border-box;
                font-family: inherit;
            }
            .tm-group-modal-input:focus { border-color: rgba(29,155,240,.7); }
            .tm-group-modal-btns {
                display: flex; gap: 8px; margin-top: 16px;
            }
            .tm-group-modal-btn {
                flex: 1; padding: 8px 0; border-radius: 8px; border: none;
                font-size: 13px; font-weight: 500; cursor: pointer;
                transition: background .15s, opacity .15s;
                font-family: inherit; letter-spacing: .01em;
            }
            .tm-group-modal-btn.tm-confirm {
                background: #1d9bf0; color: #fff;
            }
            .tm-group-modal-btn.tm-confirm:hover { background: #1a8cd8; }
            .tm-group-modal-btn.tm-skip {
                background: rgba(255,255,255,.09);
                color: rgba(255,255,255,.65);
                border: 1px solid rgba(255,255,255,.12);
            }
            .tm-group-modal-btn.tm-skip:hover { background: rgba(255,255,255,.14); }
        `;
        document.head.appendChild(panelStyle);

        const wrapper = document.createElement('div');
        wrapper.id = 'tm-settings-wrapper';
        wrapper.setAttribute('data-focus', 'hist');
        wrapper.setAttribute('data-open', 'false');

        let focusTimer  = null;
        let currentFocus = 'hist';
        let _gearLock   = false;
        let _gearLockTimer = null;
        let _leaveTimer = null;

        wrapper.addEventListener('mouseenter', () => {
            if (_leaveTimer) { clearTimeout(_leaveTimer); _leaveTimer = null; }
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (_leaveTimer) { clearTimeout(_leaveTimer); _leaveTimer = null; }

            if (wrapper.getAttribute('data-open') === 'true') return;
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const targetFocus = x > 60 ? 'gear' : 'hist';

            if (_gearLock && targetFocus === 'hist') {
                if (focusTimer) { clearTimeout(focusTimer); focusTimer = null; }
                return;
            }

            if (targetFocus !== currentFocus) {
                if (!focusTimer) {
                    focusTimer = setTimeout(() => {
                        currentFocus = targetFocus;
                        wrapper.setAttribute('data-focus', currentFocus);
                        focusTimer = null;

                        if (currentFocus === 'gear') {
                            _gearLock = true;
                            if (_gearLockTimer) clearTimeout(_gearLockTimer);
                            _gearLockTimer = setTimeout(() => { _gearLock = false; }, 800);
                        }
                    }, 150);
                }
            } else {
                if (focusTimer) { clearTimeout(focusTimer); focusTimer = null; }
            }
        });

        wrapper.addEventListener('mouseleave', () => {
            if (wrapper.getAttribute('data-open') === 'true') return;
            if (focusTimer) { clearTimeout(focusTimer); focusTimer = null; }
            if (_leaveTimer) clearTimeout(_leaveTimer);
            _leaveTimer = setTimeout(() => {
                _leaveTimer = null;
                if (_gearLockTimer) { clearTimeout(_gearLockTimer); _gearLockTimer = null; }
                _gearLock    = false;
                currentFocus = 'hist';
                wrapper.setAttribute('data-focus', 'hist');
            }, 400);
        });

        const dismissBtn = document.createElement('button');
        dismissBtn.id = 'tm-dismiss-btn';
        dismissBtn.title = 'Hide buttons (reload to restore)';
        dismissBtn.innerHTML = '<svg viewBox="0 0 10 10" width="7" height="7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/></svg>';
        dismissBtn.style.cssText = `
            position:absolute; left:0; top:0;
            width:14px; height:14px;
            border-radius:50%; border:none;
            background:rgba(255,255,255,.12);
            color:rgba(255,255,255,.4);
            cursor:pointer; padding:0;
            display:flex; align-items:center; justify-content:center;
            opacity:0; transition:opacity .2s;
            z-index:10;
        `;
        dismissBtn.addEventListener('click', e => {
            e.stopPropagation();
            wrapper.setAttribute('data-open', 'false');
            wrapper.style.display = 'none';
        });

        const SVG_GEAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
        const gearBtn = document.createElement('button');
        gearBtn.id = 'tm-settings-gear-btn';
        gearBtn.innerHTML = SVG_GEAR;
        gearBtn.title = '⚙️ Twitter Media Script Settings';

        const _seenCount    = GM_getValue(KEY_GEAR_DOT_SEEN, 0);
        const _hasUnseenFeature = _seenCount < NEW_FEATURE_IDS.length
            && NEW_FEATURE_IDS.some(id => isFeatureNew(id));
        if (_hasUnseenFeature) {
            const dot = document.createElement('span');
            dot.className = 'tm-gear-notify-dot';
            dot.style.setProperty('--tm-gear-dot-border', dark ? '#16202b' : '#f7f9f9');
            gearBtn.appendChild(dot);
        }

        const SVG_HISTORY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 15.5"/><path d="M5 5l2.5 2.5" opacity="0.5"/></svg>`;
        const histBtn = document.createElement('button');
        histBtn.id = 'tm-history-btn';
        histBtn.innerHTML = SVG_HISTORY;
        histBtn.title = '📋 Download History';

        if (isFeatureNew('history_panel')) {
            const floatBadge = document.createElement('span');
            floatBadge.className = 'tm-float-new-badge';
            floatBadge.textContent = 'NEW';
            histBtn.appendChild(floatBadge);
        }

        histBtn.addEventListener('click', e => {
            e.stopPropagation();

            if (isFeatureNew('history_panel')) {
                markFeatureSeen('history_panel');
                const badge = histBtn.querySelector('.tm-float-new-badge');
                if (badge) badge.remove();
            }

            wrapper.setAttribute('data-open', 'false');
            showHistoryPanel();
        });

        const panel = document.createElement('div');
        panel.id = 'tm-settings-panel';

        function buildContent() {
            panel.innerHTML = '';

            const s = _readSettings();
            const { clickCustom, clickDomain, prefix, fmt, fbStyle: _fbStyle,
                    dockStyle, dockHoverDelay, dockTriggerL, dockTriggerR } = s;

            const header = document.createElement('div');
            header.className = 'tm-sp-header';
            header.textContent = T.onboard_title || '⚙ Media Script Settings';
            panel.appendChild(header);

            const makeRow = (label, value, onClick, featureId = null) => {
                const row = document.createElement('div');
                row.className = 'tm-sp-row';
                const left = document.createElement('div');
                left.className = 'tm-sp-row-left';
                const lbl = document.createElement('span');
                lbl.className = 'tm-sp-row-label';
                lbl.textContent = label;
                const val = document.createElement('span');
                val.className = 'tm-sp-row-value';
                const getVal = typeof value === 'function' ? value : () => value;
                val.textContent = getVal();
                left.appendChild(lbl);
                left.appendChild(val);
                row.appendChild(left);
                if (featureId && isFeatureNew(featureId)) {
                    const badge = document.createElement('span');
                    badge.className = 'tm-sp-new-badge';
                    badge.textContent = 'NEW';
                    row.appendChild(badge);
                }
                const arrow = document.createElement('span');
                arrow.className = 'tm-sp-arrow';
                arrow.textContent = '›';
                row.appendChild(arrow);
                row.addEventListener('click', () => {
                    if (featureId) markFeatureSeen(featureId);
                    onClick();
                    val.textContent = getVal();
                });
                return row;
            };

            const makeGroup = (label, defaultOpen = true, tooltip = null, onOpen = null) => {
                const SVG_CHEVRON = `<svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor"><path d="M1 3l4 4 4-4z"/></svg>`;
                const SVG_HELP    = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><path d="M6 6.2C6 5.1 6.9 4.2 8 4.2s2 .9 2 2c0 1-1 1.5-2 2v.6"/><circle cx="8" cy="11.2" r=".6" fill="currentColor" stroke="none"/></svg>`;

                let openState = defaultOpen;
                try {
                    const saved = JSON.parse(GM_getValue(KEY_SP_GROUP_OPEN, '{}'));
                    if (label in saved) openState = saved[label];
                } catch (_) {}

                const g = document.createElement('div');
                g.className = 'tm-sp-group-header' + (openState ? '' : ' collapsed');

                const labelSpan = document.createElement('span');
                labelSpan.textContent = label;
                g.appendChild(labelSpan);

                if (tooltip) {
                    const helpBadge = document.createElement('span');
                    helpBadge.className = 'tm-sp-help-badge';
                    helpBadge.innerHTML = SVG_HELP;
                    helpBadge.title = tooltip;
                    g.appendChild(helpBadge);
                }

                const chevron = document.createElement('span');
                chevron.className = 'tm-sp-group-chevron';
                chevron.innerHTML = SVG_CHEVRON;
                if (openState) chevron.style.transform = 'rotate(0deg)';
                else           chevron.style.transform = 'rotate(-90deg)';
                g.appendChild(chevron);

                const body = document.createElement('div');
                body.className = 'tm-sp-group-body' + (openState ? '' : ' collapsed');

                g.addEventListener('click', (e) => {
                    if (e.target.closest('.tm-sp-help-badge')) return;
                    const isCollapsed = body.classList.toggle('collapsed');
                    g.classList.toggle('collapsed', isCollapsed);
                    chevron.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
                    if (!isCollapsed && onOpen) onOpen();
                    try {
                        const saved = JSON.parse(GM_getValue(KEY_SP_GROUP_OPEN, '{}'));
                        saved[label] = !isCollapsed;
                        GM_setValue(KEY_SP_GROUP_OPEN, JSON.stringify(saved));
                    } catch (_) {}
                    if (_lcRcResizeHandler) requestAnimationFrame(_lcRcResizeHandler);
                });

                panel.appendChild(g);
                panel.appendChild(body);
                return {
                    body,
                    append: (el) => body.appendChild(el),
                };
            };

            const makePickerRow = (label, options, currentVal, onSelect, featureId = null) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = `border-bottom: 1px solid ${C.border};`;

                const row = document.createElement('div');
                row.className = 'tm-sp-row';
                row.style.borderBottom = 'none';

                const left = document.createElement('div');
                left.className = 'tm-sp-row-left';
                const lbl = document.createElement('span');
                lbl.className = 'tm-sp-row-label';
                lbl.textContent = label;
                const val = document.createElement('span');
                val.className = 'tm-sp-row-value';
                val.textContent = (options.find(o => o.value === currentVal) || options[0]).label;
                left.appendChild(lbl);
                left.appendChild(val);
                row.appendChild(left);

                if (featureId && isFeatureNew(featureId)) {
                    const badge = document.createElement('span');
                    badge.className = 'tm-sp-new-badge';
                    badge.textContent = 'NEW';
                    row.appendChild(badge);
                }

                const arrow = document.createElement('span');
                arrow.className = 'tm-sp-arrow';
                arrow.textContent = '›';
                arrow.style.cssText = 'transition: transform 0.18s ease;';
                row.appendChild(arrow);

                const picker = document.createElement('div');
                picker.className = 'tm-sp-picker';

                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'tm-sp-picker-opt' + (opt.value === currentVal ? ' active' : '');
                    const check = document.createElement('span');
                    check.className = 'tm-sp-opt-check';
                    check.textContent = opt.value === currentVal ? '✓' : '';
                    const txt = document.createElement('span');
                    txt.textContent = opt.label;
                    btn.appendChild(check);
                    btn.appendChild(txt);
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (featureId) markFeatureSeen(featureId);
                        onSelect(opt.value);
                        val.textContent = opt.label;
                        picker.querySelectorAll('.tm-sp-picker-opt').forEach(b => {
                            b.classList.remove('active');
                            b.querySelector('.tm-sp-opt-check').textContent = '';
                        });
                        btn.classList.add('active');
                        check.textContent = '✓';
                        picker.classList.remove('open');
                        arrow.style.transform = '';
                    });
                    picker.appendChild(btn);
                });

                row.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = picker.classList.toggle('open');
                    arrow.style.transform = isOpen ? 'rotate(90deg)' : '';
                    if (featureId && isOpen) markFeatureSeen(featureId);
                    if (_lcRcResizeHandler) requestAnimationFrame(_lcRcResizeHandler);
                });

                wrap.addEventListener('click', e => e.stopPropagation());

                wrap.appendChild(row);
                wrap.appendChild(picker);
                return wrap;
            };

            const makeDockStylePickerRow = (label, options, currentVal, onSelect, featureId = null) => {
                const wrap = document.createElement('div');
                wrap.className = 'tm-sp-picker-wrap';

                const row = document.createElement('div');
                row.className = 'tm-sp-row tm-sp-row-picker';

                const lbl = document.createElement('span');
                lbl.className = 'tm-sp-label';
                lbl.textContent = label;
                row.appendChild(lbl);

                const val = document.createElement('span');
                val.className = 'tm-sp-val';
                val.textContent = options.find(o => o.value === currentVal)?.label ?? currentVal;
                row.appendChild(val);

                if (featureId && isFeatureNew(featureId)) {
                    const badge = document.createElement('span');
                    badge.className = 'tm-sp-new-badge';
                    badge.textContent = 'NEW';
                    row.appendChild(badge);
                }

                const arrow = document.createElement('span');
                arrow.className = 'tm-sp-arrow';
                arrow.textContent = '›';
                arrow.style.cssText = 'transition: transform 0.18s ease;';
                row.appendChild(arrow);

                const picker = document.createElement('div');
                picker.className = 'tm-sp-picker';
                picker.style.cssText = 'display:none; grid-template-columns:1fr 1fr; gap:6px; padding:10px 12px;';

                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.style.cssText = `
                        display:flex; flex-direction:column; align-items:center; gap:5px;
                        padding:8px 6px; border-radius:8px; border:none; cursor:pointer;
                        background:${opt.value === currentVal ? 'rgba(29,155,240,0.12)' : 'rgba(255,255,255,0.04)'};
                        outline:${opt.value === currentVal ? '1.5px solid rgba(29,155,240,0.5)' : '1px solid rgba(255,255,255,0.08)'};
                        transition:background 0.15s, outline 0.15s;
                    `;

                    const tmpDiv = document.createElement('div');
                    tmpDiv.innerHTML = opt.svg;
                    const svgEl = tmpDiv.querySelector('svg');
                    if (svgEl) {
                        svgEl.setAttribute('width', '28');
                        svgEl.setAttribute('height', '52');
                        btn.appendChild(svgEl);
                    }

                    const nameLbl = document.createElement('span');
                    nameLbl.textContent = opt.label;
                    nameLbl.style.cssText = `font-size:10px; color:${opt.value === currentVal ? '#1d9bf0' : 'rgba(255,255,255,0.55)'}; font-weight:${opt.value === currentVal ? '600' : '400'};`;
                    btn.appendChild(nameLbl);

                    btn.addEventListener('click', e => {
                        e.stopPropagation();
                        if (featureId) markFeatureSeen(featureId);
                        onSelect(opt.value);
                        val.textContent = opt.label;
                        picker.querySelectorAll('button').forEach(b => {
                            b.style.background = 'rgba(255,255,255,0.04)';
                            b.style.outline = '1px solid rgba(255,255,255,0.08)';
                            b.querySelector('span:last-child').style.color = 'rgba(255,255,255,0.55)';
                            b.querySelector('span:last-child').style.fontWeight = '400';
                        });
                        btn.style.background = 'rgba(29,155,240,0.12)';
                        btn.style.outline = '1.5px solid rgba(29,155,240,0.5)';
                        nameLbl.style.color = '#1d9bf0';
                        nameLbl.style.fontWeight = '600';
                        picker.classList.remove('open');
                        picker.style.display = 'none';
                        arrow.style.transform = '';
                        if (_lcRcResizeHandler) requestAnimationFrame(_lcRcResizeHandler);
                    });
                    picker.appendChild(btn);
                });

                row.addEventListener('click', e => {
                    e.stopPropagation();
                    const isOpen = picker.style.display === 'grid';
                    picker.style.display = isOpen ? 'none' : 'grid';
                    arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
                    if (featureId && !isOpen) markFeatureSeen(featureId);
                    if (_lcRcResizeHandler) requestAnimationFrame(_lcRcResizeHandler);
                });

                wrap.addEventListener('click', e => e.stopPropagation());
                wrap.appendChild(row);
                wrap.appendChild(picker);
                return wrap;
            };

            const makeFeedbackPickerRow = (label, options, currentVal, onSelect, featureId = null) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = `border-bottom: 1px solid ${C.border};`;

                const row = document.createElement('div');
                row.className = 'tm-sp-row';
                row.style.borderBottom = 'none';

                const left = document.createElement('div');
                left.className = 'tm-sp-row-left';
                const lbl = document.createElement('span');
                lbl.className = 'tm-sp-row-label';
                lbl.textContent = label;
                const val = document.createElement('span');
                val.className = 'tm-sp-row-value';
                val.textContent = (options.find(o => o.value === currentVal) || options[0]).label;
                left.appendChild(lbl);
                left.appendChild(val);
                row.appendChild(left);

                if (featureId && isFeatureNew(featureId)) {
                    const badge = document.createElement('span');
                    badge.className = 'tm-sp-new-badge';
                    badge.textContent = 'NEW';
                    row.appendChild(badge);
                }

                const arrow = document.createElement('span');
                arrow.className = 'tm-sp-arrow';
                arrow.textContent = '›';
                arrow.style.cssText = 'transition: transform 0.18s ease;';
                row.appendChild(arrow);

                const picker = document.createElement('div');
                picker.className = 'tm-sp-picker';

                const makeDemoEl = (value) => {
                    const demo = document.createElement('span');
                    demo.className = 'tm-fb-demo tm-fb-demo-' + value;
                    demo.setAttribute('aria-hidden', 'true');

                    if (value === 'toast') {
                        demo.innerHTML = `
                            <span class="tm-fb-demo-toast-bubble">
                                <svg viewBox="0 0 14 14" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>
                                OK
                            </span>`;
                    } else if (value === 'icon') {
                        demo.innerHTML = `
                            <span class="tm-fb-demo-icon-wrap">
                                <svg class="tm-fb-demo-icon-svg" viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>
                            </span>`;
                    } else if (value === 'silent') {
                        demo.innerHTML = `<span class="tm-fb-demo-silent-text">Copied</span>`;
                    } else if (value === 'pulse') {
                        demo.innerHTML = `
                            <span class="tm-fb-demo-pulse-wrap">
                                <span class="tm-fb-demo-pulse-ring"></span>
                                <span class="tm-fb-demo-pulse-ring"></span>
                                <span class="tm-fb-demo-pulse-ring"></span>
                                <span class="tm-fb-demo-pulse-icon">
                                    <svg viewBox="0 0 14 14" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>
                                </span>
                            </span>`;
                    } else if (value === 'flash') {
                        demo.innerHTML = `
                            <span class="tm-fb-demo-flash-box">
                                <span class="tm-fb-demo-flash-sweep"></span>
                                <span class="tm-fb-demo-flash-check">
                                    <svg viewBox="0 0 14 14" width="9" height="9" fill="none" stroke="#1d9bf0" stroke-width="2.4" stroke-linecap="round"><polyline points="2,7 5.5,10.5 12,3.5"/></svg>
                                </span>
                            </span>`;
                    } else if (value === 'slide') {
                        demo.innerHTML = `
                            <span class="tm-fb-demo-slide-clip">
                                <span class="tm-fb-demo-slide-text">Copied</span>
                            </span>`;
                    }
                    return demo;
                };

                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'tm-sp-picker-opt' + (opt.value === currentVal ? ' active' : '');

                    const check = document.createElement('span');
                    check.className = 'tm-sp-opt-check';
                    check.textContent = opt.value === currentVal ? '✓' : '';

                    const txt = document.createElement('span');
                    txt.style.cssText = 'flex: 1;';
                    txt.textContent = opt.label;

                    const demoEl = makeDemoEl(opt.value);

                    btn.appendChild(check);
                    btn.appendChild(txt);
                    if (opt.featureId && isFeatureNew(opt.featureId)) {
                        const optBadge = document.createElement('span');
                        optBadge.className = 'tm-sp-new-badge';
                        optBadge.textContent = 'NEW';
                        btn.appendChild(optBadge);
                    }
                    btn.appendChild(demoEl);

                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (featureId) markFeatureSeen(featureId);
                        if (opt.featureId) markFeatureSeen(opt.featureId);
                        onSelect(opt.value);
                        val.textContent = opt.label;
                        picker.querySelectorAll('.tm-sp-picker-opt').forEach(b => {
                            b.classList.remove('active');
                            b.querySelector('.tm-sp-opt-check').textContent = '';
                        });
                        btn.classList.add('active');
                        check.textContent = '✓';
                        picker.classList.remove('open');
                        arrow.style.transform = '';
                    });

                    btn.addEventListener('mouseenter', () => {
                        const d = btn.querySelector('.tm-fb-demo');
                        if (!d) return;
                        d.classList.remove('tm-fb-playing');
                        void d.offsetWidth;
                        d.classList.add('tm-fb-playing');
                    });

                    picker.appendChild(btn);
                });

                row.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = picker.classList.toggle('open');
                    arrow.style.transform = isOpen ? 'rotate(90deg)' : '';
                    if (featureId && isOpen) markFeatureSeen(featureId);
                    if (isOpen) {
                        picker.querySelectorAll('.tm-fb-demo').forEach(d => {
                            d.classList.remove('tm-fb-playing');
                            void d.offsetWidth;
                            d.classList.add('tm-fb-playing');
                        });
                    }
                    if (_lcRcResizeHandler) requestAnimationFrame(_lcRcResizeHandler);
                });

                wrap.addEventListener('click', e => e.stopPropagation());
                wrap.appendChild(row);
                wrap.appendChild(picker);
                return wrap;
            };

            const makeSliderRow = (label, value, min, max, step, unit, onChange, onCommit, featureId = null) => {
                const wrap = document.createElement('div');
                wrap.className = 'tm-sp-slider-row';

                const hdr = document.createElement('div');
                hdr.className = 'tm-sp-slider-header';

                const lbl = document.createElement('span');
                lbl.className = 'tm-sp-slider-label';
                lbl.textContent = label;

                const valDisplay = document.createElement('span');
                valDisplay.className = 'tm-sp-slider-value';
                valDisplay.textContent = value + ' ' + unit;

                if (featureId && isFeatureNew(featureId)) {
                    const badge = document.createElement('span');
                    badge.className = 'tm-sp-new-badge';
                    badge.textContent = 'NEW';
                    hdr.appendChild(lbl);
                    hdr.appendChild(badge);
                } else {
                    hdr.appendChild(lbl);
                }
                hdr.appendChild(valDisplay);

                const slider = document.createElement('input');
                slider.type  = 'range';
                slider.className = 'tm-sp-slider';
                slider.min   = String(min);
                slider.max   = String(max);
                slider.step  = String(step);
                slider.value = String(value);

                slider.addEventListener('input', () => {
                    const n = parseInt(slider.value, 10);
                    valDisplay.textContent = n + ' ' + unit;
                    if (onChange) onChange(n);
                });
                slider.addEventListener('change', () => {
                    const n = parseInt(slider.value, 10);
                    if (onCommit) onCommit(n);
                    if (featureId) markFeatureSeen(featureId);
                });
                slider.addEventListener('click', e => e.stopPropagation());

                wrap.addEventListener('click', e => e.stopPropagation());
                wrap.appendChild(hdr);
                wrap.appendChild(slider);
                return wrap;
            };

            const showDockSpotlight = () => {
                if (GM_getValue('app_dock_spotlight_done', false)) return;
                if (document.getElementById('tm-dock-spotlight')) return;

                const histPanel = document.getElementById('tm-hist-panel');
                if (!histPanel) {
                    showHistoryPanel();
                    setTimeout(showDockSpotlight, 450);
                    return;
                }

                const trigL = histPanel.querySelector('.tm-dock-trigger.left');
                const trigR = histPanel.querySelector('.tm-dock-trigger.right');
                if (!trigL && !trigR) {
                    setTimeout(showDockSpotlight, 200);
                    return;
                }

                GM_setValue('app_dock_spotlight_done', true);

                const overlay = document.createElement('div');
                overlay.id = 'tm-dock-spotlight';

                const canvas = document.createElement('canvas');
                canvas.id = 'tm-dock-spotlight-canvas';
                canvas.width  = window.innerWidth;
                canvas.height = window.innerHeight;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'rgba(0,0,0,0.62)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const pr = histPanel.getBoundingClientRect();
                ctx.clearRect(pr.left - 4, pr.top - 4, pr.width + 8, pr.height + 8);

                overlay.appendChild(canvas);

                const addHighlight = (el, labelText, labelSide) => {
                    if (!el) return;
                    const r = el.getBoundingClientRect();
                    const pad = 6;
                    const box = document.createElement('div');
                    box.className = 'tm-dock-spotlight-step';
                    box.style.cssText = [
                        'left:'   + (r.left   - pad) + 'px',
                        'top:'    + (r.top    - pad) + 'px',
                        'width:'  + (r.width  + pad * 2) + 'px',
                        'height:' + (r.height + pad * 2) + 'px',
                    ].join(';');
                    overlay.appendChild(box);

                    const lbl = document.createElement('div');
                    lbl.className = 'tm-dock-spotlight-label';
                    lbl.textContent = labelText;
                    lbl.style.cssText = labelSide === 'left'
                        ? 'left:' + (r.right + 10) + 'px; top:' + (r.top + r.height/2 - 12) + 'px;'
                        : 'right:' + (window.innerWidth - r.left + 10) + 'px; top:' + (r.top + r.height/2 - 12) + 'px;';
                    overlay.appendChild(lbl);
                };

                addHighlight(trigL, '① Click to dock left →', 'left');
                addHighlight(trigR, '← Click to dock right ②', 'right');

                const dismissBtn = document.createElement('button');
                dismissBtn.id = 'tm-dock-spotlight-dismiss';
                dismissBtn.textContent = 'Got it!';
                dismissBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    overlay.remove();
                });
                overlay.appendChild(dismissBtn);

                overlay.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (e.target === overlay || e.target === canvas) overlay.remove();
                });

                document.body.appendChild(overlay);
            };

            const grpLink = makeGroup('🔗  Link', true);

            const clickVal = clickCustom ? clickDomain : 'x.com (default)';
            const clickLabel = T.menu_domain_click ? T.menu_domain_click.replace(/^🔗\s*/, '') : 'Single-Click Domain';
            grpLink.append(makeRow(clickLabel, clickVal, () => {
                if (!clickCustom) {
                    showDomainPickerModal(KEY_LINK_DOMAIN_CLICK, dom => {
                        GM_setValue(KEY_CLICK_MODE_CUSTOM, true);
                        showToast(T.toast_domain_click + dom);
                        registerMenus(); buildContent();
                    });
                } else {
                    GM_setValue(KEY_CLICK_MODE_CUSTOM, false);
                    showToast(T.toast_domain_click + 'x.com');
                    registerMenus(); buildContent();
                }
            }));

            const prefixLabel = T.menu_prefix ? T.menu_prefix.replace(/^⚙️\s*/, '') : 'Discord Prefix';
            grpLink.append(makeRow(prefixLabel, prefix || '(empty)', () => {
                const newPrefix = prompt(T.prompt_prefix, prefix);
                if (newPrefix !== null) {
                    GM_setValue(KEY_PREFIX_TEXT, newPrefix);
                    showToast(T.toast_prefix + (newPrefix || '(empty)'));
                    registerMenus(); buildContent();
                }
            }));

            const grpMedia = makeGroup('🎞  Media', true);

            const fbOpts = [
                { value: 'toast',  label: T.status_feedback_toast  || 'Toast' },
                { value: 'icon',   label: T.status_feedback_icon   || 'Icon Only' },
                { value: 'silent', label: T.status_feedback_silent || 'Silent' },
                { value: 'pulse',  label: T.status_feedback_pulse  || 'Pulse Ring',   featureId: 'sp_feedback_pulse' },
                { value: 'flash',  label: T.status_feedback_flash  || 'Flash Sweep',  featureId: 'sp_feedback_flash' },
                { value: 'slide',  label: T.status_feedback_slide  || 'Slide Up',     featureId: 'sp_feedback_slide' },
            ];
            const fbLabel = T.menu_feedback_style ? T.menu_feedback_style.replace(/^🔔\s*/, '') : 'Feedback Style';
            grpMedia.append(makeFeedbackPickerRow(fbLabel, fbOpts, _fbStyle, (newFb) => {
                GM_setValue(KEY_FEEDBACK_STYLE, newFb);
                const chosen = fbOpts.find(o => o.value === newFb);
                showToast((T.toast_feedback_style || '🔔 Feedback Style → ') + (chosen ? chosen.label : newFb));
                buildContent();
            }, 'sp_feedback_picker'));

            const fmtOpts = [
                { value: 'asian',   label: (T.status_date_asian   || 'Asian (YYYY.MM.DD)') },
                { value: 'western', label: (T.status_date_western || 'Western (DD.MM.YYYY)') },
            ];
            const fmtLabel = T.menu_date_format ? T.menu_date_format.replace(/^📅\s*/, '') : 'Date Format';
            grpMedia.append(makePickerRow(fmtLabel, fmtOpts, fmt, (newFmt) => {
                GM_setValue(KEY_DATE_FORMAT, newFmt);
                _refreshDateFormatCache();
                const chosen = fmtOpts.find(o => o.value === newFmt);
                showToast(T.toast_date_fmt + (chosen ? chosen.label : newFmt));
                registerMenus(); buildContent();
            }, 'sp_date_picker'));

            const langLabel = T.menu_lang.replace(/^🌐\s*/, '').replace(/\s*\(Change Language\)/i, '').trim();
            grpMedia.append(makeRow('🌐 ' + langLabel, T.langName, () => {
                showLangPickerModal();
            }));

            const grpGroups = makeGroup('⭐  Groups', true);

            const groupOnDlRow = makeRow(
                'Group on Download',
                () => GM_getValue(KEY_GROUP_ON_DOWNLOAD, false) ? (T.status_on || 'On') : (T.status_off || 'Off'),
                () => {
                    const next = !GM_getValue(KEY_GROUP_ON_DOWNLOAD, false);
                    GM_setValue(KEY_GROUP_ON_DOWNLOAD, next);
                    showToast('Group on Download → ' + (next ? (T.status_on || 'On') : (T.status_off || 'Off')));
                    _syncGroupChildrenDisabled();
                },
                'sp_group_on_dl'
            );
            grpGroups.append(groupOnDlRow);

            const _grpCfgRaw  = (() => { try { return JSON.parse(GM_getValue(KEY_GROUP_PANEL_CFG, '{}')); } catch(_) { return {}; } })();
            const _grpGlowClr = _grpCfgRaw.glowColor || 'multi';
            const _grpGlowSz  = Number(_grpCfgRaw.glowSize  ?? 12);
            const _grpTxtClr  = _grpCfgRaw.textColor || 'white';

            const glowColorRow = (() => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.06)';
                wrap.addEventListener('click', e => e.stopPropagation());

                const labelRow = document.createElement('div');
                labelRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:7px';
                const lbl = document.createElement('span');
                lbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,.7)';
                lbl.textContent   = 'Glow Color';

                const multiToggle = document.createElement('button');
                multiToggle.type = 'button';
                const isMulti = _grpGlowClr === 'multi';
                multiToggle.style.cssText = `
                    padding:2px 8px;border-radius:99px;font-size:10px;
                    cursor:pointer;font-family:inherit;line-height:1.4;
                    background:${isMulti ? 'rgba(29,155,240,.7)' : 'transparent'};
                    color:${isMulti ? '#fff' : 'rgba(255,255,255,.65)'};
                    border:${isMulti ? '1px solid transparent' : '1px solid rgba(255,255,255,.3)'};
                    transition:background .12s,color .12s,border-color .12s;
                `;
                multiToggle.textContent = 'Multi';
                multiToggle.title = 'Use individual color per group';
                multiToggle.addEventListener('click', () => {
                    const cfg = (() => { try { return JSON.parse(GM_getValue(KEY_GROUP_PANEL_CFG, '{}')); } catch(_) { return {}; } })();
                    const next = cfg.glowColor !== 'multi' ? 'multi' : '#1d9bf0';
                    cfg.glowColor = next;
                    GM_setValue(KEY_GROUP_PANEL_CFG, JSON.stringify(cfg));
                    multiToggle.style.background    = next === 'multi' ? 'rgba(29,155,240,.7)' : 'transparent';
                    multiToggle.style.color         = next === 'multi' ? '#fff' : 'rgba(255,255,255,.65)';
                    multiToggle.style.borderColor   = next === 'multi' ? 'transparent' : 'rgba(255,255,255,.3)';
                    showToast('Glow Color → ' + (next === 'multi' ? 'Multi' : next));
                });

                labelRow.appendChild(lbl);
                labelRow.appendChild(multiToggle);

                const colorRow = document.createElement('div');
                colorRow.style.cssText = 'display:flex;align-items:center;gap:5px;flex-wrap:wrap';

                const presets = ['#1d9bf0','#ffd700','#ff6b6b','#7bed9f','#a29bfe','#ff9f43','#ffffff'];
                const curHex  = (_grpGlowClr !== 'multi' && _grpGlowClr) ? _grpGlowClr : '#1d9bf0';

                const colorInput = document.createElement('input');
                colorInput.type  = 'color';
                colorInput.value = curHex;
                colorInput.style.cssText = `
                    width:24px;height:24px;border:none;border-radius:50%;
                    padding:0;cursor:pointer;background:transparent;
                    flex-shrink:0;outline:none;
                `;
                colorInput.title = 'Custom color';

                const saveColor = (hex) => {
                    const cfg = (() => { try { return JSON.parse(GM_getValue(KEY_GROUP_PANEL_CFG, '{}')); } catch(_) { return {}; } })();
                    cfg.glowColor = hex;
                    GM_setValue(KEY_GROUP_PANEL_CFG, JSON.stringify(cfg));
                    multiToggle.style.background = 'rgba(255,255,255,.1)';
                    multiToggle.style.color      = 'rgba(255,255,255,.5)';
                };

                colorInput.addEventListener('input',  () => saveColor(colorInput.value));
                colorInput.addEventListener('change', () => saveColor(colorInput.value));

                presets.forEach(hex => {
                    const swatch = document.createElement('button');
                    swatch.type  = 'button';
                    swatch.style.cssText = `
                        width:18px;height:18px;border-radius:50%;border:2px solid ${hex === curHex ? 'rgba(255,255,255,.8)' : 'transparent'};
                        background:${hex};cursor:pointer;flex-shrink:0;padding:0;
                        transition:border-color .1s,transform .1s;
                    `;
                    swatch.addEventListener('mouseover', () => swatch.style.transform = 'scale(1.2)');
                    swatch.addEventListener('mouseout',  () => swatch.style.transform = '');
                    swatch.addEventListener('click', () => {
                        colorInput.value = hex;
                        saveColor(hex);
                        colorRow.querySelectorAll('button[data-swatch]').forEach(s => s.style.borderColor = 'transparent');
                        swatch.style.borderColor = 'rgba(255,255,255,.8)';
                    });
                    swatch.dataset.swatch = hex;
                    colorRow.appendChild(swatch);
                });

                colorRow.appendChild(colorInput);
                wrap.appendChild(labelRow);
                wrap.appendChild(colorRow);
                return wrap;
            })();
            grpGroups.append(glowColorRow);

            grpGroups.append(makeSliderRow(
                'Glow Size', _grpGlowSz, 4, 60, 2, 'px',
                null,
                (n) => {
                    const cfg = (() => { try { return JSON.parse(GM_getValue(KEY_GROUP_PANEL_CFG, '{}')); } catch(_) { return {}; } })();
                    cfg.glowSize = n;
                    GM_setValue(KEY_GROUP_PANEL_CFG, JSON.stringify(cfg));
                },
                'sp_group_glow_size'
            ));

            const labelColorRow = (() => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.06)';
                wrap.addEventListener('click', e => e.stopPropagation());

                const topRow = document.createElement('div');
                topRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:7px';
                const lbl = document.createElement('span');
                lbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,.7)';
                lbl.textContent   = 'Label Color';
                topRow.appendChild(lbl);

                const colorRow = document.createElement('div');
                colorRow.style.cssText = 'display:flex;align-items:center;gap:5px;flex-wrap:wrap';

                const txtPresets = ['#ffffff','#ffd700','#1d9bf0','#aaaaaa','#ff9f43','#7bed9f','#f368e0'];
                const curTxt = (_grpTxtClr && !['white','yellow','blue','gray'].includes(_grpTxtClr))
                    ? _grpTxtClr
                    : { white:'#ffffff', yellow:'#ffd700', blue:'#1d9bf0', gray:'#aaaaaa' }[_grpTxtClr] || '#ffffff';

                const txtInput = document.createElement('input');
                txtInput.type  = 'color';
                txtInput.value = curTxt;
                txtInput.style.cssText = 'width:24px;height:24px;border:none;border-radius:50%;padding:0;cursor:pointer;background:transparent;flex-shrink:0;outline:none';
                txtInput.title = 'Custom label color';

                const saveTxt = (hex) => {
                    const cfg = (() => { try { return JSON.parse(GM_getValue(KEY_GROUP_PANEL_CFG, '{}')); } catch(_) { return {}; } })();
                    cfg.textColor = hex;
                    GM_setValue(KEY_GROUP_PANEL_CFG, JSON.stringify(cfg));
                };
                txtInput.addEventListener('input',  () => saveTxt(txtInput.value));
                txtInput.addEventListener('change', () => saveTxt(txtInput.value));

                txtPresets.forEach(hex => {
                    const sw = document.createElement('button');
                    sw.type  = 'button';
                    sw.style.cssText = `
                        width:18px;height:18px;border-radius:50%;
                        border:2px solid ${hex === curTxt ? 'rgba(255,255,255,.8)' : 'transparent'};
                        background:${hex};cursor:pointer;flex-shrink:0;padding:0;
                        transition:border-color .1s,transform .1s;
                    `;
                    sw.addEventListener('mouseover', () => sw.style.transform = 'scale(1.2)');
                    sw.addEventListener('mouseout',  () => sw.style.transform = '');
                    sw.addEventListener('click', () => {
                        txtInput.value = hex;
                        saveTxt(hex);
                        colorRow.querySelectorAll('button[data-swatch]').forEach(s => s.style.borderColor = 'transparent');
                        sw.style.borderColor = 'rgba(255,255,255,.8)';
                    });
                    sw.dataset.swatch = hex;
                    colorRow.appendChild(sw);
                });
                colorRow.appendChild(txtInput);
                wrap.appendChild(topRow);
                wrap.appendChild(colorRow);
                return wrap;
            })();
            grpGroups.append(labelColorRow);

            const grpBtnRow = document.createElement('div');
            grpBtnRow.style.cssText = 'padding:6px 12px 10px';
            grpBtnRow.addEventListener('click', e => e.stopPropagation());

            const manageBtn = document.createElement('button');
            manageBtn.type = 'button';
            manageBtn.textContent = 'Manage Groups';
            manageBtn.style.cssText = `
                width:100%;padding:8px 0;border-radius:8px;
                border:1px solid rgba(255,255,255,.15);
                background:rgba(255,255,255,.06);
                color:rgba(255,255,255,.75);
                font-size:12px;font-weight:500;cursor:pointer;
                font-family:inherit;text-align:center;line-height:1;
                transition:background .12s,border-color .12s;
            `;
            manageBtn.addEventListener('mouseover', () => { manageBtn.style.background='rgba(255,255,255,.12)'; manageBtn.style.borderColor='rgba(255,255,255,.3)'; });
            manageBtn.addEventListener('mouseout',  () => { manageBtn.style.background='rgba(255,255,255,.06)'; manageBtn.style.borderColor='rgba(255,255,255,.15)'; });
            manageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showGroupManagerModal();
            });
            grpBtnRow.appendChild(manageBtn);
            grpGroups.append(grpBtnRow);

            const _groupChildren = [glowColorRow, labelColorRow, grpBtnRow];
            const _getGroupSliders = () => Array.from(grpGroups.body.querySelectorAll('.tm-sp-slider-row'));
            const _syncGroupChildrenDisabled = () => {
                const isOn = GM_getValue(KEY_GROUP_ON_DOWNLOAD, false);
                [..._groupChildren, ..._getGroupSliders()].forEach(el => {
                    el.classList.toggle('tm-sp-disabled-child', !isOn);
                });
            };
            _syncGroupChildrenDisabled();

            const grpCorner = makeGroup('📌  Corner Position', true, null, () => {
                markFeatureSeen('sp_corner_position');
            });

            if (isFeatureNew('sp_corner_position')) {
                const grpCornerHeader = panel.querySelector('.tm-sp-group-header:last-of-type') ||
                    panel.querySelectorAll('.tm-sp-group-header')[panel.querySelectorAll('.tm-sp-group-header').length - 1];
                if (grpCornerHeader) {
                    const newBadge = document.createElement('span');
                    newBadge.className = 'tm-sp-new-badge';
                    newBadge.textContent = 'NEW';
                    newBadge.style.marginLeft = '6px';
                    const chevron = grpCornerHeader.querySelector('.tm-sp-group-chevron');
                    grpCornerHeader.insertBefore(newBadge, chevron);
                }
            }

            const _curCorner = GM_getValue(KEY_GEAR_CORNER, 'tr');
            const cornerRow = document.createElement('div');
            cornerRow.style.cssText = `padding: 10px 12px 12px; display: flex; justify-content: center;`;

            const cornerGrid = document.createElement('div');
            cornerGrid.style.cssText = `
                display: grid; grid-template-columns: 1fr 1fr 1fr;
                gap: 6px; width: 210px;
            `;

            const CORNERS = [
                { value: 'tl', label: '↖ Top Left',      row: 1, col: 1, dotH: 'flex-start', dotV: 'flex-start' },
                { value: 'tc', label: '↑ Top Center',     row: 1, col: 2, dotH: 'center',      dotV: 'flex-start' },
                { value: 'tr', label: '↗ Top Right',      row: 1, col: 3, dotH: 'flex-end',    dotV: 'flex-start' },
                { value: 'lc', label: '← Left Center',    row: 2, col: 1, dotH: 'flex-start', dotV: 'center'      },
                { value: 'rc', label: '→ Right Center',   row: 2, col: 3, dotH: 'flex-end',    dotV: 'center'      },
                { value: 'bl', label: '↙ Bottom Left',    row: 3, col: 1, dotH: 'flex-start', dotV: 'flex-end'    },
                { value: 'bc', label: '↓ Bottom Center',  row: 3, col: 2, dotH: 'center',      dotV: 'flex-end'    },
                { value: 'br', label: '↘ Bottom Right',   row: 3, col: 3, dotH: 'flex-end',    dotV: 'flex-end'    },
            ];

            let _centerClicks = 0;

            const _eggBubble = (() => {
                const el = document.createElement('div');
                el.style.cssText = `
                    display: none; position: fixed; z-index: 9999999;
                    background: #fff; color: #111;
                    border: 2.5px solid #111; border-radius: 12px;
                    padding: 10px 14px; font-size: 12px; font-weight: 700;
                    font-family: system-ui, sans-serif; line-height: 1.6;
                    white-space: pre-line; pointer-events: none;
                    box-shadow: 3px 3px 0 #111;
                    max-width: 240px;
                    animation: none;
                `;
                const tail = document.createElement('div');
                tail.style.cssText = `
                    position: absolute; top: 100%; left: 50%;
                    transform: translateX(-50%);
                    width: 0; height: 0;
                    border-left: 9px solid transparent;
                    border-right: 9px solid transparent;
                    border-top: 10px solid #111;
                `;
                const tailInner = document.createElement('div');
                tailInner.style.cssText = `
                    position: absolute; top: -12px; left: 50%;
                    transform: translateX(-50%);
                    width: 0; height: 0;
                    border-left: 7px solid transparent;
                    border-right: 7px solid transparent;
                    border-top: 9px solid #fff;
                `;
                tail.appendChild(tailInner);
                el.appendChild(tail);
                document.body.appendChild(el);
                return el;
            })();

            const _positionBubble = (anchorEl) => {
                const r = anchorEl.getBoundingClientRect();
                _eggBubble.style.left = (r.left + r.width / 2) + 'px';
                _eggBubble.style.transform = 'translateX(-50%)';
                _eggBubble.style.top = (r.top - 10) + 'px';
                requestAnimationFrame(() => {
                    const bh = _eggBubble.offsetHeight;
                    const topAbove = r.top - bh - 10;
                    if (topAbove < 8) {
                        _eggBubble.style.top = (r.bottom + 10) + 'px';
                        const tail = _eggBubble.lastChild;
                        tail.style.top = '-10px';
                        tail.style.bottom = 'auto';
                        tail.style.borderTop = 'none';
                        tail.style.borderBottom = '10px solid #111';
                        tail.firstChild.style.top = '3px';
                        tail.firstChild.style.borderTop = 'none';
                        tail.firstChild.style.borderBottom = '9px solid #fff';
                    } else {
                        _eggBubble.style.top = topAbove + 'px';
                        const tail = _eggBubble.lastChild;
                        tail.style.top = '100%';
                        tail.style.bottom = 'auto';
                        tail.style.borderTop = '10px solid #111';
                        tail.style.borderBottom = 'none';
                        tail.firstChild.style.top = '-12px';
                        tail.firstChild.style.borderTop = '9px solid #fff';
                        tail.firstChild.style.borderBottom = 'none';
                    }
                });
            };

            const _showEggBubble = (text, anchorEl) => {
                const tail = _eggBubble.lastChild;
                _eggBubble.textContent = text;
                _eggBubble.appendChild(tail);
                _eggBubble.style.display = 'block';
                _positionBubble(anchorEl);
            };

            const _hideEggBubble = () => { _eggBubble.style.display = 'none'; };

            document.addEventListener('click', (e) => {
                if (!e.target.closest('#tm-settings-wrapper')) _hideEggBubble();
            }, { capture: true, passive: true });

            for (let r = 1; r <= 3; r++) {
                for (let cl = 1; cl <= 3; cl++) {
                    if (r === 2 && cl === 2) {
                        const eggCell = document.createElement('button');
                        eggCell.type = 'button';
                        eggCell.title = '·';
                        eggCell.dataset.cornerValue = 'cc';
                        eggCell.style.cssText = `
                            width: 64px; height: 44px; border-radius: 8px; cursor: pointer;
                            border: 1.5px solid ${C.border}; background: transparent;
                            position: relative; display: flex;
                            align-items: center; justify-content: center;
                            padding: 6px; transition: border-color .12s, background .12s;
                            font-family: inherit;
                        `;
                        const eggDot = document.createElement('div');
                        eggDot.style.cssText = `
                            width: 6px; height: 6px; border-radius: 50%;
                            background: ${C.sub}; opacity: 0.35;
                        `;
                        eggCell.appendChild(eggDot);

                        eggCell.addEventListener('click', (e) => {
                            e.stopPropagation();
                            _centerClicks++;

                            if (_centerClicks === 1) {
                                let blinks = 0;
                                const blink = () => {
                                    cornerGrid.style.opacity = cornerGrid.style.opacity === '0.15' ? '1' : '0.15';
                                    blinks++;
                                    if (blinks < 6) setTimeout(blink, 75);
                                    else cornerGrid.style.opacity = '1';
                                };
                                blink();
                                setTimeout(() => _showEggBubble('Are you sure? 🤔', eggCell), 500);

                            } else if (_centerClicks === 2) {
                                _showEggBubble(
                                    "Okay, I admit it.\nTop / Bottom / Left / Right Center?\nCompletely made up — just to fill the grid. 😅\n\nClick again if you really mean it.",
                                    eggCell
                                );

                            } else if (_centerClicks >= 3) {
                                _animateWrapperToCorner('cc');
                                wrapper.setAttribute('data-open', 'false');
                                _centerClicks = 999;
                                const _gearBtn = document.getElementById('tm-settings-gear-btn');
                                setTimeout(() => {
                                    const anchor = _gearBtn || eggCell;
                                    _showEggBubble("See? You and I both messed this up.\nCongrats on finding it! 🎉", anchor);

                                    setTimeout(() => {
                                        if (!document.getElementById('tm-egg-anim-style')) {
                                            const s = document.createElement('style');
                                            s.id = 'tm-egg-anim-style';
                                            s.textContent = `
                                                @keyframes tm-egg-ptcl {
                                                    0%   { opacity: 1; transform: translate(0, 0) scale(1) rotate(var(--ptcl-rot, 0deg)); }
                                                    60%  { opacity: 0.75; }
                                                    100% { opacity: 0; transform: translate(var(--ptcl-dx), var(--ptcl-dy)) scale(0.15) rotate(var(--ptcl-rot, 0deg)); }
                                                }
                                            `;
                                            document.head.appendChild(s);
                                        }

                                        const wRect  = wrapper.getBoundingClientRect();
                                        const cx     = Math.round(wRect.left + wRect.width  / 2);
                                        const cy     = Math.round(wRect.top  + wRect.height / 2);
                                        const N      = 10;
                                        const COLORS = ['#1d9bf0', '#f59e0b', '#e2e8f0', '#f472b6', '#a78bfa'];
                                        const ptcls  = [];

                                        for (let i = 0; i < N; i++) {
                                            const angle = (i / N) * Math.PI * 2;
                                            const dist  = 55 + (i % 3) * 18;
                                            const dx    = Math.round(Math.cos(angle) * dist);
                                            const dy    = Math.round(Math.sin(angle) * dist);
                                            const size  = 4 + (i % 3);
                                            const color = COLORS[i % COLORS.length];
                                            const dur   = 950 + (i % 3) * 80;
                                            const delay = i * 30;
                                            const rot = i % 2 !== 0 ? '45deg' : '0deg';

                                            const p = document.createElement('div');
                                            p.style.cssText = `
                                                position:fixed; pointer-events:none; z-index:9999991;
                                                left:${cx - Math.floor(size / 2)}px;
                                                top:${cy  - Math.floor(size / 2)}px;
                                                width:${size}px; height:${size}px;
                                                background:${color};
                                                border-radius:${i % 2 === 0 ? '50%' : '1.5px'};
                                                --ptcl-dx:${dx}px; --ptcl-dy:${dy}px; --ptcl-rot:${rot};
                                                animation: tm-egg-ptcl ${dur}ms ${delay}ms ease-out forwards;
                                            `;
                                            document.body.appendChild(p);
                                            ptcls.push(p);
                                        }

                                        setTimeout(() => ptcls.forEach(p => p.remove()), 1500);

                                    }, 400);

                                    setTimeout(() => {
                                        _hideEggBubble();
                                        eggCell.style.visibility = 'hidden';
                                        eggCell.style.pointerEvents = 'none';
                                    }, 3500);
                                }, 120);
                            }
                        });

                        cornerGrid.appendChild(eggCell);
                        continue;
                    }
                    const c = CORNERS.find(x => x.row === r && x.col === cl);
                    if (!c) continue;
                    const cell = document.createElement('button');
                    cell.type = 'button';
                    cell.title = c.label;
                    const isActive = _curCorner === c.value;
                    cell.style.cssText = `
                        width: 64px; height: 44px; border-radius: 8px; cursor: pointer;
                        border: 1.5px solid ${isActive ? '#1d9bf0' : C.border};
                        background: ${isActive ? 'rgba(29,155,240,.12)' : 'transparent'};
                        position: relative; display: flex;
                        align-items: ${c.dotV}; justify-content: ${c.dotH};
                        padding: 6px; transition: border-color .12s, background .12s;
                        font-family: inherit;
                    `;
                    const dot = document.createElement('div');
                    dot.style.cssText = `
                        width: 10px; height: 10px; border-radius: 50%;
                        background: ${isActive ? '#1d9bf0' : C.sub};
                        transition: background .12s;
                    `;
                    cell.appendChild(dot);
                    cell.addEventListener('click', () => {
                        GM_setValue(KEY_GEAR_CORNER, c.value);
                        _animateWrapperToCorner(c.value);
                        wrapper.setAttribute('data-open', 'false');
                        showToast('📌 Corner → ' + c.label);
                        cornerGrid.querySelectorAll('button').forEach(b => {
                            const bv = b.dataset.cornerValue;
                            const bActive = bv === c.value;
                            b.style.border = `1.5px solid ${bActive ? '#1d9bf0' : C.border}`;
                            b.style.background = bActive ? 'rgba(29,155,240,.12)' : 'transparent';
                            const bDot = b.querySelector('div');
                            if (bDot) bDot.style.background = bActive ? '#1d9bf0' : C.sub;
                        });
                    });
                    cell.dataset.cornerValue = c.value;
                    cornerGrid.appendChild(cell);
                }
            }

            cornerRow.appendChild(cornerGrid);
            grpCorner.append(cornerRow);

            const HIST_TOOLTIP = 'Hidden feature: The history panel has invisible dock triggers on its left & right edges. Click them to auto-hide the panel to the screen edge!';
            const grpHist = makeGroup('🗂  History Panel', false, HIST_TOOLTIP, showDockSpotlight);

            const _DS = {
                bg:    'rgba(255,255,255,0.06)',
                strip: 'rgba(255,255,255,0.12)',
                blue:  'rgba(29,155,240,0.7)',
                blueL: 'rgba(29,155,240,0.35)',
                sub:   'rgba(255,255,255,0.25)',
            };
            const dockStyleOpts = [
                {
                    value: 'notch', label: 'Notch',
                    svg: `<svg viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="0" width="10" height="52" rx="1" fill="${_DS.bg}"/><rect x="12" y="20" width="4" height="12" rx="2" fill="${_DS.blue}"/></svg>`,
                },
                {
                    value: 'ruler', label: 'Ruler',
                    svg: `<svg viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="0" width="10" height="52" rx="1" fill="${_DS.strip}"/><line x1="9" y1="4"  x2="19" y2="4"  stroke="${_DS.blue}"  stroke-width="1.5"/><line x1="9" y1="10" x2="15" y2="10" stroke="${_DS.blueL}" stroke-width="0.8"/><line x1="9" y1="16" x2="15" y2="16" stroke="${_DS.blueL}" stroke-width="0.8"/><line x1="9" y1="22" x2="19" y2="22" stroke="${_DS.blue}"  stroke-width="1.5"/><line x1="9" y1="28" x2="15" y2="28" stroke="${_DS.blueL}" stroke-width="0.8"/><line x1="9" y1="34" x2="15" y2="34" stroke="${_DS.blueL}" stroke-width="0.8"/><line x1="9" y1="40" x2="19" y2="40" stroke="${_DS.blue}"  stroke-width="1.5"/><line x1="9" y1="46" x2="15" y2="46" stroke="${_DS.blueL}" stroke-width="0.8"/></svg>`,
                },
                {
                    value: 'ghost', label: 'Ghost',
                    svg: `<svg viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="0" width="8" height="52" rx="1" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1" stroke-dasharray="3 4"/><line x1="10" y1="7"  x2="18" y2="7"  stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/><line x1="10" y1="14" x2="18" y2="14" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/><line x1="10" y1="21" x2="18" y2="21" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/><line x1="10" y1="28" x2="18" y2="28" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/><line x1="10" y1="35" x2="18" y2="35" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/><line x1="10" y1="42" x2="18" y2="42" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/></svg>`,
                },
                {
                    value: 'pill', label: 'Pill',
                    svg: `<svg viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="11" y="0" width="6" height="52" rx="0" fill="${_DS.bg}"/><rect x="11" y="16" width="6" height="20" rx="3" fill="${_DS.blue}"/></svg>`,
                },
                {
                    value: 'arrow', label: 'Arrow',
                    svg: `<svg viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="0" width="8" height="52" rx="1" fill="${_DS.bg}"/><path d="M12 21 L17 26 L12 31" stroke="${_DS.blue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
                },
                {
                    value: 'dots', label: 'Dots',
                    svg: `<svg viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="0" width="8" height="52" rx="1" fill="${_DS.bg}"/><circle cx="14" cy="19" r="1.8" fill="${_DS.sub}"/><circle cx="14" cy="26" r="1.8" fill="${_DS.blue}"/><circle cx="14" cy="33" r="1.8" fill="${_DS.sub}"/></svg>`,
                },
            ];
            grpHist.append(makeDockStylePickerRow('Dock Style', dockStyleOpts, dockStyle, (next) => {
                GM_setValue(KEY_DOCK_STYLE, next);
                showToast('🗂 Dock Style → ' + (dockStyleOpts.find(o => o.value === next)?.label ?? next));
                const curTab = document.getElementById('tm-hist-dock-tab');
                if (curTab) {
                    const sideClass = [...curTab.classList].find(c => c.startsWith('side-')) ?? '';
                    curTab.className = 'style-' + next + (sideClass ? ' ' + sideClass : '');
                    curTab.innerHTML = '';
                    if (next === 'dots') {
                        for (let i = 0; i < 3; i++) {
                            const d = document.createElement('span');
                            d.className = 'tm-dock-dot';
                            curTab.appendChild(d);
                        }
                    }
                }
            }, 'sp_dock_picker'));

            grpHist.append(makeSliderRow(
                'Hover Delay', dockHoverDelay, 100, 3000, 50, 'ms',
                null,
                (n) => { GM_setValue(KEY_DOCK_HOVER_DELAY, String(n)); showToast('⏱ Hover Delay → ' + n + ' ms'); },
                'sp_slider_controls'
            ));

            grpHist.append(makeSliderRow(
                'Trigger Distance ◀ Left', dockTriggerL, 20, 120, 5, 'px',
                (n) => {
                    const hotzone = document.querySelector('#tm-hist-dock-tab.side-left .tm-dock-hotzone');
                    if (hotzone) hotzone.style.width = n + 'px';
                },
                (n) => { GM_setValue(KEY_DOCK_TRIGGER_L, String(n)); },
                'sp_slider_controls'
            ));

            grpHist.append(makeSliderRow(
                'Trigger Distance ▶ Right', dockTriggerR, 20, 120, 5, 'px',
                (n) => {
                    const hotzone = document.querySelector('#tm-hist-dock-tab.side-right .tm-dock-hotzone');
                    if (hotzone) hotzone.style.width = n + 'px';
                },
                (n) => { GM_setValue(KEY_DOCK_TRIGGER_R, String(n)); },
                'sp_slider_controls'
            ));

            const helpLabel = T.menu_help ? T.menu_help.replace(/^📖\s*/, '') : 'Help / Manual';
            const helpRow = makeRow('📖 ' + helpLabel, '', () => {
                showHelpModal();
            });
            helpRow.style.borderTop = `1px solid ${C.border}`;
            panel.appendChild(helpRow);
        }

        buildContent();

        gearBtn.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = wrapper.getAttribute('data-open') === 'true';
            wrapper.setAttribute('data-open', String(!isOpen));
            if (!isOpen) {
                gearBtn.querySelector('.tm-gear-notify-dot')?.remove();
                GM_setValue(KEY_GEAR_DOT_SEEN, NEW_FEATURE_IDS.length);
            }
        });

        document.addEventListener('click', e => {
            if (wrapper.contains(e.target)) return;
            if (e.target.closest('#tm-group-modal-overlay'))  return;
            if (e.target.closest('#tm-group-mgr-overlay'))    return;
            if (e.target.closest('.tm-sp-picker'))            return;
            wrapper.setAttribute('data-open', 'false');
        });

        wrapper.appendChild(dismissBtn);
        wrapper.appendChild(histBtn);

        if (!_isTwitterDomain) {
            const SVG_REFRESH = `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.93"/></svg>`;
            const refreshBtn = document.createElement('button');
            refreshBtn.id    = 'tm-refresh-hist-btn';
            refreshBtn.title = 'Refresh Download History';
            refreshBtn.innerHTML = SVG_REFRESH;
            refreshBtn.style.cssText = `
                position:absolute; right:0; top:0;
                width:20px; height:20px;
                border-radius:50%; border:none;
                background:rgba(255,255,255,.12);
                color:rgba(255,255,255,.4);
                cursor:pointer; padding:0;
                display:flex; align-items:center; justify-content:center;
                opacity:0; transition:opacity .2s, color .15s;
                z-index:10;
            `;
            refreshBtn.onmouseenter = () => refreshBtn.style.color = 'rgba(255,255,255,.85)';
            refreshBtn.onmouseleave = () => refreshBtn.style.color = 'rgba(255,255,255,.4)';

            refreshBtn.addEventListener('click', e => {
                e.stopPropagation();

                refreshBtn.classList.remove('tm-refreshing');
                void refreshBtn.offsetWidth;
                refreshBtn.classList.add('tm-refreshing');
                setTimeout(() => refreshBtn.classList.remove('tm-refreshing'), 650);

                const panel = document.getElementById('tm-hist-panel');
                if (panel) {
                    panel.dispatchEvent(new CustomEvent('tm-hist-refresh'));
                    let count = 0;
                    try { count = JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]')).length; } catch (_) {}
                    showToast(`🔄 History refreshed · ${count} record${count !== 1 ? 's' : ''}`);
                } else {
                    showHistoryPanel();
                }
            });

            wrapper.appendChild(refreshBtn);
        }

        wrapper.appendChild(gearBtn);
        wrapper.appendChild(panel);
        document.body.appendChild(wrapper);
    }

    const _downloadedIds = (() => {
        try {
            const arr = JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]'));
            return new Set(arr.map(r => r.tweetId));
        } catch (_) { return new Set(); }
    })();

    let _historyUndoBuffer = null;
    let _historyUndoTimer  = null;

    let _dockSideGlobal         = null;
    let _dockTabElGlobal        = null;
    let _dockHoverTimerGlobal   = null;
    let _dockPeekedGlobal       = false;
    let _dockRetractTimerGlobal = null;
    let _dockSnapshotGlobal     = null;
    let _dialogOpenGlobal       = false;

    (function _restorePersistedDock() {
        const persisted = GM_getValue(KEY_DOCK_PERSISTED, '');
        if (persisted === 'left' || persisted === 'right') {
            _dockSideGlobal = persisted;
            requestAnimationFrame(() => {
                showHistoryPanel();
            });
        }
    })();

    function _getTweetIdFromArticle(article) {
        for (const lk of article.querySelectorAll('a[href*="/status/"]')) {
            const m = lk.getAttribute('href')?.match(/\/status\/(\d+)/);
            if (m) return m[1];
        }
        return null;
    }

    function _applyHistoryBadge(btn) {
        if (!btn || btn.querySelector('.tm-hist-badge')) return;
        const badge = document.createElement('span');
        badge.className = 'tm-hist-badge';
        badge.style.cssText = `
            position: absolute; top: 6px; right: 6px;
            width: 8px; height: 8px; border-radius: 50%;
            background: #00ba7c; pointer-events: none;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.65);
            animation: tm-pop-bounce 0.35s cubic-bezier(0.175,0.885,0.32,1.275) both;
            z-index: 10;
        `;
        btn.appendChild(badge);
    }

    let _pendingGroupRecordId = null;
    let _pendingStarPipEl     = null;

    window.addEventListener('scroll', () => { if (!_fanOpen) hideStarPip(); }, { passive: true, capture: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { if (_fanOpen) closeGroupFan(); hideStarPip(); } });
    (() => {
        const _wrap = fn => function(...args) {
            const r = fn.apply(this, args);
            hideStarPip?.();
            if (GM_getValue(KEY_HIST_PINNED, false) && !document.getElementById('tm-hist-panel')) {
                setTimeout(() => {
                    if (GM_getValue(KEY_HIST_PINNED, false) && !document.getElementById('tm-hist-panel')) {
                        showHistoryPanel();
                    }
                }, 300);
            }
            return r;
        };
        history.pushState    = _wrap(history.pushState);
        history.replaceState = _wrap(history.replaceState);
    })();

    function getGroups() {
        try { return JSON.parse(GM_getValue(KEY_GROUPS, '[]')); } catch (_) { return []; }
    }

    function saveGroups(arr) {
        GM_setValue(KEY_GROUPS, JSON.stringify(arr));
    }

    function createGroup(name, icon = '📁', glow = 'rgba(80,160,240,.5)') {
        const groups = getGroups();
        const group = {
            id:        'g_' + Date.now(),
            name:      name.slice(0, 24),
            icon,
            glow,
            createdAt: Date.now(),
        };
        groups.push(group);
        saveGroups(groups);
        return group;
    }

    function deleteGroup(groupId) {
        const groups = getGroups().filter(g => g.id !== groupId);
        saveGroups(groups);
        try {
            const records = JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]'));
            records.forEach(r => { if (r.groupId === groupId) delete r.groupId; });
            GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));
        } catch (_) {}
    }

    function assignGroup(recordId, groupId) {
        try {
            const records = JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]'));
            const rec = records.find(r => r.id === recordId);
            if (!rec) return;
            if (groupId === null) {
                delete rec.groupId;
            } else {
                rec.groupId = groupId;
            }
            GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));
            if (groupId !== null) {
                GM_setValue('app_group_unread_' + groupId, true);
            }
            const existPanel = document.getElementById('tm-hist-panel');
            if (existPanel) existPanel.dispatchEvent(new CustomEvent('tm-hist-refresh'));
        } catch (e) { console.error('[TMGroup] assignGroup error:', e); }
    }

    const STAR_AUTO_HIDE_SEC = 5;
    const STAR_FLOAT_CLS     = ['tm-float-a','tm-float-b','tm-float-c','tm-float-d','tm-float-e'];
    const STAR_GLOW_COLORS   = [
        'rgba(80,200,180,.28)', 'rgba(160,100,240,.28)', 'rgba(240,160,80,.28)',
        'rgba(240,100,100,.28)', 'rgba(80,160,240,.28)',  'rgba(200,200,80,.28)',
        'rgba(180,80,200,.28)', 'rgba(100,200,120,.28)',  'rgba(240,120,160,.28)',
        'rgba(220,160,60,.28)',
    ];
    let _starAutoHideTimer = null;
    let _fanNodes          = [];
    let _fanOpen           = false;
    let _selectedIconId    = null;

    function popStarPip(mediaBtnEl) {
        const pip = document.getElementById('tm-star-pip');
        if (!pip) return;

        if (mediaBtnEl) {
            _pendingStarPipEl = pip;
            const r = mediaBtnEl.getBoundingClientRect();
            pip.style.left = (r.right + 2) + 'px';
            pip.style.top  = (r.top   - 9) + 'px';
        }

        pip.classList.add('tm-popped');

        clearTimeout(_starAutoHideTimer);
        _starAutoHideTimer = setTimeout(() => {
            if (!_fanOpen) hideStarPip();
        }, STAR_AUTO_HIDE_SEC * 1000);
    }

    function hideStarPip() {
        const pip = document.getElementById('tm-star-pip');
        if (!pip) return;
        pip.classList.remove('tm-popped');
        clearTimeout(_starAutoHideTimer);
        _pendingStarPipEl = null;
    }

    function onStarPipClick() {
        if (_fanOpen) closeGroupFan();
        else openGroupFan();
    }

    function _layerCfg(n) {
        if (n <= 5)  return [{c:n,  r:62}];
        if (n <= 12) return [{c:Math.min(5,n), r:60}, {c:n-Math.min(5,n), r:108}];
        const l1=5, l2=Math.min(7,n-5);
        return [{c:l1,r:60},{c:l2,r:108},{c:n-l1-l2,r:155}];
    }

    function _fanPositions(n, cx, cy) {
        const pos = [];
        const spanDeg = n > 10 ? 80 : 70;
        _layerCfg(n).forEach(({c, r}) => {
            const startDeg = -spanDeg, endDeg = spanDeg;
            const range = endDeg - startDeg;
            for (let i = 0; i < c; i++) {
                const deg = c === 1 ? 0 : startDeg + range * i / (c - 1);
                const rad = deg * Math.PI / 180;
                const horizBoost = Math.max(0, 1 - Math.abs(deg) / 30) * 14;
                const rr = r + horizBoost;
                pos.push({ x: cx + rr * Math.cos(rad) - 16, y: cy + rr * Math.sin(rad) - 16 });
            }
        });
        return pos;
    }

    function _spawnRipple(cx, cy) {
        const r = document.createElement('div');
        r.className = 'tm-ripple-ring';
        const sz = 18;
        r.style.cssText = `width:${sz}px;height:${sz}px;left:${cx}px;top:${cy}px`;
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 560);
    }

    function _getStarPipPos() {
        const pip = document.getElementById('tm-star-pip');
        if (!pip) return { cx: 0, cy: 0 };
        const r = pip.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    }

    function _buildFanDom() {
        _fanNodes.forEach(n => n.remove());
        _fanNodes = [];

        const _cfg      = (() => { try { return JSON.parse(GM_getValue(KEY_GROUP_PANEL_CFG, '{}')); } catch(_) { return {}; } })();
        const _glowClr  = _cfg.glowColor || 'multi';
        const _glowSz   = Number(_cfg.glowSize  ?? 12);
        const _txtClrMap = { white: 'rgba(255,255,255,.7)', yellow: 'rgba(255,220,60,.85)', blue: 'rgba(29,155,240,.9)', gray: 'rgba(180,180,180,.65)' };
        const _txtClr   = _cfg.textColor
            ? (_txtClrMap[_cfg.textColor] || _cfg.textColor)
            : _txtClrMap.white;
        const _glowPx   = Math.max(4, Math.min(60, _glowSz));

        const groups = getGroups();
        groups.forEach((g, i) => {
            const baseGlow = _glowClr === 'multi'
                ? (g.glow || STAR_GLOW_COLORS[i % STAR_GLOW_COLORS.length])
                : _glowClr + '85';
            const half = Math.round(_glowPx / 2);

            const ic       = _resolveGroupIcon(g.icon);
            const iconHtml = `<div style="width:18px;height:18px;color:${ic.color};flex-shrink:0">${ic.svg}</div>`;

            const el = document.createElement('div');
            el.className = 'tm-fan-node ' + STAR_FLOAT_CLS[i % STAR_FLOAT_CLS.length];
            el.style.cssText = 'left:-300px;top:-300px;opacity:0';
            el.innerHTML = `
                <div class="tm-fan-node-inner">
                    <div class="tm-fan-glow" style="background:radial-gradient(circle,${baseGlow} 0%,transparent 68%);inset:-${half}px"></div>
                    ${iconHtml}
                </div>
                <span class="tm-fan-label" style="color:${_txtClr}">${_escHtml(g.name)}</span>`;
            el.addEventListener('click', () => _onFanGroupClick(g.id, g.name));
            document.body.appendChild(el);
            _fanNodes.push(el);
        });

    }

    function _countGroupRecords(groupId) {
        try {
            const records = JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]'));
            return records.filter(r => r.groupId === groupId).length;
        } catch (_) { return 0; }
    }

    let _starEscaping = false;

    function _runStarEscapeAnim(callback) {
        const pip = document.getElementById('tm-star-pip');
        if (!pip || _starEscaping) { if (!pip) callback?.(); return; }
        _starEscaping = true;

        clearTimeout(_starAutoHideTimer);

        pip.classList.add('tm-escaping');

        const rect = pip.getBoundingClientRect();

        const directions = [
            { dx:  220, dy: -180, rot:  340 },
            { dx:  180, dy:  200, rot: -320 },
            { dx:  260, dy:  -60, rot:  380 },
            { dx:  200, dy:  140, rot: -360 },
        ];
        const dir = directions[Math.floor(Math.random() * directions.length)];

        pip.style.transition = 'transform .12s cubic-bezier(.4,0,.2,1)';
        pip.style.transform  = 'scale(0.7) translate(-6px, 2px)';

        setTimeout(() => {
            pip.style.transition = 'transform .42s cubic-bezier(.2,0,.8,1), opacity .38s ease .08s';
            pip.style.transform  = `translate(${dir.dx}px, ${dir.dy}px) rotate(${dir.rot}deg) scale(0.15)`;
            pip.style.opacity    = '0';
        }, 130);

        setTimeout(() => {
            pip.style.transition = 'none';
            pip.style.transform  = '';
            pip.style.opacity    = '';
            pip.classList.remove('tm-popped', 'tm-escaping');
            _pendingStarPipEl = null;
            _starEscaping = false;
            callback?.();
        }, 600);
    }

    function openGroupFan() {
        if (!getGroups().length) {
            _runStarEscapeAnim(() => showGroupCreateModal());
            return;
        }

        _fanOpen = true;
        _buildFanDom();
        const { cx, cy } = _getStarPipPos();
        const groups = getGroups();
        const positions = _fanPositions(groups.length, cx, cy);
        const pip = document.getElementById('tm-star-pip');
        if (pip) pip.classList.add('tm-lit');

        _spawnRipple(cx, cy);
        setTimeout(() => _spawnRipple(cx, cy), 110);

        _fanNodes.forEach((node, i) => {
            const pos = positions[i];
            node.style.cssText = `left:${cx-16}px;top:${cy-16}px;opacity:0;transition:none`;
            node.classList.remove('tm-spawned');
            const delay = 20 + i * 46;
            setTimeout(() => {
                node.style.transition = `opacity .26s ease ${delay}ms, left .42s cubic-bezier(.34,1.56,.64,1) ${delay}ms, top .42s cubic-bezier(.34,1.56,.64,1) ${delay}ms`;
                node.style.left    = pos.x + 'px';
                node.style.top     = pos.y + 'px';
                node.style.opacity = '1';
                setTimeout(() => node.classList.add('tm-spawned'), delay + 380);
            }, 10);
        });
    }

    function closeGroupFan() {
        _fanOpen = false;
        const { cx, cy } = _getStarPipPos();
        const pip = document.getElementById('tm-star-pip');
        if (pip) pip.classList.remove('tm-lit');
        _fanNodes.forEach(node => {
            node.classList.remove('tm-spawned');
            node.style.transition = 'opacity .15s ease, left .22s cubic-bezier(.6,0,.2,1), top .22s cubic-bezier(.6,0,.2,1)';
            node.style.left    = (cx - 16) + 'px';
            node.style.top     = (cy - 16) + 'px';
            node.style.opacity = '0';
        });
        setTimeout(() => {
            _fanNodes.forEach(n => n.remove());
            _fanNodes = [];
        }, 300);
    }

    function _onFanGroupClick(groupId, groupName) {
        assignGroup(_pendingGroupRecordId, groupId);
        _pendingGroupRecordId = null;
        showToast(`⭐ → ${groupName}`);
        closeGroupFan();
        _runStarEscapeAnim(() => hideStarPip());
    }

    document.addEventListener('click', e => {
        if (!_fanOpen) return;
        if (e.target.closest('.tm-fan-node') ||
            e.target.closest('#tm-star-pip')  ||
            e.target.closest('.tm-group-modal-overlay')) return;
        closeGroupFan();
    }, true);

    const _GROUP_SVG_ICONS = [
        { id:'travel',  label:'Travel',  color:'#4dd0e1', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 1 8 8c0 5.5-8 13-8 13S4 15.5 4 10a8 8 0 0 1 8-8z"/></svg>' },
        { id:'art',     label:'Art',     color:'#ce93d8', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 1 4-4 4 4 0 0 1 4 4"/><circle cx="8.5" cy="9" r=".8" fill="currentColor"/><circle cx="15.5" cy="9" r=".8" fill="currentColor"/></svg>' },
        { id:'photo',   label:'Photo',   color:'#ffb74d', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="6" width="20" height="15" rx="2"/><circle cx="12" cy="13.5" r="3"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/></svg>' },
        { id:'music',   label:'Music',   color:'#f48fb1', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
        { id:'food',    label:'Food',    color:'#a5d6a7', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="8"/><line x1="10" y1="2" x2="10" y2="8"/><line x1="14" y1="2" x2="14" y2="8"/></svg>' },
        { id:'game',    label:'Game',    color:'#80cbc4', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="3"/><path d="M7 11v4M5 13h4"/><circle cx="16.5" cy="12" r=".8" fill="currentColor"/><circle cx="18.5" cy="14" r=".8" fill="currentColor"/></svg>' },
        { id:'nature',  label:'Nature',  color:'#c5e1a5', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22V12"/><path d="M5 12c0-4 3-7 7-7s7 3 7 7c0 2.5-1.5 4.5-4 5.5"/><path d="M3 18c0-2.5 2-4 4.5-4C9 14 10 15.5 12 16"/></svg>' },
        { id:'book',    label:'Book',    color:'#ffcc80', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
        { id:'star',    label:'Fav',     color:'#fff176', svg:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
        { id:'work',    label:'Work',    color:'#b0bec5', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>' },
        { id:'sport',   label:'Sport',   color:'#ef9a9a', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93c2.34 2.34 3.07 5.71 2.07 8.71M19.07 4.93c-2.34 2.34-3.07 5.71-2.07 8.71M4.93 19.07c2.34-2.34 5.71-3.07 8.71-2.07M19.07 19.07c-2.34-2.34-5.71-3.07-8.71-2.07"/></svg>' },
        { id:'video',   label:'Video',   color:'#ff8a65', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="4" width="15" height="16" rx="2"/><path d="M17 8l5-3v14l-5-3V8z"/></svg>' },
        { id:'pet',     label:'Pet',     color:'#ffab91', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="14" r="6"/><circle cx="7" cy="6" r="2"/><circle cx="17" cy="6" r="2"/><circle cx="4" cy="11" r="1.5"/><circle cx="20" cy="11" r="1.5"/></svg>' },
        { id:'fashion', label:'Fashion', color:'#f8bbd0', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>' },
        { id:'finance', label:'Finance', color:'#a5d6a7', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { id:'tech',    label:'Tech',    color:'#90caf9', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
        { id:'health',  label:'Health',  color:'#ef9a9a', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
        { id:'news',    label:'News',    color:'#b0bec5', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><line x1="18" y1="2" x2="18" y2="22"/><line x1="8" y1="10" x2="14" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg>' },
        { id:'flower',  label:'Flower',  color:'#f48fb1', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zm0 14a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zm10-7a3 3 0 0 1 0 6 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM2 12a3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3zm12.24-5.76a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24zm-8.48 0a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24zm0 8.48a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24zm8.48 0a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24z"/></svg>' },
        { id:'fire',    label:'Fire',    color:'#ff7043', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 0-4 4-4 9a4 4 0 0 0 8 0c0-2-1-4-1-4s-1 2-3 2c-1 0-2-1-2-2 0-2 2-5 2-5z"/><path d="M12 22c-3.31 0-6-2.69-6-6 0-2.5 1.5-4.5 1.5-4.5S9 13 12 13s4.5-1.5 4.5-1.5S18 13.5 18 16c0 3.31-2.69 6-6 6z"/></svg>' },
        { id:'brain',   label:'Brain',   color:'#ce93d8', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3a3 3 0 0 1 6 0"/><path d="M12 3v3"/><path d="M6.6 5A5 5 0 0 0 4 9.5c0 1.8.8 3.4 2 4.5v4a1 1 0 0 0 1 1h2v-3h2v3h2a1 1 0 0 0 1-1v-4a6 6 0 0 0 2-4.5A5 5 0 0 0 17.4 5"/><path d="M9 18h6"/></svg>' },
        { id:'moon',    label:'Night',   color:'#90caf9', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' },
        { id:'plane',   label:'Plane',   color:'#4dd0e1', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16l-9-9-9 9"/><path d="M3 8l4.5 4.5L12 8l4.5 4.5L21 8"/><line x1="12" y1="3" x2="12" y2="8"/></svg>' },
        { id:'run',     label:'Run',     color:'#ffb74d', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M7 21l2-6 3 3 3-8 3 3"/><path d="M5 12l2-3 4 1 2-4"/></svg>' },
        { id:'coffee',  label:'Coffee',  color:'#bcaaa4', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>' },
        { id:'globe',   label:'Globe',   color:'#80deea', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' },
        { id:'award',   label:'Award',   color:'#ffd54f', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>' },
        { id:'magic',   label:'Magic',   color:'#b39ddb', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12.2 6.2L11 5M12.2 11.8L11 13"/><path d="M3 21l9-9"/><circle cx="15" cy="9" r="3"/></svg>' },
        { id:'clock',   label:'Clock',   color:'#b0bec5', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
        { id:'lock',    label:'Private', color:'#ef9a9a', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
        { id:'chat',    label:'Chat',    color:'#80cbc4', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
        { id:'palette', label:'Palette', color:'#f06292', svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 1.1 0 2-.9 2-2v-.5c0-.55-.22-1.05-.59-1.41-.36-.36-.59-.86-.59-1.41 0-1.1.9-2 2-2h2c3.31 0 6-2.69 6-6 0-4.97-4.48-8.58-9-8.59z"/><circle cx="6.5" cy="11.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="9.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="11.5" r="1.5" fill="currentColor" stroke="none"/></svg>' },
    ];

    function _resolveGroupIcon(iconId) {
        const ic = _GROUP_SVG_ICONS.find(x => x.id === iconId);
        if (ic) return { type: 'svg', color: ic.color, svg: ic.svg, label: ic.label };
        const fb = _GROUP_SVG_ICONS[0];
        return { type: 'svg', color: fb.color, svg: fb.svg, label: fb.label };
    }

    function showGroupCreateModal() {
        const old = document.getElementById('tm-group-modal-overlay');
        if (old) old.remove();
        _selectedIconId = null;

        const overlay = document.createElement('div');
        overlay.id        = 'tm-group-modal-overlay';
        overlay.className = 'tm-group-modal-overlay';

        const box = document.createElement('div');
        box.className = 'tm-group-modal-box';

        const title = document.createElement('div');
        title.className   = 'tm-group-modal-title';
        title.textContent = 'New Group';

        const input = document.createElement('input');
        input.className   = 'tm-group-modal-input';
        input.placeholder = 'Group name…';
        input.maxLength   = 24;

        const iconLabel = document.createElement('div');
        iconLabel.style.cssText = 'font-size:10px;color:rgba(255,255,255,.4);margin:10px 0 6px;letter-spacing:.06em;text-transform:uppercase';
        iconLabel.textContent = 'Icon';

        const iconGrid = document.createElement('div');
        iconGrid.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:5px;max-height:160px;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin';

        _GROUP_SVG_ICONS.forEach(ic => {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.dataset.iconId = ic.id;
            const isFirst = ic.id === _selectedIconId;
            cell.style.cssText = `
                display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
                padding:6px 2px;border-radius:8px;border:1.5px solid ${isFirst ? ic.color : 'transparent'};
                background:${isFirst ? 'rgba(255,255,255,.07)' : 'transparent'};
                cursor:pointer;transition:all .12s;font-family:inherit;
            `;

            const iconWrap = document.createElement('div');
            iconWrap.style.cssText = `width:20px;height:20px;color:${ic.color};flex-shrink:0`;
            iconWrap.innerHTML = ic.svg;

            const iconLbl = document.createElement('span');
            iconLbl.style.cssText = 'font-size:8px;color:rgba(255,255,255,.45);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:40px';
            iconLbl.textContent = ic.label;

            cell.appendChild(iconWrap);
            cell.appendChild(iconLbl);

            cell.addEventListener('click', () => {
                _selectedIconId = ic.id;
                iconGrid.querySelectorAll('button').forEach(b => {
                    const bid = b.dataset.iconId;
                    const bic = _GROUP_SVG_ICONS.find(x => x.id === bid);
                    b.style.border = `1.5px solid ${bid === ic.id ? bic.color : 'transparent'}`;
                    b.style.background = bid === ic.id ? 'rgba(255,255,255,.07)' : 'transparent';
                });
            });

            iconGrid.appendChild(cell);
        });

        const btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:8px;margin-top:16px';

        const skipBtn = document.createElement('button');
        skipBtn.type = 'button';
        skipBtn.style.cssText = `
            flex:1;padding:9px 0;border-radius:8px;
            border:1px solid rgba(255,255,255,.15);
            background:rgba(255,255,255,.06);
            color:rgba(255,255,255,.6);
            font-size:13px;font-weight:500;cursor:pointer;
            font-family:inherit;text-align:center;line-height:1;
            transition:background .12s;
        `;
        skipBtn.textContent = 'Skip';
        skipBtn.addEventListener('mouseover', () => skipBtn.style.background = 'rgba(255,255,255,.12)');
        skipBtn.addEventListener('mouseout',  () => skipBtn.style.background = 'rgba(255,255,255,.06)');
        skipBtn.addEventListener('click', () => _closeGroupModal(false, null));

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.style.cssText = `
            flex:1;padding:9px 0;border-radius:8px;
            border:none;background:#1d9bf0;
            color:#fff;font-size:13px;font-weight:500;cursor:pointer;
            font-family:inherit;text-align:center;line-height:1;
            transition:background .12s;
        `;
        confirmBtn.textContent = 'Create';
        confirmBtn.addEventListener('mouseover', () => confirmBtn.style.background = '#1a8cd8');
        confirmBtn.addEventListener('mouseout',  () => confirmBtn.style.background = '#1d9bf0');
        confirmBtn.addEventListener('click', () => _closeGroupModal(true, input.value.trim()));

        btns.appendChild(skipBtn);
        btns.appendChild(confirmBtn);

        box.appendChild(title);
        box.appendChild(input);
        box.appendChild(iconLabel);
        box.appendChild(iconGrid);
        box.appendChild(btns);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter')  _closeGroupModal(true, input.value.trim());
            if (e.key === 'Escape') _closeGroupModal(false, null);
        });
        overlay.addEventListener('click', e => {
            if (e.target === overlay) _closeGroupModal(false, null);
        });
        requestAnimationFrame(() => {
            overlay.classList.add('tm-show');
            setTimeout(() => input.focus(), 200);
        });
    }

    function _closeGroupModal(confirm, name) {
        const overlay = document.getElementById('tm-group-modal-overlay');
        if (!overlay) return;
        overlay.classList.remove('tm-show');
        setTimeout(() => overlay.remove(), 220);

        if (!confirm || !name) {
            hideStarPip();
            return;
        }

        const ic      = (_selectedIconId && _GROUP_SVG_ICONS.find(x => x.id === _selectedIconId)) || _GROUP_SVG_ICONS[0];
        const glowIdx = getGroups().length % STAR_GLOW_COLORS.length;
        const group   = createGroup(name, ic.id, STAR_GLOW_COLORS[glowIdx]);
        if (_pendingGroupRecordId !== null) {
            assignGroup(_pendingGroupRecordId, group.id);
            _pendingGroupRecordId = null;
        }
        showToast(`⭐ Created「${ic.label} · ${name}」`);

        setTimeout(() => {
            if (document.getElementById('tm-star-pip')?.classList.contains('tm-popped')) {
                openGroupFan();
            }
        }, 300);
    }

    function showGroupManagerModal() {
        const old = document.getElementById('tm-group-mgr-overlay');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id        = 'tm-group-mgr-overlay';
        overlay.className = 'tm-group-modal-overlay';

        const box = document.createElement('div');
        box.className = 'tm-group-modal-box';
        box.style.cssText += ';width:280px;max-width:92vw';

        const titleRow = document.createElement('div');
        titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px';

        const title = document.createElement('div');
        title.className   = 'tm-group-modal-title';
        title.style.margin = '0';
        title.textContent = 'Manage Groups';

        const newBtn = document.createElement('button');
        newBtn.type = 'button';
        newBtn.textContent = '＋ New';
        newBtn.style.cssText = `
            padding:5px 10px;border-radius:7px;border:none;
            background:#1d9bf0;color:#fff;
            font-size:11px;font-weight:600;cursor:pointer;
            font-family:inherit;line-height:1;transition:background .12s;
        `;
        newBtn.addEventListener('mouseover', () => newBtn.style.background = '#1a8cd8');
        newBtn.addEventListener('mouseout',  () => newBtn.style.background = '#1d9bf0');
        newBtn.addEventListener('click', () => {
            overlay.classList.remove('tm-show');
            setTimeout(() => { overlay.remove(); showGroupCreateModal(); }, 180);
        });

        titleRow.appendChild(title);
        titleRow.appendChild(newBtn);

        const list = document.createElement('div');
        list.style.cssText = 'flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:6px;margin-bottom:14px;scrollbar-width:thin';

        let _openIconPicker = null;

        function buildIconPicker(g, iconWrap, onPick) {
            const picker = document.createElement('div');
            picker.style.cssText = `
                display:grid;grid-template-columns:repeat(5,1fr);gap:4px;
                padding:8px;background:rgba(20,25,40,.98);
                border-radius:8px;border:1px solid rgba(255,255,255,.1);
                margin-top:4px;
            `;
            _GROUP_SVG_ICONS.forEach(ic => {
                const cell = document.createElement('button');
                cell.type = 'button';
                cell.style.cssText = `
                    display:flex;flex-direction:column;align-items:center;gap:2px;
                    padding:5px 2px;border-radius:6px;border:1.5px solid ${ic.id === g.icon ? ic.color : 'transparent'};
                    background:${ic.id === g.icon ? 'rgba(255,255,255,.07)' : 'transparent'};
                    cursor:pointer;transition:all .1s;font-family:inherit;
                `;
                const svg = document.createElement('div');
                svg.style.cssText = `width:16px;height:16px;color:${ic.color}`;
                svg.innerHTML = ic.svg;
                const lbl = document.createElement('span');
                lbl.style.cssText = 'font-size:7px;color:rgba(255,255,255,.4);white-space:nowrap;overflow:hidden;max-width:38px;text-overflow:ellipsis';
                lbl.textContent = ic.label;
                cell.appendChild(svg);
                cell.appendChild(lbl);
                cell.addEventListener('click', () => {
                    onPick(ic);
                    picker.remove();
                    _openIconPicker = null;
                });
                picker.appendChild(cell);
            });
            return picker;
        }

        function rebuildList() {
            list.innerHTML = '';
            _openIconPicker = null;
            const groups = getGroups();

            if (!groups.length) {
                const empty = document.createElement('div');
                empty.style.cssText = 'font-size:12px;color:rgba(255,255,255,.35);text-align:center;padding:16px 0';
                empty.textContent = 'No groups yet — click ＋ New to create one';
                list.appendChild(empty);
                return;
            }

            let _dragSrcIdx = -1;

            groups.forEach((g, gIdx) => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'display:flex;flex-direction:column;gap:0';
                wrapper.draggable = true;
                wrapper.dataset.groupId  = g.id;
                wrapper.dataset.groupIdx = gIdx;

                wrapper.addEventListener('dragstart', e => {
                    _dragSrcIdx = gIdx;
                    wrapper.style.opacity = '0.45';
                    e.dataTransfer.effectAllowed = 'move';
                });
                wrapper.addEventListener('dragend', () => {
                    wrapper.style.opacity = '1';
                    list.querySelectorAll('[data-group-id]').forEach(el => {
                        el.style.borderTop    = '';
                        el.style.borderBottom = '';
                    });
                });
                wrapper.addEventListener('dragover', e => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    const rect = wrapper.getBoundingClientRect();
                    const mid  = rect.top + rect.height / 2;
                    list.querySelectorAll('[data-group-id]').forEach(el => {
                        el.style.borderTop = ''; el.style.borderBottom = '';
                    });
                    if (e.clientY < mid) wrapper.style.borderTop    = '2px solid rgba(29,155,240,.7)';
                    else                 wrapper.style.borderBottom = '2px solid rgba(29,155,240,.7)';
                });
                wrapper.addEventListener('dragleave', () => {
                    wrapper.style.borderTop = ''; wrapper.style.borderBottom = '';
                });
                wrapper.addEventListener('drop', e => {
                    e.preventDefault();
                    wrapper.style.borderTop = ''; wrapper.style.borderBottom = '';
                    const destIdx = parseInt(wrapper.dataset.groupIdx);
                    if (_dragSrcIdx === -1 || _dragSrcIdx === destIdx) return;
                    const rect = wrapper.getBoundingClientRect();
                    const insertAfter = e.clientY >= rect.top + rect.height / 2;
                    const arr  = getGroups();
                    const [moved] = arr.splice(_dragSrcIdx, 1);
                    const newDest  = insertAfter
                        ? (_dragSrcIdx < destIdx ? destIdx : destIdx + 1)
                        : (_dragSrcIdx < destIdx ? destIdx - 1 : destIdx);
                    arr.splice(Math.max(0, Math.min(arr.length, newDest)), 0, moved);
                    saveGroups(arr);
                    _dragSrcIdx = -1;
                    rebuildList();
                });

                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.05);border-radius:8px;padding:7px 8px';

                const dragHandle = document.createElement('span');
                dragHandle.title = 'Drag to reorder';
                dragHandle.innerHTML = '<svg viewBox="0 0 10 16" width="8" height="13" fill="currentColor"><circle cx="3" cy="3" r="1.2"/><circle cx="7" cy="3" r="1.2"/><circle cx="3" cy="8" r="1.2"/><circle cx="7" cy="8" r="1.2"/><circle cx="3" cy="13" r="1.2"/><circle cx="7" cy="13" r="1.2"/></svg>';
                dragHandle.style.cssText = 'flex-shrink:0;color:rgba(255,255,255,.2);cursor:grab;display:flex;align-items:center;transition:color .12s;user-select:none';
                dragHandle.addEventListener('mouseover', () => dragHandle.style.color = 'rgba(255,255,255,.5)');
                dragHandle.addEventListener('mouseout',  () => dragHandle.style.color = 'rgba(255,255,255,.2)');
                dragHandle.addEventListener('mousedown', () => { wrapper.draggable = true; });
                row.addEventListener('mousedown', e => {
                    if (!e.target.closest('[title="Drag to reorder"]')) wrapper.draggable = false;
                });

                const iconWrap = document.createElement('button');
                iconWrap.type = 'button';
                iconWrap.title = 'Change icon';
                iconWrap.style.cssText = `
                    width:22px;height:22px;flex-shrink:0;border:none;
                    background:transparent;cursor:pointer;padding:0;border-radius:4px;
                    transition:background .12s;display:flex;align-items:center;justify-content:center;
                `;
                const ic = _resolveGroupIcon(g.icon);
                iconWrap.style.color = ic.color;
                iconWrap.innerHTML = ic.svg;
                iconWrap.addEventListener('mouseover', () => iconWrap.style.background = 'rgba(255,255,255,.1)');
                iconWrap.addEventListener('mouseout',  () => iconWrap.style.background = 'transparent');
                iconWrap.addEventListener('click', () => {
                    if (_openIconPicker) { _openIconPicker.remove(); _openIconPicker = null; }
                    const picker = buildIconPicker(g, iconWrap, (newIc) => {
                        const arr = getGroups();
                        const idx = arr.findIndex(x => x.id === g.id);
                        if (idx > -1) { arr[idx].icon = newIc.id; saveGroups(arr); g.icon = newIc.id; }
                        const resolved = _resolveGroupIcon(newIc.id);
                        iconWrap.style.color = resolved.color;
                        iconWrap.innerHTML = resolved.svg;
                        showToast(`Icon → ${resolved.label}`);
                    });
                    wrapper.appendChild(picker);
                    _openIconPicker = picker;
                });

                const nameInput = document.createElement('input');
                nameInput.value     = g.name;
                nameInput.maxLength = 24;
                nameInput.readOnly  = true;
                nameInput.style.cssText = 'flex:1;min-width:0;background:transparent;border:none;border-bottom:1px solid transparent;outline:none;color:rgba(255,255,255,.88);font-size:12px;font-family:inherit;padding:2px 0;transition:border-color .12s;overflow:hidden;text-overflow:ellipsis;cursor:default';
                nameInput.addEventListener('blur', () => {
                    const n = nameInput.value.trim();
                    if (!n) { nameInput.value = g.name; }
                    else if (n !== g.name) {
                        const arr = getGroups();
                        const idx = arr.findIndex(x => x.id === g.id);
                        if (idx > -1) { arr[idx].name = n; saveGroups(arr); g.name = n; showToast(`Renamed → ${n}`); }
                    }
                    nameInput.readOnly = true;
                    nameInput.style.borderColor = 'transparent';
                    nameInput.style.cursor = 'default';
                    editBtn.style.opacity = '0';
                });
                nameInput.addEventListener('keydown', e => {
                    if (e.key === 'Enter')  nameInput.blur();
                    if (e.key === 'Escape') { nameInput.value = g.name; nameInput.blur(); }
                });

                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.title = 'Rename';
                editBtn.style.cssText = 'background:transparent;border:none;color:rgba(255,255,255,.3);cursor:pointer;flex-shrink:0;padding:0 2px;line-height:1;transition:color .12s,opacity .15s;opacity:0';
                editBtn.innerHTML = '<svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z"/></svg>';
                editBtn.addEventListener('mouseover', () => editBtn.style.color = 'rgba(255,255,255,.7)');
                editBtn.addEventListener('mouseout',  () => editBtn.style.color = 'rgba(255,255,255,.3)');
                editBtn.addEventListener('click', () => {
                    nameInput.readOnly = false;
                    nameInput.style.borderBottom = '1px solid rgba(29,155,240,.6)';
                    nameInput.style.cursor = 'text';
                    nameInput.focus();
                    nameInput.select();
                });
                row.addEventListener('mouseenter', () => { editBtn.style.opacity = '1'; });
                row.addEventListener('mouseleave', () => { if (nameInput.readOnly) editBtn.style.opacity = '0'; });

                const cnt = _countGroupRecords(g.id);
                const cntBadge = document.createElement('span');
                cntBadge.style.cssText = 'font-size:10px;color:rgba(255,255,255,.3);flex-shrink:0;white-space:nowrap';
                cntBadge.textContent = cnt ? `${cnt} items` : '';

                const delBtn = document.createElement('button');
                delBtn.type  = 'button';
                delBtn.title = 'Delete group';
                delBtn.style.cssText = 'background:transparent;border:none;color:rgba(255,80,80,.55);font-size:14px;cursor:pointer;flex-shrink:0;padding:0 2px;line-height:1;transition:color .12s';
                delBtn.innerHTML = '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>';
                delBtn.addEventListener('mouseover', () => delBtn.style.color = 'rgba(255,80,80,.9)');
                delBtn.addEventListener('mouseout',  () => delBtn.style.color = 'rgba(255,80,80,.55)');
                delBtn.addEventListener('click', () => {
                    if (cnt > 0 && !confirm(`Delete「${g.name}」? This will ungroup ${cnt} item(s).`)) return;
                    if (cnt === 0 && !confirm(`Delete「${g.name}」?`)) return;
                    deleteGroup(g.id);
                    rebuildList();
                    showToast(`Deleted「${g.name}」`);
                });

                row.appendChild(dragHandle);
                row.appendChild(iconWrap);
                row.appendChild(nameInput);
                row.appendChild(editBtn);
                row.appendChild(cntBadge);
                row.appendChild(delBtn);
                wrapper.appendChild(row);
                list.appendChild(wrapper);
            });
        }
        rebuildList();

        const doneBtn = document.createElement('button');
        doneBtn.type = 'button';
        doneBtn.style.cssText = `
            width:100%;padding:9px 0;border-radius:8px;border:none;
            background:#1d9bf0;color:#fff;
            font-size:13px;font-weight:500;cursor:pointer;
            font-family:inherit;text-align:center;line-height:1;
            transition:background .12s;
        `;
        doneBtn.textContent = 'Done';
        doneBtn.addEventListener('mouseover', () => doneBtn.style.background = '#1a8cd8');
        doneBtn.addEventListener('mouseout',  () => doneBtn.style.background = '#1d9bf0');
        doneBtn.addEventListener('click', () => {
            overlay.classList.remove('tm-show');
            setTimeout(() => overlay.remove(), 220);
        });

        box.appendChild(titleRow);
        box.appendChild(list);
        box.appendChild(doneBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', e => {
            if (e.target === overlay) { overlay.classList.remove('tm-show'); setTimeout(() => overlay.remove(), 220); }
        });

        requestAnimationFrame(() => overlay.classList.add('tm-show'));
    }

    function recordHistory(info, urls, mediaBtn) {
        try {
            const thumbUrls = urls.filter(u => !u.includes('.mp4'));
            const hasVideo  = urls.some(u => u.includes('.mp4'));

            if (thumbUrls.length === 0 && info.videoThumb) {
                thumbUrls.push(info.videoThumb);
            }

            const _now    = new Date();
            const _yy     = _now.getFullYear();
            const _mm     = String(_now.getMonth() + 1).padStart(2, '0');
            const yyyymm  = `${_yy}.${_mm}`;

            const record = {
                id:          Date.now(),
                ts:          Date.now(),
                yyyymm,
                tweetId:     info.id,
                tweetUrl:    `https://x.com/${info.screenName}/status/${info.id}`,
                tweetDate:   info.date,
                downloadDate: `${_yy}-${_mm}-${String(_now.getDate()).padStart(2,'0')}`,
                screenName:  info.screenName,
                displayName: info.displayName,
                text:        (info.text || '').slice(0, 80),
                thumbUrls,
                mediaUrls:   urls,
                hasVideo,
                count:       urls.length,
            };

            let records = [];
            try { records = JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]')); } catch (_) {}
            const _oldRecord = records.find(r => r.tweetId === info.id);
            if (_oldRecord?.favorited) record.favorited = true;
            records = records.filter(r => r.tweetId !== info.id);
            records.unshift(record);
            GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));

            if (GM_getValue(KEY_GROUP_ON_DOWNLOAD, false)) {
                _pendingGroupRecordId = record.id;
                setTimeout(() => popStarPip(mediaBtn || null), 80);
            }

            _downloadedIds.add(info.id);

            document.querySelectorAll(`article a[href*="/status/${info.id}"]`).forEach(a => {
                const art = a.closest('article');
                if (art) {
                    const targetBtn = art.querySelector('.force-media-copy-btn');
                    if (targetBtn) _applyHistoryBadge(targetBtn);
                }
            });

            const existPanel = document.getElementById('tm-hist-panel');
            if (existPanel) existPanel.dispatchEvent(new CustomEvent('tm-hist-refresh'));
        } catch (e) { console.error('[TMHist] recordHistory error:', e); }
    }

    function showHistoryPanel() {
        let _pinned = GM_getValue(KEY_HIST_PINNED, false);

        const existing = document.getElementById('tm-hist-panel');
        if (existing) {
            if (_dockSideGlobal) {
                existing.dispatchEvent(new CustomEvent('tm-hist-toggle-peek'));
                return;
            }
            if (GM_getValue(KEY_HIST_PINNED, false)) return;

            if (typeof existing._tmCleanup === 'function') existing._tmCleanup();
            existing.remove();
            _cleanZoom();
            return;
        }

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const C = dark ? {
            bg: '#16202b', header: '#1e2732', text: '#e7e9ea', sub: '#8b98a5',
            border: '#2f3336', rowHover: '#1e2732', inputBg: '#1e2732',
            groupHdr: '#2f3336', groupTxt: '#8b98a5',
            thumbBg: '#1e2732', danger: '#e0245e', dangerHover: '#c01e4e',
            badgeNew: '#1d9bf0', scrollbar: '#2f3336',
        } : {
            bg: '#ffffff', header: '#f7f9f9', text: '#0f1419', sub: '#536471',
            border: '#eff3f4', rowHover: '#f7f9f9', inputBg: '#f7f9f9',
            groupHdr: '#f7f9f9', groupTxt: '#536471',
            thumbBg: '#f7f9f9', danger: '#e0245e', dangerHover: '#c01e4e',
            badgeNew: '#1d9bf0', scrollbar: '#eff3f4',
        };

        let pos = {
            x: Math.max(8, Math.min(Math.round(window.innerWidth * 0.55 - 195), window.innerWidth - 398)),
            y: 60, w: 390, h: 540,
        };
        try {
            const saved = JSON.parse(GM_getValue(KEY_HISTORY_PANEL_POS, 'null'));
            if (saved && typeof saved.x === 'number') {
                pos = {
                    x: Math.min(saved.x, window.innerWidth  - 300),
                    y: Math.min(saved.y, window.innerHeight - 200),
                    w: Math.max(300, Math.min(saved.w || 390, 680)),
                    h: Math.max(280, Math.min(saved.h || 540, window.innerHeight - 20)),
                };
            }
        } catch (_) {}

        let viewMode  = GM_getValue(KEY_HISTORY_VIEW_MODE, 'list');
        let editMode  = false;
        let query     = '';
        let activeGroupId = null;
        const selectedIds    = new Set();
        const collapsedGroups = new Set();
        let anchorIdx = -1;

        let histStyleEl = document.getElementById('tm-hist-style');
        if (!histStyleEl) {
            histStyleEl = document.createElement('style');
            histStyleEl.id = 'tm-hist-style';
            document.head.appendChild(histStyleEl);
        }
        histStyleEl.textContent = `
            #tm-hist-panel {
                position: fixed; z-index: 999992; 
                font-family: system-ui, -apple-system, sans-serif;
                display: flex; flex-direction: column;
                background: ${C.bg}; border: 1px solid ${C.border};
                border-radius: 14px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10);
                overflow: hidden;
                min-width: 300px; min-height: 280px;
            }
            #tm-hist-titlebar {
                display: flex; align-items: center; gap: 6px;
                padding: 9px 12px; cursor: grab;
                background: ${C.header}; border-bottom: 1px solid ${C.border};
                user-select: none; flex-shrink: 0;
            }

            @keyframes tm-pin-on {
                0%   { transform: rotate(-45deg) scale(0.7); opacity: 0; }
                60%  { transform: rotate(8deg)   scale(1.15); opacity: 1; }
                100% { transform: rotate(0deg)   scale(1);   opacity: 1; }
            }
            @keyframes tm-pin-off {
                0%   { transform: rotate(0deg)   scale(1);   opacity: 1; }
                40%  { transform: rotate(-15deg) scale(0.85); }
                100% { transform: rotate(45deg)  scale(0.7); opacity: 0.4; }
            }
            #tm-hist-btn-pin {
                background: transparent; border: none; cursor: pointer;
                display: inline-flex; align-items: center; justify-content: center;
                width: 24px; height: 24px; border-radius: 6px; padding: 0;
                color: ${C.sub}; opacity: 0.45;
                transition: opacity 0.18s, background 0.15s, color 0.15s;
                flex-shrink: 0;
            }
            #tm-hist-btn-pin:hover { opacity: 1; background: ${C.rowHover}; }
            #tm-hist-btn-pin.pinned {
                opacity: 0.85; color: #1d9bf0;
                animation: tm-pin-on 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards;
            }
            #tm-hist-btn-pin.unpinning {
                animation: tm-pin-off 0.28s ease forwards;
            }
            
            #tm-hist-panel.tm-pinned .tm-dock-trigger {
                opacity: 0.15 !important; pointer-events: none !important; cursor: default !important;
            }
            #tm-hist-titlebar:active { cursor: grabbing; }
            .tm-hist-title {
                font-size: 13px; font-weight: 700; color: ${C.text};
                flex: 1; min-width: 0;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .tm-hist-count-badge {
                font-size: 10px; padding: 2px 7px; border-radius: 99px;
                background: ${C.groupHdr}; color: ${C.sub};
                white-space: nowrap; flex-shrink: 0;
            }
            .tm-hist-icon-btn {
                width: 26px; height: 26px; border-radius: 6px; border: none;
                background: transparent; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                color: ${C.sub}; transition: background 0.1s, color 0.1s;
                flex-shrink: 0;
            }
            .tm-hist-icon-btn:hover { background: ${C.rowHover}; color: ${C.text}; }
            .tm-hist-icon-btn svg { width: 14px; height: 14px; pointer-events: none; }
            .tm-hist-icon-btn.active { color: #1d9bf0; }
            .tm-hist-searchbar {
                padding: 7px 12px; border-bottom: 1px solid ${C.border}; flex-shrink: 0;
            }
            #tm-hist-search {
                width: 100%; padding: 5px 10px; border-radius: 99px;
                border: 1px solid ${C.border}; background: ${C.inputBg};
                color: ${C.text}; font-size: 12px;
                outline: none; box-sizing: border-box;
            }
            #tm-hist-search::placeholder { color: ${C.sub}; }
            #tm-hist-body {
                flex: 1; overflow-y: auto; overflow-x: hidden;
                scrollbar-width: thin; scrollbar-color: ${C.scrollbar} transparent;
            }
            .tm-hist-group-header {
                position: sticky; top: 0; z-index: 2;
                padding: 5px 12px 4px;
                background: ${C.groupHdr}; border-bottom: 1px solid ${C.border};
                font-size: 11px; font-weight: 700; color: ${C.groupTxt};
                letter-spacing: 0.03em;
                cursor: pointer; user-select: none;
                display: flex; align-items: center; gap: 5px;
            }
            .tm-hist-group-header:hover { background: ${C.rowHover}; }
            .tm-hist-group-chevron {
                opacity: 0.55; flex-shrink: 0;
                display: inline-flex; align-items: center;
                transition: transform 0.18s ease;
            }
            .tm-hist-group-header.tm-collapsed .tm-hist-group-chevron {
                transform: rotate(-90deg);
            }
            .tm-hist-group-count {
                margin-left: auto; font-size: 10px; font-weight: 400;
                opacity: 0.5; padding-right: 2px;
            }
            
            .tm-hist-sel-all-btn {
                padding: 4px 10px; border-radius: 99px;
                border: 1px solid ${C.border}; background: transparent;
                color: ${C.sub}; font-size: 11px; cursor: pointer;
                transition: background 0.1s, color 0.1s;
                white-space: nowrap; flex-shrink: 0;
            }
            .tm-hist-sel-all-btn:hover { background: ${C.rowHover}; color: ${C.text}; }
            
            #tm-hist-gh-footer {
                flex-shrink: 0; box-sizing: border-box;
                height: 26px;
                border-top: 1px solid ${C.border};
                display: flex; align-items: center; justify-content: center;
                background: ${C.header};
            }
            #tm-hist-gh-footer a {
                font-size: 10px; color: ${C.sub}; text-decoration: none;
                opacity: 0.38; letter-spacing: 0.02em;
                font-family: system-ui, -apple-system, sans-serif;
                transition: opacity 0.18s;
                pointer-events: all;
            }
            #tm-hist-gh-footer a:hover { opacity: 0.85; text-decoration: underline; }
            .tm-hist-row {
                display: flex; align-items: flex-start; gap: 10px;
                padding: 8px 12px; border-bottom: 1px solid ${C.border};
                transition: background 0.08s;
                position: relative;
            }
            .tm-hist-row:hover { background: ${C.rowHover}; }
            .tm-hist-row.selected { background: rgba(29,155,240,0.08); }
            .tm-hist-row.selected::before {
                content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
                background: #1d9bf0; border-radius: 0 2px 2px 0;
            }
            .tm-hist-cb { flex-shrink: 0; margin-top: 3px; cursor: pointer; }
            .tm-hist-thumb-wrap {
                width: 44px; height: 44px; border-radius: 6px;
                overflow: hidden; flex-shrink: 0;
                background: ${C.thumbBg}; border: 1px solid ${C.border};
                display: flex; align-items: center; justify-content: center;
                position: relative; cursor: pointer;
            }
            .tm-hist-thumb-wrap img {
                width: 100%; height: 100%; object-fit: cover; display: block;
            }
            .tm-hist-thumb-wrap .tm-hist-video-icon { color: ${C.sub}; }
            .tm-hist-thumb-wrap .tm-hist-video-icon svg { width: 20px; height: 20px; }
            .tm-hist-info { flex: 1; min-width: 0; }
            .tm-hist-author {
                font-size: 12px; font-weight: 600; color: ${C.text};
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .tm-hist-handle {
                font-size: 11px; color: ${C.sub}; margin-left: 4px; font-weight: 400;
            }
            .tm-hist-text {
                font-size: 11px; color: ${C.sub}; margin: 2px 0;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                line-height: 1.4;
            }
            .tm-hist-date {
                font-size: 10px; color: ${C.sub}; opacity: 0.6;
                white-space: nowrap; margin: 1px 0;
                font-variant-numeric: tabular-nums;
            }
            .tm-hist-url {
                font-size: 10px; color: #1d9bf0;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                cursor: pointer;
            }
            .tm-hist-url:hover { text-decoration: underline; }
            .tm-hist-actions {
                display: flex; flex-direction: row; gap: 0px;
                flex-shrink: 0; align-items: center;
            }
            .tm-hist-act-btn {
                width: 22px; height: 22px; border-radius: 5px; border: none;
                background: transparent; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                color: ${C.sub}; transition: background 0.1s, color 0.1s;
            }
            .tm-hist-act-btn:hover { background: ${C.rowHover}; color: ${C.text}; }
            .tm-hist-act-btn.danger:hover { color: ${C.danger}; }
            .tm-hist-act-btn svg { width: 12px; height: 12px; pointer-events: none; }
            
            .tm-hist-act-btn.tm-fav-active { color: #e0245e; }
            .tm-hist-act-btn.tm-fav-btn:hover { color: #e0245e; }
            .tm-hist-act-btn.tm-fav-btn svg { width: 15px; height: 15px; }
            .tm-hist-act-btn.tm-copy-btn svg { width: 12px; height: 12px; }
            
            .tm-hist-grid-cell .tm-grid-copy-btn {
                position: absolute; top: 5px; right: 5px;
                width: 24px; height: 24px; border-radius: 6px; border: none;
                background: rgba(0,0,0,0.38); backdrop-filter: blur(4px);
                color: rgba(255,255,255,0.75); cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.15s, background 0.1s;
                z-index: 3; pointer-events: none;
            }
            .tm-hist-grid-cell .tm-grid-copy-btn svg { width: 12px; height: 12px; pointer-events: none; }
            .tm-hist-grid-cell:hover .tm-grid-copy-btn {
                opacity: 1; pointer-events: auto;
            }
            .tm-hist-grid-cell .tm-grid-copy-btn:hover { background: rgba(29,155,240,0.75); }
            
            .tm-hist-grid-cell.selected .tm-grid-copy-btn,
            .tm-hist-grid-cell.tm-grid-fav-lock .tm-grid-copy-btn { display: none; }
            
            .tm-hist-grid-cell .tm-grid-dl-btn {
                position: absolute; top: 33px; right: 5px;
                width: 24px; height: 24px; border-radius: 6px; border: none;
                background: rgba(0,0,0,0.38); backdrop-filter: blur(4px);
                color: rgba(255,255,255,0.75); cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.15s, background 0.1s;
                z-index: 3; pointer-events: none;
            }
            .tm-hist-grid-cell .tm-grid-dl-btn svg { width: 12px; height: 12px; pointer-events: none; }
            .tm-hist-grid-cell:hover .tm-grid-dl-btn { opacity: 1; pointer-events: auto; }
            .tm-hist-grid-cell .tm-grid-dl-btn:hover { background: rgba(16,185,129,0.75); }
            .tm-hist-grid-cell.selected .tm-grid-dl-btn,
            .tm-hist-grid-cell.tm-grid-fav-lock .tm-grid-dl-btn { display: none; }

            .tm-hist-grid-cell .tm-grid-goto-btn {
                position: absolute; bottom: 0; right: 0;
                width: 30px; height: 30px;
                clip-path: polygon(100% 0, 100% 100%, 0 100%);
                background: rgba(29,155,240,0.65); backdrop-filter: blur(2px);
                border: none; cursor: pointer;
                display: flex; align-items: flex-end; justify-content: flex-end;
                padding: 4px;
                opacity: 0; transition: opacity 0.15s, background 0.1s;
                z-index: 3; pointer-events: none;
            }
            .tm-hist-grid-cell .tm-grid-goto-btn svg { width: 10px; height: 10px; pointer-events: none; }
            .tm-hist-grid-cell:hover .tm-grid-goto-btn { opacity: 1; pointer-events: auto; }
            .tm-hist-grid-cell .tm-grid-goto-btn:hover { background: rgba(29,155,240,0.9); }
            .tm-hist-grid-cell.selected .tm-grid-goto-btn,
            .tm-hist-grid-cell.tm-grid-fav-lock .tm-grid-goto-btn { display: none; }
            
            #tm-hist-thumb-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
                gap: 3px; padding: 8px;
            }
            .tm-hist-grid-cell {
                aspect-ratio: 1; border-radius: 6px; overflow: hidden;
                position: relative; cursor: pointer;
                background: ${C.thumbBg};
            }
            .tm-hist-grid-cell img {
                width: 100%; height: 100%; object-fit: cover; display: block;
            }
            .tm-hist-grid-cell .tm-hist-grid-overlay {
                position: absolute; inset: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 55%);
                opacity: 0; transition: opacity 0.18s;
                display: flex; flex-direction: column; justify-content: flex-end;
                padding: 6px;
            }
            .tm-hist-grid-cell:hover .tm-hist-grid-overlay { opacity: 1; }
            .tm-hist-grid-overlay .gov-author {
                font-size: 11px; font-weight: 700; color: #fff;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .tm-hist-grid-overlay .gov-text {
                font-size: 10px; color: rgba(255,255,255,0.82);
                overflow: hidden; text-overflow: ellipsis;
                display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
                line-height: 1.3; margin-top: 2px;
            }
            .tm-hist-grid-cell .tm-hist-grid-nothumb {
                width: 100%; height: 100%; display: flex; align-items: center;
                justify-content: center; color: ${C.sub};
            }
            .tm-hist-grid-cell .tm-hist-grid-nothumb svg { width: 28px; height: 28px; }
            
            .tm-hist-grid-cell.selected {
                outline: 2.5px solid rgba(29,155,240,0.9);
                outline-offset: -2px;
            }
            .tm-hist-grid-cell.selected::after {
                content: '';
                position: absolute; top: 6px; right: 6px;
                width: 18px; height: 18px;
                background: rgba(29,155,240,1) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='2,6 5,9 10,3'/%3E%3C/svg%3E") center/12px no-repeat;
                border-radius: 50%;
                pointer-events: none; z-index: 2;
            }
            
            .tm-hist-grid-cell.tm-grid-fav-lock::after {
                content: '♥';
                position: absolute; top: 6px; right: 6px;
                width: 18px; height: 18px; line-height: 18px;
                background: rgba(0,0,0,0.55); color: rgba(255,255,255,0.5);
                border-radius: 50%; font-size: 9px; text-align: center;
                pointer-events: none; z-index: 2;
            }
            
            #tm-thumb-lb-backdrop {
                position: fixed; inset: 0; z-index: 10000010;
                background: rgba(0,0,0,0); backdrop-filter: blur(0px);
                display: flex; align-items: center; justify-content: center;
                transition: background 0.22s ease, backdrop-filter 0.22s ease;
                cursor: zoom-out;
            }
            #tm-thumb-lb-backdrop.tm-lb-visible {
                background: rgba(0,0,0,0.88);
                backdrop-filter: blur(6px);
            }
            #tm-thumb-lb-img {
                max-width: 92vw; max-height: 88vh;
                border-radius: 10px;
                box-shadow: 0 24px 80px rgba(0,0,0,0.7);
                object-fit: contain; display: block;
                transform-origin: var(--lb-ox, 50%) var(--lb-oy, 50%);
                transform: scale(var(--lb-scale-from, 0.18)) translate(var(--lb-tx, 0px), var(--lb-ty, 0px));
                opacity: 0;
                transition: transform 0.32s cubic-bezier(0.22,1,0.36,1),
                            opacity   0.22s ease;
                cursor: default;
            }
            #tm-thumb-lb-img.tm-lb-visible {
                transform: scale(1) translate(0,0);
                opacity: 1;
            }
            #tm-thumb-lb-nav {
                position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
                display: flex; align-items: center; gap: 12px;
                z-index: 10000011; pointer-events: none;
                opacity: 0; transition: opacity 0.2s;
            }
            #tm-thumb-lb-nav.tm-lb-visible { opacity: 1; pointer-events: auto; }
            .tm-lb-nav-btn {
                width: 36px; height: 36px; border-radius: 50%; border: none;
                background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
                color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.15s; font-size: 18px; line-height: 1;
            }
            .tm-lb-nav-btn:hover { background: rgba(255,255,255,0.28); }
            .tm-lb-nav-btn:disabled { opacity: 0.3; cursor: default; }
            #tm-lb-counter {
                font-size: 12px; color: rgba(255,255,255,0.7);
                font-family: system-ui, -apple-system, sans-serif;
                min-width: 40px; text-align: center;
            }
            #tm-thumb-lb-close {
                position: fixed; top: 18px; right: 22px; z-index: 10000012;
                width: 36px; height: 36px; border-radius: 50%; border: none;
                background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
                color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.2s, background 0.15s;
                pointer-events: none;
            }
            #tm-thumb-lb-close.tm-lb-visible { opacity: 1; pointer-events: auto; }
            #tm-thumb-lb-close:hover { background: rgba(255,255,255,0.28); }
            
            .tm-hist-thumb-wrap.tm-has-thumb { cursor: zoom-in; }
            
            #tm-hist-footer {
                border-top: 1px solid ${C.border}; padding: 7px 12px;
                display: flex; align-items: center; gap: 8px;
                background: ${C.header}; flex-shrink: 0;
            }
            #tm-hist-footer.hidden { display: none; }
            .tm-hist-del-sel-btn {
                padding: 5px 12px; border-radius: 99px; border: none;
                background: ${C.danger}; color: #fff; font-size: 12px;
                font-weight: 600; cursor: pointer; transition: background 0.1s;
            }
            .tm-hist-del-sel-btn:hover { background: ${C.dangerHover}; }
            .tm-hist-cancel-edit {
                padding: 5px 12px; border-radius: 99px;
                border: 1px solid ${C.border}; background: transparent;
                color: ${C.text}; font-size: 12px; cursor: pointer;
            }
            
            #tm-hist-resize {
                position: absolute; bottom: 0; right: 0;
                width: 14px; height: 14px; cursor: se-resize;
                opacity: 0.4;
            }
            #tm-hist-resize:hover { opacity: 0.8; }

            .tm-dock-trigger {
                position: absolute; top: 50%; transform: translateY(-50%);
                width: 10px; height: 40px;
                background: transparent;
                border: none; padding: 0; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                opacity: 0;
                transition: opacity 0.25s ease;
                z-index: 5;
                
                overflow: visible;
            }
            #tm-hist-panel:hover .tm-dock-trigger { opacity: 1; }
            .tm-dock-trigger.left  { left: -1px; }
            .tm-dock-trigger.right { right: -1px; }

            .tm-dock-trigger svg {
                width: 6px; height: 28px;
                opacity: 0.18;
                transition: opacity 0.2s ease, filter 0.2s ease;
                pointer-events: none;
            }
            .tm-dock-trigger:hover svg {
                opacity: 0.55;
                filter: drop-shadow(0 0 2px rgba(29,155,240,0.7));
            }

            #tm-hist-panel {
                transition: left 0.38s cubic-bezier(0.4,0,0.2,1),
                            right 0.38s cubic-bezier(0.4,0,0.2,1),
                            opacity 0.28s ease,
                            box-shadow 0.28s ease;
            }
            #tm-hist-panel.tm-docked { opacity: 0.0; pointer-events: none; }
            #tm-hist-panel.tm-docked .tm-dock-trigger { opacity: 1 !important; pointer-events: all; }

            #tm-hist-dock-tab {
                position: fixed; z-index: 999979;
                width: 6px;
                border-radius: 3px;
                pointer-events: all;
                cursor: pointer;
                
                overflow: visible;
                transition: opacity 0.22s ease;
            }
            #tm-hist-dock-tab:hover { width: 9px; transition: width 0.18s ease, opacity 0.22s ease; }

            #tm-hist-dock-tab.style-ruler {
                background: ${C.border};
            }
            #tm-hist-dock-tab.style-ruler::before {
                content: '';
                position: absolute; inset: 0;
                background: repeating-linear-gradient(
                    to bottom,
                    transparent       0px,
                    transparent       7px,
                    rgba(29,155,240,0.45) 7px,
                    rgba(29,155,240,0.45) 8px
                );
            }
            #tm-hist-dock-tab.style-ruler::after {
                content: '';
                position: absolute; inset: 0;
                background: repeating-linear-gradient(
                    to bottom,
                    transparent       0px,
                    transparent       23px,
                    rgba(29,155,240,0.85) 23px,
                    rgba(29,155,240,0.85) 25px
                );
                box-shadow: 0 0 3px rgba(29,155,240,0.4);
            }

            #tm-hist-dock-tab.style-ghost {
                background: repeating-linear-gradient(
                    to bottom,
                    transparent           0px,
                    transparent           3px,
                    rgba(128,128,128,0.22) 3px,
                    rgba(128,128,128,0.22) 4px
                );
                border-radius: 3px;
            }
            #tm-hist-dock-tab.style-ghost:hover {
                background: repeating-linear-gradient(
                    to bottom,
                    transparent           0px,
                    transparent           3px,
                    rgba(29,155,240,0.38)  3px,
                    rgba(29,155,240,0.38)  4px
                );
            }

            #tm-hist-dock-tab.style-notch {
                background: transparent;
                display: flex; align-items: center; justify-content: center;
            }
            #tm-hist-dock-tab.style-notch::before {
                content: '';
                width: 2px;
                height: 28px;
                border-radius: 1px;
                background: ${C.border};
                box-shadow: inset 0 0 0 1px rgba(29,155,240,0.2);
                transition: background 0.2s, box-shadow 0.2s;
            }
            #tm-hist-dock-tab.style-notch:hover::before {
                background: rgba(29,155,240,0.45);
                box-shadow: 0 0 4px rgba(29,155,240,0.5);
            }

            #tm-hist-dock-tab.style-pill {
                background: transparent;
                display: flex; align-items: center; justify-content: center;
            }
            #tm-hist-dock-tab.style-pill::before {
                content: '';
                width: 4px; height: 36px; border-radius: 2px;
                background: rgba(29,155,240,0.55);
                transition: height 0.2s, background 0.2s, box-shadow 0.2s;
            }
            #tm-hist-dock-tab.style-pill:hover::before {
                height: 52px;
                background: rgba(29,155,240,0.85);
                box-shadow: 0 0 8px rgba(29,155,240,0.5);
            }

            #tm-hist-dock-tab.style-arrow {
                background: transparent;
                display: flex; align-items: center; justify-content: center;
            }
            #tm-hist-dock-tab.style-arrow::before {
                content: '';
                width: 0; height: 0;
                border-top: 7px solid transparent;
                border-bottom: 7px solid transparent;
                opacity: 0.35;
                transition: opacity 0.2s, filter 0.2s;
            }
            
            #tm-hist-dock-tab.style-arrow.side-left::before  { border-left:  8px solid ${C.text}; }
            #tm-hist-dock-tab.style-arrow.side-right::before { border-right: 8px solid ${C.text}; }
            #tm-hist-dock-tab.style-arrow:hover::before {
                opacity: 1;
                filter: drop-shadow(0 0 3px rgba(29,155,240,0.6));
                border-left-color:  #1d9bf0;
                border-right-color: #1d9bf0;
            }

            #tm-hist-dock-tab.style-dots {
                background: transparent;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center; gap: 6px;
            }
            #tm-hist-dock-tab.style-dots::before,
            #tm-hist-dock-tab.style-dots::after {
                display: none; 
            }
            .tm-dock-dot {
                width: 3px; height: 3px; border-radius: 50%;
                background: ${C.sub}; opacity: 0.45;
                transition: background 0.18s, opacity 0.18s, transform 0.18s;
            }
            #tm-hist-dock-tab.style-dots:hover .tm-dock-dot {
                background: #1d9bf0; opacity: 1;
            }
            #tm-hist-dock-tab.style-dots:hover .tm-dock-dot:nth-child(2) {
                transform: scale(1.4);
            }
                display: flex; flex-direction: column; align-items: center;
                justify-content: center; padding: 40px 20px;
                color: ${C.sub}; font-size: 13px; gap: 10px; text-align: center;
            }
            .tm-hist-empty svg { width: 36px; height: 36px; opacity: 0.4; }
            
            #tm-hist-zoom {
                position: fixed; z-index: 999999;
                width: 200px; height: 200px; border-radius: 8px;
                overflow: hidden; pointer-events: none;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                border: 2px solid rgba(255,255,255,0.2);
            }
            #tm-hist-zoom img { width: 100%; height: 100%; object-fit: cover; }
            
            #tm-group-tab-bar {
                position: relative;
                display: flex; align-items: center;
                padding: 0; gap: 0;
                border-bottom: 1px solid ${C.border};
                flex-shrink: 0; overflow: hidden;
                background: ${C.header};
            }
            #tm-group-tab-scroll {
                display: flex; align-items: center; gap: 4px;
                padding: 5px 8px;
                overflow-x: auto; overflow-y: hidden;
                scrollbar-width: none; flex: 1; min-width: 0;
                scroll-behavior: smooth;
            }
            #tm-group-tab-scroll::-webkit-scrollbar { display: none; }
            .tm-gtab-pill {
                display: inline-flex; align-items: center; gap: 4px;
                padding: 3px 9px 3px 7px;
                border-radius: 99px; border: 1px solid transparent;
                font-size: 11px; font-weight: 500;
                color: ${C.sub}; white-space: nowrap;
                cursor: pointer; flex-shrink: 0;
                background: transparent;
                font-family: inherit; line-height: 1.4;
                transition: background .12s, border-color .12s, color .12s;
            }
            .tm-gtab-pill:hover {
                background: ${C.rowHover};
                color: ${C.text};
                border-color: ${C.border};
            }
            .tm-gtab-pill.active {
                background: rgba(29,155,240,.14);
                border-color: rgba(29,155,240,.45);
                color: #1d9bf0;
            }
            .tm-gtab-pill svg {
                width: 12px; height: 12px;
                flex-shrink: 0; pointer-events: none;
            }
            .tm-gtab-scroll-btn {
                flex-shrink: 0; width: 22px; height: 100%;
                border: none; background: transparent;
                cursor: pointer; display: none;
                align-items: center; justify-content: center;
                color: ${C.sub}; padding: 0;
                transition: background .1s, color .1s;
                z-index: 2;
            }
            .tm-gtab-scroll-btn:hover { background: ${C.rowHover}; color: ${C.text}; }
            @keyframes tm-gtab-btn-flash {
                0%   { color: ${C.text};   background: ${C.accent}33; }
                50%  { color: #1d9bf0;     background: #1d9bf022; }
                100% { color: ${C.sub};    background: transparent; }
            }
            .tm-gtab-scroll-btn.tm-end-flash { animation: tm-gtab-btn-flash 0.45s ease forwards; }
            .tm-gtab-scroll-btn.visible { display: flex; }
            .tm-gtab-scroll-btn svg { width: 10px; height: 10px; pointer-events: none; }
            .tm-gtab-scroll-btn.left {
                border-right: 1px solid ${C.border};
            }
            .tm-gtab-scroll-btn.right {
                border-left: 1px solid ${C.border};
            }
            
            .tm-gtab-dot {
                width: 6px; height: 6px;
                border-radius: 50%;
                background: #fbbf24;
                flex-shrink: 0;
                box-shadow: 0 0 4px rgba(251,191,36,0.7);
                animation: tm-dot-pop 0.25s cubic-bezier(0.34,1.56,0.64,1);
            }
            @keyframes tm-dot-pop {
                from { transform: scale(0); opacity: 0; }
                to   { transform: scale(1); opacity: 1; }
            }
        `;

        const panel = document.createElement('div');
        panel.id = 'tm-hist-panel';
        panel.style.cssText = `left:${pos.x}px; top:${pos.y}px; width:${pos.w}px; height:${pos.h}px;`;

        if (_dockSideGlobal && !_pinned) {
            panel.style.opacity = '0';
            panel.style.transition = 'none';
        }

        const titlebar = document.createElement('div');
        titlebar.id = 'tm-hist-titlebar';

        const titleIcon = document.createElement('span');
        titleIcon.style.cssText = 'display:inline-flex;align-items:center;flex-shrink:0;opacity:0.55;margin-right:2px;';
        titleIcon.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="1" width="10" height="14" rx="1.5"/><line x1="6" y1="5" x2="10" y2="5"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="11" x2="8.5" y2="11"/></svg>`;

        const titleEl = document.createElement('span');
        titleEl.className = 'tm-hist-title';
        titleEl.textContent = 'Download History';
        titleEl.title = 'Download History';

        const countBadge = document.createElement('span');
        countBadge.className = 'tm-hist-count-badge';

        const SVG_LIST  = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="1" y1="4" x2="15" y2="4"/><line x1="1" y1="8" x2="15" y2="8"/><line x1="1" y1="12" x2="15" y2="12"/></svg>`;
        const SVG_GRID  = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>`;
        const SVG_EDIT  = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M11 2l3 3-8 8H3v-3L11 2z"/></svg>`;
        const SVG_EXP   = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 2v8M5 7l3 4 3-4"/><line x1="2" y1="13" x2="14" y2="13"/></svg>`;
        const SVG_CLOSE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;

        const btnViewToggle = _mkIconBtn(viewMode === 'list' ? SVG_GRID : SVG_LIST,
            viewMode === 'list' ? 'Switch to Thumbnail' : 'Switch to List');
        const btnEdit  = _mkIconBtn(SVG_EDIT,  'Edit mode');
        const btnExp   = _mkIconBtn(SVG_EXP,   'Export');
        const btnClose = _mkIconBtn(SVG_CLOSE, 'Close');

        const SVG_PIN = `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="4.5" r="2.5"/>
            <line x1="8" y1="7" x2="8" y2="11.5"/>
            <path d="M5 11.5 Q8 14.5 11 11.5Z"/>
        </svg>`;
        const SVG_PIN_FILLED = `<svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="4.5" r="2.5"/>
            <line x1="8" y1="7" x2="8" y2="11.5" stroke-width="1.8"/>
            <path d="M5 11.5 Q8 14.5 11 11.5Z"/>
        </svg>`;

        const btnPin = document.createElement('button');
        btnPin.id = 'tm-hist-btn-pin';
        btnPin.type = 'button';
        btnPin.innerHTML = _pinned ? SVG_PIN_FILLED : SVG_PIN;
        btnPin.title = _pinned ? 'Unpin panel (currently persistent across navigation)' : 'Pin panel (keep visible across SPA navigation)';
        if (_pinned) {
            btnPin.classList.add('pinned');
            panel.classList.add('tm-pinned');
        }

        btnPin.addEventListener('click', e => {
            e.stopPropagation();
            _pinned = !_pinned;
            GM_setValue(KEY_HIST_PINNED, _pinned);
            if (_pinned) {
                btnPin.classList.remove('unpinning');
                void btnPin.offsetWidth;
                btnPin.classList.add('pinned');
                btnPin.innerHTML = SVG_PIN_FILLED;
                btnPin.title = 'Unpin panel (currently persistent across navigation)';
                panel.classList.add('tm-pinned');
            } else {
                btnPin.classList.remove('pinned');
                btnPin.classList.add('unpinning');
                btnPin.innerHTML = SVG_PIN;
                btnPin.title = 'Pin panel (keep visible across SPA navigation)';
                panel.classList.remove('tm-pinned');
                btnPin.addEventListener('animationend', () => btnPin.classList.remove('unpinning'), { once: true });
            }
        });

        titlebar.appendChild(titleIcon);
        titlebar.appendChild(titleEl);
        titlebar.appendChild(countBadge);
        titlebar.appendChild(btnPin);
        titlebar.appendChild(btnViewToggle);
        titlebar.appendChild(btnEdit);
        titlebar.appendChild(btnExp);
        titlebar.appendChild(btnClose);
        panel.appendChild(titlebar);

        const searchBar = document.createElement('div');
        searchBar.className = 'tm-hist-searchbar';
        const searchInput = document.createElement('input');
        searchInput.id = 'tm-hist-search';
        searchInput.type = 'search';
        searchInput.placeholder = '🔍  Search author / content…';
        searchBar.appendChild(searchInput);
        panel.appendChild(searchBar);

        const groupTabBar = document.createElement('div');
        groupTabBar.id = 'tm-group-tab-bar';

        function buildGroupTabs() {
            groupTabBar.innerHTML = '';
            const groups = getGroups();
            groupTabBar.style.display = 'flex';

            const SVG_LEFT  = `<svg viewBox="0 0 10 10" fill="currentColor"><path d="M6.5 2L3.5 5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`;
            const SVG_RIGHT = `<svg viewBox="0 0 10 10" fill="currentColor"><path d="M3.5 2L6.5 5l-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`;

            const btnAddGroup = document.createElement('button');
            btnAddGroup.type = 'button';
            btnAddGroup.title = 'New group';
            btnAddGroup.style.cssText = 'flex-shrink:0;width:26px;height:26px;border-radius:7px;border:none;background:transparent;color:rgba(255,255,255,.35);cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;transition:background .12s,color .12s;margin:0 3px 0 2px';
            btnAddGroup.innerHTML = '<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></svg>';
            btnAddGroup.addEventListener('mouseover', () => { btnAddGroup.style.background = 'rgba(29,155,240,.18)'; btnAddGroup.style.color = '#1d9bf0'; });
            btnAddGroup.addEventListener('mouseout',  () => { btnAddGroup.style.background = 'transparent'; btnAddGroup.style.color = 'rgba(255,255,255,.35)'; });
            btnAddGroup.addEventListener('click', e => { e.stopPropagation(); showGroupCreateModal(); });

            const btnLeft = document.createElement('button');
            btnLeft.className = 'tm-gtab-scroll-btn left';
            btnLeft.innerHTML = SVG_LEFT;
            btnLeft.title = 'Scroll left';
            btnLeft.addEventListener('click', (e) => {
                e.stopPropagation();
                scrollArea.scrollBy({ left: -120, behavior: 'smooth' });
            });

            const scrollArea = document.createElement('div');
            scrollArea.id = 'tm-group-tab-scroll';

            const btnRight = document.createElement('button');
            btnRight.className = 'tm-gtab-scroll-btn right visible';
            btnRight.innerHTML = SVG_RIGHT;
            btnRight.title = 'Scroll right';
            btnRight.addEventListener('click', (e) => {
                e.stopPropagation();
                const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;
                if (scrollArea.scrollLeft >= maxScroll - 2) {
                    btnRight.classList.remove('tm-end-flash');
                    void btnRight.offsetWidth;
                    btnRight.classList.add('tm-end-flash');
                    btnRight.addEventListener('animationend', () => btnRight.classList.remove('tm-end-flash'), { once: true });
                    scrollArea.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollArea.scrollBy({ left: 120, behavior: 'smooth' });
                }
            });

            const makePill = (iconHtml, label, value) => {
                const pill = document.createElement('button');
                pill.type = 'button';
                const isActive =
                    (value === '__all__'       && (activeGroupId === null || activeGroupId === '__all__')) ||
                    (value === '__ungrouped__' && activeGroupId === '__ungrouped__') ||
                    (value !== '__all__' && value !== '__ungrouped__' && activeGroupId === value);
                pill.className = 'tm-gtab-pill' + (isActive ? ' active' : '');
                const iconSpan = document.createElement('span');
                iconSpan.innerHTML = iconHtml;
                iconSpan.style.cssText = 'display:inline-flex;align-items:center;flex-shrink:0';
                pill.appendChild(iconSpan);
                if (label) {
                    const txtSpan = document.createElement('span');
                    txtSpan.textContent = label;
                    pill.appendChild(txtSpan);
                }
                if (value !== '__ungrouped__' && value !== '__all__' && value !== '__favorites__' && GM_getValue('app_group_unread_' + value, false)) {
                    const dot = document.createElement('span');
                    dot.className = 'tm-gtab-dot';
                    pill.appendChild(dot);
                }
                pill.addEventListener('click', (e) => {
                    e.stopPropagation();
                    activeGroupId = value === '__all__' ? null : value;
                    if (value !== '__ungrouped__' && value !== '__all__' && value !== '__favorites__') {
                        GM_deleteValue('app_group_unread_' + value);
                        pill.querySelector('.tm-gtab-dot')?.remove();
                    }
                    scrollArea.querySelectorAll('.tm-gtab-pill').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    pill.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                    render();
                });

                if (value !== '__ungrouped__' && value !== '__all__' && value !== '__favorites__') {
                    pill.addEventListener('contextmenu', e => {
                        e.preventDefault(); e.stopPropagation();
                        document.getElementById('tm-pill-ctx')?.remove();
                        _dialogOpenGlobal = true;
                        const menu = document.createElement('div');
                        menu.id = 'tm-pill-ctx';
                        menu.style.cssText = `
                            position:fixed;left:${e.clientX}px;top:${e.clientY}px;
                            background:#1a1f2e;border:0.5px solid rgba(255,255,255,.15);
                            border-radius:10px;padding:4px;min-width:150px;
                            z-index:999999;box-shadow:0 8px 32px rgba(0,0,0,.6);
                            font-size:13px;
                        `;
                        const mkItem = (icon, label, color, onClick) => {
                            const item = document.createElement('button');
                            item.type = 'button';
                            item.style.cssText = `display:flex;align-items:center;gap:9px;width:100%;padding:8px 12px;background:transparent;border:none;border-radius:7px;color:${color || 'rgba(255,255,255,.88)'};cursor:pointer;font-size:13px;font-family:inherit;text-align:left;transition:background .1s`;
                            item.addEventListener('mouseover', () => item.style.background = 'rgba(255,255,255,.08)');
                            item.addEventListener('mouseout',  () => item.style.background = 'transparent');
                            const iconEl = document.createElement('span');
                            iconEl.style.cssText = 'font-size:15px;flex-shrink:0;line-height:1';
                            iconEl.textContent = icon;
                            const labelEl = document.createElement('span');
                            labelEl.textContent = label;
                            item.appendChild(iconEl); item.appendChild(labelEl);
                            item.addEventListener('click', () => { menu.remove(); _dialogOpenGlobal = false; onClick(); });
                            return item;
                        };
                        menu.appendChild(mkItem('✏️', 'Rename', null, () => {
                            _dialogOpenGlobal = true;
                            const newName = prompt('Rename group:', label);
                            _dialogOpenGlobal = false;
                            if (!newName || !newName.trim()) return;
                            const arr = getGroups();
                            const idx = arr.findIndex(x => x.id === value);
                            if (idx > -1) { arr[idx].name = newName.trim(); saveGroups(arr); }
                            render();
                        }));
                        const sep = document.createElement('div');
                        sep.style.cssText = 'height:0.5px;background:rgba(255,255,255,.1);margin:3px 8px';
                        menu.appendChild(sep);
                        menu.appendChild(mkItem('🗑️', 'Delete group', 'rgba(255,100,100,.9)', () => {
                            _dialogOpenGlobal = true;
                            const ok = confirm(`Delete group「${label}」? Records will be ungrouped.`);
                            _dialogOpenGlobal = false;
                            if (!ok) return;
                            deleteGroup(value);
                            if (activeGroupId === value) activeGroupId = null;
                            render();
                        }));
                        document.body.appendChild(menu);
                        requestAnimationFrame(() => {
                            const r = menu.getBoundingClientRect();
                            if (r.right  > window.innerWidth)  menu.style.left = (e.clientX - r.width)  + 'px';
                            if (r.bottom > window.innerHeight)  menu.style.top  = (e.clientY - r.height) + 'px';
                        });
                        const close = ev => {
                            if (!menu.contains(ev.target)) {
                                menu.remove();
                                _dialogOpenGlobal = false;
                                document.removeEventListener('mousedown', close, true);
                            }
                        };
                        document.addEventListener('mousedown', close, true);
                    });
                }
                return pill;
            };

            const SVG_ALL = `<svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/><rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>`;
            scrollArea.appendChild(makePill(SVG_ALL, 'All', '__all__'));

            const SVG_HEART = `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" stroke="none"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91z"/></svg>`;
            scrollArea.appendChild(makePill(SVG_HEART, '', '__favorites__'));

            groups.forEach(g => {
                const ic = _resolveGroupIcon(g.icon);
                const iconHtml = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">${ic.svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1] || ''}</svg>`;
                scrollArea.appendChild(makePill(iconHtml, g.name, g.id));
            });

            const SVG_DASH = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="2" y1="6" x2="10" y2="6"/></svg>`;
            scrollArea.appendChild(makePill(SVG_DASH, 'Ungrouped', '__ungrouped__'));

            groupTabBar.appendChild(btnAddGroup);
            groupTabBar.appendChild(btnLeft);
            groupTabBar.appendChild(scrollArea);
            groupTabBar.appendChild(btnRight);

            const syncArrows = () => {
                const canLeft = scrollArea.scrollLeft > 2;
                btnLeft.classList.toggle('visible', canLeft);
            };
            scrollArea.addEventListener('scroll', syncArrows, { passive: true });
            if (window.ResizeObserver) {
                const ro = new ResizeObserver(syncArrows);
                ro.observe(scrollArea);
            }
            requestAnimationFrame(syncArrows);
        }

        buildGroupTabs();
        panel.appendChild(groupTabBar);
        const body = document.createElement('div');
        body.id = 'tm-hist-body';
        panel.appendChild(body);

        const footer = document.createElement('div');
        footer.id = 'tm-hist-footer';
        footer.className = 'hidden';

        const selAllBtn = document.createElement('button');
        selAllBtn.className = 'tm-hist-sel-all-btn';
        selAllBtn.textContent = 'Select All';

        const delSelBtn = document.createElement('button');
        delSelBtn.className = 'tm-hist-del-sel-btn';

        const cancelEditBtn = document.createElement('button');
        cancelEditBtn.className = 'tm-hist-cancel-edit';
        cancelEditBtn.textContent = 'Cancel';

        footer.appendChild(selAllBtn);
        footer.appendChild(delSelBtn);
        footer.appendChild(cancelEditBtn);
        panel.appendChild(footer);

        const ghFooterEl = document.createElement('div');
        ghFooterEl.id = 'tm-hist-gh-footer';
        const ghLink = document.createElement('a');
        ghLink.href    = 'https://github.com/Startanuki07/Twitter-X-Media-Copy-Download';
        ghLink.target  = '_blank';
        ghLink.rel     = 'noopener noreferrer';
        ghLink.textContent = '★ Star on GitHub';
        ghFooterEl.appendChild(ghLink);
        panel.appendChild(ghFooterEl);

        const resizeHandle = document.createElement('div');
        resizeHandle.id = 'tm-hist-resize';
        resizeHandle.innerHTML = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="2" y1="12" x2="12" y2="12"/><line x1="7" y1="12" x2="12" y2="7"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`;
        panel.appendChild(resizeHandle);

        const SVG_NOTCH = `<svg viewBox="0 0 6 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="6"  width="2" height="2" rx="1" fill="currentColor"/>
  <rect x="2" y="13" width="2" height="2" rx="1" fill="currentColor"/>
  <rect x="2" y="20" width="2" height="2" rx="1" fill="currentColor"/>
</svg>`;
        const dockTriggerL = document.createElement('button');
        dockTriggerL.className = 'tm-dock-trigger left';
        dockTriggerL.title = 'Dock panel to left edge';
        dockTriggerL.innerHTML = SVG_NOTCH;
        panel.appendChild(dockTriggerL);
        const dockTriggerR = document.createElement('button');
        dockTriggerR.className = 'tm-dock-trigger right';
        dockTriggerR.title = 'Dock panel to right edge';
        dockTriggerR.innerHTML = SVG_NOTCH;
        panel.appendChild(dockTriggerR);

        document.body.appendChild(panel);

        function getRecords() {
            try { return JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]')); }
            catch (_) { return []; }
        }

        function getFiltered(records) {
            let result = records;
            if (activeGroupId === '__favorites__') {
                result = result.filter(r => r.favorited === true);
            } else if (activeGroupId === '__ungrouped__') {
                result = result.filter(r => !r.groupId);
            } else if (activeGroupId) {
                result = result.filter(r => r.groupId === activeGroupId);
            }
            if (query) {
                const q = query.toLowerCase();
                result = result.filter(r =>
                    r.displayName?.toLowerCase().includes(q) ||
                    r.screenName?.toLowerCase().includes(q) ||
                    r.text?.toLowerCase().includes(q)
                );
            }
            return result;
        }

        function _fmtGroupLabel(yyyymm) {
            const p = yyyymm.split('.');
            if (p.length !== 2) return yyyymm;
            const y = p[0];
            const m = parseInt(p[1], 10);
            if (_cachedDateFormat === 'western') {
                const names = ['','January','February','March','April','May','June',
                               'July','August','September','October','November','December'];
                return `${names[m] || p[1]} ${y}`;
            }
            return `${y}年 ${m}月`;
        }

        function render() {
            const records  = getRecords();
            const filtered = getFiltered(records);
            countBadge.textContent = `${records.length} entries`;
            delSelBtn.textContent = `Delete selected (${selectedIds.size})`;

            const visibleIds = filtered
                .filter(r => !collapsedGroups.has(r.yyyymm))
                .map(r => r.id);
            const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.has(id));
            selAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';

            body.innerHTML = '';
            buildGroupTabs();

            if (viewMode === 'list') renderList(filtered);
            else renderThumb(filtered);

            btnViewToggle.innerHTML = viewMode === 'list' ? SVG_GRID : SVG_LIST;
            btnViewToggle.title     = viewMode === 'list' ? 'Switch to Thumbnail' : 'Switch to List';
            btnViewToggle.classList.toggle('active', true);
        }

        function renderList(records) {
            if (!records.length) { _renderEmpty(); return; }

            const groupCounts = {};
            records.forEach(r => { groupCounts[r.yyyymm] = (groupCounts[r.yyyymm] || 0) + 1; });

            let lastGroup = null;
            let _cbShiftDown = false;

            records.forEach((rec, idx) => {
                if (rec.yyyymm !== lastGroup) {
                    lastGroup = rec.yyyymm;
                    const isCollapsed = collapsedGroups.has(rec.yyyymm);
                    const gh = document.createElement('div');
                    gh.className = 'tm-hist-group-header' + (isCollapsed ? ' tm-collapsed' : '');
                    gh.dataset.yyyymm = rec.yyyymm;

                    const chevron = document.createElement('span');
                    chevron.className = 'tm-hist-group-chevron';
                    chevron.innerHTML = `<svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor"><path d="M1 3l4 4 4-4z"/></svg>`;

                    const label = document.createElement('span');
                    label.textContent = _fmtGroupLabel(rec.yyyymm);

                    const countEl = document.createElement('span');
                    countEl.className = 'tm-hist-group-count';
                    countEl.textContent = `${groupCounts[rec.yyyymm]}`;

                    gh.appendChild(chevron);
                    gh.appendChild(label);
                    gh.appendChild(countEl);

                    gh.addEventListener('click', () => {
                        if (collapsedGroups.has(rec.yyyymm)) collapsedGroups.delete(rec.yyyymm);
                        else collapsedGroups.add(rec.yyyymm);
                        render();
                    });
                    body.appendChild(gh);
                }

                if (collapsedGroups.has(rec.yyyymm)) return;

                const row = document.createElement('div');
                row.className = 'tm-hist-row' + (selectedIds.has(rec.id) ? ' selected' : '');
                row.dataset.id = rec.id;
                row.dataset.idx = idx;

                if (editMode) {
                    if (!rec.favorited) {
                        const cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.className = 'tm-hist-cb';
                        cb.checked = selectedIds.has(rec.id);
                        cb.addEventListener('mousedown', e => { _cbShiftDown = e.shiftKey; });
                        cb.addEventListener('change', e => {
                            e.stopPropagation();
                            _handleCheckbox(rec.id, idx, _cbShiftDown);
                            _cbShiftDown = false;
                        });
                        row.appendChild(cb);
                    } else {
                        const lock = document.createElement('span');
                        lock.className = 'tm-hist-cb';
                        lock.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;opacity:0.35;font-size:10px;';
                        lock.textContent = '♥';
                        row.appendChild(lock);
                    }
                }

                const thumbWrap = document.createElement('div');
                thumbWrap.className = 'tm-hist-thumb-wrap';
                if (rec.thumbUrls && rec.thumbUrls.length > 0) {
                    const img = document.createElement('img');
                    img.src = _thumbUrl(rec.thumbUrls[0]);
                    img.loading = 'lazy';
                    img.alt = '';
                    thumbWrap.appendChild(img);
                    thumbWrap.classList.add('tm-has-thumb');
                    thumbWrap.addEventListener('mouseenter', (e) => _showZoom(rec.thumbUrls[0], e));
                    thumbWrap.addEventListener('mousemove',  (e) => _moveZoom(e));
                    thumbWrap.addEventListener('mouseleave', _hideZoom);
                    thumbWrap.addEventListener('click', (e) => {
                        e.stopPropagation();
                        _hideZoom();
                        _openHistMediaLightbox(rec, 0, thumbWrap.querySelector('img'));
                    });
                } else if (rec.textOnly) {
                    const vi = document.createElement('div');
                    vi.className = 'tm-hist-video-icon';
                    vi.style.color = 'rgba(29,155,240,.5)';
                    vi.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="14" y2="17"/></svg>`;
                    thumbWrap.appendChild(vi);
                } else {
                    const vi = document.createElement('div');
                    vi.className = 'tm-hist-video-icon';
                    vi.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M15 10l4.55-2.28A1 1 0 0 1 21 8.65v6.7a1 1 0 0 1-1.45.93L15 14"/><rect x="2" y="7" width="13" height="10" rx="2"/></svg>`;
                    thumbWrap.appendChild(vi);
                }
                row.appendChild(thumbWrap);

                const info = document.createElement('div');
                info.className = 'tm-hist-info';

                const author = document.createElement('div');
                author.className = 'tm-hist-author';
                author.textContent = rec.displayName || rec.screenName;
                const handle = document.createElement('span');
                handle.className = 'tm-hist-handle';
                handle.textContent = `@${rec.screenName}`;
                author.appendChild(handle);

                const textEl = document.createElement('div');
                textEl.className = 'tm-hist-text';
                textEl.textContent = rec.text || '(no caption)';

                const dateEl = document.createElement('div');
                dateEl.className = 'tm-hist-date';
                if (rec.downloadDate) {
                    const [dy, dm, dd] = rec.downloadDate.split('-');
                    if (_cachedDateFormat === 'western') {
                        const MON = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        dateEl.textContent = `${parseInt(dd, 10)} ${MON[parseInt(dm, 10)] || dm} ${dy}`;
                    } else {
                        dateEl.textContent = `${dy}.${dm}.${dd}`;
                    }
                }

                const urlEl = document.createElement('div');
                urlEl.className = 'tm-hist-url';
                urlEl.textContent = rec.tweetUrl;
                urlEl.title = rec.tweetUrl + '\nClick to navigate to tweet';
                urlEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    try {
                        const path = new URL(rec.tweetUrl).pathname;
                        history.pushState({ tmNav: true }, '', path);
                        window.dispatchEvent(new Event('popstate'));
                    } catch (_) { window.open(rec.tweetUrl, '_blank'); }
                });

                info.appendChild(author);
                info.appendChild(textEl);
                if (rec.downloadDate) info.appendChild(dateEl);
                info.appendChild(urlEl);
                row.appendChild(info);

                const acts = document.createElement('div');
                acts.className = 'tm-hist-actions';

                const SVG_JUMP    = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10 2h4v4"/><path d="M7 9L14 2"/><path d="M12 10v4H2V4h4"/></svg>`;
                const SVG_DEL     = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="2,4 4,4 14,4"/><path d="M13 4l-.9 9H3.9L3 4"/><path d="M6.5 7v4M9.5 7v4"/><path d="M5.5 4V2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5V4"/></svg>`;
                const SVG_COPY    = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="10" rx="1.5"/><path d="M3 11H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1"/></svg>`;
                const SVG_HEART_EMPTY = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.207 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5z"/></svg>`;
                const SVG_HEART_FULL  = `<svg viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.207 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5z"/></svg>`;

                const copyBtn = document.createElement('button');
                copyBtn.className = 'tm-hist-act-btn tm-copy-btn';
                copyBtn.innerHTML = SVG_COPY;
                copyBtn.title = 'Click: Copy tweet URL\nHold: Copy with prefix';

                const _getMediaUrls = () => {
                    const _dom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false)
                        ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                    const _toUrl = u => {
                        try {
                            const o = new URL(u);
                            if (o.hostname.includes('twimg.com') || u.includes('.mp4')) return u;
                            o.hostname = _dom;
                            return o.toString();
                        }
                        catch(_) { return u; }
                    };
                    return _toUrl(rec.tweetUrl);
                };

                let _cpTimer = null;

                copyBtn.addEventListener('mousedown', e => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    _cpTimer = setTimeout(() => {
                        _cpTimer = null;
                        const _dom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false)
                            ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                        let tUrl = rec.tweetUrl;
                        try { const o = new URL(tUrl); o.hostname = _dom; tUrl = o.toString(); } catch(_) {}
                        const prefix = GM_getValue(KEY_PREFIX_TEXT, '[text]');
                        GM_setClipboard(`${prefix}(${tUrl})`);
                        copyBtn.style.color = '#f59e0b';
                        setTimeout(() => { copyBtn.style.color = ''; }, 900);
                    }, 500);
                });

                copyBtn.addEventListener('mouseup', e => {
                    if (_cpTimer) {
                        clearTimeout(_cpTimer); _cpTimer = null;
                        GM_setClipboard(_getMediaUrls());
                        copyBtn.style.color = '#1d9bf0';
                        setTimeout(() => { copyBtn.style.color = ''; }, 800);
                    }
                });

                copyBtn.addEventListener('mouseleave', () => { if (_cpTimer) { clearTimeout(_cpTimer); _cpTimer = null; } });
                copyBtn.addEventListener('click', e => e.stopPropagation());

                const jmpBtn = document.createElement('button');
                jmpBtn.className = 'tm-hist-act-btn';
                jmpBtn.innerHTML = SVG_JUMP;
                jmpBtn.title = 'Open tweet';
                jmpBtn.addEventListener('click', (e) => { e.stopPropagation(); window.open(rec.tweetUrl, '_blank'); });

                const favBtn = document.createElement('button');
                const isFav = !!rec.favorited;
                favBtn.className = 'tm-hist-act-btn tm-fav-btn' + (isFav ? ' tm-fav-active' : '');
                favBtn.innerHTML = isFav ? SVG_HEART_FULL : SVG_HEART_EMPTY;
                favBtn.title = isFav ? 'Unfavorite' : 'Favorite';
                if (editMode) {
                    favBtn.style.opacity = '0.3';
                    favBtn.style.pointerEvents = 'none';
                }
                favBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let records = getRecords();
                    const target = records.find(r => r.id === rec.id);
                    if (!target) return;
                    target.favorited = !target.favorited;
                    GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));
                    const nowFav = target.favorited;
                    favBtn.innerHTML = nowFav ? SVG_HEART_FULL : SVG_HEART_EMPTY;
                    favBtn.title = nowFav ? 'Unfavorite' : 'Favorite';
                    favBtn.classList.toggle('tm-fav-active', nowFav);
                    rec.favorited = nowFav;
                });

                const delBtn = document.createElement('button');
                delBtn.className = 'tm-hist-act-btn danger';
                delBtn.innerHTML = SVG_DEL;
                delBtn.title = 'Delete';
                delBtn.addEventListener('click', (e) => { e.stopPropagation(); _deleteOne(rec.id, idx); });

                const SVG_DLOAD = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 2v8"/><path d="M5 7l3 3 3-3"/><path d="M2 13h12"/></svg>`;
                const dlBtn = document.createElement('button');
                dlBtn.className = 'tm-hist-act-btn';
                dlBtn.innerHTML = SVG_DLOAD;
                const hasMedia = rec.mediaUrls && rec.mediaUrls.length > 0;
                dlBtn.title = hasMedia ? `Re-download (${rec.mediaUrls.length} file${rec.mediaUrls.length > 1 ? 's' : ''})` : 'Open tweet to re-download';
                dlBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!hasMedia) { window.open(rec.tweetUrl, '_blank'); return; }
                    const safeDisplay = sanitizeForFilename(rec.displayName || rec.screenName || 'unknown');
                    const safeScreen  = sanitizeForFilename(rec.screenName  || 'unknown');
                    const datePart    = rec.tweetDate || rec.downloadDate || 'unknown';
                    const textPart    = rec.text ? `_${sanitizeForFilename(rec.text, 40)}` : '';
                    const idPart      = rec.tweetId || rec.id;
                    rec.mediaUrls.forEach((url, i) => {
                        let ext = 'jpg';
                        if (url.includes('.mp4')) {
                            ext = 'mp4';
                        } else {
                            try {
                                const fmtParam = new URL(url).searchParams.get('format');
                                ext = fmtParam || url.match(/\.(\w{3,4})(?:\?|$)/)?.[1] || 'jpg';
                            } catch (_) {}
                        }
                        const fname = `[twitter] ${safeDisplay}(@${safeScreen})_${datePart}${textPart}_${idPart}_${i + 1}.${ext}`;
                        setTimeout(() => forceDownloadBlob(url, fname), i * 600);
                    });
                });

                acts.appendChild(copyBtn);
                acts.appendChild(favBtn);
                acts.appendChild(jmpBtn);
                acts.appendChild(dlBtn);
                acts.appendChild(delBtn);
                row.appendChild(acts);

                if (editMode && !rec.favorited) {
                    row.style.cursor = 'pointer';
                    row.addEventListener('click', (e) => {
                        if (e.target.classList.contains('tm-hist-cb')) return;
                        _handleCheckbox(rec.id, idx, e.shiftKey);
                    });
                }

                body.appendChild(row);
            });
        }

        function renderThumb(records) {
            if (!records.length) { _renderEmpty(); return; }
            const grid = document.createElement('div');
            grid.id = 'tm-hist-thumb-grid';

            records.forEach((rec, idx) => {
                const cell = document.createElement('div');
                cell.className = 'tm-hist-grid-cell';
                cell.title = `${rec.displayName} @${rec.screenName}`;

                if (rec.thumbUrls && rec.thumbUrls.length > 0) {
                    const img = document.createElement('img');
                    img.src = _thumbUrl(rec.thumbUrls[0]);
                    img.loading = 'lazy';
                    img.alt = '';
                    cell.appendChild(img);
                } else if (rec.textOnly) {
                    const tc = document.createElement('div');
                    tc.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:6px;padding:10px;box-sizing:border-box;background:rgba(29,155,240,.08)';
                    const tcIcon = document.createElement('div');
                    tcIcon.innerHTML = `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="rgba(29,155,240,.6)" stroke-width="1.6" stroke-linecap="round"><line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="9" x2="17" y2="9"/><line x1="3" y1="13" x2="12" y2="13"/></svg>`;
                    const tcText = document.createElement('div');
                    tcText.style.cssText = 'font-size:10px;color:rgba(255,255,255,.5);text-align:center;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;word-break:break-all';
                    tcText.textContent = rec.text || '';
                    tc.appendChild(tcIcon);
                    tc.appendChild(tcText);
                    cell.appendChild(tc);
                } else {
                    const ni = document.createElement('div');
                    ni.className = 'tm-hist-grid-nothumb';
                    ni.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M15 10l4.55-2.28A1 1 0 0 1 21 8.65v6.7a1 1 0 0 1-1.45.93L15 14"/><rect x="2" y="7" width="13" height="10" rx="2"/></svg>`;
                    cell.appendChild(ni);
                }

                const overlay = document.createElement('div');
                overlay.className = 'tm-hist-grid-overlay';
                const govAuthor = document.createElement('div');
                govAuthor.className = 'gov-author';
                govAuthor.textContent = rec.displayName || rec.screenName;
                const govText = document.createElement('div');
                govText.className = 'gov-text';
                govText.textContent = rec.text || '';
                overlay.appendChild(govAuthor);
                overlay.appendChild(govText);
                cell.appendChild(overlay);

                const SVG_COPY_SM = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="10" rx="1.5"/><path d="M3 11H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1"/></svg>`;
                const gridCopyBtn = document.createElement('button');
                gridCopyBtn.className = 'tm-grid-copy-btn';
                gridCopyBtn.innerHTML = SVG_COPY_SM;
                gridCopyBtn.title = 'Click: Copy tweet URL\nHold: Copy with prefix';

                const _gcGetUrls = () => {
                    const _dom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false)
                        ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                    const _toUrl = u => {
                        try {
                            const o = new URL(u);
                            if (o.hostname.includes('twimg.com') || u.includes('.mp4')) return u;
                            o.hostname = _dom;
                            return o.toString();
                        }
                        catch(_) { return u; }
                    };
                    return _toUrl(rec.tweetUrl);
                };

                let _gcTimer = null;
                let _gcPressing = false;
                gridCopyBtn.addEventListener('mousedown', e => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    _gcPressing = true;
                    _gcTimer = setTimeout(() => {
                        _gcTimer = null;
                        _gcPressing = false;
                        const _dom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false)
                            ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                        let tUrl = rec.tweetUrl;
                        try { const o = new URL(tUrl); o.hostname = _dom; tUrl = o.toString(); } catch(_) {}
                        const prefix = GM_getValue(KEY_PREFIX_TEXT, '[text]');
                        GM_setClipboard(`${prefix}(${tUrl})`);
                        gridCopyBtn.style.background = 'rgba(245,158,11,0.9)';
                        setTimeout(() => { gridCopyBtn.style.background = ''; }, 800);
                    }, 500);
                });
                gridCopyBtn.addEventListener('mouseup', e => {
                    _gcPressing = false;
                    if (_gcTimer) {
                        clearTimeout(_gcTimer); _gcTimer = null;
                        GM_setClipboard(_gcGetUrls());
                        gridCopyBtn.style.background = 'rgba(29,155,240,0.9)';
                        setTimeout(() => { gridCopyBtn.style.background = ''; }, 700);
                    }
                });
                gridCopyBtn.addEventListener('mouseleave', () => { if (_gcTimer && !_gcPressing) { clearTimeout(_gcTimer); _gcTimer = null; } });
                gridCopyBtn.addEventListener('click', e => e.stopPropagation());
                cell.appendChild(gridCopyBtn);

                const SVG_DL_SM = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 2v8"/><path d="M5 7l3 3 3-3"/><path d="M2 13h12"/></svg>`;
                const gridDlBtn = document.createElement('button');
                gridDlBtn.className = 'tm-grid-dl-btn';
                gridDlBtn.innerHTML = SVG_DL_SM;
                const _gcHasMedia = rec.mediaUrls && rec.mediaUrls.length > 0;
                gridDlBtn.title = _gcHasMedia
                    ? `Re-download (${rec.mediaUrls.length} file${rec.mediaUrls.length > 1 ? 's' : ''})`
                    : 'Open tweet to re-download';
                gridDlBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    if (!_gcHasMedia) { window.open(rec.tweetUrl, '_blank'); return; }
                    const safeDisplay = sanitizeForFilename(rec.displayName || rec.screenName || 'unknown');
                    const safeScreen  = sanitizeForFilename(rec.screenName  || 'unknown');
                    const datePart    = rec.tweetDate || rec.downloadDate || 'unknown';
                    const textPart    = rec.text ? `_${sanitizeForFilename(rec.text, 40)}` : '';
                    const idPart      = rec.tweetId || rec.id;
                    rec.mediaUrls.forEach((url, i) => {
                        let ext = 'jpg';
                        if (url.includes('.mp4')) {
                            ext = 'mp4';
                        } else {
                            try {
                                const fmtParam = new URL(url).searchParams.get('format');
                                ext = fmtParam || url.match(/\.(\w{3,4})(?:\?|$)/)?.[1] || 'jpg';
                            } catch (_) {}
                        }
                        const fname = `[twitter] ${safeDisplay}(@${safeScreen})_${datePart}${textPart}_${idPart}_${i + 1}.${ext}`;
                        setTimeout(() => forceDownloadBlob(url, fname), i * 600);
                    });
                });
                cell.appendChild(gridDlBtn);

                const SVG_GOTO_SM = `<svg viewBox="0 0 14 14" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10 L10 4"/><path d="M6.5 4h3.5v3.5"/></svg>`;
                const gridGotoBtn = document.createElement('button');
                gridGotoBtn.className = 'tm-grid-goto-btn';
                gridGotoBtn.innerHTML = SVG_GOTO_SM;
                gridGotoBtn.title = 'Go to tweet';
                gridGotoBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    if (_isTwitterDomain) {
                        try {
                            const path = new URL(rec.tweetUrl).pathname;
                            history.pushState({ tmNav: true }, '', path);
                            window.dispatchEvent(new Event('popstate'));
                        } catch (_) { window.open(rec.tweetUrl, '_blank'); }
                    } else {
                        window.open(rec.tweetUrl, '_blank');
                    }
                });
                cell.appendChild(gridGotoBtn);

                if (editMode) {
                    if (rec.favorited) {
                        cell.classList.add('tm-grid-fav-lock');
                        cell.style.cursor = 'default';
                    } else {
                        if (selectedIds.has(rec.id)) cell.classList.add('selected');
                        cell.style.cursor = 'pointer';
                    }
                }

                cell.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (editMode) {
                        if (rec.favorited) return;
                        _handleCheckbox(rec.id, idx, e.shiftKey);
                    } else {
                        _openHistMediaLightbox(rec, 0, cell.querySelector('img'));
                    }
                });

                cell.addEventListener('contextmenu', e => {
                    e.preventDefault(); e.stopPropagation();
                    document.getElementById('tm-thumb-ctx')?.remove();
                    _dialogOpenGlobal = true;
                    const menu = document.createElement('div');
                    menu.id = 'tm-thumb-ctx';
                    menu.style.cssText = `
                        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
                        background:#1a1f2e;border:0.5px solid rgba(255,255,255,.15);
                        border-radius:10px;padding:4px;min-width:160px;
                        z-index:999999;box-shadow:0 8px 32px rgba(0,0,0,.6);
                        font-size:13px;
                    `;
                    const mkItem = (svgOrEmoji, label, onClick, danger = false) => {
                        const item = document.createElement('button');
                        item.type = 'button';
                        item.style.cssText = `display:flex;align-items:center;gap:9px;width:100%;padding:7px 12px;background:transparent;border:none;border-radius:7px;color:${danger ? 'rgba(255,100,100,.9)' : 'rgba(255,255,255,.88)'};cursor:pointer;font-size:13px;font-family:inherit;text-align:left;transition:background .1s`;
                        item.addEventListener('mouseover', () => item.style.background = danger ? 'rgba(255,80,80,.1)' : 'rgba(255,255,255,.08)');
                        item.addEventListener('mouseout',  () => item.style.background = 'transparent');
                        const iconEl = document.createElement('span');
                        iconEl.style.cssText = 'width:16px;height:16px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:inherit;opacity:0.8';
                        if (svgOrEmoji.trim().startsWith('<svg')) {
                            iconEl.innerHTML = svgOrEmoji;
                            iconEl.querySelector('svg')?.setAttribute('width', '14');
                            iconEl.querySelector('svg')?.setAttribute('height', '14');
                        } else {
                            iconEl.style.fontSize = '14px';
                            iconEl.textContent = svgOrEmoji;
                        }
                        const labelEl = document.createElement('span');
                        labelEl.textContent = label;
                        item.appendChild(iconEl); item.appendChild(labelEl);
                        item.addEventListener('click', () => { menu.remove(); _dialogOpenGlobal = false; onClick(); });
                        return item;
                    };

                    const CTX_FAV_ON  = `<svg viewBox="0 0 16 16" fill="currentColor"  stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.207 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5z"/></svg>`;
                    const CTX_FAV_OFF = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.207 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5z"/></svg>`;
                    const CTX_COPY    = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="9" height="10" rx="1.5"/><path d="M3 11H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1"/></svg>`;
                    const CTX_OPEN    = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10 2h4v4"/><path d="M7 9L14 2"/><path d="M12 10v4H2V4h4"/></svg>`;
                    const CTX_DEL     = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="2,4 4,4 14,4"/><path d="M13 4l-.9 9H3.9L3 4"/><path d="M6.5 7v4M9.5 7v4"/><path d="M5.5 4V2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5V4"/></svg>`;

                    menu.appendChild(mkItem(CTX_COPY, 'Copy media URL(s)', () => {
                        const _dom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false)
                            ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                        const _toUrl = u => {
                            try {
                                const o = new URL(u);
                                if (o.hostname.includes('twimg.com') || u.includes('.mp4')) return u;
                                o.hostname = _dom;
                                return o.toString();
                            }
                            catch(_) { return u; }
                        };
                        const urls = (rec.mediaUrls || []).length
                            ? rec.mediaUrls.map(_toUrl).join('\n')
                            : _toUrl(rec.tweetUrl);
                        GM_setClipboard(urls);
                    }));
                    const CTX_PREFIX = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="10" height="8" rx="1.2"/><path d="M11 6h2a2 2 0 0 1 0 4h-2"/></svg>`;
                    menu.appendChild(mkItem(CTX_PREFIX, 'Copy with prefix', () => {
                        const _dom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false)
                            ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                        let tUrl = rec.tweetUrl;
                        try { const o = new URL(tUrl); o.hostname = _dom; tUrl = o.toString(); } catch(_) {}
                        const prefix = GM_getValue(KEY_PREFIX_TEXT, '[text]');
                        GM_setClipboard(`${prefix}(${tUrl})`);
                    }));
                    const isFav = !!rec.favorited;
                    menu.appendChild(mkItem(isFav ? CTX_FAV_ON : CTX_FAV_OFF, isFav ? 'Unfavorite' : 'Favorite', () => {
                        let records = getRecords();
                        const target = records.find(r => r.id === rec.id);
                        if (!target) return;
                        target.favorited = !target.favorited;
                        GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));
                        rec.favorited = target.favorited;
                        render();
                    }));
                    menu.appendChild(mkItem(CTX_OPEN, 'Open in new tab', () => {
                        window.open(rec.tweetUrl, '_blank');
                    }));
                    const CTX_VIEW = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="1" y="3" width="14" height="10" rx="1.5"/><circle cx="5.5" cy="7.5" r="1.5"/><path d="M9 10l2-2.5 2.5 2.5"/></svg>`;
                    menu.appendChild(mkItem(CTX_VIEW, 'View media', () => {
                        _openHistMediaLightbox(rec, 0, null);
                    }));
                    const CTX_DLOAD = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 2v8"/><path d="M5 7l3 3 3-3"/><path d="M2 13h12"/></svg>`;
                    const hasMedia = rec.mediaUrls && rec.mediaUrls.length > 0;
                    menu.appendChild(mkItem(CTX_DLOAD, hasMedia ? 'Re-download' : 'Open tweet to re-download', () => {
                        if (!hasMedia) { window.open(rec.tweetUrl, '_blank'); return; }
                        const safeDisplay = sanitizeForFilename(rec.displayName || rec.screenName || 'unknown');
                        const safeScreen  = sanitizeForFilename(rec.screenName  || 'unknown');
                        const datePart    = rec.tweetDate || rec.downloadDate || 'unknown';
                        const textPart    = rec.text ? `_${sanitizeForFilename(rec.text, 40)}` : '';
                        const idPart      = rec.tweetId || rec.id;
                        rec.mediaUrls.forEach((url, i) => {
                            let ext = 'jpg';
                            if (url.includes('.mp4')) {
                                ext = 'mp4';
                            } else {
                                try {
                                    const fmtParam = new URL(url).searchParams.get('format');
                                    ext = fmtParam || url.match(/\.(\w{3,4})(?:\?|$)/)?.[1] || 'jpg';
                                } catch (_) {}
                            }
                            const fname = `[twitter] ${safeDisplay}(@${safeScreen})_${datePart}${textPart}_${idPart}_${i + 1}.${ext}`;
                            setTimeout(() => forceDownloadBlob(url, fname), i * 600);
                        });
                    }));
                    const sep = document.createElement('div');
                    sep.style.cssText = 'height:0.5px;background:rgba(255,255,255,.1);margin:3px 8px';
                    menu.appendChild(sep);
                    menu.appendChild(mkItem(CTX_DEL, 'Delete', () => {
                        _deleteOne(rec.id, records.indexOf(rec));
                    }, true));

                    document.body.appendChild(menu);
                    requestAnimationFrame(() => {
                        const r = menu.getBoundingClientRect();
                        if (r.right  > window.innerWidth)  menu.style.left = (e.clientX - r.width)  + 'px';
                        if (r.bottom > window.innerHeight)  menu.style.top  = (e.clientY - r.height) + 'px';
                    });
                    const close = ev => {
                        if (!menu.contains(ev.target)) {
                            menu.remove();
                            _dialogOpenGlobal = false;
                            document.removeEventListener('mousedown', close, true);
                        }
                    };
                    document.addEventListener('mousedown', close, true);
                });
                grid.appendChild(cell);
            });

            body.appendChild(grid);
        }

        function _renderEmpty() {
            const em = document.createElement('div');
            em.className = 'tm-hist-empty';
            em.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
            const msg = document.createElement('div');
            msg.textContent = query ? 'No results matching search.' : 'No download history yet.\nRight-click 🎞️ to download & record.';
            msg.style.whiteSpace = 'pre-line';
            em.appendChild(msg);
            body.appendChild(em);
        }

        function _handleCheckbox(id, idx, shiftKey) {
            const allRecords = getFiltered(getRecords());
            const target = allRecords.find(r => r.id === id);
            if (target && target.favorited) return;
            if (shiftKey && anchorIdx >= 0) {
                const lo = Math.min(anchorIdx, idx);
                const hi = Math.max(anchorIdx, idx);
                for (let i = lo; i <= hi; i++) {
                    if (allRecords[i] && !allRecords[i].favorited) selectedIds.add(allRecords[i].id);
                }
            } else {
                if (selectedIds.has(id)) selectedIds.delete(id);
                else { selectedIds.add(id); anchorIdx = idx; }
            }
            render();
        }

        function _deleteOne(id, idx) {
            let records = getRecords();
            const record = records.find(r => r.id === id);
            if (!record) return;
            if (record.favorited) return;
            records = records.filter(r => r.id !== id);
            GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));
            _downloadedIds.delete(record.tweetId);

            if (_historyUndoTimer) clearTimeout(_historyUndoTimer);
            _historyUndoBuffer = { record, index: idx };
            render();

            const ut = document.createElement('div');
            ut.style.cssText = `
                position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
                background:rgba(15,20,25,0.92); color:#fff; padding:8px 16px;
                border-radius:99px; font-size:12px; font-family:system-ui;
                display:flex; align-items:center; gap:10px;
                z-index:9999999; box-shadow:0 4px 16px rgba(0,0,0,0.3);
                animation:tm-toast-rise 5s forwards;
            `;
            ut.id = 'tm-hist-undo-toast';
            const msg = document.createElement('span');
            msg.textContent = 'Record deleted';
            const undoBtn = document.createElement('button');
            undoBtn.textContent = 'Undo';
            undoBtn.style.cssText = `background:none;border:none;color:#1d9bf0;cursor:pointer;font-weight:700;font-size:12px;padding:0;`;
            undoBtn.addEventListener('click', () => {
                if (_historyUndoBuffer) {
                    let recs = getRecords();
                    recs.splice(_historyUndoBuffer.index, 0, _historyUndoBuffer.record);
                    GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(recs));
                    _downloadedIds.add(_historyUndoBuffer.record.tweetId);
                    _historyUndoBuffer = null;
                    ut.remove();
                    clearTimeout(_historyUndoTimer);
                    render();
                }
            });
            ut.appendChild(msg);
            ut.appendChild(undoBtn);
            document.getElementById('tm-hist-undo-toast')?.remove();
            document.body.appendChild(ut);
            _historyUndoTimer = setTimeout(() => { ut.remove(); _historyUndoBuffer = null; }, 5000);
        }

        function _thumbUrl(url) {
            try {
                if (url.includes('pbs.twimg.com') && url.includes('/media/')) {
                    const u = new URL(url);
                    u.searchParams.set('name', 'small');
                    return u.toString();
                }
            } catch (_) {}
            return url;
        }

        function _showZoom(url, e) {
            let z = document.getElementById('tm-hist-zoom');
            if (!z) { z = document.createElement('div'); z.id = 'tm-hist-zoom'; document.body.appendChild(z); }
            z.innerHTML = '';
            const img = document.createElement('img');
            img.src = _thumbUrl(url).replace('name=small', 'name=medium');
            img.alt = '';
            z.appendChild(img);
            _moveZoom(e);
        }
        function _moveZoom(e) {
            const z = document.getElementById('tm-hist-zoom');
            if (!z) return;
            const w = 200, h = 200, margin = 14;
            let left = e.clientX - w - margin;
            let top  = e.clientY - h / 2;
            if (left < 4) left = e.clientX + margin;
            if (top < 4)  top  = 4;
            if (top + h > window.innerHeight - 4) top = window.innerHeight - h - 4;
            z.style.cssText = `position:fixed;z-index:9999999;width:${w}px;height:${h}px;left:${left}px;top:${top}px;border-radius:8px;overflow:hidden;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,0.4);border:2px solid rgba(255,255,255,0.2);`;
        }
        function _hideZoom() { document.getElementById('tm-hist-zoom')?.remove(); }

        function _openHistMediaLightbox(rec, startIdx, originEl) {
            const media = rec.mediaUrls && rec.mediaUrls.length > 0 ? rec.mediaUrls : null;
            _dialogOpenGlobal = true;
            if (media) {
                const imgUrls = media.filter(u => !u.includes('.mp4'));
                const vidUrls = media.filter(u =>  u.includes('.mp4'));
                if (imgUrls.length > 0) {
                    showImageLightbox(imgUrls, vidUrls.length > 0 ? vidUrls : null, false);
                    requestAnimationFrame(() => {
                        const gb = document.getElementById('tm-lb-gallery-btn');
                        if (gb) gb.style.display = 'none';
                    });
                } else if (vidUrls.length > 0) {
                    showFloatingVideoPlayer(vidUrls, 0);
                    const _vpObs = new MutationObserver(() => {
                        if (!document.getElementById('tm-floating-video-modal')) {
                            _dialogOpenGlobal = false;
                            _vpObs.disconnect();
                        }
                    });
                    _vpObs.observe(document.body, { childList: true });
                } else {
                    _openThumbLightbox(rec.thumbUrls || [], startIdx, originEl);
                }
            } else {
                _openThumbLightbox(rec.thumbUrls || [], startIdx, originEl);
            }
        }

        function _openThumbLightbox(urls, startIdx, originEl) {
            document.getElementById('tm-thumb-lb-backdrop')?.remove();

            _dialogOpenGlobal = true;

            const allUrls = (urls || []).map(u => {
                try {
                    if (u.includes('pbs.twimg.com') && u.includes('/media/')) {
                        const obj = new URL(u);
                        obj.searchParams.set('name', 'large');
                        return obj.toString();
                    }
                } catch (_) {}
                return u;
            });
            if (!allUrls.length) return;

            let idx = Math.max(0, Math.min(startIdx, allUrls.length - 1));

            const originRect = originEl ? originEl.getBoundingClientRect() : null;
            const vpW = window.innerWidth, vpH = window.innerHeight;

            function _calcOrigin(rect) {
                if (!rect) return { ox: '50%', oy: '50%', tx: '0px', ty: '0px', scale: 0.18 };
                const cx = rect.left + rect.width  / 2;
                const cy = rect.top  + rect.height / 2;
                const finalW = Math.min(vpW * 0.92, vpH * 0.88 * 1.5);
                const finalH = finalW / 1.5;
                const imgCx = vpW / 2, imgCy = vpH / 2;
                const scaleFrom = Math.max(rect.width / finalW, 0.06);
                const ox = ((cx - imgCx) / finalW * 100 + 50).toFixed(2) + '%';
                const oy = ((cy - imgCy) / finalH * 100 + 50).toFixed(2) + '%';
                return { ox, oy, tx: '0px', ty: '0px', scale: scaleFrom };
            }

            const backdrop = document.createElement('div');
            backdrop.id = 'tm-thumb-lb-backdrop';

            const imgEl = document.createElement('img');
            imgEl.id = 'tm-thumb-lb-img';
            imgEl.alt = '';

            const closeBtn = document.createElement('button');
            closeBtn.id = 'tm-thumb-lb-close';
            closeBtn.innerHTML = `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;
            closeBtn.title = 'Close';

            const nav = document.createElement('div');
            nav.id = 'tm-thumb-lb-nav';

            const prevBtn = document.createElement('button');
            prevBtn.className = 'tm-lb-nav-btn';
            prevBtn.innerHTML = `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="10,3 5,8 10,13"/></svg>`;
            prevBtn.title = 'Previous';

            const counter = document.createElement('span');
            counter.id = 'tm-lb-counter';

            const nextBtn = document.createElement('button');
            nextBtn.className = 'tm-lb-nav-btn';
            nextBtn.innerHTML = `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="6,3 11,8 6,13"/></svg>`;
            nextBtn.title = 'Next';

            nav.appendChild(prevBtn);
            nav.appendChild(counter);
            nav.appendChild(nextBtn);
            backdrop.appendChild(imgEl);
            document.body.appendChild(backdrop);
            document.body.appendChild(closeBtn);
            document.body.appendChild(nav);

            function _showIdx(newIdx, fromEl) {
                idx = Math.max(0, Math.min(newIdx, allUrls.length - 1));
                counter.textContent = allUrls.length > 1 ? `${idx + 1} / ${allUrls.length}` : '';
                prevBtn.disabled = (idx === 0);
                nextBtn.disabled = (idx === allUrls.length - 1);
                nav.style.display = allUrls.length > 1 ? '' : 'none';

                const o = _calcOrigin(fromEl ? fromEl.getBoundingClientRect() : null);
                imgEl.style.setProperty('--lb-ox', o.ox);
                imgEl.style.setProperty('--lb-oy', o.oy);
                imgEl.style.setProperty('--lb-scale-from', o.scale);
                imgEl.classList.remove('tm-lb-visible');

                imgEl.src = allUrls[idx];
                imgEl.onload = () => {
                    requestAnimationFrame(() => {
                        imgEl.classList.add('tm-lb-visible');
                    });
                };
                if (imgEl.complete && imgEl.naturalWidth) {
                    requestAnimationFrame(() => imgEl.classList.add('tm-lb-visible'));
                }
            }

            function _close() {
                backdrop.classList.remove('tm-lb-visible');
                closeBtn.classList.remove('tm-lb-visible');
                nav.classList.remove('tm-lb-visible');
                imgEl.classList.remove('tm-lb-visible');
                setTimeout(() => {
                    backdrop.remove();
                    closeBtn.remove();
                    nav.remove();
                    _dialogOpenGlobal = false;
                }, 320);
                document.removeEventListener('keydown', _onKey);
            }

            function _onKey(e) {
                if (e.key === 'Escape') _close();
                if (e.key === 'ArrowLeft'  && idx > 0)                  _showIdx(idx - 1, null);
                if (e.key === 'ArrowRight' && idx < allUrls.length - 1) _showIdx(idx + 1, null);
            }

            backdrop.addEventListener('click', (e) => { if (e.target === backdrop) _close(); });
            closeBtn.addEventListener('click', _close);
            prevBtn.addEventListener('click', (e) => { e.stopPropagation(); _showIdx(idx - 1, null); });
            nextBtn.addEventListener('click', (e) => { e.stopPropagation(); _showIdx(idx + 1, null); });
            imgEl.addEventListener('click', (e) => e.stopPropagation());
            document.addEventListener('keydown', _onKey);

            _showIdx(startIdx, originEl);
            requestAnimationFrame(() => {
                backdrop.classList.add('tm-lb-visible');
                closeBtn.classList.add('tm-lb-visible');
                if (allUrls.length > 1) nav.classList.add('tm-lb-visible');
            });
        }

        function _exportCSV() {
            const records = getRecords();
            const header  = 'tweetId,tweetUrl,date,screenName,displayName\n';
            const rows    = records.map(r =>
                [r.tweetId, r.tweetUrl, r.tweetDate, r.screenName, `"${(r.displayName||'').replace(/"/g,'""')}"`].join(',')
            ).join('\n');
            _download('history.csv', header + rows, 'text/csv');
        }
        function _exportJSON() {
            const records = getRecords();
            _download('history.json', JSON.stringify(records, null, 2), 'application/json');
        }
        function _download(filename, content, type) {
            const blob = new Blob([content], { type });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
        }

        function _mkIconBtn(svg, title) {
            const b = document.createElement('button');
            b.className = 'tm-hist-icon-btn';
            b.innerHTML = svg;
            b.title = title;
            return b;
        }

        btnViewToggle.addEventListener('click', () => {
            viewMode = viewMode === 'list' ? 'thumb' : 'list';
            GM_setValue(KEY_HISTORY_VIEW_MODE, viewMode);
            render();
        });
        btnClose.addEventListener('click', () => {
            if (_dockSideGlobal) {
                _retract();
                return;
            }

            if (typeof panel._tmCleanup === 'function') panel._tmCleanup();
            if (_historyUndoTimer) { clearTimeout(_historyUndoTimer); _historyUndoTimer = null; _historyUndoBuffer = null; }
            panel.remove();
            _cleanZoom();
        });

        btnEdit.addEventListener('click', () => {
            editMode = !editMode;
            selectedIds.clear(); anchorIdx = -1;
            footer.classList.toggle('hidden', !editMode);
            btnEdit.classList.toggle('active', editMode);
            render();
        });

        selAllBtn.addEventListener('click', () => {
            const filtered = getFiltered(getRecords());
            const visibleIds = filtered
                .filter(r => !collapsedGroups.has(r.yyyymm) && !r.favorited)
                .map(r => r.id);
            const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.has(id));
            if (allSelected) {
                visibleIds.forEach(id => selectedIds.delete(id));
            } else {
                visibleIds.forEach(id => selectedIds.add(id));
                const firstVisible = filtered.find(r => !collapsedGroups.has(r.yyyymm) && !r.favorited);
                if (firstVisible) {
                    anchorIdx = filtered.indexOf(firstVisible);
                }
            }
            render();
        });

        delSelBtn.addEventListener('click', () => {
            if (!selectedIds.size) return;
            let records = getRecords();
            records.filter(r => selectedIds.has(r.id) && !r.favorited).forEach(r => _downloadedIds.delete(r.tweetId));
            records = records.filter(r => !selectedIds.has(r.id) || r.favorited);
            GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));
            selectedIds.clear(); anchorIdx = -1;
            render();
        });

        cancelEditBtn.addEventListener('click', () => {
            editMode = false; selectedIds.clear(); anchorIdx = -1;
            footer.classList.add('hidden'); btnEdit.classList.remove('active');
            render();
        });

        function _importJSON() {
            const input = document.createElement('input');
            input.type   = 'file';
            input.accept = '.json,application/json';
            input.style.display = 'none';
            document.body.appendChild(input);

            input.addEventListener('change', () => {
                const file = input.files?.[0];
                if (!file) { input.remove(); return; }
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const imported = JSON.parse(e.target.result);
                        if (!Array.isArray(imported)) throw new Error('Not an array');

                        const existing  = getRecords();
                        const existMap  = new Map(existing.map(r => [r.tweetId, r]));
                        let addCount    = 0;
                        imported.forEach(r => {
                            if (r.tweetId) {
                                if (!existMap.has(r.tweetId)) addCount++;
                                existMap.set(r.tweetId, r);
                            }
                        });
                        const merged = [...existMap.values()].sort((a, b) => (b.id || 0) - (a.id || 0));
                        GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(merged));
                        merged.forEach(r => _downloadedIds.add(r.tweetId));
                        showToast(`✅ Imported ${addCount} new record(s)`);
                        render();
                    } catch (err) {
                        showToast(`❌ Import failed: ${err.message}`);
                    } finally {
                        input.remove();
                    }
                };
                reader.readAsText(file);
            });

            input.click();
        }

        let _expMenu = null;

        function _showExpMenu() {
            const existing = document.getElementById('tm-exp-menu');
            if (existing) { existing.remove(); _expMenu = null; return; }

            const menu = document.createElement('div');
            menu.id = 'tm-exp-menu';
            _expMenu = menu;

            const btnRect = btnExp.getBoundingClientRect();
            const menuWidth = 152;
            const menuLeft  = Math.max(4, btnRect.right - menuWidth);
            menu.style.cssText = `
                position:fixed;
                left:${menuLeft}px;
                top:${btnRect.bottom + 6}px;
                background:rgba(22,32,43,.97);
                border:1px solid rgba(255,255,255,.12);
                border-radius:10px;
                padding:4px;
                z-index:999999;
                min-width:${menuWidth}px;
                box-shadow:0 6px 20px rgba(0,0,0,.5);
                animation:tm-exp-menu-in .15s cubic-bezier(.34,1.56,.64,1);
            `;

            if (!document.getElementById('tm-exp-menu-style')) {
                const s = document.createElement('style');
                s.id = 'tm-exp-menu-style';
                s.textContent = `@keyframes tm-exp-menu-in{from{opacity:0;transform:scale(.88) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}`;
                document.head.appendChild(s);
            }

            const mkItem = (icon, label, onClick) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.style.cssText = `
                    display:flex;align-items:center;gap:8px;
                    width:100%;padding:7px 10px;border:none;
                    background:transparent;border-radius:7px;
                    color:rgba(255,255,255,.8);font-size:12px;
                    cursor:pointer;font-family:inherit;text-align:left;
                    transition:background .1s;white-space:nowrap;
                `;
                item.innerHTML = `<span style="opacity:.65;display:flex;align-items:center">${icon}</span><span>${label}</span>`;
                item.addEventListener('mouseover', () => item.style.background = 'rgba(255,255,255,.09)');
                item.addEventListener('mouseout',  () => item.style.background = 'transparent');
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.remove(); _expMenu = null;
                    document.removeEventListener('click', closeMenu, true);
                    onClick();
                });
                return item;
            };

            const SVG_CSV  = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="1" width="12" height="14" rx="1.5"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="8" y2="11"/></svg>`;
            const SVG_JSON = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 2C3.5 2 3 3 3 4v2c0 1-.5 1.5-1 2 .5.5 1 1 1 2v2c0 1 .5 2 2 2"/><path d="M11 2c1.5 0 2 1 2 2v2c0 1 .5 1.5 1 2-.5.5-1 1-1 2v2c0 1-.5 2-2 2"/></svg>`;
            const SVG_IMP  = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 10V2M5 7l3 3 3-3"/><path d="M2 12h12"/></svg>`;

            const divider = document.createElement('div');
            divider.style.cssText = 'height:1px;background:rgba(255,255,255,.08);margin:3px 4px';

            menu.appendChild(mkItem(SVG_CSV,  'Export CSV',  _exportCSV));
            menu.appendChild(mkItem(SVG_JSON, 'Export JSON', _exportJSON));
            menu.appendChild(divider);
            menu.appendChild(mkItem(SVG_IMP,  'Import JSON', _importJSON));

            document.body.appendChild(menu);

            const closeMenu = (e) => {
                if (menu.contains(e.target) || e.target === btnExp) return;
                menu.remove(); _expMenu = null;
                document.removeEventListener('click', closeMenu, true);
            };
            setTimeout(() => document.addEventListener('click', closeMenu, true), 80);
        }

        btnExp.addEventListener('click', (e) => {
            e.stopPropagation();
            _showExpMenu();
        });
        btnExp.title = 'Export / Import';

        searchInput.addEventListener('input', () => { query = searchInput.value.trim(); render(); });

        panel.addEventListener('tm-hist-refresh', render);

        panel.addEventListener('tm-hist-toggle-peek', () => {
            if (_dockPeekedGlobal) _retract();
            else _peekOut();
        });

        const _panelAC = new AbortController();
        const _acSignal = { signal: _panelAC.signal };
        panel._tmCleanup = () => { _panelAC.abort(); };

        let _dragging = false, _dx = 0, _dy = 0;
        titlebar.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.classList.contains('tm-hist-icon-btn')) return;
            _dragging = true;
            _dx = e.clientX - panel.getBoundingClientRect().left;
            _dy = e.clientY - panel.getBoundingClientRect().top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!_dragging) return;
            let nx = e.clientX - _dx;
            let ny = e.clientY - _dy;
            nx = Math.max(0, Math.min(nx, window.innerWidth  - panel.offsetWidth));
            ny = Math.max(0, Math.min(ny, window.innerHeight - 60));
            panel.style.left = nx + 'px';
            panel.style.top  = ny + 'px';
        }, _acSignal);
        document.addEventListener('mouseup', () => {
            if (!_dragging) return;
            _dragging = false;
            _savePos();
        }, _acSignal);

        let _resizing = false, _rsx = 0, _rsy = 0, _rsw = 0, _rsh = 0;
        resizeHandle.addEventListener('mousedown', (e) => {
            _resizing = true;
            _rsx = e.clientX; _rsy = e.clientY;
            _rsw = panel.offsetWidth; _rsh = panel.offsetHeight;
            e.preventDefault(); e.stopPropagation();
        });
        document.addEventListener('mousemove', (e) => {
            if (!_resizing) return;
            const nw = Math.max(300, Math.min(_rsw + (e.clientX - _rsx), 680));
            const nh = Math.max(280, Math.min(_rsh + (e.clientY - _rsy), window.innerHeight - 20));
            panel.style.width  = nw + 'px';
            panel.style.height = nh + 'px';
        }, _acSignal);
        document.addEventListener('mouseup', () => {
            if (!_resizing) return;
            _resizing = false;
            _savePos();
        }, _acSignal);

        function _savePos() {
            const r = panel.getBoundingClientRect();
            GM_setValue(KEY_HISTORY_PANEL_POS, JSON.stringify({ x: r.left, y: r.top, w: r.width, h: r.height }));
        }

        panel.addEventListener('click', e => e.stopPropagation());

        function _dockTabGeometry() {
            const snap = _dockSnapshotGlobal;
            if (!snap) {
                const r = panel.getBoundingClientRect();
                const h   = Math.min(r.height * 0.55, 200);
                const top = r.top + (r.height - h) / 2;
                return { h, top };
            }
            const h   = Math.min(snap.height * 0.55, 200);
            const top = snap.top + (snap.height - h) / 2;
            return { h, top };
        }

        function _buildDockTab(side) {
            const style = GM_getValue(KEY_DOCK_STYLE, 'ruler');
            const { h, top } = _dockTabGeometry();

            const triggerKey  = side === 'left' ? KEY_DOCK_TRIGGER_L : KEY_DOCK_TRIGGER_R;
            const triggerDist = Math.max(6, parseInt(GM_getValue(triggerKey, '80'), 10) || 80);

            const tab = document.createElement('div');
            tab.id = 'tm-hist-dock-tab';
            tab.className = 'style-' + style + ' side-' + side;
            tab.style.cssText = [
                'top:'    + top + 'px',
                'height:' + h   + 'px',
                side === 'left' ? 'left:0' : 'right:0',
            ].join(';');
            if (style === 'dots') {
                for (let i = 0; i < 3; i++) {
                    const d = document.createElement('span');
                    d.className = 'tm-dock-dot';
                    tab.appendChild(d);
                }
            }

            const hotzone = document.createElement('div');
            hotzone.className = 'tm-dock-hotzone';
            hotzone.style.cssText = [
                'position:absolute',
                'top:0',
                'height:100%',
                'width:' + triggerDist + 'px',
                side === 'left' ? 'left:0' : 'right:0',
                'cursor:pointer',
                'z-index:1',
            ].join(';');

            const _onHotEnter = () => {
                clearTimeout(_dockHoverTimerGlobal);
                const delay = parseInt(GM_getValue(KEY_DOCK_HOVER_DELAY, '500'), 10) || 500;
                _dockHoverTimerGlobal = setTimeout(() => _peekOut(), delay);
            };
            const _onHotLeave = () => {
                clearTimeout(_dockHoverTimerGlobal);
                _dockHoverTimerGlobal = null;
            };

            hotzone.addEventListener('mouseenter', _onHotEnter);
            hotzone.addEventListener('mouseleave', _onHotLeave);
            tab.addEventListener('mouseenter', _onHotEnter);
            tab.addEventListener('mouseleave', _onHotLeave);

            let _tabHoldTimer   = null;
            let _tabHoldRAF     = null;
            let _tabHoldElapsed = 0;
            const TAB_HOLD_MS   = 2000;

            const _tabTick = () => {
                _tabHoldElapsed += 16;
                const pct = Math.min(_tabHoldElapsed / TAB_HOLD_MS, 1);
                tab.style.opacity = (0.4 + pct * 0.6).toFixed(2);
                if (pct < 1) _tabHoldRAF = requestAnimationFrame(_tabTick);
            };

            const _cancelTabHold = () => {
                if (_tabHoldTimer) { clearTimeout(_tabHoldTimer); _tabHoldTimer = null; }
                if (_tabHoldRAF)   { cancelAnimationFrame(_tabHoldRAF); _tabHoldRAF = null; }
                _tabHoldElapsed = 0;
                tab.style.opacity = '';
            };

            tab.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                e.stopPropagation();
                _tabHoldElapsed = 0;
                _tabHoldTimer = setTimeout(() => {
                    cancelAnimationFrame(_tabHoldRAF);
                    _tabHoldRAF  = null;
                    _tabHoldTimer = null;
                    tab.style.opacity = '';
                    _forceResetDock();
                }, TAB_HOLD_MS);
                _tabHoldRAF = requestAnimationFrame(_tabTick);
            });
            tab.addEventListener('mouseup',    _cancelTabHold);
            tab.addEventListener('mouseleave',  _cancelTabHold);

            tab.appendChild(hotzone);
            return tab;
        }

        function _dock(side) {
            if (_dockSideGlobal) return;
            _dockPeekedGlobal = false;

            const r   = panel.getBoundingClientRect();
            const vpW = window.innerWidth;

            _dockSnapshotGlobal = { left: r.left, top: r.top, width: r.width, height: r.height };
            _dockSideGlobal = side;

            GM_setValue(KEY_DOCK_PERSISTED, side);

            const PEEK = 6;
            panel.style.left = side === 'left'
                ? (-r.width + PEEK) + 'px'
                : (vpW - PEEK) + 'px';
            panel.classList.add('tm-docked');

            if (_dockTabElGlobal) _dockTabElGlobal.remove();
            _dockTabElGlobal = _buildDockTab(side);
            document.body.appendChild(_dockTabElGlobal);
        }

        function _peekOut() {
            if (!_dockSideGlobal || _dockPeekedGlobal) return;
            _dockPeekedGlobal = true;

            clearTimeout(_dockRetractTimerGlobal);
            _dockRetractTimerGlobal = null;

            const snap = _dockSnapshotGlobal;
            const vpW  = window.innerWidth;
            const vpH  = window.innerHeight;

            if (snap) {
                const safeTop = Math.max(0, Math.min(snap.top, vpH - snap.height - 10));

                const OFFSET_LEFT = 15;
                const OFFSET_RIGHT = -15;

                if (_dockSideGlobal === 'left') {
                    panel.style.left = OFFSET_LEFT + 'px';
                } else {
                    panel.style.left = (vpW - snap.width + OFFSET_RIGHT) + 'px';
                }
                panel.style.top = safeTop + 'px';
            }
            panel.classList.remove('tm-docked');

            panel.classList.remove('tm-docked');

            if (_dockTabElGlobal) _dockTabElGlobal.style.pointerEvents = 'none';

            let bridge = document.getElementById('tm-hover-bridge');
            if (!bridge) {
                bridge = document.createElement('div');
                bridge.id = 'tm-hover-bridge';
                bridge.style.cssText = 'position:absolute; top:0; bottom:0; width:15px; background:transparent; z-index:-1;';
                panel.appendChild(bridge);
            }

            if (_dockSideGlobal === 'left') {
                bridge.style.left = '-10px';
                bridge.style.right = '';
            } else {
                bridge.style.right = '-10px';
                bridge.style.left = '';
            }

            const body = document.getElementById('tm-hist-body');
            if (body && !body.hasChildNodes()) render();
        }

        function _retract() {
            if (!_dockSideGlobal || !_dockPeekedGlobal) return;
            if (_pinned) return;
            _dockPeekedGlobal = false;

            const r   = panel.getBoundingClientRect();
            const vpW = window.innerWidth;
            const PEEK = 6;
            panel.style.left = _dockSideGlobal === 'left'
                ? (-r.width + PEEK) + 'px'
                : (vpW - PEEK) + 'px';
            panel.classList.add('tm-docked');

            if (_dockTabElGlobal) _dockTabElGlobal.style.pointerEvents = '';
        }

        function _exitDockMode() {
            clearTimeout(_dockHoverTimerGlobal);
            clearTimeout(_dockRetractTimerGlobal);
            _dockHoverTimerGlobal   = null;
            _dockRetractTimerGlobal = null;

            const snap = _dockSnapshotGlobal;
            if (snap) {
                const safeLeft = Math.max(0, Math.min(snap.left, window.innerWidth  - snap.width));
                const safeTop  = Math.max(0, Math.min(snap.top,  window.innerHeight - 60));
                panel.style.left = safeLeft + 'px';
                panel.style.top  = safeTop  + 'px';
            }
            panel.classList.remove('tm-docked');
            _dockSideGlobal     = null;
            _dockPeekedGlobal   = false;
            _dockSnapshotGlobal = null;

            GM_setValue(KEY_DOCK_PERSISTED, '');

            if (_dockTabElGlobal) {
                _dockTabElGlobal.remove();
                _dockTabElGlobal = null;
            }
        }

        function _forceResetDock() {
            clearTimeout(_dockHoverTimerGlobal);
            clearTimeout(_dockRetractTimerGlobal);
            _dockHoverTimerGlobal   = null;
            _dockRetractTimerGlobal = null;
            _dockSideGlobal         = null;
            _dockPeekedGlobal       = false;
            _dockSnapshotGlobal     = null;
            if (_dockTabElGlobal) { _dockTabElGlobal.remove(); _dockTabElGlobal = null; }
            GM_setValue(KEY_DOCK_PERSISTED, '');

            panel.classList.remove('tm-docked');
            const pw = panel.offsetWidth  || 390;
            const ph = panel.offsetHeight || 540;
            panel.style.left = Math.round((window.innerWidth  - pw) / 2) + 'px';
            panel.style.top  = Math.round((window.innerHeight - ph) / 4) + 'px';
            render();
            showToast('🔓 Dock reset — panel restored');
        }

        dockTriggerL.addEventListener('click', (e) => {
            e.stopPropagation();
            if (_dockSideGlobal === 'left') {
                _exitDockMode();
            } else if (_dockSideGlobal === 'right') {
                showToast('⚠️ Undock right side first before docking left');
            } else {
                _dock('left');
            }
        });
        dockTriggerR.addEventListener('click', (e) => {
            e.stopPropagation();
            if (_dockSideGlobal === 'right') {
                _exitDockMode();
            } else if (_dockSideGlobal === 'left') {
                showToast('⚠️ Undock left side first before docking right');
            } else {
                _dock('right');
            }
        });

        panel.addEventListener('mouseleave', () => {
            if (!_dockSideGlobal || !_dockPeekedGlobal) return;
            if (_dialogOpenGlobal) return;
            if (_pinned) return;
            clearTimeout(_dockRetractTimerGlobal);
            _dockRetractTimerGlobal = setTimeout(() => _retract(), 800);
        });
        panel.addEventListener('mouseenter', () => {
            if (!_dockSideGlobal) return;
            clearTimeout(_dockRetractTimerGlobal);
            _dockRetractTimerGlobal = null;
        });

        const _origCleanup = panel._tmCleanup;
        panel._tmCleanup = () => {
            _origCleanup();
            clearTimeout(_dockHoverTimerGlobal);
            clearTimeout(_dockRetractTimerGlobal);
            _dockHoverTimerGlobal   = null;
            _dockRetractTimerGlobal = null;
            if (_dockTabElGlobal) { _dockTabElGlobal.remove(); _dockTabElGlobal = null; }
        };

        if (_dockSideGlobal && !_pinned) {
            requestAnimationFrame(() => {
                const side = _dockSideGlobal;
                _dockSideGlobal = null;
                _dock(side);
                requestAnimationFrame(() => {
                    panel.style.transition = '';
                    panel.style.opacity = '';
                });
            });
        } else if (_dockSideGlobal && _pinned) {
            requestAnimationFrame(() => {
                const side = _dockSideGlobal;
                _dockSideGlobal = null;
                _dock(side);
                requestAnimationFrame(() => {
                    panel.style.transition = '';
                    panel.style.opacity = '';
                    _peek();
                });
            });
        }

        render();
    }

    function _cleanZoom() { document.getElementById('tm-hist-zoom')?.remove(); }

    function fireMeteor(fromEl) {
        const histBtn = document.getElementById('tm-history-btn');
        if (!histBtn || !fromEl) return;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect   = histBtn.getBoundingClientRect();

        const fromX = fromRect.left + fromRect.width  / 2;
        const fromY = fromRect.top  + fromRect.height / 2;
        const toX   = toRect.left   + toRect.width    / 2;
        const toY   = toRect.top    + toRect.height   / 2;

        const dx    = toX - fromX;
        const dy    = toY - fromY;
        const dist  = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const tailLen = Math.min(Math.max(dist * 0.24, 16), 40);

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            left: ${fromX}px; top: ${fromY}px;
            width: 0; height: 0;
            pointer-events: none;
            z-index: 99999999;
        `;

        const tail = document.createElement('div');
        tail.style.cssText = `
            position: absolute;
            width: ${tailLen * 1.2}px; height: 6px;
            border-radius: 9999px;
            background: linear-gradient(90deg,
                rgba(255,255,255,0)     0%,
                rgba(255,220,100,0.15) 30%,
                rgba(255,200,80,0.3)   70%,
                rgba(255,240,150,0.25)100%);
            box-shadow: 0 0 4px 1px rgba(255,200,100,0.3);
            filter: drop-shadow(0 0 3px rgba(255,200,100,0.2));
            transform: translateX(-100%) translateY(-50%) rotate(${angle}deg);
            transform-origin: 100% 50%;
        `;

        const tailGlow = document.createElement('div');
        tailGlow.style.cssText = `
            position: absolute;
            width: ${tailLen}px; height: 10px;
            border-radius: 9999px;
            background: linear-gradient(90deg,
                rgba(255,240,200,0)    0%,
                rgba(255,220,150,0.15) 50%,
                rgba(255,240,200,0)  100%);
            filter: blur(1.5px);
            transform: translateX(-100%) translateY(-50%) rotate(${angle}deg);
            transform-origin: 100% 50%;
            opacity: 0.4;
        `;

        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            width: 9px; height: 9px; border-radius: 50%;
            background: radial-gradient(circle at 40% 40%, #ffffdd, #ffeed4);
            box-shadow: 0 0 5px 2px rgba(255,220,150,0.4),
                        0 0 10px 4px rgba(255,200,100,0.15);
            transform: translate(-50%, -50%);
        `;

        const particles = [];
        for (let i = 0; i < 4; i++) {
            const particle = document.createElement('div');
            const offsetX = (Math.random() - 0.5) * tailLen * 0.4;
            const offsetY = (Math.random() - 0.5) * 8;
            const size = 1.5 + Math.random() * 2;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px; height: ${size}px; border-radius: 50%;
                background: rgba(255, 240, 180, ${0.3 + Math.random() * 0.3});
                left: ${offsetX}px; top: ${offsetY}px;
                filter: blur(0.5px);
                box-shadow: 0 0 ${size + 1}px rgba(255,220,150,0.3);
            `;
            particles.push(particle);
        }

        container.appendChild(tailGlow);
        container.appendChild(tail);
        particles.forEach(p => container.appendChild(p));
        container.appendChild(dot);
        document.body.appendChild(container);

        const DURATION = 680;

        const anim = container.animate([
            { transform: 'translate(0px, 0px)',           opacity: 0,   offset: 0    },
            { transform: 'translate(0px, 0px)',           opacity: 1,   offset: 0.04 },
            { transform: `translate(${dx}px, ${dy}px)`,  opacity: 1,   offset: 0.88 },
            { transform: `translate(${dx}px, ${dy}px)`,  opacity: 0,   offset: 1    },
        ], {
            duration: DURATION,
            easing:   'cubic-bezier(0.28, 0.0, 0.72, 1.0)',
            fill:     'forwards',
        });

        anim.onfinish = () => {
            container.remove();
            _triggerHistAbsorb();
        };
    }

    let _absorbTimer = null;
    function _triggerHistAbsorb() {
        const wrapper = document.getElementById('tm-settings-wrapper');
        const histBtn = document.getElementById('tm-history-btn');
        if (!wrapper || !histBtn) return;

        if (_absorbTimer) clearTimeout(_absorbTimer);

        wrapper.setAttribute('data-focus', 'hist');
        wrapper.setAttribute('data-absorb', 'true');

        histBtn.classList.remove('tm-absorbing');
        void histBtn.offsetWidth;
        histBtn.classList.add('tm-absorbing');

        _absorbTimer = setTimeout(() => {
            wrapper.removeAttribute('data-absorb');
            histBtn.classList.remove('tm-absorbing');
            _absorbTimer = null;
        }, 2500);
    }

    const BUTTON_CLASS = 'force-media-copy-btn';

    const style = document.createElement('style');
    style.textContent = `
        .${BUTTON_CLASS}, .custom-copy-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            font-size: 11px;
            min-width: 36px;
            width: 36px;
            height: 36px;
            padding: 8px;
            box-sizing: border-box;
            opacity: 0.75;
            cursor: pointer;
            margin-left: 4px;
            transition: opacity 0.2s, filter 0.2s;
            color: #536471;
            flex-shrink: 0;
        }
        @media (prefers-color-scheme: dark) {
            .${BUTTON_CLASS}, .custom-copy-icon { color: #71767b; }
        }
        .${BUTTON_CLASS} svg, .custom-copy-icon svg {
            width: 20px;
            height: 20px;
            display: block;
            overflow: visible;
            flex-shrink: 0;
        }
        .${BUTTON_CLASS}:hover { opacity: 1.0; }
        .custom-copy-icon:hover {
            opacity: 1.0;
            filter: drop-shadow(0 0 4px currentColor);
        }
    `;
    document.head.appendChild(style);

    const _toastStyle = document.createElement('style');
    _toastStyle.textContent = `
        @keyframes tm-toast-rise {
            0%   { opacity: 0; transform: translate(-50%, -100%) scale(0.85); }
            15%  { opacity: 1; transform: translate(-50%, -118%) scale(1);    }
            70%  { opacity: 1; transform: translate(-50%, -135%) scale(1);    }
            100% { opacity: 0; transform: translate(-50%, -152%) scale(0.95); }
        }
        .tm-action-toast {
            position: fixed; white-space: nowrap; pointer-events: none;
            transform: translate(-50%, -100%);
            background: rgba(29,155,240,0.92); color: #fff;
            font: 600 11px/1 system-ui,-apple-system,sans-serif;
            padding: 4px 9px; border-radius: 9999px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25); z-index: 9999999;
            animation: tm-toast-rise 1.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .tm-action-toast.warn  { background: rgba(255,140,0,0.92); }
        .tm-action-toast.error { background: rgba(224,36,94,0.92); }
        @keyframes tm-spin { to { transform: rotate(360deg); } }
        .tm-dl-ring { display:inline-flex; align-items:center; justify-content:center;
            width:20px; height:20px; flex-shrink:0; }
        .tm-dl-ring svg { overflow:visible; }
        .tm-dl-ring .tm-bg { stroke: rgba(128,128,128,0.28); }
        .tm-dl-ring .tm-fg { stroke: currentColor;
            transition: stroke-dashoffset 0.15s linear;
            transform-origin: 10px 10px; }
        .tm-dl-ring.indeterminate .tm-fg {
            animation: tm-spin 0.85s linear infinite; }
    `;
    document.head.appendChild(_toastStyle);

    function showActionToast(anchorEl, message, type = 'ok') {
        if (GM_getValue(KEY_FEEDBACK_STYLE, 'toast') === 'silent') return;
        const rect = anchorEl.getBoundingClientRect();
        const viewW = window.innerWidth;
        const cx = Math.max(48, Math.min(rect.left + rect.width / 2, viewW - 48));
        const toast = document.createElement('span');
        toast.className = 'tm-action-toast' + (type !== 'ok' ? ` ${type}` : '');
        toast.textContent = message;
        toast.style.left = cx + 'px';
        toast.style.top  = rect.top + 'px';
        document.body.appendChild(toast);
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }

    function createProgressRing() {
        const R = 8, C = +(2 * Math.PI * R).toFixed(4);
        const el = document.createElement('span');
        el.className = 'tm-dl-ring indeterminate';
        el.innerHTML = `<svg viewBox="0 0 20 20" width="20" height="20">
            <circle class="tm-bg" cx="10" cy="10" r="${R}" fill="none" stroke-width="2.5"/>
            <circle class="tm-fg" cx="10" cy="10" r="${R}" fill="none" stroke-width="2.5"
                stroke-dasharray="${C}" stroke-dashoffset="${C}"
                transform="rotate(-90 10 10)"/></svg>`;
        const fg = el.querySelector('.tm-fg');
        const update = (pct) => {
            if (pct === null) {
                el.classList.add('indeterminate');
                fg.style.strokeDashoffset = C;
            } else {
                el.classList.remove('indeterminate');
                fg.style.strokeDashoffset = C * (1 - Math.max(0, Math.min(1, pct / 100)));
            }
        };
        return { el, update, remove: () => el.remove() };
    }

    async function forceDownloadBlob(url, filename, onProgress) {
        try {
            const resp = await unsafeWindow.fetch(url, { credentials: 'omit' });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const contentLength = parseInt(resp.headers.get('content-length') || '0', 10);
            const reader = resp.body.getReader();
            const chunks = [];
            let received = 0;
            if (onProgress) onProgress(contentLength > 0 ? 0 : null);
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                chunks.push(value);
                received += value.length;
                if (onProgress && contentLength > 0) {
                    onProgress(Math.round(received / contentLength * 100));
                }
            }
            if (onProgress) onProgress(100);
            const blob = new Blob(chunks, { type: resp.headers.get('content-type') || 'application/octet-stream' });
            const blobUrl = (window.URL || window.webkitURL).createObjectURL(blob);
            try {
                const tag = document.createElement('a');
                tag.href = blobUrl; tag.download = filename;
                document.body.appendChild(tag); tag.click(); document.body.removeChild(tag);
            } finally {
                setTimeout(() => (window.URL || window.webkitURL).revokeObjectURL(blobUrl), 8000);
            }
            return;
        } catch (fetchErr) {
            console.warn('[MediaDL] fetch stream failed, falling back to GM_xmlhttpRequest:', fetchErr);
        }

        await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, responseType: "blob",
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const urlCreator = window.URL || window.webkitURL;
                        const blobUrl = urlCreator.createObjectURL(blob);
                        try {
                            const tag = document.createElement('a');
                            tag.href = blobUrl;
                            tag.download = filename;
                            document.body.appendChild(tag);
                            tag.click();
                            document.body.removeChild(tag);
                        } finally {
                            setTimeout(() => urlCreator.revokeObjectURL(blobUrl), 8000);
                        }
                        resolve();
                    } else {
                        reject(new Error(`GM fallback HTTP ${response.status}`));
                    }
                },
                onerror: function(err) {
                    console.error('[MediaDL] GM fallback also failed:', err);
                    const tag = document.createElement('a');
                    tag.href = url; tag.download = filename; tag.target = '_blank';
                    document.body.appendChild(tag); tag.click(); document.body.removeChild(tag);
                    resolve();
                }
            });
        });
    }

    function showFloatingVideoPlayer(videoUrls, startIndex = 0, imageUrls = null, openGallery = false) {
        document.querySelectorAll('video, audio').forEach(media => {
            if (!media.paused) media.pause();
        });

        const oldModal = document.getElementById('tm-floating-video-modal');
        if (oldModal) oldModal.remove();

        const total = videoUrls.length;
        let currentIndex = Math.max(0, Math.min(startIndex, total - 1));

        if (!document.getElementById('tm-vp-style')) {
            const s = document.createElement('style');
            s.id = 'tm-vp-style';
            s.textContent = `
                #tm-floating-video-modal {
                    opacity: 0;
                    transition: opacity 0.22s ease;
                }
                #tm-floating-video-modal.tm-vp-visible {
                    opacity: 1;
                }
                #tm-floating-video-modal video {
                    opacity: 0;
                    transform: scale(0.88) translateZ(0);
                    transition: opacity 0.30s ease 0.10s,
                                transform 0.38s cubic-bezier(0.22,1,0.36,1) 0.08s;
                    will-change: transform, opacity;
                }
                #tm-floating-video-modal.tm-vp-visible video {
                    opacity: 1;
                    transform: scale(1) translateZ(0);
                }
            `;
            document.head.appendChild(s);
        }

        const modal = document.createElement('div');
        modal.id = 'tm-floating-video-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 9999999;
            display: flex; align-items: center; justify-content: center;
            overscroll-behavior: contain;
        `;
        modal.addEventListener('wheel', e => e.preventDefault(), { passive: false });
        modal.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.volume = Math.max(0, Math.min(1, parseFloat(GM_getValue(KEY_VIDEO_VOLUME, '1')) || 1));
        video.addEventListener('volumechange', () => {
            GM_setValue(KEY_VIDEO_VOLUME, String(video.volume));
        });
        video.style.cssText = `
            max-width: 88%; max-height: 88%;
            border-radius: 8px; box-shadow: 0 10px 50px rgba(0,0,0,0.8);
            background: #000; outline: none;
        `;

        const counter = document.createElement('div');
        counter.style.cssText = `
            position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.72);
            color: rgba(255,255,255,0.85); padding: 4px 14px;
            border-radius: 9999px; font: 13px/1.5 system-ui, sans-serif;
            z-index: 3; pointer-events: none; white-space: nowrap;
            display: ${total > 1 ? 'block' : 'none'};
        `;

        const NAV_BASE = `
            position: absolute; top: 50%; transform: translateY(-50%);
            background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
            color: white; border: none;
            width: 46px; height: 46px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s, opacity 0.2s; z-index: 3;
        `;
        const SVG_PREV = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>`;
        const SVG_NEXT = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg>`;

        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = SVG_PREV;
        prevBtn.style.cssText = NAV_BASE + 'left: 20px;';
        prevBtn.onmouseenter = () => prevBtn.style.background = 'rgba(255,255,255,0.25)';
        prevBtn.onmouseleave = () => prevBtn.style.background = 'rgba(0,0,0,0.55)';

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = SVG_NEXT;
        nextBtn.style.cssText = NAV_BASE + 'right: 20px;';
        nextBtn.onmouseenter = () => nextBtn.style.background = 'rgba(255,255,255,0.25)';
        nextBtn.onmouseleave = () => nextBtn.style.background = 'rgba(0,0,0,0.55)';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;
        closeBtn.style.cssText = `
            position: absolute; top: 20px; right: 25px;
            background: rgba(0,0,0,0.6); color: white; border: none;
            width: 40px; height: 40px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s; z-index: 4;
        `;
        closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(255,255,255,0.3)';
        closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(0,0,0,0.6)';

        const viewImgBtn = imageUrls && imageUrls.length ? document.createElement('button') : null;
        if (viewImgBtn) {
            viewImgBtn.title = T.btn_switch_to_image || 'Switch to Image';
            viewImgBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/><polyline points="21,15 16,10 5,21"/></svg>`;
            viewImgBtn.style.cssText = `
                position: absolute; top: 20px; right: 75px;
                background: rgba(29,155,240,0.85); color: white; border: none;
                width: 40px; height: 40px; border-radius: 50%;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s; z-index: 4;
            `;
            viewImgBtn.onmouseenter = () => viewImgBtn.style.background = 'rgba(29,155,240,1)';
            viewImgBtn.onmouseleave = () => viewImgBtn.style.background = 'rgba(29,155,240,0.85)';
            viewImgBtn.onclick = (e) => {
                e.stopPropagation();
                closeModal();
                showImageLightbox(imageUrls, videoUrls);
            };
        }

        function updatePlayer() {
            video.src = videoUrls[currentIndex];
            video.play().catch(() => {});
            if (total > 1) {
                counter.textContent = `${currentIndex + 1} / ${total}`;
                prevBtn.style.opacity      = '1';
                nextBtn.style.opacity      = '1';
                prevBtn.style.pointerEvents = 'auto';
                nextBtn.style.pointerEvents = 'auto';
            }
        }

        prevBtn.onclick = e => {
            e.stopPropagation();
            currentIndex = currentIndex > 0 ? currentIndex - 1 : total - 1;
            updatePlayer();
        };
        nextBtn.onclick = e => {
            e.stopPropagation();
            currentIndex = currentIndex < total - 1 ? currentIndex + 1 : 0;
            updatePlayer();
        };

        let _vpGalleryOpen  = false;
        let _vpGalleryItems = null;
        let vpGalleryBtn   = null;
        let vpGalleryPanel = null;

        video.onclick = e => {
            e.stopPropagation();
            if (_vpGalleryItems !== null && vpGalleryBtn && vpGalleryPanel) {
                _vpGalleryOpen = !_vpGalleryOpen;
                vpGalleryBtn.style.background = _vpGalleryOpen ? 'rgba(29,155,240,0.75)' : 'rgba(0,0,0,0.6)';
                vpGalleryPanel.classList.toggle('tm-gp-open', _vpGalleryOpen);
            } else {
                video.paused ? video.play().catch(() => {}) : video.pause();
            }
        };

        const closeModal = () => {
            modal.classList.remove('tm-vp-visible');
            video.pause();
            setTimeout(() => {
                modal.remove();
            }, 220);
            document.removeEventListener('keydown', keyHandler);
        };

        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (_vpGalleryOpen) return;
            const hit = e.composedPath().some(el => el !== modal && el instanceof Element && (
                el.tagName === 'VIDEO' || el.tagName === 'BUTTON' ||
                el.id === 'tm-lb-gallery-panel' || el.id === 'tm-lb-pill' ||
                (el.className && typeof el.className === 'string' && el.className.includes('tm-'))
            ));
            if (!hit) closeModal();
        };

        const keyHandler = (e) => {
            if (e.key === 'Escape') { closeModal(); return; }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                currentIndex = currentIndex < total - 1 ? currentIndex + 1 : 0;
                updatePlayer();
            }
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp') {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : total - 1;
                updatePlayer();
            }
        };
        document.addEventListener('keydown', keyHandler);

        const _vpGalleryRightBase = viewImgBtn ? 130 : 75;
        const SVG_GRID_VP = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1.5" y="1.5" width="5" height="5" rx="1"/>
            <rect x="9.5" y="1.5" width="5" height="5" rx="1"/>
            <rect x="1.5" y="9.5" width="5" height="5" rx="1"/>
            <rect x="9.5" y="9.5" width="5" height="5" rx="1"/>
        </svg>`;
        vpGalleryBtn = document.createElement('button');
        vpGalleryBtn.innerHTML = SVG_GRID_VP;
        vpGalleryBtn.title = 'Browse page media';
        vpGalleryBtn.style.cssText = `
            position: absolute; top: 20px; right: ${_vpGalleryRightBase}px;
            background: rgba(0,0,0,0.6); color: rgba(255,255,255,0.85); border: none;
            width: 40px; height: 40px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s; z-index: 4;
        `;
        vpGalleryBtn.onmouseenter = () => vpGalleryBtn.style.background = _vpGalleryOpen ? 'rgba(29,155,240,1)' : 'rgba(255,255,255,0.25)';
        vpGalleryBtn.onmouseleave = () => vpGalleryBtn.style.background = _vpGalleryOpen ? 'rgba(29,155,240,0.75)' : 'rgba(0,0,0,0.6)';

        if (!document.getElementById('tm-lb-style-gallery')) {
            const s = document.createElement('style');
            s.id = 'tm-lb-style-gallery';
            s.textContent = `
                #tm-lb-gallery-btn { position:absolute; top:20px; right:75px; background:rgba(0,0,0,0.6); color:rgba(255,255,255,0.85); border:none; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; z-index:31; }
                #tm-lb-gallery-btn.tm-gb-active { background:rgba(29,155,240,0.75); }
                #tm-lb-gallery-panel {
                    position:absolute; top:0; right:0; bottom:0; width:212px;
                    background:rgba(8,8,12,0.82);
                    
                    border-left:1px solid rgba(255,255,255,0.10);
                    overflow-y:auto; overflow-x:hidden;
                    transform:translateX(100%);
                    transition:transform 0.3s cubic-bezier(0.22,1,0.36,1),
                               backdrop-filter 0.3s ease,
                               -webkit-backdrop-filter 0.3s ease;
                    z-index:30; padding:12px 8px 24px; box-sizing:border-box;
                    scrollbar-width:thin; scrollbar-color:rgba(255,255,255,0.15) transparent;
                }
                #tm-lb-gallery-panel.tm-gp-open {
                    transform:translateX(0);
                    backdrop-filter:blur(20px) saturate(1.4);
                    -webkit-backdrop-filter:blur(20px) saturate(1.4);
                }
                #tm-lb-gallery-panel .tm-gp-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px; }
                .tm-gp-item { position:relative; aspect-ratio:1/1; border-radius:6px; overflow:hidden; cursor:pointer; border:2px solid transparent; transition:border-color 0.15s, transform 0.15s; background:rgba(40,40,40,0.9); flex-shrink:0; }
                .tm-gp-item:hover { transform:scale(0.96); }
                .tm-gp-item.tm-gp-selected { border-color:rgba(29,155,240,0.9); }
                .tm-gp-item img { width:100%; height:100%; object-fit:cover; display:block; }
                .tm-gp-item .tm-gp-vid-badge { position:absolute; bottom:4px; right:4px; background:rgba(0,0,0,0.65); border-radius:4px; padding:1px 4px; font-size:10px; color:white; pointer-events:none; line-height:1.4; }
                .tm-gp-tweet-label { font:10px/1.4 system-ui,sans-serif; color:rgba(251,191,36,0.85); padding:8px 4px 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; grid-column:1/-1; }
                #tm-lb-pill { position:fixed; top:68px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.62); color:rgba(255,255,255,0.9); border-radius:9999px; padding:5px 14px 5px 10px; font:12px/1.5 system-ui,sans-serif; display:flex; align-items:center; gap:7px; max-width:min(480px,60vw); white-space:nowrap; overflow:hidden; pointer-events:none; z-index:9999998; opacity:0; transition:opacity 0.22s ease; }
                #tm-lb-pill.tm-pill-show { opacity:1; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); }
                #tm-lb-pill .tm-pill-avatar { width:20px; height:20px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font:700 9px system-ui; color:white; }
                #tm-lb-pill .tm-pill-author { font-weight:600; flex-shrink:0; }
                #tm-lb-pill .tm-pill-text { color:rgba(255,255,255,0.6); overflow:hidden; text-overflow:ellipsis; }
            `;
            document.head.appendChild(s);
        }

        vpGalleryPanel = document.createElement('div');
        vpGalleryPanel.id = 'tm-lb-gallery-panel';
        let vpPill = document.getElementById('tm-lb-pill');
        if (!vpPill) {
            vpPill = document.createElement('div');
            vpPill.id = 'tm-lb-pill';
            document.body.appendChild(vpPill);
        }

        vpGalleryBtn.onclick = e => {
            e.stopPropagation();
            _vpGalleryOpen = !_vpGalleryOpen;
            vpGalleryBtn.style.background = _vpGalleryOpen ? 'rgba(29,155,240,0.75)' : 'rgba(0,0,0,0.6)';
            vpGalleryPanel.classList.toggle('tm-gp-open', _vpGalleryOpen);

            if (_vpGalleryOpen && !_vpGalleryItems) {
                _vpGalleryItems = _scanPageMedia();
                if (!_vpGalleryItems.length) {
                    const emptyDiv = document.createElement('div');
                    emptyDiv.style.cssText = 'color:rgba(255,255,255,0.4);font:12px system-ui;padding:20px 8px;text-align:center';
                    emptyDiv.textContent = 'No media found on this page';
                    vpGalleryPanel.appendChild(emptyDiv);
                    return;
                }
                const grid = document.createElement('div');
                grid.className = 'tm-gp-grid';
                _vpGalleryItems.forEach(group => {
                    const label = document.createElement('div');
                    label.className = 'tm-gp-tweet-label';
                    label.title = `@${group.handle} · ${group.text}`;
                    label.textContent = `@${group.handle}${group.text ? ' · ' + group.text : ''}`;
                    grid.appendChild(label);
                    group.items.forEach(item => {
                        const el = document.createElement('div');
                        el.className = 'tm-gp-item';
                        el.dataset.url = item.url ?? item.thumb ?? '';
                        const img = document.createElement('img');
                        img.src = item.thumb; img.alt = ''; img.loading = 'lazy';
                        el.appendChild(img);
                        if (item.type === 'video') {
                            const badge = document.createElement('span');
                            badge.className = 'tm-gp-vid-badge'; badge.textContent = '▶';
                            el.appendChild(badge);
                        }
                        el.onclick = async ev => {
                            ev.stopPropagation();
                            await new Promise(r => setTimeout(r, 0));
                            vpPill.innerHTML = `<span class="tm-pill-avatar" style="background:${group.avatarColor}">${_escHtml(group.avatarLetter)}</span><span class="tm-pill-author">@${_escHtml(group.handle)}</span>${group.text ? `<span class="tm-pill-text">${_escHtml(group.text)}</span>` : ''}`;
                            vpPill.classList.add('tm-pill-show');
                            clearTimeout(vpPill._autoTimer);
                            vpPill._autoTimer = setTimeout(() => { vpPill.classList.remove('tm-pill-show'); }, 1500);

                            const isValidUrl = u => typeof u === 'string' && u.startsWith('http');
                            if (item.type === 'video') {
                                let mp4Url = isValidUrl(item.url) ? item.url : null;
                                if (!mp4Url && group.tweetId) {
                                    try {
                                        const d = await fetchTweetMediaFromAPI(group.tweetId);
                                        const c = d?.videos?.[0];
                                        if (isValidUrl(c)) mp4Url = c;
                                    } catch(_) {}
                                }
                                if (mp4Url) {
                                    closeModal();
                                    showFloatingVideoPlayer([mp4Url], 0, null, true);
                                } else {
                                    showToast(T.msg_no_video || '❌ No Video');
                                }
                            } else if (isValidUrl(item.url)) {
                                closeModal();
                                showImageLightbox([item.url], null, true);
                            } else {
                                showToast(T.msg_no_media || '❌ No Media');
                            }
                        };
                        grid.appendChild(el);
                    });
                });
                vpGalleryPanel.appendChild(grid);
            }
        };

        modal.appendChild(video);
        modal.appendChild(closeBtn);
        if (viewImgBtn) modal.appendChild(viewImgBtn);
        modal.appendChild(vpGalleryBtn);
        modal.appendChild(vpGalleryPanel);
        modal.appendChild(counter);
        if (total > 1) { modal.appendChild(prevBtn); modal.appendChild(nextBtn); }
        document.body.appendChild(modal);

        updatePlayer();
        requestAnimationFrame(() => requestAnimationFrame(() => {
            modal.classList.add('tm-vp-visible');
            if (openGallery && vpGalleryBtn) vpGalleryBtn.onclick({ stopPropagation: () => {} });
        }));
    }

    function _scanPageMedia() {
        const AVATAR_COLORS = ['#1d9bf0','#7856ff','#ff7a00','#00ba7c','#f91880'];
        const results = [];

        document.querySelectorAll('article[data-testid="tweet"]').forEach(article => {
            let author = '', handle = '';
            try {
                const userBlock = article.querySelector('[data-testid="User-Name"]');
                if (userBlock) {
                    const lines = userBlock.innerText.split('\n').map(s => s.trim()).filter(Boolean);
                    author = lines[0] || '';
                    const at = lines.find(l => l.startsWith('@'));
                    handle = at ? at.slice(1) : '';
                }
            } catch(_) {}

            const textRaw = article.querySelector('[data-testid="tweetText"]')?.innerText?.trim() || '';
            const text = textRaw.length > 40 ? textRaw.slice(0, 40) + '…' : textRaw;

            let tweetId = '';
            for (const a of article.querySelectorAll('a[href*="/status/"]')) {
                const m = a.href.match(/\/status\/(\d+)/);
                if (m) { tweetId = m[1]; break; }
            }

            const items = [];
            const seenUrls = new Set();

            article.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(img => {
                if (img.src.includes('profile_images')) return;
                let thumb = img.src;
                let full  = img.src;
                try {
                    const u = new URL(img.src);
                    u.searchParams.set('name', 'large');
                    full  = u.toString();
                    u.searchParams.set('name', '360x360');
                    thumb = u.toString();
                } catch(_) {}
                if (seenUrls.has(full)) return;
                seenUrls.add(full);
                items.push({ type: 'image', thumb, url: full });
            });

            article.querySelectorAll('video[poster]').forEach(vid => {
                const poster = vid.getAttribute('poster');
                if (!poster || seenUrls.has(poster)) return;
                seenUrls.add(poster);

                let mp4 = _fiberVideoCache.get(article)?.urls?.[0] || null;

                if (!mp4 && tweetId) {
                    const entry = _apiVideoCache.get(tweetId);
                    if (entry && (Date.now() - entry.ts < _API_CACHE_TTL)) {
                        mp4 = entry.urls?.[0] || null;
                    }
                }

                if (!mp4) {
                    const m = poster.match(/(?:amplify_video_thumb|ext_tw_video_thumb|tweet_video_thumb)\/(\d+)/);
                    if (m) {
                        const entry = _apiVideoCache.get(m[1]);
                        if (entry && (Date.now() - entry.ts < _API_CACHE_TTL)) {
                            mp4 = entry.urls?.[0] || null;
                        }
                    }
                }

                items.push({ type: 'video', thumb: poster, url: mp4 });
            });

            if (!items.length) return;

            let colorIdx = 0;
            for (let i = 0; i < handle.length; i++) colorIdx += handle.charCodeAt(i);
            const avatarColor = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
            const avatarLetter = (author[0] || handle[0] || '?').toUpperCase();

            results.push({ tweetId, author, handle, text, items, avatarColor, avatarLetter });
        });

        return results;
    }

    function showImageLightbox(urls, videoUrls = null, openGallery = false) {
        if (!urls.length) return;

        const old = document.getElementById('tm-image-lightbox');
        if (old) old.remove();

        if (!document.getElementById('tm-lb-style')) {
            const s = document.createElement('style');
            s.id = 'tm-lb-style';
            s.textContent = `
                
                #tm-image-lightbox {
                    opacity: 0;
                    transition: opacity 0.22s ease;
                }
                #tm-image-lightbox.tm-lb-in { opacity: 1; }

                #tm-image-lightbox .tm-lb-single-img {
                    opacity: 0;
                    transform: scale(0.88) translateZ(0);
                    transition: opacity 0.32s ease 0.08s,
                                transform 0.40s cubic-bezier(0.22,1,0.36,1) 0.06s;
                    will-change: transform, opacity;
                }
                #tm-image-lightbox.tm-lb-in .tm-lb-single-img {
                    opacity: 1;
                    transform: scale(1) translateZ(0);
                }

                #tm-image-lightbox .tm-lb-card.tm-lb-animated {
                    transition:
                        transform  0.38s cubic-bezier(0.34,1.18,0.64,1),
                        opacity    0.26s ease;
                    will-change: transform, opacity;
                }

                #tm-image-lightbox .tm-lb-card          { cursor: pointer; z-index: var(--lb-z, 1); }
                
                #tm-image-lightbox .tm-lb-card.tm-lb-focused { cursor: default; }
                
                #tm-image-lightbox .tm-lb-card { box-shadow: 0 12px 36px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07); }
                #tm-image-lightbox .tm-lb-card.tm-lb-focused { box-shadow: 0 28px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.18); }

                #tm-lb-gallery-btn {
                    position: absolute; top: 20px; right: 75px;
                    background: rgba(0,0,0,0.6); color: rgba(255,255,255,0.85); border: none;
                    width: 40px; height: 40px; border-radius: 50%;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s; z-index: 31;
                }
                #tm-lb-gallery-btn:hover        { background: rgba(255,255,255,0.25); }
                #tm-lb-gallery-btn.tm-gb-active { background: rgba(29,155,240,0.75); }
                #tm-lb-gallery-btn.tm-gb-active:hover { background: rgba(29,155,240,1); }

                #tm-lb-gallery-panel {
                    position: absolute; top: 0; right: 0; bottom: 0;
                    width: 212px;
                    background: rgba(8,8,12,0.82);
                    
                    border-left: 1px solid rgba(255,255,255,0.10);
                    overflow-y: auto; overflow-x: hidden;
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                                backdrop-filter 0.3s ease,
                                -webkit-backdrop-filter 0.3s ease;
                    z-index: 30; padding: 12px 8px 24px;
                    box-sizing: border-box;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.15) transparent;
                }
                #tm-lb-gallery-panel.tm-gp-open {
                    transform: translateX(0);
                    backdrop-filter: blur(20px) saturate(1.4);
                    -webkit-backdrop-filter: blur(20px) saturate(1.4);
                }
                #tm-lb-gallery-panel::-webkit-scrollbar { width: 4px; }
                #tm-lb-gallery-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

                #tm-lb-gallery-panel .tm-gp-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
                }

                .tm-gp-item {
                    position: relative; aspect-ratio: 1/1; border-radius: 6px; overflow: hidden;
                    cursor: pointer; border: 2px solid transparent;
                    transition: border-color 0.15s, transform 0.15s;
                    background: rgba(40,40,40,0.9);
                    flex-shrink: 0;
                }
                .tm-gp-item:hover  { transform: scale(0.96); }
                .tm-gp-item.tm-gp-selected { border-color: rgba(29,155,240,0.9); }
                .tm-gp-item img    { width: 100%; height: 100%; object-fit: cover; display: block; }

                .tm-gp-item .tm-gp-vid-badge {
                    position: absolute; bottom: 4px; right: 4px;
                    background: rgba(0,0,0,0.65); border-radius: 4px;
                    padding: 1px 4px; font-size: 10px; color: white;
                    pointer-events: none; line-height: 1.4;
                }

                .tm-gp-tweet-label {
                    font: 10px/1.4 system-ui, sans-serif;
                    color: rgba(251, 191, 36, 0.85); 
                    padding: 8px 4px 3px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                    grid-column: 1 / -1;
                }

                #tm-lb-pill {
                    position: fixed; top: 68px; left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.62);
                    color: rgba(255,255,255,0.9); border-radius: 9999px;
                    padding: 5px 14px 5px 10px;
                    font: 12px/1.5 system-ui, sans-serif;
                    display: flex; align-items: center; gap: 7px;
                    max-width: min(480px, 60vw);
                    white-space: nowrap; overflow: hidden;
                    pointer-events: none; z-index: 9999998;
                    opacity: 0; transition: opacity 0.22s ease;
                }
                #tm-lb-pill.tm-pill-show { opacity: 1; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
                #tm-lb-pill .tm-pill-avatar {
                    width: 20px; height: 20px; border-radius: 50%;
                    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
                    font: 700 9px system-ui; color: white;
                }
                #tm-lb-pill .tm-pill-author { font-weight: 600; flex-shrink: 0; }
                #tm-lb-pill .tm-pill-text   {
                    color: rgba(255,255,255,0.6);
                    overflow: hidden; text-overflow: ellipsis;
                }
            `;
            document.head.appendChild(s);
        }

        const total = urls.length;
        const isSingleImage = total === 1;
        let focused = 0;
        let _rafId = null;

        const VW = window.innerWidth;
        const VH = window.innerHeight;
        const CARD_W = Math.min(VW * 0.50, 580);
        const CARD_H = Math.min(VH * 0.88, 1000);
        const SPREAD = Math.min(CARD_W * 0.40, 200);

        function calcTransform(pos) {
            const abs = Math.abs(pos);
            return {
                dx:      pos * SPREAD,
                rot:     pos * 9,
                scale:   Math.max(0.68, 1 - abs * 0.12),
                zIndex:  20 - abs * 2,
                opacity: abs >= 3 ? 0.5 : 1,
                focused: pos === 0,
            };
        }

        const modal = document.createElement('div');
        modal.id = 'tm-image-lightbox';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 9999999;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden; overscroll-behavior: contain;
        `;
        modal.addEventListener('wheel',     e => e.preventDefault(), { passive: false });
        modal.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

        let keyHandler = () => {};

        function closeLightbox() {
            modal.classList.remove('tm-lb-in');
            setTimeout(() => { modal.remove(); }, 220);
            document.removeEventListener('keydown', keyHandler);
            _dialogOpenGlobal = false;
        }

        let _galleryOpen   = false;
        let _galleryItems  = null;

        function _buildGalleryUI(onSelect) {
            const SVG_GRID_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1.5" y="1.5" width="5" height="5" rx="1"/>
                <rect x="9.5" y="1.5" width="5" height="5" rx="1"/>
                <rect x="1.5" y="9.5" width="5" height="5" rx="1"/>
                <rect x="9.5" y="9.5" width="5" height="5" rx="1"/>
            </svg>`;
            const galleryBtn = document.createElement('button');
            galleryBtn.id = 'tm-lb-gallery-btn';
            galleryBtn.innerHTML = SVG_GRID_ICON;
            galleryBtn.title = 'Browse page media';

            const panel = document.createElement('div');
            panel.id = 'tm-lb-gallery-panel';

            let pill = document.getElementById('tm-lb-pill');
            if (!pill) {
                pill = document.createElement('div');
                pill.id = 'tm-lb-pill';
            }

            let _allThumbEls = [];
            function updateSelected(url) {
                _allThumbEls.forEach(el => {
                    el.classList.toggle('tm-gp-selected', el.dataset.url === url);
                });
            }

            function _toggleGallery(forceOpen) {
                _galleryOpen = (forceOpen !== undefined) ? forceOpen : !_galleryOpen;
                galleryBtn.classList.toggle('tm-gb-active', _galleryOpen);
                panel.classList.toggle('tm-gp-open', _galleryOpen);

                if (_galleryOpen && !_galleryItems) {
                    _galleryItems = _scanPageMedia();
                    _allThumbEls = [];

                    if (!_galleryItems.length) {
                        const emptyDiv = document.createElement('div');
                        emptyDiv.style.cssText = 'color:rgba(255,255,255,0.4);font:12px system-ui;padding:20px 8px;text-align:center';
                        emptyDiv.textContent = 'No media found on this page';
                        panel.appendChild(emptyDiv);
                        return;
                    }

                    const grid = document.createElement('div');
                    grid.className = 'tm-gp-grid';

                    _galleryItems.forEach(group => {
                        const label = document.createElement('div');
                        label.className = 'tm-gp-tweet-label';
                        label.title = `@${group.handle} · ${group.text}`;
                        label.textContent = `@${group.handle}${group.text ? ' · ' + group.text : ''}`;
                        grid.appendChild(label);

                        group.items.forEach(item => {
                            const el = document.createElement('div');
                            el.className = 'tm-gp-item';
                            el.dataset.url = item.url ?? item.thumb ?? '';

                            const img = document.createElement('img');
                            img.src = item.thumb;
                            img.alt = '';
                            img.loading = 'lazy';
                            el.appendChild(img);

                            if (item.type === 'video') {
                                const badge = document.createElement('span');
                                badge.className = 'tm-gp-vid-badge';
                                badge.textContent = '▶';
                                el.appendChild(badge);
                            }

                            el.onclick = ev => {
                                ev.stopPropagation();
                                updateSelected(el.dataset.url);
                                onSelect(item, group).catch?.(() => {});
                            };

                            _allThumbEls.push(el);
                            grid.appendChild(el);
                        });
                    });

                    panel.appendChild(grid);
                }
            }

            galleryBtn.onclick = e => { e.stopPropagation(); _toggleGallery(); };

            return { galleryBtn, panel, pill, updateSelected, toggleGallery: _toggleGallery };
        }

        if (isSingleImage) {
            const container = document.createElement('div');
            container.style.cssText = `
                position: relative; width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
            `;

            const img = document.createElement('img');
            img.src = urls[0];
            img.draggable = false;
            img.className = 'tm-lb-single-img';
            img.style.cssText = `
                max-width: 95vw; max-height: 95vh;
                object-fit: contain; display: block;
                background: transparent; pointer-events: none;
                user-select: none; -webkit-user-drag: none;
            `;

            container.appendChild(img);
            modal.appendChild(container);

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = `<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;
            closeBtn.style.cssText = `
                position: absolute; top: 20px; right: 25px;
                background: rgba(0,0,0,0.6); color: white; border: none;
                width: 40px; height: 40px; border-radius: 50%;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s; z-index: 30;
            `;
            closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(255,255,255,0.25)';
            closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(0,0,0,0.6)';
            closeBtn.onclick = closeLightbox;
            modal.onclick = e => {
                const path = e.composedPath();
                if (path.some(el => el !== modal && el instanceof Element && (
                    el.tagName === 'BUTTON' ||
                    el.id === 'tm-lb-gallery-panel' || el.id === 'tm-lb-pill'
                ))) return;

                const imgEl = container.querySelector('.tm-lb-single-img');
                const r = imgEl?.getBoundingClientRect();
                const overImg = r && e.clientX >= r.left && e.clientX <= r.right
                                   && e.clientY >= r.top  && e.clientY <= r.bottom;

                if (overImg && _galleryOpen) {
                    container._toggleGalleryRef?.();
                } else if (!overImg) {
                    closeLightbox();
                }
            };
            modal.appendChild(closeBtn);

            if (videoUrls && videoUrls.length) {
                const viewVidBtn = document.createElement('button');
                viewVidBtn.title = T.btn_switch_to_video || 'Switch to Video';
                viewVidBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21" fill="currentColor" stroke="none"/></svg>`;
                viewVidBtn.style.cssText = `
                    position: absolute; top: 20px; right: 130px;
                    background: rgba(29,155,240,0.85); color: white; border: none;
                    width: 40px; height: 40px; border-radius: 50%;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s; z-index: 31;
                `;
                viewVidBtn.onmouseenter = () => viewVidBtn.style.background = 'rgba(29,155,240,1)';
                viewVidBtn.onmouseleave = () => viewVidBtn.style.background = 'rgba(29,155,240,0.85)';
                viewVidBtn.onclick = e => { e.stopPropagation(); closeLightbox(); showFloatingVideoPlayer(videoUrls, 0, urls); };
                modal.appendChild(viewVidBtn);
            }

            keyHandler = e => { if (e.key === 'Escape') closeLightbox(); };
            document.addEventListener('keydown', keyHandler);
            const { galleryBtn: gbA, panel: gpA, pill: pillA, updateSelected: updA, toggleGallery: tgA } = _buildGalleryUI(async (item, group) => {
                await new Promise(r => setTimeout(r, 0));
                if (item.type === 'video') {
                    const isValidUrl = u => typeof u === 'string' && u.startsWith('http');
                    let mp4Url = isValidUrl(item.url) ? item.url : null;
                    if (!mp4Url && group.tweetId) {
                        try {
                            const apiData = await fetchTweetMediaFromAPI(group.tweetId);
                            const candidate = apiData?.videos?.[0];
                            if (isValidUrl(candidate)) mp4Url = candidate;
                        } catch(_) {}
                    }
                    if (mp4Url) {
                        closeLightbox();
                        showFloatingVideoPlayer([mp4Url], 0, null, true);
                    } else {
                        showToast(T.msg_no_video || '❌ No Video');
                    }
                    return;
                }
                const targetUrl = item.url || item.thumb;
                if (!targetUrl) return;
                img.src = targetUrl;
                updA(targetUrl);
                _showPill(pillA, group);
            });
            container._toggleGalleryRef = tgA;
            modal.appendChild(gbA);
            modal.appendChild(gpA);
            document.body.appendChild(pillA);

            document.body.appendChild(modal);

            requestAnimationFrame(() => requestAnimationFrame(() => {
                modal.classList.add('tm-lb-in');
                if (openGallery) tgA(true);
            }));
            return;
        }

        const stage = document.createElement('div');
        stage.style.cssText = `
            position: relative;
            width: ${CARD_W}px; height: ${CARD_H}px;
            flex-shrink: 0; overflow: visible;
        `;

        const cards = urls.map((url, i) => {
            const card = document.createElement('div');
            card.className = 'tm-lb-card';
            card.style.cssText = `
                position: absolute; left: 0; top: 0;
                width: ${CARD_W}px; height: ${CARD_H}px;
                border-radius: 14px; overflow: hidden;
                background: radial-gradient(ellipse at 50% 38%, #1e1e1e 0%, #0a0a0a 100%);
                transform: translateY(${VH * 0.6}px) scale(0.72) translateZ(0);
                opacity: 0;
            `;
            const img = document.createElement('img');
            img.src = url;
            img.decoding = 'async';
            img.loading = i === 0 ? 'eager' : 'lazy';
            img.draggable = false;
            img.style.cssText = `
                width: 100%; height: 100%;
                object-fit: contain; display: block;
                background: transparent; pointer-events: none;
                user-select: none; -webkit-user-drag: none;
            `;
            card.appendChild(img);
            card.addEventListener('click', e => {
                e.stopPropagation();
                if (i !== focused) {
                    focused = i;
                    scheduleUpdate();
                } else if (_toggleGalleryRef) {
                    _toggleGalleryRef();
                }
            });
            stage.appendChild(card);
            return card;
        });

        const dotsWrap = document.createElement('div');
        dotsWrap.style.cssText = `
            position: absolute; bottom: 22px; left: 50%;
            transform: translateX(-50%);
            display: flex; gap: 8px; z-index: 30;
        `;
        const dots = urls.map((_, i) => {
            const dot = document.createElement('div');
            dot.style.cssText = `
                width: 7px; height: 7px; border-radius: 50%;
                background: rgba(255,255,255,0.95); cursor: pointer;
                opacity: 0.35;
                transition: opacity 0.22s, transform 0.22s;
            `;
            dot.addEventListener('click', e => { e.stopPropagation(); focused = i; scheduleUpdate(); });
            dotsWrap.appendChild(dot);
            return dot;
        });

        const counter = document.createElement('div');
        counter.style.cssText = `
            position: absolute; top: 20px; left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.72);
            color: rgba(255,255,255,0.85);
            padding: 4px 14px; border-radius: 9999px;
            font: 13px/1.5 system-ui, sans-serif; z-index: 30;
            pointer-events: none; white-space: nowrap;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = `<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>`;
        closeBtn.style.cssText = `
            position: absolute; top: 20px; right: 25px;
            background: rgba(0,0,0,0.6); color: white; border: none;
            width: 40px; height: 40px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s; z-index: 30;
        `;
        closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(255,255,255,0.25)';
        closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(0,0,0,0.6)';
        closeBtn.onclick = closeLightbox;
        modal.onclick = e => {
            const hit = e.composedPath().some(el => el !== modal && el instanceof Element && (
                el.tagName === 'IMG' || el.tagName === 'BUTTON' ||
                el.id === 'tm-lb-gallery-panel' || el.id === 'tm-lb-pill' ||
                (el.className && typeof el.className === 'string' && el.className.includes('tm-'))
            ));
            if (!hit) closeLightbox();
        };

        const viewVidBtn = videoUrls && videoUrls.length ? document.createElement('button') : null;
        if (viewVidBtn) {
            viewVidBtn.title = T.btn_switch_to_video || 'Switch to Video';
            viewVidBtn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21" fill="currentColor" stroke="none"/></svg>`;
            viewVidBtn.style.cssText = `
                position: absolute; top: 20px; right: 130px;
                background: rgba(29,155,240,0.85); color: white; border: none;
                width: 40px; height: 40px; border-radius: 50%;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s; z-index: 31;
            `;
            viewVidBtn.onmouseenter = () => viewVidBtn.style.background = 'rgba(29,155,240,1)';
            viewVidBtn.onmouseleave = () => viewVidBtn.style.background = 'rgba(29,155,240,0.85)';
            viewVidBtn.onclick = e => { e.stopPropagation(); closeLightbox(); showFloatingVideoPlayer(videoUrls, 0, urls); };
        }

        keyHandler = e => {
            if (e.key === 'Escape') { closeLightbox(); return; }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                focused = focused < total - 1 ? focused + 1 : 0;
                scheduleUpdate();
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                focused = focused > 0 ? focused - 1 : total - 1;
                scheduleUpdate();
            }
        };
        document.addEventListener('keydown', keyHandler);

        const NAV_BTN_BASE = `
            position: absolute; top: 50%; transform: translateY(-50%);
            background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
            color: white; border: none;
            width: 46px; height: 46px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s; z-index: 30;
        `;
        const SVG_PREV = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>`;
        const SVG_NEXT = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg>`;

        const lbPrevBtn = total > 1 ? document.createElement('button') : null;
        const lbNextBtn = total > 1 ? document.createElement('button') : null;
        if (lbPrevBtn && lbNextBtn) {
            lbPrevBtn.innerHTML = SVG_PREV;
            lbPrevBtn.style.cssText = NAV_BTN_BASE + 'left: 20px;';
            lbPrevBtn.onmouseenter = () => lbPrevBtn.style.background = 'rgba(255,255,255,0.25)';
            lbPrevBtn.onmouseleave = () => lbPrevBtn.style.background = 'rgba(0,0,0,0.55)';
            lbPrevBtn.onclick = e => {
                e.stopPropagation();
                focused = focused > 0 ? focused - 1 : total - 1;
                scheduleUpdate();
            };

            lbNextBtn.innerHTML = SVG_NEXT;
            lbNextBtn.style.cssText = NAV_BTN_BASE + 'right: 20px;';
            lbNextBtn.onmouseenter = () => lbNextBtn.style.background = 'rgba(255,255,255,0.25)';
            lbNextBtn.onmouseleave = () => lbNextBtn.style.background = 'rgba(0,0,0,0.55)';
            lbNextBtn.onclick = e => {
                e.stopPropagation();
                focused = focused < total - 1 ? focused + 1 : 0;
                scheduleUpdate();
            };
        }

        function scheduleUpdate() {
            if (_rafId) return;
            _rafId = requestAnimationFrame(() => {
                _rafId = null;
                _flushUpdate();
            });
        }

        function _flushUpdate() {
            cards.forEach((card, i) => {
                const { dx, rot, scale, zIndex, opacity, focused: isFocused } = calcTransform(i - focused);
                card.style.transform = `translateX(${dx}px) rotate(${rot}deg) scale(${scale}) translateZ(0)`;
                card.style.opacity   = opacity;
                card.style.zIndex = String(zIndex);
                card.classList.toggle('tm-lb-focused', isFocused);
            });
            dots.forEach((dot, i) => {
                dot.style.opacity   = i === focused ? '1' : '0.35';
                dot.style.transform = i === focused ? 'scale(1.4)' : 'scale(1)';
            });
            counter.textContent = `${focused + 1} / ${total}`;
        }

        function _showPill(pillEl, group) {
            if (!group) { pillEl.classList.remove('tm-pill-show'); return; }
            pillEl.innerHTML = `
                <span class="tm-pill-avatar" style="background:${group.avatarColor}">${_escHtml(group.avatarLetter)}</span>
                <span class="tm-pill-author">@${_escHtml(group.handle)}</span>
                ${group.text ? `<span class="tm-pill-text">${_escHtml(group.text)}</span>` : ''}
            `;
            pillEl.classList.add('tm-pill-show');
            clearTimeout(pillEl._autoTimer);
            pillEl._autoTimer = setTimeout(() => { pillEl.classList.remove('tm-pill-show'); }, 1500);
        }

        let _toggleGalleryRef = null;
        const { galleryBtn: gbB, panel: gpB, pill: pillB, updateSelected: updB, toggleGallery: tgB } = _buildGalleryUI(async (item, group) => {
            await new Promise(r => setTimeout(r, 0));
            const isValidUrl = u => typeof u === 'string' && u.startsWith('http');
            if (item.type === 'video') {
                let mp4Url = isValidUrl(item.url) ? item.url : null;
                if (!mp4Url && group.tweetId) {
                    try {
                        const apiData = await fetchTweetMediaFromAPI(group.tweetId);
                        const candidate = apiData?.videos?.[0];
                        if (isValidUrl(candidate)) mp4Url = candidate;
                    } catch(_) {}
                }
                if (mp4Url) {
                    closeLightbox();
                    showFloatingVideoPlayer([mp4Url], 0, null, true);
                } else {
                    showToast(T.msg_no_video || '❌ No Video');
                }
                return;
            }
            if (item.type === 'image') {
                const targetUrl = item.url;
                if (!isValidUrl(targetUrl)) return;
                const idx = urls.indexOf(targetUrl);
                if (idx !== -1) {
                    focused = idx;
                    scheduleUpdate();
                } else {
                    closeLightbox();
                    showImageLightbox([targetUrl], null, true);
                }
                updB(targetUrl);
            }
            _showPill(pillB, group);
        });
        _toggleGalleryRef = tgB;

        modal.appendChild(stage);
        modal.appendChild(closeBtn);
        if (viewVidBtn) modal.appendChild(viewVidBtn);
        if (lbPrevBtn)  modal.appendChild(lbPrevBtn);
        if (lbNextBtn)  modal.appendChild(lbNextBtn);
        if (total > 1) { modal.appendChild(dotsWrap); modal.appendChild(counter); }
        modal.appendChild(gbB);
        modal.appendChild(gpB);
        document.body.appendChild(pillB);
        document.body.appendChild(modal);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            modal.classList.add('tm-lb-in');

            cards.forEach((card, i) => {
                const delay = i * 55;
                card.style.zIndex = String(calcTransform(i - focused).zIndex);
                setTimeout(() => {
                    card.style.transition = `
                        transform 0.42s cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                        opacity   0.28s ease ${delay}ms
                    `;
                    card.style.transform = `translateX(0) rotate(0deg) scale(1) translateZ(0)`;
                    card.style.opacity   = '1';
                }, 0);
            });

            const totalStagger = (total - 1) * 55 + 420;
            setTimeout(() => {
                cards.forEach(card => {
                    card.style.transition = '';
                    card.classList.add('tm-lb-animated');
                });
                void cards[0]?.offsetHeight;
                _flushUpdate();
                if (openGallery) tgB(true);
            }, totalStagger);
        }));
    }

    function formatDate(dateInput) {
        try {
            if (!dateInput) return '0000.00.00';
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) return '0000.00.00';
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return _cachedDateFormat === 'western' ? `${d}.${m}.${y}` : `${y}.${m}.${d}`;
        } catch (e) { return '0000.00.00'; }
    }

    function sanitizeForFilename(text, maxLength = 50) {
        if (!text) return "";
        let clean = text.replace(/[\r\n]+/g, ' ');
        clean = clean.replace(/[\\/:*?"<>|#%&]/g, '');
        clean = clean.replace(/[\u0000-\u001f\u007f\uff0f\uff3c\uff1a\uff0a\uff1f\uff02\uff1c\uff1e\uff5c\u200b\u200c\u200d\uFEFF]/g, '');
        clean = clean.replace(/\.+$/, '').replace(/^\.+/, '');
        clean = clean.trim();
        if (clean.length > maxLength) clean = clean.substring(0, maxLength).trimEnd().replace(/\.+$/, '');
        if (!clean) return '_';
        if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(clean)) clean = '_' + clean;
        return clean;
    }

    function getTweetInfo(article) {
        let date = '0000.00.00';
        let id = '0000';
        let screenName = 'unknown';
        let displayName = 'User';
        let tweetText = '';

        const timeEl = article.querySelector('time');
        if (timeEl) date = formatDate(timeEl.getAttribute('datetime'));
        else date = formatDate(new Date());

        const allLinks = article.querySelectorAll('a[href*="/status/"]');
        for (const link of allLinks) {
            const href = link.getAttribute('href');
            const match = href.match(/\/([a-zA-Z0-9_]+)\/status\/(\d+)/);
            if (match) {
                screenName = match[1];
                id = match[2];
                break;
            }
        }

        const textNode = article.querySelector('[data-testid="tweetText"]');
        if (textNode) tweetText = textNode.innerText || "";

        try {
            const userBlock = article.querySelector('[data-testid="User-Name"]');
            if (userBlock) {
                const lines = userBlock.innerText.split('\n');
                if (lines.length >= 1) displayName = lines[0].trim();
                if (screenName === 'unknown' && lines.length >= 2) {
                    const handle = lines.find(l => l.startsWith('@'));
                    if (handle) screenName = handle.replace('@', '');
                }
            }
        } catch(e) { console.warn('[MediaDL] Failed to extract displayName:', e); }

        if (id === '0000' && screenName === 'unknown') {
            id = "Ad_" + Date.now().toString().slice(-6);
            screenName = 'Promoted';
        }

        let videoThumb = null;
        const posterVid = article.querySelector('video[poster]');
        if (posterVid) {
            videoThumb = posterVid.getAttribute('poster');
        } else {
            const thumbImg = article.querySelector('img[src*="video_thumb"], img[src*="ext_tw_video_thumb"], img[src*="amplify_video_thumb"]');
            if (thumbImg) videoThumb = thumbImg.src;
        }

        return {
            screenName: screenName,
            displayName: displayName,
            id: id,
            date: date,
            text: sanitizeForFilename(tweetText),
            videoThumb: videoThumb
        };
    }

    function extractFiberNode(node) {
        const key = Object.keys(node).find(k => k.startsWith("__reactFiber"));
        return key ? node[key] : null;
    }

    const _apiVideoCache = new Map();
    const _API_CACHE_TTL = 300_000;

    const _FALLBACK_BEARER = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
    let _cachedBearerToken = null;
    let _bearerPendingPromise = null;

    async function _resolveBearerToken() {
        if (_cachedBearerToken) return _cachedBearerToken;
        if (_bearerPendingPromise) return _bearerPendingPromise;

        _bearerPendingPromise = (async () => {
            try {
                for (const script of document.querySelectorAll('script[src*="main."]')) {
                    if (!script.src) continue;
                    const resp = await fetch(script.src);
                    if (!resp.ok) continue;
                    const text = await resp.text();
                    const m = text.match(/Bearer (AAAAAAA[A-Za-z0-9%_-]{20,})/);
                    if (m) { _cachedBearerToken = 'Bearer ' + m[1]; break; }
                }
            } catch(_) {}
            _bearerPendingPromise = null;
            if (!_cachedBearerToken) _cachedBearerToken = _FALLBACK_BEARER;
            return _cachedBearerToken;
        })();

        return _bearerPendingPromise;
    }

    function _parseVideosFromTweetResult(tweetResult) {
        try {
            const core = tweetResult?.result ?? tweetResult;
            const tweetId = core?.legacy?.id_str ?? core?.tweet?.legacy?.id_str;
            if (!tweetId) return null;

            let mp4Urls = [];

            const searchVariants = (obj, depth = 0) => {
                if (depth > 12 || !obj || typeof obj !== 'object') return;

                if (Array.isArray(obj.variants)) {
                    const mp4s = obj.variants.filter(v => v.content_type === 'video/mp4');
                    if (mp4s.length > 0) {
                        const best = mp4s.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
                        if (best?.url) mp4Urls.push(best.url.split('?')[0]);
                    }
                }

                if (typeof obj.value === 'string' && obj.value.startsWith('{') && obj.value.includes('"video/mp4"')) {
                    try {
                        const parsedCard = JSON.parse(obj.value);
                        searchVariants(parsedCard, depth + 1);
                    } catch(e) {}
                }

                for (const key in obj) {
                    if (obj[key] && typeof obj[key] === 'object') {
                        searchVariants(obj[key], depth + 1);
                    }
                }
            };

            searchVariants(core);

            if (mp4Urls.length > 0) {
                return { id: tweetId, urls: [...new Set(mp4Urls)] };
            }
        } catch (_) {}
        return null;
    }

    function _processApiPayload(text) {
        try {
            const json = JSON.parse(text);
            const ts = Date.now();
            const walk = (obj, depth) => {
                if (!obj || typeof obj !== 'object' || depth > 40) return;
                if (obj.tweet_results) {
                    const parsed = _parseVideosFromTweetResult(obj.tweet_results);
                    if (parsed) _apiVideoCache.set(parsed.id, { urls: parsed.urls, ts });
                }
                if (obj.tweetResult) {
                    const parsed = _parseVideosFromTweetResult(obj.tweetResult);
                    if (parsed) _apiVideoCache.set(parsed.id, { urls: parsed.urls, ts });
                }
                if (obj.retweeted_status_result) {
                    const parsed = _parseVideosFromTweetResult(obj.retweeted_status_result);
                    if (parsed) _apiVideoCache.set(parsed.id, { urls: parsed.urls, ts });
                }
                if (obj.quoted_status_result) {
                    const parsed = _parseVideosFromTweetResult(obj.quoted_status_result);
                    if (parsed) _apiVideoCache.set(parsed.id, { urls: parsed.urls, ts });
                }
                for (const v of Object.values(obj)) {
                    if (v && typeof v === 'object') walk(v, depth + 1);
                }
            };
            walk(json, 0);
            if (_apiVideoCache.size > 200) {
                const now = Date.now();
                for (const [id, entry] of _apiVideoCache) {
                    if (now - entry.ts >= _API_CACHE_TTL) _apiVideoCache.delete(id);
                }
                if (_apiVideoCache.size > 150) {
                    const overflow = _apiVideoCache.size - 150;
                    let i = 0;
                    for (const id of _apiVideoCache.keys()) {
                        if (i++ >= overflow) break;
                        _apiVideoCache.delete(id);
                    }
                }
            }
        } catch (_) {}
    }

    if (_isTwitterDomain) (function _interceptFetch() {
        const _origFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function(...args) {
            const url = typeof args[0] === 'string' ? args[0] : args[0]?.url ?? '';
            const isGraphQL = url.includes('/graphql/') && (
                url.includes('HomeTimeline') || url.includes('TweetDetail') ||
                url.includes('UserTweets')   || url.includes('SearchTimeline') ||
                url.includes('ListTimeline') || url.includes('TweetResultByRestId')
            );
            const promise = _origFetch.apply(this, args);
            if (!isGraphQL) return promise;
            return promise.then(resp => {
                const clone = resp.clone();
                clone.text().then(_processApiPayload).catch(() => {});
                return resp;
            });
        };
    })();

    const _fiberVideoCache = new WeakMap();
    const _FIBER_CACHE_TTL = 60_000;

    function _collectCandidateIds(article) {
        const ids = new Set();

        article.querySelectorAll('a[href*="/status/"]').forEach(a => {
            const m = a.getAttribute('href')?.match(/\/status\/(\d+)/);
            if (m) ids.add(m[1]);
        });

        article.querySelectorAll('video[poster]').forEach(v => {
            const m = v.getAttribute('poster')?.match(/(?:amplify_video_thumb|ext_tw_video_thumb|tweet_video_thumb)\/(\d+)/);
            if (m) ids.add(m[1]);
        });

        article.querySelectorAll('img[src*="video_thumb"]').forEach(img => {
            const m = img.getAttribute('src')?.match(/(?:amplify_video_thumb|ext_tw_video_thumb|tweet_video_thumb)\/(\d+)/);
            if (m) ids.add(m[1]);
        });

        return ids;
    }

    function _lookupApiCache(ids) {
        for (const id of ids) {
            const entry = _apiVideoCache.get(id);
            if (entry && (Date.now() - entry.ts < _API_CACHE_TTL)) return entry.urls;
        }
        return null;
    }

    async function fetchTweetMediaFromAPI(statusId) {
        const _cacheHit = _apiVideoCache.get(statusId);
        if (_cacheHit && (Date.now() - _cacheHit.ts < _API_CACHE_TTL)) return { videos: _cacheHit.urls, images: [] };

        try {
            const ct0 = document.cookie.match(/(?:^|;\s*)ct0=([^;]+)/)?.[1]?.trim() ?? '';
            const gt   = document.cookie.match(/(?:^|;\s*)gt=([^;]+)/)?.[1]?.trim()  ?? '';

            const AUTH_TOKEN = await _resolveBearerToken();

            const variables = {"tweetId":statusId,"with_rux_injections":false,"includePromotedContent":true,"withCommunity":true,"withQuickPromoteEligibilityTweetFields":true,"withBirdwatchNotes":true,"withVoice":true,"withV2Timeline":true};
            const features = {"articles_preview_enabled":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"freedom_of_speech_not_reach_fetch_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"view_counts_everywhere_api_enabled":true};

            let url = `https://${location.hostname}/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;

            let headers = { 'authorization': AUTH_TOKEN, 'x-twitter-active-user': 'yes' };
            if (ct0) headers['x-csrf-token'] = ct0;
            if (gt)  headers['x-guest-token'] = gt;

            let res = await fetch(url, { headers });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    showToast('⚠️ Twitter API token may be outdated. Video fetch may fail.');
                }
                return null;
            }
            let json = await res.json();
            let core = json.data?.tweetResult?.result?.tweet || json.data?.tweetResult?.result;
            if (!core) return null;

            let result = { videos: [], images: [] };

            const walk = (obj) => {
                if (!obj || typeof obj !== 'object') return;

                if (obj.extended_entities?.media) {
                    obj.extended_entities.media.forEach(m => {
                        if (m.type === 'photo') {
                            result.images.push(m.media_url_https + '?name=orig');
                        } else if (m.type === 'video' || m.type === 'animated_gif') {
                            let mp4s = m.video_info?.variants?.filter(v => v.content_type === 'video/mp4') || [];
                            if (mp4s.length) {
                                let best = mp4s.sort((a,b)=>(b.bitrate||0)-(a.bitrate||0))[0];
                                result.videos.push(best.url.split('?')[0]);
                            }
                        }
                    });
                }

                ['tweet', 'quoted_status_result', 'retweeted_status_result', 'result', 'legacy'].forEach(k => {
                    if (obj[k]) walk(obj[k]);
                });
            };
            walk(core);
            return result;
        } catch(e) {
            return null;
        }
    }

    async function extractVideoUrl(article) {
        const cached = _fiberVideoCache.get(article);
        if (cached && (Date.now() - cached.ts < _FIBER_CACHE_TTL)) return cached.urls;

        let statusId = null;
        const links = article.querySelectorAll('a[href*="/status/"]');
        for(let a of links) {
            const match = a.href.match(/\/status\/(\d+)/);
            if(match) { statusId = match[1]; break; }
        }

        if (statusId) {
            const apiData = await fetchTweetMediaFromAPI(statusId);
            if (apiData && apiData.videos.length > 0) {
                _fiberVideoCache.set(article, { urls: apiData.videos, ts: Date.now() });
                return apiData.videos;
            }
        }

        let result = Array.from(article.querySelectorAll('video'))
            .map(v => v.src || v.querySelector('source')?.src)
            .filter(src => src && src.includes('mp4') && !src.startsWith('blob:'))
            .map(src => src.split('?')[0]);
        return result;
    }

    async function extractMediaUrls(article) {
        const uniqueMedias = new Map();

        function addImageUrl(src) {
            if (!src) return;
            if (src.includes('/card_img/')) { uniqueMedias.set(src, src); return; }
            const idMatch = src.match(/\/(?:media|ext_tw_video_thumb|amplify_video_thumb|tweet_video_thumb)\/([A-Za-z0-9_-]+)/);
            const mediaId = idMatch ? idMatch[1] : src.split('?')[0];
            if (uniqueMedias.has(mediaId)) return;
            try {
                const url = new URL(src);
                url.searchParams.set('name', 'orig');
                uniqueMedias.set(mediaId, url.toString());
            } catch (e) {
                uniqueMedias.set(mediaId, src);
            }
        }

        let statusId = null;
        const links = article.querySelectorAll('a[href*="/status/"]');
        for(let a of links) {
            const match = a.href.match(/\/status\/(\d+)/);
            if(match) { statusId = match[1]; break; }
        }

        let apiSuccess = false;
        if (statusId) {
            const apiData = await fetchTweetMediaFromAPI(statusId);
            if (apiData && (apiData.videos.length > 0 || apiData.images.length > 0)) {
                apiData.videos.forEach(v => uniqueMedias.set(v, v));
                apiData.images.forEach(addImageUrl);
                apiSuccess = true;
            }
        }

        if (!apiSuccess) {
            Array.from(article.querySelectorAll('img[src*="twimg.com"]'))
                .map(img => img.src)
                .filter(src => src.includes('pbs.twimg.com') && !src.includes('profile_images') && !src.includes('/emoji/') && !src.includes('twemoji'))
                .forEach(addImageUrl);

            const videos = await extractVideoUrl(article);
            videos.forEach(v => uniqueMedias.set(v, v));

            article.querySelectorAll('[data-testid="tweet"] img[src*="pbs.twimg.com"]').forEach(img => {
                if (!img.src.includes('profile_images') && !img.src.includes('/emoji/')) addImageUrl(img.src);
            });
        }

        return Array.from(uniqueMedias.values());
    }

    function extractTweetUrl(article, baseUrl) {
        const timeLink = article.querySelector('a[href*="/status/"] > time')?.parentElement;
        if (timeLink) return baseUrl + timeLink.getAttribute('href');
        const link = article.querySelector('a[href*="/status/"]');
        if(link) return baseUrl + link.getAttribute('href');
        return null;
    }

    function insertCopyButton(article) {
        if (!article.querySelector('time')) {
            article.querySelector(`.${BUTTON_CLASS}`)?.remove();
            article.querySelector('.custom-copy-icon')?.remove();
            return;
        }
        if (article.querySelector(`.${BUTTON_CLASS}`)) return;
        const actions = Array.from(article.querySelectorAll('[role="group"]')).pop();
        if (!actions) return;

        if (!document.getElementById('tm-icon-anim-style')) {
            const s = document.createElement('style');
            s.id = 'tm-icon-anim-style';
            s.textContent = `
                @keyframes tm-pop-bounce {
                    0%   { transform: scale(0.5); opacity: 0; }
                    60%  { transform: scale(1.15); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes tm-pop-bounce-text {
                    0%   { transform: translateY(-50%) scale(0.5); opacity: 0; }
                    60%  { transform: translateY(-50%) scale(1.1); opacity: 1; }
                    100% { transform: translateY(-50%) scale(1); opacity: 1; }
                }
                .tm-anim-pop {
                    animation: tm-pop-bounce 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
                }
                .tm-anim-pop-text {
                    position: absolute;
                    right: 4px;
                    top: 50%;
                    transform: translateY(-50%);
                    transform-origin: right center;
                    white-space: nowrap;
                    font-weight: 700;
                    font-size: 13px;
                    font-family: system-ui, -apple-system, sans-serif;
                    background: rgba(128, 128, 128, 0.2);
                    backdrop-filter: blur(4px);
                    padding: 5px 12px;
                    border-radius: 9999px;
                    color: currentColor;
                    z-index: 9999;
                    pointer-events: none;
                    animation: tm-pop-bounce-text 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
                }
            `;
            document.head.appendChild(s);
        }

        const SVG_FILM = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="16" height="12" rx="2"/><line x1="2" y1="7" x2="18" y2="7"/><line x1="2" y1="13" x2="18" y2="13"/><line x1="6" y1="4" x2="6" y2="7"/><line x1="10" y1="4" x2="10" y2="7"/><line x1="14" y1="4" x2="14" y2="7"/><line x1="6" y1="13" x2="6" y2="16"/><line x1="10" y1="13" x2="10" y2="16"/><line x1="14" y1="13" x2="14" y2="16"/></svg>`;
        const SVG_CHECK_SM = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,10 8,14 16,6"/></svg>`;
        const SVG_PREFIX_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        const SVG_DL = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3v10M6 9l4 4 4-4"/><line x1="3" y1="17" x2="17" y2="17"/></svg>`;

        const btn = document.createElement('button');
        btn.className = BUTTON_CLASS;
        btn.title = T.btn_tooltip;
        btn.style.position = 'relative';

        const setMediaIcon = (state, extra, silentText, actionType = 'copy') => {
            const fbStyle = GM_getValue(KEY_FEEDBACK_STYLE, 'toast');
            btn.classList.remove('tm-anim-pop');
            btn.classList.remove('tm-anim-pulse');
            btn.classList.remove('tm-anim-flash');

            const setTextMode = (text, customColor) => {
                const safeColor = (customColor && /^#[0-9a-fA-F]{3,8}$/.test(customColor)) ? customColor : null;
                const span = document.createElement('span');
                span.className = 'tm-anim-pop-text';
                span.textContent = text;
                if (safeColor) span.style.cssText = `color: ${safeColor} !important;`;
                btn.innerHTML = '';
                btn.appendChild(span);
            };

            const setIconMode = (svg, customColor) => {
                const safeColor = (customColor && /^#[0-9a-fA-F]{3,8}$/.test(customColor)) ? customColor : null;
                btn.innerHTML = svg;
                btn.classList.add('tm-anim-pop');
                if (safeColor) {
                    const svgEl = btn.querySelector('svg');
                    if (svgEl) {
                        svgEl.style.color = safeColor;
                        svgEl.style.filter = `drop-shadow(0 0 4px ${safeColor}66)`;
                    }
                }
            };
            const setIconModeOnly = (svg) => {
                btn.innerHTML = svg;
            };

            const getSilentText = () => silentText || extra;

            if (state === 'default') {
                btn.innerHTML = SVG_FILM;
            } else if (state === 'dl') {
                btn.innerHTML = SVG_DL;
            } else if (state === 'ok') {
                if (fbStyle === 'silent') {
                    setTextMode(getSilentText() || 'Copied');
                } else if (fbStyle === 'slide') {
                    const span = document.createElement('span');
                    span.className = 'tm-anim-pop-text tm-slide';
                    span.textContent = getSilentText() || 'Copied';
                    btn.innerHTML = '';
                    btn.appendChild(span);
                    span.addEventListener('animationend', () => setMediaIcon('default'), { once: true });
                } else if (fbStyle === 'pulse') {
                    if (actionType === 'prefix') setIconModeOnly(SVG_PREFIX_COPY);
                    else setIconModeOnly(SVG_CHECK_SM);
                    btn.classList.add('tm-anim-pulse');
                } else if (fbStyle === 'flash') {
                    if (actionType === 'prefix') setIconModeOnly(SVG_PREFIX_COPY);
                    else setIconModeOnly(SVG_CHECK_SM);
                    btn.classList.add('tm-anim-flash');
                } else if (fbStyle === 'icon') {
                    if (actionType === 'prefix') setIconMode(SVG_PREFIX_COPY);
                    else if (actionType === 'download') setIconMode(SVG_CHECK_SM);
                    else setIconMode(SVG_CHECK_SM);
                } else {
                    btn.innerHTML = SVG_CHECK_SM;
                    btn.classList.add('tm-anim-pop');
                    showActionToast(btn, extra || T.msg_copied, 'ok');
                }
            } else if (state === 'warn') {
                if (fbStyle === 'silent') {
                    setTextMode(getSilentText(), '#ff8c00');
                } else if (fbStyle === 'icon') {
                    setIconMode(SVG_FILM, '#ff8c00');
                } else {
                    btn.innerHTML = SVG_FILM;
                    showActionToast(btn, extra, 'warn');
                }
            } else {
                if (fbStyle === 'silent' && getSilentText()) {
                    setTextMode(getSilentText(), state === 'error' ? '#e0245e' : null);
                } else if (fbStyle === 'icon') {
                    setIconMode(SVG_FILM, state === 'error' ? '#e0245e' : null);
                } else {
                    btn.innerHTML = SVG_FILM;
                    if (extra) showActionToast(btn, extra, state === 'error' ? 'error' : 'ok');
                }
            }

            const tweetId = _getTweetIdFromArticle(article);
            if (tweetId && _downloadedIds.has(tweetId)) {
                _applyHistoryBadge(btn);
            }
        };

        setMediaIcon('default');

        let timer = null;
        let longFired = false;
        let _pressing = false;
        btn.addEventListener('mousedown', async (e) => {
            e.preventDefault(); e.stopPropagation();

            if (e.button === 0) {
                longFired = false;
                _pressing = true;
                timer = setTimeout(async () => {
                    longFired = true;
                    _pressing = false;
                    timer = null;
                    const urls = await extractMediaUrls(article);
                    if (!urls.length) return;
                    const prefix = GM_getValue(KEY_PREFIX_TEXT, '[text]');
                    const txt = urls.map(u => `${prefix}(${u})`).join('\n');
                    GM_setClipboard(txt);
                    setMediaIcon('ok', T.msg_prefix_copied, 'Prefix Copied', 'prefix');
                    setTimeout(() => setMediaIcon('default'), 1500);
                }, 400);

            } else if (e.button === 1) {
                let videos = [], imgUrls = [];

                let statusId = null;
                for (const a of article.querySelectorAll('a[href*="/status/"]')) {
                    const m = a.href.match(/\/status\/(\d+)/);
                    if (m) { statusId = m[1]; break; }
                }

                if (statusId) {
                    const apiData = await fetchTweetMediaFromAPI(statusId);
                    if (apiData) {
                        videos  = apiData.videos  || [];
                        imgUrls = apiData.images   || [];
                    }
                }

                if (!videos.length && !imgUrls.length) {
                    videos  = await extractVideoUrl(article);
                    const allUrls = await extractMediaUrls(article);
                    const videoSet = new Set(videos);
                    imgUrls = allUrls.filter(u => !videoSet.has(u));
                }

                if (videos.length && imgUrls.length) {
                    showFloatingVideoPlayer(videos, 0, imgUrls);
                } else if (videos.length) {
                    showFloatingVideoPlayer(videos);
                } else if (imgUrls.length) {
                    showImageLightbox(imgUrls);
                } else {
                    setMediaIcon('msg', T.msg_no_media, 'No Media');
                    setTimeout(() => setMediaIcon('default'), 1500);
                }
            }
        });

        btn.addEventListener('mouseup', async (e) => {
            if (e.button !== 0) return;
            if (timer) {
                clearTimeout(timer); timer = null;
                _pressing = false;
                if (longFired) return;
                const urls = await extractMediaUrls(article);
                if (!urls.length) {
                    setMediaIcon('msg', T.msg_no_media, 'No Media');
                    setTimeout(() => setMediaIcon('default'), 1500);
                    return;
                }
                GM_setClipboard(urls.join('\n'));
                setMediaIcon('ok', T.msg_copied, 'Copied', 'copy');
                setTimeout(() => setMediaIcon('default'), 1500);
            }
        });
        btn.addEventListener('mouseleave', () => { if (timer && !_pressing) { clearTimeout(timer); timer = null; } });
        btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });

        btn.addEventListener('contextmenu', async (e) => {
            e.preventDefault(); e.stopPropagation();
            const urls = await extractMediaUrls(article);

            if (urls.length === 0) {
                const info = getTweetInfo(article);
                const rawText = article.querySelector('[data-testid="tweetText"]')?.innerText?.trim() || '';
                _dialogOpenGlobal = true;
                const confirmed = confirm(
                    `This post has no media.\n\n` +
                    `"${rawText.slice(0, 100)}${rawText.length > 100 ? '…' : ''}"\n\n` +
                    `Save it as a text bookmark for grouping?`
                );
                _dialogOpenGlobal = false;
                if (!confirmed) return;
                try {
                    const _now   = new Date();
                    const _yy    = _now.getFullYear();
                    const _mm    = String(_now.getMonth() + 1).padStart(2, '0');
                    const yyyymm = `${_yy}.${_mm}`;
                    const record = {
                        id:           Date.now(),
                        ts:           Date.now(),
                        yyyymm,
                        tweetId:      info.id,
                        tweetUrl:     `https://x.com/${info.screenName}/status/${info.id}`,
                        tweetDate:    info.date,
                        downloadDate: `${_yy}-${_mm}-${String(_now.getDate()).padStart(2,'0')}`,
                        screenName:   info.screenName,
                        displayName:  info.displayName,
                        text:         (rawText || info.text || '').slice(0, 280),
                        thumbUrls:    [],
                        mediaUrls:    [],
                        hasVideo:     false,
                        count:        0,
                        textOnly:     true,
                    };
                    let records = [];
                    try { records = JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]')); } catch (_) {}
                    const _old = records.find(r => r.tweetId === info.id);
                    if (_old?.favorited) record.favorited = true;
                    records = records.filter(r => r.tweetId !== info.id);
                    records.unshift(record);
                    GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));
                    _downloadedIds.add(info.id);
                    setMediaIcon('ok', '📌 Saved', 'Saved');
                    setTimeout(() => setMediaIcon('default'), 1800);
                    if (GM_getValue(KEY_GROUP_ON_DOWNLOAD, false)) {
                        _pendingGroupRecordId = record.id;
                        setTimeout(() => popStarPip(btn || null), 80);
                    }
                } catch (err) {
                    console.warn('[MediaDL] textOnly record failed:', err);
                }
                return;
            }

            const info = getTweetInfo(article);
            setMediaIcon('dl');

            const ring = createProgressRing();
            ring.el.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;';
            btn.appendChild(ring.el);

            let index = 1;
            let failCount = 0;
            const total = urls.length;

            for (const url of urls) {
                let ext = '.jpg';
                if (url.includes('.mp4')) ext = '.mp4';
                else if (url.includes('format=png')) ext = '.png';
                else {
                     const parts = url.split('/').pop().split('?')[0].split('.');
                     if (parts.length > 1) ext = '.' + parts.pop();
                }

                const textPart = info.text ? `_${info.text}` : "";
                const safeDisplay = sanitizeForFilename(info.displayName);
                const safeScreen = sanitizeForFilename(info.screenName);
                const filename = `[twitter] ${safeDisplay}(@${safeScreen})_${info.date}${textPart}_${info.id}_${index}${ext}`;

                const fileOffset = (index - 1) / total;
                const fileShare  = 1 / total;
                try {
                    await forceDownloadBlob(url, filename, (pct) => {
                        if (pct === null) {
                            ring.update(null);
                        } else {
                            ring.update(Math.round((fileOffset + fileShare * pct / 100) * 100));
                        }
                    });
                } catch(_) {
                    failCount++;
                }
                await new Promise(r => setTimeout(r, 250));
                index++;
            }

            ring.remove();
            const successCount = total - failCount;
            if (failCount > 0) {
                setMediaIcon('warn', `⚠️ ${successCount}/${total}`);
            } else {
                setMediaIcon('ok', T.msg_downloaded, 'Downloaded', 'download');
                recordHistory(info, urls, btn);
                fireMeteor(btn);
            }
            setTimeout(() => setMediaIcon('default'), 2000);
        });

        const LINK_BTN_CLASS = 'custom-copy-icon';
        if (!article.querySelector(`.${LINK_BTN_CLASS}`)) {
            const icon = document.createElement('div');
            icon.className = LINK_BTN_CLASS;
            icon.style.position = 'relative';

            const SVG_LINK = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a4 4 0 0 0 5.66 0l2-2a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M12 8a4 4 0 0 0-5.66 0l-2 2a4 4 0 0 0 5.66 5.66l1-1"/></svg>`;
            const SVG_CHECK = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,10 8,14 16,6"/></svg>`;

            const setLinkIcon = (state, extra, silentText, actionType = 'copy') => {
                const fbStyle = GM_getValue(KEY_FEEDBACK_STYLE, 'toast');
                icon.classList.remove('tm-anim-pop');
                icon.classList.remove('tm-anim-pulse');
                icon.classList.remove('tm-anim-flash');

                const setTextMode = (text) => {
                    const span = document.createElement('span');
                    span.className = 'tm-anim-pop-text';
                    span.textContent = text;
                    icon.innerHTML = '';
                    icon.appendChild(span);
                };

                const setIconMode = (svg) => {
                    icon.innerHTML = svg;
                    icon.classList.add('tm-anim-pop');
                };
                const setIconModeOnly = (svg) => {
                    icon.innerHTML = svg;
                };

                if (state === 'ok') {
                    if (fbStyle === 'silent') {
                        setTextMode(silentText || extra || 'Copied');
                    } else if (fbStyle === 'slide') {
                        const span = document.createElement('span');
                        span.className = 'tm-anim-pop-text tm-slide';
                        span.textContent = silentText || extra || 'Copied';
                        icon.innerHTML = '';
                        icon.appendChild(span);
                        span.addEventListener('animationend', () => setLinkIcon('default'), { once: true });
                    } else if (fbStyle === 'pulse') {
                        const useSvg = actionType === 'prefix' ? SVG_PREFIX_COPY : SVG_CHECK;
                        setIconModeOnly(useSvg);
                        icon.classList.add('tm-anim-pulse');
                    } else if (fbStyle === 'flash') {
                        const useSvg = actionType === 'prefix' ? SVG_PREFIX_COPY : SVG_CHECK;
                        setIconModeOnly(useSvg);
                        icon.classList.add('tm-anim-flash');
                    } else if (fbStyle === 'icon') {
                        const useSvg = actionType === 'prefix' ? SVG_PREFIX_COPY : SVG_CHECK;
                        setIconMode(useSvg);
                    } else {
                        icon.innerHTML = SVG_CHECK;
                        icon.classList.add('tm-anim-pop');
                        showActionToast(icon, extra || T.msg_copied, 'ok');
                    }
                } else {
                    icon.innerHTML = SVG_LINK;
                }
            };
            setLinkIcon('default');

            icon.addEventListener('mouseenter', () => {
                const custom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false);
                const click = custom ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                icon.title = T.link_tooltip + click + T.link_tooltip_long + click;
            });

            let lTimer = null;

            icon.addEventListener('mousedown', e => {
                if (e.button !== 0) return;
                e.preventDefault(); e.stopPropagation();
                lTimer = setTimeout(() => {
                    const useCustom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false);
                    const targetDomain = useCustom ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                    const url = extractTweetUrl(article, 'https://' + targetDomain);
                    if (url) {
                        const prefix = GM_getValue(KEY_PREFIX_TEXT, '[text]');
                        GM_setClipboard(`${prefix}(${url})`);
                        setLinkIcon('ok', T.msg_prefix_copied, 'Prefix Copied', 'prefix');
                        setTimeout(() => setLinkIcon('default'), 1500);
                    }
                    lTimer = null;
                }, 500);
            });

            icon.addEventListener('mouseup', () => {
                if(lTimer) {
                    clearTimeout(lTimer);
                    lTimer = null;

                    const useCustom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false);
                    const targetDomain = useCustom ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                    const url = extractTweetUrl(article, 'https://' + targetDomain);

                    if(url) {
                        GM_setClipboard(url);
                        setLinkIcon('ok', T.msg_copied, 'Copied', 'copy');
                        setTimeout(() => setLinkIcon('default'), 1500);
                    }
                }
            });

            icon.addEventListener('mouseleave', () => { if(lTimer) { clearTimeout(lTimer); lTimer = null; } });
            icon.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });

            actions.appendChild(btn);
            actions.insertBefore(icon, btn);

            if (_downloadedIds.size > 0) {
                requestAnimationFrame(() => {
                    const tweetId = _getTweetIdFromArticle(article);
                    if (tweetId && _downloadedIds.has(tweetId)) _applyHistoryBadge(btn);
                });
            }
        }
    }

    if (_isTwitterDomain) {
    let _tmdDebounceTimer = null;

    const _processedArticles = new WeakSet();

    function scanAndInsert() {
        document.querySelectorAll('article').forEach(article => {
            if (_processedArticles.has(article) && article.querySelector(`.${BUTTON_CLASS}`)) return;
            insertCopyButton(article);
            if (article.querySelector(`.${BUTTON_CLASS}`)) _processedArticles.add(article);
        });
    }

    const observer = new MutationObserver(mutations => {
        let shouldCheck = false;
        for (let m of mutations) {
            if (m.addedNodes.length > 0 || m.removedNodes.length > 0) {
                shouldCheck = true;
                break;
            }
        }

        if (shouldCheck) {
            clearTimeout(_tmdDebounceTimer);
            _tmdDebounceTimer = setTimeout(scanAndInsert, 250);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });

    const _scanIntervalId = setInterval(scanAndInsert, 1500);

    setTimeout(scanAndInsert, 1000);
    }
})();