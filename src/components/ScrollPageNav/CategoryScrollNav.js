import {useHistory} from '@docusaurus/router';
import {useEffect, useRef} from 'react';

const COOLDOWN_MS = 850;
const EDGE_PX = 64;
const ANIM_MS = 420;
const STORAGE_EDGE = 'fc3d-scroll-edge';
const STORAGE_DIR = 'fc3d-scroll-dir';

function getPageRoot() {
  return (
    document.querySelector('.generatedIndexPage_vN6x') ||
    document.querySelector('[class*="generatedIndexPage"]') ||
    document.querySelector('article') ||
    document.querySelector('main')
  );
}

function clearAnim(el) {
  if (!el) {
    return;
  }
  el.classList.remove(
    'fc3d-page-leave-next',
    'fc3d-page-leave-prev',
    'fc3d-page-enter-next',
    'fc3d-page-enter-prev',
  );
}

/**
 * Scroll jak w książce na stronach głównych tematów (generated-index).
 * Scroll w dół → pierwszy subtemat.
 */
export default function CategoryScrollNav({previous, next, isMainTopic = true}) {
  const history = useHistory();
  const lockRef = useRef(false);

  useEffect(() => {
    const dir = sessionStorage.getItem(STORAGE_DIR);
    const edge = sessionStorage.getItem(STORAGE_EDGE);
    sessionStorage.removeItem(STORAGE_DIR);
    sessionStorage.removeItem(STORAGE_EDGE);

    const root = getPageRoot();
    let clearTimer;
    if (root && dir) {
      clearAnim(root);
      void root.offsetWidth;
      root.classList.add(dir === 'next' ? 'fc3d-page-enter-next' : 'fc3d-page-enter-prev');
      clearTimer = window.setTimeout(() => clearAnim(root), ANIM_MS);
    }

    const id = window.requestAnimationFrame(() => {
      if (edge === 'bottom') {
        window.scrollTo(0, document.documentElement.scrollHeight);
      } else if (edge === 'top') {
        window.scrollTo(0, 0);
      }
    });

    return () => {
      window.cancelAnimationFrame(id);
      if (clearTimer) {
        window.clearTimeout(clearTimer);
      }
    };
  }, []);

  useEffect(() => {
    function navigate(permalink, edge, dir) {
      if (!permalink || lockRef.current) {
        return;
      }
      lockRef.current = true;
      sessionStorage.setItem(STORAGE_EDGE, edge);
      sessionStorage.setItem(STORAGE_DIR, dir);

      const root = getPageRoot();
      if (root) {
        clearAnim(root);
        void root.offsetWidth;
        root.classList.add(dir === 'next' ? 'fc3d-page-leave-next' : 'fc3d-page-leave-prev');
      }

      window.setTimeout(() => {
        history.push(permalink);
        window.setTimeout(() => {
          lockRef.current = false;
        }, COOLDOWN_MS);
      }, 150);
    }

    function atBottom() {
      return (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - EDGE_PX
      );
    }

    function atTop() {
      return window.scrollY <= EDGE_PX;
    }

    function pageIsShort() {
      return document.documentElement.scrollHeight <= window.innerHeight + EDGE_PX;
    }

    function onWheel(event) {
      if (Math.abs(event.deltaY) < 6) {
        return;
      }

      // Na głównym temacie: scroll w dół → pierwszy subtemat
      if (
        event.deltaY > 0 &&
        next?.permalink &&
        (isMainTopic ? atTop() || atBottom() || pageIsShort() : atBottom())
      ) {
        event.preventDefault();
        navigate(next.permalink, 'top', 'next');
        return;
      }

      if (event.deltaY < 0 && atTop() && previous?.permalink) {
        event.preventDefault();
        navigate(previous.permalink, 'bottom', 'prev');
      }
    }

    let touchY = null;
    function onTouchStart(event) {
      touchY = event.touches[0]?.clientY ?? null;
    }
    function onTouchEnd(event) {
      if (touchY == null) {
        return;
      }
      const endY = event.changedTouches[0]?.clientY ?? touchY;
      const delta = touchY - endY;
      touchY = null;

      if (
        delta > 35 &&
        next?.permalink &&
        (isMainTopic ? atTop() || atBottom() || pageIsShort() : atBottom())
      ) {
        navigate(next.permalink, 'top', 'next');
      } else if (delta < -35 && atTop() && previous?.permalink) {
        navigate(previous.permalink, 'bottom', 'prev');
      }
    }

    window.addEventListener('wheel', onWheel, {passive: false});
    window.addEventListener('touchstart', onTouchStart, {passive: true});
    window.addEventListener('touchend', onTouchEnd, {passive: true});
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [history, previous, next, isMainTopic]);

  if (!previous && !next) {
    return null;
  }

  const hint =
    isMainTopic && next
      ? `Przewiń w dół → ${next.title}`
      : next
        ? `Przewiń w dół na końcu strony → ${next.title}`
        : previous
          ? `Przewiń w górę → ${previous.title}`
          : null;

  return (
    <p className="scroll-page-hint" aria-hidden="true">
      {hint}
    </p>
  );
}
