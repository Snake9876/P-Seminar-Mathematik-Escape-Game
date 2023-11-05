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
      "SEEN_INTRO": true,
      "GOT_ITEM_1": false,
      "GOT_ITEM_2": false,
      "GOT_ITEM_3": false,
      "GOT_ITEM_4": false,
      "GOT_ITEM_5": false,
      "GOT_ITEM_6": false,
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