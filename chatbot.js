// Toggle Chatbot Window
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input');

// Message rendering
// Voice synthesis helpers
let synth = window.speechSynthesis;
let currentUtterance = null;
let stopBtn = null;

function getSoftVoice() {
    // Try to select a soft/enhanced/female voice if available
    const voices = synth.getVoices();
    // Prefer Google, Microsoft, or female voices
    let preferred = voices.find(v => /female|soft|Google US English|Microsoft|Jenny|Samantha|Susan|Zira|Emma|Eva|Olivia/i.test(v.name + v.voiceURI));
    if (!preferred && voices.length) preferred = voices[0];
    return preferred || null;
}

function speakText(text) {
    if (synth.speaking) synth.cancel();
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = 1.01;
    currentUtterance.pitch = 1.08;
    currentUtterance.lang = 'en-US';
    const softVoice = getSoftVoice();
    if (softVoice) currentUtterance.voice = softVoice;
    synth.speak(currentUtterance);
    showStopBtn();
    currentUtterance.onend = hideStopBtn;
    currentUtterance.onerror = hideStopBtn;
}

function showStopBtn() {
    if (stopBtn) return;
    stopBtn = document.createElement('button');
    stopBtn.className = 'speaker-btn';
    stopBtn.title = 'Stop voice';
    stopBtn.setAttribute('aria-label', 'Stop voice');
    stopBtn.innerHTML = '⏹️';
    stopBtn.style.position = 'fixed';
    stopBtn.style.bottom = '110px';
    stopBtn.style.right = '40px';
    stopBtn.style.zIndex = 2000;
    stopBtn.style.background = '#fff';
    stopBtn.style.boxShadow = '0 2px 8px rgba(45,140,255,0.13)';
    stopBtn.onclick = () => {
        synth.cancel();
        hideStopBtn();
    };
    document.body.appendChild(stopBtn);
}
function hideStopBtn() {
    if (stopBtn && stopBtn.parentNode) {
        stopBtn.parentNode.removeChild(stopBtn);
        stopBtn = null;
    }
}

// Track which message is currently being spoken
let speakingMsgDiv = null;

function speakTextForMsg(text, msgDiv, speakerBtn) {
    if (synth.speaking) synth.cancel();
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = 1.01;
    currentUtterance.pitch = 1.08;
    currentUtterance.lang = 'en-US';
    const softVoice = getSoftVoice();
    if (softVoice) currentUtterance.voice = softVoice;
    speakingMsgDiv = msgDiv;
    updateSpeakerBtnState(speakerBtn, true);
    synth.speak(currentUtterance);
    currentUtterance.onend = () => {
        updateSpeakerBtnState(speakerBtn, false);
        speakingMsgDiv = null;
    };
    currentUtterance.onerror = () => {
        updateSpeakerBtnState(speakerBtn, false);
        speakingMsgDiv = null;
    };
}

function updateSpeakerBtnState(btn, isSpeaking) {
    if (isSpeaking) {
        btn.innerHTML = '⏹️';
        btn.title = 'Stop voice';
        btn.setAttribute('aria-label', 'Stop voice');
    } else {
        btn.innerHTML = '🔊';
        btn.title = 'Read aloud';
        btn.setAttribute('aria-label', 'Read answer aloud');
    }
}

// Modified addMessage to use toggle play/stop speaker button
function addMessage(text, sender = 'bot', options = {}) {
    const messages = document.getElementById('chatbot-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    // Add speaker button for bot messages
    if (sender === 'bot') {
        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'speaker-btn';
        updateSpeakerBtnState(speakerBtn, false);
        speakerBtn.onclick = (e) => {
            e.stopPropagation();
            // If this message is being spoken, stop it
            if (speakingMsgDiv === msgDiv && synth.speaking) {
                synth.cancel();
                updateSpeakerBtnState(speakerBtn, false);
                speakingMsgDiv = null;
            } else {
                // Stop any other speech
                synth.cancel();
                // Reset all other speaker buttons
                document.querySelectorAll('.speaker-btn').forEach(btn => updateSpeakerBtnState(btn, false));
                speakTextForMsg(text, msgDiv, speakerBtn);
            }
        };
        msgDiv.appendChild(speakerBtn);
    }
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
    // For quick replies
    if (options.quickReplies) {
        const quickDiv = document.createElement('div');
        quickDiv.className = 'quick-replies';
        options.quickReplies.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = q.label;
            btn.onclick = () => handleQuickReply(q.value);
            quickDiv.appendChild(btn);
        });
        messages.appendChild(quickDiv);
        messages.scrollTop = messages.scrollHeight;
    }
}

// Typing animation
function showTypingIndicator() {
    const messages = document.getElementById('chatbot-messages');
    let typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.textContent = 'Bot is typing...';
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
    return typingDiv;
}
function removeTypingIndicator(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
        typingDiv.parentNode.removeChild(typingDiv);
    }
}

// Modified addMessage for typing animation
function addBotMessageWithTyping(text, options = {}) {
    const typingDiv = showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator(typingDiv);
        addMessage(text, 'bot', options);
    }, 700 + Math.min(1200, text.length * 20)); // Delay based on message length
}

// Greeting and initial quick replies
function showGreeting() {
    addMessage("Hi! I’m your Mimo for Yash, Aditya, and Dipshree’s portfolio. How can I help you today?", 'bot', {
        quickReplies: [
            { label: 'About the Team', value: 'Who are Yash, Aditya, and Dipshree?' },
            { label: 'Contact Info', value: 'How can I contact the team?' },
        ]
    });
}

let faqList = [];
let faqLoaded = false;

// Load FAQ from text file
function loadFAQ() {
    addMessage('Loading knowledge base...', 'bot');
    fetch('portfolio_chatbot_faq.txt')
        .then(res => res.text())
        .then(text => {
            faqList = parseFAQText(text);
            faqLoaded = true;
            document.getElementById('chatbot-messages').innerHTML = '';
            showGreeting();
        })
        .catch(() => {
            addMessage('Failed to load FAQ. Please try again later.', 'bot');
        });
}

// Parse the text file into [{q, a}]
function parseFAQText(text) {
    const lines = text.split(/\r?\n/);
    const faqs = [];
    let q = '', a = '';
    for (let line of lines) {
        if (/^\d+\.\s/.test(line)) {
            if (q && a) faqs.push({ q: q.trim(), a: a.trim() });
            q = line.replace(/^\d+\.\s/, '');
            a = '';
        } else if (/^A:/.test(line)) {
            a = line.replace(/^A:\s*/, '');
        } else if (line.trim()) {
            a += '\n' + line.trim();
        }
    }
    if (q && a) faqs.push({ q: q.trim(), a: a.trim() });
    return faqs;
}

// Improved fuzzy match: prioritize name+skills combos
function findBestFAQAnswer(userQ) {
    userQ = userQ.toLowerCase();
    const names = ['yash', 'dipshree', 'aditya'];
    const skillWords = ['skills', 'skills', 'competenc', 'strength'];
    // Exact match first
    for (let {q, a} of faqList) {
        if (userQ === q.toLowerCase()) return a;
    }
    // Name+skills priority
    let best = null, bestScore = 0;
    const userWords = userQ.split(/\W+/).filter(w => w.length > 2);
    for (let {q, a} of faqList) {
        let score = 0;
        const qWords = q.toLowerCase().split(/\W+/);
        // Name+skills boost
        for (let name of names) {
            if (userQ.includes(name) && q.toLowerCase().includes(name)) {
                for (let sk of skillWords) {
                    if (userQ.includes(sk) && q.toLowerCase().includes(sk)) {
                        score += 10; // strong boost for name+skills
                    }
                }
            }
        }
        // Regular keyword/partial match
        for (let uw of userWords) {
            if (qWords.includes(uw)) score += 2;
            else if (qWords.some(qw => qw.startsWith(uw) || uw.startsWith(qw))) score += 1;
        }
        if (score > bestScore) {
            bestScore = score;
            best = a;
        }
    }
    return bestScore >= 1 ? best : null;
}

// Override getBotResponse to use FAQ file
function getBotResponse(input) {
    if (!faqLoaded) return 'Knowledge base is still loading. Please wait...';
    const msg = input.trim().toLowerCase();
    if (msg.includes('faq') || msg.includes('all question') || msg.includes('show question')) {
        let qList = faqList.map((item, i) => `${i + 1}. ${item.q}`).join('\n');
        return `Here are some questions you can ask me:\n${qList}`;
    }
    const answer = findBestFAQAnswer(input);
    if (answer) return answer;
    // Fallback to previous logic for small talk and general help
    if (["hi", "hello", "hey", "good morning", "good afternoon", "good evening"].some(g => msg === g || msg.startsWith(g+" "))) {
        return "Hello! How can I assist you with our team portfolio today?";
    }
    if (msg.includes("how are you")) {
        return "I'm just a virtual guide, but I'm always happy to help! How can I assist you today?";
    }
    if (msg.includes("nice work") || msg.includes("great job") || msg.includes("awesome") || msg.includes("cool") || msg.includes("well done")) {
        return "Thank you! Our team appreciates your kind words.";
    }
    if (msg.includes("thank you") || msg.includes("thanks")) {
        return "You're welcome! Let me know if you have any more questions.";
    }
    return "I'm here to help with info about our team, projects, and more! Try asking about our skills, projects, or how to contact us.";
}

let feedbackGiven = false;

function showFeedbackRequest() {
    if (feedbackGiven) return;
    feedbackGiven = true;
    const messages = document.getElementById('chatbot-messages');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'message bot';
    feedbackDiv.innerHTML = `We’d love your feedback!<br>How would you rate this chat? <span class="feedback-stars"></span>`;
    messages.appendChild(feedbackDiv);
    const starsContainer = feedbackDiv.querySelector('.feedback-stars');
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        star.style.cursor = 'pointer';
        star.style.fontSize = '1.3em';
        star.style.color = '#cfd8dc';
        star.addEventListener('mouseenter', () => {
            for (let j = 0; j < i; j++) starsContainer.children[j].style.color = '#2d8cff';
            for (let j = i; j < 5; j++) starsContainer.children[j].style.color = '#cfd8dc';
        });
        star.addEventListener('mouseleave', () => {
            for (let j = 0; j < 5; j++) starsContainer.children[j].style.color = '#cfd8dc';
        });
        star.addEventListener('click', () => {
            for (let j = 0; j < i; j++) starsContainer.children[j].style.color = '#2d8cff';
            for (let j = i; j < 5; j++) starsContainer.children[j].style.color = '#cfd8dc';
            feedbackDiv.innerHTML += `<div class='feedback-thanks'>Thank you for rating us ${i} star${i>1?'s':''}!</div>`;
            console.log('User rated the chat:', i);
        });
        starsContainer.appendChild(star);
    }
    messages.scrollTop = messages.scrollHeight;
}

// Update handleUserInput to trigger feedback after thanks
function handleUserInput(input, fromQuickReply = false) {
    if (!fromQuickReply) addMessage(input, 'user');
    let response = getBotResponse(input);
    if (response) {
        addBotMessageWithTyping(response);
        if (/thank you|thanks/i.test(input) && !feedbackGiven) {
            setTimeout(showFeedbackRequest, 1200);
        }
    } else {
        addBotMessageWithTyping("I'm here to help with info about our team, projects, and more! Try asking about our skills, projects, or how to contact us.");
    }
}

// Update quick reply actions to use typing animation
function handleQuickReply(value) {
    if (value === 'Show me your projects.') {
        addBotMessageWithTyping('Opening our projects page for you...');
        window.open('#', '_blank');
    } else if (value === 'Who are Yash, Aditya, and Dipshree?') {
        addBotMessageWithTyping("We are Yash, Aditya, and Dipshree—a passionate team of developers and designers. Want to know more about our skills or projects?");
    } else if (value === 'How can I contact the team?') {
        addBotMessageWithTyping("You can contact us at teamvisionaries@gmail.com or via the contact form on our website.");
    } else if (value === 'Can I see your resume?') {
        addBotMessageWithTyping("Here’s our team resume. Downloading now...");
        window.open('#', '_blank');
    } else {
        handleUserInput(value, true);
    }
}

// Voice input (speech recognition)
const voiceBtn = document.getElementById('chatbot-voice');
let recognition, recognizing = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        recognizing = true;
        voiceBtn.classList.add('listening');
        voiceBtn.title = 'Listening... Click to stop.';
    };
    recognition.onend = () => {
        recognizing = false;
        voiceBtn.classList.remove('listening');
        voiceBtn.title = 'Voice Input';
    };
    recognition.onerror = (event) => {
        recognizing = false;
        voiceBtn.classList.remove('listening');
        voiceBtn.title = 'Voice Input';
        if (event.error !== 'no-speech') {
            alert('Voice recognition error: ' + event.error);
        }
    };
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        chatbotInput.value = transcript;
        if (event.results[event.results.length - 1].isFinal) {
            handleUserInput(transcript);
            chatbotInput.value = '';
        }
    };

    voiceBtn.addEventListener('click', () => {
        if (recognizing) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
} else {
    // Not supported
    voiceBtn.style.display = 'none';
    // Optionally, show a message or tooltip
    chatbotInput.placeholder += ' (Voice input not supported)';
}

// Send on button click or Enter
const sendBtn = document.getElementById('chatbot-send');
sendBtn.addEventListener('click', () => {
    const val = chatbotInput.value.trim();
    if (val) {
        handleUserInput(val);
        chatbotInput.value = '';
    }
});
chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// On chat open, load FAQ if not loaded
chatbotIcon.addEventListener('click', () => {
    chatbotWindow.classList.remove('hidden');
    chatbotIcon.style.display = 'none';
    setTimeout(() => chatbotInput.focus(), 200);
    const messages = document.getElementById('chatbot-messages');
    if (!faqLoaded) {
        loadFAQ();
    } else if (!messages.hasChildNodes()) {
        showGreeting();
    }
});

// Optional: Close chat on Escape key
window.addEventListener('keydown', (e) => {
    if (!chatbotWindow.classList.contains('hidden') && e.key === 'Escape') {
        chatbotWindow.classList.add('hidden');
        chatbotIcon.style.display = 'block';
    }
});

// Optional: Reset chat on close
chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
    chatbotIcon.style.display = 'block';
    // Optionally clear messages for a fresh start next time
    // document.getElementById('chatbot-messages').innerHTML = '';
}); 