import React,{useState,useEffect,useRef} from 'react'
import {firestore} from '@/lib/firebase'
import { addDoc,collection,doc,serverTimestamp,onSnapshot,query,where,orderBy,updateDoc} from 'firebase/firestore'
import MessageCard from './MessageCard'
import MessageInput from './MessageInput'

function ChatRoom({user,selectedChatroom}) {
  const me=selectedChatroom?.myData;
  const other=selectedChatroom?.otherData;
  const chatRoomId=selectedChatroom?.id;

  console.log(me,other,chatRoomId);
  const [message,setMessage]=useState('');
  const [messages,setMessages]=useState([]);
  const [image,setImage]=useState(null);
  const messagesContainerRef=useRef(null);
  
  useEffect(()=>{
    if(!chatRoomId){
      return;
    }
    const unsubscribe = onSnapshot(query(collection(firestore,'messages'),where('chatRoomId','==',chatRoomId),orderBy('time','asc')),(snapshot)=>{
      const messages=snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });
  return unsubscribe;
  },[chatRoomId]);

  console.log(messages);

  const sendMessage=async(e)=>{
  const messagesCollection=collection(firestore,'messages');
   if(message.trim()=='' && !image){
     return;
    }
    try{
      const messageData={
        chatRoomId:chatRoomId,
        sender: me.id,
        content: message,
        time: serverTimestamp(),
        image: image,
        messageType:'text',
      };
    await addDoc(messagesCollection, messageData);
    setMessage('');
    setImage(null);

    const chatroomRef = doc(firestore, 'chatrooms', chatRoomId);
    await updateDoc(chatroomRef, { lastMessage: message ? message : "Image" ,});

    }
    catch (error) {
      console.error('Error sending message:', error.message);
    }

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }
  return (
    <div className='flex flex-col h-screen'>
      <div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-10'>
        {/* message cards */}
        {
          messages.map((message)=>(
            <MessageCard key={message.id} message={message} me={me} other={other}/>
          ))
        }
      </div>
      {/* message input */}
      <MessageInput sendMessage={sendMessage} message={message} setMessage={setMessage} image={image} setImage={setImage}/>
    </div>
  );
}

export default ChatRoom


