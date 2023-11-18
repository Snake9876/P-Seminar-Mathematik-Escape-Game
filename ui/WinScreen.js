class WinScreen {
  constructor() {
    this.isClosed = false;
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
      <img class="Screen_logo" src="/images/ui/win.png" />
    `)
  }

  close() {

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