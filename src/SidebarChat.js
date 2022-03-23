import { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./firebaseConnect";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { Link } from "react-router-dom";

function SidebarChat({ addNewChat, name, id }) {
  const [seed, setSeed] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      const q = query(
        collection(db, "rooms/" + id + "/messages/"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const unsubscribe = onSnapshot(q, (roomSnapshot) => {
        const msgs = roomSnapshot.docs.map((doc) => doc.data());
        console.log("last=>", msgs);
        setMessage(msgs);
      });
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = async () => {
    const roomName = prompt("Please enter name for chat");
    console.log(roomName);
    if (roomName) {
      const docRef = await addDoc(collection(db, "rooms"), {
        name: roomName,
      });
      console.log("Document written with ID: ", docRef.id);
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{message[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
