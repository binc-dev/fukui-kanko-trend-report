import type {
  CustomLegendContentProps,
  CustomTooltipContentProps,
  CustomXAxisTickProps,
} from "./types";
import { getDateInfo } from "./utils";

export const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
  if (!payload?.value) return null;
  const { formattedDate, displayText, color } = getDateInfo(payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
        {formattedDate}
      </text>
      <text x={0} y={0} dy={32} textAnchor="middle" fill={color} fontSize={10}>
        {displayText}
      </text>
    </g>
  );
};

export const CustomTooltipContent = ({
  active,
  payload,
  chartType,
  hiddenKeys,
}: CustomTooltipContentProps) => {
  if (!active || !payload?.length) return null;
  const { formattedDate, displayText, color } = getDateInfo(
    payload[0].payload.date
  );

  return (
    <div className="grid min-w-32 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="flex">
        <span>{formattedDate}</span>
        <span style={{ color }} className="ml-2">
          {displayText}
        </span>
      </div>
      <div className="grid gap-1.5">
        {[
          ...(chartType === "count"
            ? payload.slice().sort((a, b) => b.value - a.value)
            : payload),
        ].map((item) => (
          <div key={item.dataKey} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{`${item.name}:`}</span>
              </div>
              <span className="font-mono font-medium tabular-nums text-foreground">
                {item.value.toLocaleString()}
              </span>
            </div>

            {chartType === "review" &&
              item.payload.average_rating === null &&
              !hiddenKeys?.has("average_rating") && (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: "#FF7F0E" }}
                    />
                    <span className="text-muted-foreground">平均評点:</span>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    評点なし
                  </span>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CustomLegendContent = ({
  payload,
  hoveredKey,
  hiddenKeys,
  onHover,
  onLeave,
  onToggle,
}: CustomLegendContentProps) => {
  const desiredOrder = [
    "map_views",
    "search_views",
    "directions",
    "call_clicks",
    "website_clicks",
  ];

  // payloadをdesiredOrderの順序でソート
  const sortedPayload = payload?.slice().sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.dataKey);
    const indexB = desiredOrder.indexOf(b.dataKey);
    return indexA - indexB;
  });
  return (
    <ul className="flex flex-wrap justify-center gap-4 list-none m-0 p-0">
      {sortedPayload?.map((entry) => {
        const isHidden = hiddenKeys.has(entry.dataKey);
        const opacity = isHidden
          ? 0.2
          : hoveredKey && hoveredKey !== entry.dataKey
          ? 0.2
          : 1;

        return (
          <li
            key={entry.dataKey}
            className="flex items-center gap-2 cursor-pointer transition-opacity duration-200 ease-in-out"
            style={{ opacity }}
            onMouseEnter={() => !isHidden && onHover(entry.dataKey)}
            onMouseLeave={onLeave}
            onClick={() => {
              const wasHidden = hiddenKeys.has(entry.dataKey);
              onToggle(entry.dataKey);
              // 再表示時にホバーしていた場合はホバー状態にする
              if (wasHidden) {
                onHover(entry.dataKey);
              }
            }}
          >
            <div
              className="w-3 h-3 shrink-0 rounded-[2px]"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value}</span>
          </li>
        );
      })}
    </ul>
  );
};
