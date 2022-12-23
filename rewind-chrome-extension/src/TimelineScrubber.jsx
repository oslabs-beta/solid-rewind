

/* global chrome */
import { createSignal } from 'solid-js';
import styles from './App.module.css';


import { sendData } from './sender';
import { listenFor } from './listener';

function TimelineScrubber() {

  const [maxSteps, setMaxSteps] = createSignal(0);
  const [currentStep, setCurrentStep] = createSignal(0);

  // LISTEN FOR STATE EVENTS
  listenFor('STATE_INCREMENT', stateIncrementOccured)
  function stateIncrementOccured( newMaxSteps ) {
    const steps = JSON.parse(newMaxSteps)[0];
    setMaxSteps(steps);
    setCurrentStep(steps);
  }

  // LISTEN FOR RESET
  listenFor('RESET_STATE', restState);
  function restState() {
    console.log("RESET STATE RECIEVED");
    setMaxSteps(0);
    setCurrentStep(0);
  }


  // step forward and back
  const goBack = () => {
    sendData(1, 'BACK');
    if (currentStep() > 0) setCurrentStep(Number(currentStep())-1);
  }
  const goForward = () => {
    sendData(1, 'FORWARD');
    if (currentStep() < maxSteps()) setCurrentStep(Number(currentStep())+1);
  }

  const onInput = (e) => {
    // set current step
    const diff = e.target.value - currentStep();
    console.log("TIME TRAVEL THIS FAR:", diff);
    if (diff < 0) sendData(Math.abs(diff), 'BACK');
    else sendData(Math.abs(diff), 'FORWARD');
    setCurrentStep(e.target.value);
  }

  return (
    <div class={styles.timelineContainer}>

      <input type="range" min="0" max={maxSteps()} onInput={(e) => onInput(e)} value={currentStep()} className="range range-warning" />
      {/* <input type="range" name="quantity" min="0" max={maxSteps()} class={styles.timelineSlider} onInput={(e) => onInput(e)} value={currentStep()} ></input> */}
      {/* <Form.Label>Timeline</Form.Label><br></br> */}
      {/* <Form.Range min="0" max={maxSteps()} class={styles.timelineSlider} onInput={onInput} onChange={sliderChange} value={currentStep()} /> */}
      <br></br>
      <div class={ styles.timeButtonContainer }>
        <button onClick={goBack} class="btn btn-primary">Back</button>
        <button onClick={goForward} class="btn btn-primary">Forward</button>
        {/* <button onClick={goBack}>Back</button>
        <button onClick={goForward}>Forward</button> */}
      </div>
      
    </div>
  );
}

export default TimelineScrubber;
