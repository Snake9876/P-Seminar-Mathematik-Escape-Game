class TitleScreen {
  constructor({ progress }) {
    this.playerName;
    this.progress = progress;
    this.isClosed = false;
  }

  getOptions(resolve) {
    const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "Neues Spiel",
        description: "Starte ein neues Spiel",
        handler: () => {
          this.close();
          resolve();
        }
      },
      safeFile ? {
        label: "Spiel fortsetzen",
        description: "Vom letzten Speicherpunkt fortsetzen",
        handler: () => {
          this.close();
          resolve(safeFile);
        }
      } : null
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Screen");
    this.element.innerHTML = (`
      <img class="Screen_logo" src="images/ui/screens/logo.png"/>
      <div class="username-container">
        <input type="text" style="
        position: absolute; left: 100px;
        bottom: 60px;" class="inputBar" placeholder="Name">
      </div>
    `)
  }

  close() {
    //Save the player name
    this.playerName = document.querySelector('.inputBar').value || "Mathe-Held";

    //Close the menu
    this.isClosed = true;
    this.keyboardMenu.end();
    this.element.remove();
  }
  
  init(container) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    })
  }

}