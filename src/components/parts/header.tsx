import { ExternalNavigation } from "./external-navigation";

export function Header() {
  return (
    <header className="h-12 grid grid-cols-[1fr_auto_1fr] w-full items-center justify-center border-b-2 border-border pb-2">
      <div />
      <div className="flex items-center gap-2 justify-center">
        <h1 className="text-center md:text-4xl font-bold">
          観光ロケーション・トレンドレポート
        </h1>
      </div>
      <div className="w-fit place-self-end">
        <ExternalNavigation />
      </div>
    </header>
  );
}
