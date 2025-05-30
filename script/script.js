
        // =========================
        // MOBILE MENU TOGGLE
        // =========================
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.getElementById('main-nav');
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            // Update aria-expanded for accessibility
            menuToggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
        });

        // Close menu on nav link click (mobile)
        document.querySelectorAll('header nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
            });
        });

        // =========================
        // ANIMATED SUBTITLE (TYPEWRITER EFFECT)
        // =========================
        const subtitles = [
            "web dev amateur.",
            "linux enjoyer.",
            "open source.",
            "maximalist.",
            "student @ kth.org.",
            "learning.",
            "i use arch btw.",
            "noob dev.",
            "looking for 'praktikplats'.",
            "tech.",
            "stuff.",
            "will code for coinies.",
            "all i want is monies.",
            "gimme monies.",
            "i love money."
        ];
        let subtitleIndex = 0;
        const subtitleEl = document.getElementById('site-subtitle');

        // Helper to set subtitle text with blinking cursor
        function setSubtitleWithCursor(text) {
            subtitleEl.innerHTML = `<span class="subtitle-text">${text}</span><span class="subtitle-cursor">▌</span>`;
        }

        // Typewriter effect with persistent blinking cursor
        function typeSubtitle(text, cb) {
            let i = 0;
            function type() {
                setSubtitleWithCursor(text.slice(0, i));
                if (i < text.length) {
                    i++;
                    setTimeout(type, 55);
                } else if (cb) {
                    setTimeout(cb, 900);
                }
            }
            type();
        }

        // Cycle to next subtitle
        function nextSubtitle() {
            subtitleIndex = (subtitleIndex + 1) % subtitles.length;
            typeSubtitle(subtitles[subtitleIndex], () => {
                setTimeout(nextSubtitle, 1200);
            });
        }

        // Start the animation on page load
        typeSubtitle(subtitles[subtitleIndex], () => {
            setTimeout(nextSubtitle, 1200);
        });

        // Content Warning Modal logic
        const modal = document.getElementById('content-warning-modal');
        const acceptBtn = document.getElementById('content-warning-accept');
        if (modal && acceptBtn) {
            acceptBtn.onclick = () => {
                modal.classList.add('hide');
                setTimeout(() => { modal.style.display = 'none'; }, 400);
            };
        }

        // =========================
        // BACK TO TOP BUTTON
        // =========================
        const backToTop = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
