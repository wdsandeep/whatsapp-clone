import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import db from "./firebaseConnect";
// import firebase from "firebase/compat/app";
import {
  doc,
  getDoc,
  addDoc,
  onSnapshot,
  query,
  collection,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import {
  AttachFile,
  MoreVert,
  SearchOutlined,
  InsertEmoticon,
  Mic,
} from "@material-ui/icons";

import { useStateValue } from "./StateProvider";

const Chat = () => {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      // console.log(roomId);
      const getRoomDetail = async () => {
        const docRef = doc(db, "rooms", roomId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data().name);
          setRoomName(docSnap.data().name);
          // get chat from room name
          const q = query(
            collection(db, "rooms/" + roomId + "/messages/"),
            orderBy("timestamp", "asc")
          );
          const unsubscribe = onSnapshot(q, (roomSnapshot) => {
            const msgs = roomSnapshot.docs.map((doc) => doc.data());
            console.log(msgs);
            setMessages(msgs);
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      };
      getRoomDetail();
    }
    return () => {
      // unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("you typed  >>> " + input);
    const docRef = await addDoc(
      collection(db, "rooms/" + roomId + "/messages"),
      {
        message: input,
        name: user.displayName,
        timestamp: serverTimestamp(),
      }
    );
    console.log("Document written with ID: ", docRef.id);

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            {new Date(
              messages[messages?.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages?.map((message) => (
          <p
            key={Math.random()}
            className={`chat__message  ${
              message.name === user.displayName && "chat__reciever"
            } `}
          >
            <span className="chat__name">{message?.name}</span>
            {message?.message}
            <span className="chat__timestamp">
              {new Date(message?.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
};

export default Chat;
