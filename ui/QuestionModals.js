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
      this.questionElement.setAttribute('style', 'padding-bottom: 0px;');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Sauerstoffverlust
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent" style="padding: 5px 15px 0px 15px;">
          <center>
            <img id="O2-img" src="/images/questions/q1.png" style="width: 150px">
          </center>
          <div>
            <input id="input" class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          </div>
          <div>
            <button class="checkButton">Check</button>
          </div>
        </div>
      `);

    }
    
    //Question 2.1
    else if (this.modalRef === "q21") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q21-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Verschütteter Techniker
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <center>
            <img id="q1-img" src="/images/questions/q21.png" style="width: 150px">
          </center>
          <button class="checkButton">Entfernen</button>
        </div>
      `);

    }

    //Question 2.2
    else if (this.modalRef === "q22") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q22-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Verschütteter Techniker
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <center>
            <img id="q2-img" src="/images/questions/q22.png"style="width: 150px">
          </center>
          <button class="checkButton">Entfernen</button>
        </div>
      `);

    }

    //Question 3
    else if (this.modalRef === "q3") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q3-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader" style="font-size: 0.5em;">
          <div class="Title">
            Konzentration
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <center>
            <img id="q3-img" src="/images/questions/q3.png" style="width: 150px">
          </center>
          <div>
            <input id="input" class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          </div>
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Question 4
    else if (this.modalRef === "q4") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q4-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Störsignal
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <center>
            <img id="q4-img" src="/images/questions/q4.png" style="width: 150px">
          </center>
          <button class="openButton" onclick="window.open('https://www.geogebra.org/m/aejrg5vw', '_blank').focus();">Panel öffnen</button>
          <div> 
            <input id="input" class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          </div>
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Question 5
    else if (this.modalRef === "q5") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q5-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Zahlenschloss
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
            <div class="inputBar"></div>
            <div class="keypad">
              <button class="KeypadButton">1</button>
              <button class="KeypadButton">2</button>
              <button class="KeypadButton">3</button>
              <button class="KeypadButton">4</button>
              <button class="KeypadButton">5</button>
              <button class="KeypadButton">6</button>
              <button class="KeypadButton">7</button>
              <button class="KeypadButton">8</button>
              <button class="KeypadButton">9</button>
              <div class="CenteredRow">
                <button class="KeypadButton">0</button>
              </div>
            </div>
            <button class="checkButton">Check</button>
          </div>
        </div>
      `); 

    }

    //Sticky-Note
    else if (this.modalRef === "sticky-note") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'sticky-note-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Notiz-Zettel
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <center>
            <img id="q5-img" src="/images/questions/q5.png" style="width: 150px">
          </center>
        </div>
      `); 

    }

    //Question 6
    else if (this.modalRef === "q6") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q6-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Motorleistung
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <center>
            <img id="q6-img" src="/images/questions/q6.png" style="width: 150px">
          </center>
          <div>
            <input id="input" class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          </div>
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Question 7
    else if (this.modalRef === "q7") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'q7-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Kursberechnung
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <center>
            <img id="q7-img" src="/images/questions/q7.png" style="width: 150px">
          </center>
          <button id="map-button" class="openButton">Karte öffnen</button>
          <div>
            <input id="input" class="inputBar" type="text" placeholder="Antwort" id="answer-field1" maxlength="20">
          </div>
          <button class="checkButton">Check</button>
        </div>
      `);

    }

    //Map
    else if (this.modalRef === "qMap") {
      this.questionElement = document.createElement("div");
      this.questionElement.classList.add('Modal');
      this.questionElement.setAttribute('id', 'qMap-modal');
      this.questionElement.innerHTML = (`
        <div class="ModalHeader">
          <div class="Title">
            Kursberechnung
          </div>
          <button class="CloseButton">&times;</button>
        </div>
        <div class="ModalContent">
          <center>
            <img id="q7-task-img" src="/images/questions/q7-task.png" style="width: 150px; image-rendering: pixalated;">
          </center>
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
    this.checkButton.innerHTML = ('Richtig!');
    this.checkButton.setAttribute('disabled', 'disabled');
    this.inputBar.remove();

  }

  onComplete() {
    this.coreOnComplete();
  }

  appendToDisplay(digit) {
    var displayBar = document.querySelector(".inputBar");

    if (displayBar.innerText.length < 4) {
      displayBar.innerText += digit;
    }
  }

  
  async init(container) {
    this.createElement();
    container.appendChild(this.overlay)
    container.appendChild(this.questionElement);

    this.keyPadButtons = document.querySelectorAll('.KeypadButton');
    this.keyPadButtons.forEach((element) => {
      element.addEventListener('click', () => {
        this.appendToDisplay(element.innerText)
      });
    });

    this.checkButton = document.querySelector('.checkButton') || null;
    this.inputBar = document.querySelector('.inputBar') || null;

    if(this.checkButton !== null) {
      this.checkButton.addEventListener('click', () => {
          
        switch(this.modalRef) {
          case 'q1':
            this.solution = "30";
            this.answer = document.querySelector('.inputBar').value;

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                
                setTimeout(() => {
                  this.map.startCutscene([
                    //Custom event 1
                    { type: "effect", sound: "sounds/chat.wav"},
                    { type: "toggleOxygenBar" },
                    { type: "textMessage", name: "Füllstation", text: "Sauerstoff aufgefüllt." },
                    { type: "removeStoryFlag", flag: "Q1_IN_PROGRESS" },
                    { type: "addStoryFlag", flag: "O2_ENABLED" },
                    { type: "addStoryFlag", flag: "Q1_COMPLETED" },
                    { type: "textMessage", name: this.progress.playerName, text: "Also muss ich hier alle 30 Raumwechsel meine Vorräte wiederauffüllen!" },
                    { type: "effect", sound: "sounds/alarm.wav"},
                    { type: "textMessage", name: "Bordcomputer", text: "STEUERTRIEBWERK AUSGEFALLEN. WARTUNG BENÖTIGT." },
                    { type: "textMessage", name: this.progress.playerName, text: "Auch das noch!" },
                    { type: "textMessage", name: this.progress.playerName, text: "Dann eben zum Maschinenraum!" },
                  ])
                }, 250);
              }
            } else {
              this.checkButton.innerHTML = ('Falsch!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q21':
              this.checkButton.innerHTML = ('Falsch!');
              this.checkButton.setAttribute('disabled', 'disabled');

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                
                setTimeout(() => {
                  this.map.startCutscene([
                    //Custom event 2.1
                    {
                      type: "updateObject",
                      update: {
                        id: "Schutthaufen",
                        hide: true,
                      }
                    },
                    { type: "updateTimer", value: -120 },
                    { type: "textMessage", name: "playerName", text: "Oh nein, das war der falsche Berg!" },
                    { type: "removeStoryFlag", flag: "REMOVABLE" },
                  ])
                }, 250);
              }

            break;
          case 'q22':
            this.checkButton.innerHTML = ('Richtig!');
            this.checkButton.setAttribute('disabled', 'disabled');

            //Overwrite onComplete callback
            this.onComplete = () => {
              this.coreOnComplete();
              
              setTimeout(() => {
                this.map.startCutscene([
                  { type: "removeStoryFlag", flag: "REMOVABLE" },
                  {
                    type: "updateObject",
                    update: {
                      id: "Yuri",
                      spriteSrc: "images/gameObjects/people/yuriEngineer.png",
                    }
                  }, 
                ])
              }, 250);
            }

            break;
          case 'q3':
            this.solution = "40";
            this.answer = document.querySelector('.inputBar').value;

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();

                setTimeout(() => {
                  this.map.startCutscene([
                    //Custom event 3
                    { type: "textMessage", name: "Bella", text: "40 Minuten also..." },
                    { type: "textMessage", name: "Bella", text: "Das Medikament wird ihn fürs Erste stabilisieren." },
                    { type: "textMessage", name: "playerName", text: "Kann ich denn schon mit ihm sprechen?" },
                    { type: "textMessage", name: "Bella", text: "Noch ist er leider bewusstlos..." },
                    { type: "textMessage", name: "Bella", text: "Setze doch in der Zwischenzeit einen Notruf ab!" },
                    { type: "textMessage", name: "Bella", text: "Vielleicht wacht er in der Zwischenzeit auf." },
                    { type: "textMessage", name: "playerName", text: "Gute Idee! Ich beeile mich!" },
                    { type: "removeStoryFlag", flag: "Q3_IN_PROGRESS" },
                    { type: "addStoryFlag", flag: "Q3_COMPLETED" },
                    { type: "addStoryFlag", flag: "Q4_INTRO" },
                  ])
                }, 250);
              }
            } else {
              this.checkButton.innerHTML = ('Falsch!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q4':
            this.solution = "-sin(5,03*t-1.57)";
            this.answer = document.querySelector('.inputBar').value;

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                
                setTimeout(() => {
                  this.map.startCutscene([
                    //Custom event 4
                    { type: "addStoryFlag", flag: "Q4_COMPLETED" },
                    { type: "removeStoryFlag", flag: "Q4_IN_PROGRESS" },
                    { type: "textMessage", name: "playerName", text: "Na also, es scheint zu funktionieren!" },
                    { 
                      type: "stand",
                      who: "hero",
                      direction: "up",
                      time: 1000
                    },
                    { type: "textMessage", name: "playerName", text: "So, damit wäre der Notruf abgesetzt!" },
                    { type: "textMessage", name: "playerName", text: "Mal sehen, ob Yuri schon wach ist." },
                  ])
                }, 250);
              }
            } else {
              this.checkButton.innerHTML = ('Falsch!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q5':
            this.solution = "5328";
            this.answer = document.querySelector('.inputBar').innerText;

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete();
                
                setTimeout(() => {
                  this.map.startCutscene([
                    //Custom event 5
                    {
                      type: "updateObject",
                      update: {
                        id: "CargoDoor",
                        hide: true,
                      }
                    }
                  ])
                }, 250);
              }
            } else {
              this.checkButton.innerHTML = ('Falsch!');
              document.querySelector(".inputBar").innerText = "";
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
          case 'q6':  
            this.solution = "4,8";
            this.answer = document.querySelector('.inputBar').value;

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete;
                
                setTimeout(() => {
                  this.map.startCutscene([
                    //Custom event 6
                    { type: "effect", visual: "rumble", toggle: "true" },
                    { type: "effect", sound: "sounds/alarm.wav"},
                    { type: "textMessage", name:"Bordcomputer", text: "SYSTEMWARNUNG!! EINTRITT IN ASTEROIDENGÜRTEL."},
                    { type: "textMessage", name:"Bordcomputer", text: "BERECHNUNG EINES NEUEN KURSES ERFORDERLICH."},
                    { type: "textMessage", name: this.progress.playerName, text: "Jetzt muss es schnell gehen!"},
                    { type: "textMessage", name: this.progress.playerName, text: "Zurück zur Steuereinheit!"},
                    { type: "removeStoryFlag", flag: "Q6_IN_PROGRESS" },
                    { type: "addStoryFlag", flag: "Q6_COMPLETED" }
                  ])
                }, 250);
              }
            }

            break;
          case 'q7':
            this.solution = "-2,2,1,0";
            this.answer = document.querySelector('.inputBar').value;

            //Check if Question was correct
            if(this.checkAnswer(this.answer, this.solution)) {
              this.disableQuestion();

              //Overwrite onComplete callback
              this.onComplete = () => {
                this.coreOnComplete;

                const container = document.querySelector('.game-container');
                const sceneTransition = new ScreenEffects();
                
                setTimeout(() => {
                  this.map.startCutscene([
                    { type: "effect", visual: "rumble", toggle: "true" },
                  ]);

                  sceneTransition.init(container, () => {
            
                    this.map.isPaused = true;
                    this.winScreen = new WinScreen();
                    this.winScreen.init(container);
                
                    sceneTransition.fadeOut();
            
                  })

                }, 50);
              }
            } else {
              this.checkButton.innerHTML = ('Falsch!');
      
              setTimeout(() => {
                this.checkButton.innerHTML = ('Check');
              }, 2000);
            }

            break;
        }
      })
    }

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    })

    this.openMap = document.getElementById('map-button') || null;

    if(this.openMap !== null) {
      this.openMap.addEventListener('click', () => {
        this.close();

        setTimeout(() => {
          this.map.startCutscene([

            { type: "openModal", fileRef: "QuestionModal", modalRef: "qMap" }
          ])
        }, 1);
      });
    }

    this.closeButton = document.querySelector('.CloseButton');
    this.closeButton.addEventListener('click', () => {
      this.close();
    })
  
  }

}