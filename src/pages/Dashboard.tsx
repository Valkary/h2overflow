import Modal from "@/components/sections/CreateActivityModal";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInCalendarDays, format } from "date-fns";
import { BarChart, Card, Subtitle, Title } from "@tremor/react";

type DatabaseActivities = {
    _id: string,
    user: string,
    activity: number,
    created_at: string,
    litters_saved: number
}[];

type ChartData = {
    date: string,
    litters: number,
}[];

function formatData(activities: DatabaseActivities): ChartData {
    const curr_date = new Date();
    const month_end = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 0)
    const month_start = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);
    const diff_days = differenceInCalendarDays(month_end, month_start);

    let chartdata: ChartData = [];

    for (let i = 0; i < diff_days + 1; i++) {
        const date = new Date(curr_date.getFullYear(), curr_date.getMonth(), i + 1);

        chartdata.push({
            date: format(date, "MMM d"),
            litters: 0
        });
    }

    for (let i = 0; i < activities.length; i++) {
        const id = differenceInCalendarDays(new Date(activities[i].created_at), month_start);
        chartdata[id].litters += activities[i].litters_saved;
    }

    return chartdata;
}

function valueFormatter(number: number) {
    return `${new Intl.NumberFormat("us").format(number).toString()} Lt`;
}

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [data, setData] = useState<ChartData>([]);

    async function fetchMonthStats() {
        const fetch = await axios.get("http://localhost:3000/api/activities/month", {
            headers: {
                Authorization: user?.token
            }
        });

        if (fetch.data.success) {
            setData(formatData(fetch.data.month_activities));
        }
    }

    useEffect(() => {
        if (!user) navigate("/login");
        fetchMonthStats();
    }, []);

    return <section className="flex-grow">
        <Modal refetch={fetchMonthStats} />
        <Card>
            <Title>Your monthly progress:</Title>
            <Subtitle>
                Here you can see a detailed list of all the activities you've performed and how they impact your progress
            </Subtitle>

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
    </section>
}
