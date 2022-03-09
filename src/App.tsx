import React, { useCallback, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import "./App.css";
import AppModal from "./AppModal/AppModal";
import MainView from "./MainView/MainView";
import { Box } from "@mui/system";

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

const initialItemState: Array<item> = [
  { id: 0, parent_id: null, name: "Home", content: null },
];

export interface getItemByIdFunc {
  (id: number): item | undefined;
}

function App() {
  const [modal, setModal] = useState<ModalState>(ModalState.None);
  const [items, setItems] = useState<Array<item>>(initialItemState);
  const [currentID, setCurrentID] = useState<number>(0);
  const [visibleList, setVisibleList] = useState<Array<item>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  useEffect(() => {
    let searchTermLower: string = searchTerm.toLowerCase();
    let newVisible: Array<item> = [];
    items.forEach((item: item) => {
      if (searchTerm) {
        if (item.name.toLowerCase().includes(searchTermLower)) {
          newVisible.push(item);
        }
      } else if (currentID === item.parent_id) {
        newVisible.push(item);
      }
    });
    setVisibleList(newVisible);
  }, [searchTerm, currentID, items]);

  return (
    <div className="App">
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
        onChange={(e) => {
          if (e.target.value) {
            setSearchTerm(e.target.value);
          }
        }}
      />
      <br />
      <br />
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

      {/* Breadcrumbs */}
      <br />
      <br />
      <div className="main-view">
        <MainView
          getItemById={getItemById}
          visibleList={visibleList}
          openItem={(id) => setCurrentID(id)}
          currentID={currentID}
        />
      </div>
    </div>
  );
}

export default App;
