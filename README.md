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
// Import necessary dependencies from React and related libraries
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Check, LogOut } from "lucide-react";
import { Metric } from "@tremor/react";

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

// Import the AuthContext to access user information and authentication functions
import { AuthContext } from "@/context/AuthContext";

// Define constants for file upload validation
const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Define the schema for updating user profile
const updateFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not be longer than 20 characters")
    .or(z.string().length(0)),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters long")
    .max(20, "Password must not be longer than 20 characters")
    .or(z.string().length(0)),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must not be longer than 20 characters")
    .or(z.string().length(0)),
  last_names: z
    .string()
    .min(3, "Last names must be at least 3 characters long")
    .max(50, "Last names must not be longer than 50 characters")
    .or(z.string().length(0)),
  units: z.enum(["Lt", "Gal"]).default("Lt"),
  language: z.enum(["English", "Spanish"]).default("English"),
  profile_picture: z.instanceof(File),
});

// Define the Profile component
export default function Profile() {
  // Access user information and authentication functions from AuthContext
  const { user, update, logout } = useContext(AuthContext);
  // Use the navigate function from React Router for navigation
  const navigate = useNavigate();

  // Redirect to login if there is no authenticated user
  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  // Set up the form using react-hook-form and the defined schema
  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      username: user?.username,
      password: "",
      name: user?.name,
      last_names: user?.last_names,
    },
  });

  // Handle file input change for profile picture
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      if (event.target.files[0].size > MAX_FILE_SIZE) {
        updateForm.setError("profile_picture", {
          message: "Max image size is 5MB",
        });
      } else if (
        !ACCEPTED_IMAGE_MIME_TYPES.includes(event.target.files[0].type)
      ) {
        updateForm.setError("profile_picture", {
          message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
        });
      } else {
        updateForm.clearErrors("profile_picture");
      }

      updateForm.setValue("profile_picture", event.target.files[0]);
    }
  }

  // Render the Profile component
  return (
    <section className="flex-grow flex justify-center">
      <div className="w-full md:w-5/6 lg:w-3/4 xl:w-2/3 min-h-full my-10">
        <div className="flex flex-row items-center gap-2">
          {/* Display user's profile using Metric component */}
          <Metric>{user?.username}'s profile!</Metric>
        </div>
        <div className="flex">
          {/* Form for updating user profile */}
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(update)}
              className="space-y-8 w-full"
            >
              {/* Form fields for updating user information */}
              {/* Username field */}
              <FormField
                control={updateForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New username"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password field */}
              <FormField
                control={updateForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormDescription>
                      Leave empty if you don't want to change it
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Name field */}
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
              {/* Last names field */}
              <FormField
                control={updateForm.control}
                name="last_names"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New last names</FormLabel>
                    <FormControl>
                      <Input placeholder="New last names" {...field} />
                    </FormControl>
                    <FormDescription>Eh... whatever, go on...</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Profile picture field */}
              <Controller
                control={updateForm.control}
                name="profile_picture"
                render={() => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select a profile picture"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <FormDescription>Profile picture support yay!</FormDescription>
                    <FormMessage>
                      {updateForm.formState.errors.profile_picture &&
                        updateForm.formState.errors.profile_picture.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* Buttons for submitting and logging out */}
              <div className="flex justify-around items-center">
                {/* Update button */}
                <Button type="submit">
                  <Check className="mr-2 h-4 w-4" />
                  Update!
                </Button>
                {/* Logout button */}
                <Button variant={"destructive"} onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </form>
          </Form>

          {/* Display the user's profile picture */}
          <div className="w-1/2 h-full flex justify-center items-center px-5">
            <img
              src={user?.profile_picture ? user.profile_picture : "/no_pp.jpg"}
              alt="profile picture"
              className="rounded-full w-full h-auto aspect-square object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
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
// Import necessary dependencies from React and related libraries
import React from "react";

// Define the Home component
export default function Home() {
  // Render the Home component
  return (
    <section className="bg-slate-400 flex-grow w-full flex-col">
      {/* Hero section with a video background */}
      <div className="w-full relative">
        {/* Text overlay on the video */}
        <div className="font-medium text-4xl text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-white">
          <h1>It's time we all do our part,</h1>
          <h1 className="inline">
            Do something
            {/* Call-to-action link */}
            <a
              className="inline decoration-none bg-[#0A369D] hover:bg-blue-400 rounded-[10px] px-[5px] transition-all duration-300 ml-2"
              href="/login"
            >
              <span className="inline decoration-none rounded">NOW!</span>
            </a>
          </h1>
        </div>
        {/* Video background */}
        <video
          className="w-full h-full -z-[1] md:aspect-[3.65/1] brightness-50 object-cover object-center"
          autoPlay
          muted
          loop
          src="/video.mp4"
        />
      </div>

      {/* Main content container */}
      <div className="container">
        {/* Introduction section */}
        <div className="flex flex-col md:flex-row w-full h-fit justify-around items-center text-center gap-5 mt-5">
          {/* Text content */}
          <div className="w-full flex-grow">
            <h1 className="text-xl">
              <strong>Welcome to H<sub>2</sub>O<sub>verflow</sub></strong>
            </h1>
            <p className="text-lg">
              We are passionate about conserving one of our planet's most precious resources - water. Our mission is to
              empower you to take control of your water usage and{" "}
              <strong className="underline">reduce your water footprint</strong>. We understand that every drop
              counts, and that's why we've developed an innovative tracking system to help you monitor and manage your
              water consumption like never before.
            </p>
          </div>
          {/* Image illustration */}
          <div className="w-full flex justify-center items-center flex-grow">
            <img className="w-1/3 md:w-1/2 object-center object-cover" src="/water-save.svg" alt="Water Conservation" />
          </div>
        </div>

        {/* Importance of Saving Water section */}
        <div className="flex flex-col-reverse md:flex-row w-full h-fit justify-around items-center text-center gap-5 mt-5 mb-10">
          {/* Image illustration */}
          <div className="w-full flex justify-center items-center flex-grow">
            <img className="w-1/3 md:w-1/2 object-center object-cover" src="/water-drops.svg" alt="Water Drops" />
          </div>
          {/* Text content */}
          <div className="w-full flex-grow">
            <h1 className="text-xl">
              <strong>The Importance of Saving Water</strong>
            </h1>
            <p className="text-lg">
              Water is a fundamental resource, essential for our survival and the health of our planet. Saving water is
              about being responsible stewards of our environment and ensuring a sustainable future. It's a simple yet
              crucial action that contributes to the well-being of our ecosystems, conserves energy, and supports our
              daily needs. By using water wisely, we not only secure our own future but also the future of generations
              to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### src/pages/Dashboard.tsx
```tsx
// Import necessary dependencies from React and related libraries
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInCalendarDays, format } from "date-fns";
import { BarChart, Card, Metric, Subtitle, Title } from "@tremor/react";
import { activities } from "@/constants";
import { h2overflowApi } from "@/h2overflowApi";
import Modal from "@/components/sections/CreateActivityModal";
import { AuthContext } from "@/context/AuthContext";

// Define types for database activities and chart data
type DatabaseActivities = {
  _id: string;
  user: string;
  activity: number;
  created_at: string;
  litters_saved: number;
}[];

type ChartData = {
  date: string;
  litters: number;
}[];

// Function to format raw activities data into chart data
function formatData(activities: DatabaseActivities): ChartData {
  const curr_date = new Date();
  const month_end = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 0);
  const month_start = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);
  const diff_days = differenceInCalendarDays(month_end, month_start);

  let chartdata: ChartData = [];

  for (let i = 0; i < diff_days + 1; i++) {
    const date = new Date(curr_date.getFullYear(), curr_date.getMonth(), i + 1);

    chartdata.push({
      date: format(date, "MMM d"),
      litters: 0,
    });
  }

  for (let i = 0; i < activities.length; i++) {
    const id = differenceInCalendarDays(new Date(activities[i].created_at), month_start);
    chartdata[id].litters += activities[i].litters_saved;
  }

  return chartdata;
}

// Function to format numbers with a unit suffix
function valueFormatter(number: number) {
  return `${new Intl.NumberFormat("us").format(number).toString()} Lt`;
}

// Define the Dashboard component
export default function Dashboard() {
  // Retrieve user information from the context
  const { user } = useContext(AuthContext);

  // State to store formatted chart data and raw activity data
  const [data, setData] = useState<ChartData>([]);
  const [rawData, setRawData] = useState<DatabaseActivities>([]);

  // Hook for navigation
  const navigate = useNavigate();

  // Function to fetch monthly statistics
  async function fetchMonthStats() {
    try {
      // Make an API request to get monthly activities
      const fetch = await h2overflowApi.get("/activities/month", {
        headers: {
          Authorization: user?.token,
        },
      });

      // Update state with fetched data if the request is successful
      if (fetch.data.success) {
        setRawData(fetch.data.month_activities);
        setData(formatData(fetch.data.month_activities));
      }
    } catch (error) {
      // Handle errors here if needed
      console.error("Error fetching monthly statistics:", error);
    }
  }

  // Effect hook to ensure the user is logged in and fetch monthly stats on mount
  useEffect(() => {
    if (!user) navigate("/login");
    fetchMonthStats();
  }, []);

  // Render the Dashboard component
  return (
    <section className="flex-grow flex flex-col items-center py-10 md:px-10">
      <div className="max-w-[96rem]">
        {/* Header section with user greeting and modal for creating activities */}
        <div className="flex flex-row items-center gap-2">
          <Metric color="blue">Dashboard |</Metric>
          <Metric>Welcome {user?.name} {user?.last_names}!</Metric>
        </div>
        <Modal refetch={fetchMonthStats} />

        {/* Card section with a bar chart displaying monthly progress */}
        <Card className="my-5">
          <Title>Your monthly progress:</Title>
          <Subtitle>
            Here you can see a detailed list of all the activities you've performed and how they impact your progress
          </Subtitle>

          {/* Bar chart component */}
          <BarChart
            className="mt-6"
            data={data ?? []}
            index="date"
            categories={["litters"]}
            colors={["blue"]}
            valueFormatter={valueFormatter}
            yAxisWidth={48}
          />
        </Card>

        {/* Grid of cards displaying raw activity data */}
        <div className="px-5 grid grid-flow-row gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-0">
          {rawData.map(datapoint => {
            const { _id, activity, created_at, litters_saved } = datapoint;

            // Format date string
            const date_str = format(new Date(created_at), "MMMM d");

            // Render individual activity card
            return (
              <Card key={_id} className="rounded-t-sm" decoration="top" decorationColor="blue">
                <Title>{date_str}</Title>
                <Subtitle>{activities[activity - 1].name}</Subtitle>
                <Metric>{litters_saved} Lt</Metric>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

### src/context/AuthContext.tsx
#### Context and Types

- **User**: Represents the user information including username, name, last names, units, language, profile picture, and token.
- **LoginCredentials**: Represents the credentials required for user login (email and password).
- **RegisterCredentials**: Represents the credentials required for user registration (username, password, email, last names, name, units, and language).
- **UpdateType**: Represents the information required for updating user details (username, password, name, last names, and profile picture).

#### Context Functions

- **AuthContext**: The context is created using `createContext` and provides the following functions and state:
  - `user`: State to store user information or null if the user is not authenticated.
  - `login`: Function to perform user login with provided credentials.
  - `signin`: Function to perform user registration with provided credentials.
  - `update`: Function to update user details, including the profile picture.
  - `logout`: Function to log the user out.
  - `error`: State to store any authentication-related errors.

##### `requestProfilePicture` Function

- This function is used to make an API request to fetch the user's profile picture using the provided token.

##### `login` Function

- Handles user login by making an API request to the server.
- If successful, updates the user state with the received user information and profile picture.
- Handles different error scenarios (e.g., email not found, wrong password) and updates the error state accordingly.

##### `signin` Function

- Handles user registration by making an API request to the server.
- If successful, updates the user state with the received user information and profile picture.
- Handles different error scenarios (e.g., email already in use) and updates the error state accordingly.

##### `update` Function

- Handles user profile update by making an API request to the server.
- If successful, updates the user state with the received user information and profile picture.
- Handles different error scenarios (e.g., email already in use) and updates the error state accordingly.

##### `logout` Function

- Clears the user state, effectively logging the user out.

##### Context Provider (`AuthContextProvider`)

- Wraps the application with the `AuthContext.Provider` and provides the context's values and functions to its children.

Overall, this context and provider are designed to manage user authentication, including login, registration, profile updates, and logout, while handling various error scenarios. The context is used to share authentication-related state and functions throughout the React application.

```tsx
// Import necessary libraries and components
import { createContext, useState } from 'react';
import jwt from "jwt-client";
import axios, { AxiosError } from "axios";
import { h2overflowApi } from '@/h2overflowApi';

// Define types for user, login credentials, register credentials, and update information
type User = {
    username: string,
    name: string,
    last_names: string,
    units: string | null,
    language: string | null,
    profile_picture: string | null,
    token: string,
}

type LoginCredentials = {
    email: string,
    password: string
}

type RegisterCredentials = {
    username: string,
    password: string,
    email: string,
    last_names: string,
    name: string,
    units: "Lt" | "Gal",
    language: "English" | "Spanish",
}

type UpdateType = {
    username: string,
    password: string,
    name: string,
    last_names: string,
    profile_picture: File
}

// Define the structure of the authentication context
type AuthContext = {
    user: User | null,
    login: (creds: LoginCredentials) => void,
    signin: (creds: RegisterCredentials) => void,
    update: (update_info: UpdateType) => void,
    logout: () => void,
    error: { at: Date, msg: string } | null
}

// Create the authentication context with initial values
export const AuthContext = createContext<AuthContext>({
    user: null,
    login: () => { },
    signin: () => { },
    update: () => { },
    logout: () => { },
    error: null
});

// Context provider component for managing authentication state
export default function AuthContextProvider({ children, }: { children: React.ReactNode }) {
    // State to store user information and authentication errors
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<{ at: Date, msg: string } | null>(null);

    // Function to fetch the user's profile picture from the server
    async function requestProfilePicture(token: string): Promise<string> {
        try {
            // Make an API request to fetch the profile picture
            const profile_picture = await h2overflowApi.get("/users/profile_picture", {
                headers: {
                    authorization: token
                },
                responseType: 'blob'
            });

            // Return the profile picture as a blob URL
            return URL.createObjectURL(profile_picture.data);
        } catch (err) {
            // Handle errors and return an empty string in case of failure
            return "";
        }
    }

    // Function to handle user login
    async function login(creds: LoginCredentials) {
        try {
            // Make an API request to perform user login
            const request = await h2overflowApi.post("/users/login", creds);

            // If login is successful, update user state with received user information
            if (request.data.success) {
                const data = jwt.read(request.data.token).claim;
                setError(null);
                setUser({
                    username: data.username,
                    name: data.name,
                    last_names: data.last_names,
                    language: data.language,
                    profile_picture: await requestProfilePicture(request.data.token),
                    units: data.units,
                    token: request.data.token
                });
            }
        } catch (err: AxiosError | unknown) {
            // Handle different error scenarios and update the error state
            if (axios.isAxiosError(err)) {
                if (err?.request?.status === 404) {
                    setError({ msg: "Email not found", at: new Date() });
                } else if (err?.request?.status === 401) {
                    setError({ msg: "Wrong password", at: new Date() });
                } else {
                    setError({ msg: "Internal server error", at: new Date() })
                }
                return;
            }
            setError({ msg: "Internal server error", at: new Date() });
        }
    }

    // Function to handle user registration
    async function signin(creds: RegisterCredentials) {
        try {
            // Make an API request to perform user registration
            const request = await h2overflowApi.post("/users/create", { ...creds, profile_picture: null });

            // If registration is successful, update user state with received user information
            if (request.data.success) {
                const data = jwt.read(request.data.token).claim;
                setError(null);
                setUser({
                    username: data.username,
                    name: data.name,
                    last_names: data.last_names,
                    language: data.language,
                    profile_picture: await requestProfilePicture(request.data.token),
                    units: data.units,
                    token: request.data.token
                });
            }
        } catch (err: AxiosError | unknown) {
            // Handle different error scenarios and update the error state
            if (axios.isAxiosError(err)) {
                if (err?.request?.status === 409) {
                    setError({ msg: "Email already in use", at: new Date() });
                } else if (err?.request?.status === 400) {
                    setError({ msg: "Internal server error", at: new Date() });
                }
                return;
            }
            setError({ msg: "Internal server error", at: new Date() });
        }
    }

    // Function to handle user profile updates
    async function update(update_info: UpdateType) {
        try {
            // Create a FormData object to send the update information, including the profile picture
            const formData = new FormData();
            formData.append("profile_picture", update_info.profile_picture);

            // Make an API request to update user profile
            const request = await h2overflowApi.post("/users/update", update_info, {
                headers: {
                    authorization: user?.token,
                    "Content-Type": "multipart/form-data"
                }
            });

            // If update is successful, update user state with received user information
            if (request.data.success) {
                const data = jwt.read(request.data.token).claim;
                setError(null);
                setUser({
                    username: data.username,
                    name: data.name,
                    last_names: data.last_names,
                    language: data.language,
                    profile_picture: await requestProfilePicture(request.data.token),
                    units: data.units,
                    token: request.data.token
                });
            }
        } catch (err: AxiosError | unknown) {
            // Handle different error scenarios and update the error state
            if (axios.isAxiosError(err)) {
                if (err?.request?.status === 409) {
                    setError({ msg: "Email already in use", at: new Date() });
                } else if (err?.request?.status === 400) {
                    setError({ msg: "Internal server error", at: new Date() });
                }
                return;
            }
            setError({ msg: "Internal server error", at: new Date() });
        }
    }

    // Function to log the user out by clearing the user state
    function logout() {
        setUser(null);
    }

    // Return the context provider with values and functions
    return <AuthContext.Provider value={{ user, error, login, signin, update, logout }}>
        {children}
    </AuthContext.Provider>
}
```

### src/components/sections/CreateActivityModal.tsx
```tsx
// Import necessary libraries, components, and styles
import { PlusSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { useContext, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { activities } from "@/constants";
import { useToast } from "../ui/use-toast";
import { AuthContext } from "@/context/AuthContext";
import { h2overflowApi } from "@/h2overflowApi";

// Define types for the activity and props
type Activity = {
    activity_id: number,
    litters_saved: number,
}

type Props = {
    refetch: () => void
}

// Modal component to register activities
export default function Modal({ refetch }: Props) {
    // State variables for date, selected activity, toast, and user context
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [activity, setActivity] = useState<Activity | null>(null);
    const { toast } = useToast();
    const { user } = useContext(AuthContext);

    // Function to handle activity selection from the dropdown
    function handleSelectChange(value: string) {
        const value_int = parseInt(value);

        setActivity({
            activity_id: value_int,
            litters_saved: activities[value_int - 1].saved_water
        });
    }

    // Function to create a new activity
    async function createActivity() {
        try {
            // Make an API request to create a new activity
            const request = await h2overflowApi.post("/activities/create", { ...activity, created_at: date }, {
                headers: {
                    "authorization": user?.token
                }
            });

            // If the activity creation is successful, display a success toast
            if (request.data.success) {
                toast({
                    variant: "success",
                    title: "Activity created successfully!",
                    description: `Saved ${activity?.litters_saved} litters on ${format(date as Date, "PP")}!`,
                    duration: 3000
                });

                // Reset date and activity states and trigger a refetch
                setDate(undefined);
                setActivity(null);
                refetch();
            }
        } catch (err) {
            // If there's an error, display a destructive toast
            toast({
                variant: "destructive",
                title: "Error creating activity",
                description: "Internal server error",
                duration: 3000
            });
        }
    }

    // Render the modal component
    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* Button to trigger the modal */}
                <Button variant="outline">
                    <PlusSquare />
                    Add activity
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {/* Modal content */}
                <DialogHeader>
                    {/* Header title and description */}
                    <DialogTitle>Register activity</DialogTitle>
                    <DialogDescription>
                        You can register any activities on the date you did them in here!
                    </DialogDescription>
                </DialogHeader>
                {/* Dropdown for selecting an activity */}
                <div className="flex items-center space-x-2">
                    <h2 className="flex-grow">Which activity:</h2>
                    <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Activity" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Dropdown options based on predefined activities */}
                            {activities.map(act => <SelectItem value={`${act.activity_id}`} key={act.activity_id}>{act.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                {/* Date selection with a popover calendar */}
                <div className="flex items-center space-x-2">
                    <h2 className="flex-grow">When:</h2>
                    <Popover>
                        <PopoverTrigger asChild>
                            {/* Button to trigger the calendar popover */}
                            <Button
                                variant={"outline"}
                                className={`w-1/2 pl-3 text-left font-normal ${!date && "text-muted-foreground"}`}
                            >
                                {date ?
                                    <span>{format(date, 'PPP')}</span> :
                                    <span>Pick a date</span>
                                }
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        {/* Calendar popover content */}
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date ?? new Date()}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                {/* Modal footer with close and add buttons */}
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        {/* Close button */}
                        <Button type="button" variant="destructive">
                            Close
                        </Button>
                    </DialogClose>
                    {/* Add button */}
                    <Button type="button" variant="default" disabled={!date || !activity} onClick={createActivity}>
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
```


### src/components/sections/Footer.tsx
```tsx
// Import necessary libraries and components
import { Link } from "react-router-dom";

// Footer component
export default function Footer() {
    return (
        <footer className="bg-white">
            <div
                className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8"
            >
                {/* Header section */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    {/* Brand/logo and site name */}
                    <div className="flex flex-shrink-0 items-center font-bold text-xl">
                        <img src="/gota.png" className="object-cover object-center" width={25} />
                        H<sub>2</sub>O<sub>verflow</sub>
                    </div>

                    {/* Navigation links */}
                    <ul className="mt-8 flex justify-start gap-6 sm:mt-0 sm:justify-end">
                        {/* GitHub link */}
                        <li>
                            <a
                                href="https://github.com/Valkary/h2overflow/tree/final"
                                rel="noreferrer"
                                target="_blank"
                                className="text-gray-700 transition hover:opacity-75"
                            >
                                <span className="sr-only">GitHub</span>
                                {/* GitHub icon */}
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Navigation links */}
                <div
                    className="grid grid-cols-1 gap-8 border-t border-gray-100 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:pt-16"
                >
                    {/* About us link */}
                    <Link to="/#about" className="text-gray-700 transition hover:opacity-75">
                        About us
                    </Link>
                    {/* Contact link */}
                    <Link to="/#contact" className="text-gray-700 transition hover:opacity-75">
                        Contact
                    </Link>
                    {/* Profile link */}
                    <Link to="/profile" className="text-gray-700 transition hover:opacity-75">
                        Profile
                    </Link>
                    {/* Dashboard link */}
                    <Link to="/dashboard" className="text-gray-700 transition hover:opacity-75">
                        Dashboard
                    </Link>
                </div>

                {/* Copyright notice */}
                <p className="text-xs text-gray-500">
                    &copy; 2023. H2Overflow. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
```

### src/components/sections/Navbar.tsx
```tsx
// Import necessary libraries and components
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Define possible routes
type Routes = "home" | "dashboard" | "profile";

// Navbar component
export default function Navbar() {
    // Retrieve user information from AuthContext
    const { user } = useContext(AuthContext);

    // State to manage mobile menu visibility
    const [open, setOpen] = useState(false);

    // Get current location and navigation function from react-router-dom
    const location = useLocation();
    const navigate = useNavigate();

    // State to track the current route
    const [route, setRoute] = useState<Routes>("home");

    // Update route state based on the current location
    useEffect(() => {
        switch (true) {
            case (location.pathname === "/"): {
                setRoute("home");
                break;
            }
            case (location.pathname.includes("dashboard")): {
                setRoute("dashboard");
                break;
            }
            case (location.pathname.includes("profile")): {
                setRoute("profile");
                break;
            }
        }
    }, [location]);

    // Navbar JSX
    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                            onClick={() => setOpen(!open)}
                        >
                            {/* Hamburger icon */}
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Brand/logo and site name */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center text-white font-bold text-xl">
                            <img src="/gota.png" className="object-cover object-center" width={25} />
                            H<sub>2</sub>O<sub>verflow</sub>
                        </div>

                        {/* Navigation links for larger screens */}
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link to="/" className={`${route === "home" ? "bg-gray-900 text-white" : "hover:bg-gray-700 hover:text-white"} text-gray-300 rounded-md px-3 py-2 text-sm font-medium`}>Home</Link>
                                <Link to="/dashboard" className={`${route === "dashboard" ? "bg-gray-900 text-white" : "hover:bg-gray-700 hover:text-white"} text-gray-300 rounded-md px-3 py-2 text-sm font-medium`} aria-current="page">Dashboard</Link>
                                <Link to="/profile" className={`${route === "profile" ? "bg-gray-900 text-white" : "hover:bg-gray-700 hover:text-white"} text-gray-300 rounded-md px-3 py-2 text-sm font-medium`}>Profile</Link>
                            </div>
                        </div>
                    </div>

                    {/* User profile image */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="relative ml-3">
                            <div>
                                <button type="button"
                                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    onClick={() => navigate("/profile")}
                                >
                                    <span className="absolute -inset-1.5"></span>
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full object-cover object-center" src={user?.profile_picture ? user.profile_picture : "/no_pp.jpg"} alt="Profile picture" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${open ? "sm:hidden" : "hidden"}`} id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <Link to="/" className={`${route === "home" ? "bg-gray-900" : "hover:bg-gray-700 hover:text-white"} text-white block rounded-md px-3 py-2 text-base font-medium`} aria-current="page">Home</Link>
                    <Link to="/dashboard" className={`${route === "dashboard" ? "bg-gray-900" : "hover:bg-gray-700 hover:text-white"} text-white block rounded-md px-3 py-2 text-base font-medium`}>Dashboard</Link>
                    <Link to="/profile" className={`${route === "profile" ? "bg-gray-900" : "hover:bg-gray-700 hover:text-white"} text-white block rounded-md px-3 py-2 text-base font-medium`}>Profile</Link>
                </div>
            </div>
        </nav>
    );
}
```