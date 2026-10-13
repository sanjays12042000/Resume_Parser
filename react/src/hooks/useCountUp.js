import { useEffect, useState } from "react";

/**
 * Counts up to `target` when it changes, so the score reads as a result
 * arriving rather than a number that was always there.
 */
export default function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
