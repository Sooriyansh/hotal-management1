(function () {
  const safe = (fn) => {
    try {
      fn();
    } catch (error) {
      console.warn(error);
    }
  };

  safe(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  safe(() => {
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", () => panel.classList.toggle("hidden"));
  });

  safe(() => {
    document.querySelectorAll(".tab-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".tab-trigger").forEach((item) => item.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach((item) => item.classList.add("hidden"));
        button.classList.add("active");
        document.getElementById(button.dataset.tab)?.classList.remove("hidden");
      });
    });
  });

  safe(() => {
    const video = document.querySelector(".hero video");
    const toggle = document.querySelector(".video-toggle");
    if (!video || !toggle) return;
    toggle.addEventListener("click", () => {
      video.muted = !video.muted;
      toggle.innerHTML = video.muted
        ? '<i data-lucide="volume-x" class="h-5 w-5"></i>'
        : '<i data-lucide="volume-2" class="h-5 w-5"></i>';
      if (window.lucide) window.lucide.createIcons();
    });
  });

  safe(() => {
    if (!window.gsap) return;
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

    window.gsap.from(".reveal", {
      opacity: 0,
      y: 28,
      duration: 0.85,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: "body",
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    document.querySelectorAll(".counter").forEach((counter) => {
      const target = Number(counter.dataset.target || 0);
      const state = { value: 0 };
      window.gsap.to(state, {
        value: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: counter, start: "top 90%" },
        onUpdate: () => {
          counter.textContent = Math.round(state.value).toLocaleString();
        }
      });
    });
  });

  safe(() => {
    const buttons = document.querySelectorAll(".category-pill");
    const cards = document.querySelectorAll("[data-food-category]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        cards.forEach((card) => {
          card.style.display = card.dataset.foodCategory === button.dataset.category ? "" : "none";
        });
      });
    });
  });

  safe(() => {
    const cart = [];
    const cartBox = document.getElementById("cart-items");
    const render = () => {
      if (!cartBox) return;
      cartBox.innerHTML = cart.length
        ? cart
            .map((item) => `<div class="activity-row"><span>${item.name}</span><strong>$${item.price}</strong></div>`)
            .join("")
        : '<p class="text-white/45">No items selected.</p>';
    };

    render();

    document.querySelectorAll(".add-food").forEach((button) => {
      button.addEventListener("click", () => {
        cart.push({ name: button.dataset.name, price: Number(button.dataset.price), quantity: 1 });
        render();
      });
    });

    document.getElementById("place-food-order")?.addEventListener("click", async () => {
      if (!cart.length) return;
      const response = await fetch("/api/orders/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, orderType: "Room Service" })
      });
      if (response.status === 401) {
        window.location.href = "/auth/login?error=Please login to place an order";
        return;
      }
      const payload = await response.json();
      cart.length = 0;
      render();
      alert(`Order ${payload.orderNo} sent to kitchen.`);
    });
  });

  safe(() => {
    const image = document.getElementById("tour-image");
    const title = document.getElementById("tour-title");
    document.querySelectorAll(".tour-stop").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".tour-stop").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        if (image) image.src = button.dataset.image;
        if (title) title.textContent = button.dataset.name;
      });
    });

    document.getElementById("fullscreen-tour")?.addEventListener("click", () => {
      document.querySelector(".tour-viewer")?.requestFullscreen?.();
    });
  });

  safe(() => {
    const log = document.getElementById("chat-log");
    const input = document.getElementById("concierge-input");
    const form = document.getElementById("concierge-form");
    const append = (text, type) => {
      if (!log) return;
      const bubble = document.createElement("div");
      bubble.className = `chat-bubble ${type}`;
      bubble.textContent = text;
      log.appendChild(bubble);
      log.scrollTop = log.scrollHeight;
    };

    document.querySelectorAll(".suggestion-chip").forEach((button) => {
      button.addEventListener("click", () => {
        if (input) input.value = button.dataset.message;
        input?.focus();
      });
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = input?.value.trim();
      if (!message) return;
      append(message, "user");
      input.value = "";
      const response = await fetch("/api/concierge/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const payload = await response.json();
      append(payload.answer, "bot");
    });
  });

  safe(() => {
    document.querySelectorAll(".countdown").forEach((item) => {
      let seconds = Number(item.dataset.hours || 0) * 3600;
      const tick = () => {
        seconds = Math.max(seconds - 1, 0);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        item.textContent = `${hours}h ${String(minutes).padStart(2, "0")}m`;
      };
      tick();
      window.setInterval(tick, 60000);
    });
  });

  safe(() => {
    if (!window.io) return;
    const socket = window.io();
    const toastStack = document.createElement("div");
    toastStack.className = "toast-stack";
    document.body.appendChild(toastStack);

    const showToast = (payload) => {
      const toast = document.createElement("div");
      toast.className = "live-toast";
      toast.innerHTML = `<strong>${payload.title || "Live update"}</strong><span>${payload.message || payload.moduleLabel || ""}</span>`;
      toastStack.prepend(toast);
      window.setTimeout(() => toast.remove(), 6000);
    };

    const updateWorkflowTable = (payload) => {
      const page = document.querySelector("[data-workflow-module]");
      if (!page || page.dataset.workflowModule !== payload.module) return;
      const tbody = document.querySelector("[data-workflow-rows]");
      if (!tbody || !payload.record) return;

      if (payload.action === "delete") {
        tbody.querySelector(`[data-record-id="${payload.record.id}"]`)?.remove();
        tbody.querySelector(`[data-edit-for="${payload.record.id}"]`)?.remove();
        return;
      }

      let row = tbody.querySelector(`[data-record-id="${payload.record.id}"]`);
      if (!row) {
        row = document.createElement("tr");
        row.dataset.recordId = payload.record.id;
        tbody.prepend(row);
      }

      row.innerHTML = `${payload.record.values
        .map((item) => {
          const statusClass = item.name.toLowerCase().includes("status") || item.name.startsWith("is") ? "status-pill" : "";
          return `<td data-field="${item.name}"><span class="${statusClass}">${item.value ?? ""}</span></td>`;
        })
        .join("")}<td><span class="mini-chip">Live</span></td>`;
    };

    const updateCustomerNotifications = (payload) => {
      const box = document.querySelector("[data-live-notifications]");
      if (!box) return;
      const item = document.createElement("div");
      item.className = "activity-row";
      item.innerHTML = `<span>${payload.title || payload.moduleLabel || "Live update"}</span><strong>${payload.action || "updated"}</strong>`;
      box.prepend(item);
    };

    socket.on("notification", (payload) => {
      showToast(payload);
      updateCustomerNotifications(payload);
    });
    socket.on("orderTracking", (payload) => {
      showToast({
        title: `Order ${payload.orderNo}`,
        message: payload.status
      });
    });
    socket.on("workflow:changed", (payload) => {
      showToast({
        title: payload.title || `${payload.moduleLabel} ${payload.action}`,
        message: payload.record?.label || "Records updated"
      });
      updateWorkflowTable(payload);
      updateCustomerNotifications(payload);
    });
    socket.on("workflow:mine", (payload) => {
      showToast({
        title: payload.title || "Your request changed",
        message: payload.record?.label || payload.moduleLabel
      });
    });
  });
})();
