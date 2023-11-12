class HudModals {
  constructor({map, modalRef, minimapSrc, progress, onComplete}) {
    this.map = map;
    this.modalRef = modalRef;
    this.minimapSrc = minimapSrc || null;
    this.progress = progress;
    this.onComplete = onComplete;
  }

  createElement() {

    //UI modals
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');


    if (this.modalRef === "menu") {
      this.menuElement = document.createElement("div");
      this.menuElement.classList.add('Modal');
      this.menuElement.setAttribute('id', 'menu-modal')
      this.menuElement.innerHTML = (`
        <h2>Pause Menu</h2>
      `)
    }
    
    //Map
    else if (this.modalRef === "map") {
      this.mapElement = document.createElement('div');
      this.mapElement.classList.add('Modal');
      this.mapElement.setAttribute('id', 'map-modal')
      this.mapElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Map Modal
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <img src=${this.minimapSrc}>
        </div>
      `);
    }
    
    //Inventory
    else if (this.modalRef === "inventory") {
      this.inventoryElement = document.createElement("div");
      this.inventoryElement.classList.add('Modal');
      this.inventoryElement.setAttribute('id', 'inv-modal')
      this.inventoryElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Inventory Modal
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div id="inv-background" class="ModalContent">
          <div class="ItemRow">
            <div id="item-1" class="ItemContainer"></div>
            <div id="item-2" class="ItemContainer"></div>
            <div id="item-3" class="ItemContainer"></div>
          </div>
          <div class="ItemRow">
            <div id="item-4" class="ItemContainer"></div>
            <div id="item-5" class="ItemContainer"></div>
            <div id="item-6" class="ItemContainer"></div>
          </div>
        </div>
      `);
    }

    //Notes
    else if (this.modalRef === "notes") {
      this.notesElement = document.createElement("div");
      this.notesElement.classList.add("Modal");
      this.notesElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Notes Modal
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <div id="editable-div" contenteditable="true"></div>
        </div>
      `);
    }

  }   

  //Modal methods
  close() {
    //Closes modal
    this.element = document.querySelector('.Modal');
    this.esc?.unbind();
    if (this.keyboardMenu) {
      this.keyboardMenu.end();
    }
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

  editDiv() {
    const editableDiv = document.getElementById("editable-div");
        
    // Save the content when the user clicks outside the div
    editableDiv.addEventListener("blur", () => {
        localStorage.setItem("userContent", editableDiv.innerHTML);
    });
    
    // Load the content from localStorage
    const savedContent = localStorage.getItem("userContent");
    if (savedContent) {
        editableDiv.innerHTML = savedContent;
    }
  }
      
  async init(container) {
    this.createElement();

    if (this.modalRef === "menu") {
      this.keyboardMenu = new KeyboardMenu({
        descriptionContainer: container
      })
      this.keyboardMenu.init(this.menuElement);
      this.keyboardMenu.setOptions(this.getOptions("root"));

      container.appendChild(this.overlay)
      container.appendChild(this.menuElement);

    }

    else if (this.modalRef === "map") {
      container.appendChild(this.overlay)
      container.appendChild(this.mapElement);

      this.closeButton = document.querySelector('.CloseButton');
      this.closeButton.addEventListener('click', () => {
        this.close();
      })

    }

    else if (this.modalRef === "inventory") {
      container.appendChild(this.overlay)
      container.appendChild(this.inventoryElement);
      this.showItems();

      this.closeButton = document.querySelector('.CloseButton');
      this.closeButton.addEventListener('click', () => {
        this.close();
      })

    } 

    else if (this.modalRef === "notes") {
      container.appendChild(this.overlay)
      container.appendChild(this.notesElement);
      this.editDiv();

      this.closeButton = document.querySelector('.CloseButton');
      this.closeButton.addEventListener('click', () => {
        this.close();
      })
      
    } 

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })
  }

}