import React, { useCallback, useEffect, useRef, useState } from "react";
import { Breadcrumbs, Button, Link, TextField } from "@mui/material";
import "./App.css";
import AppModal from "./AppModal/AppModal";
import MainView from "./MainView/MainView";
import { Box } from "@mui/system";
import { throttle } from "lodash";

enum ModalState {
  Folder,
  File,
  None,
}

export type item = {
  id: number;
  parent_id: number | null;
  name: string;
  content: string | null;
};

const initialLocation: number = localStorage.getItem("currentLocation")
  ? JSON.parse(localStorage.getItem("currentLocation")!)
  : 0;

const initialItemState: Array<item> = localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data")!)
  : [{ id: 0, parent_id: null, name: "Home", content: null }];

export interface getItemByIdFunc {
  (id: number | null): item | undefined;
}

function App() {
  const [modal, setModal] = useState<ModalState>(ModalState.None);
  const [items, setItems] = useState<Array<item>>(initialItemState);
  const [currentID, setCurrentID] = useState<number>(initialLocation);
  const [visibleList, setVisibleList] = useState<Array<item>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const fetchResults = useRef(
    throttle((search: string, currentID: number, items: item[]) => {
      let searchLower: string = search.toLowerCase();
      let newVisible: Array<item> = [];
      items.forEach((item: item) => {
        if (search) {
          if (
            item.name.toLowerCase().includes(searchLower) ||
            item.content?.toLowerCase().includes(searchLower)
          ) {
            newVisible.push(item);
          }
        } else if (currentID === item.parent_id) {
          newVisible.push(item);
        }
      });
      setVisibleList(newVisible);
    }, 1000)
  );

  const submitItem = useCallback(
    (name, content) => {
      let newItem: item = {
        id: items.length,
        parent_id: currentID,
        name: name,
        content: content,
      };
      setItems(items.concat([newItem]));
    },
    [currentID, items]
  );

  const getItemById: getItemByIdFunc = useCallback(
    (id) => {
      return items.find((item) => item.id === id);
    },
    [items]
  );

  const renderBreadCrumbs = () => {
    let list: JSX.Element[] = [];
    let idTrack: number | null = currentID;
    while (getItemById(idTrack)?.parent_id !== null) {
      let clickId: number | null = idTrack;
      list.unshift(
        <Link
          underline="hover"
          color="inherit"
          onClick={() => goToItem(clickId!)}
          key={idTrack}
        >
          {getItemById(idTrack)!.name}
        </Link>
      );

      idTrack = getItemById(idTrack)!.parent_id;
    }
    list.unshift(
      <Link
        underline="hover"
        color="inherit"
        onClick={() => goToItem(idTrack!)}
        key={idTrack}
      >
        {getItemById(idTrack)!.name}
      </Link>
    );
    return list;
  };

  const goToItem = (id: number) => {
    setCurrentID(id);
    setSearchTerm("");
  };

  useEffect(() => {
    fetchResults.current(searchTerm, currentID, items);
  }, [searchTerm, currentID, items]);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("currentLocation", JSON.stringify(currentID));
  }, [currentID]);

  return (
    <div className="App">
      <h1>My Files</h1>
      <AppModal
        open={modal === ModalState.Folder}
        onClose={() => setModal(ModalState.None)}
        onSubmit={submitItem}
        folder
      />
      <AppModal
        open={modal === ModalState.File}
        onClose={() => setModal(ModalState.None)}
        onSubmit={submitItem}
      />
      <TextField
        margin="dense"
        id="searchbar"
        label="Search"
        type="text"
        fullWidth
        variant="standard"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br />
      <br />
      {!searchTerm && (
        <>
          <Breadcrumbs aria-label="breadcrumb">
            {renderBreadCrumbs()}
          </Breadcrumbs>
          {getItemById(currentID)?.content ? null : (
            <Box className="leftBox">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModal(ModalState.Folder)}
              >
                Create New Folder
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => setModal(ModalState.File)}
              >
                Create New File
              </Button>
            </Box>
          )}
        </>
      )}

      {searchTerm && <h2>Search Results</h2>}
      <div className="main-view">
        <MainView
          getItemById={getItemById}
          visibleList={visibleList}
          openItem={(id) => goToItem(id)}
          currentID={currentID}
        />
      </div>
    </div>
  );
}

export default App;
