import React from 'react'
import moment from 'moment';


function MessageCard({message,me,other}) {
  const isMessageFromMe=message.senderId===me.id;
 
  const timeAgo=(time)=>{
    const date=time?.toDate();
    const momentDate=moment(date);
    return momentDate.fromNow();
  }
    return (
    <div key={message.id} className={`flex mb-4 ${isMessageFromMe? 'justify-end':'justify-start'}`}>
    {/* avatar on the left */}
    <div className={`w-10 h-10 ${isMessageFromMe ? 'ml-2 mr-2':'mr-2'}`}>
    {
      !isMessageFromMe && (
        <img 
          className='w-full h-full object-cover rounded-full'
          src={other.avatarUrl}
          alt='Avatar'
        />
      )
    }
    {
      isMessageFromMe && (
        <img 
          className='w-full h-full  rounded-full'
          src={me.avatarUrl}
          alt='Avatar'
        />
      )
    }
      
    </div>
    {/*Message bubble on the right or left based on the sender */} 
    <div className={`text-white p-2 rounded-md ${isMessageFromMe ? 'bg-blue-500 self-end':'bg-[#19D39E] self-start'}`}>

    {
      message.image && (
        <img 
          className='w-60 h-60 object-cover rounded-md'
          src={message.image}
          alt='Message'
        />
      )
    }
      <p>{message.content}</p>
      <div className='text-xs text-gray-300'>{timeAgo(message.time)}</div>
    </div>      
    </div>
  )
}

export default MessageCard
