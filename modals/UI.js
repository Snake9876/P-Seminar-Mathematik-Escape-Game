class UI {
  constructor({playerName, modalRef, minimapSrc, progress, onComplete}) {
    this.playerName = playerName;
    this.tracker;
    this.modalRef = modalRef || null;
    this.minimapSrc = minimapSrc || null;
    this.progress = progress;
    this.onComplete = onComplete || null;
  }

  createElement() {

    //Button Array
    this.buttonArrayElement = document.createElement('div');
    this.buttonArrayElement.classList.add('buttonArray');
    this.buttonArrayElement.innerHTML = (`
      <div class="buttonContainer">
        <button id="map-btn" class="keyButton">M</button>
        <button id="inv-btn" class="keyButton">I</button>
        <button id="notes-btn" class="keyButton">N</button>
      </div>
      <div class="textContainer">
        <div id="map-text" class="keyDescription">Karte</div>
        <div id="inv-text" class="keyDescription">Inventar</div>
        <div id="notes-text" class="keyDescription">Notizen</div>
      </div>
      <div id="overlay"></div>
    `);

    //Oxygen Bar
    this.oxygenBarElement = document.createElement("div");
    this.oxygenBarElement.classList.add("OxygenBar");
    this.oxygenBarElement.innerHTML = (`
      <p class="Player_name">${this.playerName}</p>
      <img class="Icon" src="/images/icons/lung.png" />
      <svg viewBox="0 0 24 5" class="Oxygen-container">
        <rect x=0 y=0 width="100%" height=1 fill="#00ffff" />
        <rect x=0 y=1 width="100%" height=3 fill="#08daff" />
        <rect x=0 y=4 width="100%" height=1 fill="#00b3ff" />
      </svg>
    `);
    
    this.fill = this.oxygenBarElement.querySelectorAll(".Oxygen-container > rect");

    //Timer



    //UI modals
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');

    this.pauseElement = document.createElement("div");
    this.pauseElement.classList.add("PauseMenu");
    this.pauseElement.classList.add("overlayMenu");
    this.pauseElement.innerHTML = (`
      <h2>Pause Menu</h2>
    `)
    
    //Map
    this.mapElement = document.createElement('div');
    this.mapElement.classList.add('Modal');
    this.mapElement.innerHTML = (`
      <div class="modalHeader">
        <div class="title">
          Map Modal
        </div>
      </div>
      <div class="modalContent">
        <img src=${this.minimapSrc}>
      </div>
    `);
    
    //Inventory
    this.inventoryElement = document.createElement("div");
    this.inventoryElement.classList.add("Modal");
    this.inventoryElement.innerHTML = (`
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

    //Notes
    this.notesElement = document.createElement("div");
    this.notesElement.classList.add("Modal");
    this.notesElement.innerHTML = (`
      <div class="modalHeader">
        <div class="title">
          Notes Modal
        </div>
      </div>
      <div class="modalContent">
        <div id="editableDiv" class="item-row">Lprem Ipsum</div>
      </div>
    `);


  }   
          

  //Updates oxygen bar
  updateFill(value) {
    //Update oxygen percent fills
    this.tracker = value || 0;
    this.percentage = (1-(Math.floor(this.tracker/4)/5)) * 100;
    this.fill.forEach(rect => rect.style.width = `${this.percentage}%`);

  }

  //Modal methods
  close() {
    //Closes modal
    this.element = document.querySelector('.Modal');
    this.esc?.unbind();
    this.element.remove();
    this.overlay.remove();
    this.onComplete();

  }

  //Menu
  getOptions(pageKey) {

    //Case 1: Show the first page of options
    if (pageKey === "root") {
      return [
        {
          label: "Save",
          description: "Save your progress",
          handler: () => {
            this.progress.save();
            this.close();
          }
        },
        {
          label: "Title Screen",
          description: "Go back to the title screen",
          handler: () => {
            //Deactivate old objects
            Object.values(this.map.gameObjects).forEach(obj => {
              obj.isMounted = false;
            })
            /*this.titleScreen = new TitleScreen({
              progress: this.progress
            });

            this.titleScreen.init(document.querySelector('.game-container'));*/
          }
        },
        {
          label: "GitHub",
          description: "Visit our GitHub Page",
          handler: () => {
            window.open('https://github.com/Snake9876/P-Seminar-Mathematik-Escape-Game', '_blank').focus();
          }
        },
        {
          label: "Close",
          description: "Close the pause menu",
          handler: () => {
            this.close();
          }
        }
      ]
    }

  }
 
  //Inventory
  showItems() {
    //Shows items in inventory modal on obtaining the corresponding item flag
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
      
  async init(container) {
    this.createElement();
    container.append(this.buttonArrayElement);
    container.append(this.oxygenBarElement);
    this.updateFill();

    if (this.modalRef === "menu") {
      this.keyboardMenu = new KeyboardMenu({
        descriptionContainer: container
      })
      this.keyboardMenu.init(this.pauseElement);
      this.keyboardMenu.setOptions(this.getOptions("root"));

      container.appendChild(this.overlay)
      container.appendChild(this.pauseElement);

    }

    else if (this.modalRef === "map") {
      container.appendChild(this.overlay)
      container.appendChild(this.mapElement);
      this.showItems();

    }

    else if (this.modalRef === "inventory") {
      container.appendChild(this.overlay)
      container.appendChild(this.inventoryElement);
      this.showItems();

    } 
    
    /*else if (this.modalRef === "notes") {
      const editableDiv = document.getElementById("editableDiv");
        
      // Save the content when the user clicks outside the div
      editableDiv.addEventListener("blur", () => {
          localStorage.setItem("userContent", editableDiv.innerHTML);
      });
      
      // Load the content from localStorage
      const savedContent = localStorage.getItem("userContent");
      if (savedContent) {
          editableDiv.innerHTML = savedContent;
      }

    }*/

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })

  }

}