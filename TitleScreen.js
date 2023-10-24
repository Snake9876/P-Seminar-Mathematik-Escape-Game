class TitleScreen {
  constructor({ progress }) {
    this.playerName = null;
    this.progress = progress;
  }

  getOptions(resolve) {
    const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "New Game",
        description: "Start a new pizza adventure!",
        handler: () => {
          this.close();
          resolve();
        }
      },
      safeFile ? {
        label: "Continue Game",
        description: "Resume your adventure",
        handler: () => {
          this.close();
          resolve(safeFile);
        }
      } : null
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = (`
      <img class="TitleScreen_logo" src="/images/logo.png" alt="Pizza Legends" />
      <div class="username-container">
        <input type="text" id="username-input" placeholder="Name">
      </div>
    `)
  }

  close() {
    //Save the player name
    this.playerName = document.getElementById('username-input').value || "Mathe-Held";

    //Close the menu
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