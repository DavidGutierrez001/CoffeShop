import { CircleUserRound, Package, ClipboardPenLine, TrendingUp } from 'lucide-react';

import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, CartesianGrid, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

function getKpiCardItems() {
    return [
        { disabled: true, title: "Total Ventas", total: "512", icon: <CircleUserRound className="h-5" strokeWidth={1.5} /> },
        { disabled: true, title: "Total Pedidos", total: "921", icon: <ClipboardPenLine className="h-5" strokeWidth={1.5} /> },
        { disabled: false, title: "Total Productos", total: "210", icon: <Package className="h-5" strokeWidth={1.5} /> },
        { disabled: true, title: "Total Clientes", total: "512", icon: <CircleUserRound className="h-5" strokeWidth={1.5} /> },
    ];
}

function getSalesChartData() {
    return [
        { month: "Enero", desktop: 186, mobile: 80 },
        { month: "Febrero", desktop: 305, mobile: 200 },
        { month: "Marzo", desktop: 237, mobile: 120 },
        { month: "Abril", desktop: 73, mobile: 190 },
        { month: "Mayo", desktop: 209, mobile: 130 },
        { month: "Junio", desktop: 214, mobile: 140 },
        { month: "Julio", desktop: 186, mobile: 80 },
        { month: "Agosto", desktop: 305, mobile: 200 },
        { month: "Septiembre", desktop: 0, mobile: 0 },
        { month: "Octubre", desktop: 0, mobile: 0 },
        { month: "Noviembre", desktop: 0, mobile: 0 },
        { month: "Diciembre", desktop: 0, mobile: 0 },
    ];
}

function getSalesChartConfig() {
    return {
        desktop: {
            label: "Desktop",
            color: "var(--chart-6)",
        },
    };
}

function getBrowserChartData() {
    return [
        { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
        { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
        { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
        { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
        { browser: "other", visitors: 90, fill: "var(--color-other)" },
    ];
}

function getBrowserChartConfig() {
    return {
        visitors: {
            label: "Visitors",
            color: "var(--chart-0)",
        },
        chrome: {
            label: "Chrome",
            color: "var(--chart-1)",
        },
        safari: {
            label: "Safari",
            color: "var(--chart-2)",
        },
        firefox: {
            label: "Firefox",
            color: "var(--chart-3)",
        },
        edge: {
            label: "Edge",
            color: "var(--chart-4)",
        },
        other: {
            label: "Other",
            color: "var(--chart-5)",
        },
    };
}

export default function Dashboard() {
    return (
        <div className="grid grid-rows-[auto_auto_auto] gap-5 h-full">
            <KPIDashboard />
            <BarLinesDashboard />
            <PieLinesDashboard />
        </div>
    );
}

// Sección de indicadores clave de rendimiento (KPI) para mostrar información relevante en el dashboard
export function KPIDashboard() {
    const cardItems = getKpiCardItems();

    return (
        <div className="flex flex-1 gap-5 flex-wrap">
            {cardItems.map((item, index) => (
                <Card key={index} className={`@container/card min-w-50 flex-1 bg-linear-to-t from-primary/5 to-card shadow-xs outline outline-primary/10
                    ${item.disabled ? "opacity-40 pointer-events-none" : ""}
                `}>
                    <CardHeader>
                        <CardDescription>{item.title}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {item.total}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <TrendingUp />
                                +12.5%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Trending up this month <TrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

// Sección de gráficos de barras para mostrar información de KPI
export function BarLinesDashboard() {
    const KPIInfo = getSalesChartData();
    const chartConfig = getSalesChartConfig();

    return (
        <Card className="bg-linear-to-t from-primary/5 to-card shadow-xs outline outline-primary/10">
            <CardHeader>
                <CardTitle>Ventas por Mes</CardTitle>
                <CardDescription>Enero - Diciembre 2026</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="h-60 w-full" config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={KPIInfo}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="desktop" fill="#874c87" className='grayscale' radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export function PieLinesDashboard() {
    const chartData = getBrowserChartData();
    const chartConfig = getBrowserChartConfig();

    return (
        <div className="flex flex-col md:flex-row gap-5 flex-wrap">
            <Card className="flex flex-1 w-full md:min-w-100 flex-col bg-linear-to-t from-primary/5 to-card shadow-xs outline outline-primary/10">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Pie Chart - Custom Label</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-70 px-0 grayscale"
                    >
                        <PieChart>
                            <ChartTooltip
                                content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="visitors"
                                labelLine={false}
                                label={({ payload, ...props }) => {
                                    return (
                                        <text
                                            cx={props.cx}
                                            cy={props.cy}
                                            x={props.x}
                                            y={props.y}
                                            textAnchor={props.textAnchor}
                                            dominantBaseline={props.dominantBaseline}
                                            fill="var(--foreground)"
                                        >
                                            {payload.visitors}
                                        </text>
                                    )
                                }}
                                nameKey="browser"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 leading-none font-medium">
                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                    </div>
                </CardFooter>
            </Card>

            <Card className="flex-1 md:flex-2 w-full md:min-w-100 bg-linear-to-t from-primary/5 to-card shadow-xs outline outline-primary/10">
                <CardHeader>
                    <CardTitle>Bar Chart - Mixed</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        className="max-h-85 w-full h-full grayscale"
                        config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{
                                left: 0,
                                right: 0,
                            }}
                        >
                            <YAxis
                                dataKey="browser"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <XAxis dataKey="visitors" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="visitors" radius={5} barSize={35} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
