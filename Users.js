'use client'
import React,{useState,useEffect} from 'react'
import UserCard from './UserCard'
import {firestore,app} from '@/lib/firebase'
import {collection,onSnapshot,query,addDoc,serverTimestamp,where,getDocs, querySnapshot} from 'firebase/firestore'
import {getAuth,signOut} from 'firebase/auth'
import {toast} from 'react-hot-toast'
import { useRouter } from 'next/navigation'

function Users({userData,setSelectedChatroom}) {
  const [activeTab,setActiveTab]=useState('user');
  const [loading,setLoading]=useState(false);
  const [loading2,setLoading2]=useState(false)
  const [users,setUsers]=useState([]);
  const [userChatrooms,setUserChatrooms]=useState([]);
  const auth=getAuth(app);
  const router=useRouter();

  const handleTabClick=(tab)=>{
    setActiveTab(tab);
  }

  // get all users
  useEffect(() => {
    setLoading(true);
    const usersQuery = query(collection(firestore, 'users'));
  
    const unsubscribe = onSnapshot(usersQuery, (QuerySnapshot) => {
      const users = QuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(users);
      setLoading(false);
     
    });
  
    return unsubscribe;
  }, []);
  
  const handleLogout=()=>{
    signOut(auth).then(()=>{
      toast.success('Logout successful');
      router.push('login');
    }).catch((err)=>{
      toast.error(err.message)
    })
  }

  // get users chatrooms
  useEffect(()=>{
    setLoading2(true);
    if(!userData){
      return;
    }
    const chatroomsQuery=query(collection(firestore,'chatrooms'),where('users','array-contains',userData?.id));
    
    const unsubscribe = onSnapshot(chatroomsQuery,(querySnapshot)=>{
      const chatrooms=querySnapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
      }));
      console.log(chatrooms);
      setUserChatrooms(chatrooms);
      setLoading2(false)
    });
    return unsubscribe;
  },[userData]);
  // console.log(users);
  // console.log(userData?.id)

// console.log(userChatrooms);

  const createChat=async(user)=>{
    // check if chatroom already exists
    const existingChatroom=query(collection(firestore,'chatrooms'),where('users','==',[user.id,userData.id]));
    try{
      const existingChatroomSnapshot=await getDocs(existingChatroom);
      if(existingChatroomSnapshot.docs.length>0){
        toast.error('Chatroom already exists');
        return;
      }
      // chatroom does not exist,create one
      const usersData={
        [userData.id]:userData,
        [user.id]:user,
      }
      const chatroomData={
        users:[user.id,userData.id],
        usersData,
        Timestamp:serverTimestamp(),
        lastMessage:null,
      }
      const chatroomRef=await addDoc(collection(firestore,'chatrooms'),chatroomData);
      console.log('chatroom created with id',chatroomRef.id);
      setActiveTab('Chatrooms');
      }catch(err){
        toast.error(err.message);
      }
   }
  
  const openChat=async(chatroom)=>{
     const data={
      id:chatroom.id,
      myData:userData,
      otherData:chatroom.userData[chatroom.users.find((id)=>id!==userData?.id)],
     }
     setSelectedChatroom(data);
  }
  return (
    <div className='shadow-lg h-screen overflow-auto mt-4 mb-20'>
      <div className='flex justify-between p-4'>
        <button onClick={()=>handleTabClick("users")} className={`btn btn-outline ${activeTab==='users' ? 'btn-primary':''}`}>
          Users
        </button>
        <button onClick={()=>handleTabClick("chatrooms")} className={`btn btn-outline ${activeTab=== 'chatrooms' ? 'btn-primary':''}`}>
          ChatRooms
        </button>
        <button onClick={handleLogout} className={`btn btn-outline`}>
          Logout
        </button>
      </div>

      <div>
        {
          activeTab==="Chatrooms" && (
            <>
            <h1 className='px-4 text-base font-semibold'>ChatRooms</h1>
              
             {
              userChatrooms.map((chatroom)=>(
                <div key={chatroom.id} onClick={()=>{openChat(chatroom)}}>
                  <UserCard
                    name={chatroom.usersData[chatroom.users.find((id)=>id!==userData?.id)].name}
                    avatarUrl={chatroom.usersData[chatroom.users.find((id)=>id!==userData?.id)].avatarUrl}
                    latestMessageText={chatroom.lastMessage}
                    time="2h ago"
                    type={"chat"}
                  />
                </div>
              ))
             }
            </>
          )
        }
      </div>

      
      <div>
        {
          activeTab==="users" && (
            <>
            <h1 className='px-4 text-base font-semibold'>Users</h1>
            {
              loading ? <p>Loading...</p>:
              users.map((user)=>(
                user.id !== userData?.id &&
                <div key={user.id} onClick={()=>{createChat(user)}}>
               
                <UserCard 
                  key={user.id}
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  time="2h ago"
                  type={"users"}
                /></div>
               
              ))
            }
          </>
          )
        }
      </div>

    </div>
  )
}

export default Users