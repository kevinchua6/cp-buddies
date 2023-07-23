import { LeetCodeDetailsModal } from "../../Modals";
import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Cell } from ".";
import { LeetCodeJsonData } from "@/types/apiTypes";
import { PlatformInfo } from "..";
import { PlatformType } from "@/pages";

interface LeetCodeCellProps {
  children: React.ReactNode;
  symbol: string;
  handleDelete: () => void;
  username: string;
  onClick?: () => void;
  platformType?: PlatformType;
}

export const LeetCodeCell = ({
  children,
  symbol,
  handleDelete,
  username,
  onClick,
  platformType,
}: LeetCodeCellProps) => {
  const [
    isLeetCodeModalOpen,
    { open: openLeetCodeModal, close: closeLeetCodeModal },
  ] = useDisclosure(false);

  return (
    <>
      <LeetCodeDetailsModal
        username={username}
        isOpen={isLeetCodeModalOpen}
        onClose={closeLeetCodeModal}
      />
      <Cell
        symbol={symbol}
        handleDelete={handleDelete}
        cellOnClick={platformType === "cf" ? onClick! : openLeetCodeModal}
      >
        {children}
      </Cell>
    </>
  );
};
export const getDailyProblemsSolved = (
  submissionCalendar?: LeetCodeJsonData["submissionCalendar"]
) => {
  if (!submissionCalendar || Object.keys(submissionCalendar).length === 0)
    return 0;
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

interface DailyCellProps {
  username: string;
  submissionCalendar?: LeetCodeJsonData["submissionCalendar"];
  handleDelete: (name: string, platformInfo: PlatformInfo) => void;
  platformType: PlatformType;
  numberOfSubmissionsToday?: number;
}

export const BottomUsernameCell = ({ username }: { username: string }) => (
  <Text color="#464646" className="float-right" size="sm">
    {username}
  </Text>
);
const dailyCellProblemSolved = (
  symbol: PlatformType,
  submissionCalendar?: LeetCodeJsonData["submissionCalendar"],
  numberOfSubmissionsToday?: number
) => {
  switch (symbol) {
    case "leetcode":
      return getDailyProblemsSolved(submissionCalendar);
    case "cf":
      return numberOfSubmissionsToday;
    default:
      return 0;
  }
};

export const DailyCell = ({
  username,
  submissionCalendar,
  handleDelete,
  platformType,
  numberOfSubmissionsToday,
}: DailyCellProps) => (
  <LeetCodeCell
    // TODO: fix this
    onClick={() =>
      window.open(
        `https://codeforces.com/submissions/${username}`,
        "_blank",
        "noreferrer noopener"
      )
    }
    username={username}
    symbol={
      platformType === "leetcode" ? "LC" : platformType === "cf" ? "CF" : "AC"
    }
    handleDelete={() =>
      handleDelete(username, {
        name: username,
        platform: "leetcode",
      })
    }
    platformType={platformType}
  >
    <div className="flex-grow">
      <Text>
        Solved Today:{" "}
        {dailyCellProblemSolved(
          platformType,
          submissionCalendar,
          numberOfSubmissionsToday
        )}
      </Text>
      <BottomUsernameCell username={username} />
    </div>
  </LeetCodeCell>
);

interface AllTimeLeetCodeCellProps {
  username: string;
  easy: number;
  medium: number;
  hard: number;
  handleDelete: (name: string, platformInfo: PlatformInfo) => void;
}

export const AllTimeLeetCodeCell = ({
  username,
  easy,
  medium,
  hard,
  handleDelete,
}: AllTimeLeetCodeCellProps) => (
  <LeetCodeCell
    username={username}
    symbol={"LC"}
    handleDelete={() =>
      handleDelete(username, {
        name: username,
        platform: "leetcode",
      })
    }
  >
    <div className="flex-grow">
      <Text className="flex flex-row flex-wrap">
        <div>Easy: {easy}</div>
        <div className="ml-1 mr-1">•</div>
        <div>Medium: {medium} </div>
        <div className="ml-1 mr-1">•</div>
        <div>Hard: {hard}</div>
      </Text>
      <BottomUsernameCell username={username} />
    </div>
  </LeetCodeCell>
);
