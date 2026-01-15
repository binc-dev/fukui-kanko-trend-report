import {
  TOTAL_AREA,
  useAreas,
} from "@/components/parts/selector/hooks/use-areas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChartSettings } from "@/context/ChartSettingsContext";

export function AreaSelector() {
  const { area, setArea } = useChartSettings();
  const { areas } = useAreas();
  return (
    <div className="flex flex-row items-center gap-2 mt-3">
      <p>エリア</p>
      <Select value={area} onValueChange={setArea}>
        <SelectTrigger className="w-30 bg-white text-black border-black hover:bg-gray-100">
          <SelectValue placeholder="エリアを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TOTAL_AREA}>全域</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area.area_id} value={area.filename}>
              {area.area_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
