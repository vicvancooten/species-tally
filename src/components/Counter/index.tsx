import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { CounterType } from "../../Types";
import styles from "./styles.module.scss";

const Counter: React.FC<{
  counter: CounterType;
  onUpdateCounter: (c: CounterType) => void;
  onDeleteCounter: () => void;
}> = ({ counter, onUpdateCounter, onDeleteCounter }) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  return (
    <div
      className={styles.counter}
      onClick={() => onUpdateCounter({ ...counter, count: counter.count + 1 })}
      onContextMenu={(event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
              }
            : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
              // Other native context menus might behave different.
              // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
              null
        );
      }}
      style={{ cursor: "context-menu" }}
    >
      <div className={styles.label}>
        <input
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={styles.input}
          value={counter.label}
          onChange={(e) => {
            onUpdateCounter({ ...counter, label: e.target.value });
          }}
        />
      </div>
      <div className={styles.count}>{counter.count}</div>
      <Menu
        open={contextMenu !== null}
        onClose={() => {
          setContextMenu(null);
        }}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={(e) => {
            onDeleteCounter();
            setContextMenu(null);
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Counter;
