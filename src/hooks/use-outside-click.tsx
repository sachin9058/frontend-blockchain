import React, { useEffect } from "react";
type ClickHandler = (event: MouseEvent | TouchEvent) => void;

export const useOutsideClick = (

  ref: React.RefObject<HTMLElement>,
  callback: ClickHandler
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
