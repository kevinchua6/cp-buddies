import { NavBar } from "@/components/NavBar";
import {
  PlatformInfo,
  ScoreBoard,
  SortValueOptions,
} from "@/components/ScoreBoard";
import { Button, TextInput, SegmentedControl, Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LocalStorage } from "@/utilities/localStorage";
import { CodeForcesJsonData, LeetCodeJsonData } from "./apiTypes";
import { notifications } from "@mantine/notifications";

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

export default function Home() {
  const [addFriendInput, setAddFriendInput] = useState<string>("");
  const [addFriendType, setAddFriendType] = useState<
    "leetcode" | "atcoder" | "cf"
  >("leetcode");

  const [leetcodeUsernames, setLeetcodeUsernames] = useState<string[]>([]);

  const [atcoderUsernames, setAtcoderUsernames] = useState<string[]>([]);
  const [codeforcesUsernames, setCodeforcesUsernames] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState<SortValueOptions>("Daily");

  const {
    isLoading: isLcDataLoading,
    isFetching: isLcDataFetching,
    data: leetcodeData,
    refetch: refetchLcData,
  } = useQuery({
    queryKey: ["lcData"],
    queryFn: () =>
      Promise.all(
        // TODO: create caching function to make sure we don't fetch the same data twice
        leetcodeUsernames.map((username) =>
          fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
            .then((res) => res.json())
            .then(
              (data) =>
                ({
                  ...data,
                  username: username,
                  type: "leetcode",
                } as Promise<LeetCodeJsonData>)
            )
        )
      ),
  });

  const {
    isLoading: isCfDataLoading,
    isFetching: isCfDataFetching,
    data: codeforcesData,
    refetch: refetchCfData,
  } = useQuery({
    queryKey: ["cfData"],
    queryFn: () =>
      Promise.all(
        codeforcesUsernames.map((username) =>
          fetch(
            `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10`
          )
            .then((res) => res.json())
            .then(
              (data) =>
                ({
                  ...data,
                  username: username,
                  type: "cf",
                } as Promise<CodeForcesJsonData>)
            )
        )
      ),
  });

  useEffect(() => {
    refetchLcData();
  }, [refetchLcData, leetcodeUsernames, codeforcesUsernames, atcoderUsernames]);

  useEffect(() => {
    setLeetcodeUsernames(LocalStorage.getSavedUsers()["leetcode"]);
  }, []);

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

  const showSameUserErrorMsg = () => {
    notifications.show({
      color: "red",
      title: "Same User",
      message: "You're not allowed to add the same friend! 🤥",
    });
  };

  const addFriendOnClick = (
    platformType: PlatformType,
    newUsername: string
  ) => {
    switch (platformType) {
      case "leetcode":
        console.log("heree");
        if (leetcodeUsernames.includes(newUsername)) {
          console.log("here");
          showSameUserErrorMsg();
          return;
        }
        setLeetcodeUsernames([...leetcodeUsernames, newUsername]);
      case "atcoder":
        if (atcoderUsernames.includes(newUsername)) {
          showSameUserErrorMsg();
          return;
        }
        setAtcoderUsernames([...atcoderUsernames, newUsername]);
      case "cf":
        if (codeforcesUsernames.includes(newUsername)) {
          showSameUserErrorMsg();
          return;
        }
        setCodeforcesUsernames([...codeforcesUsernames, newUsername]);
    }
    LocalStorage.addSavedUserToPlatform(newUsername, platformType);
  };

  const onFormSubmit = (e: any) => {
    e.preventDefault();
    addFriendOnClick(addFriendType, addFriendInput);
  };

  const processedLeetcodeData =
    leetcodeData?.map((user) => ({
      type: user.type,
      name: user.username,
      easy: user.easySolved,
      medium: user.mediumSolved,
      hard: user.hardSolved,

      submissionCalendar: user.submissionCalendar,

      symbol: "LC",
    })) ?? [];

  // Get the number of unique submissions by name with their tags
  const processedCodeforcesData =
    codeforcesData?.map((user) => {
      const submissions = user.result;
      console.log({ user });
      // TODO: Maybe find the number of submissions this day or week
      const submissionsByProblemName = submissions?.reduce(
        (acc: { [key: string]: { tags: string[]; count: number } }, curr) => {
          const problemName = curr.problem.name;
          if (acc[problemName]) {
            acc[problemName].count += 1;
          } else {
            acc[problemName] = {
              tags: curr.problem.tags,
              count: 1,
            };
          }
          return acc;
        },
        {}
      );

      const submissionsByProblemNameArray = Object.entries(
        submissionsByProblemName
      ).map(([name, { tags, count }]) => ({
        name,
        tags,
        count,
      }));

      return {
        name: user.username,
        submissions: submissionsByProblemNameArray,
        symbol: "CF",
        type: user.type,
      };
    }) ?? [];

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
        <div className=" border-4 border-blue-100 rounded-lg p-3 bg-slate-200 flex flex-col items-center justify-center m-7">
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
        </div>
        <Box maw={400} pos="relative">
          <ScoreBoard
            loading={isLcDataLoading || isCfDataLoading}
            sortValue={sortValue}
            setSortValue={setSortValue}
            refetch={refetchLcData}
            data={[...processedLeetcodeData, ...processedCodeforcesData]}
            handleDelete={handleDeleteList}
          />
        </Box>
      </div>
    </main>
  );
}
