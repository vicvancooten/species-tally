import styles from "./styles.module.scss";

import { CategoryType, CounterType } from "../../Types";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

import Counter from "../Counter";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Icon from "@mdi/react";
import { mdiTrashCanOutline } from "@mdi/js";

const Category: React.FC<{
  category: CategoryType;
  onUpdateCategory: (cat: CategoryType) => void;
  onDeleteCategory: () => void;
}> = ({ category, onUpdateCategory, onDeleteCategory }) => {
  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  return (
    <div className={styles.content}>
      <input
        className={styles.inputheader}
        value={category.label}
        onChange={(e) => {
          onUpdateCategory({ ...category, label: e.target.value });
        }}
      />
      <hr />
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) {
            return;
          }

          if (result.destination.index === result.source.index) {
            return;
          }

          onUpdateCategory({
            ...category,
            counters: reorder(
              category.counters,
              result.source.index,
              result.destination.index
            ) as CounterType[],
          });
        }}
      >
        <Droppable droppableId="list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <motion.ul
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
                key={category.key}
                className={styles.animation}
              >
                {category.counters?.map((counter, index) => (
                  <Draggable
                    draggableId={`${index}`}
                    index={index}
                    key={`${category.key}-${index}`}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={`${category.key}-${index}`}
                      >
                        <motion.li
                          variants={{
                            hidden: { y: 10, opacity: 0 },
                            visible: {
                              y: 0,
                              opacity: 1,
                            },
                          }}
                        >
                          <Counter
                            counter={counter}
                            onDeleteCounter={() => {
                              const counters = [...(category.counters ?? [])];
                              counters.splice(index, 1);
                              onUpdateCategory({ ...category, counters });
                            }}
                            onUpdateCounter={(newCounter) => {
                              const counters = category.counters ?? [];
                              counters[index] = newCounter;
                              onUpdateCategory({ ...category, counters });
                            }}
                          />
                        </motion.li>
                      </div>
                    )}
                  </Draggable>
                ))}
              </motion.ul>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <hr />
      <Button
        color="primary"
        variant="outlined"
        onClick={() => {
          const counters = category.counters ?? [];
          counters.push({ label: `Item ${counters.length + 1}`, count: 0 });
          onUpdateCategory({ ...category, counters });
        }}
      >
        Add counter
      </Button>{" "}
      <Button
        color="primary"
        variant="contained"
        startIcon={<Icon path={mdiTrashCanOutline} size={1} />}
        onClick={onDeleteCategory}
      >
        Delete {category.label}
      </Button>
    </div>
  );
};

export default Category;
