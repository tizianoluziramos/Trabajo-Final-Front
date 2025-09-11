export const Notification = {
  container: null,
  maxNotifications: 5,

  init() {
    if (!this.container) {
      const existing = document.getElementById("notification-container");
      if (existing) {
        this.container = existing;
      } else {
        this.container = document.createElement("div");
        this.container.id = "notification-container";
        document.body.appendChild(this.container);
      }
    }
  },

  _removeElement(el) {
    if (!el || el.classList.contains("hide")) return;
    el.classList.remove("show");
    el.classList.add("hide");

    const transitionDuration = 500;
    setTimeout(() => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, transitionDuration);
  },

  _removeOldestVisible() {
    const oldest = this.container.querySelector(".notification:not(.hide)");
    if (oldest) this._removeElement(oldest);
  },

  show(message, type = "info") {
    this.init();

    const visibleCount = this.container.querySelectorAll(
      ".notification:not(.hide)"
    ).length;

    if (visibleCount >= this.maxNotifications) {
      this._removeOldestVisible();
    }

    // Ajuste dinámico de duración según cantidad de notificaciones
    let duration;
    switch (
      visibleCount + 1 // +1 porque vamos a mostrar una nueva
    ) {
      case 5:
        duration = 1500;
        break;
      case 4:
        duration = 2000;
        break;
      case 3:
        duration = 2500;
        break;
      default:
        duration = 3000; // 1 o 2 notificaciones
    }

    const notif = document.createElement("div");
    notif.className = `notification ${type}`;
    notif.textContent = message;
    notif.style.position = "relative";

    this.container.appendChild(notif);

    requestAnimationFrame(() => notif.classList.add("show"));

    setTimeout(() => {
      if (document.body.contains(notif)) this._removeElement(notif);
    }, duration);
  },
};
