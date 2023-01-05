/* global chrome */
import { createSignal } from 'solid-js';


function DragBar(props) {

  const [mouseListeners, setMouseListeners] = createSignal(false);
  const [winSize, setWinSize] = createSignal(null);

  const startDrag = () => {
    // clear event listeners if they are still somehow there.
    if (mouseListeners()) removeListeners();

    // if mouseMove listener is not on, add it.
    if (!mouseListeners()) {
      setMouseListeners(true);
      window.addEventListener('mousemove', handeMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  }

  const handeMouseMove = (e) => {
    const dragObj = document.querySelector('.'+ props.drag);

    if (winSize() === null) {
      setWinSize(dragObj.offsetHeight);
    }

    setWinSize(Math.max(0, winSize() + e.movementY));
    dragObj.style.height = `${winSize()}px`;
  }

  const handleMouseUp = (e) => {
    removeListeners();
  }

  const removeListeners = () => {
    window.removeEventListener('mousemove', handeMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    setMouseListeners(false);
  }

  return (
    <div class='dragBar' onMouseDown={startDrag}>
      <div class='dragBoxIcon'>
        <div class='dragBarLine'></div>
        <div class='dragBarLine dragBarLineBottom'></div>
      </div>
    </div>
  );
}

export default DragBar;
