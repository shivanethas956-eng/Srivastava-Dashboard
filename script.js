document.addEventListener("DOMContentLoaded", function () {
  // Animate profile & about sections on initial load
  const profile = document.querySelector(".profile");
  const about = document.querySelector(".about");

  if (profile) {
    profile.classList.add("fade-in");
    profile.style.animationDelay = "0.2s";
  }

  if (about) {
    about.classList.add("slide-up");
    about.style.animationDelay = "0.4s";
  }

  // Copy email functionality
  const copyButton = document.querySelector(".contact__copy");
  const emailText = document.querySelector(".contact__text");
  const contactItem = document.querySelector(".contact__item");
  let highlightTimeout;

  // Add item highlight with 3-second timeout
  function addHighlightWithTimeout() {
    clearTimeout(highlightTimeout);
    if (contactItem) {
      contactItem.classList.add("highlighted");
      highlightTimeout = setTimeout(() => {
        contactItem.classList.remove("highlighted");
      }, 3000);
    }
  }

  // Remove highlight immediately
  function removeHighlight() {
    clearTimeout(highlightTimeout);
    if (contactItem) {
      contactItem.classList.remove("highlighted");
    }
  }

  async function copyEmailToClipboard() {
    if (!emailText) return;
    const email = emailText.textContent.trim();
    const icon = copyButton ? copyButton.querySelector("i") : null;
    const originalClass = icon ? icon.className : "fas fa-copy";

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        showFeedback(true);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      // Fallback for non-secure context or older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        showFeedback(true);
      } catch (fallbackErr) {
        showFeedback(false);
      }

      document.body.removeChild(textArea);
    }

    function showFeedback(success) {
      if (!icon || !copyButton) return;
      icon.className = success ? "fas fa-check" : "fas fa-times";
      copyButton.style.color = success ? "#4ade80" : "#ef4444";

      setTimeout(() => {
        icon.className = originalClass;
        copyButton.style.color = "";
        if (window.matchMedia("(hover: none)").matches) {
          removeHighlight();
        }
      }, 2000);
    }
  }

  if (copyButton) {
    copyButton.addEventListener("click", function (e) {
      e.stopPropagation();
      copyEmailToClipboard();
    });
  }

  if (contactItem) {
    // Clicking anywhere on contact box triggers copy
    contactItem.addEventListener("click", function () {
      copyEmailToClipboard();
    });

    // Hover & focus handlers
    contactItem.addEventListener("mouseenter", addHighlightWithTimeout);
    contactItem.addEventListener("mouseleave", removeHighlight);
    contactItem.addEventListener("focus", addHighlightWithTimeout);
    contactItem.addEventListener("blur", removeHighlight);

    // Keyboard support (Enter or Space to copy)
    contactItem.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        copyEmailToClipboard();
      }
    });

    // Mobile touch interaction
    document.addEventListener("touchstart", function (e) {
      if (!contactItem.contains(e.target)) {
        contactItem.blur();
        removeHighlight();
      }
    });
  }
});
