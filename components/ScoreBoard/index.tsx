import { PlatformType } from "@/pages";
import { createStyles, rem, Text, Stack, NativeSelect } from "@mantine/core";
import { useState } from "react";

const useStyles = createStyles(() => ({
  symbol: {
    fontSize: rem(30),
    fontWeight: 700,
    width: rem(60),
  },
}));

export type PlatformInfo = {
  name: string;
  platform: PlatformType;
};

interface ScoreBoardProps {
  data: {
    easy: number;
    medium: number;
    hard: number;

    symbol: string;
    name: string;
  }[];
  handleDelete: (name: string, platformInfo: PlatformInfo) => void;
}

export function ScoreBoard({ data, handleDelete }: ScoreBoardProps) {
  const { classes } = useStyles();
  const [sortValue, setSortValue] = useState("Daily");

  const items = data.map((item, index) => (
    <div
      key={index}
      className="flex content-center rounded-lg border p-4 pl-6 bg-slate-100 mb-3"
    >
      <Text className={classes.symbol}>{item.symbol}</Text>
      <div>
        <Text>{item.name}</Text>
        <Text color="dimmed" size="sm">
          Easy: {item.easy} • Medium: {item.medium} • Hard: {item.hard}
        </Text>
      </div>
      <button
        className="text-gray-300 hover:text-gray-600 self-start ml-auto"
        onClick={() =>
          handleDelete(item.name, { name: item.name, platform: "leetcode" })
        }
      >
        ✕
      </button>
    </div>
  ));

  return (
    <Stack w={360}>
      <NativeSelect
        value={sortValue}
        onChange={(event) => setSortValue(event.currentTarget.value)}
        data={["Daily", "Weekly", "Yearly", "All Time"]}
      />

      {items}
    </Stack>
  );
}
