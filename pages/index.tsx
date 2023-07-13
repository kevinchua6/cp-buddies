import { NavBar } from "@/components/NavBar";
import { PlatformInfo, ScoreBoard } from "@/components/ScoreBoard";
import {
  Button,
  TextInput,
  SegmentedControl,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export type PlatformType = keyof typeof codingPlatformsApi;

const codingPlatformsApi = {
  leetcode: {
    name: "LeetCode",
    api: "https://leetcode-stats-api.herokuapp.com/",
  },
  atcoder: {
    name: "AtCoder",
    api: "https://atcoder-api.herokuapp.com/",
  },
  cf: {
    name: "CodeForces",
    api: "https://codeforces.com/api/",
  },
};

export interface LeetCodeJsonData {
  username: string;
  status: string;
  message: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: {
    [key: string]: number;
  };
}
[];

export default function Home() {
  const [addFriendInput, setAddFriendInput] = useState<string>("");
  const [addFriendType, setAddFriendType] = useState<
    "leetcode" | "atcoder" | "cf"
  >("leetcode");

  const [leetcodeUsernames, setLeetcodeUsernames] = useState<string[]>([]);
  const [atcoderUsernames, setAtcoderUsernames] = useState<string[]>([]);
  const [codeforcesUsernames, setCodeforcesUsernames] = useState<string[]>([]);

  const { isLoading, isFetching, error, data, refetch } = useQuery({
    queryKey: ["cpData"],
    queryFn: () =>
      Promise.all(
        // TODO: create caching function to make sure we don't fetch the same data twice
        // ["skullspine9", "goingtometa", "username3"].map((username) =>
        leetcodeUsernames.map((username) =>
          fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
            .then((res) => res.json())
            .then(
              (data) =>
                ({ ...data, username: username } as Promise<LeetCodeJsonData>)
            )
        )
      ),
  });

  useEffect(() => {
    refetch();
  }, [refetch, leetcodeUsernames, codeforcesUsernames, atcoderUsernames]);

  const handleDeleteList = (name: string, platformInfo: PlatformInfo) => {
    switch (platformInfo.platform) {
      case "leetcode":
        setLeetcodeUsernames(
          leetcodeUsernames.filter((currName) => currName !== name)
        );
      case "atcoder":
        setAtcoderUsernames(
          atcoderUsernames.filter((currName) => currName !== name)
        );
      case "cf":
        setCodeforcesUsernames(
          codeforcesUsernames.filter((currName) => currName !== name)
        );
    }
  };

  const addFriendOnClick = (
    platformType: PlatformType,
    newUsername: string
  ) => {
    switch (platformType) {
      case "leetcode":
        if (leetcodeUsernames.includes(newUsername)) return;
        setLeetcodeUsernames([...leetcodeUsernames, newUsername]);
      case "atcoder":
        if (atcoderUsernames.includes(newUsername)) return;
        setAtcoderUsernames([...atcoderUsernames, newUsername]);
      case "cf":
        if (codeforcesUsernames.includes(newUsername)) return;
        setCodeforcesUsernames([...codeforcesUsernames, newUsername]);
    }
  };

  const onFormSubmit = (e: any) => {
    e.preventDefault();
    addFriendOnClick(addFriendType, addFriendInput);
  };

  return (
    <main>
      <NavBar
        links={[
          { label: "Features", link: "abc.com" },
          { label: "Learn", link: "abc.com" },
          { label: "About", link: "abc.com" },
        ]}
      />
      <div className="flex flex-col items-center justify-center m-7">
        <SegmentedControl
          onChange={(value) => setAddFriendType(value as PlatformType)}
          data={Array.from(Object.values(codingPlatformsApi)).map(
            (platform) => ({
              label: platform.name,
              value: platform.name.toLowerCase(),
            })
          )}
        />
        <form onSubmit={onFormSubmit}>
          <div className="flex flex-row items-center justify-center">
            <TextInput
              value={addFriendInput}
              onChange={(e) => setAddFriendInput(e.target.value)}
              className="p-2 m-2"
              placeholder="Enter username"
            />
            <Button
              type="submit"
              className="bg-main-blue  text-white font-bold py-2 px-4 rounded"
            >
              Add Friend
            </Button>
          </div>
        </form>
        <Box maw={400} pos="relative">
          <LoadingOverlay visible={isLoading || isFetching} overlayBlur={2} />
          <ScoreBoard
            data={
              data?.map((user) => ({
                name: user.username,
                easy: user.easySolved,
                medium: user.mediumSolved,
                hard: user.hardSolved,

                position: 0,
                mass: 100,
                symbol: "LC",
              })) ?? []
            }
            handleDelete={handleDeleteList}
          />
        </Box>
      </div>
    </main>
  );
}
