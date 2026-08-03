const catalogButton = document.getElementById("catalog_button");
const catalogPanel = document.getElementById("catalog_panel");

if (catalogButton && catalogPanel) {
  let closeTimer;
  const categoryLinks = catalogPanel.querySelectorAll("[data-catalog-target]");
  const catalogContents = catalogPanel.querySelectorAll("[data-catalog-content]");

  const openCatalog = () => {
    window.clearTimeout(closeTimer);
    catalogPanel.removeAttribute("inert");
    catalogPanel.classList.add("is-open");
    catalogPanel.setAttribute("aria-hidden", "false");
    catalogButton.setAttribute("aria-expanded", "true");
  };

  const closeCatalog = ({ restoreFocus = false } = {}) => {
    window.clearTimeout(closeTimer);
    catalogPanel.classList.remove("is-open");
    catalogPanel.setAttribute("aria-hidden", "true");
    catalogPanel.setAttribute("inert", "");
    catalogButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) catalogButton.focus();
  };

  const scheduleClose = () => {
    closeTimer = window.setTimeout(() => closeCatalog(), 140);
  };

  catalogButton.addEventListener("mouseenter", openCatalog);
  catalogButton.addEventListener("mouseleave", scheduleClose);
  catalogPanel.addEventListener("mouseenter", openCatalog);
  catalogPanel.addEventListener("mouseleave", scheduleClose);

  catalogButton.addEventListener("click", () => {
    if (catalogPanel.classList.contains("is-open")) closeCatalog();
    else openCatalog();
  });

  catalogButton.addEventListener("keydown", (event) => {
    if (["Enter", " ", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      openCatalog();
      catalogPanel.querySelector("a")?.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!catalogPanel.contains(event.target) && !catalogButton.contains(event.target)) {
      closeCatalog();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && catalogPanel.classList.contains("is-open")) {
      closeCatalog({ restoreFocus: true });
    }
  });

  catalogPanel.addEventListener("focusout", (event) => {
    if (!catalogPanel.contains(event.relatedTarget) && event.relatedTarget !== catalogButton) {
      scheduleClose();
    }
  });

  const showCategory = (categoryLink) => {
    const targetId = categoryLink.dataset.catalogTarget;

    categoryLinks.forEach((link) => {
      const isSelected = link === categoryLink;
      link.classList.toggle("is-active", isSelected);
      if (isSelected) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    catalogContents.forEach((content) => {
      content.classList.toggle("is-active", content.id === targetId);
    });
  };

  categoryLinks.forEach((categoryLink) => {
    categoryLink.addEventListener("mouseenter", () => showCategory(categoryLink));
    categoryLink.addEventListener("focus", () => showCategory(categoryLink));
    categoryLink.addEventListener("click", (event) => {
      event.preventDefault();
      showCategory(categoryLink);
    });
  });
}

const initializeSwiper = (selector, options) => {
  const element = document.querySelector(selector);

  if (!element || typeof Swiper === "undefined") return null;

  try {
    return new Swiper(element, options);
  } catch (error) {
    console.error(`Swiper initialization failed for ${selector}:`, error);
    return null;
  }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const megaSlider = initializeSwiper("#mslider0", {
  slidesPerView: 1,
  effect: "fade",
  loop: true,
  parallax: true,
  grabCursor: true,
  speed: 600,
  fadeEffect: {
    crossFade: true,
  },
  autoplay: prefersReducedMotion
    ? false
    : {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  navigation: {
    nextEl: ".megasliderpro .ms-next",
    prevEl: ".megasliderpro .ms-prev",
  },
  pagination: {
    el: ".megasliderpro .swiper-ms-pagination",
    type: "bullets",
    clickable: true,
  },
  watchOverflow: true,
});

const brandSwiper = initializeSwiper(".brand_swiper", {
  slidesPerView: 1,
  spaceBetween: 12,
  rewind: true,
  watchOverflow: true,
  grabCursor: true,
  navigation: {
    nextEl: ".brand-swiper-button-next",
    prevEl: ".brand-swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 7,
      spaceBetween: 10,
    },
  },
});

const productSwiper = initializeSwiper(".products_slider", {
  slidesPerView: 5,
  loop: true,
  spaceBetween: 15,
  navigation: {
    nextEl: ".product-swiper-button-next",
    prevEl: ".product-swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});

const productSwiperTwo = initializeSwiper(".products_slider_two", {
  slidesPerView: 5,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: ".product-swiper-button-next",
    prevEl: ".product-swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});

document.querySelectorAll(".review_text").forEach((reviewText, index) => {
  const reviewTextId = `review-text-${index + 1}`;
  const toggleButton = document.createElement("button");

  reviewText.id = reviewTextId;
  toggleButton.type = "button";
  toggleButton.className = "review_read_more";
  toggleButton.setAttribute("aria-controls", reviewTextId);
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.textContent = "Daha ətraflı";
  toggleButton.hidden = true;

  const updateButtonVisibility = () => {
    if (reviewText.classList.contains("is-expanded")) return;

    toggleButton.hidden = reviewText.scrollHeight <= reviewText.clientHeight + 1;
  };

  toggleButton.addEventListener("click", () => {
    const isExpanded = reviewText.classList.toggle("is-expanded");

    toggleButton.setAttribute("aria-expanded", String(isExpanded));
    toggleButton.textContent = isExpanded ? "Gizlət" : "Daha ətraflı";

    if (!isExpanded) requestAnimationFrame(updateButtonVisibility);
  });

  reviewText.insertAdjacentElement("afterend", toggleButton);
  requestAnimationFrame(updateButtonVisibility);

  if ("ResizeObserver" in window) {
    const reviewResizeObserver = new ResizeObserver(updateButtonVisibility);
    reviewResizeObserver.observe(reviewText);
  }
});


const header = document.querySelector(".header_fixed")

window.addEventListener("scroll", () => {
  if(window.scrollY > 20) {
    header.classList.add("is-scrolled")
  } else {
    header.classList.remove("is-scrolled")
  }
})