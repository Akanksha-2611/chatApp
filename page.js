'use client'
import React ,{useState,useEffect} from 'react'
import {useRouter} from 'next/navigation'
import { AvatarGenerator } from 'random-avatar-generator'
import Link from 'next/link'
import {auth,firestore} from "@/lib/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import {doc,setDoc} from 'firebase/firestore';

const page = () => {
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')
    const [errors,setErrors]=useState('')
    const [loading,setLoading]=useState('')
    const [avatarUrl,setAvatarUrl]=useState('')
    const router=useRouter();
    
    const generateRandomAvatar=()=>{
        const generator=new AvatarGenerator();
        return generator.generateRandomAvatar();
    }

    const handleRefreshAvatar=()=>{
        setAvatarUrl(generateRandomAvatar())
    }
    
    useEffect(()=>{
        setAvatarUrl(generateRandomAvatar())
    },[])

    const validateForm=()=>{
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors={};
    
        if(!name.trim()){
            newErrors.name='Name is required!'
        }
        if(!email.trim() || !emailRegex.test(email)){
          newErrors.email='Email is invalid!'
        }
        if(password.length<6){
            newErrors.password='Password must be at least 6 characters!'
        }
        if(password!==confirmPassword){
            newErrors.confirmPassword='COnfirm password does not match!'
        }

        setErrors(newErrors)
            return Object.keys(newErrors).length===0;
        
    }
  
     const handleSubmit= async(e)=>{
        e.preventDefault();
        setLoading(true)
        try{
          if(!validateForm()) {
            setLoading(false)
            return;
          }
          const userCredential=await createUserWithEmailAndPassword(auth,email,password);
          const user=userCredential.user;

          const docRef=doc(firestore,'users',user.uid)
          await setDoc(docRef,{
            name,
            email,
            avatarUrl
          })
          router.push('/')
          setErrors({})
        }
        catch(error){
            console.log(error)
        }
        
    }

  return (
    <div className='flex justify-center items-center h-screen p-10 m-2'>
       {/* form */}
       <form  onSubmit={handleSubmit} className='space-y-4 w-full max-w-2xl shadow-lg p-10'>
         <h1 className='text-xl text-center font-semibold text-[#0b3a65ff]'>Chat
         <span className='font-bold text-[#eeab63ff]'>2</span>Chat
         </h1>

       {/*display the Avatar */}
       <div className='flex items-center space-y-2 justify-between border border-gray-200 p-2'>
        <img src={avatarUrl} className='rounded-full h-20 w-20' alt='avatar'/>
        <button onClick={handleRefreshAvatar} type='button' className='btn btn-outline'>New Avatar</button>
       </div>

       {/* name */}
       <div>
        <label className='label'>
            <span className='text-base label-text'>Name</span>
        </label>
        <input
            type='text'
            placeholder='Enter Your Name'
            className='w-full input input-bordered'
            value={name}
            onChange={(e)=>setName(e.target.value)}
        />
        {errors.name && <span className='text-sm text-red-500'>{errors.name}</span>}
       </div>

       {/* email */}
       <div>
        <label className='label'>
            <span className='text-base label-text'>Email</span>
        </label>
        <input
            type='text'
            placeholder='Enter Your Email'
            className='w-full input input-bordered'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
        />
        {errors.email && <span className='text-sm text-red-500'>{errors.email}</span>}
       </div>

       {/* passsword */}
       <div>
        <label className='label'>
            <span className='text-base label-text'>Password</span>
        </label>
        <input
            type='password'
            placeholder='Enter Password'
            className='w-full input input-bordered'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
        />
        {errors.password && <span className='text-sm text-red-500'>{errors.password}</span>}
       </div>

         {/* Confirmpasssword */}
         <div>
        <label className='label'>
            <span className='text-base label-text'>confirmPassword</span>
        </label>
        <input
            type='password'
            placeholder='Confirm your Password'
            className='w-full input input-bordered'
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <span className='text-sm text-red-500'>{errors.confirmPassword}</span>}
       </div>

       <div>
         <button type='submit' className='btn btn-block bg-[#0b3a65ff] text-white'>
            {
                loading?<span className='loading loading-spinner loading-sm'></span>:'Register'
            }
         </button>
       </div>

       <span>Already have an Account?{' '}</span>
          <Link href='/login' className='text-blue-600 hover:text-blue-800 hover:underline'>Login</Link>
       </form>
    </div>
  )
}

export default page