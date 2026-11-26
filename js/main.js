// Bears & Soft Toys - js/main.js
// 1) 換成你自己的設定：GTM ID 喺 3 個 HTML 嘅 <head> 同 <body> 換，唔喺呢度。
// 2) Google Sheets：喺下面換 GOOGLE_SHEETS_WEB_APP_URL，見 README / Code.gs
const CONFIG = {
  GOOGLE_SHEETS_WEB_APP_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", // ← 貼上 Apps Script 部署後嘅 Web App URL
  WHATSAPP_NUMBER: "85265424487",
  WHATSAPP_LINK: "https://wa.me/85265424487"
};

function pushEvent(eventName, params) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  // 喺 GTM 入面用呢啲 event 名做 Trigger：whatsapp_click / email_submit / product_click / form_view
  console.log("[GTM dataLayer]", eventName, params || {});
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 手機選單
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // 輪播 Carousel
  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(track.children);
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    let index = 0, timer = null;
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "去第 " + (i + 1) + " 張");
      b.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(b);
    });
    const dots = Array.from(dotsWrap.children);
    function go(i, manual) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach((d, di) => d.setAttribute("aria-selected", di === index ? "true" : "false"));
      slides.forEach((s, si) => s.setAttribute("aria-hidden", si === index ? "false" : "true"));
      if (manual) restart();
    }
    function restart() { clearInterval(timer); timer = setInterval(() => go(index + 1), 5000); }
    if (prev) prev.addEventListener("click", () => go(index - 1, true));
    if (next) next.addEventListener("click", () => go(index + 1, true));
    go(0); restart();
  }

  // 產品篩選（products.html）
  const filterBtns = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");
  if (filterBtns.length && cards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const f = btn.getAttribute("data-filter");
        cards.forEach(c => {
          const show = f === "all" || c.getAttribute("data-category") === f;
          c.style.display = show ? "" : "none";
        });
        pushEvent("product_filter", { filter: f });
      });
    });
  }

  // 產品點擊追蹤
  document.querySelectorAll("[data-product]").forEach(el => {
    el.addEventListener("click", () => pushEvent("product_click", { product_name: el.getAttribute("data-product") }));
  });

  // WhatsApp 點擊追蹤 → GTM 事件 whatsapp_click
  document.querySelectorAll('[data-event="whatsapp_click"]').forEach(el => {
    el.addEventListener("click", () => pushEvent("whatsapp_click", { whatsapp_number: CONFIG.WHATSAPP_NUMBER, link_url: el.href, page: location.pathname }));
  });

  // 電郵表格 → Google Sheets (_demo / Contact)
  const form = document.getElementById("email-form");
  if (form) {
    // 俾 GTM 知有人睇到表格
    pushEvent("form_view", { form_id: "email-form" });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("customer-name");
      const emailInput = document.getElementById("customer-email");
      const msg = document.getElementById("form-message");
      const btn = document.getElementById("email-submit-btn");
      const name = (nameInput ? nameInput.value.trim() : "");
      const email = (emailInput ? emailInput.value.trim() : "");
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "請輸入正確嘅電郵地址，例如 you@example.com";
        msg.className = "form-note error";
        emailInput.focus();
        return;
      }
      btn.disabled = true; btn.textContent = "提交緊…";
      msg.textContent = ""; msg.className = "form-note";

      // 1) GTM 事件：email_submit（之後喺 GTM 入面用呢個 event 觸發 GA4 / Facebook Pixel / Google Ads）
      pushEvent("email_submit", { email_domain: email.split("@")[1] || "", page: location.pathname, source: "new_product_signup" });

      // 2) 寫入 Google Sheets
      try {
        if (!CONFIG.GOOGLE_SHEETS_WEB_APP_URL || CONFIG.GOOGLE_SHEETS_WEB_APP_URL.includes("YOUR_SCRIPT_ID")) {
          throw new Error("NOT_CONFIGURED");
        }
        const payload = new URLSearchParams();
        payload.append("name", name);
        payload.append("email", email);
        payload.append("source", "Bears & Soft Toys - 新產品訂閱");
        payload.append("page", location.href);
        payload.append("timestamp", new Date().toISOString());
        // 用 no-cors 因為 Apps Script 唔回 CORS header，提交會成功但讀唔到回應，屬正常
        await fetch(CONFIG.GOOGLE_SHEETS_WEB_APP_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: payload.toString() });
        msg.textContent = "多謝你！已收到你嘅電郵，有新產品會第一時間通知你。";
        msg.className = "form-note success";
        form.reset();
      } catch (err) {
        if (err && err.message === "NOT_CONFIGURED") {
          msg.textContent = "表格已記錄（示範模式）：請先喺 js/main.js 貼上 Apps Script Web App URL，之後就會自動寫入 Google Sheets _demo / Contact。";
          msg.className = "form-note success";
          console.warn("請設定 GOOGLE_SHEETS_WEB_APP_URL");
        } else {
          msg.textContent = "提交遇到問題，請稍後再試，或者用 WhatsApp 快速聯絡我哋。";
          msg.className = "form-note error";
        }
      } finally {
        btn.disabled = false; btn.textContent = "訂閱新產品消息";
      }
    });
  }
});
