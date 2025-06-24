"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Camera, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export function ProfileForm() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Admin User",
      email: "admin@example.com",
      bio: "E-commerce store administrator with 5+ years of experience in online retail management.",
      jobTitle: "Store Administrator",
      phone: "+1 (555) 123-4567",
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onProfileSubmit(data: ProfileFormValues) {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    }, 1000)
  }

  function onPasswordSubmit(data: PasswordFormValues) {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsSaving(false)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }, 1000)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      {isSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your changes have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account information and profile details</CardDescription>
          </CardHeader>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-user.jpg" alt="Admin User" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 800K</div>
                    <Button type="button" variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Your job title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>Brief description for your profile. URLs are hyperlinked.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      <TabsContent value="password" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
              <CardContent className="space-y-4">
                <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>Make sure to use a strong password that you don't use elsewhere.</AlertDescription>
                </Alert>

                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>At least 8 characters with a mix of letters, numbers & symbols.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Notification preferences will be available soon.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

