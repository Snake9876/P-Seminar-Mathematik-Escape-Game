class Progress {
  constructor() {
    this.mapId = "Brücke";
    this.OverworldMaps = window.OverworldMaps;
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = "down";
    this.playerName = this.playerName;
    this.isTrackerEnabled = false;
    this.roomTracker = 0;
    this.isTimerEnabled = false;
    this.timerValue = 1200;
    this.storyFlags = {
      //Story-Flags
      "SEEN_INTRO": true,
        //O2-Task
      "Q1_INTRO": false,
      "Q1_IN_PROGRESS": false,
      "Q1_COMPLETED": false,
        //Cafeteria-Task
      "Q2_INTRO": false,
      "Q2_IN_PROGRESS": false,
      "LOOKING_FOR_METERSTICK": true,
      "Q2_COMPLETED": false,
        //Medic-Task
      "Q3_INTRO": false,
      "Q3_IN_PROGRESS": false,
      "Q3_COMPLETED": false,
        //Comms-Task
      "Q5_INTRO": false,
      "Q5_IN_PROGRESS": false,
      "Q5_COMPLETED": false,
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
      "PUT_ON_SUIT": false,
      "GOT_METERSTICK": false,
      "GOT_KEYCARD_QUARTERS": false,
      "GOT_TEXTBOOK": false,
      "GOT_CROWBAR": false,
      "GOT_NOTE": false,
      "GOT_KEYCARD_ENGINE": false,
 
      //HUD-Flags
      "O2_ENABLED": false,

      //Fun-Flags
      "STEPPED_IN_COFFEE": true,
    };
    this.saveFileKey = "EscapeGame_SaveFile1";
  }

  save() {
    window.localStorage.setItem(this.saveFileKey, JSON.stringify({
      mapId: this.mapId,
      OverworldMaps: window.OverworldMaps,
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
      window.OverworldMaps = file.OverworldMaps;
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