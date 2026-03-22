"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type RatioItem = {
  name: string
  value: number
}

type MonthlyActivityItem = {
  month: string
  leads: number
  blogs: number
  documents: number
}

type SourceItem = {
  source: string
  value: number
}

type DashboardChartsProps = {
  blogRatio: RatioItem[]
  leadRatio: RatioItem[]
  documentRatio: RatioItem[]
  leadSource: SourceItem[]
  monthlyActivity: MonthlyActivityItem[]
}

const ratioColors: Record<string, string> = {
  Published: "#10b981",
  Draft: "#f59e0b",
  Read: "#3b82f6",
  Unread: "#ef4444",
  Shared: "#6366f1",
  Revoked: "#f97316",
}

const monthlyConfig: ChartConfig = {
  leads: {
    label: "Leads",
    color: "#f59e0b",
  },
  blogs: {
    label: "Blogs",
    color: "#10b981",
  },
  documents: {
    label: "Documents",
    color: "#3b82f6",
  },
}

const sourceConfig: ChartConfig = {
  value: {
    label: "Leads",
    color: "#8b5cf6",
  },
}

function RatioPieChart({ title, data }: { title: string; data: RatioItem[] }) {
  const config: ChartConfig = {
    value: {
      label: title,
      color: "#64748b",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto h-64">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} strokeWidth={2}>
              {data.map((item) => (
                <Cell key={item.name} fill={ratioColors[item.name] || "#64748b"} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function DashboardCharts({
  blogRatio,
  leadRatio,
  documentRatio,
  leadSource,
  monthlyActivity,
}: DashboardChartsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <RatioPieChart title="Blogs: Published vs Draft" data={blogRatio} />
        <RatioPieChart title="Leads: Read vs Unread" data={leadRatio} />
        <RatioPieChart title="Documents: Shared vs Revoked" data={documentRatio} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Last 6 Months Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyConfig} className="h-72 w-full">
              <LineChart data={monthlyActivity} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="leads" stroke="var(--color-leads)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="blogs" stroke="var(--color-blogs)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="documents" stroke="var(--color-documents)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sourceConfig} className="h-72 w-full">
              <BarChart data={leadSource} layout="vertical" margin={{ left: 12, right: 12 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="source" tickLine={false} axisLine={false} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={6} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
