import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Papa from 'papaparse'
import { useEffect, useState } from 'react'

type DataPoint = {
  date: string
  map_views: number
  search_views: number
  directions: number
  call_clicks: number
  website_clicks: number
}

export function Graph() {
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    fetch('/data/total_daily_metrics.csv')
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
    <div className="w-full p-4">
      <h2 className="mb-4 text-2xl font-semibold text-center">回数推移</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeOpacity={0.3}/>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip itemSorter={(item) => -(item.value ?? 0)} />
          <Legend itemSorter={null} />
          <Line dataKey="map_views" name="地図表示" stroke="#1F77B4" strokeWidth={3} />
          <Line dataKey="directions" name="地図検索" stroke="#FF7F0E" strokeWidth={3} />
          <Line dataKey="search_views" name="ルート設定" stroke="#2CA02C" strokeWidth={3} />
          <Line dataKey="call_clicks" name="通話" stroke="#D62728" strokeWidth={3} />
          <Line dataKey="website_clicks" name="ウェブサイトクリック" stroke="#9467BD" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}