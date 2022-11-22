import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { Application } from "./Application";
import { TrayItemWidget } from "./TrayItemWidget";
import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultPortModel,
  DefaultLinkFactory,
  DefaultLinkModel,
} from "@projectstorm/react-diagrams";
import * as SRD from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { ViewCanvasWidget } from "./ViewCanvasWidget";
import styled from "@emotion/styled";
import { action } from "@storybook/addon-actions";
import {
  HStack,
  Input,
  Modal,
  Text,
  TextField,
  VStack,
  ZStack,
} from "native-base";
import TransitionModel from "./TransitionModal";
import data from "../data";
export interface BodyWidgetProps {
  app: Application;
}

namespace S {
  export const Body = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  `;

  export const Header = styled.div`
    display: flex;
    background: rgb(30, 30, 30);
    flex-grow: 0;
    flex-shrink: 0;
    color: white;
    font-family: Helvetica, Arial, sans-serif;
    padding: 10px;
    align-items: center;
  `;

  export const Content = styled.div`
    display: flex;
    flex-grow: 1;
  `;

  export const Layer = styled.div`
    position: relative;
    flex-grow: 1;
  `;
}

export const BodyWidget = (props: BodyWidgetProps) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  const [xPos, setqXPos] = React.useState(0);
  const [yPos, setqYPos] = React.useState(0);
  const [showTransionModal, setShowTransionModal] = React.useState(false);
  const [selectedLink, setSelectedLink] = React.useState<any>(null);
  const [nodeVals, setNodeVals] = React.useState<any>(null);
  const [nodeSel, setNodeSel] = React.useState<boolean>(false);
  const [stateMachine, setStatemachine] = React.useState<any>([]);
  React.useEffect(() => {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      props.app
        .getDiagramEngine()
        .getModel()
        .getSelectedEntities()
        .forEach((element) => {
          setqXPos(event.clientX);
          setqYPos(event.clientY);
          setModalVisible(true);
          //this.setState({ x: event.clientX, y: event.clientY , showMenu: true });
        });

      console.log(event.clientX, event.clientY);
    });
  }, []);
  function handleLink() {
    props.app
      .getDiagramEngine()
      .getModel()
      .getSelectedEntities()
      .forEach((element) => {
        setShowTransionModal(true);
        setSelectedLink(element);
        //console.log(element);
      });
  }
  React.useEffect(() => {}, [
    props,
    update,
    modalVisible,
    selectedLink,
    showTransionModal,
  ]);
  React.useEffect(() => {
    setUpdate(!update);
    console.log(nodeVals);
  }, [nodeVals, nodeSel, stateMachine]);
  const handleChange = (nodeId: any, value: any) => {};
  window.addEventListener("mousedown", function listner(event) {
    props.app
      .getDiagramEngine()
      .getModel()
      .getSelectedEntities()
      .forEach((element) => {
        const op = element.getOptions();
        //console.log(op.id)
        for (const state in stateMachine) {
          //console.log(stateMachine);
          if (String(stateMachine[state]._id) === String(op.id)) {
            console.log(stateMachine[state]);
            setNodeVals(stateMachine[state]);
            setNodeSel(true);
            setUpdate(!update);
          }
        }
        //console.log(op);
        //console.log(element);
      });
  });
  return (
    <S.Body>
      <S.Header>
        <div className="title">Mosiac</div>
        <button
          onClick={() => {
            ///load json from data

            data.data.forEach((element, i) => {
              //console.log(element.extraData.builder);
              let node = new DefaultNodeModel(
                element.data.machines[0].displayName,
                "rgb(0,192,255)"
              );
              node.getOptions().id = element._id;
              let port = node.addPort(
                new DefaultPortModel(false, "out-1", "Out")
              );
              node.addPort(port);
              node.setPosition(i * 100, i * 100);
              props.app.getDiagramEngine().getModel().addNode(node);
              props.app
                .getDiagramEngine()
                .getModel()
                .registerListener({
                  linksUpdated: (e: any) => {
                    console.log("links updated");
                    window.addEventListener("mouseup", function listner(event) {
                      handleLink();
                      window.removeEventListener("mouseup", listner);
                    });
                  },
                  nodesUpdated: (event: any) => {
                    //console.log(event);
                    // setNodeVals(event.node);
                    // setNodeSel(true);
                  },
                  eventDidFire: (event: any) => {},
                });
              const s = stateMachine;
              s.push(element);
              setStatemachine(s);
              setUpdate(!update);
            });
          }}
        >
          Load Data
        </button>
      </S.Header>
      <HStack>
        <TrayWidget>
          <TrayItemWidget
            model={{ name: "nn" }}
            name="Node"
            color="rgb(192,255,0)"
          />
        </TrayWidget>
        <S.Layer
          onDrop={(event) => {
            props.app
              .getDiagramEngine()
              .getLinkFactories()
              .registerFactory(new AdvancedLinkFactory());
            var data = JSON.parse(
              event.dataTransfer.getData("storm-diagram-node")
            );
            console.log(data);
            var nodesCount = _.keys(
              props.app.getDiagramEngine().getModel().getNodes()
            ).length;
            var node: DefaultNodeModel | null = null;
            node = new DefaultNodeModel(
              "Node " + (nodesCount + 1),
              "rgb(192,255,0)"
            );

            node.addInPort("In");
            props.app
              .getDiagramEngine()
              .getModel()
              .registerListener({
                linksUpdated: (e: any) => {
                  console.log("links updated");
                  window.addEventListener("mouseup", function listner(event) {
                    handleLink();
                    window.removeEventListener("mouseup", listner);
                  });
                },
                nodesUpdated: (event: any) => {
                  //console.log(event);
                  // setNodeVals(event.node);
                  // setNodeSel(true);
                },
                eventDidFire: (event: any) => {},
              });
            let port1 = node.addPort(
              new AdvancedPortModel(false, "out-1", "Out thick")
            );
            let port2 = node.addPort(
              new DefaultPortModel(false, "out-2", "Out default")
            );

            node.addOutPort("Out");
            var point = props.app
              .getDiagramEngine()
              .getRelativeMousePoint(event);
            node.setPosition(point);
            props.app.getDiagramEngine().getModel().addNode(node);
            setStatemachine([
              ...stateMachine,
              {
                displayName: "Node " + (nodesCount + 1),
                parent: "",
                default: "Start",
                concurrent: "false",
                history: "false",
                states: {},
                extraData: node,
              },
            ]);
            setUpdate(!update);
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
        >
          <ViewCanvasWidget>
            <CanvasWidget engine={props.app.getDiagramEngine()} />
          </ViewCanvasWidget>
        </S.Layer>
        <VStack w="72" h="100vh" overflow={"scroll"}>
          {nodeSel ? (
            <>
              <VStack space="2">
                <HStack>
                  <Text>Display Name</Text>
                  <Input value={nodeVals.data.machines["0"].displayName} />
                </HStack>
                <Text mx="auto">States</Text>
                {Object.keys(nodeVals.data.machines["0"].states).map(
                  (state: any, i) => {
                    return (
                      <VStack bg="amber.100">
                        <HStack key={i}>
                          <Text>Display Name</Text>
                          <Text>
                            {
                              nodeVals.data.machines["0"].states[state]
                                .displayName
                            }
                          </Text>
                        </HStack>
                        {nodeVals.data.machines["0"].states[state]
                          .transitions !== undefined ? (
                          <>
                            {Object.keys(
                              nodeVals.data.machines["0"].states[state]
                                .transitions
                            ).map((item, i) => {
                              return (
                                <VStack key={i}>
                                  <HStack space="2">
                                    <Text>Transition Name</Text>

                                    <Text>{item}</Text>
                                  </HStack>
                                  <HStack space="2">
                                    <Text>Machine</Text>
                                    <Text>
                                      {
                                        nodeVals.data.machines["0"].states[
                                          state
                                        ].transitions[item].from.machine
                                      }
                                    </Text>
                                  </HStack>
                                  <Text>From</Text>
                                  <HStack space="2">
                                    <Text>Machine</Text>
                                    <Text>
                                      {
                                        nodeVals.data.machines["0"].states[
                                          state
                                        ].transitions[item].from.machine
                                      }
                                    </Text>
                                    <HStack space="2">
                                      <Text>uid</Text>
                                      <Text>
                                        {
                                          nodeVals.data.machines["0"].states[
                                            state
                                          ].transitions[item].from.uid
                                        }
                                      </Text>
                                    </HStack>
                                  </HStack>
                                  <Text>To</Text>
                                  <HStack space="2">
                                    <Text>Machine</Text>
                                    <Text>
                                      {
                                        nodeVals.data.machines["0"].states[
                                          state
                                        ].transitions[item].to.machine
                                      }
                                    </Text>
                                    <HStack space="2">
                                      <Text>uid</Text>
                                      <Text>
                                        {
                                          nodeVals.data.machines["0"].states[
                                            state
                                          ].transitions[item].to.uid
                                        }
                                      </Text>
                                    </HStack>
                                  </HStack>
                                </VStack>
                              );
                            })}
                          </>
                        ) : (
                          <></>
                        )}

                        <HStack></HStack>
                      </VStack>
                    );
                  }
                )}

                <HStack></HStack>
              </VStack>
            </>
          ) : (
            <>Slect Node</>
          )}
        </VStack>
      </HStack>
      <TransitionModel
        modalVisible={showTransionModal}
        setModalVisible={setShowTransionModal}
        selectedLink={selectedLink}
        stateMachine={stateMachine}
        setStateMachine={setStatemachine}
      />
      {modalVisible ? (
        <ZStack
          background={"pink"}
          w="32"
          h="32"
          position={"absolute"}
          marginX={xPos}
          marginY={yPos}
        >
          <VStack background={"pink"} w="32" h="32">
            <button
              onClick={() => {
                setModalVisible(false);
              }}
            >
              Close
            </button>
            <Text color="white">dhfghjkkl;;</Text>
          </VStack>
        </ZStack>
      ) : (
        <></>
      )}
    </S.Body>
  );
};

export class AdvancedLinkModel extends DefaultLinkModel {
  constructor() {
    super({
      type: "advanced",
      width: 10,
    });
  }
}

export class AdvancedPortModel extends DefaultPortModel {
  createLinkModel(): AdvancedLinkModel {
    return new AdvancedLinkModel();
  }
}

export class AdvancedLinkSegment extends React.Component<{
  model: AdvancedLinkModel;
  path: string;
}> {
  path!: SVGPathElement;
  circle!: SVGCircleElement;
  callback: (() => any) | null = null;
  percent: number;
  handle: any;
  mounted: boolean = false;

  constructor(
    props:
      | { model: AdvancedLinkModel; path: string }
      | Readonly<{ model: AdvancedLinkModel; path: string }>
  ) {
    super(props);
    this.percent = 0;
  }

  componentDidMount() {
    this.mounted = true;
    this.callback = () => {
      if (!this.circle || !this.path) {
        return;
      }

      this.percent += 2;
      if (this.percent > 100) {
        this.percent = 0;
      }

      let point = this.path.getPointAtLength(
        this.path.getTotalLength() * (this.percent / 100.0)
      );

      this.circle.setAttribute("cx", "" + point.x);
      this.circle.setAttribute("cy", "" + point.y);

      if (this.mounted) {
        requestAnimationFrame(this.callback as any);
      }
    };
    requestAnimationFrame(this.callback);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <>
        <path
          fill="none"
          ref={(ref) => {
            this.path = ref as SVGPathElement;
          }}
          strokeWidth={this.props.model.getOptions().width}
          stroke="rgba(255,0,0,0.5)"
          d={this.props.path}
        />
        <circle
          ref={(ref) => {
            this.circle = ref as SVGCircleElement;
          }}
          r={10}
          fill="orange"
        />
      </>
    );
  }
}

export class AdvancedLinkFactory extends DefaultLinkFactory {
  constructor() {
    super("advanced");
  }

  generateModel(): AdvancedLinkModel {
    return new AdvancedLinkModel();
  }

  generateLinkSegment(
    model: AdvancedLinkModel,
    selected: boolean,
    path: string
  ) {
    return (
      <g>
        <AdvancedLinkSegment model={model} path={path} />
      </g>
    );
  }
}
// {
//       "_id": "3177",
//       "data": {
//         "machines": {
//           "0": {
//             "displayName": "/",
//             "parent": "",
//             "default": "Start",
//             "concurrent": "false",
//             "history": "false",
//             "states": {
//               "Start": {
//                 "displayName": "Start",
//                 "machine": "",
//                 "composite": "false",
//                 "transitions": {
//                   "a718ffaf-6fd2-4556-8f1f-061dd7850f7d": {
//                     "displayName": "a718ffaf-6fd2-4556-8f1f-061dd7850f7d",
//                     "from": { "machine": "0", "uid": "Start" },
//                     "to": { "machine": "0", "uid": "Text" }
//                   },
//                   "f6e42d5f-46e7-4b7f-96de-4c5fd7d3adc0": {
//                     "displayName": "f6e42d5f-46e7-4b7f-96de-4c5fd7d3adc0",
//                     "from": { "machine": "0", "uid": "Start" },
//                     "to": { "machine": "0", "uid": "Image" }
//                   },
//                   "ec3acaa1-0b8b-4b8b-9e84-fd088fb20d41": {
//                     "displayName": "ec3acaa1-0b8b-4b8b-9e84-fd088fb20d41",
//                     "from": { "machine": "0", "uid": "Start" },
//                     "to": { "machine": "0", "uid": "Button" }
//                   },
//                   "245a6c06-3deb-4443-8e06-861c9da127c0": {
//                     "displayName": "start-form",
//                     "from": { "machine": "0", "uid": "Start" },
//                     "to": { "machine": "0", "uid": "Form" }
//                   },
//                   "851f9fbb-61e7-4522-9aeb-2c85afee238f": {
//                     "displayName": "start-list",
//                     "from": { "machine": "0", "uid": "Start" },
//                     "to": { "machine": "0", "uid": "List" }
//                   }
//                 },
//                 "role": {
//                   "default-role": {
//                     "actions": {
//                       "start-text": {
//                         "displayName": "start-text",
//                         "action": [
//                           {
//                             "condition": "true",
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "a718ffaf-6fd2-4556-8f1f-061dd7850f7d"
//                               }
//                             ]
//                           }
//                         ]
//                       },
//                       "start-image": {
//                         "displayName": "start-image",
//                         "action": [
//                           {
//                             "condition": "true",
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "f6e42d5f-46e7-4b7f-96de-4c5fd7d3adc0"
//                               }
//                             ]
//                           }
//                         ]
//                       },
//                       "start-button": {
//                         "displayName": "start-button",
//                         "action": [
//                           {
//                             "condition": "true",
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "ec3acaa1-0b8b-4b8b-9e84-fd088fb20d41"
//                               }
//                             ]
//                           }
//                         ]
//                       },
//                       "start-form": {
//                         "displayName": "start-form",
//                         "action": [
//                           {
//                             "condition": true,
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "245a6c06-3deb-4443-8e06-861c9da127c0"
//                               }
//                             ]
//                           }
//                         ]
//                       },
//                       "start-list": {
//                         "displayName": "start-list",
//                         "action": [
//                           {
//                             "condition": true,
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "851f9fbb-61e7-4522-9aeb-2c85afee238f"
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     },
//                     "display": {
//                       "description": "",
//                       "displayData": [
//                         { "title": "2" },
//                         { "button": "1" },
//                         { "button": "3" },
//                         { "button": "5" },
//                         { "button": 10 },
//                         { "button": 12 }
//                       ]
//                     }
//                   }
//                 }
//               },
//               "Text": {
//                 "displayName": "Text",
//                 "machine": "",
//                 "composite": "false",
//                 "transitions": {
//                   "54ff3e7e-9b20-4cf2-be9b-2655e7954d83": {
//                     "displayName": "54ff3e7e-9b20-4cf2-be9b-2655e7954d83",
//                     "from": { "machine": "0", "uid": "Text" },
//                     "to": { "machine": "0", "uid": "Start" }
//                   }
//                 },
//                 "role": {
//                   "default-role": {
//                     "actions": {
//                       "text-start": {
//                         "displayName": "text-start",
//                         "action": [
//                           {
//                             "condition": "true",
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "54ff3e7e-9b20-4cf2-be9b-2655e7954d83"
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     },
//                     "display": {
//                       "description": "",
//                       "displayData": [
//                         { "title": "1" },
//                         { "header": "1" },
//                         { "text": "1" },
//                         { "text": "2" },
//                         { "button": "2" }
//                       ]
//                     }
//                   }
//                 }
//               },
//               "Image": {
//                 "displayName": "Image",
//                 "machine": "",
//                 "composite": "false",
//                 "transitions": {
//                   "d980a2e8-86f6-471f-9165-bb039ad35c09": {
//                     "displayName": "d980a2e8-86f6-471f-9165-bb039ad35c09",
//                     "from": { "machine": "0", "uid": "Image" },
//                     "to": { "machine": "0", "uid": "Start" }
//                   }
//                 },
//                 "role": {
//                   "default-role": {
//                     "actions": {
//                       "image-start": {
//                         "displayName": "image-start",
//                         "action": [
//                           {
//                             "condition": "true",
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "d980a2e8-86f6-471f-9165-bb039ad35c09"
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     },
//                     "display": {
//                       "description": "",
//                       "displayData": [
//                         { "title": "3" },
//                         { "image": 1 },
//                         { "video": "1" },
//                         { "button": "4" }
//                       ]
//                     }
//                   }
//                 }
//               },
//               "Button": {
//                 "displayName": "Button",
//                 "machine": "",
//                 "composite": "false",
//                 "transitions": {
//                   "dee6fd14-9c62-4423-b81b-32107422752f": {
//                     "displayName": "dee6fd14-9c62-4423-b81b-32107422752f",
//                     "from": { "machine": "0", "uid": "Button" },
//                     "to": { "machine": "0", "uid": "Start" }
//                   }
//                 },
//                 "role": {
//                   "default-role": {
//                     "actions": {
//                       "button-start": {
//                         "displayName": "button-start",
//                         "action": [
//                           {
//                             "condition": "true",
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "dee6fd14-9c62-4423-b81b-32107422752f"
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     },
//                     "display": {
//                       "description": "",
//                       "displayData": [
//                         { "title": "4" },
//                         { "button": "7" },
//                         { "button": "8" },
//                         { "button": "9" },
//                         { "button": "6" }
//                       ]
//                     }
//                   }
//                 }
//               },
//               "Form": {
//                 "displayName": "Form",
//                 "machine": null,
//                 "composite": false,
//                 "entry": [],
//                 "exit": [],
//                 "transitions": {
//                   "4b195169-5a11-48be-9b6c-d8e8f32c4057": {
//                     "displayName": "form-start",
//                     "from": { "machine": "0", "uid": "Form" },
//                     "to": { "machine": "0", "uid": "Start" }
//                   }
//                 },
//                 "role": {
//                   "default-role": {
//                     "display": {
//                       "description": "",
//                       "displayData": [
//                         { "title": 5 },
//                         { "input": 1 },
//                         { "button": 11 }
//                       ]
//                     },
//                     "actions": {
//                       "form-start": {
//                         "displayName": "form-start",
//                         "action": [
//                           {
//                             "condition": true,
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "4b195169-5a11-48be-9b6c-d8e8f32c4057"
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     }
//                   }
//                 }
//               },
//               "List": {
//                 "displayName": "List",
//                 "machine": null,
//                 "composite": false,
//                 "entry": [],
//                 "exit": [],
//                 "transitions": {
//                   "4399f153-3dcc-438b-b709-b9b0e4665518": {
//                     "displayName": "list-start",
//                     "from": { "machine": "0", "uid": "List" },
//                     "to": { "machine": "0", "uid": "Start" }
//                   }
//                 },
//                 "role": {
//                   "default-role": {
//                     "display": {
//                       "description": "",
//                       "displayData": [
//                         { "title": 6 },
//                         { "list": 1 },
//                         { "button": 13 }
//                       ]
//                     },
//                     "actions": {
//                       "list-start": {
//                         "displayName": "list-start",
//                         "action": [
//                           {
//                             "condition": true,
//                             "events": [
//                               {
//                                 "type": "transition",
//                                 "do": "4399f153-3dcc-438b-b709-b9b0e4665518"
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       },
//       "extraData": {
//         "context": "{\n  \"en-CA\": {\n    \"menu\": {},\n    \"title\": {\n      \"1\": {\n        \"text\": \"Big Title\"\n      },\n      \"2\": {\n        \"text\": \"Start\"\n      },\n      \"3\": {\n        \"text\": \"Media examples\"\n      },\n      \"4\": {\n        \"text\": \"Button examples\"\n      },\n      \"5\": {\n        \"text\": \"Form examples\"\n      },\n      \"6\": {\n        \"text\": \"List examples\"\n      }\n    },\n    \"header\": {\n      \"1\": {\n        \"text\": \"Cool Header\"\n      },\n      \"2\": {\n        \"text\": \"Enter form data\"\n      }\n    },\n    \"text\": {\n      \"1\": \"small text\",\n      \"2\": \"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"\n    },\n    \"button\": {\n      \"1\": {\n        \"text\": \"Move to text state\",\n        \"actionID\": \"start-text\"\n      },\n      \"2\": {\n        \"text\": \"Return to start\",\n        \"actionID\": \"text-start\"\n      },\n      \"3\": {\n        \"text\": \"Move to media state\",\n        \"actionID\": \"start-image\"\n      },\n      \"4\": {\n        \"text\": \"Return to start\",\n        \"actionID\": \"image-start\"\n      },\n      \"5\": {\n        \"text\": \"Move to button state\",\n        \"actionID\": \"start-button\"\n      },\n      \"6\": {\n        \"text\": \"Return to start\",\n        \"actionID\": \"button-start\"\n      },\n      \"7\": {\n        \"text\": \"test button 1\",\n        \"actionID\": \"test-1\"\n      },\n      \"8\": {\n        \"text\": \"test button 2\",\n        \"actionID\": \"test-2\"\n      },\n      \"9\": {\n        \"text\": \"test button 3\",\n        \"actionID\": \"test-3\"\n      },\n      \"10\": {\n        \"text\": \"Move to form state\",\n        \"actionID\": \"start-form\"\n      },\n      \"11\": {\n        \"text\": \"Return to start\",\n        \"actionID\": \"form-start\"\n      },\n      \"12\": {\n        \"text\": \"Move to list state\",\n        \"actionID\": \"start-list\"\n      },\n      \"13\": {\n        \"text\": \"Return to start\",\n        \"actionID\": \"list-start\"\n      }\n    },\n    \"input\": {\n      \"1\": {\n        \"type\": \"form\",\n        \"name\": \"request_viewing\",\n        \"inputs\": [\n          {\n            \"type\": \"text\",\n            \"label\": \"text_input\",\n            \"label_text\": \"Text input\",\n            \"placeholder\": \"Enter text\",\n            \"optional\": false,\n            \"data\": {}\n          },\n          {\n            \"type\": \"text\",\n            \"label\": \"optional_text_input\",\n            \"label_text\": \"Optional text input\",\n            \"placeholder\": \"Enter text\",\n            \"optional\": true,\n            \"data\": {}\n          },\n          {\n            \"type\": \"date\",\n            \"label\": \"date_input\",\n            \"label_text\": \"Date input\",\n            \"placeholder\": \"\",\n            \"optional\": false,\n            \"data\": {}\n          },\n          {\n            \"type\": \"time\",\n            \"label\": \"time_input\",\n            \"label_text\": \"Time input\",\n            \"placeholder\": \"\",\n            \"optional\": false,\n            \"data\": {}\n          },\n          {\n            \"type\": \"select\",\n            \"label\": \"select_input\",\n            \"label_text\": \"Select input\",\n            \"placeholder\": \"\",\n            \"optional\": false,\n            \"data\": {\n              \"options\": [\n                \"first option\",\n                \"second option\",\n                \"third option\"\n              ]\n            }\n          },\n          {\n            \"type\": \"tel\",\n            \"label\": \"phone_input\",\n            \"label_text\": \"Phone number input\",\n            \"placeholder\": \"416-123-4567\",\n            \"optional\": false,\n            \"data\": {\n              \"pattern\": \"[0-9]{3}-[0-9]{3}-[0-9]{4}\"\n            }\n          },\n          {\n            \"type\": \"email\",\n            \"label\": \"email_input\",\n            \"label_text\": \"Email input\",\n            \"placeholder\": \"name@email.com\",\n            \"optional\": false,\n            \"data\": {}\n          },\n          {\n            \"type\": \"submit\",\n            \"label\": \"submit_form\",\n            \"label_text\": \"Submit form\",\n            \"placeholder\": null,\n            \"optional\": false,\n            \"data\": {\n              \"actions\": [\n                \"save_object\"\n              ],\n              \"save_object_data\": {\n                \"object_name\": \"form_data\"\n              }\n            }\n          }\n        ]\n      }\n    },\n    \"list\": {\n      \"1\": {\n        \"name\": \"form data\",\n        \"type\": \"object\",\n        \"object_name\": \"form_data\"\n      }\n    },\n    \"image\": {\n      \"1\": {\n        \"alt-text\": \"nature-image\",\n        \"src\": \"https://eskipaper.com/images/cool-nature-1.jpg\"\n      }\n    },\n    \"video\": {\n      \"1\": {\n        \"alt-text\": \"nature-video\",\n        \"src\": \"https://www.youtube.com/watch?v=wu3yk-AiSlE\"\n      }\n    }\n  }\n}",
//         "builder": "{\"nodes\":[{\"data\":{\"id\":\"Start\"},\"position\":{\"x\":300,\"y\":550},\"group\":\"nodes\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":false,\"classes\":\"\"},{\"data\":{\"id\":\"Text\"},\"position\":{\"x\":497.7652352795509,\"y\":327.21263681933755},\"group\":\"nodes\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":false,\"classes\":\"\"},{\"data\":{\"id\":\"Image\"},\"position\":{\"x\":656,\"y\":433},\"group\":\"nodes\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":false,\"classes\":\"\"},{\"data\":{\"id\":\"Button\"},\"position\":{\"x\":718,\"y\":557},\"group\":\"nodes\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":false,\"classes\":\"\"},{\"data\":{\"id\":\"Form\"},\"position\":{\"x\":666,\"y\":696},\"group\":\"nodes\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":false,\"classes\":\"\"},{\"data\":{\"id\":\"List\"},\"position\":{\"x\":481,\"y\":791},\"group\":\"nodes\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":false,\"classes\":\"\"}],\"edges\":[{\"data\":{\"source\":\"Start\",\"target\":\"Text\",\"id\":\"a718ffaf-6fd2-4556-8f1f-061dd7850f7d\",\"label\":\"start-text\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"Text\",\"target\":\"Start\",\"id\":\"54ff3e7e-9b20-4cf2-be9b-2655e7954d83\",\"label\":\"text-start\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"Start\",\"target\":\"Image\",\"id\":\"f6e42d5f-46e7-4b7f-96de-4c5fd7d3adc0\",\"label\":\"start-image\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"Image\",\"target\":\"Start\",\"id\":\"d980a2e8-86f6-471f-9165-bb039ad35c09\",\"label\":\"image-start\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"Start\",\"target\":\"Button\",\"id\":\"ec3acaa1-0b8b-4b8b-9e84-fd088fb20d41\",\"label\":\"start-button\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"Button\",\"target\":\"Start\",\"id\":\"dee6fd14-9c62-4423-b81b-32107422752f\",\"label\":\"button-start\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"Start\",\"target\":\"Form\",\"id\":\"245a6c06-3deb-4443-8e06-861c9da127c0\",\"label\":\"start-form\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"Form\",\"target\":\"Start\",\"id\":\"4b195169-5a11-48be-9b6c-d8e8f32c4057\",\"label\":\"form-start\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"Start\",\"target\":\"List\",\"id\":\"851f9fbb-61e7-4522-9aeb-2c85afee238f\",\"label\":\"start-list\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"},{\"data\":{\"source\":\"List\",\"target\":\"Start\",\"id\":\"4399f153-3dcc-438b-b709-b9b0e4665518\",\"label\":\"list-start\"},\"position\":{\"x\":0,\"y\":0},\"group\":\"edges\",\"removed\":false,\"selected\":false,\"selectable\":true,\"locked\":false,\"grabbable\":true,\"pannable\":true,\"classes\":\"\"}]}"
//       },
//       "createdAt": "2022-05-04T16:26:48.275Z",
//       "updatedAt": "2022-05-19T13:58:32.764Z",
//       "__v": 0
//     },
