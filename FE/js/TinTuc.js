(function() {
            // ============ TOAST ============
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

            // ============ CART COUNT ============
            const headerCartCount = document.getElementById('headerCartCount');
            let cartCount = 0;

            function updateCartBadge() {
                headerCartCount.textContent = cartCount;
                headerCartCount.style.transform = 'scale(1.3)';
                setTimeout(() => headerCartCount.style.transform = 'scale(1)', 200);
            }

            // ============ MODAL ============
            const postModal = document.getElementById('postModal');
            const openPostModalBtn = document.getElementById('openPostModal');
            const closeModalBtn = document.getElementById('closeModal');
            const cancelBtn = document.getElementById('cancelBtn');

            function openModal() {
                postModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                postModal.classList.remove('show');
                document.body.style.overflow = '';
            }

            openPostModalBtn.addEventListener('click', openModal);
            closeModalBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);

            postModal.addEventListener('click', (e) => {
                if (e.target === postModal) closeModal();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && postModal.classList.contains('show')) {
                    closeModal();
                }
            });

            // ============ EMOJI PICKER ============
            document.getElementById('emojiPicker').addEventListener('click', (e) => {
                const btn = e.target.closest('.emoji-btn');
                if (!btn) return;
                const emoji = btn.dataset.emoji;
                const content = document.getElementById('postContent');
                content.value += emoji;
                content.focus();
            });

            // ============ CREATE POST ============
            function createPostElement(title, content, category) {
                const categoryMap = {
                    collection: { icon: 'fa-star', name: 'Khoe bộ sưu tập' },
                    review: { icon: 'fa-thumbs-up', name: 'Đánh giá sản phẩm' },
                    question: { icon: 'fa-question-circle', name: 'Hỏi đáp' },
                    diy: { icon: 'fa-scissors', name: 'Tự làm gấu' },
                    chat: { icon: 'fa-coffee', name: 'Tán gẫu' }
                };
                const cat = categoryMap[category] || categoryMap.chat;

                // Detect emoji làm ảnh giả lập nếu có
                const emojis = content.match(/[\u{1F300}-\u{1FAFF}]/gu);
                const imageHtml = emojis && emojis.length >= 2
                    ? `<div class="post-image">${emojis.slice(0, 5).join('')}</div>`
                    : '';

                // Escape HTML
                const escapeHtml = (str) => str.replace(/[&<>"']/g, m => ({
                    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
                }[m]));

                const safeTitle = escapeHtml(title);
                const safeContent = escapeHtml(content);

                const article = document.createElement('article');
                article.className = 'post-card';
                article.dataset.category = category;
                article.dataset.likes = '0';
                article.innerHTML = `
                    <div class="post-header">
                        <div class="post-avatar">👩</div>
                        <div class="post-meta">
                            <div class="post-author">
                                <strong>Mai Anh</strong>
                                <span class="author-badge"><i class="fas fa-crown"></i> Vàng</span>
                            </div>
                            <div class="post-time">
                                <i class="fas fa-clock"></i> Vừa xong • <i class="fas fa-eye"></i> 1 lượt xem
                            </div>
                        </div>
                        <button class="post-menu"><i class="fas fa-ellipsis-h"></i></button>
                    </div>
                    <span class="post-category"><i class="fas ${cat.icon}"></i> ${cat.name}</span>
                    <h3 class="post-title">${safeTitle}</h3>
                    <p class="post-content">${safeContent.replace(/\n/g, '<br>')}</p>
                    ${imageHtml}
                    <div class="post-actions">
                        <button class="action-btn like-btn"><i class="far fa-heart"></i> <span class="like-count">0</span></button>
                        <button class="action-btn comment-toggle"><i class="far fa-comment"></i> 0 bình luận</button>
                        <button class="action-btn share-btn"><i class="fas fa-share"></i> <span class="hide-sm">Chia sẻ</span></button>
                        <button class="action-btn bookmark-btn"><i class="far fa-bookmark"></i></button>
                    </div>
                    <div class="comments-section">
                        <div class="comment-form">
                            <div class="comment-avatar">👩</div>
                            <div class="comment-input-wrap">
                                <input type="text" class="comment-input" placeholder="Viết bình luận...">
                                <button class="btn-send-comment"><i class="fas fa-paper-plane"></i></button>
                            </div>
                        </div>
                        <div class="comments-list"></div>
                    </div>
                `;
                return article;
            }

            // Submit post
            document.getElementById('submitPost').addEventListener('click', function() {
                const title = document.getElementById('postTitle').value.trim();
                const content = document.getElementById('postContent').value.trim();
                const category = document.getElementById('postCategory').value;

                if (!title) {
                    showToast('Vui lòng nhập tiêu đề bài viết!', false);
                    document.getElementById('postTitle').focus();
                    return;
                }
                if (!content) {
                    showToast('Vui lòng nhập nội dung bài viết!', false);
                    document.getElementById('postContent').focus();
                    return;
                }

                const newPost = createPostElement(title, content, category);
                const postList = document.getElementById('postList');
                postList.insertBefore(newPost, postList.firstChild);

                // Reset form
                document.getElementById('postTitle').value = '';
                document.getElementById('postContent').value = '';
                document.getElementById('postCategory').value = 'collection';

                closeModal();
                showToast('Đã đăng bài thành công! 🎉', true);

                // Scroll to new post
                newPost.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Re-bind sự kiện cho post mới
                bindPostEvents(newPost);
            });

            // ============ QUICK POST ============
            document.getElementById('quickPostBtn').addEventListener('click', function() {
                const input = document.getElementById('quickInput');
                const content = input.value.trim();
                if (!content) {
                    showToast('Hãy viết gì đó trước khi đăng nhé!', false);
                    input.focus();
                    return;
                }

                const title = content.length > 60 ? content.substring(0, 60) + '...' : content;
                const newPost = createPostElement(title, content, 'chat');
                const postList = document.getElementById('postList');
                postList.insertBefore(newPost, postList.firstChild);

                input.value = '';
                showToast('Đã đăng bài thành công! 🎉', true);
                newPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
                bindPostEvents(newPost);
            });

            // ============ POST EVENTS BINDING ============
            function bindPostEvents(post) {
                // Like
                const likeBtn = post.querySelector('.like-btn');
                if (likeBtn) {
                    likeBtn.addEventListener('click', function() {
                        const icon = this.querySelector('i');
                        const countEl = this.querySelector('.like-count');
                        let count = parseInt(countEl.textContent, 10);

                        if (this.classList.contains('liked')) {
                            this.classList.remove('liked');
                            icon.className = 'far fa-heart';
                            count--;
                            countEl.textContent = count;
                        } else {
                            this.classList.add('liked');
                            icon.className = 'fas fa-heart';
                            count++;
                            countEl.textContent = count;
                            showToast('Đã thích bài viết! 💖', true);
                        }
                    });
                }

                // Comment toggle
                const commentToggle = post.querySelector('.comment-toggle');
                const commentsSection = post.querySelector('.comments-section');
                if (commentToggle && commentsSection) {
                    commentToggle.addEventListener('click', function() {
                        const isOpen = commentsSection.classList.contains('open');
                        // Đóng tất cả comment khác
                        document.querySelectorAll('.comments-section.open').forEach(s => {
                            if (s !== commentsSection) s.classList.remove('open');
                        });
                        commentsSection.classList.toggle('open');
                        this.classList.toggle('active-comments', !isOpen);

                        // Update comment count
                        const commentCount = commentsSection.querySelectorAll('.comment-item').length;
                        const icon = this.querySelector('i');
                        const textNode = this.childNodes[2];
                        this.innerHTML = `<i class="far fa-comment"></i> ${commentCount} bình luận`;
                        if (commentsSection.classList.contains('open')) {
                            this.classList.add('active-comments');
                        }
                    });
                }

                // Send comment
                const sendBtn = post.querySelector('.btn-send-comment');
                const commentInput = post.querySelector('.comment-input');
                const commentsList = post.querySelector('.comments-list');
                const commentToggleBtn = post.querySelector('.comment-toggle');

                if (sendBtn && commentInput) {
                    const sendComment = () => {
                        const text = commentInput.value.trim();
                        if (!text) {
                            showToast('Vui lòng nhập nội dung bình luận!', false);
                            return;
                        }

                        const comment = document.createElement('div');
                        comment.className = 'comment-item';
                        comment.innerHTML = `
                            <div class="comment-avatar">👩</div>
                            <div class="comment-content">
                                <div class="comment-header">
                                    <strong>Mai Anh</strong>
                                    <span>Vừa xong</span>
                                </div>
                                <p>${text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}</p>
                                <div class="comment-actions">
                                    <button>Thích</button>
                                    <button>Trả lời</button>
                                </div>
                            </div>
                        `;
                        commentsList.appendChild(comment);
                        commentInput.value = '';

                        // Update count
                        const count = commentsList.querySelectorAll('.comment-item').length;
                        if (commentToggleBtn) {
                            commentToggleBtn.innerHTML = `<i class="far fa-comment"></i> ${count} bình luận`;
                            commentToggleBtn.classList.add('active-comments');
                        }

                        showToast('Đã gửi bình luận! 💬', true);
                    };

                    sendBtn.addEventListener('click', sendComment);
                    commentInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') sendComment();
                    });
                }

                // Share
                const shareBtn = post.querySelector('.share-btn');
                if (shareBtn) {
                    shareBtn.addEventListener('click', () => {
                        showToast('Đã sao chép liên kết bài viết! 🔗', true);
                    });
                }

                // Bookmark
                const bookmarkBtn = post.querySelector('.bookmark-btn');
                if (bookmarkBtn) {
                    bookmarkBtn.addEventListener('click', function() {
                        this.classList.toggle('liked');
                        const icon = this.querySelector('i');
                        if (this.classList.contains('liked')) {
                            icon.className = 'fas fa-bookmark';
                            showToast('Đã lưu bài viết! 📌', true);
                        } else {
                            icon.className = 'far fa-bookmark';
                        }
                    });
                }

                // Post menu
                const postMenu = post.querySelector('.post-menu');
                if (postMenu) {
                    postMenu.addEventListener('click', () => {
                        showToast('Tính năng đang phát triển', false);
                    });
                }
            }

            // Bind all existing posts
            document.querySelectorAll('.post-card').forEach(bindPostEvents);

            // ============ CATEGORY FILTER ============
            document.querySelectorAll('.category-list a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelectorAll('.category-list a').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

                    const cat = this.dataset.cat;
                    const posts = document.querySelectorAll('.post-card');
                    let visibleCount = 0;

                    posts.forEach(post => {
                        if (cat === 'all' || post.dataset.category === cat) {
                            post.style.display = '';
                            visibleCount++;
                        } else {
                            post.style.display = 'none';
                        }
                    });

                    showToast(`Đã lọc: ${this.textContent.trim().replace(/\d+/g, '').trim()} (${visibleCount} bài)`, true);
                });
            });

            // ============ SORT FILTER ============
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    const sort = this.dataset.sort;
                    const postList = document.getElementById('postList');
                    const posts = Array.from(postList.querySelectorAll('.post-card'));

                    if (sort === 'popular') {
                        posts.sort((a, b) => parseInt(b.dataset.likes) - parseInt(a.dataset.likes));
                    } else if (sort === 'trending') {
                        posts.sort((a, b) => (parseInt(b.dataset.likes) * 0.7 + Math.random() * 100) - (parseInt(a.dataset.likes) * 0.7 + Math.random() * 100));
                    } else if (sort === 'new') {
                        // Reverse DOM order (giả lập mới nhất)
                        posts.reverse();
                    }

                    posts.forEach(p => postList.appendChild(p));
                    showToast('Đã sắp xếp lại bài viết', true);
                });
            });

            // ============ LOAD MORE ============
            document.getElementById('loadMoreBtn').addEventListener('click', function() {
                const btn = this;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
                setTimeout(() => {
                    // Tạo thêm 2 bài viết mẫu
                    const samplePosts = [
                        {
                            title: 'Gấu bông phiên bản giới hạn mùa thu 2025 đã về! 🍂',
                            content: 'Mình vừa nhận được thông tin từ Teddy Yêu Thương về bộ sưu tập mùa thu mới. Lần này có 5 mẫu gấu với tông màu vàng cam ấm áp cực xinh. Ai muốn xem ảnh thì comment nhé!',
                            category: 'chat'
                        },
                        {
                            title: 'Cách bảo quản gấu bông luôn thơm và mềm mại 🌸',
                            content: 'Sau nhiều năm sưu tầm gấu, mình đúc kết được vài tips bảo quản: 1) Không giặt máy, 2) Dùng túi thơm lavender để trong tủ, 3) Phơi nắng nhẹ 30 phút mỗi tháng. Ai có tips gì thêm chia sẻ nhé!',
                            category: 'diy'
                        }
                    ];

                    samplePosts.forEach((sp, i) => {
                        const newPost = createPostElement(sp.title, sp.content, sp.category);
                        newPost.dataset.likes = Math.floor(Math.random() * 300) + 50;
                        newPost.querySelector('.like-count').textContent = newPost.dataset.likes;
                        document.getElementById('postList').appendChild(newPost);
                        bindPostEvents(newPost);
                    });

                    btn.innerHTML = '<i class="fas fa-check"></i> Đã tải xong';
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fas fa-arrow-down"></i> Xem thêm bài viết';
                    }, 1500);

                    showToast('Đã tải thêm 2 bài viết! 📝', true);
                }, 800);
            });

            // ============ TAG CLOUD ============
            document.querySelectorAll('.tag-item').forEach(tag => {
                tag.addEventListener('click', function(e) {
                    e.preventDefault();
                    showToast(`Đang tìm bài viết với tag ${this.textContent}`, true);
                });
            });

            // ============ INIT ============
            updateCartBadge();

            // Welcome
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast('Chào mừng bạn đến với Cộng đồng Teddy! 💛', true);
                }, 600);
            });

        })();
