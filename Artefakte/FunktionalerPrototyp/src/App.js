/*
- Nützliche Links -

// https://www.youtube.com/watch?v=kxXaIHi1j4w
// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models
//https://onion2k.github.io/r3f-by-example/examples/hooks/rotating-cube/
//https://codesandbox.io/s/splines-3k4g6?file=/src/Nodes.js:148-265
//https://codesandbox.io/s/basic-clerping-example-qh8vhf?file=/src/Scene.js
// https://www.youtube.com/watch?v=LNvn66zJyKs https://onion2k.github.io/r3f-by-example/

// https://codesandbox.io/s/example-f8t3w?file=/src/App.js:4177-4370 // GUI Example

*/

import './App.css';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera, Html, Stats, TrackballControls } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import React, { useState, useRef, useLayoutEffect, useReducer, Suspense, useEffect  } from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

// Eigene Scripts //

import {findPath, findPathSimple} from "./test/FindPath";
import {importPathMesh} from "./test/ImportPathMesh";
import {RenderChild, Thing, AddNewPointRandom, BadCode} from "./buildingGen"
import {MeshClickable, MeshNOTClickable, ImportMeshesFromOBJ, meshcollection} from "./test/MeshFunctions";
import { hover } from '@testing-library/user-event/dist/hover';

import {EffectComposer, DepthOfField, Bloom, Noise, Vignette, Outline, Selection, Select} from '@react-three/postprocessing'


const Scene = () => {

  // Submithandler
  const [wegPunkte, setWegPunkte] = useState(null)
  const activeRooms = []

  const start = useRef();
  const ziel = useRef();

  // Fügt dem Array über uns den angeklickten vector hinzu
  function raumauswahl(state, action) {

    const vecToArray = action.payloade.slice(-3)
    // Increment = Raum ist Aktiv, Decrement = Raum ist inaktiv
    switch (action.type) {
      case 'increment':

        // wenn unser arrayWithActiveRooms leer ist müssen wir nicht schauen ob es den ausgewählten draum im array doppelt gibt
        if(activeRooms.length <= 0){
          activeRooms.push(vecToArray)
        } else {
          var inArray = false
          // Geht den array Durch und schaut nach doppelten einträgen
          activeRooms.forEach(element => {
            if(JSON.stringify(element) == JSON.stringify(vecToArray)){
              inArray = true
            }
          });
          if(!inArray){
            activeRooms.push(vecToArray)
          }
        }

        return
      case 'decrement':
        if(JSON.stringify(activeRooms[0]) == JSON.stringify(vecToArray)){
          activeRooms.splice(0, 1);
        }

        if (JSON.stringify(activeRooms[1]) == JSON.stringify(vecToArray)){
          activeRooms.splice(1, 1);
        }
        return
      default:
        throw new Error();
    }
  }

  // Gebäude !-Pathfinding ist in der buildingGen.js-!
  const AddEtage03Raeume_01 = () => {  return ImportMeshesFromOBJ("obj/Main_Etage_03_01.obj",true, "#67d98b", "#e68b56", "#c5181f", raumauswahl, activeRooms)}
  const AddEtage03Raeume_02 = () => {  return ImportMeshesFromOBJ("obj/Main_Etage_03_02.obj",true, "#5ab475", "#e68b56", "#c5181f", raumauswahl, activeRooms)}
  const AddEtage03Geo = () => {     return ImportMeshesFromOBJ("obj/Etage_03_Geo.obj",false, "#adadad", "", "", raumauswahl, activeRooms)}

  const AddEtage02Raeume_01 = () => {  return ImportMeshesFromOBJ("obj/Main_Etage_02_01.obj",true, "#85b0ee", "#e68b56", "#c31820", raumauswahl, activeRooms)}
  const AddEtage02Raeume_02 = () => {  return ImportMeshesFromOBJ("obj/Main_Etage_02_02.obj",true, "#7094c9", "#e68b56", "#c31820", raumauswahl, activeRooms)}
  const AddEtage02Geo = () => {     return ImportMeshesFromOBJ("obj/Etage_02_Geo.obj",false, "#c4c4c4", "", "", raumauswahl, activeRooms)}

  const AddEtage01Raeume_01 = () => {  return ImportMeshesFromOBJ("obj/Main_Etage_01_01.obj",true, "#67d98b", "#e68b56", "#c11821", raumauswahl, activeRooms)}
  const AddEtage01Raeume_02 = () => {  return ImportMeshesFromOBJ("obj/Main_Etage_01_02.obj",true, "#5ab475", "#e68b56", "#bf1822", raumauswahl, activeRooms)}
  const AddEtage01Eingang =() => {      return ImportMeshesFromOBJ("obj/Main_Etage_01_Eingang.obj",true, "#9ab5d2", "#e68b56", "#bd1823", raumauswahl, activeRooms)}
  const AddEtage01Geo = () => {     return ImportMeshesFromOBJ("obj/Etage_01_Geo.obj",false, "#d3d3d3", "", "", raumauswahl, activeRooms)}

  const AddEtage00Raeume_01 = () => {  return ImportMeshesFromOBJ("obj/Main_Etage_00_01.obj",true, "#85b0ee", "#e68b56", "#bc1824", raumauswahl, activeRooms)}
  const AddEtage00Raeume_02 = () => {  return ImportMeshesFromOBJ("obj/Main_Etage_00_02.obj",true, "#7094c9", "#e68b56", "#9e141f", raumauswahl, activeRooms)}
  const AddEtage00Eingang =() => {      return ImportMeshesFromOBJ("obj/Main_Etage_00_Eingang.obj",true, "#99b4d1", "#e68b56", "#bc1824", raumauswahl, activeRooms)}
  const AddEtage00Geo =() => {      return ImportMeshesFromOBJ("obj/Etage_00_Geo.obj",false, "#e8e8e8", "", "", raumauswahl, activeRooms)}

  const AddStairs = () => {         return ImportMeshesFromOBJ("obj/Treppen.obj",false, "#ffc940", "", "", raumauswahl, activeRooms)}
  const AddElevators = () => {      return ImportMeshesFromOBJ("obj/Aufzuge.obj",false, "#ffc940", "", "", raumauswahl, activeRooms)}
  const AddAsphalt = () => {         return ImportMeshesFromOBJ("obj/Surrounding_Asphalt.obj",false, "#8c8c8c", "", "", raumauswahl, activeRooms)}
  const AddErde = () => {         return ImportMeshesFromOBJ("obj/Surrounding_Erde.obj",false, "#676767", "", "", raumauswahl, activeRooms)}
  const AddMetalThing = () => {         return ImportMeshesFromOBJ("obj/Surrounding_MetalThing.obj",false, "#f57743", "", "", raumauswahl, activeRooms)}
  const AddMetalThingStangen = () => {         return ImportMeshesFromOBJ("obj/Surrounding_MetalThing_Stangen.obj",false, "#e1e1e1", "", "", raumauswahl, activeRooms)}
  const AddGrund = () => {         return ImportMeshesFromOBJ("obj/Surrounding_Grund.obj",false, "#666666", "", "", raumauswahl, activeRooms)}

  /* ALLES MIT LINIEN IST HIER*/
  /* Linien gen https://codesandbox.io/s/r3f-line-adding-points-workaround-11g9h?file=/src/index.js */

  async function wegBerechnung(start, ende, treppe, aufzug){
    const pathMesh = await importPathMesh("obj/PathMesh.obj")
    //console.log(pathMesh[start])
    const pathtest = await findPathSimple(pathMesh[start],pathMesh[ende],pathMesh, treppe, aufzug)
    return pathtest
  }

//Zuordnung von angeklicktem Raum und Raumnummer
  const findID = (stringvonetwas) => {
    var returnThis;
    meshcollection.map((e) => {
      if (e.raumnummer == stringvonetwas) {
        returnThis = e.meshid
      }
    })
    return returnThis
  }

  function LineRenderer({ points }){
    return (
        <>
          <line position={[0, 0, 0]}>
            <bufferGeometry
                onUpdate={(geom) => {
                  geom.setFromPoints(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])))
                }}
            />
            <lineBasicMaterial color="#c5181f" linewidth={50}/>
          </line>
        </>
    )
  }

// Cam und UI
  function CameraControls(){

    const [kamera, set] = useState(true)

    const[showEtage3, setshowEtage3] = useState(true)
    const[showEtage2, setshowEtage2] = useState(true)
    const[showEtage1, setshowEtage1] = useState(true)
    const[showEtage0, setshowEtage0] = useState(true)
    const[showUmgebung, setshowUmgebung] = useState(true)

    const [updated, setUpdated] = useState();
    const [updated2, setUpdated2] = useState();
    //Fügt das Burger Icon hinzu
    library.add(fas);
    const [isOpen, setOpen] = useState(false);

    const [treppeRadio, setTreppeRadio] = useState(true);
    const [aufzugRadio, setAufzugRadio] = useState(false);



    //Etagen auswahl + Buttons
    const EtagenAuswahl = (props) => {
      const etagen = useRef();

      return(
          <group ref={etagen}>
            <mesh {...props}>
              <Html>
                <div className="etagen">
                  <button style={{ backgroundColor: showEtage3 ? "#C60C0F" : "#8C8C8C" }} onClick={() => setshowEtage3(!showEtage3)}>Etage 3</button>
                  <button style={{ backgroundColor: showEtage2 ? "#C60C0F" : "#8C8C8C" }} onClick={() => setshowEtage2(!showEtage2)}>Etage 2</button>
                  <button style={{ backgroundColor: showEtage1 ? "#C60C0F" : "#8C8C8C" }} onClick={() => setshowEtage1(!showEtage1)}>Etage 1</button>
                  <button style={{ backgroundColor: showEtage0 ? "#C60C0F" : "#8C8C8C" }} onClick={() => setshowEtage0(!showEtage0)}>Etage 0</button>
                  <button style={{ backgroundColor: showUmgebung ? "#C60C0F" : "#8C8C8C" }} onClick={() => setshowUmgebung(!showUmgebung)}>Umgebung</button>
                  <button style={{ backgroundColor: showUmgebung ? "#70b684" : "#70b583" }} onClick={() => set(!kamera)}>Switch cam</button>
                </div>
              </Html>
            </mesh>
          </group>
      );
    }

    const handleRadioButtons = (radioName) => {
      if(radioName === "aufzugRadio") {
        setAufzugRadio(true)
        setTreppeRadio(false)
      } else if(radioName === "treppeRadio") {
        setAufzugRadio(false)
        setTreppeRadio(true)
      }
    };

    const submitHandler = (e) => {
      var weg1
      var weg2

      setWegPunkte(wegPunkte => [])

      const auswahl1 = Number(activeRooms[0])
      const auswahl2 = Number(activeRooms[1])

      if(start.current.value.length > 3){
        const startNeu = findID(start.current.value.replace(".", "")) ;
        console.log(startNeu);
        const ende = findID(ziel.current.value.replace(".", "")) ;
        console.log(ende);
        weg1 = Number(startNeu)
        weg2 = Number(ende)
      } else {
        weg1 = Number(start.current.value)
        weg2 = Number(ziel.current.value)
      }


      if (weg1 > 0 || weg2 > 0) {
        const testWeg = wegBerechnung(weg1, weg2, treppeRadio, aufzugRadio)
        testWeg.then((data) => {
          if(data != null){
            data.map((e) => {
              console.log(e)
              /* angenommen man hat ein objekt=[ ob1: "a", ob2: "b",ob3: "c" ] dann ist {...objekt} das gleiche wie { ob1="a", ob2="b", ob3="c" } */
              setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
            )
          }
        })
      } else if(auswahl1 > 0 || auswahl2 > 0) {
        const weg =  wegBerechnung(auswahl1, auswahl2, treppeRadio, aufzugRadio)
        weg.then((data) => {
          if(data != null){
            data.map((e) => {
              setWegPunkte((points) => [...(points || [[0, 0, 0]]), [e.x, e.y, e.z]])}
            )
          }
          console.log("--- ende der Berechnung ---")
        })
      } else {
        console.log("error keine wegpunkte ausgewählt")
      }
    }

    // UI Route ... fml
    const UiRoute = (props) => {
      const uiRoute = useRef();

      return(
          <group ref={uiRoute}>
            <mesh {...props}>
              <Html>
                <div className="uiRoute">
                  <div className={`burgerMenu${isOpen ? "open" : ""}`} onClick={() => setOpen(!isOpen)}>
                  </div>

                  {isOpen && (
                      <div className='background' >
                        <div className='menuOpen'>
                          <form>
                            <input
                                ref={start}
                                placeholder="Start"
                                defaultValue={updated}
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                  meshcollection.map((e) => {
                                    if (e.meshid == Number(activeRooms[0])){
                                      setUpdated(e.raumnummer)
                                    }
                                  })
                                }}
                            >auswählen
                            </button>
                          </form><form>
                          <input
                              ref={ziel}
                              placeholder="Ziel"
                              defaultValue={updated2}
                          />
                          <button
                              display= "inline-block"
                              type="button"
                              onClick={(e) => {
                                meshcollection.map((e) => {
                                  if (e.meshid == Number(activeRooms[1])){
                                    setUpdated2(e.raumnummer)
                                  }
                                })

                              }}
                          >auswählen
                          </button>
                        </form>
                        </div>

                        <div className="treppeAufzug">
                          <button
                              style={{ backgroundColor: treppeRadio ? "#C60C0F" : "#AAAAAA" }}
                              type="button"
                              onClick={() => handleRadioButtons("treppeRadio")}
                          >Treppe
                          </button>
                          <button
                              style={{ backgroundColor: aufzugRadio ? "#C60C0F" : "#AAAAAA" }}
                              type="button"
                              onClick={() => handleRadioButtons("aufzugRadio")}
                          >Aufzug
                          </button>
                        </div>

                        <div className="berechnenButton">
                          <button onClick={submitHandler}>Route berechnen</button>
                        </div>

                      </div>
                  )}
                </div>
              </Html>
            </mesh>
          </group>
      );
    }

    // Erstellen der Kameras
    var perspCamConfig = {position:[-80, 60, 100], fov:80 , makeDefault:kamera, rotation:[0,-20,0]}
    var orthoCamConfig = {position:[-60,12, 0], fov:0, makeDefault: !kamera, rotation:[0,-90,0], scale:[0.15,0.15,0.15]}
    
    // Hier ist der Return der Szene+UI
    if (kamera){
      return (
          <>
            <OrbitControls enableRotate={true} target={[-60,0,0]}/>
            <PerspectiveCamera {...perspCamConfig}>
              <EtagenAuswahl position={[0]}/>
              <UiRoute position={[0]}/>
            </PerspectiveCamera>

            <Selection>
              <EffectComposer autoclear={false}>
                <Outline blur visibleEdgeColor={"white"} hiddenEdgeColor={"black"} edgeStrength={100} width={500} />
                <Vignette darkness={0.9} offset={0.22} eskil={false} />
              </EffectComposer>
              <Select enabled={true}>
                {showEtage3 && <AddEtage03Geo/>}
                {showEtage3 && <AddEtage03Raeume_01/>}
                {showEtage3 && <AddEtage03Raeume_02/>}
                {showEtage2 && <AddEtage02Geo/>}
                {showEtage2 && <AddEtage02Raeume_01/>}
                {showEtage2 && <AddEtage02Raeume_02/>}
                {showEtage1 &&<AddEtage01Geo/>}
                {showEtage1 &&<AddEtage01Raeume_01/>}
                {showEtage1 &&<AddEtage01Raeume_02/>}
                {showEtage1 && <AddEtage01Eingang/>}
                {showEtage0 && <AddEtage00Geo/>}
                {showEtage0 && <AddEtage00Raeume_01/>}
                {showEtage0 && <AddEtage00Raeume_02/>}
                {showEtage0 && <AddEtage00Eingang/>}
                <AddStairs/>
                <AddElevators/>
                {showUmgebung && <AddAsphalt/>}
                {showUmgebung && <AddErde/>}
                {showUmgebung && <AddMetalThingStangen/>}
                {showUmgebung && <AddMetalThing/>}
                {showUmgebung && <AddGrund/>}
              </Select>
            </Selection>
          </>
      )
    }else{
      return (
          <>
            <OrbitControls enableRotate={false} target={[-60,0, 0]}/>
            <OrthographicCamera {...orthoCamConfig}>
              <EtagenAuswahl position={[0,10]}/>
              <UiRoute position={[0,5]}/>
            </OrthographicCamera>

            <Selection>
              <EffectComposer autoclear={false}>
                <Outline blur visibleEdgeColor={"white"} hiddenEdgeColor={"black"} edgeStrength={100} width={500} />
                <Vignette darkness={0.9} offset={0.22} eskil={false} />
              </EffectComposer>
              <Select enabled={true}>
                {showEtage3 && <AddEtage03Geo/>}
                {showEtage3 && <AddEtage03Raeume_01/>}
                {showEtage3 && <AddEtage03Raeume_02/>}
                {showEtage2 && <AddEtage02Geo/>}
                {showEtage2 && <AddEtage02Raeume_01/>}
                {showEtage2 && <AddEtage02Raeume_02/>}
                {showEtage1 &&<AddEtage01Geo/>}
                {showEtage1 &&<AddEtage01Raeume_01/>}
                {showEtage1 &&<AddEtage01Raeume_02/>}
                {showEtage1 && <AddEtage01Eingang/>}
                {showEtage0 && <AddEtage00Geo/>}
                {showEtage0 && <AddEtage00Raeume_01/>}
                {showEtage0 && <AddEtage00Raeume_02/>}
                {showEtage0 && <AddEtage00Eingang/>}
                <AddStairs/>
                <AddElevators/>
                {showUmgebung && <AddAsphalt/>}
                {showUmgebung && <AddErde/>}
                {showUmgebung && <AddMetalThingStangen/>}
                {showUmgebung && <AddMetalThing/>}
                {showUmgebung && <AddGrund/>}
              </Select>
            </Selection>
          </>
      )
    }
  }

  const Licht = () => {
    return(
        <>
          <ambientLight
              intensity={0.5}
          />

          <directionalLight
              castShadow
              shadow-mapSize-height={512}
              shadow-mapSize-width={512}
              intensity={0.5}
          />
        </>
    )
  }

  return (
      <>
        <Canvas>

          <CameraControls/>
          <Licht/>
          <LineRenderer points={wegPunkte || [ [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0] ]} />

        </Canvas>
      </>
  );
};

// 
const App = () => {
  return <Scene />
};

export default App;
