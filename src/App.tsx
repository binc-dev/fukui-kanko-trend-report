import { Graph } from "@/components/parts/graph";
import { Header } from "@/components/parts/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

function App() {
  const [areas, setAreas] = useState<
    Array<{ area_id: string; area_name: string }>
  >([]);
  const [selectedArea, setSelectedArea] = useState<string>("all");

  useEffect(() => {
    fetch("/metadata.json")
      .then((res) => res.json())
      .then((data) => setAreas(data.areas));
  }, []);
  return (
    <div className="flex flex-col min-h-screen items-center justify-center w-full p-4">
      <Header />
      <div className="flex flex-row items-center gap-2 mt-3">
        <p>エリア</p>
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-30 bg-white text-black border-black hover:bg-gray-100">
            <SelectValue placeholder="エリアを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全域</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area.area_id} value={area.area_id}>
                {area.area_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Graph />
    </div>
  );
}

export default App;
