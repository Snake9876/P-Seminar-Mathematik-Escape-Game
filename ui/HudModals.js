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
        <h2>Menu</h2>
      `)
    }
    
    //Map
    else if (this.modalRef === "map") {
      this.mapRef = this.map.mapId;
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
        <div class="ModalContent" id="minimap" style="background-image: url(${this.minimapSrc});">
          <div class="hoverContainer">
            <div class="hoverElement" id="Brücke"></div>
            <div class="hoverElement" id="Cafeteria"></div>
            <div class="hoverElement" id="O2"></div>
            <div class="hoverElement" id="Quartiere"></div>
            <div class="hoverElement" id="Krankenstation"></div>
            <div class="hoverElement" id="Hangar"></div>
            <div class="hoverElement" id="Nachrichtenzentrale"></div>
            <div class="hoverElement" id="Maschinenraum"></div>
            <div class="hoverElement" id="Lobby"></div>
            <div class="hoverElement" id="Westflügel"></div>
            <div class="hoverElement" id="Ecke"></div>
            <div class="hoverElement" id="Ostflügel"></div>
            <div class="hoverElement" id="Korridor"></div>
          </div>
          <p class="mapDesc">${this.mapRef}</p>
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
          label: "Speichern",
          description: "Speicherpunkt setzen",
          handler: () => {
            this.progress.save();
            this.close();
          }
        },
        {
          label: "GitHub",
          description: "GitHub Repository",
          handler: () => {
            window.open('https://github.com/Snake9876/P-Seminar-Mathematik-Escape-Game', '_blank').focus();
          }
        },
        {
          label: "Schließen",
          description: "Menu schließen",
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
      "GOT_METERSTICK": document.getElementById('item-1'),
      "GOT_TEXTBOOK": document.getElementById('item-2'),
      "GOT_CROWBAR": document.getElementById('item-3'),
      "GOT_KEYCARD": document.getElementById('item-4'),
      "GOT_ITEM_5": document.getElementById('item-5'),
      "GOT_ITEM_6": document.getElementById('item-6')
    }

    Object.keys(itemList).forEach(itemKey => {
      if (this.progress.storyFlags[itemKey]) {
        itemList[itemKey].style.opacity = 1;
      }
    });

  }

  //Notes
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

      this.hoverElement = document.querySelectorAll('.hoverElement');
      this.mapDesc = document.querySelector('.mapDesc');
      this.hoverElement.forEach(element => {
        element.onmouseover = () => {
          this.mapDesc.innerHTML = element.id;
        }

        element.onmouseout = () => {
          this.mapDesc.innerHTML = (this.map.mapId);
        }
      })
    
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