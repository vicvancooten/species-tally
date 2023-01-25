import { CategoryType, CounterType } from "../../Types";
import styles from "./styles.module.scss";

import { Button, Tab, Tabs } from "@mui/material";

import uniqid from "uniqid";
import Logo from "../Logo";

const CategoryBar: React.FC<{
  categories?: CategoryType[];
  setSelectedCategory: (cat: string) => void;
  onAddCategory: (cat: CategoryType) => void;
  selectedCategoryId?: string;
}> = ({
  categories,
  setSelectedCategory,
  onAddCategory,
  selectedCategoryId,
}) => {
  return (
    <div className={styles.bar}>
      <Logo
        className={styles.logo}
        onClick={() => {
          if (categories) setSelectedCategory(categories[0].key);
        }}
      />
      {categories && (
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedCategoryId}
          onChange={(event: React.SyntheticEvent, newValue: string) =>
            setSelectedCategory(newValue)
          }
          aria-label="Categories"
          textColor="secondary"
          indicatorColor="secondary"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {categories.map((category) => (
            <Tab
              label={category.label.length > 0 ? category.label : `Category`}
              value={category.key}
              key={category.key}
            />
          ))}
        </Tabs>
      )}
      <Button
        fullWidth
        color="secondary"
        onClick={() => {
          const counters: CounterType[] = [];
          if (categories) {
            (categories?.[categories.length - 1].counters ?? []).forEach(
              (counter) => {
                counters.push({ label: counter.label, count: 0 });
              }
            );
          }

          onAddCategory({
            label: `Slide ${(categories?.length ?? 0) + 1}`,
            key: uniqid(),
            counters,
          });
        }}
      >
        +
      </Button>
    </div>
  );
};

export default CategoryBar;
