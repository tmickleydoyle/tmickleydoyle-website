"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import data from "../data/config.json";
import Contributions from "./Contributions";
import Resume from "./Resume";
import Stars from "./Stars";
import Forecast from "./Forecast";
import PrioritizationDoc from "./PrioritizationDoc";
import StartProjectDoc from "./StartProjectDoc";
import MetricsMethodologyDoc from "./MetricsMethodologyDoc";
import PythonCodeBox from "./PythonBuildingTrees";

export default function Profile() {
  const router = useRouter();
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    const { tab: urlTab } = router.query;
    if (urlTab) {
      setTab(urlTab);
    }
  }, [router.query]);

  const handleClick = (param) => {
    setTab(param);
    router.push(`?tab=${param}`, undefined, { shallow: true });
  };

  return (
    <div className="maincontainer">
      <div className="photoborder">
        <Image
          src={data.profile_photo}
          width={250}
          height={250}
          alt="Profile Image"
        />
      </div>
      <br />
      <h1>{data.name}</h1>
      <div className="greytext">
        <span>&nbsp;</span>
        {data.custom_contact_links &&
          data.custom_contact_links.length > 0 &&
          data.custom_contact_links.map((link, index) => (
            <span key={link.name}>
              <Link href={link.url}>{link.name}</Link>{" "}
              {index !== data.custom_contact_links.length - 1 && " | "}{" "}
            </span>
          ))}
      </div>
      <br />
      <hr className="w-2/5 border-gray-300 border-t-2 my-4" />
      <br />
      <div className="space-x-2">
        <button className="customButton" onClick={() => handleClick("profile")}>
          Profile
        </button>
        <span>|</span>
        <button
          className="customButton"
          onClick={() => handleClick("projects")}
        >
          Project Prioritization Planning
        </button>
        <span>|</span>
        <button className="customButton" onClick={() => handleClick("start")}>
          Scoping New Data Science Projects
        </button>
        <span>|</span>
        <button className="customButton" onClick={() => handleClick("metrics")}>
          Metrics Methodology
        </button>
      </div>
      <br />
      <div className="space-x-2">
        <button className="customButton" onClick={() => handleClick("commits")}>
          GitHub Commits
        </button>
        <span>|</span>
        <button className="customButton" onClick={() => handleClick("stars")}>
          GitHub Stars
        </button>
        <span>|</span>
        <button
          className="customButton"
          onClick={() => handleClick("forecast")}
        >
          Linear Regression Tool
        </button>
        <span>|</span>
        <button
          className="customButton"
          onClick={() => handleClick("treeBuilding")}
        >
          Python: Tree Builder Class
        </button>
      </div>
      <br />
      {tab === "profile" && <Resume />}
      {tab === "projects" && <PrioritizationDoc />}
      {tab === "start" && <StartProjectDoc />}
      {tab === "metrics" && <MetricsMethodologyDoc />}
      {tab === "commits" && <Contributions />}
      {tab === "stars" && <Stars />}
      {tab === "forecast" && <Forecast />}
      {tab === "treeBuilding" && (
        <PythonCodeBox
          code={data.tree_building_code}
          title="Python Code: Tree Builder Class"
        />
      )}
    </div>
  );
}
