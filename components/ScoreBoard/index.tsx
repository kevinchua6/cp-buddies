import { PlatformType } from "@/pages";
import { LeetCodeJsonData } from "@/types/apiTypes";
import { Text, Stack, NativeSelect, LoadingOverlay } from "@mantine/core";
import { Cell } from "./Cell";
import {
  AllTimeLeetCodeCell,
  DailyCell,
  getDailyProblemsSolved,
} from "./Cell/leetcodeCell";

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
  numberOfSubmissionsToday: number;
  submissions: {
    name: string;
    tags: string[];
    count: number;
  }[];
};

interface ScoreBoardProps {
  data: (LeetCodeData | CodeForcesData)[];
  handleDelete: (name: string, platformInfo: PlatformInfo) => void;
  loading: boolean;
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
                <DailyCell
                  platformType="leetcode"
                  username={item.name}
                  handleDelete={() =>
                    handleDelete(item.name, {
                      name: item.name,
                      platform: "leetcode",
                    })
                  }
                  submissionCalendar={item.submissionCalendar}
                />
              );
            case "All Time":
              return (
                <AllTimeLeetCodeCell
                  username={item.name}
                  easy={item.easy}
                  medium={item.medium}
                  hard={item.hard}
                  handleDelete={() =>
                    handleDelete(item.name, {
                      name: item.name,
                      platform: "leetcode",
                    })
                  }
                />
              );
          }
        case "cf":
          switch (sortValue) {
            case "Daily":
              return (
                <DailyCell
                  platformType="cf"
                  username={item.name}
                  numberOfSubmissionsToday={item.numberOfSubmissionsToday}
                  handleDelete={() =>
                    handleDelete(item.name, {
                      name: item.name,
                      platform: "cf",
                    })
                  }
                />
              );
            case "All Time":
              return (
                <Cell
                  cellOnClick={() => {
                    window.open(
                      `https://codeforces.com/submissions/${item.name}`,
                      "_blank",
                      "noreferrer noopener"
                    );
                  }}
                  key={String(index)}
                  symbol={item.symbol}
                  handleDelete={() =>
                    handleDelete(item.name, {
                      name: item.name,
                      platform: "cf",
                    })
                  }
                >
                  <div className="flex-grow">
                    <Text size="sm" color="#676e75">
                      Last 10 Submissions
                    </Text>
                    <Text className="flex flex-col ">
                      {item.submissions.map((submission, index) => (
                        <div key={index}>
                          {submission.name}: {submission.count}
                        </div>
                      ))}
                    </Text>
                    <Text size="sm" color="#464646" className=" float-right">
                      {item.name}
                    </Text>
                  </div>
                </Cell>
              );
          }
      }
    });

  const onChangeTimeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(event.currentTarget.value as SortValueOptions);
  };

  return (
    <Stack>
      <div>
        <NativeSelect
          value={sortValue}
          onChange={onChangeTimeSelect}
          data={sortValueOptions}
          // make this component go to the right
          className="w-1/3 float-right"
        />
      </div>
      {items && items.length > 0 ? (
        items
      ) : (
        <Text className="text-center">
          You haven&apos;t added any friends. Go add some!
        </Text>
      )}
      <LoadingOverlay className="z-0" visible={loading} overlayBlur={2} />
    </Stack>
  );
}
