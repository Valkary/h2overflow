# Docs
## Build tool
This project is developed using the Vite build tool.

## Libraries
- react
- axios 
- react-hook-form
- shadcn/ui
- tailwindcss
- react-router-dom
- typescript
- tremor
- zod
- date-fns

## Project setup
- The entry file for the project is in src/main.tsx and import paths startig with "@/" automatically resolve to "./src" folder
- All the tailwind configuration for both the tremor and shadcn/ui libraries is located in "./tailwind.config.js"

## How to use this project?
### Clone the correct branch
```bash
git clone --branch final https://github.com/Valkary/h2overflow.git
cd h2overflow
npm install
```

### Run development server
```bash
npm run dev
```

### Build production static site
```bash
npm run build
```

## File docs
### src/h2overflowApi.ts
```ts
// Import the Axios library
import axios, { AxiosRequestConfig } from "axios";

// Create an instance of Axios with a base URL and other configurations
export const h2overflowApi = axios.create({
    baseURL: "https://h2overflow-server.onrender.com/api", // Base URL for API requests
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json', // Set the content type for JSON data
    },
});

// Add an interceptor to the Axios instance for modifying requests before they are sent
h2overflowApi.interceptors.request.use(
    // Callback function executed before each request is sent
    (config: AxiosRequestConfig) => {
        // Check if an authorization token is present in the local storage
        if (localStorage.getItem('token')) {
            // If a token is present, add it to the request headers
            config.headers = {
                ...config.headers,
                authorization: localStorage.getItem('token'),
            } as any;
        }
        // Return the modified configuration
        return config;
    },
    // Callback function executed when an error occurs in the request interceptor
    error => {
        // Reject the promise with the error
        return Promise.reject(error);
    }
);
```

### src/App.tsx
```tsx
// Import necessary dependencies from React and React Router
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Import components and pages used in the application
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/sections/Navbar";
import Home from "./pages/Home";

// Define the main App component
export default function App() {
  // Access the user object from the authentication context
  const { user } = useContext(AuthContext);

  // Render the main application using React Router for navigation
  return (
    <BrowserRouter>
      <div className="w-full min-h-[100vh] flex flex-col">
        {/* Use the Routes component to define routes for different pages */}
        <Routes>
          {/* Define the route for the home page */}
          <Route
            path="/"
            element={
              <>
                {/* Render the Navbar component for navigation */}
                <Navbar />
                {/* Render the Home component for the home page */}
                <Home />
              </>
            }
          />
          {/* Define the route for the login page */}
          <Route path="/login" element={<Login />} />
          {/*
            Define the route for the dashboard page
            Check if a user is authenticated, if true, render Dashboard and Navbar, else, navigate to login
          */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <>
                  <Navbar />
                  <Dashboard />
                </>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          {/*
            Define the route for the profile page
            Check if a user is authenticated, if true, render Profile and Navbar, else, navigate to login
          */}
          <Route
            path="/profile"
            element={
              user ? (
                <>
                  <Navbar />
                  <Profile />
                </>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

### src/pages/Profile.tsx
```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import { Check, LogOut } from "lucide-react";
import { Metric } from "@tremor/react";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const updateFormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must not be longer than 20 characters").or(z.string().length(0)),
    password: z.string().min(3, "Password must be at least 3 characters long").max(20, "Password must not be longer than 20 characters").or(z.string().length(0)),
    name: z.string().min(3, "Name must be at least 3 characters long").max(20, "Name must not be longer than 20 characters").or(z.string().length(0)),
    last_names: z.string().min(3, "Last names must be at least 3 characters long").max(50, "Last names must not be longer than 50 characters").or(z.string().length(0)),
    units: z.enum(["Lt", "Gal"]).default("Lt"),
    language: z.enum(["English", "Spanish"]).default("English"),
    profile_picture: z.instanceof(File)
});

export default function Profile() {
    const { user, update, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/login");
    }, []);

    const updateForm = useForm<z.infer<typeof updateFormSchema>>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            username: user?.username,
            password: "",
            name: user?.name,
            last_names: user?.last_names,
        },
    });

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            if (event.target.files[0].size > MAX_FILE_SIZE) {
                updateForm.setError("profile_picture", { message: "Max image size is 5MB" });
            } else if (!ACCEPTED_IMAGE_MIME_TYPES.includes(event.target.files[0].type)) {
                updateForm.setError("profile_picture", { message: "Only .jpg, .jpeg, .png and .webp formats are supported." });
            } else {
                updateForm.clearErrors("profile_picture");
            }

            updateForm.setValue("profile_picture", event.target.files[0]);
        }
    }

    return <section className="flex-grow flex justify-center">
        <div className="w-full md:w-5/6 lg:w-3/4 xl:w-2/3 min-h-full my-10">
            <div className="flex flex-row items-center gap-2">
                <Metric>{user?.username}'s profile!</Metric>
            </div>
            <div className="flex">
                <Form {...updateForm}>
                    <form onSubmit={updateForm.handleSubmit(update)} className="space-y-8 w-full">
                        <FormField
                            control={updateForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New username" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={updateForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New password" {...field} type="password" />
                                    </FormControl>
                                    <FormDescription>
                                        Leave empty if you don't want to change it
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={updateForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        You lied to us at first, didn't you?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={updateForm.control}
                            name="last_names"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New last names</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New last names" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Eh... whatever, go on...
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Controller
                            control={updateForm.control}
                            name="profile_picture"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Profile picture</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Select a profile picture" type="file" onChange={handleFileChange} />
                                    </FormControl>
                                    <FormDescription>
                                        Profile picture support yay!
                                    </FormDescription>
                                    <FormMessage>
                                        {updateForm.formState.errors.profile_picture && updateForm.formState.errors.profile_picture.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-around items-center">
                            <Button type="submit">
                                <Check className="mr-2 h-4 w-4" />
                                Update!
                            </Button>
                            <Button variant={"destructive"} onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </form>
                </Form>

                <div className="w-1/2 h-full flex justify-center items-center px-5">
                    <img src={user?.profile_picture ? user.profile_picture : "/no_pp.jpg"} alt="profile picture" className="rounded-full w-full h-auto aspect-square object-cover object-center" />
                </div>
            </div>
        </div>
    </section>
}
```

### src/pages/Login.tsx
```tsx
// Import necessary dependencies from React and related libraries
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { LogIn, UserPlus } from "lucide-react";

// Import UI components and form-related components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import the AuthContext to access authentication functions and user information
import { AuthContext } from "@/context/AuthContext";

// Import custom hook for displaying toasts
import { useToast } from "@/components/ui/use-toast";

// Define form validation schemas for login and register forms
const loginFormSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters long")
    .max(30, "Password is too large"),
});

const registerFormSchema = z.object({
  email: z.string().email("Must be a valid email"),
  username: z
    .string()
    .min(3, "Username must be at least 5 characters long")
    .max(30, "Maximum limit exceeded"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters long")
    .max(30, "Password is too large"),
  name: z
    .string()
    .min(3, "Name must be at least 5 characters long")
    .max(45, "Maximum limit exceeded"),
  last_names: z
    .string()
    .min(3, "Name must be at least 5 characters long")
    .max(45, "Maximum limit exceeded"),
  language: z.enum(["English", "Spanish"]),
  units: z.enum(["Lt", "Gal"]),
});

// Define the Login component
export default function Login() {
  // Access authentication functions, user information, and toast function
  const { toast } = useToast();
  const { user, login, signin, error } = useContext(AuthContext);
  // Use the navigate function from React Router for navigation
  const navigate = useNavigate();

  // Set up the login and register forms using react-hook-form and the defined schemas
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      last_names: "",
      name: "",
      password: "",
      units: "Lt",
      language: "English",
    },
  });

  // Display a toast for errors and navigate to the dashboard on successful login
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.msg,
        variant: "destructive",
        duration: 3000,
      });
    }

    if (user) navigate("/dashboard");
  }, [user, error]);

  // Render the Login component
  return (
    <section className=" bg-cover bg-no-repeat bg-water h-[100vh] w-[100vw] overflow-hidden flex justify-center items-center">
      <div className="p-5 flex flex-col items-center justify-center bg-white w-[80%] sm:w-2/3 md:w-1/2 lg:w-1/3 rounded-lg">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-shrink-0 items-center font-bold text-3xl">
            <img src="/gota.png" className="object-cover object-center" width={25} />
            H<sub>2</sub>O<sub>verflow</sub>
          </div>
          <h1 className="text-2xl tracking-tighter font-bold">
            Sign in to your account
          </h1>
        </div>
        <div className="w-full flex justify-center py-5">
          <Tabs defaultValue="login" className="w-full flex flex-col items-center">
            <TabsList>
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="w-full">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(login)}
                  className="space-y-5 w-full flex flex-col items-center"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@real.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The email you used to create your account
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="really secure password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Super secure non-hackable password comes here
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in!
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register" className="w-full">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(signin)}
                  className="space-y-5 w-full flex flex-col items-center"
                >
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="cool username goes here"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What should we call you?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex gap-2">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="real name goes here"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            But what are you actually called?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="last_names"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Last names</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="last name goes here"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Be honest with us :D
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full flex gap-2">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@real.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Unregistered email for the account
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="really secure password"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Super secure non-hackable password comes here
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full flex gap-2">
                    <Controller
                      control={registerForm.control}
                      name="units"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Units</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              onValueChange={(e) => field.onChange(e)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue {...field} placeholder="Units" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Lt">Litters</SelectItem>
                                <SelectItem value="Gal">Gallons</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            What units do you prefer?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      control={registerForm.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              onValueChange={(e) => field.onChange(e)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue {...field} placeholder="Language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            In what language should we talk to you?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign up!
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
```

### src/pages/Home.tsx
```tsx
```
