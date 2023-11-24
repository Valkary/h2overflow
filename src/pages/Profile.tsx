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

    return <section className="flex-grow flex justify-center px-5 lg:px-0">
        <div className="w-full md:w-5/6 lg:w-3/4 xl:w-2/3 min-h-full my-10">
            <div className="flex flex-row items-center gap-2">
                <Metric>{user?.username}'s profile!</Metric>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex lg:hidden w-1/2 h-full justify-center items-center px-5">
                    <img src={user?.profile_picture ? user.profile_picture : "/no_pp.jpg"} alt="profile picture" className="rounded-full w-full h-auto aspect-square object-cover object-center" />
                </div>

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

                <div className="hidden lg:flex w-1/2 h-full justify-center items-center px-5">
                    <img src={user?.profile_picture ? user.profile_picture : "/no_pp.jpg"} alt="profile picture" className="rounded-full w-full h-auto aspect-square object-cover object-center" />
                </div>
            </div>
        </div>
    </section>
}