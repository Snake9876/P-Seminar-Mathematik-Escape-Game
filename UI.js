class UI {

  createElement() {
    this.buttonArrayElement = document.createElement('div');
    this.buttonArrayElement.classList.add('buttonArray');
    this.buttonArrayElement.innerHTML = (`
      <div class="buttonContainer">
        <button  data-modal-target="#map-modal" id="map-btn" class="keyButton">M</button>
        <button  data-modal-target="#inv-modal" id="inv-btn" class="keyButton">I</button>
        <button  data-modal-target="#notes-modal" id="notes-btn" class="keyButton">N</button>
      </div>
      <div class="textContainer">
        <div id="map-text" class="keyDescription">Karte</div>
        <div id="inv-text" class="keyDescription">Inventar</div>
        <div id="notes-text" class="keyDescription">Notizen</div>
      </div>
      <div id="overlay"></div>
    `);
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
        <button data-close-button class="closeBtn">&times;</button>
      </div>
      <div class="modalContent">
        <img src="/images/maps/DemoBattle.png">
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

  openModal(modal) {
    if(modal == null) return
    modal.classList.add('active');
  }

  closeModal(modal) {
    if(modal == null) return
    modal.classList.remove('active');
  }  

  uiEvents() {
    this.openModalButtons = document.querySelectorAll('[data-modal-target]');
    this.closeModalButtons = document.querySelectorAll('[data-close-button]');

    this.openModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const openTarget = document.querySelector(button.dataset.modalTarget);
        this.openModal(openTarget);
        this.overlay.classList.add('active');
      })
    })
  
    this.closeModalButtons.forEach(button => {
      button.addEventListener('click', () => { 
        const closeTarget = button.closest('.Modal');
        this.closeModal(closeTarget);
        this.overlay.classList.remove('active');
      })
    })

    //Opens and closes modals with appropriate keys
    document.addEventListener('keydown', (e) =>   {
      const activeModal = document.querySelectorAll('.Modal.active');
  
      if (open.length == 0) {
        this.overlay.classList.add('active');
        switch (e.key) {
          case 'i':
            this.openModal(document.getElementById('inv-modal'));
            break;
          case 'm': 
            this.openModal(document.getElementById('map-modal'));
            break;
          case 'n': 
            this.openModal(document.getElementById('notes-modal'));
            break;
        } 
      } else {
        if (e.key === 'Escape') 
        this.closeModal(activeModal);
        this.overlay.classList.remove('active');
      }
    })
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


  init(container) {
    this.createElement();
    container.appendChild(this.buttonArrayElement);
    container.appendChild(this.overlay)
    container.appendChild(this.minimapElement);
  }

}