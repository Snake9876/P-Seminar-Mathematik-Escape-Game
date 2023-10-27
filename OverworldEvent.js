class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
    this.updateTracker = this.event.updateTracker || 0;
    this.resetTracker = this.event.resetTracker || false;
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

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const audio = new Audio(this.event.sound || "/sounds/chat.wav");
    audio.play();

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") );

    if (this.updateTracker!=0 || this.resetTracker) {
      this.updateRoomTracker();
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

      const sceneTransition = new SceneTransition();
      sceneTransition.init(document.querySelector(".game-container"), () => {

        //Open Game-Over-Screen after 20 room changes
        if (this.map.overworld.roomTracker === 20) {
          this.map.overworld.startMap( window.OverworldMaps["Cafeteria"], {
            x: this.event.x,
            y: this.event.y,
            direction: this.event.direction,
          });
        } else {
          this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
            x: this.event.x,
            y: this.event.y,
            direction: this.event.direction,
          }); 
        }

        if (this.updateTracker!=0 || this.resetTracker) {
          this.updateRoomTracker();
        }

        resolve();
        sceneTransition.fadeOut();

      })
    }
  }

  updateRoomTracker() {

    if (this.resetTracker) {
      //Resets tracker
      this.map.overworld.roomTracker = 0;
    } else {
        //Updates tracker
        this.map.overworld.roomTracker = this.map.overworld.roomTracker + (this.event.updateTracker || 0);
    }

    this.map.overworld.oxygenBar.updateFill(this.map.overworld.roomTracker);
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(document.querySelector(".game-container"));
  }

  openModal(modal) {
    if(modal == null) return
    modal.classList.add('active');
    this.map.isPaused = true;
  }

  closeModal(modal) {
    if(modal == null) return
    modal.classList.remove('active');
    this.map.isPaused = false;
    this.map.overworld.startGameLoop();
  }  

  uiEvents(resolve) {
    this.openModalButtons = document.querySelectorAll('[data-modal-target]');
    this.closeModalButtons = document.querySelectorAll('[data-close-button]');
    this.overlay = document.querySelector(".overlay");

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

    resolve();
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}