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
// @namespace    https://github.com/Startanuki07
// @version      1.4.2
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
// @description      Adds a 🎞️ media button and a 🔗 link button to every tweet. The media button copies image/video URLs or downloads files with structured filenames; long-press attaches a custom prefix in Markdown link format. The link button copies the tweet URL; long-press switches to an embed-friendly domain (e.g. vxtwitter, fixupx). Configurable via the userscript manager menu.
// @description:zh-TW 在每則推文注入 🎞️ 媒體按鈕與 🔗 連結按鈕。媒體按鈕可複製圖片／影片連結或以結構化檔名下載；長按可附加自訂前綴（Markdown 連結格式）。連結按鈕複製推文網址；長按切換為 vxtwitter、fixupx 等可嵌入域名。可透過腳本管理器選單設定。
// @description:zh-CN 为每条推文添加 🎞️ 媒体按钮和 🔗 链接按钮。媒体按钮可复制图片/视频链接或以结构化文件名下载；长按可附加自定义前缀（Markdown 链接格式）。链接按钮复制推文网址；长按切换为 vxtwitter、fixupx 等可嵌入域名。可通过脚本管理器菜单配置。
// @description:ja    各ツイートに 🎞️ メディアボタンと 🔗 リンクボタンを追加。メディアボタンは画像/動画URLのコピーや構造化ファイル名でのダウンロードに対応し、長押しでMarkdownリンク形式のカスタムプレフィックスを付加。リンクボタンはツイートURLをコピーし、長押しでvxtwitter・fixupxなど埋め込み対応ドメインに切替。スクリプトマネージャーのメニューから設定可能。
// @description:ko    모든 트윗에 🎞️ 미디어 버튼과 🔗 링크 버튼을 추가합니다. 미디어 버튼은 이미지/동영상 URL 복사 및 구조화 파일명으로 다운로드를 지원하며, 길게 누르면 Markdown 링크 형식의 커스텀 접두사를 첨부합니다. 링크 버튼은 트윗 URL을 복사하고, 길게 누르면 vxtwitter·fixupx 등 임베드 도메인으로 전환합니다. 스크립트 관리자 메뉴에서 설정 가능.
// @description:es    Agrega un botón 🎞️ de medios y un botón 🔗 de enlace a cada tweet. El botón de medios copia URLs de imágenes/videos o descarga archivos con nombres estructurados; mantenga presionado para adjuntar un prefijo personalizado en formato Markdown.
// @description:pt-BR Adiciona um botão 🎞️ de mídia e um botão 🔗 de link a cada tweet. O botão de mídia copia URLs de imagens/vídeos ou baixa arquivos com nomes estruturados; pressione longo para anexar um prefixo personalizado no formato Markdown.
// @description:fr    Ajoute un bouton 🎞️ média et un bouton 🔗 lien à chaque tweet. Le bouton média copie les URLs d'images/vidéos ou télécharge les fichiers avec des noms structurés ; appui long pour joindre un préfixe personnalisé en format Markdown.
// @description:ru    Добавляет кнопку 🎞️ медиа и кнопку 🔗 ссылки к каждому твиту. Кнопка медиа копирует URL изображений/видео или скачивает файлы со структурированными именами; долгое нажатие добавляет префикс в формате Markdown. Кнопка ссылки копирует URL твита; долгое нажатие переключает домен на vxtwitter, fixupx и др.
// ==/UserScript==

(function () {
    'use strict';

    const KEY_PREFIX_TEXT = 'discord_prefix_text';
    const KEY_LANG = 'app_language';
    const KEY_LINK_DOMAIN_LONG = 'app_link_domain_long';
    const KEY_LINK_DOMAIN_CLICK = 'app_link_domain_click';
    const KEY_CLICK_MODE_CUSTOM = 'app_link_click_mode_custom';
    const KEY_DATE_FORMAT = 'app_date_format';
    const KEY_CUSTOM_LANG = 'app_custom_lang_json';
    const KEY_VIDEO_VOLUME = 'app_video_volume';
    const KEY_ONBOARDING_DONE = 'app_onboarding_done';

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
                • <b>Left Click:</b> Copy media links.<br>
                • <b>Long Press (0.5s):</b> Copy links with custom prefix (for Discord).<br>
                • <b>Right Click:</b> Force download media files.<br>
                  (Name format: <code>[twitter] Name(@ID)_Date_Text_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Link Button (🔗):</b><br>
                • <b>Click:</b> Copy link (Default: x.com, or Custom Domain).<br>
                • <b>Long Press:</b> Copy link with custom prefix + Long-Press Domain.<br>
                (Configure domains in the script manager menu).</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Disclaimer:</b><br>
                The custom link domains (e.g., fixupx, vxtwitter) are third-party services not affiliated with this script. Please ensure you trust them before use.</p>
            `,
            onboard_title: '⚙ Settings Panel',
            onboard_body:  'Hover the top-right corner to reveal the settings button. Click it to quickly manage domains, prefix, language and more — no script manager menu needed.',
            onboard_got_it: 'Got it!',
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
            help_title: '推特媒體複製按鈕 - 說明書',
            help_content: `
                <p><b>🖱️ 媒體按鈕 (🎞️)：</b><br>
                • <b>左鍵點擊：</b> 複製該推文的媒體連結。<br>
                • <b>長按 (0.5秒)：</b> 複製包含「自定義前綴」的連結 (方便 Discord 使用)。<br>
                • <b>右鍵點擊：</b> 強制下載推文內所有圖片/影片。<br>
                  (檔名格式：<code>[twitter] 暱稱(@ID)_日期_內文_ID.檔名</code>)</p>
                <hr>
                <p><b>🔗 連結按鈕 (🔗)：</b><br>
                • <b>單擊：</b> 複製連結 (可設定為 x.com 或 自定義域名)。<br>
                • <b>長按：</b> 複製帶自定義前綴的「長按專用」域名連結。<br>
                (請至腳本管理器選單進行設定)。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免責聲明：</b><br>
                列表中的轉換網址（如 fixupx, vxtwitter 等）皆為第三方服務，與本腳本無關。請自行評估風險，並僅使用您信任的網址。</p>
            `,
            onboard_title: '⚙ 設定面板',
            onboard_body:  '將滑鼠移至右上角即可叫出設定按鈕，點擊後可快速管理域名、前綴、語言等設定，無需開啟腳本管理器選單。',
            onboard_got_it: '知道了！',
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
            help_title: '推特媒体复制按钮 - 说明书',
            help_content: `
                <p><b>🖱️ 媒体按钮 (🎞️)：</b><br>
                • <b>左键点击：</b> 复制该推文的媒体链接。<br>
                • <b>长按 (0.5秒)：</b> 复制包含“自定义前缀”的链接。<br>
                • <b>右键点击：</b> 强制下载推文内所有图片/视频。<br>
                  (文件名格式：<code>[twitter] 昵称(@ID)_日期_内文_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 链接按钮 (🔗)：</b><br>
                • <b>单击：</b> 复制链接 (默认：x.com，或自定义域名)。<br>
                • <b>长按：</b> 复制带自定义前缀的<b>长按专用</b>域名链接 (如 fixupx)。<br>
                (请至脚本管理器菜单进行设置)。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免责声明：</b><br>
                列表中的转换网址（如 fixupx, vxtwitter 等）皆为第三方服务，与本脚本无关。请自行评估风险，并仅使用您信任的网址。</p>
            `,
            onboard_title: '⚙ 设置面板',
            onboard_body:  '将鼠标移到右上角即可呼出设置按钮，点击后可快速管理域名、前缀、语言等设置，无需打开脚本管理器菜单。',
            onboard_got_it: '知道了！',
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
            help_title: 'Twitterメディアコピー - 説明書',
            help_content: `
                <p><b>🖱️ メディアボタン (🎞️)：</b><br>
                • <b>左クリック：</b> メディアリンクをコピー。<br>
                • <b>長押し (0.5秒)：</b> 「カスタムプレフィックス」付きでコピー (Discord用)。<br>
                • <b>右クリック：</b> 画像・動画を強制ダウンロード。<br>
                  (ファイル名：<code>[twitter] 名前(@ID)_日付_本文_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 リンクボタン (🔗)：</b><br>
                • <b>クリック：</b> 元の <code>x.com</code> リンクをコピー。<br>
                • <b>長押し：</b> <b>カスタムドメイン</b>で「カスタムプレフィックス」付きコピー (例: fixupx)。<br>
                (スクリプト管理メニューからドメインを変更できます)。</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 免責事項：</b><br>
                リストにある変換URL（fixupx, vxtwitterなど）はサードパーティのサービスであり、このスクリプトとは無関係です。リスクを自己評価し、信頼できるドメインのみを使用してください。</p>
            `,
            onboard_title: '⚙ 設定パネル',
            onboard_body:  '右上隅にカーソルを合わせると設定ボタンが現れます。クリックすればスクリプト管理器を開かずにドメイン・プレフィックス・言語などをすばやく管理できます。',
            onboard_got_it: 'わかった！',
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
            help_title: '트위터 미디어 복사 버튼 - 설명서',
            help_content: `
                <p><b>🖱️ 미디어 버튼 (🎞️):</b><br>
                • <b>왼쪽 클릭:</b> 미디어 링크 복사.<br>
                • <b>길게 누르기 (0.5초):</b> "사용자 지정 접두사" 포함 복사.<br>
                • <b>오른쪽 클릭:</b> 모든 미디어 강제 다운로드.<br>
                  (파일 이름: <code>[twitter] 이름(@ID)_날짜_내용_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 링크 버튼 (🔗):</b><br>
                • <b>클릭:</b> 원본 <code>x.com</code> 링크 복사.<br>
                • <b>길게 누르기:</b> <b>사용자 지정 도메인</b>에서 「사용자 지정 접두사」 포함 복사 (예: fixupx).<br>
                (스크립트 관리자 메뉴에서 설정을 변경할 수 있습니다).</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ 면책 조항:</b><br>
                목록의 변환 URL(예: fixupx, vxtwitter)은 본 스크립트와 무관한 타사 서비스입니다. 위험을 스스로 평가하고 신뢰할 수 있는 도메인만 사용하십시오.</p>
            `,
            onboard_title: '⚙ 설정 패널',
            onboard_body:  '오른쪽 상단 모서리에 마우스를 올리면 설정 버튼이 나타납니다. 클릭하면 스크립트 관리자 없이 도메인, 접두사, 언어 등을 빠르게 관리할 수 있습니다.',
            onboard_got_it: '알겠어요!',
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
                • <b>Clic izquierdo:</b> Copiar enlaces de medios.<br>
                • <b>Pulsación larga (0.5s):</b> Copiar con prefijo personalizado (para Discord).<br>
                • <b>Clic derecho:</b> Forzar descarga de medios.<br>
                  (Formato: <code>[twitter] Nombre(@ID)_Fecha_Texto_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Botón de enlace (🔗):</b><br>
                • <b>Clic:</b> Copiar enlace (predeterminado: x.com o dominio personalizado).<br>
                • <b>Pulsación larga:</b> Copiar con dominio personalizado e incluir prefijo personalizado (ej. fixupx).<br>
                (Configura los dominios en el menú del administrador de scripts).</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Aviso legal:</b><br>
                Los dominios de conversión (ej. fixupx, vxtwitter) son servicios de terceros sin relación con este script.</p>
            `,
            onboard_title: '⚙ Panel de Configuración',
            onboard_body:  'Mueve el cursor a la esquina superior derecha para revelar el botón de configuración. Haz clic para gestionar dominios, prefijo, idioma y más sin abrir el administrador de scripts.',
            onboard_got_it: '¡Entendido!'
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
                • <b>Clique esquerdo:</b> Copiar links de mídia.<br>
                • <b>Pressão longa (0.5s):</b> Copiar com prefixo personalizado (para Discord).<br>
                • <b>Clique direito:</b> Forçar download de mídia.<br>
                  (Formato: <code>[twitter] Nome(@ID)_Data_Texto_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Botão de link (🔗):</b><br>
                • <b>Clique:</b> Copiar link (padrão: x.com ou domínio personalizado).<br>
                • <b>Pressão longa:</b> Copiar com domínio de pressão longa incluindo prefixo personalizado.<br>
                (Configure os domínios no menu do gerenciador de scripts).</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Aviso legal:</b><br>
                Os domínios de conversão (ex. fixupx, vxtwitter) são serviços de terceiros sem relação com este script.</p>
            `,
            onboard_title: '⚙ Painel de Configurações',
            onboard_body:  'Passe o mouse no canto superior direito para revelar o botão de configurações. Clique para gerenciar domínios, prefixo, idioma e mais sem abrir o gerenciador de scripts.',
            onboard_got_it: 'Entendi!'
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
                • <b>Clic gauche :</b> Copier les liens médias.<br>
                • <b>Appui long (0.5s) :</b> Copier avec préfixe personnalisé (pour Discord).<br>
                • <b>Clic droit :</b> Forcer le téléchargement des médias.<br>
                  (Format : <code>[twitter] Nom(@ID)_Date_Texte_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Bouton lien (🔗) :</b><br>
                • <b>Clic :</b> Copier le lien (par défaut : x.com ou domaine personnalisé).<br>
                • <b>Appui long :</b> Copier avec domaine d'appui long en incluant le préfixe personnalisé.<br>
                (Configurez les domaines dans le menu du gestionnaire de scripts).</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Avertissement :</b><br>
                Les domaines de conversion (ex. fixupx, vxtwitter) sont des services tiers sans lien avec ce script.</p>
            `,
            onboard_title: '⚙ Panneau de Paramètres',
            onboard_body:  'Survolez le coin supérieur droit pour afficher le bouton de paramètres. Cliquez pour gérer les domaines, le préfixe, la langue et plus en utilisant le panneau de paramètres intégré.',
            onboard_got_it: "Compris !"
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
                • <b>Левый клик:</b> Копировать медиа-ссылки.<br>
                • <b>Долгое нажатие (0.5с):</b> Копировать с пользовательским префиксом (для Discord).<br>
                • <b>Правый клик:</b> Принудительно скачать все медиафайлы.<br>
                  (Формат имени: <code>[twitter] Имя(@ID)_Дата_Текст_ID.ext</code>)</p>
                <hr>
                <p><b>🔗 Кнопка ссылки (🔗):</b><br>
                • <b>Клик:</b> Копировать ссылку (по умолчанию: x.com или пользовательский домен).<br>
                • <b>Долгое нажатие:</b> Копировать ссылку с доменом долгого нажатия, включая пользовательский префикс.<br>
                (Настройте домены в меню менеджера скриптов).</p>
                <hr>
                <p style="color: #e0245e; font-size: 0.9em;"><b>⚠️ Отказ от ответственности:</b><br>
                Домены конвертации (fixupx, vxtwitter и др.) — сторонние сервисы, не связанные с этим скриптом. Используйте только те домены, которым доверяете.</p>
            `,
            onboard_title: '⚙ Панель настроек',
            onboard_body:  'Наведите курсор в правый верхний угол, чтобы показать кнопку настроек. Нажмите для быстрого управления доменами, префиксом, языком и другими параметрами.',
            onboard_got_it: 'Понятно!',
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
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute; top: 10px; right: 12px; border: none; background: none;
            font-size: 16px; cursor: pointer; color: ${C.sub}; line-height: 1;
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
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute; top: 12px; right: 14px; border: none; background: none;
            font-size: 15px; cursor: pointer; color: ${C.sub}; line-height: 1; padding: 2px 6px;
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
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute; top: 12px; right: 14px; border: none; background: none;
            font-size: 16px; cursor: pointer; color: ${C.sub}; line-height: 1;
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
                statusLine.innerHTML = `★ Active: <b>${parsed.langName || 'Custom'}</b>`;
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
                GM_setValue(key, input.trim());
                return true;
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

        const longDomain = GM_getValue(KEY_LINK_DOMAIN_LONG, 'fixupx.com');
        menuIds.push(GM_registerMenuCommand(T.menu_domain_long + ` [${longDomain}]`, () => {
            if (selectDomain(KEY_LINK_DOMAIN_LONG)) {
                const newDomain = GM_getValue(KEY_LINK_DOMAIN_LONG, 'fixupx.com');
                showToast(T.toast_domain_long + newDomain);
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
    _initSettingsPanel();
    setTimeout(showOnboardingOverlay, 1200);

    function showOnboardingOverlay() {
        if (GM_getValue(KEY_ONBOARDING_DONE, false)) return;

        const gearEl = document.getElementById('tm-settings-gear-btn');
        if (!gearEl) { setTimeout(showOnboardingOverlay, 400); return; }

        const rect = gearEl.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const r1   = 26;
        const r2   = 42;

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
        ring.style.cssText = `width:${r1 * 2}px; height:${r1 * 2}px; left:${cx}px; top:${cy}px;`;

        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const cardBg   = dark ? '#16202b' : '#ffffff';
        const cardText = dark ? '#e7e9ea' : '#0f1419';
        const cardSub  = dark ? '#8b98a5' : '#536471';
        const arrowClr = dark ? '#16202b' : '#ffffff';
        const cardW    = 270;
        const cardRight = Math.max(8, window.innerWidth - cx - 18);
        const cardTop   = cy + r2 + 10;

        const card = document.createElement('div');
        card.id = 'tm-ob-card';
        card.style.cssText = `
            width:${cardW}px; right:${cardRight}px; top:${cardTop}px;
            background:${cardBg}; border-radius:14px;
            box-shadow:0 8px 32px rgba(0,0,0,0.32);
            padding:18px 18px 14px;
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

        const currentVal = GM_getValue(key, key === KEY_LINK_DOMAIN_LONG ? 'fixupx.com' : 'x.com');

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
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `position:absolute;top:12px;right:14px;border:none;
            background:none;font-size:15px;cursor:pointer;color:${C.sub};`;
        closeBtn.onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };

        const title = document.createElement('h3');
        title.textContent = key === KEY_LINK_DOMAIN_LONG
            ? T.menu_domain_long.replace(/^🔗\s*/, '')
            : T.menu_domain_click.replace(/^🔗\s*/, '');
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
            gearBg:    'rgba(255,255,255,0.07)',
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
                position: fixed; top: 8px; right: 8px; z-index: 999990;
            }
            #tm-settings-gear-btn {
                width: 36px; height: 36px; border-radius: 50%; border: none;
                background: transparent; cursor: pointer; padding: 6px;
                display: flex; align-items: center; justify-content: center;
                opacity: 0;
                transition: opacity 0.28s ease, background 0.15s ease;
                color: ${C.gearFg};
            }
            #tm-settings-wrapper:hover #tm-settings-gear-btn { opacity: 0.7; }
            #tm-settings-gear-btn:hover { opacity: 1 !important; background: ${C.gearBg} !important; }
            #tm-settings-gear-btn svg {
                width: 20px; height: 20px; display: block;
                transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1);
            }
            #tm-settings-gear-btn[data-open="true"] svg { transform: rotate(90deg); }
            #tm-settings-panel {
                position: absolute; top: calc(100% + 4px); right: 0;
                width: 300px;
                background: ${C.panel};
                border-radius: 14px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10);
                border: 1px solid ${C.border};
                font-family: system-ui, -apple-system, sans-serif;
                overflow: hidden;
                transform-origin: top right;
                transform: scale(0.88) translateY(-8px); opacity: 0;
                transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
                            opacity 0.18s ease;
                pointer-events: none;
            }
            #tm-settings-panel[data-open="true"] {
                transform: scale(1) translateY(0); opacity: 1;
                pointer-events: all;
            }
            .tm-sp-header {
                display: flex; align-items: center;
                padding: 11px 14px 10px;
                background: ${C.header};
                border-bottom: 1px solid ${C.border};
                font-size: 12px; font-weight: 700; color: ${C.sub};
                letter-spacing: 0.04em; text-transform: uppercase;
            }
            .tm-sp-row {
                display: flex; align-items: center; justify-content: space-between;
                padding: 9px 14px; gap: 8px;
                border-bottom: 1px solid ${C.border};
                cursor: pointer;
                transition: background 0.1s;
            }
            .tm-sp-row:last-child { border-bottom: none; }
            .tm-sp-row:hover { background: ${C.rowHover}; }
            .tm-sp-row-left { display:flex; flex-direction:column; gap:1px; min-width:0; }
            .tm-sp-row-label { font-size: 12px; color: ${C.sub}; white-space: nowrap; }
            .tm-sp-row-value {
                font-size: 13px; color: ${C.text}; font-weight: 500;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
            .tm-sp-arrow {
                font-size: 11px; color: ${C.sub}; flex-shrink: 0;
                margin-left: 4px; opacity: 0.5;
            }
        `;
        document.head.appendChild(panelStyle);

        const SVG_GEAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>`;

        const wrapper = document.createElement('div');
        wrapper.id = 'tm-settings-wrapper';

        const gearBtn = document.createElement('button');
        gearBtn.id = 'tm-settings-gear-btn';
        gearBtn.innerHTML = SVG_GEAR;
        gearBtn.title = '⚙️ Twitter Media Script Settings';
        gearBtn.setAttribute('data-open', 'false');

        const panel = document.createElement('div');
        panel.id = 'tm-settings-panel';
        panel.setAttribute('data-open', 'false');

        function buildContent() {
            panel.innerHTML = '';

            const clickCustom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false);
            const clickDomain = GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com');
            const prefix      = GM_getValue(KEY_PREFIX_TEXT, '[text]');
            const fmt         = GM_getValue(KEY_DATE_FORMAT, 'asian');

            const header = document.createElement('div');
            header.className = 'tm-sp-header';
            header.textContent = '⚙ Media Script Settings';
            panel.appendChild(header);

            const makeRow = (label, value, onClick) => {
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
                const arrow = document.createElement('span');
                arrow.className = 'tm-sp-arrow';
                arrow.textContent = '›';
                left.appendChild(lbl);
                left.appendChild(val);
                row.appendChild(left);
                row.appendChild(arrow);
                row.addEventListener('click', onClick);
                panel.appendChild(row);
            };

            const clickLabel = T.menu_domain_click.replace(/^🔗\s*/, '');
            const clickVal   = clickCustom ? clickDomain : 'x.com (default)';
            makeRow('🔗 ' + clickLabel, clickVal, () => {
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
            });

            makeRow('⚙️ Discord Prefix', prefix || '(empty)', () => {
                const newPrefix = prompt(T.prompt_prefix, prefix);
                if (newPrefix !== null) {
                    GM_setValue(KEY_PREFIX_TEXT, newPrefix);
                    showToast(T.toast_prefix + (newPrefix || '(empty)'));
                    registerMenus(); buildContent();
                }
            });

            const fmtLabel = T.menu_date_format.replace(/^📅\s*/, '');
            const fmtVal   = fmt === 'western' ? T.status_date_western : T.status_date_asian;
            makeRow('📅 ' + fmtLabel, fmtVal, () => {
                const newFmt = fmt === 'western' ? 'asian' : 'western';
                GM_setValue(KEY_DATE_FORMAT, newFmt);
                const newLabel = newFmt === 'western' ? T.status_date_western : T.status_date_asian;
                showToast(T.toast_date_fmt + newLabel);
                registerMenus(); buildContent();
            });

            const langLabel = T.menu_lang.replace(/^🌐\s*/, '').replace(/\s*\(Change Language\)/i, '').trim();
            makeRow('🌐 ' + langLabel, T.langName, () => {
                showLangPickerModal();
            });

            const helpLabel = T.menu_help.replace(/^📖\s*/, '');
            makeRow('📖 ' + helpLabel, '', () => {
                showHelpModal();
            });
        }

        buildContent();

        gearBtn.addEventListener('click', e => {
            e.stopPropagation();
            const isOpen = panel.getAttribute('data-open') === 'true';
            const next   = String(!isOpen);
            panel.setAttribute('data-open', next);
            gearBtn.setAttribute('data-open', next);
        });

        document.addEventListener('click', e => {
            if (!wrapper.contains(e.target)) {
                panel.setAttribute('data-open', 'false');
                gearBtn.setAttribute('data-open', 'false');
            }
        });

        wrapper.appendChild(gearBtn);
        wrapper.appendChild(panel);
        document.body.appendChild(wrapper);
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

        const modal = document.createElement('div');
        modal.id = 'tm-floating-video-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.95); z-index: 9999999;
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
            transform: translateZ(0); will-change: transform;
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
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute; top: 20px; right: 25px;
            background: rgba(0,0,0,0.6); color: white; border: none;
            font-size: 20px; width: 40px; height: 40px; border-radius: 50%;
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
                background: rgba(29, 155, 240, 0.8); color: white; border: none;
                padding: 6px 16px; border-radius: 9999px;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s; z-index: 4; font: 13px/1.5 system-ui, sans-serif;
            `;
            viewImgBtn.onmouseenter = () => viewImgBtn.style.background = 'rgba(29, 155, 240, 1)';
            viewImgBtn.onmouseleave = () => viewImgBtn.style.background = 'rgba(29, 155, 240, 0.8)';
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

        prevBtn.onclick = e => {
            e.stopPropagation();
            if (currentIndex > 0) { currentIndex--; updatePlayer(); }
        };
        nextBtn.onclick = e => {
            e.stopPropagation();
            if (currentIndex < total - 1) { currentIndex++; updatePlayer(); }
        };

        const closeModal = () => {
            video.pause();
            modal.remove();
            document.removeEventListener('keydown', keyHandler);
        };

        closeBtn.onclick = closeModal;
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };

        const keyHandler = (e) => {
            if (e.key === 'Escape') { closeModal(); return; }
            if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentIndex < total - 1) {
                currentIndex++; updatePlayer();
            }
            if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && currentIndex > 0) {
                currentIndex--; updatePlayer();
            }
        };
        document.addEventListener('keydown', keyHandler);

        modal.appendChild(video);
        modal.appendChild(closeBtn);
        if (viewImgBtn) modal.appendChild(viewImgBtn);
        modal.appendChild(counter);
        if (total > 1) { modal.appendChild(prevBtn); modal.appendChild(nextBtn); }
        document.body.appendChild(modal);

        updatePlayer();
    }

    function showImageLightbox(urls, videoUrls = null) {
        if (!urls.length) return;

        const old = document.getElementById('tm-image-lightbox');
        if (old) old.remove();

        const total = urls.length;
        const isSingleImage = total === 1;
        let focused = 0;

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
        modal.addEventListener('wheel', e => e.preventDefault(), { passive: false });
        modal.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

        const stage = document.createElement('div');
        stage.style.cssText = `
            position: relative;
            width: ${CARD_W}px; height: ${CARD_H}px;
            flex-shrink: 0; overflow: visible;
        `;

        if (isSingleImage) {
            const container = document.createElement('div');
            container.style.cssText = `
                position: relative;
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
            `;

            const img = document.createElement('img');
            img.src = urls[0];
            img.draggable = false;
            img.style.cssText = `
                max-width: 95vw; max-height: 95vh;
                object-fit: contain; display: block;
                background: transparent; pointer-events: none;
                user-select: none; -webkit-user-drag: none;
            `;

            container.appendChild(img);
            modal.appendChild(container);

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute; top: 20px; right: 25px;
                background: rgba(0,0,0,0.6); color: white; border: none;
                font-size: 20px; width: 40px; height: 40px; border-radius: 50%;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s; z-index: 30;
            `;
            closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(255,255,255,0.25)';
            closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(0,0,0,0.6)';

            const closeLightbox = () => {
                modal.remove();
                document.removeEventListener('keydown', keyHandler);
            };
            closeBtn.onclick = closeLightbox;

            modal.onclick = e => { if (e.target === modal || e.target === container) closeLightbox(); };

            const keyHandler = e => {
                if (e.key === 'Escape') closeLightbox();
            };
            document.addEventListener('keydown', keyHandler);

            modal.appendChild(closeBtn);

            if (videoUrls && videoUrls.length) {
                const viewVidBtn = document.createElement('button');
                viewVidBtn.innerHTML = '▶️ Videos';
                viewVidBtn.style.cssText = `
                    position: absolute; top: 20px; right: 75px;
                    background: rgba(29, 155, 240, 0.8); color: white; border: none;
                    padding: 6px 16px; border-radius: 9999px;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s; z-index: 30; font: 13px/1.5 system-ui, sans-serif;
                `;
                viewVidBtn.onmouseenter = () => viewVidBtn.style.background = 'rgba(29, 155, 240, 1)';
                viewVidBtn.onmouseleave = () => viewVidBtn.style.background = 'rgba(29, 155, 240, 0.8)';
                viewVidBtn.onclick = (e) => {
                    e.stopPropagation();
                    closeLightbox();
                    showFloatingVideoPlayer(videoUrls, 0, urls);
                };
                modal.appendChild(viewVidBtn);
            }

            document.body.appendChild(modal);
            return;
        }

        const TRANSITION = `
            transform  0.40s cubic-bezier(0.34, 1.18, 0.64, 1),
            opacity    0.28s ease,
            box-shadow 0.28s ease
        `;
        const SHADOW_FOCUS = '0 28px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.18)';
        const SHADOW_IDLE  = '0 12px 36px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)';

        const cards = urls.map((url, i) => {
            const card = document.createElement('div');
            card.style.cssText = `
                position: absolute; left: 0; top: 0;
                width: ${CARD_W}px; height: ${CARD_H}px;
                border-radius: 14px; overflow: hidden;
                background: radial-gradient(ellipse at 50% 38%, #1e1e1e 0%, #0a0a0a 100%);
                cursor: pointer; transition: none;
            `;
            const img = document.createElement('img');
            img.src = url;
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
                updateAll();
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
            dot.addEventListener('click', e => {
                e.stopPropagation();
                focused = i; updateAll();
            });
            dotsWrap.appendChild(dot);
            return dot;
        });

        const counter = document.createElement('div');
        counter.style.cssText = `
            position: absolute; top: 20px; left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(6px);
            color: rgba(255,255,255,0.85);
            padding: 4px 14px; border-radius: 9999px;
            font: 13px/1.5 system-ui, sans-serif; z-index: 30;
            pointer-events: none; white-space: nowrap;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute; top: 20px; right: 25px;
            background: rgba(0,0,0,0.6); color: white; border: none;
            font-size: 20px; width: 40px; height: 40px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s; z-index: 30;
        `;
        closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(255,255,255,0.25)';
        closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(0,0,0,0.6)';

        const viewVidBtn = videoUrls && videoUrls.length ? document.createElement('button') : null;
        if (viewVidBtn) {
            viewVidBtn.innerHTML = '▶️ Videos';
            viewVidBtn.style.cssText = `
                position: absolute; top: 20px; right: 75px;
                background: rgba(29, 155, 240, 0.8); color: white; border: none;
                padding: 6px 16px; border-radius: 9999px;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: background 0.2s; z-index: 30; font: 13px/1.5 system-ui, sans-serif;
            `;
            viewVidBtn.onmouseenter = () => viewVidBtn.style.background = 'rgba(29, 155, 240, 1)';
            viewVidBtn.onmouseleave = () => viewVidBtn.style.background = 'rgba(29, 155, 240, 0.8)';
            viewVidBtn.onclick = (e) => {
                e.stopPropagation();
                closeLightbox();
                showFloatingVideoPlayer(videoUrls, 0, urls);
            };
        }

        const closeLightbox = () => {
            modal.remove();
            document.removeEventListener('keydown', keyHandler);
        };
        closeBtn.onclick = closeLightbox;
        modal.onclick = e => { if (e.target === modal) closeLightbox(); };

        const keyHandler = e => {
            if (e.key === 'Escape') { closeLightbox(); return; }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                focused = Math.min(focused + 1, total - 1); updateAll();
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                focused = Math.max(focused - 1, 0); updateAll();
            }
        };
        document.addEventListener('keydown', keyHandler);

        function updateAll() {
            cards.forEach((cardObj, i) => {
                const pos = i - focused;
                const { dx, rot, scale, zIndex, opacity } = calcTransform(pos);
                const isFocused = i === focused;

                const card = cardObj.card || cardObj;
                card.style.transform = `translateX(${dx}px) rotate(${rot}deg) scale(${scale})`;
                card.style.zIndex    = zIndex;
                card.style.opacity   = opacity;
                card.style.cursor    = isFocused ? 'default' : 'pointer';
                card.style.boxShadow = isFocused ? SHADOW_FOCUS : SHADOW_IDLE;
            });
            dots.forEach((dot, i) => {
                dot.style.background = i === focused
                    ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)';
                dot.style.transform  = i === focused ? 'scale(1.4)' : 'scale(1)';
            });
            if (total > 1) counter.textContent = `${focused + 1} / ${total}`;
        }

        modal.appendChild(stage);
        modal.appendChild(closeBtn);
        if (viewVidBtn) modal.appendChild(viewVidBtn);
        if (total > 1) { modal.appendChild(dotsWrap); modal.appendChild(counter); }
        document.body.appendChild(modal);

        updateAll();
        requestAnimationFrame(() => requestAnimationFrame(() => {
            cards.forEach(c => { c.style.transition = TRANSITION; });
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
            const fmt = GM_getValue(KEY_DATE_FORMAT, 'asian');
            return fmt === 'western' ? `${d}.${m}.${y}` : `${y}.${m}.${d}`;
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

        return {
            screenName: screenName,
            displayName: displayName,
            id: id,
            date: date,
            text: sanitizeForFilename(tweetText)
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

        const SVG_FILM = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="16" height="12" rx="2"/><line x1="2" y1="7" x2="18" y2="7"/><line x1="2" y1="13" x2="18" y2="13"/><line x1="6" y1="4" x2="6" y2="7"/><line x1="10" y1="4" x2="10" y2="7"/><line x1="14" y1="4" x2="14" y2="7"/><line x1="6" y1="13" x2="6" y2="16"/><line x1="10" y1="13" x2="10" y2="16"/><line x1="14" y1="13" x2="14" y2="16"/></svg>`;
        const SVG_CHECK_SM = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,10 8,14 16,6"/></svg>`;
        const SVG_DL = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3v10M6 9l4 4 4-4"/><line x1="3" y1="17" x2="17" y2="17"/></svg>`;

        const setMediaIcon = (state, extra) => {
            if (state === 'default') {
                btn.innerHTML = SVG_FILM;
                btn.style.filter = '';
                btn.style.fontSize = '';
                btn.style.color = '';
            } else if (state === 'dl') {
                btn.innerHTML = SVG_DL;
                btn.style.filter = '';
                btn.style.fontSize = '';
                btn.style.color = '';
            } else if (state === 'ok') {
                btn.innerHTML = SVG_CHECK_SM;
                btn.style.filter = 'drop-shadow(0 0 3px currentColor)';
                btn.style.fontSize = '';
                btn.style.color = '';
                showActionToast(btn, extra || T.msg_copied, 'ok');
            } else if (state === 'warn') {
                btn.innerHTML = SVG_FILM;
                btn.style.filter = '';
                btn.style.fontSize = '';
                btn.style.color = '';
                showActionToast(btn, extra, 'warn');
            } else {
                btn.innerHTML = SVG_FILM;
                btn.style.filter = '';
                btn.style.fontSize = '';
                btn.style.color = '';
                if (extra) showActionToast(btn, extra, state === 'error' ? 'error' : 'ok');
            }
        };

        const btn = document.createElement('button');
        btn.className = BUTTON_CLASS;
        btn.title = T.btn_tooltip;
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
                    setMediaIcon('msg', T.msg_prefix_copied);
                    setTimeout(() => setMediaIcon('default'), 1000);
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
                    setMediaIcon('msg', T.msg_no_media);
                    setTimeout(() => setMediaIcon('default'), 1000);
                }
            }
        });
        btn.addEventListener('mouseup', async (e) => {
            if (e.button !== 0) return;
            if (timer) {
                clearTimeout(timer); timer = null;
                const urls = await extractMediaUrls(article);
                if (!urls.length) { setMediaIcon('msg', T.msg_no_media); setTimeout(() => setMediaIcon('default'), 1000); return; }
                GM_setClipboard(urls.join('\n'));
                setMediaIcon('ok'); setTimeout(() => setMediaIcon('default'), 1000);
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
            btn.style.position = 'relative';
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
            btn.style.position = '';
            const successCount = total - failCount;
            if (failCount > 0) {
                setMediaIcon('warn', `⚠️ ${successCount}/${total}`);
            } else {
                setMediaIcon('ok', T.msg_downloaded);
            }
            setTimeout(() => setMediaIcon('default'), 2000);
        });

        const LINK_BTN_CLASS = 'custom-copy-icon';
        if (!article.querySelector(`.${LINK_BTN_CLASS}`)) {
            const icon = document.createElement('div');
            icon.className = LINK_BTN_CLASS;

            const SVG_LINK = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a4 4 0 0 0 5.66 0l2-2a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M12 8a4 4 0 0 0-5.66 0l-2 2a4 4 0 0 0 5.66 5.66l1-1"/></svg>`;
            const SVG_CHECK = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,10 8,14 16,6"/></svg>`;

            const setLinkIcon = (state, extra) => {
                if (state === 'ok') {
                    icon.innerHTML = SVG_LINK;
                    icon.style.filter = 'drop-shadow(0 0 3px currentColor)';
                    icon.style.opacity = '1';
                    icon.style.fontSize = '';
                    showActionToast(icon, extra || T.msg_copied, 'ok');
                    setTimeout(() => {
                        icon.style.filter = '';
                        icon.style.opacity = '';
                    }, 800);
                } else {
                    icon.innerHTML = SVG_LINK;
                    icon.style.filter = '';
                    icon.style.opacity = '';
                    icon.style.fontSize = '';
                }
            };
            setLinkIcon('default');

            icon.addEventListener('mouseenter', () => {
                const long = GM_getValue(KEY_LINK_DOMAIN_LONG, 'fixupx.com');
                const custom = GM_getValue(KEY_CLICK_MODE_CUSTOM, false);
                const click = custom ? GM_getValue(KEY_LINK_DOMAIN_CLICK, 'x.com') : 'x.com';
                icon.title = T.link_tooltip + click + T.link_tooltip_long + long;
            });

            let lTimer = null;

            icon.addEventListener('mousedown', e => {
                if (e.button !== 0) return;
                e.preventDefault(); e.stopPropagation();
                lTimer = setTimeout(() => {
                    const targetDomain = GM_getValue(KEY_LINK_DOMAIN_LONG, 'fixupx.com');
                    const url = extractTweetUrl(article, 'https://' + targetDomain);
                    if (url) {
                        const prefix = GM_getValue(KEY_PREFIX_TEXT, '[text]');
                        GM_setClipboard(`${prefix}(${url})`);
                        setLinkIcon('ok', T.msg_prefix_copied);
                        setTimeout(() => setLinkIcon('default'), 1000);
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
                        setLinkIcon('ok');
                        setTimeout(() => setLinkIcon('default'), 1000);
                    }
                }
            });

            icon.addEventListener('mouseleave', () => { if(lTimer) { clearTimeout(lTimer); lTimer = null; } });
            icon.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });

            actions.appendChild(btn);
            actions.insertBefore(icon, btn);
        }
    }

    let _tmdDebounceTimer = null;

    function scanAndInsert() {
        document.querySelectorAll('article').forEach(article => {
            insertCopyButton(article);
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

    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(scanAndInsert, 1500);

    setTimeout(scanAndInsert, 1000);
})();