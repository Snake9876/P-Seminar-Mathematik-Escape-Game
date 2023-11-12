class Overworld {
 constructor(config) {
   this.element = config.element;
   this.canvas = this.element.querySelector(".game-canvas");
   this.ctx = this.canvas.getContext("2d");
   this.map = null;
 }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      //Update all objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      //Draw Game Objects
      Object.values(this.map.gameObjects).sort((a,b) => {
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      })

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);
      
      if (!this.map.isPaused) {
        requestAnimationFrame(() => {
          step();   
        })
      }

    }
    step();

 }

 timerLoop() {
  if (this.progress.isTimerEnabled && this.progress.timerValue >= 0) {
    this.progress.timerValue--;
    this.hud.updateTimer(this.progress.timerValue);
  } 

  if (this.progress.timerValue < 0) {
    const container = document.querySelector('.game-container');

    this.map.isPaused = true;
    this.gameOverScreen = new GameOverScreen({
      progress: this.map.overworld.progress
    })
    this.gameOverScreen.init(container);

    return
  }

  // Schedule the next call to timerLoop after a delay of 1000 milliseconds (1 second)
  setTimeout(() => this.timerLoop(), 1000);
}

 bindActionInput() {
  new KeyPressListener("Enter", () => {
    //Is there a person here to talk to?
    this.map.checkForActionCutscene()
  })
  new KeyPressListener("Escape", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "HudModal",
          modalRef: "menu"
        }
      ])
    }
  })
  new KeyPressListener("m", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "HudModal",
          modalRef: "map"
        }
      ])
    }
  })
  new KeyPressListener("i", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "HudModal",
          modalRef: "inventory"
        }
      ])
    }
  })
  new KeyPressListener("n", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "HudModal",
          modalRef: "notes"
        }
      ])
    }
  })
  new KeyPressListener("1", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "QuestionModal",
          modalRef: "q1"
        }
      ])
    }
  })
  new KeyPressListener("2", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "QuestionModal",
          modalRef: "q2"
        }
      ])
    }
  })
  new KeyPressListener("3", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "QuestionModal",
          modalRef: "q3"
        }
      ])
    }
  })
  new KeyPressListener("4", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "QuestionModal",
          modalRef: "q4"
        }
      ])
    }
  })
  new KeyPressListener("5", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "QuestionModal",
          modalRef: "q5"
        }
      ])
    }
  })
  new KeyPressListener("6", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "QuestionModal",
          modalRef: "q6"
        }
      ])
    }
  })
  new KeyPressListener("7", () => {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { 
          type: "openModal", 
          fileRef: "QuestionModal",
          modalRef: "q7"
        }
      ])
    }
  })

  this.modalButton = document.querySelectorAll('.KeyButton');
  this.modalButton.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!this.map.isCutscenePlaying) {
        this.map.startCutscene([
         { 
           type: "openModal", 
           fileRef: "HudModal",
           modalRef: btn.id
         }
        ])
       }
    });
  });
 }

 bindHeroPositionCheck() {
   document.addEventListener("PersonWalkingComplete", e => {
     if (e.detail.whoId === "hero") {
       //Hero's position has changed
       this.map.checkForFootstepCutscene()
     }
   })
 }

 startMap(mapConfig, heroInitialState=null) {
  this.map = new OverworldMap(mapConfig);
  this.map.overworld = this;
  this.map.mountObjects();

  if (heroInitialState) {
    const {hero} = this.map.gameObjects;
    hero.x = heroInitialState.x;
    hero.y = heroInitialState.y;
    hero.direction = heroInitialState.direction;
  }

  this.progress.mapId = mapConfig.id;
  this.progress.startingHeroX = this.map.gameObjects.hero.x;
  this.progress.startingHeroY = this.map.gameObjects.hero.y;
  this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
  
  this.hud.playerName = this.progress.playerName || this.titleScreen.playerName;
  
  if (this.progress.isTrackerEnabled) {
    this.progress.roomTracker = this.progress.roomTracker + 1;
    this.hud.updateFill(this.progress.roomTracker);

  }

 }

 async init() {

  const container = document.querySelector(".game-container");
  //Create a new Progress tracker
  this.progress = new Progress({});

  //Show the title screen
  this.titleScreen = new TitleScreen({
    progress: this.progress,
  })
  const useSaveFile = await this.titleScreen.init(container);

  //Potentially load saved data
  let initialHeroState = null;
  if (useSaveFile) {
    this.progress.load();
    initialHeroState = {
      x: this.progress.startingHeroX,
      y: this.progress.startingHeroY,
      direction: this.progress.startingHeroDirection,

    }

    this.progress.roomTracker = this.progress.roomTracker - 1;
  }


  //Load the UI
  this.hud = new HUD({
    map: this.map,
    progress: this.progress,
  });

  //Start the first map
  this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState);
  this.hud.init(container);

  //Create controls
  this.bindActionInput();
  this.bindHeroPositionCheck();

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  //Kick off the game!
  this.startGameLoop();
  if(this.titleScreen.isClosed && !useSaveFile) {

    if(this.titleScreen.playerName) {
      this.progress.playerName = this.titleScreen.playerName;
    }

    this.map.startCutscene([
      {
        type: "stand",
        who: "hero",
        direction: "up",
        time: 100,
      },
      { 
        type: "effect", 
        visual: "rumble",
        sound: "sounds/explosion.wav",
        time: 500,
      },
      {
        type: "stand",
        who: "hero",
        direction: "up",
        time: 1500,
      },
      { 
        type: "effect", 
        visual: "alarm",
        sound: "sounds/alarm.wav",
        toggle: true,
      },
      { 
        type: "walk", 
        who: "hero",
        direction: "up",
      },
      { 
        type: "walk", 
        who: "hero",
        direction: "up",
      },
      { 
        type: "walk", 
        who: "hero",
        direction: "up",
      },
      { type: "textMessage", name: "Bordcomputer", text: "SYSTEMWARNUNG!! MULTIPLE ÄUSSERE BESCHÄDIGUNGEN."},
      { type: "textMessage", name: "Bordcomputer", text: "SAUERSTOFFKONZENTRATION: 85%, TENDENZ FALLEND."},
      {
        type: "stand",
        who: "hero",
        direction: "up",
        time: 1000,
      },
      { type: "textMessage", name: this.progress.playerName, text: "Oh je! Anscheinend sind wir mit einem Asteroiden kollidiert!"},
      { type: "textMessage", name: this.progress.playerName, text: "Hätten wir bei der Berechnung des Kurses bloss nicht gerundet!"},
      { type: "textMessage", name: this.progress.playerName, text: "Aber das ist erstmal Nebensache! Ich muss nach den anderen sehen!"},
      { type: "textMessage", name: this.progress.playerName, text: "Die Sauerstoffkonzentration fällt..."},
      { type: "textMessage", name: this.progress.playerName, text: "Ein System-Checkup in O2 sollte mir mehr verraten!"},
      //Info-Modal { type: "openModal", fileRef: "HudModal", ModalRef: "info"}
      { type: "addStoryFlag", flag: "Q1_INTRO" }
     ])
  }
  this.timerLoop();

  // this.map.startCutscene([
  //   { type: "battle", enemyId: "beth" }
  //   // { type: "changeMap", map: "DemoRoom"}
  //   // { type: "textMessage", text: "This is the very first message!"}
  // ])

 }
}