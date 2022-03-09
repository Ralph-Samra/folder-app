import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface onSubmitFunc {
  (name: string, content: string): any;
}

interface Props {
  folder?: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: onSubmitFunc;
}

const AppModal = ({ folder, open, onClose, onSubmit }: Props) => {
  const [nameVal, setNameVal] = useState<string>("");
  const [contentVal, setContentVal] = useState<string>("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="main-dialogue"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{folder ? "New Folder" : "New File"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="item-name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={nameVal}
          onChange={(e) => setNameVal(e.target.value)}
        />
        <br />
        <br />
        {!folder && (
          <TextField
            id="item-content"
            aria-label="minimum height"
            minRows={4}
            fullWidth
            multiline
            label="File Content..."
            value={contentVal}
            onChange={(e) => setContentVal(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setNameVal("");
            setContentVal("");
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!nameVal || (!contentVal && !folder)}
          onClick={() => {
            onSubmit(nameVal, contentVal);
            setNameVal("");
            setContentVal("");
            onClose();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppModal;
