class Progress {
  constructor() {
    this.mapId = "CommandBridge";
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = "down";
    this.playerName = this.playerName;
    this.isTrackerEnabled = false;
    this.roomTracker = 0;
    this.isTimerEnabled = false;
    this.timerValue = 10;
    this.storyFlags = {
      //Story-Flags
      "SEEN_INTRO": true,
      //O2-Task
      "Q1_INTRO": false,
      "Q1_IN_PROGRESS": false,
      "Q1_COMPLETED": false,
      //Cafeteria-Task (Rubble)
      "Q2_INTRO": false,
      "Q2_COMPLETED": false,
      //Cafeteria-Task (Medic)
      "Q3_INTRO": false,
      "Q3_COMPLETED": false,
      //Comms-Task
      "Q4_INTRO": false,
      "Q4_IN_PROGRESS": false,
      "Q4_COMPLETED": false,
      //Cargo-Task
      "Q5_INTRO": false,
      "Q5_IN_PROGRESS": false,
      "Q5_COMPLETED": false,
      //Engine-Task
      "Q6_INTRO": false,
      "Q6_IN_PROGRESS": false,
      "Q6_COMPLETED": false,
      //CommandBridge-Task
      "Q7_INTRO": false,
      "Q7_IN_PROGRESS": false,
      "Q7_COMPLETED": false,

      //Item-Flags
      "GOT_METERSTICK": false,
      "GOT_TEXTBOOK": false,
      "GOT_CROWBAR": false,
      "GOT_KEYCARD": false,
      "GOT_ITEM_5": false,
      "GOT_ITEM_6": false,

      //Door-Flags
      "QUARTERS_DOOR_VIS": true,  
      "ENGINE_DOOR_VIS": true,
    };
    this.saveFileKey = "EscapeGame_SaveFile1";
  }

  save() {
    window.localStorage.setItem(this.saveFileKey, JSON.stringify({
      mapId: this.mapId,
      startingHeroX: this.startingHeroX,
      startingHeroY: this.startingHeroY,
      startingHeroDirection: this.startingHeroDirection,
      playerName: this.playerName,
      isTrackerEnabled: this.isTrackerEnabled,
      roomTracker: this.roomTracker,
      isTimerEnabled: this.isTimerEnabled,
      timerValue: this.timerValue,
      storyFlags: this.storyFlags,
    }))
  }

  getSaveFile() {

    if (!window.localStorage) {
      return null;
    }

    const file = window.localStorage.getItem(this.saveFileKey);
    return file ? JSON.parse(file) : null
  }
  
  load() {
    const file = this.getSaveFile();
    if (file) {
      this.mapId = file.mapId;
      this.startingHeroX = file.startingHeroX;
      this.startingHeroY = file.startingHeroY;
      this.startingHeroDirection = file.startingHeroDirection;
      this.playerName = file.playerName;
      this.isTrackerEnabled = file.isTrackerEnabled;
      this.roomTracker = file.roomTracker;
      this.isTimerEnabled = file.isTimerEnabled;
      this.timerValue = file.timerValue;
      this.storyFlags = file.storyFlags;
    }
  }

}