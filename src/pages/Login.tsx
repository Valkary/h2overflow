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
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"

const formSchema = z.object({
    email: z.string().email("Must be a valid email"),
    password: z.string().min(3, "Password must be at least 3 characters long").max(5, "Too long daddy")
})

export default function Login() {
    const { login, user } = useContext(AuthContext);

    console.log("user", user);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    return <div className="p-5 flex flex-col items-center bg-gray-50">
        <div className="flex flex-col justify-center items-center w-full">
            <img src="/logo.png" className="object-cover object-center" />
            <h1 className="text-3xl tracking-tighter font-bold">Welcome back!</h1>
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
}
