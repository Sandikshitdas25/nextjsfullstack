//we tested the nextauth by adding a sign-in button

"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts' //set the value to set after a desired milliseconds


const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const useDebouncedUsername = useDebounceValue(username, 300) //If we dont use this function a request will be sent with every letter of the username is typed 
  //Using this func the we will use useDebouncedUsername which will be changed after a time and then we will send the req
  return (
    <div>
      
    </div>
  )
}

export default page


