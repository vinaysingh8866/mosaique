import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import {
  Button,
  Center,
  CheckIcon,
  FormControl,
  HStack,
  Input,
  Modal,
  Select,
  Stack,
  VStack,
} from "native-base";
import { Canvas } from "fabric/fabric-impl";
import { BodyWidget } from './components/BodyWidget';
import { Application } from './components/Application';

export default () => {
	var app = new Application();
	return <BodyWidget app={app} />;
};
// const App = () => {
//   const [canvas, setCanvas] = useState<Canvas>();
//   const [nodes, setNodes] = useState(1);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [transitionModalVisible, setTransitionModalVisible] = useState(false);

//   var rect = new fabric.Rect({
//     left: 100,
//     top: 100,
//     fill: "red",
//     width: 100,
//     height: 40,
//   });

//   useEffect(() => {
//     initCanvas();
//   }, []);
//   function initCanvas() {
//     let can = new fabric.Canvas("canvas", {
//       height: 800,
//       width: 800,
//       backgroundColor: "white",
//       selection: true,
//     });
//     rect.selectable = true;
//     //   can.add(new fabric.Line([50, 100, 200, 200], {
//     //     left: 170,
//     //     top: 150,
//     //     stroke: 'red'
//     // }));

//     setCanvas(can);
//   }
//   function addNode(name: string) {
//     if (canvas != null) {
//       const text = new fabric.Text(name, {
//         left: 100, //Take the block's position
//         top: 100,
//         fill: "white",
//         backgroundColor: "black",
//         selectable: true,
//         name: "node_" + String(nodes),
//       });
//       setNodes(nodes + 1);
//       canvas.add(text);
//     }
//   }
//   function addTransition(service1: any, service2: any) {
//     if (canvas != null) {
//       const items = canvas.getObjects();
//       let cor1;
//       let cor2;
//       for (const i in items) {
//         console.log(items[i].name);
//         console.log(service1, service2);
//         if (String(service1) === String(items[i].name)) {
//           cor1 = {
//             left: items[i].left,
//             top: items[i].top,
//             width: items[i].width,
//             height: items[i].height,
//           };
//         }
//         if (String(service2) === String(items[i].name)) {
//           cor2 = {
//             left: items[i].left,
//             top: items[i].top,
//             width: items[i].width,
//             height: items[i].height,
//           };
//         }
//       }
//       console.log(cor1);
//       console.log(cor2);
//       if (cor1 != null) {
//         if (cor2 != null) {
//           if (cor1.top != undefined && cor1.left != undefined) {
//             if (
//               cor2.top != undefined &&
//               cor2.left != undefined &&
//               cor1.width != undefined
//             ) {
//               canvas.add(
//                 new fabric.Line(
//                   [cor1.left - cor1.width, cor1.top, cor2.left, cor2.top],
//                   {
//                     left: cor1?.left,
//                     top: cor1?.top,
//                     stroke: "red",
//                   }
//                 )
//               );
//             }
//           }
//         }
//       }
//     }
//   }
//   useEffect(() => {}, [modalVisible]);
//   const [canvasNodes, setCanvasNodes] = useState<any>();
//   return (
//     <VStack h="100vh" bgColor={"gray.100"}>
//       <NodeModal
//         showModal={modalVisible}
//         setShowModal={setModalVisible}
//         addNode={addNode}
//       />
//       <TransitionModal
//         showModal={transitionModalVisible}
//         setShowModal={setTransitionModalVisible}
//         addTransition={addTransition}
//         nodes={canvasNodes}
//       />
//       <HStack m="auto">
//         <button
//           onClick={() => {
//             setModalVisible(true);
//           }}
//         >
//           Add Node
//         </button>
//         <button
//           onClick={() => {
//             const objects = canvas?.getObjects();
//             setCanvasNodes(objects);
//             setTransitionModalVisible(true);
//           }}
//         >
//           Add Transition
//         </button>
//       </HStack>
//       <Stack m="auto">
//         <canvas id="canvas" />
//       </Stack>
//     </VStack>
//   );
// };
// const TransitionModal = ({
//   showModal,
//   setShowModal,
//   addTransition,
//   nodes,
// }: any) => {
//   //console.log(nodes);
//   if (nodes === undefined) {
//     nodes = [];
//   }
//   if (nodes === null) {
//     nodes = [];
//   }

//   const [service1, setService1] = useState("");
//   const [service2, setService2] = useState("");
//   const handleChange = (text: string) => {
//     console.log(text);
//   };
//   return (
//     <Center>
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <Modal.Content maxWidth="400px">
//           <Modal.CloseButton />
//           <Modal.Header>Add Node Transition</Modal.Header>
//           <Modal.Body>
//             <FormControl>
//               <FormControl.Label>From</FormControl.Label>
//               <Select
//                 selectedValue={service1}
//                 minWidth="200"
//                 placeholder="Choose Node"
//                 _selectedItem={{
//                   bg: "teal.600",
//                   endIcon: <CheckIcon size="5" />,
//                 }}
//                 mt={1}
//                 onValueChange={(itemValue) => setService1(itemValue)}
//               >
//                 {nodes.map((item: any, i: any) => {
//                   return (
//                     <Select.Item key={i} label={item.name} value={item.name} />
//                   );
//                 })}
//               </Select>
//               <FormControl.Label>To</FormControl.Label>
//               <Select
//                 selectedValue={service2}
//                 minWidth="200"
//                 placeholder="Choose Node"
//                 _selectedItem={{
//                   bg: "teal.600",
//                   endIcon: <CheckIcon size="5" />,
//                 }}
//                 mt={1}
//                 onValueChange={(itemValue) => setService2(itemValue)}
//               >
//                 {nodes.map((item: any, i: any) => {
//                   return <Select.Item label={item.name} value={item.name} />;
//                 })}
//               </Select>
//             </FormControl>
//             <button
//               onClick={() => {
//                 addTransition(service1, service2);
//                 setShowModal(false);
//               }}
//             >
//               Add Transition
//             </button>
//           </Modal.Body>
//           <Modal.Footer></Modal.Footer>
//         </Modal.Content>
//       </Modal>
//     </Center>
//   );
// };
// const NodeModal = ({ showModal, setShowModal, addNode }: any) => {
//   const [nodeName, setNodeName] = useState("");
//   const handleChange = (text: string) => {
//     setNodeName(text);
//   };
//   return (
//     <Center>
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <Modal.Content maxWidth="400px">
//           <Modal.CloseButton />
//           <Modal.Header>Add Node Name</Modal.Header>
//           <Modal.Body>
//             <FormControl>
//               <FormControl.Label>Name</FormControl.Label>
//               <Input onChangeText={handleChange} />
//             </FormControl>
//             <button
//               onClick={() => {
//                 addNode(nodeName);
//                 setShowModal(false);
//               }}
//             >
//               Add Node
//             </button>
//           </Modal.Body>
//           <Modal.Footer></Modal.Footer>
//         </Modal.Content>
//       </Modal>
//     </Center>
//   );
// };
