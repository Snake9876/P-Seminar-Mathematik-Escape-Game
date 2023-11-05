class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
    this.updateTracker = this.event.updateTracker || 0;
    this.resetTracker = this.event.resetTracker || false;
    this.classMap = {
      "HudModal": HudModals,
      "QuestionModal": QuestionModals,
    };
  }

  toggleOxygenBar(resolve) {
    this.map.overworld.progress.isTrackerEnabled = this.event.bool || !this.map.overworld.progress.isTrackerEnabled;
    resolve();
  }

  toggleTimer(resolve) {
    this.map.overworld.progress.isTimerEnabled = this.event.bool || !this.map.overworld.progress.isTimerEnabled;
    resolve();
  }

  /*delay(resolve) {  
    this.map.isCutscenePlaying = false;

    setTimeout( () => {
      resolve();
      this.map.isCutscenePlaying = true;
    }, 
    this.event.time
    );
  }*/

  effect(resolve) {
    
    if(this.event.visual) {
      const container = document.querySelector(".game-container");

      switch (this.event.visual) {
        case "rumble":
          container.classList.toggle("shake");

          if(this.event.time) {
            setTimeout(function () {
              container.classList.toggle("shake");
            }, this.event.time);
          }

          break;
        case "alarm":
          if(this.event.time) {
            const alarmElement = document.createElement('div');
            alarmElement.classList.add("overlay", "alarm");
            container.appendChild(alarmElement);

            setTimeout(function () {
              alarmElement.remove();
            }, this.event.time);

          } else if(this.event.toggle) {
            const isAlarm = document.querySelector(".alarm");

            if(isAlarm == null) {
              const alarmElement = document.createElement('div');
              alarmElement.classList.add("overlay", "alarm");
              container.appendChild(alarmElement);
            } else {
              isAlarm.remove();
            }
          }
          
          break;
      }
    }

    if (this.event.sound) {
      const audio = new Audio(this.event.sound);
      audio.play();
    }

    resolve();
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)
  }

  textMessage(resolve) {

    if(this.event.randomText) {
      this.random = Math.floor(Math.random()*this.event.randomText.length);
      this.text = this.event.randomText[this.random];      
    } else {
      this.text = this.event.text;
    }

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") );

    if (this.event.resetTracker) {
      this.map.overworld.progress.roomTracker = 0;
      this.map.overworld.hud.updateFill(0);
    }

  }

  changeMap(resolve) {

    const face = this.map.gameObjects[ 'hero' ].direction;

    if (face != (this.event.face || "down")) {
      resolve()
    } else {

      //Deactivate old objects
      Object.values(this.map.gameObjects).forEach(obj => {
        obj.isMounted = false;
      })

      const sceneTransition = new ScreenEffects();
      sceneTransition.init(document.querySelector(".game-container"), () => {

        //Open Game-Over-Screen after 20 room changes
        if (this.map.overworld.progress.roomTracker >= 20) {
          this.map.isPaused = true;
          this.gameOverScreen = new GameOverScreen({
            progress: this.map.overworld.progress
          })
          this.gameOverScreen.init(document.querySelector('.game-container'));
        } else {
          this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
            x: this.event.x,
            y: this.event.y,
            direction: this.event.direction,
          }); 
        }

        resolve();
        sceneTransition.fadeOut();

      })
    }
  }

  openModal(resolve) {
    this.map.isPaused = true;

    const modal = new this.classMap[this.event.fileRef]({
      modalRef: this.event.modalRef,
      minimapSrc: this.map.minimap.src,
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    modal.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve) {
    this.map.overworld.progress.storyFlags[this.event.flag] = true;

    resolve();
  }

  removeStoryFlag(resolve) {
    this.map.overworld.progress.storyFlags[this.event.flag] = false;

    resolve();
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}