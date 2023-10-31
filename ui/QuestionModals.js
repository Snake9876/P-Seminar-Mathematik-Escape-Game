class QuestionModals {
  constructor({modalRef, minimapSrc, progress, onComplete}) {
    this.modalRef = modalRef || null;
    this.minimapSrc = minimapSrc || null;
    this.progress = progress;
    this.onComplete = onComplete;
  }

  createElement() {

    //UI modals
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');


    //Question 1
    if (this.modalRef === "q1") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q1-modal')
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Störsignal
          </div>
        </div>
        <div class="ModalContent">
          <img id="O2-img" src="/images/questions/Sauerstoffflasche.jpg">
          <h4>Stelle das zweite Signal so ein, dass es mit der Sinusfunkton destruktiv interferiert und gib die Funktion unten an.</h4>
          <p>G<sub>f</sub>= 2*sin(3/4*(x-1))</p>
          <script type="text/javascript" src="https://cdn.geogebra.org/apps/deployggb.js"></script>
          <script type="text/javascript">
            var ggbApplet = new GGBApplet({
                "width": 600,
                "height": 400,
                "material_id": "YOUR_MATERIAL_ID",
                // Replace "YOUR_MATERIAL_ID" with the actual material ID of your GeoGebra graph.
                "appletOnLoad": function(api) {
                    api.inject('applet_container');
                }
            });
            ggbApplet.inject();
          </script>
          <input class="input-long" type="text" id="answer-field1" maxlength="20" oninput="limitInput(this)">
          <button class="button_a" id="check-a1" onclick="checkAnswer(1, '-2*sin(3/4*(x-1))')">Check</button>
        </div>
      `)
    }

    
    

    //Question 2
    else if (this.modalRef === "q2") {
      /*this.mapElement = document.createElement('div');
      this.mapElement.classList.add('Modal');
      this.mapElement.setAttribute('id', 'map-modal')
      this.mapElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Map Modal
          </div>
        </div>
        <div class="ModalContent">
          <img src=${this.minimapSrc}>
        </div>
      `);*/
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

      
  async init(container) {
    this.createElement();
    container.appendChild(this.overlay)
    container.appendChild(this.questionElement);

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })

  }

}