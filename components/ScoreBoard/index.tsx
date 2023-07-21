import { PlatformType } from "@/pages";
import { LeetCodeJsonData } from "@/pages/apiTypes";
import {
  createStyles,
  rem,
  Text,
  Stack,
  NativeSelect,
  LoadingOverlay,
} from "@mantine/core";
import { Cell } from "./Cell";
import { LeetCodeCell } from "./Cell/leetcodeCell";

const getDailyProblemsSolved = (
  submissionCalendar?: LeetCodeJsonData["submissionCalendar"]
) => {
  if (!submissionCalendar) return 0;
  // submissionCalendar is an object with the keys as the date in unix and the value as the number of problems solved
  // Get the number of daily problems solved from yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayUnix = Math.floor(yesterday.getTime() / 1000);

  return Object.values(submissionCalendar).reduce((acc, curr) => {
    if (curr >= yesterdayUnix) {
      return acc + 1;
    }

    return acc;
  });
};

export type PlatformInfo = {
  name: string;
  platform: PlatformType;
};

type LeetCodeData = {
  name: string;
  easy: number;
  medium: number;
  hard: number;
  symbol: string;
  type: "leetcode";
  submissionCalendar?: LeetCodeJsonData["submissionCalendar"];
};

type CodeForcesData = {
  name: string;
  symbol: string;
  type: "cf";
};

interface ScoreBoardProps {
  data: (LeetCodeData | CodeForcesData)[];
  handleDelete: (name: string, platformInfo: PlatformInfo) => void;
  loading: boolean;
  refetch: () => void;
  sortValue: SortValueOptions;
  setSortValue: (value: SortValueOptions) => void;
}

type SortValueOptionsArray = ["Daily", "All Time"];

export type SortValueOptions = SortValueOptionsArray[number];

// "Weekly", "Yearly",
const sortValueOptions: SortValueOptionsArray = ["Daily", "All Time"];

export function ScoreBoard({
  data,
  handleDelete,
  refetch,
  sortValue,
  setSortValue,
  loading,
}: ScoreBoardProps) {
  const items = data
    .sort((a, b) => {
      if (a.type === "leetcode" && b.type === "leetcode") {
        switch (sortValue) {
          case "Daily":
            return (
              getDailyProblemsSolved(b.submissionCalendar) -
              getDailyProblemsSolved(a.submissionCalendar)
            );
          case "All Time":
            return b.easy + b.medium + b.hard - (a.easy + a.medium + a.hard);
        }
      }
      return 0;
    })
    .map((item, index) => {
      // Depends on both the platform type and the sortValue
      // For leetcode, when you click on it u can see the problems list
      switch (item.type) {
        case "leetcode":
          switch (sortValue) {
            case "Daily":
              return (
                <LeetCodeCell
                  username={item.name}
                  key={String(index)}
                  symbol={item.symbol}
                  // name={item.name}
                  handleDelete={() =>
                    handleDelete(item.name, {
                      name: item.name,
                      platform: "leetcode",
                    })
                  }
                >
                  <div>
                    <Text>
                      Solved Today:{" "}
                      {getDailyProblemsSolved(item.submissionCalendar)}
                    </Text>
                    <Text color="dimmed" size="sm">
                      {item.name}
                    </Text>
                  </div>
                </LeetCodeCell>
              );
            case "All Time":
              return (
                <LeetCodeCell
                  username={item.name}
                  key={String(index)}
                  symbol={item.symbol}
                  // name={item.name}
                  handleDelete={() =>
                    handleDelete(item.name, {
                      name: item.name,
                      platform: "leetcode",
                    })
                  }
                >
                  <div>
                    <Text className="flex flex-row flex-wrap">
                      <div>Easy: {item.easy}</div>
                      <div className="ml-1 mr-1">•</div>
                      <div>Medium: {item.medium} </div>
                      <div className="ml-1 mr-1">•</div>
                      <div>Hard: {item.hard}</div>
                    </Text>
                    <Text color="dimmed" size="sm">
                      {item.name}
                    </Text>
                  </div>
                </LeetCodeCell>
              );
          }
        case "cf":
          return (
            <Cell
              cellOnClick={() => {}}
              key={String(index)}
              symbol={item.symbol}
              // name={item.name}
              handleDelete={() =>
                handleDelete(item.name, {
                  name: item.name,
                  platform: "leetcode",
                })
              }
            >
              <div>
                <Text>{item.name}</Text>
                <Text color="dimmed" size="sm">
                  {/* Easy: {item.easy} • Medium: {item.medium} • Hard: {item.hard} */}
                </Text>
              </div>
            </Cell>
          );
      }
    });

  const onChangeTimeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(event.currentTarget.value as SortValueOptions);
    // refetch();
  };

  return (
    <Stack w={360}>
      <NativeSelect
        value={sortValue}
        onChange={onChangeTimeSelect}
        data={sortValueOptions}
      />

      {items}
      <LoadingOverlay className="z-0" visible={loading} overlayBlur={2} />
    </Stack>
  );
}
