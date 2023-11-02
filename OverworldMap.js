class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; // Live objects are in here
    this.configObjects = config.configObjects; // Configuration content

    
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

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
    Object.keys(this.configObjects).forEach(key => {

      let object = this.configObjects[key];
      object.id = key;

      let instance;
      if (object.type === "Person") {
        instance = new Person(object);
      }
      /*if (object.type === "PizzaStone") {
        instance = new PizzaStone(object);
      }*/
      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
    })
  }

  async startCutscene(events) {
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
          return progress.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }
}

window.OverworldMaps = {
  CommandBridge: {
    id: "CommandBridge",
    lowerSrc: "/images/maps/CommandBridgeLower.png",
    upperSrc: "/images/maps/EmptyUpper.png",
    minimapSrc: "/images/maps/CommsLower.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(10),
        direction: "up",
      },
      kitchenNpcA: {
        type: "Person",
        x: utils.withGrid(9),
        y: utils.withGrid(5),
        direction: "up",
        src: "/images/characters/people/npc8.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "1", faceHero: "kitchenNpcA", sound: "/sounds/chat.wav"},
              { type: "toggleOxygenBar" },
              { type: "addStoryFlag", flag: "GOT_ITEM_1" }
            ]
          }
        ]
      }
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6,10)]: [
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
      ],
      [utils.asGridCoord(7,10)]: [
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
      ],
      [utils.asGridCoord(7,10)]: [{
        disqualify: ["SEEN_INTRO"],
        events: [
          { type: "textMessage", text: "1"},
          { type: "textMessage", text: "2"},
          { type: "textMessage", text: "3"},
          { type: "textMessage", text: "4"}
          /*{ type: "addStoryFlag", flag: "SEEN_INTRO"},
          { type: "textMessage", text: "SYSTEMWARNUNG!! MULTIPLE ÄUSSERE BESCHÄDIGUNGEN."},
          { type: "textMessage", text: "SAUERSTOFFKONZENTRATION: 95%, TENDENZ FALLEND."},
          { type: "textMessage", text: "DU: Oh je! Anscheinend sind wir mit einem Asteroiden kollidiert!"},
          { type: "textMessage", text: "Hätten wir bei der Berechnung des Kurses bloss nicht gerundet!"},
          { type: "textMessage", text: "Aber das ist erstmal Nebensache! Ich muss nach den anderen sehen!"},
          { type: "textMessage", text: "Ein System-Checkup in O2 sollte mir mehr verraten."},
          { type: "textMessage", text: "Don't even get me started on the mushrooms."},
          { type: "textMessage", text: "You will never make it in pizza!"}*/
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
        direction: "down",
        src: "/images/characters/people/doorRight.png",
        shadowImg: "/images/characters/noshadow.png",
        talking: [
          {
            events: [
              { type: "textMessage", 
              randomText: [
                "AEIOU, DU GEHOERST AUCH MIT DAZU!", 
                "Geranienauflauf", 
                "Lorem ipsum sit dolor amet"
              ], 
              sound: "/sounds/knocking.wav"},
            ]
          }
        ]
      }
    },
    walls: function() {
      let walls = {};
      ["2,6","3,6","4,6","5,6","6,7","7,7","8,6","9,6","10,6",
      "11,5","11,4","11,3","11,2","11,1",
      "10,0","9,0","8,0","7,1","7,2","6,2","5,1","4,2","3,2","2,2","1,3","1,4","1,5",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(5,2)]: [
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
      ],
      [utils.asGridCoord(6,6)]: [
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
      ],
      [utils.asGridCoord(7,6)]: [
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
      ],
      [utils.asGridCoord(8,1)]: [
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
      ],
      [utils.asGridCoord(9,1)]: [
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
      ],
      [utils.asGridCoord(10,1)]: [
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
      ],
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
      }
    },
    walls: function() {
      let walls = {};
      ["2,9","3,9","4,9","1,8","0,7","1,6","1,5","1,4","0,3","1,1","2,0","3,0","4,0","4,0","5,1","5,2","5,3","6,5","5,6","5,7","5,8",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(1,7)]: [
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
      ],
      [utils.asGridCoord(1,3)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "O2",
              x: utils.withGrid(7),
              y: utils.withGrid(10),
              direction: "up",
              face: "left",
            }
          ]
        }
      ],
      [utils.asGridCoord(5,5)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Quarters",
              x: utils.withGrid(8),
              y: utils.withGrid(6),
              direction: "up",
              face: "right",
            }
          ]
        }
      ],
      [utils.asGridCoord(2,8)]: [
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
      ],
      [utils.asGridCoord(3,8)]: [
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
      ],
      [utils.asGridCoord(4,8)]: [
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
      ],
      [utils.asGridCoord(2,1)]: [
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
      ],
      [utils.asGridCoord(3,1)]: [
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
      ],
      [utils.asGridCoord(4,1)]: [
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
      [utils.asGridCoord(2,5)]: [
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
      ],
      [utils.asGridCoord(3,5)]: [
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
      ],
      [utils.asGridCoord(4,5)]: [
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
      ],
      [utils.asGridCoord(1,2)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway3",
              x: utils.withGrid(4),
              y: utils.withGrid(15),
              direction: "up",
              face: "left",
            }
          ]
        }
      ],
      [utils.asGridCoord(1,3)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway3",
              x: utils.withGrid(3),
              y: utils.withGrid(15),
              direction: "up",
              face: "left",
            }
          ]
        }
      ],
      [utils.asGridCoord(1,4)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway3",
              x: utils.withGrid(2),
              y: utils.withGrid(15),
              direction: "up",
              face: "left",
            }
          ]
        }
      ]
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
      }
    },
    walls: function() {
      let walls = {};
      ["1,15","2,16","3,16","4,16","5,15",
      "5,14","5,13","5,12","5,11","5,10",
      "6,9","5,8","5,7","5,6","5,5","6,4",
      "6,3","5,2","4,2","3,2","2,2","1,2",
      "0,3","0,4","1,5","0,6","1,7","1,8",
      "0,9","1,10","1,11","0,12","0,13","1,14",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(2,15)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Corner",
              x: utils.withGrid(1),
              y: utils.withGrid(4),
              direction: "right",
              face: "down",
            }
          ]
        }
      ],
      [utils.asGridCoord(3,15)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Corner",
              x: utils.withGrid(1),
              y: utils.withGrid(3),
              direction: "right",
              face: "down",
            }
          ]
        }
      ],
      [utils.asGridCoord(4,15)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Corner",
              x: utils.withGrid(1),
              y: utils.withGrid(2),
              direction: "right",
              face: "down", 
            }
          ]
        }
      ],
      [utils.asGridCoord(1,9)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Comms",
              x: utils.withGrid(5),
              y: utils.withGrid(2),
              direction: "down",
              face: "left",
            }
          ]
        }
      ],
      [utils.asGridCoord(5,9)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Engine",
              x: utils.withGrid(7),
              y: utils.withGrid(22),
              direction: "left",
              face: "right",
            }
          ]
        }
      ],
      [utils.asGridCoord(1,6)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Medbay",
              x: utils.withGrid(7),
              y: utils.withGrid(22),
              direction: "left",
              face: "left",
            }
          ]
        }
      ],
      [utils.asGridCoord(1,12)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway4",
              x: utils.withGrid(3),
              y: utils.withGrid(8),
              direction: "up",
              face: "left",
            }
          ]
        }
      ],
      [utils.asGridCoord(1,13)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway4",
              x: utils.withGrid(2),
              y: utils.withGrid(8),
              direction: "up",
              face: "left",
            }
          ]
        }
      ]
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
      [utils.asGridCoord(2,8)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway3",
              x: utils.withGrid(1),
              y: utils.withGrid(13),
              direction: "right",
              face: "down",
            }
          ]
        }
      ],
      [utils.asGridCoord(3,8)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway3",
              x: utils.withGrid(1),
              y: utils.withGrid(12),
              direction: "right",
              face: "down",
            }
          ]
        }
      ],
      [utils.asGridCoord(1,4)]: [
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
      ],
      [utils.asGridCoord(2,1)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Cafeteria",
              x: utils.withGrid(1),
              y: utils.withGrid(6),
              direction: "right",
              face: "up",
            }
          ]
        }
      ],
      [utils.asGridCoord(3,1)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Cafeteria",
              x: utils.withGrid(1),
              y: utils.withGrid(7),
              direction: "right",
              face: "up",
            }
          ]
        }
      ]
    },
    walls: function() {
      let walls = {};
      ["2,9","3,9","4,8","4,7","4,6","4,5",
      "4,4","4,3","4,2","4,1","3,0","2,0",
      "1,1","1,2","1,3","0,4","1,5","1,6",
      "1,7","1,8",
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
      }
    },
    cutsceneSpaces: {
      [utils.asGridCoord(8,2)]: [
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
      ],
      [utils.asGridCoord(14,8)]: [
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
      ],
      [utils.asGridCoord(1,6)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway4",
              x: utils.withGrid(2),
              y: utils.withGrid(1),
              direction: "down",
              face: "left",
            }
          ]
        }
      ],
      [utils.asGridCoord(1,7)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway4",
              x: utils.withGrid(3),
              y: utils.withGrid(1),
              direction: "down",
              face: "left",
            }
          ]
        }
      ],
    },
    walls: function() {
      let walls = {};
      ["2,11","3,11","4,11","5,11","6,11","7,11",
      "8,11","9,11","10,11","11,11","12,11","13,11",
      "14,10","14,9","15,8","14,7","14,5","10,3",
      "9,2","8,1","6,2","5,3","5,4","4,4","3,4",
      "2,4","1,5","0,6","0,7","1,8","1,9","1,10",
      "3,9","4,9","5,9","3,6","4,6","5,6","8,6",
      "9,6","10,6","8,9","9,9","10,9","11,4",
      "12,4","13,4","12,6","13,6","7,3","7,4",
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
      }
    },
    walls: function() {
      let walls = {};
      ["1,8","2,8","3,8","4,8","5,8","6,8",
      "7,8","8,7","8,6","8,5","8,4","8,3",
      "7,2","6,2","5,1","4,2","3,2","2,2",
      "1,2","0,3","1,4","2,5","1,6","0,7",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(5,2)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway3",
              x: utils.withGrid(1),
              y: utils.withGrid(9),
              direction: "right",
              face: "up",
            }
          ]
        }
      ]
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
      ["1,6","2,6","3,6","4,6","5,6","6,6",
      "7,6","8,7","9,6","10,6","11,6","12,5",
      "12,4","12,3","1,2","2,2","3,2","4,2",
      "5,2","6,2","7,2","8,2","9,2","10,2",
      "11,2","0,3","0,4","0,5",
      ].forEach(coord => {
        let [x,y] = coord.split(",");
        walls[utils.asGridCoord(x,y)] = true;
      })
      return walls;
    }(),
    cutsceneSpaces: {
      [utils.asGridCoord(8,6)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway2",
              x: utils.withGrid(5),
              y: utils.withGrid(5),
              direction: "left"
            }
          ]
        }
      ]
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
      [utils.asGridCoord(7,22)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Hallway3",
              x: utils.withGrid(5),
              y: utils.withGrid(9),
              direction: "left",
              face: "right",
            }
          ]
        }
      ]
    }
  },
}
