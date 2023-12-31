class OverworldEvent {
  constructor({ map, hud, events, eventIndex }) {
    this.map = map;
    this.hud = hud;
    this.events = events;
    this.eventIndex = eventIndex;
    this.event = events[eventIndex];
    this.classMap = {
      "HudModal": HudModals,
      "QuestionModal": QuestionModals,
    };
  }

  toggleOxygenBar(resolve) {
    //Inject oxygen bar into DOM
    const container = document.querySelector(".game-container");
    this.hud.injectBar(container);

    //Kick off tracker increase
    this.map.overworld.progress.isTrackerEnabled = this.event.bool || !this.map.overworld.progress.isTrackerEnabled;
    resolve();
  }

  toggleTimer(resolve) {
    //Inject timer into DOM
    const container = document.querySelector(".game-container");
    this.hud.injectTimer(container);

    //Kick off timer
    this.map.overworld.progress.isTimerEnabled = this.event.bool || !this.map.overworld.progress.isTimerEnabled;
    resolve();
  }

  updateTimer(resolve) {
    this.map.overworld.progress.timerValue = this.map.overworld.progress.timerValue + this.event.value;

    resolve();
  }

  updateObject(resolve) {
    this.config = this.event.update;
    this.obj = window.OverworldMaps[this.map.mapId].configObjects[this.config.id];
    this.hero = this.map.gameObjects["hero"];

    if(this.event.update.hide !== 'undefined') {
      this.obj.hide = this.config.hide;
    }

    if(this.event.update.spriteSrc !== 'undefined') {
      this.obj.src = this.config.spriteSrc;
    }

    //Deactivate old objects
    Object.values(this.map.gameObjects).forEach(obj => {
      obj.isMounted = false;
    })

    //Reload map
    this.map.overworld.startMap( window.OverworldMaps[this.map.mapId], {
      x: this.hero.x,
      y: this.hero.y,
      direction: this.hero.direction,
    });

    resolve();

  }

  effect(resolve) {

    if (this.event.sound) {
      const audio = new Audio(this.event.sound);
      audio.play();
    }
    
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

          
          resolve();
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

          
          resolve();
          break;

      }
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
      name: this.event.name === "playerName" ? this.map.overworld.progress.playerName : this.event.name,
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

    if (face != (this.event.face || 'down')) {
      resolve()
    } else {

      //Deactivate old objects
      Object.values(this.map.gameObjects).forEach(obj => {
        obj.isMounted = false;
      })

      const container = document.querySelector('.game-container');
      const sceneTransition = new ScreenEffects();
      sceneTransition.init(container, () => {

        //Open Game-Over-Screen after 20 room changes
        if (this.map.overworld.progress.roomTracker >= 30) {
          this.map.isPaused = true;
          this.gameOverScreen = new GameOverScreen({
            progress: this.map.overworld.progress
          })
          this.gameOverScreen.init(container);
        } else {
          this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
            x: this.event.x,
            y: this.event.y,
            direction: this.event.direction,
          }); 

        }

        if (this.map.overworld.progress.isTrackerEnabled) {
          this.map.overworld.progress.roomTracker += 1;
          this.hud.updateFill(this.map.overworld.progress.roomTracker);
      
        }

        sceneTransition.fadeOut();
        resolve();

      })
    }
  }

  openModal(resolve) {
    this.map.isPaused = true;

    const modal = new this.classMap[this.event.fileRef]({
      map: this.map,
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