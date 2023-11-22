class GameOverScreen {
  constructor() {
    this.isClosed = false;
    this.audio = new Audio("/sounds/game-over.mp3");
  }

  getOptions(resolve) {
    return [
      { 
        label: "Titelbildschirm",
        description: "Zurück zum Titelbildschirm",
        handler: () => {
          resolve();
          location.reload();
        }
      }
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Screen");
    this.element.innerHTML = (`
      <img class="Screen_logo" src="/images/ui/screens/gameover.png" />
    `)
  }

  close() {

    //Close the menu
    this.isClosed = true;
    this.audio.pause();
    this.keyboardMenu.end();
    this.element.remove();
  }
  
  init(container) {
    return new Promise(resolve => {
      this.createElement();
      this.audio.play();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    })
  }

}