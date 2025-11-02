"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", calls: 2400, memories: 1200 },
  { time: "04:00", calls: 1398, memories: 980 },
  { time: "08:00", calls: 9800, memories: 3200 },
  { time: "12:00", calls: 3908, memories: 2100 },
  { time: "16:00", calls: 4800, memories: 2800 },
  { time: "20:00", calls: 3800, memories: 2200 },
  { time: "24:00", calls: 4300, memories: 2600 },
]

export function MemoryVisualization() {
  return (
    <Card className="border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-foreground">Memory Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="time" stroke="#A1A1AA" style={{ fontSize: "12px" }} />
              <YAxis stroke="#A1A1AA" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#181818",
                  border: "1px solid #2A2A2A",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                }}
              />
              <Line type="monotone" dataKey="calls" stroke="#00E0FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memories" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent-cyan" />
            <span className="text-sm text-muted-foreground">API Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent-purple" />
            <span className="text-sm text-muted-foreground">Memories Stored</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
