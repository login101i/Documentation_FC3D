import {useHistory} from '@docusaurus/router';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useEffect, useRef} from 'react';

const COOLDOWN_MS = 900;
const EDGE_PX = 48;

/**
 * Word-like sequential reading: at the bottom, scroll/wheel down opens the
 * next doc; at the top, wheel up opens the previous. Left sidebar stays.
 */
export default function ScrollPageNav() {
  const {metadata} = useDoc();
  const history = useHistory();
  const lockRef = useRef(false);

  useEffect(() => {
    const flag = sessionStorage.getItem('fc3d-scroll-edge');
    if (!flag) {
      return undefined;
    }
    sessionStorage.removeItem('fc3d-scroll-edge');
    const id = window.requestAnimationFrame(() => {
      if (flag === 'bottom') {
        window.scrollTo(0, document.documentElement.scrollHeight);
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [metadata.id]);

  useEffect(() => {
    function navigate(permalink, edge) {
      if (!permalink || lockRef.current) {
        return;
      }
      lockRef.current = true;
      sessionStorage.setItem('fc3d-scroll-edge', edge);
      history.push(permalink);
      window.setTimeout(() => {
        lockRef.current = false;
      }, COOLDOWN_MS);
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

    function onWheel(event) {
      if (Math.abs(event.deltaY) < 8) {
        return;
      }
      if (event.deltaY > 0 && atBottom() && metadata.next?.permalink) {
        event.preventDefault();
        navigate(metadata.next.permalink, 'top');
      } else if (event.deltaY < 0 && atTop() && metadata.previous?.permalink) {
        event.preventDefault();
        navigate(metadata.previous.permalink, 'bottom');
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
      if (delta > 40 && atBottom() && metadata.next?.permalink) {
        navigate(metadata.next.permalink, 'top');
      } else if (delta < -40 && atTop() && metadata.previous?.permalink) {
        navigate(metadata.previous.permalink, 'bottom');
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
  }, [history, metadata.next, metadata.previous]);

  if (!metadata.previous && !metadata.next) {
    return null;
  }

  return (
    <p className="scroll-page-hint" aria-hidden="true">
      {metadata.next
        ? `Przewiń w dół na końcu strony → ${metadata.next.title}`
        : metadata.previous
          ? `Przewiń w górę na początku strony → ${metadata.previous.title}`
          : null}
    </p>
  );
}
