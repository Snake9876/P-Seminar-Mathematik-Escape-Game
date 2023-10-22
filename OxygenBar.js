class OxygenBar {
  constructor() {
    
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("OxygenBar");
    //this.hudElement.setAttribute("data-combatant", this.id);
    //this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = (`
      <p class="Player_name">Lorem</p>
      <img class="Icon" src="/images/icons/lung.png" />
      <svg viewBox="0 0 24 6" class="Oxygen-container">
        <rect x=0 y=0 width="100%" height=2 fill="#00ffff" />
        <rect x=0 y=2 width="100%" height=3 fill="#08daff" />
        <rect x=0 y=5 width="100%" height=1 fill="#00b3ff" />
      </svg>
    `);

    //this.hpFills = this.hudElement.querySelectorAll(".Oxygen-container > rect");

  }

  /* update(changes={}) {
    //Update anything incoming
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    //Update active flag to show the correct pizza & hud
    this.hudElement.setAttribute("data-active", this.isActive);
    //this.pizzaElement.setAttribute("data-active", this.isActive);

    //Update oxygen percent fills
    this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`)

  }*/

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
  }

}