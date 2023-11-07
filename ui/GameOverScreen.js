class GameOverScreen {
  constructor({ progress }) {
    this.progress = progress;
  }

  getOptions(resolve) {
    const safeFile = this.progress.getSaveFile();
    return [
      { 
        label: "Title Screen",
        description: "Return To Title Screen",
        handler: () => {
          location.reload();
        }
      }
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("GameOverScreen");
    this.element.innerHTML = (`
      <img class="GameOverScreen_logo" src="/images/ui/logo.png" alt="Pizza Legends" />
    `)
  }

  close() {
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