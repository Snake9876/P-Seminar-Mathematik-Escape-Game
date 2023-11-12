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
        label: "New Game",
        description: "Start a new space adventure!",
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
      <img class="TitleScreen_logo" src="/images/ui/logo.png" alt="Pizza Legends" />
      <div class="username-container">
        <input type="text" class="inputBar" placeholder="Name">
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