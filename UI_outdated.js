class UI {
  constructor({ playerName }) {
    this.playerName = playerName;
    this.tracker;
  }

  createElement() {
    //Button Array
    this.buttonArrayElement = document.createElement('div');
    this.buttonArrayElement.classList.add('buttonArray');
    this.buttonArrayElement.innerHTML = (`
      <div class="buttonContainer">
        <button id="map-btn" class="keyButton">M</button>
        <button id="inv-btn" class="keyButton">I</button>
        <button id="notes-btn" class="keyButton">N</button>
      </div>
      <div class="textContainer">
        <div id="map-text" class="keyDescription">Karte</div>
        <div id="inv-text" class="keyDescription">Inventar</div>
        <div id="notes-text" class="keyDescription">Notizen</div>
      </div>
      <div id="overlay"></div>
    `);

    //Oxygen Bar
    this.element = document.createElement("div");
    this.element.classList.add("OxygenBar");
    this.element.innerHTML = (`
      <p class="Player_name">${this.playerName}</p>
      <img class="Icon" src="/images/icons/lung.png" />
      <svg viewBox="0 0 24 5" class="Oxygen-container">
        <rect x=0 y=0 width="100%" height=1 fill="#00ffff" />
        <rect x=0 y=1 width="100%" height=3 fill="#08daff" />
        <rect x=0 y=4 width="100%" height=1 fill="#00b3ff" />
      </svg>
    `);

    this.fill = this.element.querySelectorAll(".Oxygen-container > rect");

  }

  updateFill(value) {

    //Update oxygen percent fills
    this.tracker = value || 0;
    this.percentage = (1-(Math.floor(this.tracker/4)/5)) * 100;
    this.fill.forEach(rect => rect.style.width = `${this.percentage}%`);

  }

  init(container) {
    this.createElement();
    container.append(this.buttonArrayElement);
    container.appendChild(this.element);
    this.updateFill();
  }

}