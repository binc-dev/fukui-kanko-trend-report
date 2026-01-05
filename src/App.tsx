import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Papa from 'papaparse'
import { useEffect, useState } from 'react'

type DataPoint = {
  area: string
  date: string
  map_views: number
  map_searches: number
  directions: number
  calls: number
  website_clicks: number
  post_count: number
  avg_rating: number
}

function App() {
  const [data, setData] = useState<DataPoint[]>([])
  console.log(data)

  useEffect(() => {
    fetch('/data/katuyama.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setData(results.data as DataPoint[])
          }
        })
      })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-full max-w-4xl rounded-lg bg-white p-6">
        <h2 className="mb-4 text-2xl font-semibold">観光トレンド</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="map_views" name="地図表示" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="directions" name="地図検索" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="map_searches" name="ルート設定" stroke="#ffc658" strokeWidth={2} />
            <Line type="monotone" dataKey="calls" name="通話回数" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="website_clicks" name="ウェブサイトクリック" stroke="#ffc658" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default App
