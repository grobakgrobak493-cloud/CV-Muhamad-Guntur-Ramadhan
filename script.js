console.log("Portofolio JS Loaded: Version 3.21 Active");
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    /* ==========================================================================
       Navbar Scroll State
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const closeMobileMenu = () => {
        if (navMenu && navMenu.classList.contains('active')) {
            console.log("Closing mobile menu via gesture/scroll trigger");
            navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }
        }
    };

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        closeMobileMenu();
    });

    // Close mobile menu when user swipes or uses mouse wheel over the screen
    window.addEventListener('wheel', closeMobileMenu, { passive: true });
    window.addEventListener('touchmove', closeMobileMenu, { passive: true });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && mobileToggle) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });

    let isScrollingFromClick = false;
    let scrollTimeout;

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            isScrollingFromClick = true;
            clearTimeout(scrollTimeout);

            // Set active class and indicator immediately on click
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateIndicator(link);

            scrollTimeout = setTimeout(() => {
                isScrollingFromClick = false;
            }, 800);

            if (navMenu.classList.contains('active')) {
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.classList.remove('active');
                    }
                }, 150);
            }
        });
    });

    /* ==========================================================================
       Sliding Navigation Indicator
       ========================================================================== */
    const navIndicator = document.getElementById('navIndicator');

    function updateIndicator(activeLink) {
        if (!navMenu || !navIndicator || window.innerWidth <= 768) return;
        const menuRect = navMenu.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const leftPos = linkRect.left - menuRect.left;
        
        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.transform = `translate3d(${leftPos}px, 0, 0)`;
    }



    // Trigger on resize & load
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-link.active') || navLinks[0];
        updateIndicator(currentActive);
    });

    setTimeout(() => {
        const currentActive = document.querySelector('.nav-link.active') || navLinks[0];
        updateIndicator(currentActive);
    }, 200);

    /* ==========================================================================
       Typewriter Effect
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const roles = ['Mahasiswa Sistem Informasi', 'UI/UX Designer & Analyst', 'Frontend Web Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeDelay = 2000; // Pause at the end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 500; // Pause before starting next word
        }

        setTimeout(type, typeDelay);
    }

    if (typewriterElement) {
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       Intersection Observer: Scroll Reveal & Active Sections
       ========================================================================== */
    // Scroll Reveal Animation Trigger
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve if we only want animation once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // Scrollspy: Navbar Active State on Scroll
    const sections = document.querySelectorAll('section');
    
    const scrollspyObserver = new IntersectionObserver((entries) => {
        if (isScrollingFromClick) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        updateIndicator(link);
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-10% 0px -30% 0px'
    });

    sections.forEach(section => scrollspyObserver.observe(section));

    // Handle scroll to bottom of page (forcing Contact/Last Section highlight)
    window.addEventListener('scroll', () => {
        if (isScrollingFromClick) return;
        
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            const contactLink = document.querySelector('a[href="#contact"]');
            if (contactLink && !contactLink.classList.contains('active')) {
                navLinks.forEach(l => l.classList.remove('active'));
                contactLink.classList.add('active');
                updateIndicator(contactLink);
            }
        }
    });

    /* ==========================================================================
       Project Filter Gallery
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons and add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Animating out before hiding
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match transition duration
                }
            });
        });
    });

    /* ==========================================================================
       Project Details Modals
       ========================================================================== */
    const openModalButtons = document.querySelectorAll('.open-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const modals = document.querySelectorAll('.modal');

    // Open Modal
    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent main page scrolling
            }
        });
    });

    // Close Modal Function
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore page scrolling
    }

    // Close on button click
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Close on overlay click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });

    /* ==========================================================================
       Contact Form Handler
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnIcon = document.getElementById('btnIcon');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Check if running on local file system (CORS will block AJAX)
            if (window.location.protocol === 'file:') {
                contactForm.action = "https://formsubmit.co/7df813bbb1c3bc53982310c8a5e84ff1";
                contactForm.method = "POST";
                return; // Let the browser submit it naturally to bypass CORS
            }

            e.preventDefault();

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            const btnText = document.getElementById('submitBtnText');
            const btnIcon = document.getElementById('btnIcon');
            const btnSpinner = document.getElementById('submitBtnSpinner');
            if (btnText) btnText.textContent = 'Mengirim...';
            if (btnIcon) btnIcon.style.display = 'none';
            if (btnSpinner) btnSpinner.style.display = 'inline-block';
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Send via FormSubmit AJAX API using the secure token
            const secureEndpoint = "https://formsubmit.co/ajax/7df813bbb1c3bc53982310c8a5e84ff1";
            fetch(secureEndpoint, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Terjadi kesalahan saat mengirim pesan.');
                }
                return response.json();
            })
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                if (btnText) btnText.textContent = 'Kirim Pesan';
                if (btnIcon) btnIcon.style.display = 'inline-block';
                if (btnSpinner) btnSpinner.style.display = 'none';

                formFeedback.textContent = 'Pesan Anda berhasil dikirim! Silakan periksa email Anda (termasuk spam) untuk memverifikasi pengiriman pertama kali.';
                formFeedback.classList.add('success');

                // Clear input fields
                contactForm.reset();

                // Clear feedback after 7 seconds
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.classList.remove('success');
                }, 7000);
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                if (btnText) btnText.textContent = 'Kirim Pesan';
                if (btnIcon) btnIcon.style.display = 'inline-block';
                if (btnSpinner) btnSpinner.style.display = 'none';

                formFeedback.textContent = 'Gagal mengirim pesan. Silakan coba kembali beberapa saat lagi.';
                formFeedback.classList.add('error');

                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.classList.remove('error');
                }, 5000);
            });
        });
    }

    /* ==========================================================================
       Floating Music Player Controller (With Floating Musical Notes)
       ========================================================================== */
    const musicWidget = document.getElementById('musicWidget');
    const bgAudio = document.getElementById('bgAudio');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const playBtn = document.getElementById('playBtn');

    if (musicWidget && bgAudio && musicToggleBtn && playBtn) {
        // Set volume to 0.15 for comfortable background play
        bgAudio.volume = 0.15;
        // Autoplay on first user interaction (browser policy compliant)
        let hasInteracted = false;
        let noteInterval = null;

        function startFloatingNotes() {
            if (noteInterval) clearInterval(noteInterval);
            noteInterval = setInterval(() => {
                if (musicWidget.classList.contains('playing')) {
                    createFloatingNote();
                }
            }, 1200);
        }

        function stopFloatingNotes() {
            if (noteInterval) {
                clearInterval(noteInterval);
                noteInterval = null;
            }
        }

        function createFloatingNote() {
            const noteSymbols = ['🎵', '🎶', '♪', '♩', '♫', '🎹', '✨'];
            const randomSymbol = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
            
            const note = document.createElement('div');
            note.className = 'floating-note';
            note.textContent = randomSymbol;
            
            const rect = musicWidget.getBoundingClientRect();
            note.style.position = 'fixed';
            note.style.left = `${rect.left + rect.width / 2}px`;
            note.style.top = `${rect.top}px`;
            note.style.fontSize = `${Math.random() * 8 + 14}px`;
            note.style.color = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#8b5cf6';
            note.style.textShadow = `0 0 10px rgba(var(--accent-color-rgb), 0.6)`;
            note.style.pointerEvents = 'none';
            note.style.zIndex = '9998';
            note.style.transition = 'all 2.2s cubic-bezier(0.1, 0.8, 0.3, 1)';
            note.style.opacity = '0.9';
            
            document.body.appendChild(note);
            
            const swayDistance = (Math.random() - 0.5) * 80;
            const floatHeight = Math.random() * 90 + 90;
            
            // Force reflow
            note.offsetHeight;
            
            note.style.transform = `translate3d(${swayDistance}px, -${floatHeight}px, 0) scale(1.3) rotate(${Math.random() * 40 - 20}deg)`;
            note.style.opacity = '0';
            
            setTimeout(() => {
                note.remove();
            }, 2200);
        }

        function tryAutoplay() {
            if (hasInteracted) return;
            hasInteracted = true;

            bgAudio.play()
                .then(() => {
                    musicWidget.classList.add('playing');
                    startFloatingNotes();
                    removeInteractionListeners();
                })
                .catch(err => {
                    // Reset if failed (browser blocked it)
                    hasInteracted = false;
                    console.log("Autoplay waiting for user interaction gesture...");
                });
        }

        function removeInteractionListeners() {
            hasInteracted = true; // prevent any further triggers
            document.removeEventListener('click', tryAutoplay);
            document.removeEventListener('scroll', tryAutoplay);
            document.removeEventListener('keydown', tryAutoplay);
            document.removeEventListener('touchstart', tryAutoplay);
        }

        // Add event listeners for autoplay
        document.addEventListener('click', tryAutoplay);
        document.addEventListener('scroll', tryAutoplay);
        document.addEventListener('keydown', tryAutoplay);
        document.addEventListener('touchstart', tryAutoplay);

        // Expand player on clicking when collapsed
        musicWidget.addEventListener('click', (e) => {
            if (musicWidget.classList.contains('collapsed')) {
                musicWidget.classList.remove('collapsed');
                musicWidget.classList.add('expanded');
            }
        });

        // Collapse player on clicking the toggle button when expanded
        musicToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent expanding immediately from the widget's click handler
            
            if (musicWidget.classList.contains('expanded')) {
                musicWidget.classList.remove('expanded');
                musicWidget.classList.add('collapsed');
            } else {
                musicWidget.classList.remove('collapsed');
                musicWidget.classList.add('expanded');
            }
        });

        // Toggle Play/Pause
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering any widget expansion/collapse click handler
            removeInteractionListeners(); // User interacted manually, cancel autoplay script
            
            if (bgAudio.paused) {
                bgAudio.play()
                    .then(() => {
                        musicWidget.classList.add('playing');
                        startFloatingNotes();
                    })
                    .catch(err => {
                        console.error("Audio playback failed:", err);
                    });
            } else {
                bgAudio.pause();
                musicWidget.classList.remove('playing');
                stopFloatingNotes();
            }
        });

        // Handle Audio Element End
        bgAudio.addEventListener('ended', () => {
            musicWidget.classList.remove('playing');
            stopFloatingNotes();
        });
    }

    /* ==========================================================================
       Interactive Custom Accent Theme Switcher
       ========================================================================== */
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (themeButtons.length > 0) {
        // Load saved theme if any
        const savedTheme = localStorage.getItem('portfolio-theme') || 'violet';
        document.body.className = `theme-${savedTheme}`;
        
        // Update active class on button
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === savedTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        themeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all theme buttons
                themeButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Set theme class on body
                const theme = btn.getAttribute('data-theme');
                document.body.className = `theme-${theme}`;
                
                // Save theme choice
                localStorage.setItem('portfolio-theme', theme);

                // Trigger a beautiful color particle burst at the clicked button
                if (window.triggerParticleBurst) {
                    const rect = btn.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    window.triggerParticleBurst(x, y, 35);
                }
            });
        });
    }

    /* ==========================================================================
       Terminal Emulator Logic (With Startup Boot Sequence & Typewriter Outputs)
       ========================================================================== */
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalButtons = document.querySelectorAll('.terminal-btn');
    const terminalCard = document.querySelector('.terminal-card');

    if (terminalInput && terminalOutput) {
        // Run interactive system boot animation
        const runBootSequence = () => {
            terminalOutput.innerHTML = '';
            terminalInput.disabled = true;
            terminalInput.placeholder = 'System booting...';
            
            const bootLines = [
                { text: '<span class="keyword">INITIALIZING GUNTUR.DEV OS CORE 3.8.0...</span>', delay: 80 },
                { text: '<span class="text-muted">[   0.032 ] BIOS: Checking system components... OK</span>', delay: 180 },
                { text: '<span class="text-muted">[   0.098 ] CPU: 8x Core @ 2.40GHz... OK</span>', delay: 120 },
                { text: '<span class="text-muted">[   0.210 ] MEM: 16GB Virtual Memory allocated... OK</span>', delay: 100 },
                { text: '<span class="text-muted">[   0.345 ] NET: Establishing handshake with netlify.app... OK</span>', delay: 200 },
                { text: '<span class="text-muted">[   0.490 ] IOT: Fetching state for Visitor Counter sensor... OK</span>', delay: 150 },
                { text: '<span class="string">[ SUCCESS ] Connection secure. Terminal loaded.</span>', delay: 180 },
                { text: '<br>', delay: 80 },
                { text: '<div class="terminal-line text-muted">Muhamad Guntur Ramadhan - Portfolio Terminal v3.8</div>', delay: 30 },
                { text: '<div class="terminal-line text-muted">Ketik perintah <span class="keyword">help</span> atau klik tombol di bawah untuk interaksi.</div>', delay: 30 }
            ];

            let lineIndex = 0;
            const printNextBootLine = () => {
                if (lineIndex < bootLines.length) {
                    printLine(bootLines[lineIndex].text);
                    lineIndex++;
                    setTimeout(printNextBootLine, bootLines[lineIndex - 1].delay);
                } else {
                    terminalInput.disabled = false;
                    terminalInput.placeholder = 'Ketik perintah di sini...';
                    if (window.innerWidth > 768) {
                        terminalInput.focus();
                    }
                }
            };
            printNextBootLine();
        };

        // Expose boot sequence globally to be triggered by preloader
        window.runTerminalBootSequence = runBootSequence;

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim();
                executeCommand(cmd);
                terminalInput.value = '';
            }
        });

        if (terminalCard) {
            terminalCard.addEventListener('click', () => {
                if (!terminalInput.disabled) {
                    terminalInput.focus();
                }
            });
        }

        terminalButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (terminalInput.disabled) return;
                const cmd = btn.getAttribute('data-cmd');
                executeCommand(cmd);
                terminalInput.focus();
            });
        });

        function printLine(text, type = '') {
            const line = document.createElement('div');
            line.className = 'terminal-line ' + type;
            line.innerHTML = text;
            terminalOutput.appendChild(line);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        // HTML-aware Typewriter output printing for realistic feel
        function printTypewriterLine(text, type = '', speed = 6) {
            terminalInput.disabled = true;
            terminalInput.placeholder = 'Processing output...';
            
            const line = document.createElement('div');
            line.className = 'terminal-line ' + type;
            terminalOutput.appendChild(line);
            
            const temp = document.createElement('div');
            temp.innerHTML = text;
            const nodes = Array.from(temp.childNodes);
            let nodeIndex = 0;
            
            function typeNextNode() {
                if (nodeIndex < nodes.length) {
                    const node = nodes[nodeIndex];
                    if (node.nodeType === Node.TEXT_NODE) {
                        let charIndex = 0;
                        const txt = node.textContent;
                        function typeChar() {
                            if (charIndex < txt.length) {
                                line.appendChild(document.createTextNode(txt[charIndex]));
                                charIndex++;
                                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                                setTimeout(typeChar, speed);
                            } else {
                                nodeIndex++;
                                typeNextNode();
                            }
                        }
                        typeChar();
                    } else {
                        // Clone formatting elements or links directly
                        line.appendChild(node.cloneNode(true));
                        nodeIndex++;
                        terminalOutput.scrollTop = terminalOutput.scrollHeight;
                        const delay = node.nodeName === 'BR' ? speed * 6 : speed;
                        setTimeout(typeNextNode, delay);
                    }
                } else {
                    terminalInput.disabled = false;
                    terminalInput.placeholder = 'Ketik perintah di sini...';
                    if (window.innerWidth > 768) {
                        terminalInput.focus();
                    }
                }
            }
            typeNextNode();
        }

        function executeCommand(cmd) {
            printLine(`<span class="terminal-prompt">visitor@guntur-dev:~$</span> ${cmd}`);
            
            const normalizedCmd = cmd.toLowerCase().trim();
            if (normalizedCmd === '') return;

            switch (normalizedCmd) {
                case 'help':
                    const helpText = `Perintah yang tersedia:<br>` +
                        `  <span class="function">about</span>     - Biodata singkat Muhamad Guntur Ramadhan<br>` +
                        `  <span class="function">skills</span>    - Grafik keahlian akademis & teknis<br>` +
                        `  <span class="function">music</span>     - Kontrol pemutar musik (play/pause)<br>` +
                        `  <span class="function">boot</span>      - Restart OS terminal<br>` +
                        `  <span class="function">clear</span>     - Bersihkan layar terminal`;
                    printTypewriterLine(helpText);
                    break;
                case 'about':
                    const aboutText = `========================================<br>` +
                        `<span class="keyword">Nama</span>     : Muhamad Guntur Ramadhan<br>` +
                        `<span class="keyword">Studi</span>    : S1 Sistem Informasi<br>` +
                        `<span class="keyword">Kampus</span>   : Universitas Muhammadiyah Bengkulu<br>` +
                        `<span class="keyword">Fokus</span>    : Analisis Proses Bisnis, Web Programming, dan Pengembangan Sistem Perangkat lunak<br>` +
                        `========================================`;
                    printTypewriterLine(aboutText);
                    break;
                case 'skills':
                    const skillsText = `Keahlian Akademik & Teknis:<br>` +
                        `Gaming          [<span class="string">==================  </span>] 90%<br>` +
                        `Web Programming [<span class="string">==========          </span>] 50%<br>` +
                        `Video Edit      [<span class="string">===========         </span>] 55%`;
                    printTypewriterLine(skillsText);
                    break;
                case 'boot':
                    runBootSequence();
                    break;
                case 'music':
                case 'music play':
                case 'music pause':
                    const bgAudio = document.getElementById('bgAudio');
                    const musicWidget = document.getElementById('musicWidget');
                    const playBtn = document.getElementById('playBtn');
                    
                    if (bgAudio && musicWidget && playBtn) {
                        if (bgAudio.paused || normalizedCmd === 'music play') {
                            bgAudio.play()
                                .then(() => {
                                    musicWidget.classList.add('playing');
                                    if (typeof startFloatingNotes === 'function') startFloatingNotes();
                                    printTypewriterLine('Memutar lagu: <span class="string">Lady Gaga - Judas</span> 🎵');
                                })
                                .catch(err => {
                                    printTypewriterLine('Gagal memutar musik: Izin browser diblokir.', 'error');
                                });
                        } else {
                            bgAudio.pause();
                            musicWidget.classList.remove('playing');
                            if (typeof stopFloatingNotes === 'function') stopFloatingNotes();
                            printTypewriterLine('Musik dijeda.');
                        }
                    } else {
                        printTypewriterLine('Pemutar musik tidak ditemukan.', 'error');
                    }
                    break;
                case 'clear':
                    terminalOutput.innerHTML = '';
                    break;
                default:
                    printLine(`Perintah tidak dikenal: '<span class="keyword">${cmd}</span>'. Ketik <span class="keyword">help</span> untuk daftar perintah.`, 'error');
            }
        }
    }

    /* ==========================================================================
       Cursor Trailer Logic (With Hover Scale Effect)
       ========================================================================== */
    const cursorTrailer = document.getElementById('cursorTrailer');
    if (cursorTrailer) {
        let mouseX = 0;
        let mouseY = 0;
        let trailerX = 0;
        let trailerY = 0;
        let isMoving = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                cursorTrailer.style.opacity = '1';
                isMoving = true;
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorTrailer.style.opacity = '0';
            isMoving = false;
        });

        function animateTrailer() {
            const lerpFactor = 0.15;
            trailerX += (mouseX - trailerX) * lerpFactor;
            trailerY += (mouseY - trailerY) * lerpFactor;
            
            cursorTrailer.style.transform = `translate3d(${trailerX}px, ${trailerY}px, 0) translate(-50%, -50%)`;
            
            requestAnimationFrame(animateTrailer);
        }
        animateTrailer();

        // Attach hover scale triggers for interactive components
        const attachTrailerHoverEvents = () => {
            const hoverTargets = document.querySelectorAll('a, button, .project-card, .certificate-card, .theme-btn, .terminal-btn');
            hoverTargets.forEach(target => {
                target.addEventListener('mouseenter', () => cursorTrailer.classList.add('hovering'));
                target.addEventListener('mouseleave', () => cursorTrailer.classList.remove('hovering'));
            });
        };
        // Run on load and expose globally to handle changes
        attachTrailerHoverEvents();
        window.reAttachTrailerHover = attachTrailerHoverEvents;
    }

    /* ==========================================================================
       Stat Counters Animation
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Stat counters
                if (entry.target.classList.contains('counter')) {
                    const targetVal = parseInt(entry.target.getAttribute('data-target'));
                    let currentVal = 0;
                    const duration = 1500; // ms
                    const stepTime = Math.max(Math.floor(duration / targetVal), 30);
                    
                    const timer = setInterval(() => {
                        currentVal += 1;
                        entry.target.textContent = currentVal;
                        if (currentVal >= targetVal) {
                            entry.target.textContent = targetVal;
                            clearInterval(timer);
                        }
                    }, stepTime);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });

    counters.forEach(counter => animateObserver.observe(counter));

    /* ==========================================================================
       3D Tilt & Spotlight Effect on Cards
       ========================================================================== */
    // Only enable 3D tilt & spotlight effect on devices that support hover (e.g. desktop mice)
    if (window.matchMedia('(hover: hover)').matches) {
        const tiltCards = document.querySelectorAll('.project-card, .about-profile-card, .certificate-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Expose mouse coordinates to CSS custom properties for radial spotlight effect
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const maxTiltX = 8;
                const maxTiltY = 8;
                
                const tiltX = ((centerY - y) / centerY) * maxTiltX;
                const tiltY = ((x - centerX) / centerX) * maxTiltY;
                
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease';
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ==========================================================================
       Interactive Particle Constellation Background (With Repel & Click Burst)
       ========================================================================== */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 160 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor(x = null, y = null, vx = null, vy = null, size = null) {
                this.x = x !== null ? x : Math.random() * canvas.width;
                this.y = y !== null ? y : Math.random() * canvas.height;
                this.vx = vx !== null ? vx : (Math.random() - 0.5) * 0.4;
                this.vy = vy !== null ? vy : (Math.random() - 0.5) * 0.4;
                this.size = size !== null ? size : Math.random() * 2 + 1;
            }

            draw() {
                let color = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#8b5cf6';
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Slow down fast particles pushed by clicking (friction physics)
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 0.45) {
                    this.vx *= 0.96;
                    this.vy *= 0.96;
                }

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
        }

        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Global particle burst helper function
        window.triggerParticleBurst = function(clientX, clientY, count = 25) {
            const rect = canvas.getBoundingClientRect();
            const startX = clientX - rect.left;
            const startY = clientY - rect.top;
            
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3.5 + 1.5;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                const size = Math.random() * 3 + 1.5;
                
                particles.push(new Particle(startX, startY, vx, vy, size));
                
                // Manage limit to protect browser frames
                if (particles.length > 160) {
                    const slowIndex = particles.findIndex(p => Math.abs(p.vx) < 0.5);
                    if (slowIndex > -1) {
                        particles.splice(slowIndex, 1);
                    } else {
                        particles.shift();
                    }
                }
            }
        };

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Repel and explode particles on mouse click
        document.addEventListener('click', (e) => {
            // Do not trigger burst when clicking on interactive elements
            const target = e.target;
            if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea') || target.closest('.project-card') || target.closest('.certificate-card') || target.closest('.terminal-card') || target.closest('.music-player-widget')) {
                return;
            }
            
            // Explode particles at click location
            if (window.triggerParticleBurst) {
                window.triggerParticleBurst(e.clientX, e.clientY, 20);
            }
            
            // Apply a repulsion force away from click coordinates
            particles.forEach(p => {
                const dx = p.x - e.clientX;
                const dy = p.y - e.clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 220 && dist > 0) {
                    const force = (220 - dist) / 220;
                    const angle = Math.atan2(dy, dx);
                    // Add explosive velocity vector
                    p.vx += Math.cos(angle) * force * 5.0;
                    p.vy += Math.sin(angle) * force * 5.0;
                }
            });
        });

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            let activeColor = getComputedStyle(document.body).getPropertyValue('--accent-color-rgb').trim() || '139, 92, 246';
            for (let i = 0; i < particles.length; i++) {
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = particles[i].x - mouse.x;
                    let dy = particles[i].y - mouse.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        ctx.strokeStyle = `rgba(${activeColor}, ${1 - dist / mouse.radius})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }

                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(${activeColor}, ${0.15 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ==========================================================================
       Magnetic Button Effect
       ========================================================================== */
    // Only enable magnetic effect on devices that support hover (e.g. desktop mice)
    if (window.matchMedia('(hover: hover)').matches) {
        const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .social-btn, .whatsapp-float, .music-toggle-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Subtle pull effect
                if (btn.classList.contains('whatsapp-float')) {
                    btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) scale(1.1)`;
                } else {
                    btn.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0) scale(1.05)`;
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ==========================================================================
       Startup: run terminal boot sequence immediately (no preloader)
       ========================================================================== */
    if (typeof window.runTerminalBootSequence === 'function') {
        window.runTerminalBootSequence();
    }
});

