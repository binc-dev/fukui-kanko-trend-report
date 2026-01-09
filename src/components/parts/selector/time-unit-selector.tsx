import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeUnitSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TimeUnitSelector({
  value,
  onValueChange,
}: TimeUnitSelectorProps) {
  return (
    <div className="flex flex-row items-center gap-2 mt-3">
      <p className="text-sm font-medium">表示単位</p>
      <Select value={value} onValueChange={onValueChange}>
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
