"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts' //set the value to set after a desired milliseconds
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"



const page = () => {
     
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({ //this z.infer lines try to confirm the values should be in signupschema formation
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    

    const onSubmit = async (data: z.infer<typeof signInSchema>) => { //infering the data with the help of zod, which means it should only follow the signinschema
        const result = await signIn("credentials",{ //we are using nextauth for signin
          redirect: false,
          identifier: data.identifier,
          password: data.password
        })
        console.log(result)
        // if(result?.error){ 
        //   toast({
        //     title: "Login failed",
        //     description: "Incorrect username or password",
        //     variant: "destructive"
        //   })
        // }

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
              toast({
                title: 'Login Failed',
                description: 'Incorrect username or password',
                variant: 'destructive',
              });
            } else {
              toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
              });
            }
          }

        if(result?.url){ //after successfull login nextauth will send a url
          router.replace('/dashboard')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Anonymus feedback
                    </h1>
                    <p className="mb-4">Sign In to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 animate-spin" /> Please wait
                                </>
                            ) : ('SignIn')}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        New to Anonymsus Feedback?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page


