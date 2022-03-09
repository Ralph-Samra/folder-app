import React from "react";
import { getItemByIdFunc, item } from "../App";
import { IconButton } from "@mui/material";
import { Feed, FolderOpen } from "@mui/icons-material";

interface openItemFunc {
  (id: number): void;
}

interface Props {
  visibleList: Array<item>;
  getItemById: getItemByIdFunc;
  openItem: openItemFunc;
  currentID: number;
}

const MainView = ({ visibleList, getItemById, openItem, currentID }: Props) => {
  // if first item of visible list is not id = 0 then its contents
  if (getItemById(currentID)?.content) {
    return (
      <div>
        <h1>{getItemById(currentID)!.name}</h1>
        <div>{getItemById(currentID)!.content}</div>
      </div>
    );
  } else if (visibleList[0]) {
    return (
      <>
        {Array.from(visibleList, (item) => (
          <IconButton
            style={{ borderRadius: "1em" }}
            color="primary"
            onClick={() => openItem(item.id)}
            key={item.id}
          >
            <label>{item.name}</label>
            {item.content ? <Feed /> : <FolderOpen />}
          </IconButton>
        ))}
      </>
    );
  } else {
    return <div>There is nothing here</div>;
  }
};

export default MainView;
