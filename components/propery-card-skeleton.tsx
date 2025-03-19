import { Card, CardContent } from "./ui/card";

export function PropertyCardSkeleton() {
  return (
    <Card className="max-w-[24rem] md:max-w-[20rem] lg:max-w-[20rem] w-full">
      <div className="w-full h-[200px] bg-gray-200 animate-pulse" />

      <CardContent className="w-full relative py-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />

          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />

          <div className="flex flex-col gap-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
          </div>

          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />

          <div className="flex flex-wrap gap-1 w-full">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-4 bg-gray-200 rounded animate-pulse w-[4rem]"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}