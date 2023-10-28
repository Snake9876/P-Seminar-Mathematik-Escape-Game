class uiModals {
  constructor({minimapSrc, progress, onComplete}) {
    this.minimapSrc = minimapSrc || null;
    this.progress = progress;
    this.onComplete = onComplete;
  }

  createElement() {
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');

    /*this.inventoryElement = document.createElement("div");
    this.inventoryElement.classList.add("Modal");
    this.inventoryElement.innerHTML = (`
      <div class="button-container">
        <button id="map-btn" class="key-button">M</button>
        <button id="inv-btn" class="key-button">I</button>
        <button id="notes-btn" class="key-button">N</button>
      </div>
      <div class="text-container">
        <div id="map-text" class="key-description">Karte</div>
        <div id="inv-text" class="key-description">Inventar</div>
        <div id="notes-text" class="key-description">Notizen</div>
      </div>
    `);*/

    this.minimapElement = document.createElement('div');
    this.minimapElement.classList.add('Modal');
    this.minimapElement.setAttribute('id', 'map-modal');
    this.minimapElement.innerHTML = (`
      <div class="modalHeader">
        <div class="title">
            Map Modal
        </div>
      </div>
      <div class="modalContent">
        <img src=${this.minimapSrc}>
      </div>
    `);

    /*this.notesElement = document.createElement("div");
    this.notesElement.classList.add("Modal");
    this.notesElement.innerHTML = (`
      <div class="button-container">
        <button id="map-btn" class="key-button">M</button>
        <button id="inv-btn" class="key-button">I</button>
        <button id="notes-btn" class="key-button">N</button>
      </div>
      <div class="text-container">
        <div id="map-text" class="key-description">Karte</div>
        <div id="inv-text" class="key-description">Inventar</div>
        <div id="notes-text" class="key-description">Notizen</div>
      </div>
    `);*/

  }   
        
       /*Note-Modal
        
        const editableDiv = document.getElementById("editableDiv");
        
        // Save the content when the user clicks outside the div
        editableDiv.addEventListener("blur", () => {
            localStorage.setItem("userContent", editableDiv.innerHTML);
        });
        
        // Load the content from localStorage
        const savedContent = localStorage.getItem("userContent");
        if (savedContent) {
            editableDiv.innerHTML = savedContent;
        }*/
      
  close() {
    this.esc?.unbind();
    this.minimapElement.remove();
    this.overlay.remove();
    this.onComplete();
  }
      
  async init(container) {
    this.createElement();
    container.appendChild(this.overlay)
    container.appendChild(this.minimapElement);
      
    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })
  }

}