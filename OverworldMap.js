class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; // Live objects are in here
    this.configObjects = config.configObjects; // Configuration content

    this.playerName = null;

    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {}
    
    this.mapId = config.id;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.minimap = new Image();
    this.minimap.src = config.minimapSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;

  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    if (this.walls[`${x},${y}`]) {
      return true;
    }
    //Check for game objects at this position
    return Object.values(this.gameObjects).find(obj => {
      if (obj.x === x && obj.y === y) { return true; }
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y ) {
        return true;
      }
      return false;
    })

  }

  mountObjects() {
    this.gameObjects = {};

    Object.keys(this.configObjects).forEach(key => {

      this.flags = this.overworld.progress.storyFlags;

      let object = this.configObjects[key];
      object.id = key;
      object.isSuited = this.flags["PUT_ON_SUIT"];

      if((this.configObjects[key].requiredFlags || []).every(sf => {
        return this.flags[sf]
      }) && (object.hide || false) == false) {

        let instance;
        if (object.type === "Person") {
          instance = new Person(object);
        }

        this.gameObjects[key] = instance;
        this.gameObjects[key].id = key;
        instance.mount(this);
        
      }
    })

  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        events: events,
        eventIndex: i,
        map: this,
        hud: this.overworld.hud,
      })
      const result = await eventHandler.init();
    }

    this.isCutscenePlaying = false;
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return this.overworld.progress.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      const relevantScenario = match[0].scenarios.find(scenario => {
        return (scenario.required || []).every(sf => {
          return this.overworld.progress.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

}

window.OverworldMaps = {
  Brücke: {
    id: "Brücke",
    lowerSrc: "/images/maps/CommandBridgeLower.png",
    upperSrc: "/images/maps/CommandBridgeUpper.png",
    minimapSrc: "/images/ui/minimaps/CommandBridgeMinimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(10),
        direction: "up",
      },
      controlsLeft: {
        type: "Person",
        x: utils.withGrid(6),
        y: utils.withGrid(4),
        direction: "down",
        src: "/images/gameObjects/objects/keyboard.png",
        shadowImg: false,
        talking: [
          {
            required: ["Q6_COMPLETED"],
            events: [
              { type: "addStoryFlag", flag: "Q7_INTRO" },
              { type: "textMessage", name: "playerName", text: "Lorem" },
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q7"},
            ]
          },
          {
            required: ["Q7_INTRO"],
            events: [
              { type: "textMessage", name: "playerName", text: "Lorem"},
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q7"},
            ]
          },
          {
            events: [
              { type: "textMessage", name: "", text: "*Es scheint nichts zu passieren...*"},
            ]
          }
        ]
      },
      controlsRight: {
        type: "Person",
        x: utils.withGrid(7),
        y: utils.withGrid(4),
        direction: "right",
        src: "/images/gameObjects/objects/keyboard.png",
        shadowImg: false,
        talking: [
          {
            required: ["Q6_COMPLETED"],
            events: [
              { type: "addStoryFlag", flag: "Q7_INTRO" },
              { type: "textMessage", name: "playerName", text: "Lorem" },
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q7"},
            ]
          },
          {
            required: ["Q7_INTRO"],
            events: [
              { type: "textMessage", name: "playerName", text: "Lorem"},
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q7"},
            ]
          },
          {
            events: [
              { type: "textMessage", name: "", text: "*Es scheint nichts zu passieren...*"},
            ]
          }
        ]
      }
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6,10)]: [{
        scenarios: [
          {
            required: ["SEEN_INTRO"],
            events: [
              {
                type: "effect",
                visual: "alarm",
                toggle: true,
              },
              { 
                type: "changeMap", 
                map: "Lobby",
                x: utils.withGrid(7),
                y: utils.withGrid(6),
                direction: "up",
                face: "down",
              },
              {
                type: "removeStoryFlag",
                flag: "SEEN_INTRO"
              }
            ]
          },
          {
            events: [
              { 
                type: "changeMap", 
                map: "Lobby",
                x: utils.withGrid(7),
                y: utils.withGrid(6),
                direction: "up",
                face: "down",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(7,10)]: [{
        scenarios: [
          {
            required: ["SEEN_INTRO"],
            events: [
              {
                type: "effect",
                visual: "alarm",
                toggle: true,
              },
              { 
                type: "changeMap", 
                map: "Lobby",
                x: utils.withGrid(6),
                y: utils.withGrid(6),
                direction: "up",
                face: "down",
              },
              {
                type: "removeStoryFlag",
                flag: "SEEN_INTRO"
              }
            ]
          },
          {
            events: [
              { 
                type: "changeMap", 
                map: "Lobby",
                x: utils.withGrid(6),
                y: utils.withGrid(6),
                direction: "up",
                face: "down",
              }
            ]
          }
        ]
      }]
    },
    walls: function() {
      let walls = {};
      ["1,3","2,4","3,4","4,5","5,4","8,4","9,5",
      "10,4","11,4","12,3","13,4","13,5",
      "13,6","13,7","13,8","13,9","1,10","2,10","3,10","4,10","5,10","6,11",
      "7,11","8,10","9,10","10,10","11,10","12,10","0,4","0,5","1,6","2,7","1,8","0,9",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
  },
  Lobby: {
    id: "Lobby",
    lowerSrc: "/images/maps/Hallway1Lower.png",
    upperSrc: "/images/maps/Hallway1Upper.png",
    minimapSrc: "/images/ui/minimaps/Hallway1Minimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      CaptainsQuartersDoor: {
        type: "Person",
        x: utils.withGrid(11),
        y: utils.withGrid(3),
        direction: "right",
        src: "/images/gameObjects/objects/door.png",
        shadowImg: false,
        talking: [
          {
            required: ["CAPTAIN_KNOCKED"],
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "right",
                time: 1000,
              },
              { 
                type: "textMessage", name: "???",
                randomText: [
                  "Diese Welt ist klein, so klein...", 
                  "Ich will nach Hause...", 
                  "Wo ist Herr Kuschel?"
                ]
              },
            ]
          },
          {
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "right",
                time: 1000,
              },
              { type: "textMessage", name: "???", text: "AHHH! WIR WERDEN ALLE STERBEN!" },
              { type: "textMessage", name: "playerName", text: "War das der Captain?" },
              { type: "textMessage", name: "playerName", text: "Und so jemandem wird eine Führungsposition anvertraut..." },
              { type: "addStoryFlag", flag: "CAPTAIN_KNOCKED" }
            ]
          }
        ]
      },
      CargoDoor: {
        type: "Person",
        x: utils.withGrid(1),
        y: utils.withGrid(4),
        direction: "left",
        src: "/images/gameObjects/objects/door.png",
        shadowImg: false,
        talking: [
          {
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "left",
                time: 1000,
              },
              { type: "textMessage", 
              text: "*Es scheint niemand zu antworten*"},
            ]
          }
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["2,6","3,6","4,6","5,6","6,7","7,7","8,6","9,6","10,6",
      "11,5","11,4","11,3","11,2","11,1",
      "10,0","9,0","8,0","7,1","7,2","6,2","5,1","4,2","3,2","2,2","1,3","1,5",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(5,2)]: [{
        scenarios: [
          {
            required: ["Q2_INTRO","Q2_IN_PROGRESS"],
            events: [
              { 
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(14),
                y: utils.withGrid(8),
                direction: "left",
                face: "up"
              },
              { type: "textMessage", name: "playerName", text: "Oh nein! Was ist denn hier passiert?!" },
              { type: "textMessage", name: "playerName", text: "Yuri! Bist du hier? Kannst du mich hören?" },
              { type: "textMessage", name: "Yuri", text: "Hilf mir... ich bin unter... größtem Berg..." },
              { type: "textMessage", name: "playerName", text: "Die Zeit reicht nicht aus, jeden Berg wegzuräumen." },
              { type: "textMessage", name: "playerName", text: "Ich muss herausfinden, welcher der Größte ist!" },
              { type: "textMessage", name: "playerName", text: "Aber warte, die Berge sehen doch fast wie Kegel aus!" },
              { type: "textMessage", name: "playerName", text: "Jetzt brauche ich nur noch etwas zum Messen der Längen..." },
              { type: "textMessage", name: "playerName", text: "Hier im Raum muss es doch irgendwas dafür geben!" },
              { type: "removeStoryFlag", flag: "Q2_INTRO" },
              { type: "addStoryFlag", flag: "LOOKING_FOR_METERSTICK" }
            ]
          },
          {
            events: [
              { 
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(14),
                y: utils.withGrid(8),
                direction: "left",
                face: "up",
              }
            ]
          },
        ]
      }],
      [utils.asGridCoord(6,6)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Brücke",
                x: utils.withGrid(7),
                y: utils.withGrid(10),
                direction: "up",
                face: "down",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(7,6)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Brücke",
                x: utils.withGrid(6),
                y: utils.withGrid(10),
                direction: "up",
                face: "down",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(8,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(2),
                y: utils.withGrid(8),
                direction: "up",              
                face: "up",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(9,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(3),
                y: utils.withGrid(8),
                direction: "up",
                face: "up",
              }
            ]
          }
        ] 
      }],
      [utils.asGridCoord(10,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(4),
                y: utils.withGrid(8),
                direction: "up",
                face: "up",
              }
            ]
          }
        ]  
      }],
    }
  },
  Westflügel: {
    id: "Westflügel",
    lowerSrc: "/images/maps/Hallway2Lower.png",
    upperSrc: "/images/maps/Hallway2Upper.png",
    minimapSrc: "/images/ui/minimaps/Hallway2Minimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      QuartersDoor: {
        type: "Person",
        x: utils.withGrid(5),
        y: utils.withGrid(5),
        direction: "right",
        src: "/images/gameObjects/objects/door.png",
        shadowImg: false,
        talking: [
          {
            required: ["GOT_KEYCARD_QUARTERS"],
            events: [
              { 
                type: "updateObject", 
                update: {
                  id: "QuartersDoor",
                  hide: true
                }
              },
            ]
          },
          {
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "right",
                time: 1000,
              },
              { type: "textMessage", name: "playerName", text: "*Es scheint niemand zu antworten...*"}
            ]
          }
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["2,9","3,9","4,9","1,8","0,7","1,6","1,5","1,4","0,3","1,1","1,2","2,0","3,0","4,0","4,0","5,1","5,2","5,3","5,4","6,5","5,6","5,7","5,8",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(1,7)]: [{
        scenarios: [
          {
            required: ["Q2_INTRO","Q2_IN_PROGRESS"],
            events: [
              { 
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(8),
                y: utils.withGrid(2),
                direction: "down",
                face: "left",
              },
              { type: "textMessage", name: "playerName", text: "Oh nein! Was ist denn hier passiert?!" },
              { type: "textMessage", name: "playerName", text: "Yuri! Bist du hier? Kannst du mich hören?" },
              { type: "textMessage", name: "Yuri", text: "Hilf mir... ich bin unter... größtem Berg..." },
              { type: "textMessage", name: "playerName", text: "Die Zeit reicht nicht aus, jeden Berg wegzuräumen." },
              { type: "textMessage", name: "playerName", text: "Ich muss herausfinden, welcher der Größte ist!" },
              { type: "textMessage", name: "playerName", text: "Aber warte, die Berge sehen doch fast wie Kegel aus!" },
              { type: "textMessage", name: "playerName", text: "Jetzt brauche ich nur noch etwas zum Messen der Längen..." },
              { type: "textMessage", name: "playerName", text: "Hier im Raum muss es doch irgendwas dafür geben!" },
              { type: "removeStoryFlag", flag: "Q2_INTRO" },
              { type: "addStoryFlag", flag: "LOOKING_FOR_METERSTICK" }

            ]
          },
          {
            events: [
              { 
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(8),
                y: utils.withGrid(2),
                direction: "down",
                face: "left",
              }
            ]
          }
        ]   
      }],
      [utils.asGridCoord(1,3)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "O2",
                x: utils.withGrid(5),
                y: utils.withGrid(2),
                direction: "down",
                face: "left",
              }
            ]
          }
        ]     
      }],
      [utils.asGridCoord(5,5)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Quartiere",
                x: utils.withGrid(9),
                y: utils.withGrid(6),
                direction: "up",
                face: "right",
              }
            ]
          }
        ]  
      }],
      [utils.asGridCoord(2,8)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Lobby",
                x: utils.withGrid(8),
                y: utils.withGrid(1),
                direction: "down",
                face: "down",
              }
            ]
          }
        ]  
      }],
      [utils.asGridCoord(3,8)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Lobby",
                x: utils.withGrid(9),
                y: utils.withGrid(1),
                direction: "down",
                face: "down",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(4,8)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Lobby",
                x: utils.withGrid(10),
                y: utils.withGrid(1),
                direction: "down",
                face: "down",
              }
            ]
          }
        ]   
      }],
      [utils.asGridCoord(2,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ecke",
                x: utils.withGrid(2),
                y: utils.withGrid(5),
                direction: "up",
                face: "up",
              }
            ]
          }
        ]  
      }],
      [utils.asGridCoord(3,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ecke",
                x: utils.withGrid(3),
                y: utils.withGrid(5),
                direction: "up",
                face: "up",
              }
            ]
          }
        ]      
      }],
      [utils.asGridCoord(4,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ecke",
                x: utils.withGrid(4),
                y: utils.withGrid(5),
                direction: "up",
                face: "up",
              }
            ]
          }
        ]    
      }]
    }
  },
  Ecke: {
    id: "Ecke",
    lowerSrc: "/images/maps/CornerLower.png",
    upperSrc: "/images/maps/CornerUpper.png",
    minimapSrc: "/images/ui/minimaps/CornerMinimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      }
    },
    walls: function() {
      let walls = {};
      ["2,6","3,6","4,6","5,5","6,4","5,3","5,2","4,1","3,1","2,1","1,1","0,2","0,3","0,4","1,5",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(2,5)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(2),
                y: utils.withGrid(1),
                direction: "down",
                face: "down",
              }
            ]
          }
        ]       
      }],
      [utils.asGridCoord(3,5)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(3),
                y: utils.withGrid(1),
                direction: "down",
                face: "down", 
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(4,5)]: [{
          scenarios: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "Westflügel",
                  x: utils.withGrid(4),
                  y: utils.withGrid(1),
                  direction: "down",
                  face: "down",
                }
              ]
            }
          ]    
      }],
      [utils.asGridCoord(1,2)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Korridor",
                x: utils.withGrid(2),
                y: utils.withGrid(1),
                direction: "down",
                face: "left",
              }
            ]
          }
        ]   
      }],
      [utils.asGridCoord(1,3)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Korridor",
                x: utils.withGrid(3),
                y: utils.withGrid(1),
                direction: "down",
                face: "left",
              }
            ]
          }
        ] 
      }],
      [utils.asGridCoord(1,4)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Korridor",
                x: utils.withGrid(4),
                y: utils.withGrid(1),
                direction: "down",
                face: "left",
              }
            ]
          }
        ]      
      }],
      [utils.asGridCoord(5,4)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Hangar",
                x: utils.withGrid(13),
                y: utils.withGrid(15),
                direction: "up",
                face: "right",
              }
            ]
          }
        ]      
      }]
    }
  },
  Korridor: {
    id: "Korridor",
    lowerSrc: "/images/maps/Hallway3Lower.png",
    upperSrc: "/images/maps/Hallway3Upper.png",
    minimapSrc: "/images/ui/minimaps/Hallway3Minimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      EngineDoor: {
        type: "Person",
        x: utils.withGrid(1),
        y: utils.withGrid(9),
        direction: "left",
        src: "/images/gameObjects/objects/door.png",
        shadowImg: false,
        hide: false,
        talking: [
          {
            required: ["GOT_KEYCARD_ENGINE"],
            events: [
              {
                type: "updateObject",
                update: {
                  id: "EngineDoor",
                  hide: true
                }
              }
            ]
          },
          {
            required: ["Q2_IN_PROGRESS"],
            events: [
              {
                type: "stand",
                who: "hero",
                direction: "left",
                time: 1000,
              },
              { type: "textMessage", name: "playerName", text: "Wo ist unser Ingenieur Yuri, wenn man ihn braucht?" },
              { type: "textMessage", name: "playerName", text: "Wollte er sich nicht gerade einen Kaffee holen?" },
            ]
          },
          {
            required: ["Q2_INTRO"],
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "left",
                time: 1000,
              },
              { type: "textMessage", name: "playerName", text: "Verdammt, sie lässt sich nicht öffnen!" },
              { type: "textMessage", name: "playerName", text: "Dass das gerade jetzt passieren muss!" },
              { type: "textMessage", name: "playerName", text: "Wo ist unser Ingenieur Yuri, wenn man ihn braucht?" },
              { type: "textMessage", name: "playerName", text: "Wollte er sich nicht gerade einen Kaffee holen?" },
              { type: "addStoryFlag", flag: "Q2_IN_PROGRESS" }
            ]
          },
          {
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "left",
                time: 1000,
              },
              { type: "textMessage", name: "", text: "*Es scheint niemand zu antworten...*" }
            ]
          },
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["0,16","1,17","2,17","3,17","4,17","5,17","6,16",
      "6,15","6,14","5,13","6,12","5,11","5,10","5,9","6,8","5,7","5,6","5,5","6,4","6,3","5,2","5,1",
      "2,0","3,0","4,0",
      "0,15","0,14","1,13","1,12","1,11","1,10","0,9","1,8","1,7","1,6","1,5","1,4","1,3","1,2","1,1",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(2,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ecke",
                x: utils.withGrid(1),
                y: utils.withGrid(2),
                direction: "right",
                face: "up",
              }
            ]
          }
        ]   
      }],
      [utils.asGridCoord(3,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ecke",
                x: utils.withGrid(1),
                y: utils.withGrid(3),
                direction: "right",
                face: "up",
              }
            ]
          }
        ]    
      }],
      [utils.asGridCoord(4,1)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ecke",
                x: utils.withGrid(1),
                y: utils.withGrid(4),
                direction: "right",
                face: "up", 
              }
            ]
          }
        ]  
      }],
      [utils.asGridCoord(5,8)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Nachrichtenzentrale",
                x: utils.withGrid(6),
                y: utils.withGrid(2),
                direction: "down",
                face: "right",
              }
            ]
          }
        ] 
      }],
      [utils.asGridCoord(1,9)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Maschinenraum",
                x: utils.withGrid(7),
                y: utils.withGrid(22),
                direction: "left",
                face: "left",
              }
            ]
          }
        ] 
      }],
      [utils.asGridCoord(5,12)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Krankenstation",
                x: utils.withGrid(5),
                y: utils.withGrid(2),
                direction: "down",
                face: "right",
              }
            ]
          }
        ] 
      }],
      [utils.asGridCoord(5,3)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ostflügel",
                x: utils.withGrid(1),
                y: utils.withGrid(3),
                direction: "right",
                face: "right",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(5,4)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ostflügel",
                x: utils.withGrid(1),
                y: utils.withGrid(4),
                direction: "right",
                face: "right",
              }
            ]
          }
        ]   
      }]
    }
  },
  Ostflügel: {
    id: "Ostflügel",
    lowerSrc: "/images/maps/Hallway4Lower.png",
    upperSrc: "/images/maps/Hallway4Upper.png",
    minimapSrc: "/images/ui/minimaps/Hallway4Minimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      }
    },
    cutsceneSpaces: {
      [utils.asGridCoord(1,3)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Korridor",
                x: utils.withGrid(5),
                y: utils.withGrid(3),
                direction: "left",
                face: "left",
              }
            ]
          }
        ]   
      }],
      [utils.asGridCoord(1,4)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Korridor",
                x: utils.withGrid(5),
                y: utils.withGrid(4),
                direction: "left",
                face: "left",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(5,2)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "O2",
                x: utils.withGrid(5),
                y: utils.withGrid(7),
                direction: "up",
                face: "up",
              }
            ]
          }
        ] 
      }],
      [utils.asGridCoord(9,3)]: [{
        scenarios: [
          {
            required: ["Q2_INTRO","Q2_IN_PROGRESS"],
            events: [
              { 
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(1),
                y: utils.withGrid(6),
                direction: "right",
                face: "right",
              },
              { type: "textMessage", name: "playerName", text: "Oh nein! Was ist denn hier passiert?!" },
              { type: "textMessage", name: "playerName", text: "Yuri! Bist du hier? Kannst du mich hören?" },
              { type: "textMessage", name: "Yuri", text: "Hilf mir... ich bin unter... größtem Berg..." },
              { type: "textMessage", name: "playerName", text: "Die Zeit reicht nicht aus, jeden Berg wegzuräumen." },
              { type: "textMessage", name: "playerName", text: "Ich muss herausfinden, welcher der Größte ist!" },
              { type: "textMessage", name: "playerName", text: "Aber warte, die Berge sehen doch fast wie Kegel aus!" },
              { type: "textMessage", name: "playerName", text: "Jetzt brauche ich nur noch etwas zum Messen der Längen..." },
              { type: "textMessage", name: "playerName", text: "Hier im Raum muss es doch irgendwas dafür geben!" },
              { type: "removeStoryFlag", flag: "Q2_INTRO" },
              { type: "addStoryFlag", flag: "LOOKING_FOR_METERSTICK" }

            ]
          },
          {
            events: [
              {
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(1),
                y: utils.withGrid(6),
                direction: "right",
                face: "right",
              }
            ]
          }
        ] 
      }],
      [utils.asGridCoord(9,4)]: [{
        scenarios: [
          {
            required: ["Q2_INTRO","Q2_IN_PROGRESS"],
            events: [
              { 
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(1),
                y: utils.withGrid(7),
                direction: "right",
                face: "right",
              },
              { type: "textMessage", name: "playerName", text: "Oh nein! Was ist denn hier passiert?!" },
              { type: "textMessage", name: "playerName", text: "Yuri! Bist du hier? Kannst du mich hören?" },
              { type: "textMessage", name: "Yuri", text: "Hilf mir... ich bin unter... größtem Berg..." },
              { type: "textMessage", name: "playerName", text: "Die Zeit reicht nicht aus, jeden Berg wegzuräumen." },
              { type: "textMessage", name: "playerName", text: "Ich muss herausfinden, welcher der Größte ist!" },
              { type: "textMessage", name: "playerName", text: "Aber warte, die Berge sehen doch fast wie Kegel aus!" },
              { type: "textMessage", name: "playerName", text: "Jetzt brauche ich nur noch etwas zum Messen der Längen..." },
              { type: "textMessage", name: "playerName", text: "Hier im Raum muss es doch irgendwas dafür geben!" },
              { type: "removeStoryFlag", flag: "Q2_INTRO" },
              { type: "addStoryFlag", flag: "LOOKING_FOR_METERSTICK" }
            ]
          },
          {
            events: [
              {
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(1),
                y: utils.withGrid(7),
                direction: "right",
                face: "right",
              }
            ]
          }
        ] 
      }]
    },
    walls: function() {
      let walls = {};
      ["1,5","2,5","3,5","4,5","5,5","6,5","7,5","8,5","9,5",
      "10,4","10,3",
      "1,2","2,2","3,2","4,2","5,1","6,2","7,2","8,2","9,2",
      "0,4","0,3",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
  },
  Cafeteria: {
    id: "Cafeteria",
    lowerSrc: "/images/maps/CafeteriaLower.png",
    upperSrc: "/images/maps/CafeteriaUpper.png",
    minimapSrc: "/images/ui/minimaps/CafeteriaMinimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(8),
      },
      Yuri: {
        type: "Person",
        x: utils.withGrid(3),
        y: utils.withGrid(5),
        direction: "down",
        src: "/images/gameObjects/objects/rubblePile.png",
        shadowImg: true,
        talking: [
          {
            required: ["Q2_COMPLETED"],
            events: [
              { type: "textMessage", name: "playerName", text: "Er ist ohnmächtig und seine Vitalwerte sind miserabel!"},
              { type: "textMessage", name: "playerName", text: "Ich muss Krankenschwester Bella finden!"}, 
            ]
          },
          {
            required: ["REMOVABLE","GOT_METERSTICK"],
            events: [
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q22"} 
              
            ]
          },
          {
            required: ["Q2_IN_PROGRESS","GOT_METERSTICK"],
            events: [
              { type: "removeStoryFlag", flag: "Q2_IN_PROGRESS" }, 
              {
                type: "updateObject",
                update: {
                  id: "Yuri",
                  spriteSrc: "images/gameObjects/people/yuriEngineer.png",
                }
              }, 
              { type: "textMessage", name: "playerName", text: "Oh nein, Yuri!"},
              { type: "textMessage", name: "playerName", text: "Er ist ohnmächtig und seine Vitalwerte sind miserabel!"},
              { type: "textMessage", name: "playerName", text: "Noch ist er am Leben,..."},
              { type: "textMessage", name: "playerName", text: "...aber er muss dringend untersucht werden!"},
              { type: "textMessage", name: "playerName", text: "Ich muss Krankenschwester Bella finden!"}, 
              { type: "addStoryFlag", flag: "Q2_COMPLETED" },
            ]
          }
        ]
      },
      Schutthaufen: {
        type: "Person",
        x: utils.withGrid(9),
        y: utils.withGrid(7),
        direction: "down",
        src: "/images/gameObjects/objects/rubblePile.png",
        shadowImg: false,
        talking: [
          {
            required: ["REMOVABLE","GOT_METERSTICK"],
            events: [
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q21"}          
            ]
          }
        ], 
      },
      Schrank: {
        type: "Person",
        x: utils.withGrid(13),
        y: utils.withGrid(6),
        direction: "down",
        src: "/images/gameObjects/objects/cupboardDoor.png",
        shadowImg: false,
        talking: [
          {
            required: ["LOOKING_FOR_METERSTICK"],
            events: [
              { type: "removeStoryFlag", flag: "LOOKING_FOR_METERSTICK" },
              { type: "addStoryFlag", flag: "GOT_METERSTICK" },  
              { type: "addStoryFlag", flag: "REMOVABLE" },  
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 100
              },
              {
                type: "updateObject",
                update: {
                  id: "Schrank",
                  spriteSrc: "/images/gameObjects/objects/cupboardDoorOpen.png",
                }
              },
              { type: "textMessage", name: "playerName",
                text: "Was haben wir hier?"
              },
              { type: "textMessage", name: "playerName",
                text: "Einen Schraubenschlüssel, einen Proteinriegel..."
              },
              { type: "textMessage", name: "playerName",
                text: "Wem der wohl gehört?"
              },
              { type: "textMessage", name: "playerName",
                text: "Aha! Ein Meterstab!"
              },
              { type: "textMessage", name: "playerName",
                text: "Damit wird es wohl gehen."
              }    
            ]
          }
        ], 
      },
      BellaMedic: {
        type: "Person",
        x: utils.withGrid(4),
        y: utils.withGrid(5),
        direction: "left",
        src: "/images/gameObjects/people/bellaMedic.png",
        shadowImg: true,
        requiredFlags: ["Q3_INTRO"],
        talking: [ 
          {
            required: ["LOOKING_FOR_CROWBAR"],
            events: [
              { type: "textMessage", name: "playerName", text: "Yuri! Weißt du zufällig, wie ich die Kisten im Hangar öffnen kann?" },
              { type: "textMessage", name: "Yuri", text: "Hier, nimm meine Schlüsselkarte für die Quartiere." },
              { type: "textMessage", name: "Yuri", text: "Da liegt meine Brechstange." },
              { type: "textMessage", name: "playerName", text: "Warte, wieso...?" },
              { type: "textMessage", name: "Yuri", text: "Man kann nie wissen..." },
              { type: "textMessage", name: "playerName", text: "Aber...?" },
              { type: "textMessage", name: "Yuri", text: "WILLST DU JETZT DIE VERDAMMTE KISTE ÖFFNEN, ODER NICHT?!" },
              { type: "textMessage", name: "playerName", text: "Ich bin schon auf dem Weg!" },
              { type: "addStoryFlag", flag: "GOT_KEYCARD_QUARTERS" },
              { type: "removeStoryFlag", flag: "LOOKING_FOR_CROWBAR" }
            ]
          },
          {
            required: ["Q5_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "Yuri", text: "Was stehst du hier noch rum? Geh schon!" },
            ]
          },  
          {
            required: ["Q5_INTRO"],
            events: [
              { type: "textMessage", name: "Yuri", text: "Was stehst du hier noch rum? Geh schon!" },
            ]
          }, 
          {
            required: ["Q4_COMPLETED"],
            events: [
              { type: "textMessage", name: "Bella", text: "Hast du den Notruf abgesetzt?" },
              { type: "textMessage", name: "playerName", text: "Hallo Bella! Es kam etwas dazwischen, aber ja." },
              { type: "textMessage", name: "playerName", text: "Kann ich jetzt mit Yuri sprechen?" },
              { type: "textMessage", name: "Yuri", text: "Ob du das kannst, weiß ich nicht..." },
              { type: "textMessage", name: "Yuri", text: "...aber du darfst." },
              { type: "textMessage", name: "playerName", text: "Gott sei Dank, geht's dir gut!" },
              { type: "textMessage", name: "Yuri", text: "So leicht lass ich mich nicht unterkriegen!" },
              { type: "textMessage", name: "playerName", text: "Ha! Ein Witz nach dem anderen!" },
              { type: "textMessage", name: "Yuri", text: "Hey! Touché..." },
              { type: "textMessage", name: "Yuri", text: "Was ist überhaupt los?" },
              { type: "textMessage", name: "playerName", text: "Durch die Kollision ist wohl die Steuerung ausgefallen..." },
              { type: "textMessage", name: "playerName", text: "...und nun klemmt die Tür zum..." },
              { type: "textMessage", name: "Yuri", text: "BITTE WAS?!" },
              { type: "textMessage", name: "Yuri", text: "Und was machen wir dann noch hier?" },
              { type: "textMessage", name: "Yuri", text: "Wir könnten jeden Moment wieder mit etwas zusammenstoßen!" },
              { type: "textMessage", name: "playerName", text: "Das ist es ja, wir befinden uns bereits auf Kollisionskurs..." },
              { type: "textMessage", name: "Yuri", text: "BITTE WAS?!!!" },
              { type: "textMessage", name: "Yuri", text: "Wir dürfen keine Zeit verlieee..." },
              { type: "textMessage", name: "Bella", text: "Yuri! Dein Bein ist doch gebrochen!" },
              { type: "textMessage", name: "Bella", text: "Du darfst dich nicht bewegen!" },
              { type: "textMessage", name: "Yuri", text: "Verdammt! Dann hängt es wohl an dir." },
              { type: "textMessage", name: "Yuri", text: "Du sagtest du Tür lässt sich nicht öffnen?" },
              { type: "textMessage", name: "Yuri", text: "Die Schlüsselkarte habe ich zuletzt im Kontrollraum des Hangars gesehen..." },
              { type: "textMessage", name: "Yuri", text: "Damit sollte es klappen." },
              { type: "textMessage", name: "playerName", text: "Du kannst auf mich zählen!" },
              { type: "textMessage", name: "Yuri", text: "Wenn wir draufgehen, bring ich dich um!" },
              { type: "textMessage", name: "playerName", text: "Charismatisch, wie immer!" },
              { type: "addStoryFlag", flag: "Q5_INTRO" },
            ]
          },
          {
            required: ["Q3_COMPLETED"],
            events: [
              { type: "textMessage", name: "Bella", text: "Am besten setzt du einen Notruf ab!" },
            ]
          },
          {
            required: ["Q3_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "Bella", text: "Da gibt es tatsächlich etwas, wobei du mir helfen kannst!" },
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q3"}
            ]
          }, 
          {
            required: ["Q3_INTRO"],
            events: [
              { type: "addStoryFlag", flag: "Q3_IN_PROGRESS" },
              { type: "textMessage", name: "Bella", text: "Hmm, sein Herz schlägt unregelmäßig..." },
              { type: "textMessage", name: "Bella", text: "Ich habe im bereits ein Medikament verabreicht." },
              { type: "textMessage", name: "Bella", text: "Mit dem Zweiten muss ich noch etwas warten..." },
              { type: "textMessage", name: "playerName", text: "Kann ich dir denn gar nicht helfen?" },
              { type: "textMessage", name: "Bella", text: "Hmm, da gibt es tatsächlich etwas!" },
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q3"}
            ]
          }
        ]
      },
      Book: {
        type: "Person",
        x: utils.withGrid(12),
        y: utils.withGrid(3),
        direction: "down",
        src: "/images/gameObjects/objects/bookItem.png",
        shadowImg: false,
        talking: [
          {      
            required: ["Q4_INTRO","Q4_IN_PROGRESS"],
            events: [
              { type: "addStoryFlag", flag: "GOT_TEXTBOOK" },
              { type:"removeStoryFlag", flag: "Q4_INTRO" },
              { type: "textMessage", name: "playerName", text: "Hm, wo haben wir es denn?" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "textMessage", name: "playerName", text: "Einführung in elektrische Schaltkreise..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "textMessage", name: "playerName", text: "50 Rezepte für die Weihnachtszeit..." },
              { type: "textMessage", name: "playerName", text: "Warum steht das hier?" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "textMessage", name: "playerName", text: "Aha! Signaltheorie!" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              {
                type: "updateObject",
                update: {
                  id: "Book",
                  spriteSrc: "/images/gameObjects/shadows/noshadow.png",
                }
              },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 250
              },
              { type: "textMessage", name: "playerName", text: "... das Störsignal mit einer Gegenfunktion destruktiv interferieren..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "textMessage", name: "playerName", text: "...gleiche Frequenz..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "textMessage", name: "playerName", text: "...gleiche Verschiebung in x- und y-Richtung..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "textMessage", name: "playerName", text: "...umgekehrte Amplitude..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "textMessage", name: "playerName", text: "Damit sollte es gehen!" },
              
            ]
          }
        ]
      }
    },
    cutsceneSpaces: {
      [utils.asGridCoord(8,2)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(1),
                y: utils.withGrid(7),
                direction: "right",
                face: "up",
              }
            ]
          }
        ]   
      }],
      [utils.asGridCoord(14,8)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Lobby",
                x: utils.withGrid(5),
                y: utils.withGrid(2),
                direction: "down",
                face: "right",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(1,6)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ostflügel",
                x: utils.withGrid(9),
                y: utils.withGrid(3),
                direction: "left",
                face: "left",
              }
            ]
          }
        ]
      }],
      [utils.asGridCoord(1,7)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Ostflügel",
                x: utils.withGrid(9),
                y: utils.withGrid(4),
                direction: "left",
                face: "left",
              }
            ]
          }
        ]  
      }],
      [utils.asGridCoord(4,8)]: [{
        scenarios: [
          {
            required: ["STEPPED_IN_COFFEE","PUT_ON_SUIT"],
            events: [
              { type: "textMessage", name: "playerName", text: "Mist, der Anzug ist frisch gewaschen..." },
              { type: "removeStoryFlag", flag: "STEPPED_IN_COFFEE" }
            ]
          }
        ]   
      }],
    },
    walls: function() {
      let walls = {};
      ["2,11","3,11","4,11","5,11","6,11","7,11",
      "8,11","9,11","10,11","11,11","12,11","13,11",
      "14,10","14,9","15,8","14,7","14,5","10,3",
      "9,2","8,1","6,2","5,3","5,4","4,4","3,4",
      "2,4","1,5","0,6","0,7","1,8","1,9","1,10",
      "3,9","4,9","5,9","3,6","4,6","5,6","8,6",
      "9,6","10,6","8,9","9,9","10,9",
      "11,3","13,3","12,6","13,6","7,2","7,3","7,4",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
  },
  Nachrichtenzentrale: {
    id: "Nachrichtenzentrale",
    lowerSrc: "/images/maps/CommsLower.png",
    upperSrc: "/images/maps/CommsUpper.png",
    minimapSrc: "/images/ui/minimaps/CommsMinimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      CommsPanel: {
        type: "Person",
        x: utils.withGrid(5),
        y: utils.withGrid(2),
        direction: "down",
        src: "/images/gameObjects/objects/Monitor.png",
        shadowImg: false,
        talking: [
          {      
            required: ["Q4_IN_PROGRESS","GOT_TEXTBOOK"],    
            events: [
              { type: "effect", sound: "sounds/chat.wav" },
              { type: "textMessage", name: "playerName", text: "Hilf mir, schlaues Buch!" },
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q4" }

            ]
          },
          {
            required: ["Q4_INTRO"],
            events: [
              { type: "effect", sound: "sounds/chat.wav" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000
              },
              { type: "textMessage", name: "playerName", text: "Mist! Auch das noch!" },
              { type: "textMessage", name: "playerName", text: "Anscheinend wurde unsere Antenne in der Kollision beschädigt." },
              { type: "textMessage", name: "playerName", text: "Wenigstens scheint sie noch Signale aussenden zu können,..." },
              { type: "textMessage", name: "playerName", text: "...aber sie scheinen verzerrt zu sein!" },
              { type: "textMessage", name: "playerName", text: "Vielleicht kann ich sie reparieren..." },
              { type: "textMessage", name: "playerName", text: "Hab ich darüber nicht erst letztens gelesen?" },
              { type: "addStoryFlag", flag: "Q4_IN_PROGRESS" },
            ]
          },
          {      
            required: ["Q4_IN_PROGRESS"],    
            events: [
              { type: "effect", sound: "sounds/chat.wav" },
              { type: "textMessage", name: "playerName", text: "Vielleicht kann ich die Antenne reparieren..." },
              { type: "textMessage", name: "playerName", text: "Hab ich darüber nicht erst letztens gelesen?" },
            ]
          },
          {      
            required: ["Q4_COMPLETED"],    
            events: [
              { type: "effect", sound: "sounds/chat.wav" },
              { type: "textMessage", name: "playerName", text: "Der Notruf wurde abgesetzt." },
              { type: "textMessage", name: "playerName", text: "Hoffentlich empfängt ihn jemand..." },
            ]
          }
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["2,8","3,8","4,8","5,8","6,8","7,8","8,8",
      "8,3","9,4","9,5","9,6","9,7",
      "2,3","3,3","4,3","5,2","6,1","7,2",
      "1,3","1,4","2,5","3,5","2,6","1,7",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(6,2)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Korridor",
                x: utils.withGrid(5),
                y: utils.withGrid(8),
                direction: "left",
                face: "up",
              }
            ]
          }
        ]
      }]
    }
  },
  Quartiere: {
    id: "Quartiere",
    lowerSrc: "/images/maps/QuartersLower.png",
    upperSrc: "/images/maps/QuartersUpper.png",
    minimapSrc: "/images/ui/minimaps/QuartersMinimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      LockerDoor: {
        type: "Person",
        x: utils.withGrid(7),
        y: utils.withGrid(3),
        direction: "down",
        src: "/images/gameObjects/objects/lockerDoor.png",
        shadowImg: false,
        talking: [
          {      
            required: ["LOCKER_CLOSED","LOCKER_OCCUPIED"],    
            events: [
              { type: "removeStoryFlag", flag: "LOCKER_CLOSED" },
              { 
                type: "updateObject", 
                update: {
                  id: "LockerDoor",
                  spriteSrc: "/images/gameObjects/objects/crowbar.png"
                }
              },
            ]
          },
          {      
            required: ["LOCKER_OCCUPIED"],    
            events: [
              { type: "removeStoryFlag", flag: "LOCKER_OCCUPIED" },
              { 
                type: "updateObject", 
                update: {
                  id: "LockerDoor",
                  spriteSrc: "/images/gameObjects/shadows/noshadow.png"
                }
              },
              { type: "textMessage", name: "playerName", text: "Er meinte es wirklich ernst!" },
              { type: "textMessage", name: "playerName", text: "Ich weiß nicht, ob ich mich freuen oder mir Sorgen machen soll..." },
              { type: "textMessage", name: "playerName", text: "Damit werden sich die Kisten wohl öffnen lassen!" },
              { type: "removeStoryFlag", flag: "GOT_CROWBAR" },
            ]
          },
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["2,6","3,6","4,6","5,6","6,6","7,6","8,6","9,7","10,6","11,6","12,6",
      "13,5","13,4",
      "2,3","3,3","4,3","5,3","6,3","7,3","8,3","9,3","10,3","11,4","12,4",
      "1,4","1,5",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(9,6)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                direction: "left",
                face: "down"
              }
            ]
          }
        ]
      }]
    }
  },
  O2: {
    id: "O2",
    lowerSrc: "/images/maps/O2Lower.png",
    upperSrc: "/images/maps/O2Upper.png",
    minimapSrc: "/images/ui/minimaps/O2Minimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      maintenanceMonitor: {
        type: "Person",
        x: utils.withGrid(3),
        y: utils.withGrid(2),
        direction: "down",
        src: "/images/gameObjects/objects/monitor.png",
        shadowImg: false,
        talking: [
          {
            required: ["Q1_INTRO"],
            events: [
              { type: "effect", sound: "sounds/chat.wav" },
              { type: "textMessage", name: "playerName", text: "Wollen wir doch mal sehen, wo der Fehler liegt!" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000,
              },
              { type: "textMessage", name: "playerName", text: "Oh verdammt! Anscheinend haben wir ein Leck in der Außenwand!" },
              { type: "effect", sound: "sounds/alarm.wav"},
              { type: "textMessage", name: "Bordcomputer", text: "SAUERSTOFFKONZENTRATION: 70%, TENDENZ FALLEND." },
              { type: "textMessage", name: "playerName", text: "Mir wird langsam echt schwindlig..." },
              { type: "textMessage", name: "playerName", text: "Ich werde wohl meinen Raumanzug brauchen!" },
              { type: "removeStoryFlag", flag: "Q1_INTRO" },
              { type: "addStoryFlag", flag: "Q1_IN_PROGRESS" },
            ]
          },
          {
            required: ["PUT_ON_SUIT"],
            events: [
              { type: "textMessage", name: "playerName", text: "Besser füll ich vorher noch meinen Vorrat auf!" },
            ]
          },
          {
            required: ["Q1_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "playerName", text: "Mir wird langsam echt schwindlig..." },
              { type: "textMessage", name: "playerName", text: "Ich werde wohl meinen Raumanzug brauchen!" },
            ]
          }
        ]
      },
      oxygenContainer: {
        type: "Person",
        x: utils.withGrid(7),
        y: utils.withGrid(3),
        direction: "down",
        src: "/images/gameObjects/objects/oxygenContainer.png",
        shadowImg: false,
        talking: [
          {
            required: ["Q1_IN_PROGRESS", "PUT_ON_SUIT"],
            events: [
              { type: "textMessage", name: "playerName", text: "Aber wie lang reicht mir ein Vorrat?" },  
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q1" },
            ]
          },
          {
            required: ["O2_ENABLED"],
            events: [
              { type: "effect", sound: "sounds/chat.wav"},
              { type: "textMessage", name:"Füllstation", text: "Sauerstoff aufgefüllt.", resetTracker: true },
            ]
          }
        ]
      },
      spacesuit: {
        type: "Person",
        x: utils.withGrid(2),
        y: utils.withGrid(5),
        direction: "down",
        src: "/images/gameObjects/objects/spacesuit.png",
        shadowImg: false,
        talking: [
          {
            required: ["Q1_IN_PROGRESS"],
            events: [
              { 
                type: "updateObject",
                update: {
                  id: "hero",
                  spriteSrc: "/images/gameObjects/people/heroSpacesuit.png",
                }
              },
              { 
                type: "updateObject",
                update: {
                  id: "spacesuit",
                  hide: true,
                }
              },
              { type: "textMessage", name: "playerName", text: "Besser füll ich vorher noch meinen Vorrat auf!" },
              { type: "addStoryFlag", flag: "PUT_ON_SUIT" },
            ]
          }
        ]
      },
      O2Door: {
        type: "Person",
        x: utils.withGrid(1),
        y: utils.withGrid(4),
        direction: "left",
        src: "/images/gameObjects/objects/door.png",
        shadowImg: false,
        talking: [
          {
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "left",
                time: 1000,
              },
              { type: "textMessage", 
              text: "*Es scheint niemand zu antworten...*"},
            ]
          }
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["2,7","3,7","4,7","5,8","6,7","7,7","8,7",
      "9,3","9,4","9,5","9,6",
      "2,2","3,2","4,2","5,1","6,2","7,2","8,2",
      "1,3","1,4","1,5","1,6",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(5,2)]: [{
        scenarios: [
          {
            required: ["Q1_IN_PROGRESS", "PUT_ON_SUIT"],
            events: [
              { type: "textMessage", name: "playerName", text: "Ich sollte vorher besser meinen Sauerstoffvorrat auffüllen!" },
              { 
                type: "walk", 
                who: "hero",
                direction: "down",
              },

            ]
          },
          {
            required: ["Q1_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "playerName", text: "Ich muss zuerst noch meinen Raumanzug anziehen!" },
              { 
                type: "walk", 
                who: "hero",
                direction: "down",
              },

            ]
          },
          {
            required: ["Q1_COMPLETED"],
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(1),
                y: utils.withGrid(3),
                direction: "right",
                face: "up"
              },
              { type: "effect", sound: "sounds/alarm.wav"},
              { type: "textMessage", name: "Bordcomputer", text: "SYSTEMWARNUNG!! RAUMSCHIFF AUF KOLLISIONSKURS." },
              { type: "textMessage", name: "Bordcomputer", text: "AUFPRALL IN T-MINUS 20 MINUTEN." },
              { type: "toggleTimer" },
              { type: "textMessage", name: "playerName", text: "Das wird ja immer besser!" },
              { type: "textMessage", name: "playerName", text: "Ich muss mich beeilen!" },
              { type: "removeStoryFlag", flag: "Q1_COMPLETED"},
              { type: "addStoryFlag", flag: "Q2_INTRO" },
            ]
          },
          {
            events: [
              {
                type: "changeMap",
                map: "Westflügel",
                x: utils.withGrid(1),
                y: utils.withGrid(3),
                direction: "right",
                face: "up",
              },
            ]
          }
        ]
      }],
      [utils.asGridCoord(5,7)]: [{
        scenarios: [
          {
            required: ["Q1_IN_PROGRESS", "PUT_ON_SUIT"],
            events: [
              { type: "textMessage", name: "playerName", text: "Ich sollte vorher besser meinen Sauerstoffvorrat auffüllen!" },
              { 
                type: "walk", 
                who: "hero",
                direction: "up",
              }
            ]
          },
          {
            required: ["Q1_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "playerName", text: "Ich muss zuerst noch meinen Raumanzug anziehen!" },
              { 
                type: "walk", 
                who: "hero",
                direction: "up",
              }
            ]
          },
          {
            required: ["Q1_COMPLETED"],
            events: [
              {
                type: "changeMap",
                map: "Ostflügel",
                x: utils.withGrid(5),
                y: utils.withGrid(2),
                direction: "down",
                face: "down",
              },
              { type: "effect", sound: "sounds/alarm.wav"},
              { type: "textMessage", name: "Bordcomputer", text: "SYSTEMWARNUNG!! RAUMSCHIFF AUF KOLLISIONSKURS." },
              { type: "textMessage", name: "Bordcomputer", text: "AUFPRALL IN T-MINUS 20 MINUTEN." },
              { type: "toggleTimer" },
              { type: "textMessage", name: "playerName", text: "Das wird ja immer besser!" },
              { type: "textMessage", name: "playerName", text: "Ich muss mich beeilen!" },
              { type: "removeStoryFlag", flag: "Q1_COMPLETED"},
              { type: "addStoryFlag", flag: "Q2_INTRO" },
            ]
          },
          {
            events: [
              {
                type: "changeMap",
                map: "Ostflügel",
                x: utils.withGrid(5),
                y: utils.withGrid(2),
                direction: "down",
                face: "down",
              },
            ]
          }
        ]
      }]
    }
  },
  Krankenstation: {
    id: "Krankenstation",
    lowerSrc: "/images/maps/MedbayLower.png",
    upperSrc: "/images/maps/MedbayUpper.png",
    minimapSrc: "/images/ui/minimaps/MedbayMinimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      BellaMedic: {
        type: "Person",
        x: utils.withGrid(3),
        y: utils.withGrid(3),
        direction: "down",
        src: "/images/gameObjects/people/bellaMedic.png",
        shadowImg: true,
        requiredFlags: ["Q2_COMPLETED"],
        talking: [
          {
            required: ["Q2_COMPLETED"], 
            events: [
              { type: "removeStoryFlag", flag: "Q2_COMPLETED" },
              { type: "addStoryFlag", flag: "Q3_INTRO" },
              { type: "textMessage", name: "Bella", text: "Oh? Hallo!", faceHero: "BellaMedic" },
              { type: "textMessage", name: "Bella", text: "Was ist denn passiert?"},
              { type: "textMessage", name: "Bella", text: "Ich hab einen lauten Knall gehört!"},
              {
                type: "stand",
                who: "hero",
                direction: "left",
                time: 2000,
              },
              { type: "textMessage", name: "Bella", text: "Hm, verstehe..."},
              {
                type: "stand",
                who: "hero",
                direction: "left",
                time: 1000,
              },
              { type: "textMessage", name: "Bella", text: "Oh nein, wie schrecklich!" },
              { type: "textMessage", name: "Bella", text: "Bring mich bitte zu ihm!" },
              {
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(5),
                y: utils.withGrid(5),
                direction: "left",
                face: "left",
              }
            ]
          },
        ]
      },
    },
    walls: function() {
      let walls = {};
      ["2,10","3,10","4,10","5,10","6,10","7,10","8,10",
      "9,3","8,4","7,4","9,5","8,6","7,6","9,7","8,8","7,8","9,9",
      "2,2","3,2","4,2","5,1","6,2","7,2","8,2",
      "1,3","2,4","3,4","1,5","2,6","3,6","1,7","2,8","3,8","1,9",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(5,2)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "Korridor",
                x: utils.withGrid(5),
                y: utils.withGrid(12),
                direction: "left",
                face: "up",
              }
            ]
          }
        ]
      }]
    }
  },
  Maschinenraum: {
    id: "Maschinenraum",
    lowerSrc: "/images/maps/EngineLower.png",
    upperSrc: "/images/maps/EngineUpper.png",
    minimapSrc: "/images/ui/minimaps/EngineMinimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      maintenanceMonitor: {
        type: "Person",
        x: utils.withGrid(4),
        y: utils.withGrid(2),
        direction: "down",
        src: "/images/gameObjects/objects/monitor.png",
        shadowImg: false,
        talking: [
          {
            required: ["Q6_INTRO"],
            events: [
              { type: "textMessage", name: "playerName", text: "Dann schauen wir mal, was mit dem Motor nicht stimmt..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000,
              },
              { type: "textMessage", name: "playerName", text: "Oh, nicht gut... anscheinend ist er überhitzt." },
              { type: "textMessage", name: "playerName", text: "Ich werde das System neustarten und wieder korrekt hochfahren müssen!" },
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q6"},
              { type: "removeStoryFlag", flag: "Q6_INTRO" },
              { type: "addStoryFlag", flag: "Q6_IN_PROGRESS" },
            ]
          },
          {
            required: ["Q6_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "playerName", text: "Ich werde das System neustarten und wieder korrekt hochfahren müssen!" },
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q6"},
            ]
          },
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["2,27","3,27","4,27","5,27","6,27","7,26",
      "7,25","7,24","7,23","8,22","7,21","7,20",
      "7,19","7,18","7,17","7,16","7,15","7,14",
      "7,13","7,12","7,11","7,10","7,9","7,8",
      "7,7","7,6","7,5","7,4","7,3","6,2","5,2",
      "4,2","3,2","2,2","1,3","1,4","2,4","2,5",
      "3,4","3,5","4,4","4,5","5,4","5,5","1,7",
      "2,8","2,9","3,8","3,9","4,8","4,9","5,8",
      "5,9","1,10","1,11","2,12","2,13","3,12",
      "3,13","4,12","4,13","5,12","5,13","1,14",
      "1,15","2,16","2,17","3,16","3,17","4,16",
      "4,17","5,16","5,17","1,18","1,19","2,20",
      "2,21","3,20","3,21","4,20","4,21","5,20",
      "5,21","1,22","1,23","2,24","2,25","3,24",
      "3,25","4,24","4,25","5,24","5,25","1,26",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(7,22)]: [{
        scenarios: [
          {
            events: [
              
              {
                type: "changeMap",
                map: "Korridor",
                x: utils.withGrid(1),
                y: utils.withGrid(9),
                direction: "right",
                face: "right",
              }
            ]
          }
        ]
      }]
    }
  },
  Hangar: {
    id: "Hangar",
    lowerSrc: "/images/maps/CargoLower.png",
    upperSrc: "/images/maps/CargoUpper.png",
    minimapSrc: "/images/ui/minimaps/CargoMinimap.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(10),
        direction: "up",
      },
      CargoDoor: {
        type: "Person",
        x: utils.withGrid(3),
        y: utils.withGrid(5),
        direction: "up",
        src: "/images/gameObjects/objects/door.png",
        shadowImg: false,
        talking: [
          {
            required: ["Q5_INTRO"],
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000,
              },
              { type: "textMessage", name: "playerName", text: "Langsam ist das echt nicht mehr witzig!"},
              { type: "textMessage", name: "playerName", text: "Die Tür hat ein Zahlenschloss..."},
              { type: "textMessage", name: "playerName", text: "Wie war der Code noch gleich?"},
              { type: "textMessage", name: "playerName", text: "Zum Glück kann sich unser Lagarist Nick sowas nicht merken..."},
              { type: "textMessage", name: "playerName", text: "... er hat einen Zettel dafür!"},
              { type: "textMessage", name: "playerName", text: "Der muss doch hier irgendwo im Hangar sein!"},
              { type: "removeStoryFlag", flag: "Q5_INTRO"},
              { type: "addStoryFlag", flag: "Q5_IN_PROGRESS"},
            ]
          },
          {
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000,
              },
              { type: "textMessage", 
              text: "*Es scheint niemand zu antworten..."},
            ]
          }
        ]
      },
      Keypad: {
        type: "Person",
        x: utils.withGrid(4),
        y: utils.withGrid(5),
        direction: "right",
        src: "/images/gameObjects/objects/keypad.png",
        shadowImg: false,
        talking: [
          {
            required: ["Q5_IN_PROGRESS"],
            events: [
              { type: "openModal", fileRef: "QuestionModal", modalRef: "q5" } 
            ]
          }
        ]
      },
      Keycard: {
        type: "Person",
        x: utils.withGrid(2),
        y: utils.withGrid(3),
        direction: "down",
        src: "/images/gameObjects/objects/keycard.png",
        shadowImg: false,
        talking: [
          { 
            required: ["OPENED_CRATE"],
            events: [
              { type: "removeStoryFlag", flag: "OPENED_CRATE" },
              { type: "addStoryFlag", flag: "GOT_KEYCARD_ENGINE" },
              {
                type: "updateObject", 
                update: {
                  id: "Keycard",
                  spriteSrc: "/images/gameObjects/shadows/noshadow.png"
                }
              },
              { type: "textMessage", name: "playerName", text: "Da ist sie ja!"},
              { type: "textMessage", name: "playerName", text: "Ich darf keine Zeit verlieren..."},
              { type: "textMessage", name: "playerName", text: "Auf zum Maschinenraum!"},
            ]
          }
        ]
      },
      noteCrate: {
        type: "Person",
        x: utils.withGrid(11),
        y: utils.withGrid(7),
        direction: "down",
        src: "/images/gameObjects/objects/crateCover.png",
        shadowImg: false,
        talking: [
          {
            required: ["GOT_NOTE","OPENED_NOTE_CRATE"],
            events: [
              { type: "textMessage", name: "playerName", text: "Auf dem Zettel steht, ich muss..."},
              { type: "openModal", fileRef: "QuestionModal", modalRef: "sticky-note" }
            ]
          },
          {
            required: ["OPENED_NOTE_CRATE"],
            events: [
              { type: "addStoryFlag", flag: "GOT_NOTE" }, 
              { type: "textMessage", name: "playerName", text: "Aha! Hab ich's doch gewusst, dass der Zettel hier ist!"},
              { type: "textMessage", name: "playerName", text: "Na nu? Die Aufgaben sind ja super einfach!"},
              { type: "textMessage", name: "playerName", text: "Dafür sind die Kugeln also gedacht!"},
              { type: "textMessage", name: "playerName", text: "Falls Nick vergisst, wie man Wahrscheinlichkeiten berechnet..."},
              { type: "textMessage", name: "playerName", text: "...macht er damit wahrscheinlich seine Zufallsexperimente!"},
              { type: "textMessage", name: "playerName", text: "Zum Glück kann ich das im Kopf!"},
              { type: "textMessage", name: "playerName", text: "Hier steht, ich muss..."},
              { type: "openModal", fileRef: "QuestionModal", modalRef: "sticky-note" }
            ]
          },
          {
            required: ["GOT_CROWBAR"],
            events: [
              { 
                type: "updateObject", 
                update: {
                  id: "noteCrate",
                  spriteSrc: "/images/gameObjects/shadows/noshadow.png"
                }
              },
              { type: "addStoryFlag", flag: "OPENED_NOTE_CRATE" },
            ]
          },
          {
            required: ["Q5_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "playerName", text: "Argh! Sie lässt sich nicht öffnen!"},
              { type: "textMessage", name: "playerName", text: "Vielleicht weiß Yuri weiter!"},
              { type: "addStoryFlag", flag: "LOOKING_FOR_CROWBAR"},
            ]
          }
        ]
      },
      RedBallCrate: {
        type: "Person",
        x: utils.withGrid(4),
        y: utils.withGrid(10),
        direction: "down",
        src: "/images/gameObjects/objects/crateCover.png",
        shadowImg: false,
        talking: [
          {
            required: ["OPENED_RED_CRATE"],
            events: [
              { type: "textMessage", name: "playerName", text: "Rote Kugeln? Wofür braucht Nick rote Kugeln?"},
            ]
          },
          {
            required: ["GOT_CROWBAR"],
            events: [
              { 
                type: "updateObject", 
                update: {
                  id: "RedBallCrate",
                  spriteSrc: "/images/gameObjects/shadows/noshadow.png"
                }
              },
              { type: "addStoryFlag", flag: "OPENED_RED_CRATE" },
            ]
          },
          {
            required: ["Q5_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "playerName", text: "Argh! Sie lässt sich nicht öffnen!"},
              { type: "textMessage", name: "playerName", text: "Vielleicht weiß Yuri weiter!"},
              { type: "addStoryFlag", flag: "LOOKING_FOR_CROWBAR"},
            ]
          }
        ]
      },
      BlueBallCrate: {
        type: "Person",
        x: utils.withGrid(6),
        y: utils.withGrid(5),
        direction: "down",
        src: "/images/gameObjects/objects/crateCover.png",
        shadowImg: false,
        talking: [
          {
            required: ["OPENED_BLUE_CRATE"],
            events: [
              { type: "textMessage", name: "playerName", text: "Blaue Kugeln? Wofür braucht Nick blaue Kugeln?"},
            ]
          },
          {
            required: ["GOT_CROWBAR"],
            events: [
              { 
                type: "updateObject", 
                update: {
                  id: "BlueBallCrate",
                  spriteSrc: "/images/gameObjects/shadows/noshadow.png"
                }
              },
              { type: "addStoryFlag", flag: "OPENED_BLUE_CRATE" },
            ]
          },
          {
            required: ["Q5_IN_PROGRESS"],
            events: [
              { type: "textMessage", name: "playerName", text: "Argh! Sie lässt sich nicht öffnen!"},
              { type: "textMessage", name: "playerName", text: "Vielleicht weiß Yuri weiter!"},
              { type: "addStoryFlag", flag: "LOOKING_FOR_CROWBAR"},
            ]
          }
        ]
      },
    },
    cutsceneSpaces: {
      [utils.asGridCoord(13,15)]: [{
        scenarios: [
          {
            events: [
              { 
                type: "changeMap", 
                map: "Ecke",
                x: utils.withGrid(5),
                y: utils.withGrid(4),
                direction: "left",
                face: "down",
              }
            ]
          }
        ]
      }]
    },
    walls: function() {
      let walls = {};
      ["2,15","3,15","4,15","5,15","6,15","7,15","8,15","9,15","10,14","11,15","12,15","13,16","14,15","15,15",
      "16,14","16,13","16,12","16,9","16,8","16,7","16,6","16,5","16,4","16,3",
      "15,2","14,2","13,2","12,2","11,2","10,2","9,2","8,2","7,2","6,2","4,2","3,2",
      "2,3","2,4","2,5","1,6","1,7","1,8","1,9","1,10","1,11","1,12","1,13","1,14",
      "10,13","10,12","10,11","10,10","11,10","11,11","12,10","12,11","14,10","14,11","15,10","15,11",
      "5,3","5,4","6,5","5,5","4,5",
      "3,8","4,8","5,8","8,4","9,4","10,4","8,9","8,10","8,11","13,4","14,4","13,5","14,5","13,6","14,6",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
  },
}
