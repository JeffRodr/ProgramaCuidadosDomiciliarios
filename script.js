/* ── CAROUSEL ── */
(function () {
    const wrapper  = document.getElementById('carousel');
    const track    = document.getElementById('carouselTrack');
    const dotsEl   = document.getElementById('carouselDots');
    const progress = document.getElementById('carouselProgress');
    const btnPrev  = document.getElementById('btnPrev');
    const btnNext  = document.getElementById('btnNext');

    if (!wrapper) return; // Validación de seguridad

    const slides      = Array.from(track.querySelectorAll('.carousel-slide'));
    const TOTAL       = slides.length;
    const INTERVAL_MS = 10000;

    let current   = 0;
    let autoTimer = null;
    let paused    = false;

    /* Detectar si imagen cargó correctamente */
    slides.forEach((slide, i) => {
        const img = slide.querySelector('img');
        if (!img) return;

        function onLoad() {
            if (img.naturalWidth > 0) slide.classList.add('img-loaded');
        }
        function onError() {
            img.style.display = 'none'; /* Muestra el gradiente fallback */
        }

        if (img.complete) { onLoad(); }
        else { img.addEventListener('load', onLoad); img.addEventListener('error', onError); }
        img.addEventListener('error', onError);
    });

    /* Crear puntos */
    slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Foto ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsEl.appendChild(dot);
    });

    var dots = Array.from(dotsEl.querySelectorAll('.carousel-dot'));

    function getSlideWidth() {
        return wrapper.offsetWidth;
    }

    function goTo(index) {
        current = ((index % TOTAL) + TOTAL) % TOTAL;
        track.style.transform = 'translateX(-' + (current * getSlideWidth()) + 'px)';
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === current);
            d.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });
        restartProgress();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    /* Barra de progreso */
    function restartProgress() {
        progress.classList.remove('animating');
        /* forzar reflow */
        void progress.offsetWidth;
        if (!paused) progress.classList.add('animating');
    }

    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(next, INTERVAL_MS);
    }

    /* Botones */
    btnNext.addEventListener('click', function () { next(); resetTimer(); });
    btnPrev.addEventListener('click', function () { prev(); resetTimer(); });

    /* Pausa al hacer hover */
    wrapper.addEventListener('mouseenter', function () {
        paused = true;
        clearInterval(autoTimer);
        progress.classList.remove('animating');
    });

    wrapper.addEventListener('mouseleave', function () {
        paused = false;
        resetTimer();
        restartProgress();
    });

    /* Soporte táctil (swipe) */
    var touchStartX = 0;
    wrapper.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', function (e) {
        var delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 48) {
            if (delta > 0) { next(); } else { prev(); }
            resetTimer();
        }
    }, { passive: true });

    /* Teclas de accesibilidad */
    wrapper.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { next(); resetTimer(); }
        if (e.key === 'ArrowLeft')  { prev(); resetTimer(); }
    });

    /* Redimensionamiento de ventana */
    var resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            var noTransition = track.style.transition;
            track.style.transition = 'none';
            track.style.transform = 'translateX(-' + (current * getSlideWidth()) + 'px)';
            /* Restaurar transición en siguiente frame */
            requestAnimationFrame(function () {
                track.style.transition = noTransition;
            });
        }, 80);
    });

    /* Iniciar */
    goTo(0);
    resetTimer();
})();

/* ── MODALES ── */
(function () {
    // 1. Modal de Encuesta
    const overlayEncuesta  = document.getElementById('modalOverlay');
    const btnIrPreevaluacion = document.getElementById('btnIrPreevaluacion');

    if (btnIrPreevaluacion) {
        btnIrPreevaluacion.addEventListener('click', function() {
            // Guarda un permiso temporal en el navegador
            sessionStorage.setItem('accesoPermitido', 'true');
        });
    }
    const btnCloseEncuesta = document.getElementById('btnModalClose');

    // 2. Modal de Privacidad
    const overlayPrivacy  = document.getElementById('modalPrivacyOverlay');
    const btnOpenPrivacy  = document.getElementById('btnPrivacy');
    const btnClosePrivacy = document.getElementById('btnPrivacyClose');

    // 3. Modal de Contacto
    const overlayContact  = document.getElementById('modalContactOverlay');
    const btnOpenContact  = document.getElementById('btnContact');
    const btnCloseContact = document.getElementById('btnContactClose');

    // Función genérica para abrir modales
    function openModal(overlay, btnToFocus) {
        if (!overlay) return;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (btnToFocus) btnToFocus.focus();
    }

    // Función genérica para cerrar modales
    function closeModal(overlay, btnToReturnFocus) {
        if (!overlay) return;
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        if (btnToReturnFocus) btnToReturnFocus.focus();
    }

    // Eventos: Encuesta
    if (btnOpenEncuesta && btnCloseEncuesta) {
        btnOpenEncuesta.addEventListener('click', () => openModal(overlayEncuesta, btnCloseEncuesta));
        btnCloseEncuesta.addEventListener('click', () => closeModal(overlayEncuesta, btnOpenEncuesta));
        overlayEncuesta.addEventListener('click', (e) => {
            if (e.target === overlayEncuesta) closeModal(overlayEncuesta, btnOpenEncuesta);
        });
    }

    // Eventos: Privacidad
    if (btnOpenPrivacy && btnClosePrivacy) {
        btnOpenPrivacy.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(overlayPrivacy, btnClosePrivacy);
        });
        btnClosePrivacy.addEventListener('click', () => closeModal(overlayPrivacy, btnOpenPrivacy));
        overlayPrivacy.addEventListener('click', (e) => {
            if (e.target === overlayPrivacy) closeModal(overlayPrivacy, btnOpenPrivacy);
        });
    }

    // Eventos: Contacto
    if (btnOpenContact && btnCloseContact) {
        btnOpenContact.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(overlayContact, btnCloseContact);
        });
        btnCloseContact.addEventListener('click', () => closeModal(overlayContact, btnOpenContact));
        overlayContact.addEventListener('click', (e) => {
            if (e.target === overlayContact) closeModal(overlayContact, btnOpenContact);
        });
    }

    // Cerrar cualquier modal activo con la tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (overlayEncuesta && overlayEncuesta.classList.contains('open')) closeModal(overlayEncuesta, btnOpenEncuesta);
            if (overlayPrivacy && overlayPrivacy.classList.contains('open')) closeModal(overlayPrivacy, btnOpenPrivacy);
            if (overlayContact && overlayContact.classList.contains('open')) closeModal(overlayContact, btnOpenContact);
        }
    });
})();