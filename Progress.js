class Progress {
  constructor() {
    this.mapId = "CommandBridge";
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = "down";
    this.isOxygenBarEnabled = false;
    this.roomTracker = 0;
    this.storyFlags = {
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
      roomTracker: this.roomTracker,
      isOxygenBarEnabled: this.isOxygenBarEnabled,
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
      this.roomTracker = file.roomTracker;
      this.isOxygenBarEnabled = file.isOxygenBarEnabled;
      this.storyFlags = file.storyFlags;
    }
  }

}