import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useContext, useEffect } from "react"
import { AuthContext } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

const formSchema = z.object({
    email: z.string().email("Must be a valid email"),
    password: z.string().min(3, "Password must be at least 3 characters long").max(5, "Too long daddy")
});

export default function Login() {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    useEffect(() => {
        if (user) navigate("/profile");
    }, [user]);

    return <section className=" bg-cover bg-no-repeat bg-water h-[100vh] w-[100vw] overflow-hidden flex justify-center items-center">
        <div className="p-5 flex flex-col items-center justify-center bg-white w-[80%] sm:w-2/3 md:w-1/2 lg:w-1/3 rounded-lg">
            <div className="flex flex-col justify-center items-center w-full">
                <div className="flex flex-shrink-0 items-center font-bold text-3xl">
                    <img src="/gota.png" className="object-cover object-center" width={25} />
                    H<sub>2</sub>O<sub>verflow</sub>
                </div>
                <h1 className="text-2xl tracking-tighter font-bold">Sign in to your account</h1>
            </div>
            <div className="w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(login)} className="space-y-5 w-full flex flex-col items-center">
                        <FormField
                            control={form.control}
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
                            control={form.control}
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
                        <Button type="submit" className="w-1/3">Login</Button>
                    </form>
                </Form>
            </div>
        </div>
    </section>
}
