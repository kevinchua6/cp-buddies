import { NavBar } from "@/components/NavBar";
import {
  PlatformInfo,
  ScoreBoard,
  SortValueOptions,
} from "@/components/ScoreBoard";
import { Button, TextInput, SegmentedControl, Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { LocalStorage } from "@/utilities/localStorage";
import { CodeForcesJsonData, LeetCodeJsonData } from "../types/apiTypes";
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

  /*
    Since the queries we need to execute is changing from render to render, 
    we cannot use manual querying since that would violate the rules of hooks. 
    Instead, we use the useQueries hook, which we can use to 
    dynamically execute as many queries in parallel
  */
  const leetcodeQueryObj = useQueries({
    queries: leetcodeUsernames.map((username) => {
      return {
        queryKey: ["lcData", username],
        queryFn: () =>
          fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "error") {
                notifications.show({
                  color: "red",
                  title: "User not found! 😢",
                  message:
                    "The user you entered was not found on LeetCode. Please try again.",
                });
                setLeetcodeUsernames((prev) =>
                  prev.filter((name) => name !== username)
                );

                return;
              }

              if (data.status !== "success") {
                notifications.show({
                  color: "red",
                  title: "Error Occurred! 😢",
                  message:
                    "The API server might be down, or the rate limit has been reached! Please try again later.",
                });
                setLeetcodeUsernames((prev) =>
                  prev.filter((name) => name !== username)
                );

                return;
              }

              LocalStorage.addSavedUserToPlatform(username, "leetcode");

              return {
                ...data,
                username: username,
                type: "leetcode",
              } as Promise<LeetCodeJsonData>;
            }),
      };
    }),
  });

  const codeforcesQueryObj = useQueries({
    queries: codeforcesUsernames.map((username) => {
      return {
        queryKey: ["cfData", username],
        queryFn: () =>
          fetch(
            `https://codeforces.com/api/user.status?handle=${username}&from=1&count=10`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.status === "FAILED") {
                notifications.show({
                  color: "red",
                  title: "User not found! 😢",
                  message:
                    "The user you entered was not found on CodeForces. Please try again.",
                });
                setCodeforcesUsernames((prev) =>
                  prev.filter((name) => name !== username)
                );

                return;
              }

              if (data.status !== "OK") {
                notifications.show({
                  color: "red",
                  title: "Error Occurred! 😢",
                  message:
                    "The API server might be down, or the rate limit has been reached! Please try again later.",
                });
                setCodeforcesUsernames((prev) =>
                  prev.filter((name) => name !== username)
                );

                return;
              }
              LocalStorage.addSavedUserToPlatform(username, "cf");

              return {
                ...data,
                username: username,
                type: "cf",
              } as Promise<CodeForcesJsonData>;
            }),
      };
    }),
  });

  useEffect(() => {
    setLeetcodeUsernames(LocalStorage.getSavedUsers()["leetcode"]);
    setCodeforcesUsernames(LocalStorage.getSavedUsers()["cf"]);
  }, []);

  const handleDeleteList = (name: string, platformInfo: PlatformInfo) => {
    switch (platformInfo.platform) {
      case "leetcode":
        setLeetcodeUsernames(
          leetcodeUsernames.filter((currName) => currName !== name)
        );
        break;
      case "atcoder":
        setAtcoderUsernames(
          atcoderUsernames.filter((currName) => currName !== name)
        );
        break;
      case "cf":
        setCodeforcesUsernames(
          codeforcesUsernames.filter((currName) => currName !== name)
        );
        break;
    }
    LocalStorage.removeSavedUserFromPlatform(name, platformInfo.platform);
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
        if (leetcodeUsernames.includes(newUsername)) {
          showSameUserErrorMsg();
          return;
        }
        setLeetcodeUsernames([...leetcodeUsernames, newUsername]);
        break;
      case "atcoder":
        if (atcoderUsernames.includes(newUsername)) {
          showSameUserErrorMsg();
          return;
        }
        setAtcoderUsernames([...atcoderUsernames, newUsername]);
        break;
      case "cf":
        if (codeforcesUsernames.includes(newUsername)) {
          showSameUserErrorMsg();
          return;
        }
        setCodeforcesUsernames([...codeforcesUsernames, newUsername]);
        break;
    }
  };

  const onFormSubmit = (e: any) => {
    e.preventDefault();
    addFriendOnClick(addFriendType, addFriendInput);
  };

  type LeetcodeProcessedData = {
    type: "leetcode";
    name: string;
    easy: number;
    medium: number;
    hard: number;
    submissionCalendar: {
      [key: string]: number;
    };
    symbol: string;
  };

  const processedLeetcodeData =
    leetcodeQueryObj
      ?.map((user) => {
        if (!user || !user?.data) return;
        const userData = user.data;
        return {
          type: userData.type,
          name: userData.username,
          easy: userData.easySolved,
          medium: userData.mediumSolved,
          hard: userData.hardSolved,

          submissionCalendar: userData.submissionCalendar,

          symbol: "LC",
        };
      })
      .filter((ele): ele is LeetcodeProcessedData => !!ele) ?? [];

  type CodeForcesProcessedData = {
    name: string;
    submissions: {
      name: string;
      tags: string[];
      count: number;
    }[];
    numberOfSubmissionsToday: number;
    symbol: string;
    type: "cf";
  };

  // Get the number of unique submissions by name with their tags
  const processedCodeforcesData =
    codeforcesQueryObj
      ?.map((user) => {
        if (!user || !user?.data) return;
        const submissions = user.data.result;

        const numberOfSubmissionsToday = submissions?.filter(
          (submission) =>
            submission.creationTimeSeconds >=
            new Date().getTime() / 1000 - 24 * 60 * 60
        ).length;

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
          name: user.data.username,
          submissions: submissionsByProblemNameArray,
          numberOfSubmissionsToday,
          symbol: "CF",
          type: user.data.type,
        };
      })
      .filter((item): item is CodeForcesProcessedData => !!item) ?? [];

  const { atcoder, ...visibleCodingPlatformsApi } = codingPlatformsApi;

  return (
    <main>
      <NavBar
        links={[
          // { label: "Features", link: "abc.com" },
          // { label: "Learn", link: "abc.com" },
          { label: "About the Author", link: "https://kevinchua6.github.io/" },
        ]}
      />
      <div className="flex flex-col items-center justify-center m-7">
        <div className="border-4 border-blue-100 rounded-lg p-3 bg-slate-200 flex flex-col items-center justify-center m-7">
          {/* <div> */}
          <span className="text-xl font-bold mb-4 mt-1">
            Add Friend from Platform
          </span>
          {/* </div> */}
          <SegmentedControl
            onChange={(value) => setAddFriendType(value as PlatformType)}
            data={Array.from(Object.entries(visibleCodingPlatformsApi)).map(
              (platformTuple) => ({
                label: platformTuple[1].name,
                value: platformTuple[0],
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
        <Box className=" w-[24.5rem]" pos="relative">
          <ScoreBoard
            loading={leetcodeQueryObj.map((a) => a.isFetching).includes(true)}
            sortValue={sortValue}
            setSortValue={setSortValue}
            data={[...processedLeetcodeData, ...processedCodeforcesData]}
            handleDelete={handleDeleteList}
          />
        </Box>
      </div>
    </main>
  );
}
