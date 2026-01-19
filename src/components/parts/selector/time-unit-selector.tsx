import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChartSettings } from "@/context/ChartSettingsContext";

export function TimeUnitSelector() {
  const { timeUnit, setTimeUnit } = useChartSettings();
  return (
    <div className="flex flex-row items-center gap-2 pl-4">
      <p>表示単位</p>
      <Select value={timeUnit} onValueChange={setTimeUnit}>
        <SelectTrigger className="w-30 bg-white text-black border-black hover:bg-gray-100">
          <SelectValue placeholder="表示単位を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"month"}>月別</SelectItem>
          <SelectItem value={"week"}>週別</SelectItem>
          <SelectItem value={"day"}>日別</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
