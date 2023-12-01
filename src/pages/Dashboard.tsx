import Modal from "@/components/sections/CreateActivityModal";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInCalendarDays, format } from "date-fns";
import { BarChart, Card, Metric, Subtitle, Title } from "@tremor/react";
import { activities } from "@/constants";
import { h2overflowApi } from "@/h2overflowApi";

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
    const [data, setData] = useState<ChartData>([]);
    const [rawData, setRawData] = useState<DatabaseActivities>([]);
    const navigate = useNavigate();

    async function fetchMonthStats() {
        const fetch = await h2overflowApi.get("/activities/month", {
            headers: {
                Authorization: user?.token
            }
        });

        if (fetch.data.success) {
            setRawData(fetch.data.month_activities);
            setData(formatData(fetch.data.month_activities));
        }
    }

    useEffect(() => {
        if (!user) navigate("/login");
        fetchMonthStats();
    }, []);

    return <section className="flex-grow flex flex-col items-center py-10 md:px-10">
        <div className="max-w-[96rem]">
            <div className="flex flex-row items-center gap-2">
                <Metric color="blue">Dashboard |</Metric>
                <Metric>Welcome {user?.name} {user?.last_names}!</Metric>
            </div>
            <Modal refetch={fetchMonthStats} />
            <Card className="my-5">
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
            <div className="px-5 grid grid-flow-row gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-0">
                {rawData.map(datapoint => {
                    const { _id, activity, created_at, litters_saved } = datapoint;

                    const date_str = format(new Date(created_at), "MMMM d");

                    return <Card key={_id} className="rounded-t-sm" decoration="top" decorationColor="blue">
                        <Title>{date_str}</Title>
                        <Subtitle>{activities[activity - 1].name}</Subtitle>
                        <Metric>{litters_saved} Lt</Metric>
                    </Card>
                })}
            </div>
        </div>
    </section>
}
