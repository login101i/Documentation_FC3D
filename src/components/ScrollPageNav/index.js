import {useHistory} from '@docusaurus/router';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useEffect, useRef} from 'react';

const COOLDOWN_MS = 850;
const EDGE_PX = 48;
const ANIM_MS = 420;
const STORAGE_EDGE = 'fc3d-scroll-edge';
const STORAGE_DIR = 'fc3d-scroll-dir';

function isMainTopicPage(metadata) {
  const id = metadata?.id || '';
  const permalink = metadata?.permalink || '';
  return id.startsWith('category/') || permalink.includes('/category/');
}

function getPageRoot() {
  return (
    document.querySelector('.theme-doc-markdown') ||
    document.querySelector('article') ||
    document.querySelector('.docItemContainer')
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
 * Nawigacja jak w książce: scroll na końcu/początku zmienia stronę.
 * Na głównym temacie scroll w dół od góry otwiera pierwszy subtemat + krótka animacja.
 */
export default function ScrollPageNav() {
  const {metadata} = useDoc();
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
  }, [metadata.id]);

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

    const mainTopic = isMainTopicPage(metadata);

    function onWheel(event) {
      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      if (
        event.deltaY > 0 &&
        metadata.next?.permalink &&
        (mainTopic ? atTop() || atBottom() : atBottom())
      ) {
        event.preventDefault();
        navigate(metadata.next.permalink, 'top', 'next');
        return;
      }

      if (event.deltaY < 0 && atTop() && metadata.previous?.permalink) {
        event.preventDefault();
        navigate(metadata.previous.permalink, 'bottom', 'prev');
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
        delta > 40 &&
        metadata.next?.permalink &&
        (mainTopic ? atTop() || atBottom() : atBottom())
      ) {
        navigate(metadata.next.permalink, 'top', 'next');
      } else if (delta < -40 && atTop() && metadata.previous?.permalink) {
        navigate(metadata.previous.permalink, 'bottom', 'prev');
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
  }, [history, metadata]);

  if (!metadata.previous && !metadata.next) {
    return null;
  }

  const mainTopic = isMainTopicPage(metadata);
  const hint =
    mainTopic && metadata.next
      ? `Przewiń w dół → ${metadata.next.title}`
      : metadata.next
        ? `Przewiń w dół na końcu strony → ${metadata.next.title}`
        : metadata.previous
          ? `Przewiń w górę na początku strony → ${metadata.previous.title}`
          : null;

  return (
    <p className="scroll-page-hint" aria-hidden="true">
      {hint}
    </p>
  );
}
