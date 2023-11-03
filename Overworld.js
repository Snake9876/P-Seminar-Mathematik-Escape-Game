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
    this.map.isPaused = true;
    this.gameOverScreen = new GameOverScreen({
      progress: this.map.overworld.progress
    })
    this.gameOverScreen.init(document.querySelector('.game-container'));
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
  
  if (this.progress.isTrackerEnabled) {
    this.progress.roomTracker = this.progress.roomTracker + 1;
    this.hud.updateFill(this.progress.roomTracker);

  }

 }

 async init() {

  const container = document.querySelector(".game-container");

  //Create a new Progress tracker
  this.progress = new Progress();

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
    playerName: this.titleScreen.playerName,
    progress: this.progress,
  });
  this.hud.init(container);

  //Start the first map
  this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState);

  //Create controls
  this.bindActionInput();
  this.bindHeroPositionCheck();

  this.directionInput = new DirectionInput();
  this.directionInput.init();

  //Kick off the game!
  this.startGameLoop();
  if(this.titleScreen.isClosed) {
    this.map.startCutscene([
      { 
        type: "effect", 
        visual: "alert",
        sound: "sounds/knocking.wav"
      },
      {
        type: "stand",
        who: "hero",
        direction: "up",
        time: 2000,
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
      }
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