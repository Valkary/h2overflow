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
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, UserPlus } from "lucide-react";

const loginFormSchema = z.object({
    email: z.string().email("Must be a valid email"),
    password: z.string().min(3, "Password must be at least 3 characters long").max(30, "Password is too large")
});

const registerFormSchema = z.object({
    email: z.string().email("Must be a valid email"),
    username: z.string().min(3, "Username must be at least 5 characters long").max(30, "Maximum limit exceded"),
    password: z.string().min(3, "Password must be at least 3 characters long").max(30, "Password is too large"),
    name: z.string().min(3, "Name must be at least 5 characters long").max(45, "Maximum limit exceded"),
    last_names: z.string().min(3, "Name must be at least 5 characters long").max(45, "Maximum limit exceded"),
    language: z.enum(["English", "Spanish"]),
    units: z.enum(["Lt", "Gal"]),
});

export default function Login() {
    const { toast } = useToast();
    const { user, login, signin, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: ""
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
            language: "English"
        }
    });

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error.msg,
                variant: "destructive",
                duration: 3000
            });
        }

        if (user) navigate("/dashboard");
    }, [user, error]);

    return <section className=" bg-cover bg-no-repeat bg-water h-[100vh] w-[100vw] overflow-hidden flex justify-center items-center">
        <div className="p-5 flex flex-col items-center justify-center bg-white w-full h-full sm:w-2/3 md:w-1/2 lg:w-1/3 rounded-lg">
            <div className="flex flex-col justify-center items-center w-full">
                <div className="flex flex-shrink-0 items-center font-bold text-3xl">
                    <img src="/gota.png" className="object-cover object-center" width={25} />
                    H<sub>2</sub>O<sub>verflow</sub>
                </div>
                <h1 className="text-2xl tracking-tighter font-bold">Sign in to your account</h1>
            </div>
            <div className="w-full flex justify-center py-5">
                <Tabs defaultValue="login" className="w-full flex flex-col items-center">
                    <TabsList>
                        <TabsTrigger value="login">Sign in</TabsTrigger>
                        <TabsTrigger value="register">Sign up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="w-full">
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(login)} className="space-y-5 w-full flex flex-col items-center">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email@real.com" {...field} />
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
                                                <Input placeholder="really secure password" type="password" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Super secure non hackable password comes here
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
                            <form onSubmit={registerForm.handleSubmit(signin)} className="space-y-5 w-full flex flex-col items-center">
                                <FormField
                                    control={registerForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="cool username goes here" {...field} />
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
                                                    <Input placeholder="real name goes here" {...field} />
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
                                                    <Input placeholder="last name goes here" {...field} />
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
                                                    <Input placeholder="email@real.com" {...field} />
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
                                                    <Input placeholder="really secure password" type="password" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Super secure non hackable password comes here
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
                                                    <Select {...field} onValueChange={(e) => field.onChange(e)}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue {...field} placeholder="Units" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Lt">Litters</SelectItem>
                                                            <SelectItem value="Gal">Galons</SelectItem>
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
                                                    <Select {...field} onValueChange={(e) => field.onChange(e)}>
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
}
