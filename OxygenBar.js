class OxygenBar {
  constructor({ playerName }) {
    this.playerName = playerName;
    this.tracker;
  }

  

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("OxygenBar");
    //this.hudElement.setAttribute("data-combatant", this.id);
    //this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = (`
      <p class="Player_name">${this.playerName}</p>
      <img class="Icon" src="/images/icons/lung.png" />
      <svg viewBox="0 0 24 6" class="Oxygen-container">
        <rect x=0 y=0 width="100%" height=2 fill="#00ffff" />
        <rect x=0 y=2 width="100%" height=3 fill="#08daff" />
        <rect x=0 y=5 width="100%" height=1 fill="#00b3ff" />
      </svg>
    `);

    this.fill = this.hudElement.querySelectorAll(".Oxygen-container > rect");

  }

  updateFill(value) {

    //Update oxygen percent fills
    this.tracker = value || 0;
    this.percentage = (1-(Math.floor(this.tracker/4)/5)) * 100;
    alert('Room Tracker: ' + this.tracker + "/ Percentage: " + this.percentage);
    this.fill.forEach(rect => rect.style.width = `${this.percentage}%`);

  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    this.updateFill();
  }

}