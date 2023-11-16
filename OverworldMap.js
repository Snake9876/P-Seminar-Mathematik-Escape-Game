class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; // Live objects are in here
    this.configObjects = config.configObjects; // Configuration content

    
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

      let object = this.configObjects[key];
      object.id = key;
      let hide = this.configObjects[key].hide || false;

      if((this.configObjects[key].requiredFlags || []).every(sf => {
        return this.overworld.progress.storyFlags[sf]
      }) && hide == false) {

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
    this.playerName = this.overworld.progress.playerName;
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
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
  CommandBridge: {
    id: "CommandBridge",
    lowerSrc: "/images/maps/CommandBridgeLower.png",
    upperSrc: "/images/maps/CommandBridgeUpper.png",
    minimapSrc: "/images/icons/lung.png",
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
        src: "/images/characters/people/gameObjects.png",
        shadowImg: "images/characters/noshadow.png",
        talking: [
          {
            required: ["Q7_INTRO"],
            events: [
              { type: "textMessage", name: "", text: "Es scheint nichts zu passieren*"},
              /*Aufgabe-7:

              { type: "openModal", fileRef: "questionModal", modalRef: "q7"},
              Graph interpolieren --> Punkte sind gegeben, muss zusätzlich einige Eigenschaften aufweisen!

              On complete:

              Berg entfernen? 
              Set-Timer -3min
              Dismount spirte
              { type: "textMessage", name: this.playerName, text: "Oh nein, das war der falsche Berg!" },
              */
            ]
          },
          {
            events: [
              { type: "toggleOxygenBar" },
              { type: "textMessage", name: "", text: "Es scheint nichts zu passieren*"},
            ]
          }
        ]
      },
      controlsRight: {
        type: "Person",
        x: utils.withGrid(7),
        y: utils.withGrid(4),
        direction: "right",
        src: "/images/characters/people/gameObjects.png",
        shadowImg: "images/characters/noshadow.png",
        talking: [
          {
            required: ["Q7_INTRO"],
            events: [
              { type: "textMessage", name: "", text: "Es scheint nichts zu passieren*"},
            ]
          },
          {
            events: [
              { type: "toggleTimer" },
              { type: "textMessage", name: "", text: "Es scheint nichts zu passieren*"},
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
                map: "Hallway1",
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
                map: "Hallway1",
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
                map: "Hallway1",
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
                map: "Hallway1",
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
  Hallway1: {
    id: "Hallway1",
    lowerSrc: "/images/maps/Hallway1Lower.png",
    upperSrc: "/images/maps/Hallway1Upper.png",
    minimapSrc: "/images/maps/Hallway3Lower.png",
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
        src: "/images/characters/people/door.png",
        shadowImg: "/images/characters/noshadow.png",
        talking: [
          {
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "right",
                time: 1000,
              },
              { type: "textMessage", name: "???",
              randomText: [
                "AEIOU, DU GEHOERST AUCH MIT DAZU!", 
                "Geranienauflauf", 
                "Lorem ipsum sit dolor amet"
              ]},
            ]
          }
        ]
      },
      CargoDoor: {
        type: "Person",
        x: utils.withGrid(1),
        y: utils.withGrid(4),
        direction: "left",
        src: "/images/characters/people/door.png",
        shadowImg: "/images/characters/noshadow.png",
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
              text: "*Es scheint niemand zu antworten..."},
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
          }
        ]
      }],
      [utils.asGridCoord(6,6)]: [{
        scenarios: [
          {
            events: [
              {
                type: "changeMap",
                map: "CommandBridge",
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
                map: "CommandBridge",
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
                map: "Hallway2",
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
                map: "Hallway2",
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
                map: "Hallway2",
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
  Hallway2: {
    id: "Hallway2",
    lowerSrc: "/images/maps/Hallway2Lower.png",
    upperSrc: "/images/maps/Hallway2Upper.png",
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
        src: "/images/characters/people/door.png",
        shadowImg: "/images/characters/noshadow.png",
        hide: false,
        talking: [
          {
            required: ["Q5_INTRO"],
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              { type: "textMessage", name: this.playerName, text: "Natürlich ist diese Tür auch verschlossen."},
              { type: "textMessage", name: this.playerName, text: "Was auch sonst?"},
              { type: "textMessage", name: this.playerName, text: "Deshalb hab ich um Schlüsselkarten für alle gebeten."},
              { type: "textMessage", name: this.playerName, text: "Aber auf mich hört ja niemand!" },
              { type: "textMessage", name: this.playerName, text: "Wahrscheinlich hat Han sie wie immer im Frachtraum liegen lassen!" },
              { type: "addStoryFlag", flag: "Q5_IN_PROGRESS" },
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
              { type: "textMessage", name: this.playerName, text: "*Es scheint niemand zu antworten...*"}
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
            required: ["Q2_INTRO"],
            events: [
              { 
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(8),
                y: utils.withGrid(2),
                direction: "down",
                face: "left",
              },
              { 
                type: "walk", 
                who: "hero",
                direction: "up",
              },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500,
              },
              { type: "textMessage", name: this.playerName, text: "Oh nein! Was ist denn hier passiert?!" },
              { type: "textMessage", name: this.playerName, text: "Yuri! Bist du hier? Kannst du mich hören?" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500,
              },
              { type: "textMessage", name: "Yuri", text: "Hilf mir... ich bin unter... größtem Berg..." },
              { type: "textMessage", name: this.playerName, text: "Die Zeit reicht nicht aus, jeden Berg wegzuräumen." },
              { type: "textMessage", name: this.playerName, text: "Ich muss herausfinden, welcher der Größte ist!" },
              { type: "textMessage", name: this.playerName, text: "Aber warte, die Berge sehen doch fast wie Kegel aus!" },
              { type: "textMessage", name: this.playerName, text: "Ich brauche dafür nur einen Meterstab!" },
              { type: "textMessage", name: this.playerName, text: "Hatte ihn nicht ... zuletzt benutzt?" },

            ]
          },
          {
            required: ["GOT_METERSTICK"],
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
                map: "Quarters",
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
                map: "Hallway1",
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
                map: "Hallway1",
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
                map: "Hallway1",
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
                map: "Corner",
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
                map: "Corner",
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
                map: "Corner",
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
  Corner: {
    id: "Corner",
    lowerSrc: "/images/maps/CornerLower.png",
    upperSrc: "/images/maps/CornerUpper.png",
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
                map: "Hallway2",
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
                map: "Hallway2",
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
                  map: "Hallway2",
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
                map: "Hallway3",
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
                map: "Hallway3",
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
                map: "Hallway3",
                x: utils.withGrid(4),
                y: utils.withGrid(1),
                direction: "down",
                face: "left",
              }
            ]
          }
        ]      
      }]
    }
  },
  Hallway3: {
    id: "Hallway3",
    lowerSrc: "/images/maps/Hallway3Lower.png",
    upperSrc: "/images/maps/Hallway3Upper.png",
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
        src: "/images/characters/people/door.png",
        shadowImg: "/images/characters/noshadow.png",
        hide: false,
        talking: [
          {
            required: ["Q2_INTRO"],
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "right",
                time: 1000,
              },
              { type: "textMessage", text: "Wo ist unser Ingenieur Yuri, wenn man ihn braucht?" },
              { type: "textMessage", text: "Wollte er sich nicht gerade einen Kaffee holen?" },
            ]
          },
          {
            required: ["Q1_COMPLETED"],
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              {
                type: "stand",
                who: "hero",
                direction: "right",
                time: 1000,
              },
              { type: "textMessage", name: this.playerName, text: "Verdammt, sie klemmt!" },
              { type: "textMessage", name: this.playerName, text: "Dass das gerade jetzt passieren muss!" },
              { type: "textMessage", text: "Wo ist unser Ingenieur Yuri, wenn man ihn braucht?" },
              { type: "textMessage", text: "Wollte er sich nicht gerade einen Kaffee holen?" },
              { type: "addStoryFlag", flag: "Q2_INTRO" }
            ]
          },
          {
            events: [
              { type: "effect", sound: "sounds/knocking.wav"},
              /*{
                type: "stand",
                who: "hero",
                direction: "right",
                time: 1000,
              },
              { type: "textMessage", name: "", text: "*Es scheint niemand zu antworten...*" },*/
              { 
                type: "updateObject", 
                update: {
                  id: "EngineDoor",
                  hide: true,
                }
              }
            ]
          },
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["1,16","2,17","3,17","4,17","5,16",
      "5,15","5,14","5,13","6,12","5,11","5,10","5,9","6,8","5,7","5,6","5,5","6,4","6,3","5,2","5,1",
      "2,0","3,0","4,0",
      "1,15","1,14","1,13","1,12","1,11","1,10","0,9","1,8","1,7","1,6","1,5","1,4","1,3","1,2","1,1",
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
                map: "Corner",
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
                map: "Corner",
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
                map: "Corner",
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
            required: ["Q4_INTRO"],
            events: [
              {
                type: "changeMap",
                map: "Comms",
                x: utils.withGrid(6),
                y: utils.withGrid(2),
                direction: "down",
                face: "right",
              },
              {
                type: "stand",
                who: "hero",
                direction: "down",
                time: 500,
              },
              { type: "textMessage", name: this.playerName, text: "Na toll! Ich bin also wieder auf mich allein gestellt."},
              { type: "textMessage", name: this.playerName, text: "Na gut, ich werde das schon hinkriegen!"},
            ]
          },
          {
            events: [
              {
                type: "changeMap",
                map: "Comms",
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
                map: "Engine",
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
                map: "Medbay",
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
                map: "Hallway4",
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
                map: "Hallway4",
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
  Hallway4: {
    id: "Hallway4",
    lowerSrc: "/images/maps/Hallway4Lower.png",
    upperSrc: "/images/maps/Hallway4Upper.png",
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
                map: "Hallway3",
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
                map: "Hallway3",
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
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(8),
      },
      berg1: {
        type: "Person",
        x: utils.withGrid(2),
        y: utils.withGrid(3),
        direction: "down",
        src: "/images/characters/people/gameObjects.png",
        shadowImg: "/images/characters/noshadow.png",
        talking: [
          {
            required: ["GOT_METERSTICK"],
            events: [
              { type: "textMessage", name: this.playerName,
                text: "Der Durchmesser der Grundfläche ist m..."
              },
              { type: "textMessage", name: this.playerName,
                text: "...und der Berg ist m hoch."
              },
              /*Aufgabe-2:

              { type: "openModal", fileRef: "questionModal", modalRef: "q2"} --> should reference object 1,

              On complete:

              Berg entfernen? 
              Set-Timer -3min
              Dismount spirte
              { type: "textMessage", name: this.playerName, text: "Oh nein, das war der falsche Berg!" },
              */
            ]
          }
        ]
      },
      berg2: {
        type: "Person",
        x: utils.withGrid(2),
        y: utils.withGrid(3),
        direction: "down",
        src: "/images/characters/people/gameObjects.png",
        shadowImg: "/images/characters/noshadow.png",
        talking: [
          {
            required: ["GOT_METERSTICK"],
            events: [
              { type: "textMessage", name: this.playerName,
                text: "Der Durchmesser der Grundfläche ist m..."
              },
              { type: "textMessage", name: this.playerName,
                text: "...und der Berg ist m hoch."
              },
              /*Aufgabe-2:

              { type: "openModal", fileRef: "questionModal", modalRef: "q2"} --> should reference object 2,

              On complete:

              Berg entfernen? 
              Dismount spirte
              //Change spirte to Yuri
              //{ type: "addStoryFlag", flag: "Q2_COMPLETED" },
              //{ type: "textMessage", name: this.playerName, text: "Oh nein, Yuri!"},
              //{ type: "textMessage", name: this.playerName, text: "Er ist ohnmächtig und seine Vitalwerte sind miserabel!"},
              //{ type: "textMessage", name: this.playerName, text: "Noch ist er am Leben,..."},
              //{ type: "textMessage", name: this.playerName, text: "...aber er muss dringend zur Krankenstation gebracht werden!"},
              //{ type: "textMessage", name: this.playerName, text: "Ich muss Krankenschwester Bella finden!"},  */           
            ]
          }
        ], 
      },
      BellaMedic: {
        type: "Person",
        x: utils.withGrid(3),
        y: utils.withGrid(3),
        direction: "down",
        src: "/images/characters/people/bellaMedic.png",
        requiredFlags: ["Q4_INTRO"],
        talking: [
          {
            required: ["Q4_COMPLETED"],
            events: [
              { type: "textMessage", name: "Bella", text: "Hallo " + this.playerName + "!" },
              { type: "textMessage", name: "Bella", text: "Hast du den Notruf abgesetzt?" },
              { type: "textMessage", name: this.playerName, text: "Hallo Bella! Es kam etwas dazwischen, aber ja." },
              { type: "textMessage", name: this.playerName, text: "Kann ich jetzt mit Yuri sprechen?" },
              { type: "textMessage", name: "Yuri", text: "Ob du das kannst, weiß ich nicht..." },
              { type: "textMessage", name: "Yuri", text: "...aber du darfst." },
              { type: "textMessage", name: this.playerName, text: "Gott sei Dank, geht's dir gut!" },
              { type: "textMessage", name: "Yuri", text: "So leicht lass ich mich nicht unterkriegen!" },
              { type: "textMessage", name: this.playerName, text: "Ha! Ein guter Witz nach dem anderen!" },
              { type: "textMessage", name: "Yuri", text: "Hey! ...Touché..." },
              { type: "textMessage", name: "Yuri", text: "Was ist überhaupt los?" },
              { type: "textMessage", name: this.playerName, text: "Durch die Kollision ist wohl die Steuerung ausgefallen..." },
              { type: "textMessage", name: this.playerName, text: "...und nun klemmt die Tür zum..." },
              { type: "textMessage", name: "Yuri", text: "BITTE WAS?!" },
              { type: "textMessage", name: "Yuri", text: "Und was machen wir dann noch hier?" },
              { type: "textMessage", name: "Yuri", text: "Wir könnten jeden Moment wieder mit etwas zusammenstoßen!" },
              { type: "textMessage", name: this.playerName, text: "Das ist es ja, wir befinden uns bereits auf Kollisionskurs..." },
              { type: "textMessage", name: "Yuri", text: "BITTE WAS?!!!" },
              { type: "textMessage", name: "Yuri", text: "Wir dürfen keine Zeit verlieee..." },
              { type: "textMessage", name: "Bella", text: "Yuri! Dein Bein ist doch gebrochen!" },
              { type: "textMessage", name: "Yuri", text: "Verdammt! Du muss wohl hier bleiben." },
              { type: "textMessage", name: "Yuri", text: "Du sagtest du Tür klemmt? Neben meinem Bett liegt eine Brechstange." },
              { type: "textMessage", name: "Yuri", text: "Damit sollte es klappen" },
              { type: "textMessage", name: this.playerName, text: "Warte, wieso...?" },
              { type: "textMessage", name: "Yuri", text: "Man kann nie wissen..." },
              { type: "textMessage", name: this.playerName, text: "Aber...?" },
              { type: "textMessage", name: "Yuri", text: "KLEMMT JETZT DIE VERDAMMTE TÜR, ODER NICHT?!" },
              { type: "textMessage", name: this.playerName, text: "Ich bin schon auf dem Weg!" },
              { type: "addStoryFlag", flag: "Q5_INTRO" }
            ]
          }, 
          {
            required: ["Q5_INTRO"],
            events: [
              { type: "textMessage", name: "Yuri", text: "Was stehst du hier noch rum? Geh schon!" },
            ]
          }, 
          {
            events: [
              { type: "textMessage", name: "Bella", text: "Am besten setzt du einen Notruf ab!" },
            ]
          },
        ]
      },
      Book: {
        type: "Person",
        x: utils.withGrid(12),
        y: utils.withGrid(3),
        direction: "left",
        src: "/images/characters/people/gameObjects.png",
        shadowImg: "/images/characters/noshadow.png",
        talking: [
          {
            events: [
              {
                type: "updateObject",
                update: {
                  id: "Book",
                  hide: true,
                }
              }, 
              { addStoryFlag: "", flag: "GOT_TEXTBOOK" }
            ]
          },
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
                map: "Hallway2",
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
                map: "Hallway1",
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
                map: "Hallway4",
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
                map: "Hallway4",
                x: utils.withGrid(9),
                y: utils.withGrid(4),
                direction: "left",
                face: "left",
              }
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
      "11,3","13,3","12,6","13,6","7,3","7,4",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
  },
  Comms: {
    id: "Comms",
    lowerSrc: "/images/maps/CommsLower.png",
    upperSrc: "/images/maps/CommsUpper.png",
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
        y: utils.withGrid(9),
        direction: "down",
        src: "/images/characters/people/door.png",
        shadowImg: "/images/characters/noshadow.png",
        talking: [
          {      
            required: ["GOT_TEXTBOOK", "Q4_IN_PROGRESS"],    
            events: [
              { type: "textMessage", name: this.playerName, text: "Ich muss also eine Gegenfunktion aufstellen, um ein reines Signal zu erhalten!" },
              { type: "effect", sound: "sounds/chat.wav" },
              /*Aufgabe-4:

              { type: "openModal", fileRef: "questionModal", modalRef: "q4" },

              On complete:

              { type:"addStoryFlag", flag: "Q4_COMPLETE" },
              { type:"removeStoryFlag", flag "Q4_IN_PROGRESS" },
              { type: "textMessage", name: this.playerName, text: "Ok, wir haben wieder ein Signal!" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000
              },
              { type: "textMessage", name: this.playerName, text: "Der Notruf ist abgesetzt." },
              { type: "textMessage", name: this.playerName, text: "Mal sehen, ob Yuri schon wach ist." },
              */
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
              { type: "textMessage", name: this.playerName, text: "Mist! Auch das noch!" },
              { type: "textMessage", name: this.playerName, text: "Anscheinend wurde unsere Antenne in der Kollision beschädigt." },
              { type: "textMessage", name: this.playerName, text: "Wenigstens nimmt sie noch Signale auf..." },
              { type: "textMessage", name: this.playerName, text: "...sie scheinen verzerrt zu sein!" },
              { type: "textMessage", name: this.playerName, text: "Vielleicht kann ich sie reparieren!" },
              { type: "textMessage", name: this.playerName, text: "Irgendwas muss mir hier doch weiterhelfen können!" },
            ]
          }
        ]
      },
      Bookshelf: {
        type: "Person",
        x: utils.withGrid(5),
        y: utils.withGrid(9),
        direction: "down",
        src: "/images/characters/people/door.png",
        shadowImg: "/images/characters/noshadow.png",
        talking: [
          {   
            required: ["GOT_TEXTBOOK"],
            events: [
              { type: "Textmessage", name: this.playerName, text: "In dem Buch steht..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000
              },
              { type: "Textmessage", name: this.playerName, text: "... das Störsignal mit einer Gegenfunktion destruktiv interferieren..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "...gleiche Frequenz..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "...gleiche Verschiebung in x- und y-Richtung..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "...umgekehrte Amplitude..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "Damit sollte es gehen!" },
            ]
          },
          {      
            required: ["Q4_IN_PROGRESS"],
            events: [
              { type: "Textmessage", name: this.playerName, text: "Hm, wo haben wir es denn?" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "Einführung in elektrische Schaltkreise..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "Einführung in elektrische Schaltkreise..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "50 Rezepte für die Weihnachtszeit..." },
              { type: "Textmessage", name: this.playerName, text: "Warum steht das hier?" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "Aha! Signaltheorie!" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000
              },
              { type: "Textmessage", name: this.playerName, text: "... das Störsignal mit einer Gegenfunktion destruktiv interferieren..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "...gleiche Frequenz..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "...gleiche Verschiebung in x- und y-Richtung..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "...umgekehrte Amplitude..." },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 500
              },
              { type: "Textmessage", name: this.playerName, text: "Damit sollte es gehen!" },
              { type: "addStoryFlag", flag: "GOT_TEXTBOOK" },
              { type:"addStoryFlag", flag: "Q4_IN_PROGRESS" },
            ]
          }
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["2,8","3,8","4,8","5,8","6,8","7,8","8,8",
      "9,3","9,4","9,5","9,6","9,7",
      "2,2","3,2","4,2","5,2","6,1","7,2","8,2",
      "1,3","2,4","3,5","2,6","1,7",
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
                map: "Hallway3",
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
  Quarters: {
    id: "Quarters",
    lowerSrc: "/images/maps/QuartersLower.png",
    upperSrc: "/images/maps/QuartersUpper.png",
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
      ["2,6","3,6","4,6","5,6","6,6","7,6","8,6","9,7","10,6","11,6","12,6",
      "13,5","13,4","13,3",
      "2,2","3,2","4,2","5,2","6,2","7,2","8,2","9,2","10,2","11,2","12,2",
      "1,3","1,4","1,5",
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
                map: "Hallway2",
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
        direction: "up",
        src: "/images/characters/people/gameObjects.png",
        talking: [
          {
            required: ["Q1_INTRO"],
            events: [
              { type: "effect", sound: "sounds/chat.wav" },
              { type: "textMessage", name: this.playerName, text: "Wollen wir doch mal sehen, wo der Fehler liegt!" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000,
              },
              { type: "textMessage", name: this.playerName, text: "Oh verdammt! Anscheinend haben wir ein Leck in der Außenwand!" },
              { type: "effect", sound: "sounds/alarm.wav"},
              { type: "textMessage", name: "Bordcomputer", text: "SAUERSTOFFKONZENTRATION: 70%, TENDENZ FALLEND." },
              { type: "textMessage", name: this.playerName, text: "Mir wird langsam echt schwindlig..." },
              { type: "textMessage", name: this.playerName, text: "Ich werde wohl meinen Raumanzug brauchen!" },
              { type: "textMessage", name: this.playerName, text: "Besser füll ich vorher meinen Vorrat noch auf!" },

              //Marker-Event { type: "marker", x:, y: },

              { type: "removeStoryFlag", flag: "Q1_INTRO" },
              { type: "addStoryFlag", flag: "Q1_IN_PROGRESS" },
            ]
          },
        ]
      },
      oxygenRefill: {
        type: "Person",
        x: utils.withGrid(7),
        y: utils.withGrid(3),
        direction: "up",
        src: "/images/characters/people/gameObjects.png",
        talking: [
          {
            required: ["Q1_IN_PROGRESS"],
            events: [
              { type: "textMessage", text: "Aber wie lang reicht mir ein Vorrat?" },  
              { type: "openModal", fileRef: "questionModal", modalRef: "q1" },
            ]
          },
          {
            required: ["Q1_COMPLETED"],
            events: [
              { type: "textMessage", name:"Füllstation", text: "Sauerstoff aufgefüllt.", resetTracker: true },
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
            required: ["Q1_IN_PROGRESS"],
            events: [
              { type: "textMessage", text: "Ich sollte vorher besser meinen Sauerstoffvorrat auffüllen!" },
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
                map: "Hallway2",
                x: utils.withGrid(1),
                y: utils.withGrid(3),
                direction: "right",
                face: "up",
              },
              { type: "effect", sound: "sounds/alarm.wav"},
              { type: "textMessage", name: "Bordcomputer", text: "SYSTEMWARNUNG!! RAUMSCHIFF AUF KOLLISIONSKURS." },
              { type: "textMessage", name: "Bordcomputer", text: "AUFPRALL IN T-MINUS ... MINUTEN." },
              { type: "textMessage", name: this.playerName, text: "Auch das noch!" },
              { type: "textMessage", name: this.playerName, text: "Dann eben zum Maschinenraum!" },   
              { type: "removeStoryFlag", flag: "Q1_COMPLETED" }
            ]
          },
          {
            events: [
              {
                type: "changeMap",
                map: "Hallway2",
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
            required: ["Q1_IN_PROGRESS"],
            events: [
              { type: "textMessage", text: "Ich sollte vorher besser meinen Sauerstoffvorrat auffüllen!" },
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
                map: "Hallway4",
                x: utils.withGrid(5),
                y: utils.withGrid(2),
                direction: "down",
                face: "down",
              },
              { type: "effect", sound: "sounds/alarm.wav"},
              { type: "textMessage", name: "Bordcomputer", text: "SYSTEMWARNUNG!! RAUMSCHIFF AUF KOLLISIONSKURS." },
              { type: "textMessage", name: this.playerName, text: "Auch das noch!" },
              { type: "textMessage", name: this.playerName, text: "Dann eben zum Maschinenraum!" },   
              { type: "removeStoryFlag", flag: "Q1_COMPLETED" }
            ]
          },
          {
            events: [
              {
                type: "changeMap",
                map: "Hallway4",
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
  Medbay: {
    id: "Medbay",
    lowerSrc: "/images/maps/MedbayLower.png",
    upperSrc: "/images/maps/MedbayUpper.png",
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
        src: "/images/characters/people/bellaMedic.png",
        talking: [
          {
            required: ["Q2_COMPLETED"],
            events: [
              { type: "textMessage", name: "Bella", text: "Oh? Hallo " + this.playerName + " !" },
              { type: "textMessage", name: "Bella", text: "Was ist denn passiert?"},
              { type: "textMessage", name: "Bella", text: "Ich hab eine Explosion gehört!"},
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 2000,
              },
              { type: "textMessage", name: "Bella", text: "Hm, verstehe..."},
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 2000,
              },
              { type: "textMessage", name: "Bella", text: "Oh nein, wie schrecklich!" },
              { type: "textMessage", name: "Bella", text: "Bring mich bitte zu ihm!" },
              {
                type: "stand",
                who: "hero",
                direction: "up",
                time: 1000,
              },
              { type: "addStoryFlag", flag: "TALKED_TO_MEDIC" },
              {
                type: "changeMap",
                map: "Cafeteria",
                x: utils.withGrid(1),
                y: utils.withGrid(6),
                direction: "right",
                face: "up",
              },
              { 
                type: "stand",
                who: "hero",
                direction: "left",
                time: 1000,
              },
              { type: "textMessage", name: "Bella", text: "" },
              { type: "textMessage", name: this.playerName, text: "Kann ich dir irgendwie helfen?" },
              { type: "textMessage", name: "Bella", text: "Ja, du kannst ..." },
              /*Aufgabe-3:
              
              { type: "openModal", fileRef: "questionModal", modalRef: "q3"}

              On complete:

              { type: "textMessage", name: "Bella", text: "So, das wird ihn eine Zeit lang stabilisieren." },
              { type: "textMessage", name: "Bella", text: "Aber eine Dauerlösung ist das nicht!" },
              { type: "textMessage", name: this.playerName, text: "Kann ich denn schon mit ihm sprechen?" },
              { type: "textMessage", name: "Bella", text: "Noch ist er bewusstlos..." },
              { type: "textMessage", name: "Bella", text: "Setze in der Zwischenzeit einen Notruf ab!" },
              { type: "textMessage", name: this.playerName, text: "Gute Idee! Ich beeile mich!" },
              { type: "addStoryFlag", flag: "Q4_INTRO" },

              */
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
                map: "Hallway3",
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
  Engine: {
    id: "Engine",
    lowerSrc: "/images/maps/EngineLower.png",
    upperSrc: "/images/maps/EngineUpper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10),
      },
      maintenanceMonitor: {
        type: "Person",
        x: utils.withGrid(9),
        y: utils.withGrid(5),
        direction: "up",
        src: "/images/characters/people/gameObjects.png",
        talking: [
          {
            required: ["Q6_INTRO"],
            events: [
              /*Aufgabe-6:

              { type: "openModal", fileRef: "questionModal", modalRef: "q6"},

              On complete:

              { type: "effect", visual: "rumble", toggle: "true" },
              { type: "textMessage", name:"Bordcomputer", text: "SYSTEMWARNUNG!! EINTRITT IN ASTEROIDENGÜRTEL."},
              { type: "textMessage", name:"Bordcomputer", text: "BERECHNUNG EINES NEUEN KURSES ERFORDERLICH."},
              { type: "textMessage", name: this.playerName, text: "Jetzt muss es schnell gehen!"},
              { type: "textMessage", name: this.playerName, text: "Zurück zur Steuereinheit!"},
              { type: "addStoryFlag", flag: "Q7_INTRO" }

              */
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
                map: "Hallway3",
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
  Cargo: {
    id: "Cargo",
    lowerSrc: "/images/maps/CargoLower.png",
    upperSrc: "/images/maps/CargoUpper.png",
    minimapSrc: "/images/icons/lung.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(10),
        direction: "up",
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
                map: "Hallway1",
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
                map: "Hallway1",
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
                map: "Hallway1",
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
                map: "Hallway1",
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
      ["1,3","2,4","3,4","4,5","5,4","6,4","7,4","8,4","9,5",
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
}
