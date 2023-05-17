import { ActionIcon } from "@mantine/core";
import { IconAlien } from "@tabler/icons-react";
import React from "react";

import darksoulsBosses from "../../../assets/darksouls-bosses.json";
import styles from "./alien.module.css";

type AlienProps = {
  onClick: (username: string) => void;
};

function selectRandomBoss() {
  const randomBossIndex = Math.floor(Math.random() * darksoulsBosses.length);
  return darksoulsBosses[randomBossIndex];
}

/**
 * This is a joke component to generate username.
 */
export function Alien({ onClick }: AlienProps) {
  function handleClick() {
    const randomBoss = selectRandomBoss();
    randomBoss && onClick(randomBoss);
  }

  return (
    <div className={styles.alien}>
      <ActionIcon variant={"transparent"} onClick={handleClick}>
        <IconAlien />
      </ActionIcon>
    </div>
  );
}
