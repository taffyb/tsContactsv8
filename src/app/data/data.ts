
export const Data={
  "nodes": [
    {"id":0,"uuid": "0af83728-31a5-4a58-aadd-0b1f6ef78626", 
     "type": "Organisation", "label":"Spatial Data Project", 
     "reflexive": false},
    {"id":1,"uuid": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2", 
     "type": "Person", "label":"Taffy, Brecknock", 
     "reflexive": false},
    {"id":2,"uuid": "6e2d7bf7-37bd-402b-9b4c-ec430532c424", 
     "type": "Person", "label":"Suzannah, Brecknock", 
     "reflexive": false},
    {"id":3,"uuid": "00a59297-e22a-4b68-99f8-40880fb6a660", 
     "type": "Event", "label":"CDL", 
     "reflexive": false},
    {"id":4,"uuid": "70ecf6c0-9530-4934-b940-07d3aa4eeb64", 
     "type": "Organisation", "label":"Royal Bank of Scotland", 
     "reflexive": false},
     {"id":5,"uuid": "664307e6-74e0-4526-a7c4-673ae4983693", 
         "type": "Person", "label":"John, Doe", 
         "reflexive": false}
  ], 
//    "nodes": [
//    {"uuid": "0af83728-31a5-4a58-aadd-0b1f6ef78626", 
//        "type": "Organisation", "label":"Spatial Data Project", 
//        "reflexive": false},
//       {"uuid":"3ccfd9ae-eecc-4886-ab6a-48507308a8b2", 
//        "type": "Person", "label":"Taffy, Brecknock", 
//        "reflexive": false},
//       {"uuid":"6e2d7bf7-37bd-402b-9b4c-ec430532c424", 
//        "type": "Person", "label":"Suzannah, Brecknock", 
//        "reflexive": false},
//       {"uuid":"00a59297-e22a-4b68-99f8-40880fb6a660", 
//        "type": "Event", "label":"CDL", 
//        "reflexive": false},
//       {"uuid":"70ecf6c0-9530-4934-b940-07d3aa4eeb64", 
//        "type": "Organisation", "label":"Royal Bank of Scotland", 
//        "reflexive": false},
//        {"uuid":"664307e6-74e0-4526-a7c4-673ae4983693", 
//            "type": "Person", "label":"John, Doe", 
//            "reflexive": false}
//     ],
  "links": [
    {"source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2", 
     "target": "6e2d7bf7-37bd-402b-9b4c-ec430532c424", 
     "label":"MARRIED_TO","value": 1,
     "left":true,"right":false},
    {"source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2", 
     "target": "0af83728-31a5-4a58-aadd-0b1f6ef78626", 
     "label":"WORKS_FOR","value": 1,
     "left":true,"right":false},
    {"source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2", 
     "target": "00a59297-e22a-4b68-99f8-40880fb6a660", 
     "label":"ATTENDED","value": 1,
     "left":true,"right":false},
    {"source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2", 
     "target": "70ecf6c0-9530-4934-b940-07d3aa4eeb64", 
     "label":"BANKS_WITH","value": 1,
     "left":true,"right":false},
    {"source": "6e2d7bf7-37bd-402b-9b4c-ec430532c424", 
     "target": "70ecf6c0-9530-4934-b940-07d3aa4eeb64", 
     "label":"BANKS_WITH","value": 1,
     "left":true,"right":false},
    {"source": "6e2d7bf7-37bd-402b-9b4c-ec430532c424", 
     "target": "0af83728-31a5-4a58-aadd-0b1f6ef78626", 
     "label":"WORKS_FOR","value": 1,
     "left":true,"right":false}
  ]
}