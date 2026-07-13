/* ======================================================
   Alex Smith — Portfolio  |  Vanilla JS
   ====================================================== */
(function () {
    "use strict";

    /* ---------- Preloader ---------- */
    window.addEventListener("load", function () {
        var pre = document.getElementById("preloader");
        if (pre) setTimeout(function () { pre.classList.add("hide"); }, 400);
    });

    /* ---------- Current year ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Mobile nav toggle ---------- */
    var toggler = document.getElementById("navToggler");
    var menu = document.getElementById("navMenu");
    if (toggler && menu) {
        toggler.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
        menu.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () { menu.classList.remove("open"); });
        });
    }

    /* ---------- Navbar background on scroll + scroll-to-top ---------- */
    var navbar = document.getElementById("navbar");
    var toTop = document.getElementById("toTop");
    window.addEventListener("scroll", function () {
        var y = window.scrollY;
        if (navbar) navbar.classList.toggle("scrolled", y > 60);
        if (toTop) toTop.classList.toggle("show", y > 500);
        activateNavLink();
    });

    /* ---------- Active nav link based on section in view ---------- */
    var sections = document.querySelectorAll("section[id], header[id]");
    var navLinks = document.querySelectorAll(".nav-link");
    function activateNavLink() {
        var pos = window.scrollY + 120;
        var current = "";
        sections.forEach(function (sec) {
            if (pos >= sec.offsetTop) current = sec.id;
        });
        navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    }

    /* ---------- Typing effect for hero ---------- */
    var typed = document.getElementById("typed");
    if (typed) {
        var words = ["Udit Narayan", "a MERN Developer", "a Full Stack Dev"];
        var wi = 0, ci = 0, deleting = false;
        (function type() {
            var word = words[wi];
            typed.textContent = word.substring(0, ci);
            if (!deleting && ci < word.length) {
                ci++; setTimeout(type, 110);
            } else if (deleting && ci > 0) {
                ci--; setTimeout(type, 55);
            } else {
                if (!deleting) { deleting = true; setTimeout(type, 1400); }
                else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 300); }
            }
        })();
    }

    /* ---------- Portfolio filter ---------- */
    var filterBtns = document.querySelectorAll(".filter span");
    var galleryItems = document.querySelectorAll(".gallery-item");
    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterBtns.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            var f = btn.getAttribute("data-filter");
            galleryItems.forEach(function (item) {
                var show = f === "all" || item.classList.contains(f);
                item.classList.toggle("hide", !show);
            });
        });
    });

    /* ---------- Testimonials slider ---------- */
    var slides = document.querySelectorAll(".slide");
    var dotsWrap = document.getElementById("sliderDots");
    var cur = 0, timer;
    if (slides.length && dotsWrap) {
        slides.forEach(function (_, i) {
            var d = document.createElement("button");
            if (i === 0) d.classList.add("active");
            d.addEventListener("click", function () { goTo(i); reset(); });
            dotsWrap.appendChild(d);
        });
        var dots = dotsWrap.querySelectorAll("button");
        function goTo(i) {
            slides[cur].classList.remove("active");
            dots[cur].classList.remove("active");
            cur = i;
            slides[cur].classList.add("active");
            dots[cur].classList.add("active");
        }
        function next() { goTo((cur + 1) % slides.length); }
        function reset() { clearInterval(timer); timer = setInterval(next, 5000); }
        reset();
    }

    /* ---------- Counters + skill bars (on scroll into view) ---------- */
    function animateCount(el) {
        var target = +el.getAttribute("data-target");
        var dur = 1800, start = 0, t0 = null;
        function step(ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            el.textContent = Math.floor(p * (target - start) + start).toLocaleString();
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            if (el.classList.contains("count")) animateCount(el);
            if (el.classList.contains("skill-fill")) el.style.width = el.getAttribute("data-value") + "%";
            if (el.classList.contains("reveal")) el.classList.add("visible");
            obs.unobserve(el);
        });
    }, { threshold: 0.25 });

    document.querySelectorAll(".count, .skill-fill, .reveal").forEach(function (el) { io.observe(el); });

    /* ---------- Auto-tag common blocks for reveal animation ---------- */
    document.querySelectorAll(".service-item, .blog-item, .gallery-item, .about-content, .about-img")
        .forEach(function (el) { el.classList.add("reveal"); io.observe(el); });

    /* ---------- Contact form -> sends data to WhatsApp ---------- */
    var WHATSAPP_NUMBER = "918810878157"; // country code + number, no "+" or spaces
    var form = document.getElementById("contactForm");
    var msg = document.getElementById("formMessages");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var name = form.name.value.trim();
            var email = form.email.value.trim();
            var subject = form.subject.value.trim();
            var message = form.message.value.trim();
            var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!name || !emailOk || !message) {
                show("Please fill in your name, a valid email, and a message.", "error");
                return;
            }

            // Build a nicely formatted WhatsApp message
            var text =
                "*New message from Portfolio*%0A%0A" +
                "*Name:* " + encodeURIComponent(name) + "%0A" +
                "*Email:* " + encodeURIComponent(email) + "%0A" +
                (subject ? "*Subject:* " + encodeURIComponent(subject) + "%0A" : "") +
                "*Message:* " + encodeURIComponent(message);

            var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
            window.open(url, "_blank");

            show("Opening WhatsApp… just tap send to deliver your message.", "success");
            form.reset();
        });
    }
    function show(text, type) {
        if (!msg) return;
        msg.innerHTML = '<div class="alert ' + type + '">' + text + "</div>";
        if (type === "success") setTimeout(function () { msg.innerHTML = ""; }, 5000);
    }

    activateNavLink();
})();
