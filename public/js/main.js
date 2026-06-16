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

  const isHomeExperience = Boolean(document.querySelector("[data-home-experience]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const lowPowerDevice =
    isHomeExperience &&
    (prefersReducedMotion || coarsePointer || window.innerWidth < 900 || (navigator.deviceMemory && navigator.deviceMemory < 4));

  safe(() => {
    if (!isHomeExperience || !window.Lenis || prefersReducedMotion) return;
    const lenis = new window.Lenis({
      duration: lowPowerDevice ? 0.42 : 0.58,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.15,
      smoothTouch: false
    });

    const raf = (time) => {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    };
    window.requestAnimationFrame(raf);

    if (window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }
  });

  safe(() => {
    if (!isHomeExperience || !window.ScrollTrigger) return;
    window.ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    });
  });

  safe(() => {
    if (!isHomeExperience) return;
    document.querySelectorAll(".ripple-btn").forEach((button) => {
      button.addEventListener("pointerdown", (event) => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
        button.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
        button.classList.remove("is-rippling");
        void button.offsetWidth;
        button.classList.add("is-rippling");
      });
      button.addEventListener("animationend", () => button.classList.remove("is-rippling"));
    });
  });

  safe(() => {
    if (!isHomeExperience || coarsePointer || prefersReducedMotion) return;

    document.querySelectorAll(".magnetic").forEach((item) => {
      item.addEventListener("mousemove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
      });
      item.addEventListener("mouseleave", () => {
        item.style.transform = "";
      });
    });

    document.querySelectorAll("[data-tilt-card]").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateX = (py - 0.5) * -9;
        const rotateY = (px - 0.5) * 11;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  });

  safe(() => {
    if (!isHomeExperience || !window.particlesJS || lowPowerDevice) return;
    window.particlesJS("home-particles", {
      particles: {
        number: { value: 18, density: { enable: true, value_area: 900 } },
        color: { value: ["#d4af37", "#ffd700", "#ffffff"] },
        shape: { type: "circle" },
        opacity: { value: 0.32, random: true },
        size: { value: 2.2, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.65, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false }, resize: true },
        modes: { grab: { distance: 150, line_linked: { opacity: 0.32 } } }
      },
      retina_detect: true
    });
  });

  safe(() => {
    if (!isHomeExperience || !window.THREE || lowPowerDevice) return;
    const canvas = document.getElementById("hero-webgl");
    if (!canvas) return;
    let isVisible = true;

    const renderer = new window.THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.3, 6);

    const group = new window.THREE.Group();
    scene.add(group);

    const ringMaterial = new window.THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18,
      emissive: 0x3b2b05,
      emissiveIntensity: 0.35
    });
    const glassMaterial = new window.THREE.MeshPhysicalMaterial({
      color: 0xf8f4e8,
      transparent: true,
      opacity: 0.36,
      metalness: 0.15,
      roughness: 0.05,
      transmission: 0.55
    });

    const ring = new window.THREE.Mesh(new window.THREE.TorusGeometry(1.45, 0.08, 18, 64), ringMaterial);
    const crystal = new window.THREE.Mesh(new window.THREE.OctahedronGeometry(0.74, 0), glassMaterial);
    const innerRing = new window.THREE.Mesh(new window.THREE.TorusGeometry(0.92, 0.025, 12, 48), ringMaterial);
    group.add(ring, crystal, innerRing);
    ring.rotation.x = Math.PI / 2.8;
    innerRing.rotation.x = Math.PI / 2.3;

    scene.add(new window.THREE.AmbientLight(0xffffff, 0.72));
    const key = new window.THREE.PointLight(0xffd700, 2.2, 12);
    key.position.set(2.4, 2.8, 3.2);
    scene.add(key);
    const fill = new window.THREE.PointLight(0x0f766e, 1.4, 10);
    fill.position.set(-2.5, -1.6, 2);
    scene.add(fill);

    const mouse = { x: 0, y: 0 };
    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    const resize = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }).observe(canvas);
    }

    const animate = () => {
      if (isVisible) {
        group.rotation.y += 0.004;
        group.rotation.x += ((mouse.y * 0.18) - group.rotation.x) * 0.035;
        group.rotation.z += ((mouse.x * 0.14) - group.rotation.z) * 0.035;
        crystal.rotation.y -= 0.01;
        innerRing.rotation.z += 0.008;
        renderer.render(scene, camera);
      }
      window.requestAnimationFrame(animate);
    };
    animate();
  });

  safe(() => {
    if (!isHomeExperience || lowPowerDevice) return;
    const canvas = document.getElementById("steam-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let isVisible = true;
    const wisps = Array.from({ length: 12 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      r: 18 + Math.random() * 48,
      speed: 0.0018 + Math.random() * 0.003,
      phase: index * 0.7
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 1.5);
    };
    resize();
    window.addEventListener("resize", resize);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }).observe(canvas);
    }

    const draw = (time) => {
      if (!isVisible) {
        window.requestAnimationFrame(draw);
        return;
      }
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      wisps.forEach((wisp) => {
        wisp.y -= wisp.speed;
        if (wisp.y < -0.18) wisp.y = 1.08;
        const x = (wisp.x + Math.sin(time * 0.0007 + wisp.phase) * 0.055) * width;
        const y = wisp.y * height;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, wisp.r * 2);
        gradient.addColorStop(0, "rgba(255, 232, 168, 0.13)");
        gradient.addColorStop(1, "rgba(255, 232, 168, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, wisp.r * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      window.requestAnimationFrame(draw);
    };
    window.requestAnimationFrame(draw);
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
    if (!isHomeExperience) return;

    const video = document.querySelector(".hero video");
    if (video && "IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }).observe(video);
    }

    const spline = document.querySelector("spline-viewer[data-spline-url]");
    if (!spline || lowPowerDevice) return;
    const loadSpline = () => {
      if (!spline.getAttribute("url")) {
        spline.setAttribute("url", spline.dataset.splineUrl);
      }
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadSpline, { timeout: 1800 });
    } else {
      window.setTimeout(loadSpline, 900);
    }
  });

  safe(() => {
    if (!window.gsap) return;
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

    if (isHomeExperience && !prefersReducedMotion) {
      window.gsap.fromTo(".cinematic-hero", { opacity: 0.92 }, { opacity: 1, duration: 0.35, ease: "power2.out" });

      document.querySelectorAll("[data-parallax]").forEach((item) => {
        if (lowPowerDevice) return;
        const speed = Number(item.dataset.speed || 0.04);
        window.gsap.to(item, {
          yPercent: speed * -45,
          ease: "none",
          force3D: true,
          scrollTrigger: { trigger: item.closest("section") || item, start: "top bottom", end: "bottom top", scrub: 0.12 }
        });
      });

      if (!lowPowerDevice) {
        window.gsap.to("[data-float-layer]", {
          y: (index, item) => Number(item.dataset.speed || 0.08) * 70,
          ease: "none",
          force3D: true,
          scrollTrigger: { trigger: ".cinematic-hero", start: "top top", end: "bottom top", scrub: 0.12 }
        });
      }

      window.gsap.from(".image-reveal img, .event-frame img", {
        scale: 1.035,
        duration: 0.45,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: { trigger: ".horizontal-showcase", start: "top 92%" }
      });
    }

    if (!prefersReducedMotion) {
      window.gsap.set(".reveal", { willChange: "transform" });
    }

    window.gsap.utils.toArray(".reveal").forEach((item) => {
      window.gsap.fromTo(item, {
        y: 10
      }, {
        y: 0,
        duration: 0.32,
        ease: "power3.out",
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: item,
          start: "top 94%",
          toggleActions: "play none none none"
        }
      });
    });

    document.querySelectorAll(".counter").forEach((counter) => {
      const target = Number(counter.dataset.target || 0);
      const state = { value: 0 };
      window.gsap.to(state, {
        value: target,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: { trigger: counter, start: "top 95%" },
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
