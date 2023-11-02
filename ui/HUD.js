class HUD {
  constructor({playerName, progress}) {
    this.playerName = playerName;
    this.progress = progress;
    this.tracker;
    this.timerValue = this.progress.timerValue;

  }

  createElement() {
    //Button Array
    this.buttonArrayElement = document.createElement('div');
    this.buttonArrayElement.classList.add('ButtonArray');
    this.buttonArrayElement.innerHTML = (`
      <div class="ButtonContainer">
        <button id="map" class="KeyButton">M</button>
        <button id="inventory" class="KeyButton">I</button>
        <button id="notes" class="KeyButton">N</button>
      </div>
      <div class="TextContainer">
        <div id="map-text" class="KeyDescription">Karte</div>
        <div id="inv-text" class="KeyDescription">Inventar</div>
        <div id="notes-text" class="KeyDescription">Notizen</div>
      </div>
    `);

    //Oxygen Bar
    this.oxygenBarElement = document.createElement("div");
    this.oxygenBarElement.classList.add("OxygenBar");
    this.oxygenBarElement.innerHTML = (`
      <p class="PlayerName">${this.playerName}</p>
      <img class="Icon" src="/images/icons/lung.png" />
      <svg viewBox="0 0 24 5" class="OxygenContainer">
        <rect x=0 y=0 width="100%" height=1 fill="#00ffff" />
        <rect x=0 y=1 width="100%" height=3 fill="#08daff" />
        <rect x=0 y=4 width="100%" height=1 fill="#00b3ff" />
      </svg>
    `);
    
    this.fill = this.oxygenBarElement.querySelectorAll(".OxygenContainer > rect");

    //Timer
    this.timerElement = document.createElement("div");
    this.timerElement.classList.add("Timer");
    this.timerElement.innerHTML = (`
      <div class="TimerContent">${this.convertToDigital(this.timerValue)}</div> 
    `);

  }   
          

  //Updates oxygen bar
  updateFill(value) {
    //Update oxygen percent fills
    this.tracker = value || 0;
    this.percentage = (1-(Math.floor(this.tracker/4)/5)) * 100;
    this.fill.forEach(rect => rect.style.width = `${this.percentage}%`);

  }

  updateTimer(value) {
    this.timerValue = value;
    this.timerContent = this.timerElement.querySelector('.TimerContent');
    this.timerContent.innerHTML = (`
      ${this.convertToDigital(this.timerValue)}
    `);

    //Timer turns red on second 1,3 and 5 
    if (this.timerValue === 5 || 
        this.timerValue === 3 ||
        this.timerValue === 1) {
      this.timerContent.style.color = '#600';
    } else {
      this.timerContent.style.color = '#000';
    }

  }

  convertToDigital(totalSeconds) {
    var minutes = Math.floor(totalSeconds/60);
    var seconds = totalSeconds % 60;

    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    return m + ":" + s 

  }
      
  init(container) {
    this.createElement();
    container.append(this.buttonArrayElement);
    container.append(this.oxygenBarElement);
    container.append(this.timerElement);
    this.updateFill();

  }

}