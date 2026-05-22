import gsap from "gsap";

/**
 * Splits the text content of an element into individual characters, each wrapped in a span.
 * Preserves spaces as non-breaking spaces to prevent layout issues.
 * @param element - The DOM element to split.
 * @returns Array of character span elements created.
 */
export const splitTextIntoSpans = (element: HTMLElement | null): HTMLElement[] => {
  if (!element) return [];
  const text = element.textContent || "";
  element.innerHTML = "";
  const spans: HTMLElement[] = [];

  text.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char; // Non-breaking space for spaces
    span.style.display = "inline-block";
    span.style.whiteSpace = "pre";
    span.className = "char-span inline-block origin-bottom";
    element.appendChild(span);
    spans.push(span);
  });

  return spans;
};

/**
 * Splits the text content of an element into individual words, each wrapped in a span.
 * @param element - The DOM element to split.
 * @returns Array of word span elements created.
 */
export const splitTextIntoWords = (element: HTMLElement | null): HTMLElement[] => {
  if (!element) return [];
  const text = element.textContent || "";
  element.innerHTML = "";
  const spans: HTMLElement[] = [];

  text.split(" ").forEach((word, index, array) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.display = "inline-block";
    span.className = "word-span inline-block";
    element.appendChild(span);
    spans.push(span);

    // Add space after word if it's not the last one
    if (index < array.length - 1) {
      const space = document.createElement("span");
      space.textContent = "\u00A0";
      space.style.display = "inline-block";
      element.appendChild(space);
    }
  });

  return spans;
};

/**
 * Initializes and triggers an SVG path drawing animation using ScrollTrigger.
 * Measures path length dynamically and sets up strokeDasharray/strokeDashoffset.
 * @param path - The SVG path element to animate.
 * @param scrollTriggerOptions - Configuration overrides for ScrollTrigger.
 * @returns GSAP Tween instance.
 */
export const initDrawSVG = (path: SVGPathElement | null, scrollTriggerOptions = {}): gsap.core.Tween | null => {
  if (!path) return null;

  // Measure the path length
  const length = path.getTotalLength();

  // Set up the stroke settings
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  // Animate from total length to 0
  return gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: path,
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
      ...scrollTriggerOptions,
    },
  });
};

/**
 * High-end text scramble effect. Iteratively mutates text with random characters,
 * resolving to the final text. Runs smoothly in GSAP's timeline.
 * @param element - The DOM element whose text is to be scrambled.
 * @param finalText - The resolved text.
 * @param duration - The duration of the scramble.
 */
export const scrambleText = (element: HTMLElement | null, finalText: string, duration = 0.8): void => {
  if (!element) return;

  const chars = "XØÆØ101_#%&*+=-<>?/\\!@$";
  const length = finalText.length;
  const progressObj = { progress: 0 };

  gsap.killTweensOf(progressObj);

  gsap.to(progressObj, {
    progress: 1,
    duration: duration,
    ease: "power2.out",
    onUpdate: () => {
      const progress = progressObj.progress;
      let scrambled = "";

      for (let i = 0; i < length; i++) {
        // If progress is far enough, show the correct char
        if (i / length < progress) {
          scrambled += finalText[i];
        } else {
          // Otherwise, show a random char
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.textContent = scrambled;
    },
    onComplete: () => {
      element.textContent = finalText;
    },
  });
};

export const makeMagnetic = (element: HTMLElement | null, strength = 0.25): (() => void) | undefined => {
  if (!element) return;

  let isActive = false;

  const handleMouseEnter = () => {
    isActive = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isActive) return;

    const rect = element.getBoundingClientRect();
    const elemX = rect.left + rect.width / 2;
    const elemY = rect.top + rect.height / 2;

    const deltaX = e.clientX - elemX;
    const deltaY = e.clientY - elemY;

    // Cap the translation to prevent excessive displacement/overlapping
    const maxOffset = 14;
    const targetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * strength));
    const targetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * strength));

    gsap.to(element, {
      x: targetX,
      y: targetY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    isActive = false;
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1.1, 0.4)",
    });
  };

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};
