

/* global chrome */
import { createSignal } from 'solid-js';
import styles from './App.module.css';


import { sendData } from './sender';

function TimelineScrubber() {

  const [maxSteps, setMaxSteps] = createSignal(0);
  const [currentStep, setCurrentStep] = createSignal(0);

  // LISTEN FOR STATE EVENTS
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log('TIME SCRUB MESG:', request);
      if (request.value === 'STATE_INCREMENT') {
        // max steps is current step
        setMaxSteps(currentStep());
        
        // increment current step
        setCurrentStep(Number(currentStep())+1); // needs number wrapper

        console.log('cstep:', currentStep());
        console.log('maxstep:', maxSteps());
      }
    }
  );

  // step forward and back
  const goBack = () => {
    sendData(1, 'BACK');
  }
  const goForward = () => {
    sendData(1, 'FORWARD');
  }

  const onInput = (e) => {
    // set current step
    setCurrentStep(e.target.value);
  }

  return (
    <div class={styles.timelineContainer}>

      <input type="range" name="quantity" min="0" max={maxSteps()} class={styles.timelineSlider} onInput={(e) => onInput(e)} value={currentStep()} ></input>
      {/* <Form.Label>Timeline</Form.Label><br></br> */}
      {/* <Form.Range min="0" max={maxSteps()} class={styles.timelineSlider} onInput={onInput} onChange={sliderChange} value={currentStep()} /> */}
      <br></br>
      <div class={ styles.timeButtonContainer }>
        <button onClick={goBack}>Back</button>
        <button onClick={goForward}>Forward</button>
      </div>
      
    </div>
  );
}

export default TimelineScrubber;
