class OxygenBar {
  constructor(config) {
    this.hp = typeof(this.hp) === "undefined" ? this.maxHp : this.hp;
  }

  get hpPercent() {
    const percent = this.hp / this.maxHp * 100;
    return percent > 0 ? percent : 0;
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("OxygenBar");
    this.hudElement.setAttribute("data-combatant", this.id);
    this.hudElement.innerHTML = (`
      <p class="Player_name">${this.name}</p>
      <div class="OxygenBar_crop">
        <img class="Lung_icon" src="/images/icons/lung.png" />
      </div>
      <svg viewBox="0 0 26 3" class="Oxygen-container">
        <rect x=0 y=0 width="0%" height=2 fill="#00ffff" />
        <rect x=0 y=2 width="0%" height=3 fill="#08daff" />
        <rect x=0 y=5 width="0%" height=1 fill="#00b3ff" />
      </svg>
    `);

    this.hpFills = this.hudElement.querySelectorAll(".Oxygen-container > rect");
  }

  update(changes={}) {
    //Update anything incoming
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    //Update oxygen percent fills
    this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`)

  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    this.update();
  }

}