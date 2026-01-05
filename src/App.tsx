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
    <div className="flex flex-col min-h-screen items-center justify-center bg-white">
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

      <div className="w-full p-4">
        <h2 className="mb-4 text-2xl font-semibold text-center">回数推移</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip itemSorter={(item) => -(item.value ?? 0)} />
            <Legend itemSorter={null} />
            <Line type="monotone" dataKey="map_views" name="地図表示" stroke="#1F77B4" strokeWidth={2} />
            <Line type="monotone" dataKey="directions" name="地図検索" stroke="#FF7F0E" strokeWidth={2} />
            <Line type="monotone" dataKey="map_searches" name="ルート設定" stroke="#2CA02C" strokeWidth={2} />
            <Line type="monotone" dataKey="calls" name="通話" stroke="#D62728" strokeWidth={2} />
            <Line type="monotone" dataKey="website_clicks" name="ウェブサイトクリック" stroke="#9467BD" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default App
