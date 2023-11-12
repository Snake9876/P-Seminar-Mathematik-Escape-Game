class QuestionModals {
  constructor({map, modalRef, minimapSrc, progress, onComplete}) {
    this.map = map;
    this.modalRef = modalRef || null;
    this.minimapSrc = minimapSrc || null;
    this.progress = progress;
    this.coreOnComplete = onComplete;
    this.answer = null;
    this.solution = null;
  }

  createElement() {

    //UI modals
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');


    //Question 1
    if (this.modalRef === "q1") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q1-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Sauerstoffvorrat
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <img id="O2-img" src="/images/questions/Sauerstoffflasche.jpg">
          <p>Lorem</p>
          <input class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    /* <script type="text/javascript" src="https://cdn.geogebra.org/apps/deployggb.js"></script>
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
          </script> */



    
    //Question 2
    else if (this.modalRef === "q2") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q1-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Sauerstoffvorrat
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <img id="O2-img" src="/images/questions/Sauerstoffflasche.jpg">
          <p>Lorem</p>
          <input class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Question 3
    else if (this.modalRef === "q3") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q1-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Sauerstoffvorrat
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <img id="O2-img" src="/images/questions/Sauerstoffflasche.jpg">
          <p>Lorem</p>
          <input class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Question 4
    else if (this.modalRef === "q4") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q1-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Sauerstoffvorrat
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <img id="O2-img" src="/images/questions/Sauerstoffflasche.jpg">
          <p>Lorem</p>
          <input class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Question 5
    else if (this.modalRef === "q5") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q1-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Sauerstoffvorrat
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <img id="O2-img" src="/images/questions/Sauerstoffflasche.jpg">
          <p>Lorem</p>
          <input class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Question 6
    else if (this.modalRef === "q6") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q1-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Sauerstoffvorrat
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <img id="O2-img" src="/images/questions/Sauerstoffflasche.jpg">
          <p>Lorem</p>
          <input class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Question 7
    else if (this.modalRef === "q7") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q1-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Sauerstoffvorrat
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <img id="O2-img" src="/images/questions/Sauerstoffflasche.jpg">
          <p>Lorem</p>
          <input class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          <button class="checkButton">Check</button>
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

  checkAnswer(ans, sol) {
    let isAnswerCorrect = false;

    if(ans === sol) {
      isAnswerCorrect = true;
    } 

    return isAnswerCorrect

  }

  disableQuestion() {
    //Disables question
    this.checkButton.innerHTML = ('Correct!');
    this.checkButton.setAttribute('disabled', 'disabled');
    this.inputBar.remove();

  }

  onComplete() {
    this.coreOnComplete();
  }

      
  async init(container) {
    this.createElement();
    container.appendChild(this.overlay)
    container.appendChild(this.questionElement);


    this.checkButton = document.querySelector('.checkButton');
    this.inputBar = document.querySelector('.inputBar');
    this.checkButton.addEventListener('click', () => {
      
      this.answer = document.querySelector('.inputBar').value;

      //Check if there is an input
      if(this.answer) { 
        //Save old onComplete callback
        
        switch(this.modalRef) {
          case 'q1':
            this.solution = "20";

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                
                setTimeout(() => {
                  this.map.startCutscene([
                    { type: "effect", sound: "sounds/chat.wav"},
                    { type: "toggleOxygenBar" },
                    { type: "textMessage", name: "Füllstation", text: "Sauerstoff aufgefüllt." },
                    {
                    type: "stand",
                    who: "hero",
                    direction: "up",
                    time: 500,
                    },
                    { type: "textMessage", name: this.progress.playerName, text: "Also muss ich hier alle 20 Raumwechsel meine Vorräte wiederauffüllen!" },
                    {
                    type: "stand",
                    who: "hero",
                    direction: "up",
                    time: 1000,
                    },
                    { type: "effect", sound: "sounds/alarm.wav"},
                    { type: "textMessage", name: "Bordcomputer", text: "STEUERTRIEBWERK AUSGEFALLEN. WARTUNG BENÖTIGT." },
                    {
                    type: "stand",
                    who: "hero",
                    direction: "up",
                    time: 500,
                    },
                    { type: "textMessage", name: this.progress.playerName, text: "Auch das noch!" },
                    { type: "textMessage", name: this.progress.playerName, text: "Dann eben zum Maschinenraum!" },
                  ])
                }, 250);
              }
            } else {
              this.checkButton.innerHTML = ('Incorrect!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q2':
            this.solution = "20";

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                //Custom event 2
              }
            } else {
              this.checkButton.innerHTML = ('Incorrect!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q3':
            this.solution = "20";

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                //Custom event 3
              }
            } else {
              this.checkButton.innerHTML = ('Incorrect!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q4':
            this.solution = "20";

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                //Custom event 4
              }
            } else {
              this.checkButton.innerHTML = ('Incorrect!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q5':
            this.solution = "20";

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                //Custom event 5
              }
            } else {
              this.checkButton.innerHTML = ('Incorrect!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q6':  
            this.solution = "20";

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete;
                //Custom event 6
              }
            }

            break;
          case 'q7':
            this.solution = "20";

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete;
                //Custom event 7
              }
            } else {
              this.checkButton.innerHTML = ('Incorrect!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
        }
      } 

    })
    

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })
    this.closeButton = document.querySelector('.CloseButton');
    this.closeButton.addEventListener('click', () => {
      this.close();
    })

  }

}