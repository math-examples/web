// 文字
var globalSynth = null;
var globalVoiceSelect = null;
var pitch = null;
var pitchValue = null;
var rate = null;
var rateValue = null;

let globalVoices = [];
let globalSpeechWarmedUp = false;
let globalSpeakState = 0;
let globalRunId = 0;

function showTtsSetting() {
    var x = document.querySelector("#ttsSetting");
    if (x) {
        x.style.display = "block";
    }
}

// ── Language and voice helpers ────────────────────────────
function normalizeLang(lang) {
    return (lang || "").toLowerCase().replace("_", "-");
}

function pickZhVoice(list) {
    return (
        list.find(v => normalizeLang(v.lang) === "zh-cn") ||
        list.find(v => /^zh/i.test(normalizeLang(v.lang))) ||
        list.find(v => /chinese|中文|普通话|mandarin/i.test(v.name)) ||
        null
    );
}

// ── Split long text into chunks ───────────────────────────
function splitLongSentence(text, max) {
    const result = [];
    while (text.length > max) {
        result.push(text.slice(0, max));
        text = text.slice(max);
    }
    if (text) {
        result.push(text);
    }
    return result;
}

function splitText(text, max = 180) {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) {
        return [];
    }

    const sentences =
        clean.match(/[^。！？!?；;]+[。！？!?；;]*/g) || [clean];
    const chunks = [];
    let buf = "";

    for (const sentence of sentences) {
        if (sentence.length > max) {
            if (buf.trim()) {
                chunks.push(buf.trim());
                buf = "";
            }
            chunks.push(...splitLongSentence(sentence, max));
        } else if ((buf + sentence).length > max && buf) {
            chunks.push(buf.trim());
            buf = sentence;
        } else {
            buf += sentence;
        }
    }

    if (buf.trim()) {
        chunks.push(buf.trim());
    }
    return chunks.filter(Boolean);
}

// ── iOS speech warm-up ────────────────────────────────────
function warmUpSpeech() {
    if (globalSpeechWarmedUp || !globalSynth) {
        return;
    }
    globalSpeechWarmedUp = true;

    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    utterance.rate = 10;
    globalSynth.speak(utterance);
}

// ── Voice list ────────────────────────────────────────────
function populateVoiceList() {
    if (!globalSynth || !globalVoiceSelect) {
        return;
    }

    const voices = globalSynth.getVoices();
    if (!voices || voices.length === 0) {
        return;
    }

    globalVoices = voices.sort(function (a, b) {
        const aName = a.name.toUpperCase();
        const bName = b.name.toUpperCase();

        if (aName < bName) {
            return -1;
        }
        if (aName === bName) {
            return 0;
        }
        return 1;
    });

    const previousIndex =
        globalVoiceSelect.selectedIndex >= 0
            ? globalVoiceSelect.selectedIndex
            : 0;
    globalVoiceSelect.innerHTML = "";

    for (let i = 0; i < globalVoices.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent =
            `${globalVoices[i].name} (${globalVoices[i].lang})`;

        if (globalVoices[i].default) {
            option.textContent += " -- 默认";
        }

        option.setAttribute("data-lang", globalVoices[i].lang);
        option.setAttribute("data-name", globalVoices[i].name);
        globalVoiceSelect.appendChild(option);
    }

    // Auto-select: system language > Chinese > first available voice
    if (previousIndex === 0 && globalVoiceSelect.options.length > 0) {
        const systemLanguage = normalizeLang(
            navigator.language ||
                (navigator.languages && navigator.languages[0]) ||
                "zh-CN"
        );
        const chineseVoice = pickZhVoice(globalVoices);

        let selectedIndex = globalVoices.findIndex(
            voice => normalizeLang(voice.lang) === systemLanguage
        );

        if (selectedIndex === -1 && chineseVoice) {
            selectedIndex = globalVoices.indexOf(chineseVoice);
        }
        if (selectedIndex === -1) {
            selectedIndex = 0;
        }
        globalVoiceSelect.selectedIndex = selectedIndex;
    } else {
        globalVoiceSelect.selectedIndex = Math.min(
            previousIndex,
            globalVoiceSelect.options.length - 1
        );
    }
}

// ── Initialize speech synthesis ──────────────────────────
function initSpeak() {
    if (window.self !== window.top) {
        return;
    }

    const btnSpeak = document.querySelector("#speak");
    if (!btnSpeak) {
        showLog("没有启用朗读功能");
        return;
    }

    globalVoiceSelect = document.querySelector("select");
    pitch = document.querySelector("#pitch");
    pitchValue = document.querySelector(".pitch-value");
    rate = document.querySelector("#rate");
    rateValue = document.querySelector(".rate-value");

    if ("speechSynthesis" in window) {
        globalSynth = window.speechSynthesis;
        showTtsSetting();
    } else {
        showLog("没有找到浏览器语音合成接口!");
        return;
    }

    if (!globalVoiceSelect || !pitch || !rate) {
        showLog("语音设置元素未找到！");
        return;
    }

    // Live slider updates
    rate.oninput = function () {
        if (rateValue) {
            rateValue.textContent = parseFloat(rate.value).toFixed(1);
        }
    };

    pitch.oninput = function () {
        if (pitchValue) {
            pitchValue.textContent = parseFloat(pitch.value).toFixed(1);
        }
    };

    // Voice switch: restart playback with new voice
    globalVoiceSelect.onchange = function () {
        showLog("声音已切换🎵🎤");
    };

    // Retry voice loading
    function loadVoicesWhenAvailable() {
        if (!globalSynth) {
            return;
        }

        const voices = globalSynth.getVoices();
        if (voices && voices.length > 0) {
            populateVoiceList();
        } else {
            setTimeout(loadVoicesWhenAvailable, 100);
        }
    }

    if (globalSynth.onvoiceschanged !== undefined) {
        globalSynth.onvoiceschanged = loadVoicesWhenAvailable;
    }
    loadVoicesWhenAvailable();
}

// ── Button state helpers ──────────────────────────────────
function isButtonSpeak() {
    const button = document.getElementById("speak");
    return button.innerHTML === "朗读🔊";
}

function showButtonSpeak() {
    const button = document.getElementById("speak");
    if (button) {
        button.innerHTML = "朗读🔊";
    }
}

function showButtonStop() {
    const button = document.getElementById("speak");
    if (button) {
        button.innerHTML = "停止❌️";
    }
}

// ── Paragraph highlighting ────────────────────────────────
function setBg(paragraph) {
    paragraph.style.color = "red";
}

function clearBg(paragraph) {
    paragraph.style.color = "initial";
}

// ── Select voice for utterance ────────────────────────────
function setUtteranceVoice(utterance) {
    const selectedIndex = parseInt(globalVoiceSelect.value);

    if (!isNaN(selectedIndex) && globalVoices[selectedIndex]) {
        utterance.voice = globalVoices[selectedIndex];
        utterance.lang = globalVoices[selectedIndex].lang;
    } else {
        const chineseVoice = pickZhVoice(globalVoices);
        if (chineseVoice) {
            utterance.voice = chineseVoice;
            utterance.lang = chineseVoice.lang;
        }
    }

    utterance.pitch = parseFloat(pitch.value);
    utterance.rate = parseFloat(rate.value);
}

// ── Chunked paragraph playback ───────────────────────────
function speakNodeList() {
    if (!globalSynth) {
        return;
    }

    // Warm-up on first gesture
    warmUpSpeech();

    const paragraphs = document.querySelectorAll("p");
    if (!paragraphs || paragraphs.length === 0) {
        showLog("无内容！");
        return;
    }

    // Cancel previous playback
    globalRunId++;
    const runId = globalRunId;
    globalSynth.cancel();
    globalSpeakState = 1;
    showButtonStop();

    // Collect paragraph text and preserve paragraph position
    const chunks = [];
    for (let i = 0; i < paragraphs.length; i++) {
        const paragraphText = paragraphs[i].textContent.trim();
        if (!paragraphText) {
            continue;
        }

        const paragraphChunks = splitText(paragraphText, 180);
        paragraphChunks.forEach(chunk => {
            chunks.push({
                text: chunk,
                paragraph: paragraphs[i]
            });
        });
    }

    if (chunks.length === 0) {
        showLog("无内容！");
        showButtonSpeak();
        globalSpeakState = 0;
        return;
    }

    let chunkIndex = 0;
    let currentParagraph = null;

    function speakNextChunk() {
        // Check whether this playback sequence is still valid
        if (runId !== globalRunId || globalSpeakState !== 1) {
            return;
        }

        // 0 = play once; 1 = repeat forever
        const repeat = 1;

        // All chunks completed
        if (chunkIndex >= chunks.length) {
            if (currentParagraph) {
                clearBg(currentParagraph);
            }

            if (repeat === 0) {
                showLog("播放完毕！");
                showButtonSpeak();
                globalSpeakState = 0;
                return;
            } else {
                showLog("再次播放！");
                chunkIndex = 0;
                currentParagraph = null;
            }
        }

        const currentChunk = chunks[chunkIndex];

        // Update paragraph highlighting
        if (currentParagraph !== currentChunk.paragraph) {
            if (currentParagraph) {
                clearBg(currentParagraph);
            }
            currentParagraph = currentChunk.paragraph;
            setBg(currentParagraph);
        }

        // Create a new utterance for each chunk
        const utterance = new SpeechSynthesisUtterance(currentChunk.text);
        chunkIndex++;

        // Apply selected voice, pitch, and rate
        setUtteranceVoice(utterance);

        utterance.onend = function () {
            if (runId !== globalRunId) {
                return;
            }
            speakNextChunk();
        };

        utterance.onerror = function (event) {
            if (runId !== globalRunId) {
                return;
            }

            if (
                event.error === "interrupted" ||
                event.error === "canceled"
            ) {
                return;
            }

            globalRunId++;
            if (currentParagraph) {
                clearBg(currentParagraph);
            }
            showLog("朗读出错");
            showButtonSpeak();
            globalSpeakState = 0;
        };

        globalSynth.speak(utterance);

        // Preserve the current-utterance display
        showUtterance(utterance.text);
    }

    speakNextChunk();
}

// ── Single-text speaking ──────────────────────────────────
function speakText(text) {
    if (!globalSynth) {
        return;
    }

    if (globalSynth.speaking) {
        showLog("正在播放");
        return;
    }
    if (text === "") {
        return;
    }

    warmUpSpeech();

    const chunks = splitText(text, 180);
    let chunkIndex = 0;
    globalRunId++;
    const runId = globalRunId;

    function speakNextTextChunk() {
        if (runId !== globalRunId) {
            return;
        }
        if (chunkIndex >= chunks.length) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(
            chunks[chunkIndex]
        );
        chunkIndex++;
        setUtteranceVoice(utterance);

        utterance.onend = function () {
            if (runId !== globalRunId) {
                return;
            }
            speakNextTextChunk();
        };

        utterance.onerror = function (event) {
            if (runId !== globalRunId) {
                return;
            }

            if (
                event.error === "interrupted" ||
                event.error === "canceled"
            ) {
                return;
            }

            showButtonSpeak();
            showLog("句子出错");
        };

        globalSynth.speak(utterance);
    }

    speakNextTextChunk();
}

// ── WeChat detection ──────────────────────────────────────
function isWeChat() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.match(/MicroMessenger/i) == "micromessenger";
}

// ── Main play / stop function ─────────────────────────────
function ispeak() {
    if (!globalSynth) {
        if (isWeChat()) {
            showLogLong(
                `<span class="warn">注意：</span>微信不支持，请在浏览器中打开本网页!<br>` +
                    "步骤1：点击右上角···按钮。<br>" +
                    "步骤2：下方选择在浏览器打开，最好选择火狐浏览器打开。"
            );
        } else {
            warnLog("此浏览器不支持，请用火狐浏览器打开！");
        }
        return;
    }

    if (!globalVoices || globalVoices.length === 0) {
        warnLogLong(
            "没有找到可用的语音，请先允许浏览器使用麦克风权限，再重试。" +
                "<br>如果还有问题，您也可以向开发者反馈！"
        );
        return;
    }

    if (isButtonSpeak()) {
        speakNodeList();
    } else {
        globalSpeakState = 0;
        globalRunId++;
        globalSynth.cancel();
        showLog("已停止播放！");
        showButtonSpeak();
    }
}

// ── Speak button initialization ──────────────────────────
var hasInitSpeak = 0;

function speak() {
    if (!hasInitSpeak) {
        initSpeak();
        hasInitSpeak = 1;
        showLog("语音初始化完成，请再次点击朗读🔊");
        return;
    }
    ispeak();
}

// ── Pause / resume ───────────────────────────────────────
function pause() {
    // [Chrome/Firefox on Android] Pausing and resuming does not work.
    if (!globalSynth) {
        return;
    }

    const button = document.getElementById("pause");
    if (!button) {
        return;
    }

    if (button.innerHTML === "继续💚") {
        globalSynth.resume();
        button.innerHTML = "暂停❤";
    } else {
        globalSynth.pause();
        button.innerHTML = "继续💚";
    }
}
