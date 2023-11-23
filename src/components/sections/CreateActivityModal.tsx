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

type Activity = {
    activity_id: number,
    litters_saved: number,
}

type Props = {
    refetch: () => void
}

export default function Modal({ refetch }: Props) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [activity, setActivity] = useState<Activity | null>(null);
    const { toast } = useToast();
    const { user } = useContext(AuthContext);

    function handleSelectChange(value: string) {
        const value_int = parseInt(value);

        setActivity({
            activity_id: value_int,
            litters_saved: activities[value_int - 1].saved_water
        });
    }

    async function createActivity() {
        try {
            const request = await h2overflowApi.post("/activities/create", { ...activity, created_at: date }, {
                headers: {
                    "authorization": user?.token
                }
            });

            if (request.data.success) {
                toast({
                    variant: "success",
                    title: "Activity created successfully!",
                    description: `Saved ${activity?.litters_saved} litters on ${format(date as Date, "PP")}!`,
                    duration: 3000
                });

                setDate(undefined);
                setActivity(null);

                refetch();
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error creating activity",
                description: "Internal server error",
                duration: 3000
            });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusSquare />
                    Add activity
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Register activity</DialogTitle>
                    <DialogDescription>
                        You can register any activities on the date you did them in here!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <h2 className="flex-grow">Which activity:</h2>
                    <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Activity" />
                        </SelectTrigger>
                        <SelectContent>
                            {activities.map(act => <SelectItem value={`${act.activity_id}`} key={act.activity_id}>{act.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <h2 className="flex-grow">When:</h2>
                    <Popover>
                        <PopoverTrigger asChild>
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
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="destructive">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="button" variant="default" disabled={!date || !activity} onClick={createActivity}>
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
