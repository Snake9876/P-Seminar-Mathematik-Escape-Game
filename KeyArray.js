class KeyArray {

  createElement() {
    this.interfaceElement = document.createElement("div");
    this.interfaceElement.classList.add("KeyArray");
    this.interfaceElement.innerHTML = (`
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
    `);

  }

    /* this.mapElement = document.createElement("div");
    this.mapElement.classList.add("Map");
    this.mapElement.innerHTML = (`
      <div class="key-array">
        <div class="text-container">
          <div id="map-text" class="key-description">Karte</div>
          <div id="inv-text" class="key-description">Inventar</div>
          <div id="notes-text" class="key-description">Notizen</div>
        </div>
      </div>
    `);

    this.invElement = document.createElement("div");
    this.invElement.classList.add("Inventory");
    this.invElement.innerHTML = (`
      <div class="key-array">
        <div class="text-container">
          <div id="map-text" class="key-description">Karte</div>
          <div id="inv-text" class="key-description">Inventar</div>
          <div id="notes-text" class="key-description">Notizen</div>
        </div>
      </div>
    `);

    this.notesElement = document.createElement("div");
    this.notesElement.classList.add("Notes");
    this.notesElement.innerHTML = (`
      <div class="key-array">
        <div class="text-container">
          <div id="map-text" class="key-description">Karte</div>
          <div id="inv-text" class="key-description">Inventar</div>
          <div id="notes-text" class="key-description">Notizen</div>
        </div>
      </div>
    `);

  }

  const overlay = document.getElementById('overlay')

  //Opens and closes modals with appropriate keys
  document.addEventListener('keydown', (event) => {
    const open = document.querySelectorAll('.modal.active');
        
    if (open.length == 0) {
      switch (event.key) {
        case 'i':
          openModal(document.getElementById('inv-modal'));
          break;
        case 'm': 
          openModal(document.getElementById('map-modal'));
          break;
        case 'n': 
          openModal(document.getElementById('note-modal'));
          break;
      }
    })
    
    function openModal(modal) {
        if(modal == null) return
        modal.classList.add('active');
        overlay.classList.add('active');
    }
    
    function closeModal(modal, specialCase) {
        if(modal == null) return
        modal.classList.remove('active');
        if (!specialCase) {
            overlay.classList.remove('active');
        } 
    }
    
    
    //Note-Modal
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
    container.appendChild(this.interfaceElement);
  }

}