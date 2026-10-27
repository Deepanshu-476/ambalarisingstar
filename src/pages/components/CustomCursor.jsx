import { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

function wrapHeadingWords(root = document) {
  try {
    const headings = root.querySelectorAll(
      "h1, h2, h3, h4, .ck-section-heading h2, .ck-kicker, .home-offer__title, .nex-cta__title"
    );
    headings.forEach((heading) => {
      if (heading.dataset.zoomReady === "true") return;
      heading.dataset.zoomReady = "true";

      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.trim().length > 0) {
          textNodes.push(node);
        }
      }

      textNodes.forEach((tNode) => {
        const parent = tNode.parentNode;
        if (!parent || parent.classList?.contains("cds-zoom-word")) return;

        const words = tNode.nodeValue.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach((token) => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
          } else {
            const span = document.createElement("span");
            span.className = "cds-zoom-word";
            span.textContent = token;
            fragment.appendChild(span);
          }
        });

        parent.replaceChild(fragment, tNode);
      });
    });
  } catch {
    // Graceful fallback if DOM is detached
  }
}

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState({
    hover: false,
    invert: false,
    clicking: false,
    visible: false,
  });

  const mousePos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const innerRef = useRef(null);
  const outerRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    // Hide default cursor on desktop when custom cursor is active
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    // Initial heading word wrap + observer for route transitions
    wrapHeadingWords();
    const observer = new MutationObserver(() => {
      wrapHeadingWords();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!cursorState.visible) {
        setCursorState((prev) => ({ ...prev, visible: true }));
      }

      // Fast update for inner dot
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const loop = () => {
      // Smooth spring lerp trailing for outer circle
      outerPos.current.x += (mousePos.current.x - outerPos.current.x) * 0.22;
      outerPos.current.y += (mousePos.current.y - outerPos.current.y) * 0.22;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    // Event delegation to catch all headings, zoom words and interactive elements
    const onMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      // 1. Heading or Word hover -> Translucent lime highlight lens
      const isHeadingOrWord = target.closest(
        "h1, h2, h3, h4, .cds-zoom-word, .ck-section-heading h2, .ck-kicker, .home-offer__title, .nex-cta__title, .ck-copy h1, .ck-copy h2, .ck-join h2"
      );

      if (isHeadingOrWord) {
        setCursorState((prev) => ({ ...prev, invert: true, hover: false }));
        return;
      }

      // 2. Button / Link hover -> Expanded Ring
      const isInteractive = target.closest(
        "a, button, input, textarea, select, .ck-button, .cds-card-tag, .cds-text-link, .ck-film-play"
      );

      if (isInteractive) {
        setCursorState((prev) => ({ ...prev, hover: true, invert: false }));
        return;
      }

      // 3. Normal state -> Green Dot + Outer Ring
      setCursorState((prev) => ({ ...prev, hover: false, invert: false }));
    };

    const onMouseDown = () => {
      setCursorState((prev) => ({ ...prev, clicking: true }));
    };

    const onMouseUp = () => {
      setCursorState((prev) => ({ ...prev, clicking: false }));
    };

    const onMouseLeaveDoc = () => {
      setCursorState((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveDoc);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [cursorState.visible]);

  return (
    <>
      <div
        ref={outerRef}
        className={`mouseCursor cursor-outer ${
          cursorState.hover ? "cursor-hover" : ""
        } ${cursorState.invert ? "cursor-invert" : ""} ${
          cursorState.clicking ? "cursor-clicking" : ""
        } ${cursorState.visible ? "is-active" : ""}`}
        aria-hidden="true"
      />
      <div
        ref={innerRef}
        className={`mouseCursor cursor-inner ${
          cursorState.hover ? "cursor-hover" : ""
        } ${cursorState.invert ? "cursor-invert" : ""} ${
          cursorState.clicking ? "cursor-clicking" : ""
        } ${cursorState.visible ? "is-active" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
