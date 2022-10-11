import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const KEY_NAME_ESC = 'Escape';
const KEY_EVENT_TYPE = 'keyup';
const MOUSE_UP = 'mouseup';

export const useEscapeKey = (handleClose) => {
  const handleEscKey = useCallback(
    (event) => {
      if (event.key === KEY_NAME_ESC) {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false);

    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false);
    };
  }, [handleEscKey]);
};

useEscapeKey.proptypes = {
  handleClose: PropTypes.func.isRequired
};

export const useOutsideClick = (handleClose, ref) => {
  const handleClick = useCallback(
    (event) => {
      console.log('handleClick', event.target, ref);
      if (ref && ref.current && !ref.current.contains(event.target)) {
        handleClose();
      }
    },
    [handleClose, ref]
  );

  useEffect(() => {
    document.addEventListener(MOUSE_UP, handleClick);

    return () => {
      document.removeEventListener(MOUSE_UP, handleClick);
    };
  }, [handleClick]);
  return { handleClose };
};

useOutsideClick.propTyoes = {
  handleClose: PropTypes.func.isRequired,
  ref: PropTypes.element.isRequired
};
export default { useEscapeKey, useOutsideClick };
