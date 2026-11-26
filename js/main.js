/**
 * 毛絨小熊手作屋 — 主要互動腳本 (js/main.js)
 * ==========================================================================
 * 【新手必改設定】
 * 請在部署好 Google Apps Script 後，將下方引號內的網址換成您的「網頁應用程式網址」。
 */
const GAS_WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeroCarousel();
  initProductFilters();
  initNewsletterForm();
  initWhatsAppTracking();
});

/* 1. 手機版漢堡選單 */
function initMobileNav() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

/* 2. 首頁圖片輪播 Carousel */
function initHeroCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
  const prevBtn = carousel.querySelector(".carousel-btn.prev");
  const nextBtn = carousel.querySelector(".carousel-btn.next");

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      const active = idx === currentIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, idx) => {
      const active = idx === currentIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(() => showSlide(currentIndex + 1), 5000);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);

  showSlide(0);
  startAutoPlay();
}

/* 3. 產品頁分類篩選 */
function initProductFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".product-card");
  if (filterBtns.length === 0 || cards.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-filter");

      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      cards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        const shouldShow = category === "all" || cardCat === category;
        card.classList.toggle("is-hidden", !shouldShow);
      });

      // 推送分類點擊事件至 GTM dataLayer（方便日後在 GA4 / FB Pixel 追蹤）
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "product_filter_click",
        filter_category: category
      });
    });
  });
}

/* 4. 電郵訂閱／新品通知表單（連接 Google Apps Script -> _demo/Contact） */
function initNewsletterForm() {
  const forms = document.querySelectorAll(".newsletter-form");
  if (forms.length === 0) return;

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const statusEl = form.parentElement.querySelector(".form-status");
      const submitBtn = form.querySelector('button[type="submit"]');
      const email = emailInput ? emailInput.value.trim() : "";

      if (!email || !email.includes("@")) {
        setStatus(statusEl, "請輸入有效的電郵地址。", "error");
        return;
      }

      if (GAS_WEB_APP_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        setStatus(
          statusEl,
          "示範模式：尚未填入 Google Apps Script 網址。請依指南完成 GAS 部署後更新 js/main.js。",
          "error"
        );
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "傳送中...";
      setStatus(statusEl, "", "");

      try {
        await fetch(GAS_WEB_APP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            email: email,
            page: document.title || window.location.pathname
          })
        });

        setStatus(statusEl, "感謝您的登記！新品推出時我們會第一時間以電郵通知您。", "success");
        form.reset();

        // 推送轉換事件至 GTM dataLayer（供 Google Ads / GA4 / FB Pixel 使用）
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "email_subscribe",
          page_title: document.title
        });
      } catch (err) {
        setStatus(statusEl, "傳送時發生錯誤，請稍後再試。", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "訂閱新品通知";
      }
    });
  });
}

function setStatus(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("is-success", "is-error");
  if (type === "success") el.classList.add("is-success");
  if (type === "error") el.classList.add("is-error");
}

/* 5. WhatsApp 點擊事件追蹤（供 GTM 使用） */
function initWhatsAppTracking() {
  const waLinks = document.querySelectorAll('a[href*="wa.me/"]');
  waLinks.forEach((link) => {
    link.addEventListener("click", () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "whatsapp_click",
        page_title: document.title
      });
    });
  });
}
