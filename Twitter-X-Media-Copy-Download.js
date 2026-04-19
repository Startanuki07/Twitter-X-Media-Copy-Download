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
// @namespace    https://greasyfork.org/en/users/1575945-star-tanuki07?locale_override=1
// @version      1.7.1
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
// @description      Adds a media button and a link button to every tweet for one-click URL copying and media downloading.
// @description:zh-TW 在每則推文新增媒體與連結按鈕，提供一鍵複製網址及下載媒體的功能。
// @description:zh-CN 在每条推文新增媒体与链接按钮，提供一键复制网址及下载媒体的功能。
// @description:ja    各ツイートにメディアボタンとリンクボタンを追加し、URLのコピーとメディアのダウンロードをワンクリックで行えます。
// @description:ko    모든 트윗에 미디어 및 링크 버튼을 추가하여 원클릭으로 URL 복사 및 미디어 다운로드를 제공합니다.
// @description:es    Agrega botones de medios y enlaces a cada tweet para copiar URLs y descargar medios con un solo clic.
// @description:pt-BR Adiciona botões de mídia e links a cada tweet para copiar URLs e baixar mídia com um clique.
// @description:fr    Ajoute des boutons de médias et de liens à chaque tweet pour copier les URL et télécharger des médias en un clic.
// @description:ru    Добавляет кнопки медиа и ссылок к каждому твиту для копирования URL и скачивания медиа в один клик.
// ==/UserScript==

(function () {
    'use strict';

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
    const KEY_HISTORY_RECORDS   = 'app_history_records';
    const KEY_HISTORY_PANEL_POS = 'app_history_panel_pos';
    const KEY_HISTORY_VIEW_MODE = 'app_history_view_mode';
    const KEY_DOCK_STYLE        = 'app_dock_style';
    const KEY_DOCK_HOVER_DELAY  = 'app_dock_hover_delay';
    const KEY_DOCK_TRIGGER_L    = 'app_dock_trigger_l';
    const KEY_DOCK_TRIGGER_R    = 'app_dock_trigger_r';
    const KEY_DOCK_PERSISTED    = 'app_dock_persisted';
    const HISTORY_MAX_RECORDS   = 300;

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
                • Right-click downloads are automatically logged (up to 300 entries).<br>
                • Downloaded tweets show a 🟢 badge on the 🎞️ button.<br>
                • Click 📋 (top-right) to browse history: list / thumbnail view, search, export CSV / JSON.</p>
                <hr>
                <p><b>⚙️ Settings Panel:</b><br>
                • Hover the top-right corner → 📋 history / ⚙️ gear button appears.<br>
                • Configure: click domain, long-press domain, Discord prefix, date format, language, feedback style.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Disclaimer:</b><br>
                Embed domains (e.g. fixupx, vxtwitter) are third-party services unaffiliated with this script.</p>
            `,
            onboard_title: '⚙ Settings Panel',
            onboard_body:  'Hover the top-right corner to reveal the settings button. Click it to quickly manage domains, prefix, language and more — no script manager menu needed.',
            onboard_got_it: 'Got it!',
            menu_feedback_style:    '🔔 Feedback Style',
            status_feedback_toast:  'Toast',
            status_feedback_icon:   'Icon Only',
            status_feedback_silent: 'Silent',
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
                • 右鍵下載後自動記錄（最多 300 筆）。<br>
                • 滑鼠移至右上角 → 點擊 🕐 開啟履歷面板。<br>
                • 支援列表/縮圖切換、搜尋、Shift 區間選取、批次刪除、CSV/JSON 匯出。</p>
                <hr>
                <p><b>⚙️ 設定面板：</b><br>
                • 將滑鼠移至右上角，顯示齒輪 ⚙️ 與履歷 🕐 按鈕。<br>
                • 點擊 ⚙️ 可設定：單擊域名、長按域名、Discord 前綴、提示風格、日期格式、語言。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免責聲明：</b><br>
                fixupx / vxtwitter 等域名皆為第三方服務，與本腳本無關，請僅使用您信任的域名。</p>
            `,
            onboard_title: '⚙ 設定面板',
            onboard_body:  '將滑鼠移至右上角即可叫出設定按鈕，點擊後可快速管理域名、前綴、語言等設定，無需開啟腳本管理器選單。',
            onboard_got_it: '知道了！',
            menu_feedback_style:    '🔔 提示風格',
            status_feedback_toast:  'Toast 提示',
            status_feedback_icon:   '僅圖示',
            status_feedback_silent: '靜默（僅圖示）',
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
                • 右键下载后自动记录（最多 300 条）。<br>
                • 鼠标移至右上角 → 点击 🕐 打开历史面板。<br>
                • 支持列表/缩略图切换、搜索、Shift 区间选择、批量删除、CSV/JSON 导出。</p>
                <hr>
                <p><b>⚙️ 设置面板：</b><br>
                • 将鼠标移至右上角，显示齿轮 ⚙️ 与历史 🕐 按钮。<br>
                • 点击 ⚙️ 可设置：单击域名、长按域名、Discord 前缀、提示风格、日期格式、语言。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免责声明：</b><br>
                fixupx / vxtwitter 等域名均为第三方服务，与本脚本无关，请仅使用您信任的域名。</p>
            `,
            onboard_title: '⚙ 设置面板',
            onboard_body:  '将鼠标移到右上角即可呼出设置按钮，点击后可快速管理域名、前缀、语言等设置，无需打开脚本管理器菜单。',
            onboard_got_it: '知道了！',
            menu_feedback_style:    '🔔 提示风格',
            status_feedback_toast:  'Toast 提示',
            status_feedback_icon:   '仅图标',
            status_feedback_silent: '静默（仅图标）',
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
                • 右クリックダウンロードは自動記録（最大300件）。<br>
                • 右上にカーソルを合わせ → 🕐 をクリックして履歴パネルを開く。<br>
                • リスト/サムネイル表示、検索、Shift選択一括削除、CSV/JSONエクスポート対応。</p>
                <hr>
                <p><b>⚙️ 設定パネル：</b><br>
                • 右上隅にカーソルを合わせると ⚙️ と 🕐 ボタンが表示される。<br>
                • ⚙️ をクリックして設定：クリックドメイン、長押しドメイン、プレフィックス、通知スタイル、日付形式、言語。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免責事項：</b><br>
                fixupx / vxtwitter 等のドメインは第三者サービスであり、このスクリプトとは無関係です。信頼できるドメインのみご使用ください。</p>
            `,
            onboard_title: '⚙ 設定パネル',
            onboard_body:  '右上隅にカーソルを合わせると設定ボタンが現れます。クリックすればスクリプト管理器を開かずにドメイン・プレフィックス・言語などをすばやく管理できます。',
            onboard_got_it: 'わかった！',
            menu_feedback_style:    '🔔 フィードバックスタイル',
            status_feedback_toast:  'トースト通知',
            status_feedback_icon:   'アイコンのみ',
            status_feedback_silent: 'サイレント（アイコンのみ）',
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
                • 우클릭 다운로드 후 자동 기록（최대 300건）。<br>
                • 오른쪽 상단에 마우스를 올려 → 🕐 클릭으로 기록 패널 열기。<br>
                • 목록/썸네일 보기, 검색, Shift 범위 선택, 일괄 삭제, CSV/JSON 내보내기 지원。</p>
                <hr>
                <p><b>⚙️ 설정 패널：</b><br>
                • 오른쪽 상단에 마우스를 올리면 ⚙️ 와 🕐 버튼이 나타납니다。<br>
                • ⚙️ 클릭으로 설정：클릭 도메인, 길게 누르기 도메인, 접두사, 알림 스타일, 날짜 형식, 언어。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 면책 조항：</b><br>
                fixupx / vxtwitter 등은 본 스크립트와 무관한 제3자 서비스입니다. 신뢰할 수 있는 도메인만 사용하세요。</p>
            `,
            onboard_title: '⚙ 설정 패널',
            onboard_body:  '오른쪽 상단 모서리에 마우스를 올리면 설정 버튼이 나타납니다. 클릭하면 스크립트 관리자 없이 도메인, 접두사, 언어 등을 빠르게 관리할 수 있습니다.',
            onboard_got_it: '알겠어요!',
            menu_feedback_style:    '🔔 피드백 스타일',
            status_feedback_toast:  '토스트',
            status_feedback_icon:   '아이콘만',
            status_feedback_silent: '조용히 (아이콘만)',
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
                • Se registra automáticamente tras descargar con clic derecho (máx. 300 entradas).<br>
                • Los tweets descargados muestran un 🟢 badge en el botón 🎞️.<br>
                • Clic en 📋 (esquina superior derecha): vista lista/miniaturas, búsqueda, exportar CSV/JSON.</p>
                <hr>
                <p><b>⚙️ Panel de configuración:</b><br>
                • Pasa el ratón por la esquina superior derecha → aparecen 📋 y ⚙️.<br>
                • Configura: dominio de clic, dominio de pulsación larga, prefijo Discord, formato de fecha, idioma, estilo de notificación.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Aviso legal:</b><br>
                Los dominios de conversión (ej. fixupx, vxtwitter) son servicios de terceros sin relación con este script.</p>
            `,
            onboard_title: '⚙ Panel de Configuración',
            onboard_body:  'Mueve el cursor a la esquina superior derecha para revelar el botón de configuración. Haz clic para gestionar dominios, prefijo, idioma y más sin abrir el administrador de scripts.',
            onboard_got_it: '¡Entendido!',
            menu_feedback_style:    '🔔 Estilo de Aviso',
            status_feedback_toast:  'Toast',
            status_feedback_icon:   'Solo icono',
            status_feedback_silent: 'Silencioso (solo icono)',
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
                • Registrado automaticamente após download com clique direito (máx. 300 entradas).<br>
                • Tweets baixados mostram 🟢 badge no botão 🎞️.<br>
                • Clique em 📋 (canto superior direito): lista/miniaturas, pesquisa, exportar CSV/JSON.</p>
                <hr>
                <p><b>⚙️ Painel de configurações:</b><br>
                • Passe o mouse pelo canto superior direito → 📋 e ⚙️ aparecem.<br>
                • Configure: domínio de clique, domínio de pressão longa, prefixo Discord, formato de data, idioma, estilo de aviso.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Aviso legal:</b><br>
                Os domínios de conversão (ex. fixupx, vxtwitter) são serviços de terceiros sem relação com este script.</p>
            `,
            onboard_title: '⚙ Painel de Configurações',
            onboard_body:  'Passe o mouse no canto superior direito para revelar o botão de configurações. Clique para gerenciar domínios, prefixo, idioma e mais sem abrir o gerenciador de scripts.',
            onboard_got_it: 'Entendi!',
            menu_feedback_style:    '🔔 Estilo de Aviso',
            status_feedback_toast:  'Toast',
            status_feedback_icon:   'Só ícone',
            status_feedback_silent: 'Silencioso (só ícone)',
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
                • Enregistré automatiquement après téléchargement par clic droit (max. 300 entrées).<br>
                • Les tweets téléchargés affichent un 🟢 badge sur le bouton 🎞️.<br>
                • Cliquez sur 📋 (coin supérieur droit) : liste/miniatures, recherche, export CSV/JSON.</p>
                <hr>
                <p><b>⚙️ Panneau de paramètres :</b><br>
                • Survolez le coin supérieur droit → 📋 et ⚙️ apparaissent.<br>
                • Configurez : domaine de clic, domaine d'appui long, préfixe Discord, format de date, langue, style de retour.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Avertissement :</b><br>
                Les domaines de conversion (ex. fixupx, vxtwitter) sont des services tiers sans lien avec ce script.</p>
            `,
            onboard_title: '⚙ Panneau de Paramètres',
            onboard_body:  'Survolez le coin supérieur droit pour afficher le bouton de paramètres. Cliquez pour gérer les domaines, le préfixe, la langue et plus en utilisant le panneau de paramètres intégré.',
            onboard_got_it: "Compris !",
            menu_feedback_style:    '🔔 Style de Retour',
            status_feedback_toast:  'Toast',
            status_feedback_icon:   'Icône seul',
            status_feedback_silent: 'Silencieux (icône seul)',
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
                • Автоматически записывается после правого клика (макс. 300 записей).<br>
                • Скачанные твиты показывают 🟢 значок на кнопке 🎞️.<br>
                • Нажмите 📋 (верхний правый угол): список/миниатюры, поиск, экспорт CSV/JSON.</p>
                <hr>
                <p><b>⚙️ Панель настроек:</b><br>
                • Наведите курсор в правый верхний угол → появятся 📋 и ⚙️.<br>
                • Настройте: домен клика, домен долгого нажатия, префикс Discord, формат даты, язык, стиль уведомлений.</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Отказ от ответственности:</b><br>
                Домены конвертации (fixupx, vxtwitter и др.) — сторонние сервисы, не связанные с этим скриптом. Используйте только те домены, которым доверяете.</p>
            `,
            onboard_title: '⚙ Панель настроек',
            onboard_body:  'Наведите курсор в правый верхний угол, чтобы показать кнопку настроек. Нажмите для быстрого управления доменами, префиксом, языком и другими параметрами.',
            onboard_got_it: 'Понятно!',
            menu_feedback_style:    '🔔 Стиль уведомлений',
            status_feedback_toast:  'Тост',
            status_feedback_icon:   'Только иконка',
            status_feedback_silent: 'Тихий (только иконка)',
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
            help_title: base.help_title,
            help_content: base.help_content.trim(),
            onboard_title: base.onboard_title,
            onboard_body:  base.onboard_body,
            onboard_got_it: base.onboard_got_it,
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
    }
    registerMenus();

    function _initSettingsPanel() {
        if (document.body) { createSettingsPanel(); }
        else { document.addEventListener('DOMContentLoaded', createSettingsPanel, { once: true }); }
    }

    function showOnboardingOverlay() {
        if (GM_getValue(KEY_ONBOARDING_DONE, false)) return;

        const gearEl = document.getElementById('tm-settings-gear-btn');
        if (!gearEl) { setTimeout(showOnboardingOverlay, 400); return; }

        const rect = gearEl.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const r1   = 26;
        const r2   = 42;

        const wrapperEl = document.getElementById('tm-settings-wrapper');
        if (wrapperEl) {
            wrapperEl.style.setProperty('opacity', '1', 'important');
            wrapperEl.style.setProperty('transition', 'none', 'important');
        }
        gearEl.style.setProperty('opacity', '1', 'important');
        gearEl.style.setProperty('transition', 'none', 'important');

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
                position:fixed; z-index:999988;
                animation: tm-ob-card-in 0.4s 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
                pointer-events:all;
            }
            #tm-ob-got-it {
                width:100%; padding:9px; border-radius:9999px;
                border:none; background:#1d9bf0; color:#fff;
                font-size:14px; font-weight:700; cursor:pointer;
                text-align:center; display:block;
                transition:background 0.15s;
            }
            #tm-ob-got-it:hover { background:#1a8cd8; }
        `;
        document.head.appendChild(obStyle);

        const overlay = document.createElement('div');
        overlay.id = 'tm-ob-overlay';
        overlay.style.background =
            `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r1}px, rgba(0,0,0,0.80) ${r2}px)`;

        const ring = document.createElement('div');
        ring.id = 'tm-ob-ring';
        ring.style.cssText = `width:${r1 * 2}px; height:${r1 * 2}px; left:${cx}px; top:${cy}px; transform:translate(-50%,-50%);`;

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const cardBg   = dark ? '#16202b' : '#ffffff';
        const cardText = dark ? '#e7e9ea' : '#0f1419';
        const cardSub  = dark ? '#8b98a5' : '#536471';
        const arrowClr = dark ? '#16202b' : '#ffffff';
        const cardW    = 270;
        const cardLeft = Math.max(8, Math.min(cx - cardW / 2, window.innerWidth - cardW - 8));
        const cardTop   = cy + r2 + 10;

        const card = document.createElement('div');
        card.id = 'tm-ob-card';
        card.style.cssText = `
            width:${cardW}px; left:${cardLeft}px; top:${cardTop}px;
            background:${cardBg}; border-radius:14px;
            box-shadow:0 8px 32px rgba(0,0,0,0.32);
            padding:18px 18px 14px;
            z-index:999989;
        `;

        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position:absolute; top:-10px; right:16px; width:0; height:0;
            border-left:10px solid transparent; border-right:10px solid transparent;
            border-bottom:10px solid ${arrowClr};
        `;

        const titleEl = document.createElement('div');
        titleEl.style.cssText = `font-size:15px;font-weight:700;color:${cardText};margin-bottom:8px;`;
        titleEl.textContent = T.onboard_title || '⚙ Settings Panel';

        const bodyEl = document.createElement('div');
        bodyEl.style.cssText = `font-size:13px;color:${cardSub};line-height:1.55;margin-bottom:14px;`;
        bodyEl.textContent = T.onboard_body || 'Hover the top-right corner to reveal the settings button.';

        const gotItBtn = document.createElement('button');
        gotItBtn.id = 'tm-ob-got-it';
        gotItBtn.textContent = T.onboard_got_it || 'Got it!';

        const dismiss = () => {
            GM_setValue(KEY_ONBOARDING_DONE, true);
            [overlay, card, ring].forEach(el => {
                el.style.transition = 'opacity 0.3s ease';
                el.style.opacity = '0';
            });
            setTimeout(() => {
                [overlay, card, ring, obStyle].forEach(el => el.remove());
                gearEl.style.removeProperty('opacity');
                gearEl.style.removeProperty('transition');
                if (wrapperEl) {
                    wrapperEl.style.removeProperty('opacity');
                    wrapperEl.style.removeProperty('transition');
                }
            }, 320);
        };

        gotItBtn.addEventListener('click', e => { e.stopPropagation(); dismiss(); });
        overlay.addEventListener('click', dismiss);

        card.appendChild(arrow);
        card.appendChild(titleEl);
        card.appendChild(bodyEl);
        card.appendChild(gotItBtn);
        document.body.appendChild(overlay);
        document.body.appendChild(ring);
        document.body.appendChild(card);
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

            /* =========================================
               狀態切換 (由 Wrapper 的 JS data-focus 控制)
               ========================================= */

            
            #tm-settings-wrapper[data-focus="hist"] #tm-history-btn {
                transform: scale(1.15);
                background: ${C.gearBg};
            }

            
            #tm-settings-wrapper[data-focus="gear"] #tm-settings-gear-btn,
            #tm-settings-wrapper[data-open="true"] #tm-settings-gear-btn {
                z-index: 4;
                opacity: 1;
                transform: scale(1.2) translateX(-22px); 
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
                position: absolute; top: calc(100% + 4px); right: 4px;
                width: 300px; background: ${C.panel};
                border-radius: 14px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10);
                border: 1px solid ${C.border};
                font-family: system-ui, -apple-system, sans-serif;
                overflow: hidden;
                transform-origin: top right;
                transform: scale(0.88) translateY(-8px); opacity: 0;
                transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease;
                pointer-events: none;
            }
            #tm-settings-wrapper[data-open="true"] #tm-settings-panel {
                transform: scale(1) translateY(0); opacity: 1;
                pointer-events: all;
            }

            .tm-sp-header { display: flex; align-items: center; padding: 11px 14px 10px; background: ${C.header}; border-bottom: 1px solid ${C.border}; font-size: 12px; font-weight: 700; color: ${C.sub}; letter-spacing: 0.04em; text-transform: uppercase; }
            
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

            
            #tm-settings-wrapper[data-absorb="true"] {
                opacity: 1 !important;
                
            }
            /* ⚠️ 注意：histBtn 的 transform 不能加 !important，
               否則 CSS Animation (層級低於 !important) 會被完全鎖死，
               bounce keyframe 的 transform 永遠不會生效。
               只管 opacity / z-index，transform 交給 animation 處理。 */
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
        `;
        document.head.appendChild(panelStyle);

        const wrapper = document.createElement('div');
        wrapper.id = 'tm-settings-wrapper';
        wrapper.setAttribute('data-focus', 'hist');
        wrapper.setAttribute('data-open', 'false');

        let focusTimer = null;
        let currentFocus = 'hist';

        wrapper.addEventListener('mousemove', (e) => {
            if (wrapper.getAttribute('data-open') === 'true') return;
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const targetFocus = x > 45 ? 'gear' : 'hist';

            if (targetFocus !== currentFocus) {
                if (!focusTimer) {
                    focusTimer = setTimeout(() => {
                        currentFocus = targetFocus;
                        wrapper.setAttribute('data-focus', currentFocus);
                        focusTimer = null;
                    }, 150);
                }
            } else {
                if (focusTimer) {
                    clearTimeout(focusTimer);
                    focusTimer = null;
                }
            }
        });

        wrapper.addEventListener('mouseleave', () => {
            if (wrapper.getAttribute('data-open') === 'true') return;
            if (focusTimer) { clearTimeout(focusTimer); focusTimer = null; }
            currentFocus = 'hist';
            wrapper.setAttribute('data-focus', 'hist');
        });

        const SVG_GEAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
        const gearBtn = document.createElement('button');
        gearBtn.id = 'tm-settings-gear-btn';
        gearBtn.innerHTML = SVG_GEAR;
        gearBtn.title = '⚙️ Twitter Media Script Settings';

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
                val.textContent = value;
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
                });
                return row;
            };

            const makeGroup = (label, defaultOpen = true, tooltip = null, onOpen = null) => {
                const SVG_CHEVRON = `<svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor"><path d="M1 3l4 4 4-4z"/></svg>`;
                const SVG_HELP    = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><path d="M6 6.2C6 5.1 6.9 4.2 8 4.2s2 .9 2 2c0 1-1 1.5-2 2v.6"/><circle cx="8" cy="11.2" r=".6" fill="currentColor" stroke="none"/></svg>`;

                const g = document.createElement('div');
                g.className = 'tm-sp-group-header' + (defaultOpen ? '' : ' collapsed');

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
                if (defaultOpen) chevron.style.transform = 'rotate(0deg)';
                else             chevron.style.transform = 'rotate(-90deg)';
                g.appendChild(chevron);

                const body = document.createElement('div');
                body.className = 'tm-sp-group-body' + (defaultOpen ? '' : ' collapsed');

                g.addEventListener('click', (e) => {
                    if (e.target.closest('.tm-sp-help-badge')) return;
                    const isCollapsed = body.classList.toggle('collapsed');
                    g.classList.toggle('collapsed', isCollapsed);
                    chevron.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
                    if (!isCollapsed && onOpen) onOpen();
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
                wrap.style.cssText = 'border-bottom: 1px solid ${C.border};';

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
                        picker.classList.remove('open');
                        arrow.style.transform = '';
                    });
                    picker.appendChild(btn);
                });

                row.addEventListener('click', () => {
                    const isOpen = picker.classList.toggle('open');
                    arrow.style.transform = isOpen ? 'rotate(90deg)' : '';
                    if (featureId && isOpen) markFeatureSeen(featureId);
                });

                wrap.appendChild(row);
                wrap.appendChild(picker);
                return wrap;
            };

            const makeFeedbackPickerRow = (label, options, currentVal, onSelect, featureId = null) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'border-bottom: 1px solid ${C.border};';

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
                    btn.appendChild(demoEl);

                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (featureId) markFeatureSeen(featureId);
                        onSelect(opt.value);
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

                row.addEventListener('click', () => {
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
                });

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

                wrap.appendChild(hdr);
                wrap.appendChild(slider);
                return wrap;
            };

            const showDockSpotlight = () => {
                if (GM_getValue('app_dock_spotlight_done', false)) return;
                GM_setValue('app_dock_spotlight_done', true);

                if (document.getElementById('tm-dock-spotlight')) return;
                const histPanel = document.getElementById('tm-hist-panel');
                if (!histPanel) return;

                const trigL = histPanel.querySelector('.tm-dock-trigger.left');
                const trigR = histPanel.querySelector('.tm-dock-trigger.right');
                if (!trigL && !trigR) return;

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

            const HIST_TOOLTIP = 'Hidden feature: The history panel has invisible dock triggers on its left & right edges. Click them to auto-hide the panel to the screen edge!';
            const grpHist = makeGroup('🗂  History Panel', false, HIST_TOOLTIP, showDockSpotlight);

            const dockStyleOpts = [
                { value: 'ruler', label: '— Ruler  📏' },
                { value: 'ghost', label: '· Ghost' },
                { value: 'notch', label: '| Notch' },
            ];
            grpHist.append(makePickerRow('Dock Style', dockStyleOpts, dockStyle, (next) => {
                GM_setValue(KEY_DOCK_STYLE, next);
                showToast('🗂 Dock Style → ' + (dockStyleOpts.find(o => o.value === next)?.label || next));
                const curTab = document.getElementById('tm-hist-dock-tab');
                if (curTab) { curTab.className = 'style-' + next; curTab.innerHTML = ''; }
                buildContent();
            }, 'sp_dock_picker'));

            grpHist.append(makeSliderRow(
                'Hover Delay', dockHoverDelay, 100, 3000, 50, 'ms',
                null,
                (n) => { GM_setValue(KEY_DOCK_HOVER_DELAY, String(n)); showToast('⏱ Hover Delay → ' + n + ' ms'); },
                'sp_slider_controls'
            ));

            grpHist.append(makeSliderRow(
                'Trigger Distance ◀ Left', dockTriggerL, 20, 300, 5, 'px',
                null,
                (n) => { GM_setValue(KEY_DOCK_TRIGGER_L, String(n)); showToast('◀ Trigger → ' + n + ' px'); },
                'sp_slider_controls'
            ));

            grpHist.append(makeSliderRow(
                'Trigger Distance ▶ Right', dockTriggerR, 20, 300, 5, 'px',
                null,
                (n) => { GM_setValue(KEY_DOCK_TRIGGER_R, String(n)); showToast('▶ Trigger → ' + n + ' px'); },
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
        });

        document.addEventListener('click', e => {
            if (!wrapper.contains(e.target)) {
                wrapper.setAttribute('data-open', 'false');
            }
        });

        wrapper.appendChild(histBtn);
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

    function recordHistory(info, urls) {
        try {
            const thumbUrls = urls.filter(u => !u.includes('.mp4'));
            const hasVideo  = urls.some(u => u.includes('.mp4'));

            if (thumbUrls.length === 0 && info.videoThumb) {
                thumbUrls.push(info.videoThumb);
            }

            const raw = info.date || '';
            let yyyymm = '0000.00';
            if (_cachedDateFormat === 'western') {
                const p = raw.split('.');
                if (p.length === 3) yyyymm = `${p[2]}.${p[1]}`;
            } else {
                yyyymm = raw.slice(0, 7);
            }

            const record = {
                id:          Date.now(),
                ts:          Date.now(),
                yyyymm,
                tweetId:     info.id,
                tweetUrl:    `https://x.com/${info.screenName}/status/${info.id}`,
                tweetDate:   info.date,
                screenName:  info.screenName,
                displayName: info.displayName,
                text:        (info.text || '').slice(0, 80),
                thumbUrls,
                hasVideo,
                count:       urls.length,
            };

            let records = [];
            try { records = JSON.parse(GM_getValue(KEY_HISTORY_RECORDS, '[]')); } catch (_) {}
            const _oldRecord = records.find(r => r.tweetId === info.id);
            if (_oldRecord?.favorited) record.favorited = true;
            records = records.filter(r => r.tweetId !== info.id);
            records.unshift(record);
            if (records.length > HISTORY_MAX_RECORDS) {
                const _overflow = records.slice(HISTORY_MAX_RECORDS).filter(r => r.favorited);
                records = [...records.slice(0, HISTORY_MAX_RECORDS), ..._overflow];
            }
            GM_setValue(KEY_HISTORY_RECORDS, JSON.stringify(records));

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
        const existing = document.getElementById('tm-hist-panel');
        if (existing) {
            if (_dockSideGlobal) {
                existing.dispatchEvent(new CustomEvent('tm-hist-toggle-peek'));
                return;
            }

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
            x: Math.max(8, window.innerWidth - 408),
            y: 60, w: 390, h: 540,
        };
        try {
            const saved = JSON.parse(GM_getValue(KEY_HISTORY_PANEL_POS, 'null'));
            if (saved && typeof saved.x === 'number') {
                pos = {
                    x: Math.min(saved.x, window.innerWidth  - 300),
                    y: Math.min(saved.y, window.innerHeight - 200),
                    w: Math.max(300, Math.min(saved.w || 390, 680)),
                    h: Math.max(280, Math.min(saved.h || 540, window.innerHeight - 80)),
                };
            }
        } catch (_) {}

        let viewMode  = GM_getValue(KEY_HISTORY_VIEW_MODE, 'list');
        let editMode  = false;
        let query     = '';
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
                position: fixed; z-index: 999980;
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
            .tm-hist-url {
                font-size: 10px; color: #1d9bf0;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                cursor: pointer;
            }
            .tm-hist-url:hover { text-decoration: underline; }
            .tm-hist-actions {
                display: flex; flex-direction: row; gap: 1px;
                flex-shrink: 0; align-items: center;
            }
            .tm-hist-act-btn {
                width: 24px; height: 24px; border-radius: 5px; border: none;
                background: transparent; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                color: ${C.sub}; transition: background 0.1s, color 0.1s;
            }
            .tm-hist-act-btn:hover { background: ${C.rowHover}; color: ${C.text}; }
            .tm-hist-act-btn.danger:hover { color: ${C.danger}; }
            .tm-hist-act-btn svg { width: 13px; height: 13px; pointer-events: none; }
            
            .tm-hist-act-btn.tm-fav-active { color: #e0245e; }
            .tm-hist-act-btn.tm-fav-btn:hover { color: #e0245e; }
            .tm-hist-act-btn.tm-fav-btn svg { width: 17px; height: 17px; }
            
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
                overflow: hidden;
                transition: width 0.22s ease, opacity 0.22s ease;
            }
            #tm-hist-dock-tab:hover { width: 9px; }

            
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
            
            .tm-hist-empty {
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
        `;

        const panel = document.createElement('div');
        panel.id = 'tm-hist-panel';
        panel.style.cssText = `left:${pos.x}px; top:${pos.y}px; width:${pos.w}px; height:${pos.h}px;`;

        if (_dockSideGlobal) {
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

        const btnList  = _mkIconBtn(SVG_LIST,  'List mode');
        const btnThumb = _mkIconBtn(SVG_GRID,  'Thumbnail mode');
        const btnEdit  = _mkIconBtn(SVG_EDIT,  'Edit mode');
        const btnExp   = _mkIconBtn(SVG_EXP,   'Export');
        const btnClose = _mkIconBtn(SVG_CLOSE, 'Close');

        titlebar.appendChild(titleIcon);
        titlebar.appendChild(titleEl);
        titlebar.appendChild(countBadge);
        titlebar.appendChild(btnList);
        titlebar.appendChild(btnThumb);
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
            if (!query) return records;
            const q = query.toLowerCase();
            return records.filter(r =>
                r.displayName?.toLowerCase().includes(q) ||
                r.screenName?.toLowerCase().includes(q) ||
                r.text?.toLowerCase().includes(q)
            );
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
            countBadge.textContent = `${records.length} / ${HISTORY_MAX_RECORDS}`;
            delSelBtn.textContent = `Delete selected (${selectedIds.size})`;

            const visibleIds = filtered
                .filter(r => !collapsedGroups.has(r.yyyymm))
                .map(r => r.id);
            const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.has(id));
            selAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';

            body.innerHTML = '';

            if (viewMode === 'list') renderList(filtered);
            else renderThumb(filtered);

            btnList.classList.toggle('active', viewMode === 'list');
            btnThumb.classList.toggle('active', viewMode === 'thumb');
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
                        _openThumbLightbox(rec.thumbUrls, 0, thumbWrap.querySelector('img'));
                    });
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

                const urlEl = document.createElement('div');
                urlEl.className = 'tm-hist-url';
                urlEl.textContent = rec.tweetUrl;
                urlEl.title = rec.tweetUrl + '\n（點擊前往推文）';
                urlEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const path = new URL(rec.tweetUrl).pathname;
                    history.pushState({ tmNav: true }, '', path);
                    window.dispatchEvent(new Event('popstate'));
                });

                info.appendChild(author);
                info.appendChild(textEl);
                info.appendChild(urlEl);
                row.appendChild(info);

                const acts = document.createElement('div');
                acts.className = 'tm-hist-actions';

                const SVG_JUMP    = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10 2h4v4"/><path d="M7 9L14 2"/><path d="M12 10v4H2V4h4"/></svg>`;
                const SVG_DEL     = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="2,4 4,4 14,4"/><path d="M13 4l-.9 9H3.9L3 4"/><path d="M6.5 7v4M9.5 7v4"/><path d="M5.5 4V2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5V4"/></svg>`;
                const SVG_HEART_EMPTY = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.207 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5z"/></svg>`;
                const SVG_HEART_FULL  = `<svg viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13.5S1.5 9.5 1.5 5.5A3.5 3.5 0 0 1 8 3.207 3.5 3.5 0 0 1 14.5 5.5C14.5 9.5 8 13.5 8 13.5z"/></svg>`;

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

                acts.appendChild(favBtn);
                acts.appendChild(jmpBtn);
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

            records.forEach(rec => {
                const cell = document.createElement('div');
                cell.className = 'tm-hist-grid-cell';
                cell.title = `${rec.displayName} @${rec.screenName}`;

                if (rec.thumbUrls && rec.thumbUrls.length > 0) {
                    const img = document.createElement('img');
                    img.src = _thumbUrl(rec.thumbUrls[0]);
                    img.loading = 'lazy';
                    img.alt = '';
                    cell.appendChild(img);
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

                cell.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const path = new URL(rec.tweetUrl).pathname;
                    history.pushState({ tmNav: true }, '', path);
                    window.dispatchEvent(new Event('popstate'));
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

        function _openThumbLightbox(urls, startIdx, originEl) {
            document.getElementById('tm-thumb-lb-backdrop')?.remove();

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

        btnList.addEventListener('click', () => { viewMode = 'list'; GM_setValue(KEY_HISTORY_VIEW_MODE, 'list'); render(); });
        btnThumb.addEventListener('click', () => { viewMode = 'thumb'; GM_setValue(KEY_HISTORY_VIEW_MODE, 'thumb'); render(); });
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

        let _expState = 0;
        btnExp.addEventListener('click', () => {
            _expState = (_expState + 1) % 3;
            if      (_expState === 1) _exportCSV();
            else if (_expState === 2) _exportJSON();
            else _expState = 0;
        });
        btnExp.title = 'Export CSV (click once) / JSON (click twice)';

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
            const nh = Math.max(280, Math.min(_rsh + (e.clientY - _rsy), window.innerHeight - 80));
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
            tab.className = 'style-' + style;
            tab.style.cssText = [
                'top:'    + top + 'px',
                'height:' + h   + 'px',
                side === 'left' ? 'left:2px' : 'right:2px',
            ].join(';');

            const hotzone = document.createElement('div');
            hotzone.style.cssText = [
                'position:absolute',
                'top:0',
                'height:100%',
                'width:' + triggerDist + 'px',
                side === 'left'
                    ? 'left:0'
                    : 'right:0',
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
            clearTimeout(_dockRetractTimerGlobal);
            _dockRetractTimerGlobal = setTimeout(() => _retract(), 120);
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

        if (_dockSideGlobal) {
            requestAnimationFrame(() => {
                const side = _dockSideGlobal;
                _dockSideGlobal = null;
                _dock(side);

                requestAnimationFrame(() => {
                    panel.style.transition = '';
                    panel.style.opacity = '';
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

    function showFloatingVideoPlayer(videoUrls, startIndex = 0, imageUrls = null) {
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
            background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
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
            viewImgBtn.innerHTML = '🖼️ Images';
            viewImgBtn.style.cssText = `
                position: absolute; top: 20px; right: 75px;
                background: rgba(29,155,240,0.8); color: white; border: none;
                padding: 6px 16px; border-radius: 9999px;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s; z-index: 4; font: 13px/1.5 system-ui, sans-serif;
            `;
            viewImgBtn.onmouseenter = () => viewImgBtn.style.background = 'rgba(29,155,240,1)';
            viewImgBtn.onmouseleave = () => viewImgBtn.style.background = 'rgba(29,155,240,0.8)';
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
                prevBtn.style.opacity = currentIndex === 0         ? '0.3' : '1';
                nextBtn.style.opacity = currentIndex === total - 1 ? '0.3' : '1';
                prevBtn.style.pointerEvents = currentIndex === 0         ? 'none' : 'auto';
                nextBtn.style.pointerEvents = currentIndex === total - 1 ? 'none' : 'auto';
            }
        }

        prevBtn.onclick = e => { e.stopPropagation(); if (currentIndex > 0)          { currentIndex--; updatePlayer(); } };
        nextBtn.onclick = e => { e.stopPropagation(); if (currentIndex < total - 1)  { currentIndex++; updatePlayer(); } };

        const closeModal = () => {
            modal.classList.remove('tm-vp-visible');
            video.pause();
            setTimeout(() => {
                modal.remove();
            }, 220);
            document.removeEventListener('keydown', keyHandler);
        };

        closeBtn.onclick = closeModal;
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };

        const keyHandler = (e) => {
            if (e.key === 'Escape') { closeModal(); return; }
            if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIndex < total - 1) { currentIndex++; updatePlayer(); }
            if ((e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   && currentIndex > 0)         { currentIndex--; updatePlayer(); }
        };
        document.addEventListener('keydown', keyHandler);

        modal.appendChild(video);
        modal.appendChild(closeBtn);
        if (viewImgBtn) modal.appendChild(viewImgBtn);
        modal.appendChild(counter);
        if (total > 1) { modal.appendChild(prevBtn); modal.appendChild(nextBtn); }
        document.body.appendChild(modal);

        updatePlayer();
        requestAnimationFrame(() => requestAnimationFrame(() => {
            modal.classList.add('tm-vp-visible');
        }));
    }

    function showImageLightbox(urls, videoUrls = null) {
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
                
                #tm-image-lightbox .tm-lb-card { box-shadow: 0 12px 36px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07); }
                #tm-image-lightbox .tm-lb-card.tm-lb-focused { box-shadow: 0 28px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.18); }
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

        function closeLightbox() {
            modal.classList.remove('tm-lb-in');
            setTimeout(() => { modal.remove(); }, 220);
            document.removeEventListener('keydown', keyHandler);
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
            modal.onclick = e => { if (e.target === modal || e.target === container) closeLightbox(); };
            modal.appendChild(closeBtn);

            if (videoUrls && videoUrls.length) {
                const viewVidBtn = document.createElement('button');
                viewVidBtn.innerHTML = '▶️ Videos';
                viewVidBtn.style.cssText = `
                    position: absolute; top: 20px; right: 75px;
                    background: rgba(29,155,240,0.8); color: white; border: none;
                    padding: 6px 16px; border-radius: 9999px;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s; z-index: 30; font: 13px/1.5 system-ui, sans-serif;
                `;
                viewVidBtn.onmouseenter = () => viewVidBtn.style.background = 'rgba(29,155,240,1)';
                viewVidBtn.onmouseleave = () => viewVidBtn.style.background = 'rgba(29,155,240,0.8)';
                viewVidBtn.onclick = e => { e.stopPropagation(); closeLightbox(); showFloatingVideoPlayer(videoUrls, 0, urls); };
                modal.appendChild(viewVidBtn);
            }

            const keyHandler = e => { if (e.key === 'Escape') closeLightbox(); };
            document.addEventListener('keydown', keyHandler);
            document.body.appendChild(modal);

            requestAnimationFrame(() => requestAnimationFrame(() => {
                modal.classList.add('tm-lb-in');
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
                cursor: pointer;
                transform: translateY(${VH * 0.6}px) scale(0.72) translateZ(0);
                opacity: 0;
                z-index: ${i};
            `;
            const img = document.createElement('img');
            img.src = url;
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
                if (i === focused) return;
                focused = i;
                scheduleUpdate();
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
                background: rgba(255,255,255,0.35); cursor: pointer;
                transition: background 0.22s, transform 0.22s;
            `;
            dot.addEventListener('click', e => { e.stopPropagation(); focused = i; scheduleUpdate(); });
            dotsWrap.appendChild(dot);
            return dot;
        });

        const counter = document.createElement('div');
        counter.style.cssText = `
            position: absolute; top: 20px; left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
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
        modal.onclick = e => { if (e.target === modal) closeLightbox(); };

        const viewVidBtn = videoUrls && videoUrls.length ? document.createElement('button') : null;
        if (viewVidBtn) {
            viewVidBtn.innerHTML = '▶️ Videos';
            viewVidBtn.style.cssText = `
                position: absolute; top: 20px; right: 75px;
                background: rgba(29,155,240,0.8); color: white; border: none;
                padding: 6px 16px; border-radius: 9999px;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s; z-index: 30; font: 13px/1.5 system-ui, sans-serif;
            `;
            viewVidBtn.onmouseenter = () => viewVidBtn.style.background = 'rgba(29,155,240,1)';
            viewVidBtn.onmouseleave = () => viewVidBtn.style.background = 'rgba(29,155,240,0.8)';
            viewVidBtn.onclick = e => { e.stopPropagation(); closeLightbox(); showFloatingVideoPlayer(videoUrls, 0, urls); };
        }

        const keyHandler = e => {
            if (e.key === 'Escape') { closeLightbox(); return; }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { focused = Math.min(focused + 1, total - 1); scheduleUpdate(); }
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { focused = Math.max(focused - 1, 0);         scheduleUpdate(); }
        };
        document.addEventListener('keydown', keyHandler);

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
                card.style.zIndex    = zIndex;
                card.style.opacity   = opacity;
                card.style.cursor    = isFocused ? 'default' : 'pointer';
                card.classList.toggle('tm-lb-focused', isFocused);
            });
            dots.forEach((dot, i) => {
                dot.style.background = i === focused ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)';
                dot.style.transform  = i === focused ? 'scale(1.4)' : 'scale(1)';
            });
            counter.textContent = `${focused + 1} / ${total}`;
        }

        modal.appendChild(stage);
        modal.appendChild(closeBtn);
        if (viewVidBtn) modal.appendChild(viewVidBtn);
        if (total > 1) { modal.appendChild(dotsWrap); modal.appendChild(counter); }
        document.body.appendChild(modal);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            modal.classList.add('tm-lb-in');

            cards.forEach((card, i) => {
                const delay = i * 55;
                setTimeout(() => {
                    card.style.transition = `
                        transform 0.42s cubic-bezier(0.22,1,0.36,1) ${delay}ms,
                        opacity   0.28s ease ${delay}ms
                    `;
                    card.style.transform = `translateX(0) rotate(0deg) scale(1) translateZ(0)`;
                    card.style.opacity   = '1';
                    card.style.zIndex    = 20 - Math.abs(i);
                }, 0);
            });

            const totalStagger = (total - 1) * 55 + 420;
            setTimeout(() => {
                cards.forEach(card => card.classList.add('tm-lb-animated'));
                _flushUpdate();
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
            }
        } catch (_) {}
    }

    (function _interceptFetch() {
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
    const _fiberImageCache = new WeakMap();

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
        try {
            let cookies = {};
            document.cookie.split(';').forEach(c => {
                let [k, v] = c.split('=');
                if (k && v) cookies[k.trim()] = v.trim();
            });

            const AUTH_TOKEN = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
            const variables = {"tweetId":statusId,"with_rux_injections":false,"includePromotedContent":true,"withCommunity":true,"withQuickPromoteEligibilityTweetFields":true,"withBirdwatchNotes":true,"withVoice":true,"withV2Timeline":true};
            const features = {"articles_preview_enabled":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"freedom_of_speech_not_reach_fetch_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"view_counts_everywhere_api_enabled":true};

            let url = `https://${location.hostname}/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;

            let headers = { 'authorization': AUTH_TOKEN, 'x-twitter-active-user': 'yes' };
            if (cookies.ct0) headers['x-csrf-token'] = cookies.ct0;
            if (cookies.gt) headers['x-guest-token'] = cookies.gt;

            let res = await fetch(url, { headers });
            if (!res.ok) return null;
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

            const getSilentText = () => silentText || extra;

            if (state === 'default') {
                btn.innerHTML = SVG_FILM;
            } else if (state === 'dl') {
                btn.innerHTML = SVG_DL;
            } else if (state === 'ok') {
                if (fbStyle === 'silent') {
                    setTextMode(getSilentText() || 'Copied');
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
        btn.addEventListener('mousedown', async (e) => {
            e.preventDefault(); e.stopPropagation();

            if (e.button === 0) {
                timer = setTimeout(async () => {
                    const urls = await extractMediaUrls(article);
                    if (!urls.length) return;
                    const prefix = GM_getValue(KEY_PREFIX_TEXT, '[text]');
                    const txt = urls.map(u => `${prefix}(${u})`).join('\n');
                    GM_setClipboard(txt);
                    setMediaIcon('ok', T.msg_prefix_copied, 'Prefix Copied', 'prefix');
                    setTimeout(() => setMediaIcon('default'), 1500);
                    timer = null;
                }, 500);

            } else if (e.button === 1) {
                const videos = await extractVideoUrl(article);
                const allUrls = await extractMediaUrls(article);
                const imgUrls = allUrls.filter(u => !u.includes('.mp4'));

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
        btn.addEventListener('mouseleave', () => { if (timer) { clearTimeout(timer); timer = null; } });
        btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });

        btn.addEventListener('contextmenu', async (e) => {
            e.preventDefault(); e.stopPropagation();
            const urls = await extractMediaUrls(article);
            if (urls.length === 0) return;

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
                recordHistory(info, urls);
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

                if (state === 'ok') {
                    if (fbStyle === 'silent') {
                        setTextMode(silentText || extra || 'Copied');
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

    setInterval(scanAndInsert, 1500);

    setTimeout(scanAndInsert, 1000);
})();