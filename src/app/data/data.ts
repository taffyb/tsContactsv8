
export const Data={
  "nodes": [
    {"uuid": "0af83728-31a5-4a58-aadd-0b1f6ef78626", 
     "type": "Organisation", "label":"Spatial Data Project", 
     "reflexive": false},
    {"uuid": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2", 
     "type": "Person", "label":"Taffy, Brecknock", 
     "reflexive": false},
    {"uuid": "6e2d7bf7-37bd-402b-9b4c-ec430532c424", 
     "type": "Person", "label":"Suzannah, Brecknock", 
     "reflexive": false},
    {"uuid": "00a59297-e22a-4b68-99f8-40880fb6a660", 
     "type": "Event", "label":"Connected Data London", 
     "reflexive": false},
    {"uuid": "70ecf6c0-9530-4934-b940-07d3aa4eeb64", 
     "type": "Organisation", "label":"Royal Bank of Scotland", 
     "reflexive": false},
     {"uuid": "664307e6-74e0-4526-a7c4-673ae4983693", 
         "type": "Person", "label":"John, Doe", 
         "reflexive": false}
  ],
  "links": [
            {
                "source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2",
                "uuid": "1947a7bc-2e1b-4a34-8dc9-3c249e839742",
                "left": false,
                "label": "WORKS_FOR",
                "target": "0af83728-31a5-4a58-aadd-0b1f6ef78626",
                "right": true
            },
            {
                "uuid": "07774c3c-64a6-4a7f-97cc-7fa5796edae6",
                "source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2",
                "label": "LIVES_WITH",
                "target": "6e2d7bf7-37bd-402b-9b4c-ec430532c424",
                "left": false,
                "right": true
            },
            {
                "uuid": "a3f558e8-e20b-4822-be9d-411ee16335da",
                "source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2",
                "label": "MARRIED_TO",
                "target": "6e2d7bf7-37bd-402b-9b4c-ec430532c424",
                "left": false,
                "right": true
            },
            {
                "uuid": "86ee73a4-5cb8-42fc-aac6-f53fa9f49182",
                "source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2",
                "label": "MARRIED_TO",
                "target": "6e2d7bf7-37bd-402b-9b4c-ec430532c424",
                "left": false,
                "right": true
            },
            {
                "source": "3ccfd9ae-eecc-4886-ab6a-48507308a8b2",
                "uuid": "5922741a-e928-44cb-98ac-2706f2cd2c50",
                "left": false,
                "label": "ATTENDED",
                "target": "00a59297-e22a-4b68-99f8-40880fb6a660",
                "right": true
            },
            {
                "source": "6e2d7bf7-37bd-402b-9b4c-ec430532c424",
                "uuid": "dfa0e0a7-20e3-4d54-96fb-e0b4aecea6ce",
                "left": false,
                "label": "WORKS_FOR",
                "target": "0af83728-31a5-4a58-aadd-0b1f6ef78626",
                "right": true
            },
            {
                "source": "6e2d7bf7-37bd-402b-9b4c-ec430532c424",
                "uuid": "f37aac5e-9e9d-4ac9-ad5e-ec0787b3afba",
                "left": false,
                "label": "BANKS_WITH",
                "target": "70ecf6c0-9530-4934-b940-07d3aa4eeb64",
                "right": true
            }
        ]
}