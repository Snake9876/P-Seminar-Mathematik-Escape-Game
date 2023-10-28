class uiModals {
  constructor({modalRef, minimapSrc, progress, onComplete}) {
    this.modalRef = modalRef;
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

    if (this.modalRef === "map") {
    this.element = document.createElement('div');
    this.element.classList.add('Modal');
    this.element.innerHTML = (`
      <div class="modalHeader">
        <div class="title">
          Map Modal
        </div>
      </div>
      <div class="modalContent">
        <img src=${this.minimapSrc}>
      </div>
    `);
    } else if (this.modalRef === "inventory") {
      this.element = document.createElement("div");
      this.element.classList.add("Modal");
      this.element.innerHTML = (`
        <div class="modalHeader">
          <div class="title">
            Inventory Modal
          </div>
        </div>
        <div id="inv-background" class="modalContent">
          <div class="item-row">
            <div id="item-1" class="item-container"></div>
            <div id="item-2" class="item-container"></div>
            <div id="item-3" class="item-container"></div>
          </div>
          <div class="item-row">
            <div id="item-4" class="item-container"></div>
            <div id="item-5" class="item-container"></div>
            <div id="item-6" class="item-container"></div>
          </div>
        </div>
      `);
    }

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
      
  showItems() {
    let itemList = {
      "GOT_ITEM_1": document.getElementById('item-1'),
      "GOT_ITEM_2": document.getElementById('item-2'),
      "GOT_ITEM_3": document.getElementById('item-3'),
      "GOT_ITEM_4": document.getElementById('item-4'),
      "GOT_ITEM_5": document.getElementById('item-5'),
      "GOT_ITEM_6": document.getElementById('item-6')
    }

    Object.keys(itemList).forEach(itemKey => {
      if (this.progress.storyFlags[itemKey]) {
        itemList[itemKey].style.opacity = 1;
      }
    });
  }

  close() {
    this.esc?.unbind();
    this.element.remove();
    this.overlay.remove();
    this.onComplete();
  }
      
  async init(container) {
    this.createElement();
    container.appendChild(this.overlay)
    container.appendChild(this.element);
    if(this.modalRef === "inventory") {
      this.showItems();
    }

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })
  }

}