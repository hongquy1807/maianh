(function() {
            // ============ DỮ LIỆU TỪ VỰNG ============
            const vocabulary = [
                // Chào hỏi
                { kr: '안녕하세요', roman: 'annyeonghaseyo', vi: 'Xin chào', cat: 'greeting', catName: 'Chào hỏi', type: 'Cụm từ', exKr: '안녕하세요, 만나서 반갑습니다.', exVi: 'Xin chào, rất vui được gặp bạn.' },
                { kr: '감사합니다', roman: 'gamsahamnida', vi: 'Cảm ơn', cat: 'greeting', catName: 'Chào hỏi', type: 'Cụm từ', exKr: '도와주셔서 감사합니다.', exVi: 'Cảm ơn bạn đã giúp đỡ.' },
                { kr: '죄송합니다', roman: 'joesonghamnida', vi: 'Xin lỗi', cat: 'greeting', catName: 'Chào hỏi', type: 'Cụm từ', exKr: '늦어서 죄송합니다.', exVi: 'Xin lỗi vì đã đến muộn.' },
                { kr: '안녕히 가세요', roman: 'annyeonghi gaseyo', vi: 'Tạm biệt', cat: 'greeting', catName: 'Chào hỏi', type: 'Cụm từ', exKr: '안녕히 가세요, 내일 봐요.', exVi: 'Tạm biệt, mai gặp lại.' },
                { kr: '사랑해요', roman: 'saranghaeyo', vi: 'Tôi yêu bạn', cat: 'greeting', catName: 'Chào hỏi', type: 'Cụm từ', exKr: '정말 사랑해요.', exVi: 'Tôi thực sự yêu bạn.' },
                // Gia đình
                { kr: '가족', roman: 'gajok', vi: 'Gia đình', cat: 'family', catName: 'Gia đình', type: 'Danh từ', exKr: '우리 가족은 네 명이에요.', exVi: 'Gia đình tôi có 4 người.' },
                { kr: '엄마', roman: 'eomma', vi: 'Mẹ', cat: 'family', catName: 'Gia đình', type: 'Danh từ', exKr: '엄마, 사랑해요.', exVi: 'Mẹ ơi, con yêu mẹ.' },
                { kr: '아빠', roman: 'appa', vi: 'Bố', cat: 'family', catName: 'Gia đình', type: 'Danh từ', exKr: '아빠는 회사에 가셨어요.', exVi: 'Bố đã đi làm rồi.' },
                { kr: '언니', roman: 'eonni', vi: 'Chị gái', cat: 'family', catName: 'Gia đình', type: 'Danh từ', exKr: '언니는 예뻐요.', exVi: 'Chị gái tôi xinh đẹp.' },
                // Đồ ăn
                { kr: '밥', roman: 'bap', vi: 'Cơm', cat: 'food', catName: 'Đồ ăn', type: 'Danh từ', exKr: '밥을 먹었어요.', exVi: 'Tôi đã ăn cơm.' },
                { kr: '김치', roman: 'gimchi', vi: 'Kim chi', cat: 'food', catName: 'Đồ ăn', type: 'Danh từ', exKr: '김치는 매워요.', exVi: 'Kim chi cay.' },
                { kr: '물', roman: 'mul', vi: 'Nước', cat: 'food', catName: 'Đồ ăn', type: 'Danh từ', exKr: '물 한 잔 주세요.', exVi: 'Cho tôi một ly nước.' },
                { kr: '커피', roman: 'keopi', vi: 'Cà phê', cat: 'food', catName: 'Đồ ăn', type: 'Danh từ', exKr: '커피를 좋아해요.', exVi: 'Tôi thích cà phê.' },
                // Màu sắc
                { kr: '빨간색', roman: 'ppalgansaek', vi: 'Màu đỏ', cat: 'color', catName: 'Màu sắc', type: 'Danh từ', exKr: '빨간색을 좋아해요.', exVi: 'Tôi thích màu đỏ.' },
                { kr: '파란색', roman: 'paransaek', vi: 'Màu xanh dương', cat: 'color', catName: 'Màu sắc', type: 'Danh từ', exKr: '하늘이 파란색이에요.', exVi: 'Bầu trời màu xanh.' },
                { kr: '노란색', roman: 'noransaek', vi: 'Màu vàng', cat: 'color', catName: 'Màu sắc', type: 'Danh từ', exKr: '노란색 꽃이 예뻐요.', exVi: 'Hoa màu vàng đẹp.' },
                { kr: '분홍색', roman: 'bunhongsaek', vi: 'Màu hồng', cat: 'color', catName: 'Màu sắc', type: 'Danh từ', exKr: '분홍색을 좋아해요.', exVi: 'Tôi thích màu hồng.' },
                // Động vật
                { kr: '고양이', roman: 'goyangi', vi: 'Con mèo', cat: 'animal', catName: 'Động vật', type: 'Danh từ', exKr: '고양이가 귀여워요.', exVi: 'Con mèo dễ thương.' },
                { kr: '강아지', roman: 'gangaji', vi: 'Con chó', cat: 'animal', catName: 'Động vật', type: 'Danh từ', exKr: '강아지가 좋아요.', exVi: 'Tôi thích con chó.' },
                { kr: '곰', roman: 'gom', vi: 'Con gấu', cat: 'animal', catName: 'Động vật', type: 'Danh từ', exKr: '곰 인형을 좋아해요.', exVi: 'Tôi thích gấu bông.' },
                { kr: '토끼', roman: 'tokki', vi: 'Con thỏ', cat: 'animal', catName: 'Động vật', type: 'Danh từ', exKr: '토끼가 빨라요.', exVi: 'Con thỏ chạy nhanh.' },
                // Số đếm
                { kr: '하나', roman: 'hana', vi: 'Một (1)', cat: 'number', catName: 'Số đếm', type: 'Số từ', exKr: '하나, 둘, 셋!', exVi: 'Một, hai, ba!' },
                { kr: '둘', roman: 'dul', vi: 'Hai (2)', cat: 'number', catName: 'Số đếm', type: 'Số từ', exKr: '사과 두 개 주세요.', exVi: 'Cho tôi 2 quả táo.' },
                { kr: '셋', roman: 'set', vi: 'Ba (3)', cat: 'number', catName: 'Số đếm', type: 'Số từ', exKr: '셋이서 갔어요.', exVi: 'Ba người chúng tôi đã đi.' }
            ];

            // ============ TỪ ĐIỂN CHATBOT ============
            const dictionary = {
                // Việt → Hàn
                vi2kr: {
                    'xin chào': { kr: '안녕하세요', roman: 'annyeonghaseyo' },
                    'chào': { kr: '안녕', roman: 'annyeong' },
                    'chào bạn': { kr: '안녕하세요', roman: 'annyeonghaseyo' },
                    'cảm ơn': { kr: '감사합니다', roman: 'gamsahamnida' },
                    'cám ơn': { kr: '감사합니다', roman: 'gamsahamnida' },
                    'xin lỗi': { kr: '죄송합니다', roman: 'joesonghamnida' },
                    'tạm biệt': { kr: '안녕히 가세요', roman: 'annyeonghi gaseyo' },
                    'tôi yêu bạn': { kr: '사랑해요', roman: 'saranghaeyo' },
                    'anh yêu em': { kr: '사랑해요', roman: 'saranghaeyo' },
                    'em yêu anh': { kr: '사랑해요', roman: 'saranghaeyo' },
                    'tôi thích bạn': { kr: '좋아해요', roman: 'joahaeyo' },
                    'bạn khỏe không': { kr: '잘 지내요?', roman: 'jal jinaeyo?' },
                    'tôi khỏe': { kr: '잘 지내요', roman: 'jal jinaeyo' },
                    'bạn tên gì': { kr: '이름이 뭐예요?', roman: 'ireumi mwoyeyo?' },
                    'tôi tên là mai anh': { kr: '저는 마이앤이에요', roman: 'jeoneun mai anieyo' },
                    'rất vui được gặp bạn': { kr: '만나서 반갑습니다', roman: 'mannaseo bangapseumnida' },
                    'hẹn gặp lại': { kr: '또 만나요', roman: 'tto mannayo' },
                    'ngon quá': { kr: '맛있어요', roman: 'masisseoyo' },
                    'tôi đói': { kr: '배고파요', roman: 'baegopayo' },
                    'tôi no': { kr: '배불러요', roman: 'baebulleoyo' },
                    'bao nhiêu tiền': { kr: '얼마예요?', roman: 'eolmayeyo?' },
                    'đắt quá': { kr: '너무 비싸요', roman: 'neomu bissayo' },
                    'rẻ quá': { kr: '싸요', roman: 'ssayo' },
                    'tôi muốn mua': { kr: '사고 싶어요', roman: 'sago sipeoyo' },
                    'tôi không hiểu': { kr: '이해가 안 돼요', roman: 'ihaega an dwaeyo' },
                    'nói lại được không': { kr: '다시 말해 주세요', roman: 'dasi malhae juseyo' },
                    'chúc mừng năm mới': { kr: '새해 복 많이 받으세요', roman: 'saehae bok mani badeuseyo' },
                    'giáng sinh vui vẻ': { kr: '메리 크리스마스', roman: 'meri keuriseumaseu' }
                }
            };

            // ============ HÀM HỖ TRỢ ============
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            let toastTimeout;

            function showToast(message, isSuccess = true) {
                toastMsg.textContent = message;
                const icon = toast.querySelector('i');
                if (isSuccess) {
                    icon.className = 'fas fa-check-circle';
                    icon.style.color = '#f48fb1';
                } else {
                    icon.className = 'fas fa-exclamation-circle';
                    icon.style.color = '#e6a800';
                }
                toast.classList.add('show');
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
            }

            function shuffleArray(arr) {
                const a = [...arr];
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }

            // ============ MODE TABS ============
            document.querySelectorAll('.mode-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    const mode = this.dataset.mode;
                    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    document.querySelectorAll('.mode-panel').forEach(p => p.classList.remove('active'));
                    document.getElementById('panel-' + mode).classList.add('active');
                });
            });

            // ============================================================
            // MODE 1: FLASHCARD
            // ============================================================
            let fcFiltered = [...vocabulary];
            let fcIndex = 0;
            let fcFlipped = false;
            let fcKnown = 0;
            let fcUnknown = 0;

            const flashcardEl = document.getElementById('flashcard');

            function renderFlashcard() {
                const word = fcFiltered[fcIndex];
                if (!word) return;

                document.getElementById('fcKorean').textContent = word.kr;
                document.getElementById('fcRomanization').textContent = word.roman;
                document.getElementById('fcVietnamese').textContent = word.vi;
                document.getElementById('fcExampleKr').textContent = word.exKr;
                document.getElementById('fcExampleVi').textContent = word.exVi;
                document.getElementById('fcCategory').innerHTML = `<i class="fas fa-tag"></i> ${word.catName}`;
                document.getElementById('fcType').textContent = word.type;
                document.getElementById('fcRoman').textContent = word.roman;

                document.getElementById('fcCurrent').textContent = fcIndex + 1;
                document.getElementById('fcTotal').textContent = fcFiltered.length;

                const progress = ((fcIndex + 1) / fcFiltered.length) * 100;
                document.getElementById('fcProgressBar').style.width = progress + '%';

                // Reset flip
                fcFlipped = false;
                flashcardEl.classList.remove('flipped');

                // Buttons
                document.getElementById('fcPrev').disabled = fcIndex === 0;
                document.getElementById('fcNext').disabled = fcIndex === fcFiltered.length - 1;
            }

            function flipCard() {
                fcFlipped = !fcFlipped;
                flashcardEl.classList.toggle('flipped', fcFlipped);
            }

            function nextCard() {
                if (fcIndex < fcFiltered.length - 1) {
                    fcIndex++;
                    renderFlashcard();
                } else {
                    showToast('🎉 Bạn đã hoàn thành bộ thẻ này!', true);
                }
            }

            function prevCard() {
                if (fcIndex > 0) {
                    fcIndex--;
                    renderFlashcard();
                }
            }

            function markKnown() {
                fcKnown++;
                document.getElementById('statKnown').textContent = fcKnown;
                showToast('✅ Đã đánh dấu đã biết!', true);
                nextCard();
            }

            function markUnknown() {
                fcUnknown++;
                document.getElementById('statUnknown').textContent = fcUnknown;
                showToast('📝 Đã đánh dấu chưa biết!', false);
                nextCard();
            }

            flashcardEl.addEventListener('click', flipCard);
            document.getElementById('fcFlip').addEventListener('click', (e) => { e.stopPropagation(); flipCard(); });
            document.getElementById('fcNext').addEventListener('click', nextCard);
            document.getElementById('fcPrev').addEventListener('click', prevCard);
            document.getElementById('fcKnown').addEventListener('click', markKnown);
            document.getElementById('fcUnknown').addEventListener('click', markUnknown);

            // Keyboard shortcuts cho flashcard
            document.addEventListener('keydown', (e) => {
                const panel = document.getElementById('panel-flashcard');
                if (!panel.classList.contains('active')) return;
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                if (e.code === 'Space') { e.preventDefault(); flipCard(); }
                else if (e.code === 'ArrowRight') nextCard();
                else if (e.code === 'ArrowLeft') prevCard();
                else if (e.key === 'k' || e.key === 'K') markKnown();
                else if (e.key === 'j' || e.key === 'J') markUnknown();
            });

            // Filter flashcard
            document.querySelectorAll('#panel-flashcard .filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('#panel-flashcard .filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const cat = this.dataset.cat;
                    fcFiltered = cat === 'all' ? [...vocabulary] : vocabulary.filter(v => v.cat === cat);
                    fcFiltered = shuffleArray(fcFiltered);
                    fcIndex = 0;
                    renderFlashcard();
                    showToast(`Đã lọc: ${this.textContent} (${fcFiltered.length} thẻ)`, true);
                });
            });

            // Init flashcard
            fcFiltered = shuffleArray(fcFiltered);
            renderFlashcard();

            // ============================================================
            // MODE 2: TYPING
            // ============================================================
            let typingFiltered = [...vocabulary];
            let typingIndex = 0;
            let typingCorrectCount = 0;
            let typingWrongCount = 0;
            let typingHintShown = false;

            function normalize(str) {
                return str.toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[.,!?;:]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            }

            function renderTyping() {
                const word = typingFiltered[typingIndex];
                if (!word) return;

                document.getElementById('typingKorean').textContent = word.kr;
                document.getElementById('typingRoman').textContent = word.roman;
                document.getElementById('typingCurrent').textContent = typingIndex + 1;
                document.getElementById('typingTotal').textContent = typingFiltered.length;

                const progress = ((typingIndex + 1) / typingFiltered.length) * 100;
                document.getElementById('typingProgressBar').style.width = progress + '%';

                // Reset input
                const input = document.getElementById('typingInput');
                input.value = '';
                input.className = 'typing-input';
                input.focus();

                document.getElementById('typingFeedback').classList.remove('show');
                typingHintShown = false;
            }

            function checkTyping() {
                const word = typingFiltered[typingIndex];
                const input = document.getElementById('typingInput');
                const answer = normalize(input.value);

                if (!answer) {
                    showToast('Vui lòng nhập câu trả lời!', false);
                    return;
                }

                const correct = normalize(word.vi);

                if (answer === correct) {
                    input.classList.add('correct');
                    typingCorrectCount++;
                    document.getElementById('typingCorrect').textContent = typingCorrectCount;
                    showFeedback(true, word);
                    showToast('✅ Chính xác!', true);
                    setTimeout(() => nextTyping(), 1500);
                } else {
                    input.classList.add('incorrect');
                    typingWrongCount++;
                    document.getElementById('typingWrong').textContent = typingWrongCount;
                    showFeedback(false, word);
                    showToast('❌ Chưa đúng, thử lại nhé!', false);
                    setTimeout(() => {
                        input.classList.remove('incorrect');
                    }, 800);
                }

                updateTypingStats();
            }

            function showFeedback(isCorrect, word) {
                const fb = document.getElementById('typingFeedback');
                fb.classList.remove('correct', 'incorrect');
                fb.classList.add('show', isCorrect ? 'correct' : 'incorrect');
                document.getElementById('fbIcon').textContent = isCorrect ? '✅' : '❌';
                document.getElementById('fbText').textContent = isCorrect
                    ? 'Chính xác! Tuyệt vời!'
                    : `Chưa đúng. Đáp án là:`;
                document.getElementById('fbAnswer').textContent = `${word.kr} = ${word.vi}`;
            }

            function nextTyping() {
                if (typingIndex < typingFiltered.length - 1) {
                    typingIndex++;
                    renderTyping();
                } else {
                    showToast('🎉 Bạn đã hoàn thành! Xem kết quả bên phải!', true);
                }
            }

            function skipTyping() {
                const word = typingFiltered[typingIndex];
                showFeedback(false, word);
                typingWrongCount++;
                document.getElementById('typingWrong').textContent = typingWrongCount;
                updateTypingStats();
                setTimeout(() => nextTyping(), 1500);
            }

            function showHint() {
                const word = typingFiltered[typingIndex];
                if (!typingHintShown) {
                    showToast(`💡 Gợi ý: Bắt đầu bằng "${word.vi.substring(0, 3)}..."`, true);
                    typingHintShown = true;
                } else {
                    showToast(`💡 Đáp án: ${word.vi}`, true);
                }
            }

            function updateTypingStats() {
                const total = typingCorrectCount + typingWrongCount;
                document.getElementById('typingDone').textContent = total;
                const acc = total === 0 ? 0 : Math.round((typingCorrectCount / total) * 100);
                document.getElementById('typingAccuracy').textContent = acc + '%';
            }

            document.getElementById('typingCheck').addEventListener('click', checkTyping);
            document.getElementById('typingHint').addEventListener('click', showHint);
            document.getElementById('typingSkip').addEventListener('click', skipTyping);

            document.getElementById('typingInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkTyping();
            });

            document.addEventListener('keydown', (e) => {
                const panel = document.getElementById('panel-typing');
                if (!panel.classList.contains('active')) return;
                if (e.ctrlKey && e.key === 'h') { e.preventDefault(); showHint(); }
            });

            // Filter typing
            document.querySelectorAll('#panel-typing .filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('#panel-typing .filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const cat = this.dataset.cat;
                    typingFiltered = cat === 'all' ? [...vocabulary] : vocabulary.filter(v => v.cat === cat);
                    typingFiltered = shuffleArray(typingFiltered);
                    typingIndex = 0;
                    typingCorrectCount = 0;
                    typingWrongCount = 0;
                    document.getElementById('typingCorrect').textContent = '0';
                    document.getElementById('typingWrong').textContent = '0';
                    document.getElementById('typingDone').textContent = '0';
                    document.getElementById('typingAccuracy').textContent = '0%';
                    renderTyping();
                    showToast(`Đã lọc: ${this.textContent} (${typingFiltered.length} từ)`, true);
                });
            });

            renderTyping();

            // ============================================================
            // MODE 3: CHATBOT
            // ============================================================
            let chatLang = 'vi';
            let chatMsgCount = 0;
            let chatStartTime = Date.now();

            const chatMessages = document.getElementById('chatMessages');

            function getTimeString() {
                const d = new Date();
                return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
            }

            function addMessage(type, content, options = {}) {
                const msg = document.createElement('div');
                msg.className = 'message ' + type;

                const avatar = type === 'bot' ? '🤖' : '👩';

                let bubbleContent = '';
                if (options.korean) {
                    bubbleContent += `<span class="msg-korean">${options.korean}</span>`;
                }
                if (options.roman) {
                    bubbleContent += `<span class="msg-romanization">${options.roman}</span>`;
                }
                if (content) {
                    bubbleContent += content;
                }
                if (options.translation) {
                    bubbleContent += `<div class="msg-translation"><i class="fas fa-language"></i> ${options.translation}</div>`;
                }

                msg.innerHTML = `
                    <div class="msg-avatar">${avatar}</div>
                    <div>
                        <div class="msg-bubble">${bubbleContent}</div>
                        <div class="msg-time">${getTimeString()}</div>
                    </div>
                `;

                chatMessages.appendChild(msg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                chatMsgCount++;
                document.getElementById('chatMsgCount').textContent = chatMsgCount;
            }

            function showTypingIndicator() {
                const indicator = document.createElement('div');
                indicator.className = 'message bot';
                indicator.id = 'typingIndicator';
                indicator.innerHTML = `
                    <div class="msg-avatar">🤖</div>
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                `;
                chatMessages.appendChild(indicator);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            function removeTypingIndicator() {
                const ind = document.getElementById('typingIndicator');
                if (ind) ind.remove();
            }

            function findInDictionary(text) {
                const normalized = normalize(text);
                for (const [key, value] of Object.entries(dictionary.vi2kr)) {
                    if (normalize(key) === normalized) return value;
                }
                return null;
            }

            function findKoreanMeaning(text) {
                // Tìm trong vocabulary
                const trimmed = text.trim();
                for (const word of vocabulary) {
                    if (word.kr === trimmed) {
                        return { vi: word.vi, roman: word.roman };
                    }
                }
                // Tìm trong dictionary
                for (const value of Object.values(dictionary.vi2kr)) {
                    if (value.kr === trimmed) {
                        for (const [viKey, v] of Object.entries(dictionary.vi2kr)) {
                            if (v.kr === trimmed) {
                                return { vi: viKey, roman: v.roman };
                            }
                        }
                    }
                }
                return null;
            }

            function sendChatMessage() {
                const input = document.getElementById('chatInput');
                const text = input.value.trim();
                if (!text) return;

                // Thêm tin nhắn user
                addMessage('user', text);
                input.value = '';

                // Xử lý
                showTypingIndicator();

                setTimeout(() => {
                    removeTypingIndicator();
                    processMessage(text);
                }, 800);
            }

            function processMessage(text) {
                const isKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);

                if (isKorean) {
                    // Hàn → Việt
                    const meaning = findKoreanMeaning(text);
                    if (meaning) {
                        addMessage('bot',
                            `<span class="msg-korean">${text}</span>`,
                            {
                                roman: meaning.roman,
                                translation: `🇻🇳 ${meaning.vi}`
                            }
                        );
                        updateChatWordCount();
                    } else {
                        addMessage('bot',
                            `Xin lỗi, mình chưa có từ <span class="msg-korean">"${text}"</span> trong từ điển. Bạn thử từ khác nhé!`,
                            {}
                        );
                    }
                } else {
                    // Việt → Hàn
                    const result = findInDictionary(text);
                    if (result) {
                        addMessage('bot',
                            `🇻🇳 "${text}" dịch sang tiếng Hàn là:`,
                            {
                                korean: result.kr,
                                roman: result.roman,
                                translation: `🇰🇷 ${result.kr}`
                            }
                        );
                        updateChatWordCount();
                    } else {
                        // Thử tìm từ đơn trong câu
                        const words = normalize(text).split(' ');
                        let found = false;
                        for (const w of words) {
                            const r = findInDictionary(w);
                            if (r) {
                                addMessage('bot',
                                    `Mình tìm thấy từ <strong>"${w}"</strong> trong câu của bạn:`,
                                    {
                                        korean: r.kr,
                                        roman: r.roman,
                                        translation: `🇰🇷 ${r.kr}`
                                    }
                                );
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            addMessage('bot',
                                `Xin lỗi, mình chưa biết dịch "<strong>${text}</strong>". Bạn thử các từ đơn giản như: Xin chào, Cảm ơn, Tôi yêu bạn nhé!`,
                                {}
                            );
                        }
                    }
                }
            }

            function updateChatWordCount() {
                const current = parseInt(document.getElementById('chatWordCount').textContent) || 0;
                document.getElementById('chatWordCount').textContent = current + 1;
            }

            document.getElementById('chatSend').addEventListener('click', sendChatMessage);

            document.getElementById('chatInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                }
            });

            // Language toggle
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    chatLang = this.dataset.lang;
                    const input = document.getElementById('chatInput');
                    input.placeholder = chatLang === 'vi'
                        ? 'Nhập tin nhắn tiếng Việt... (VD: Xin chào)'
                        : '한국어로 입력하세요... (예: 안녕하세요)';
                    input.focus();
                });
            });

            // Quick chips
            document.querySelectorAll('.quick-chip').forEach(chip => {
                chip.addEventListener('click', function() {
                    document.getElementById('chatInput').value = this.dataset.text;
                    sendChatMessage();
                });
            });

            // Scene buttons
            const sceneMessages = {
                greeting: 'Xin chào',
                restaurant: 'Tôi đói',
                shopping: 'Bao nhiêu tiền',
                love: 'Tôi yêu bạn'
            };

            document.querySelectorAll('.scene-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const scene = this.dataset.scene;
                    if (sceneMessages[scene]) {
                        document.getElementById('chatInput').value = sceneMessages[scene];
                        sendChatMessage();
                    }
                });
            });

            // Reset chat
            document.getElementById('chatReset').addEventListener('click', () => {
                chatMessages.innerHTML = '';
                chatMsgCount = 0;
                document.getElementById('chatMsgCount').textContent = '0';
                document.getElementById('chatWordCount').textContent = '0';
                chatStartTime = Date.now();
                initChat();
                showToast('Đã bắt đầu cuộc trò chuyện mới!', true);
            });

            document.getElementById('chatInfo').addEventListener('click', () => {
                showToast('Chatbot hỗ trợ dịch Việt ↔ Hàn cơ bản! 💬', true);
            });

            function initChat() {
                addMessage('bot',
                    `안녕하세요! Xin chào bạn! 👋<br>Mình là chatbot Hàn Ngữ Teddy. Bạn có thể:<br>
                    • Gõ <strong>tiếng Việt</strong> để dịch sang tiếng Hàn<br>
                    • Gõ <strong>tiếng Hàn</strong> để dịch ngược lại<br>
                    Hãy thử ngay nhé!`,
                    {}
                );
            }

            // Update chat time
            setInterval(() => {
                const elapsed = Math.floor((Date.now() - chatStartTime) / 1000);
                const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const s = (elapsed % 60).toString().padStart(2, '0');
                const el = document.getElementById('chatTime');
                if (el) el.textContent = `${m}:${s}`;
            }, 1000);

            initChat();

            // ============ WELCOME ============
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast('Chào mừng bạn đến với Hàn Ngữ Teddy! 🇰🇷', true);
                }, 600);
            });

        })();
