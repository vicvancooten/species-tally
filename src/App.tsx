import "./App.scss";

import { useEffect, useState } from "react";
import { CategoryType } from "./Types";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import CategoryBar from "./components/CategoryBar";
import Category from "./components/Category";

function App() {
  // Categories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [categories, setCategories] = useState<CategoryType[]>();
  const [activeCategory, setActiveCategory] = useState<CategoryType>();

  // Effects
  // Bootup
  useEffect(() => {
    const ls = localStorage.getItem("data");
    if (ls) {
      setCategories(JSON.parse(ls));
      setSelectedCategoryId(JSON.parse(localStorage.getItem("data")!)[0].key);
    }
  }, []);
  // Track active category
  useEffect(() => {
    setActiveCategory(
      categories?.find((cat) => cat.key === selectedCategoryId)
    );
  }, [categories, selectedCategoryId]);

  // Watch categories and store in localstorage
  useEffect(() => {
    if (categories) {
      localStorage.setItem("data", JSON.stringify(categories));
    }
  }, [categories]);

  const theme = createTheme({
    palette: { primary: { main: "#4874a8" }, secondary: { main: "#ffffff" } },
  });

  // UI
  return (
    <ThemeProvider theme={theme}>
      <div id="app">
        <CategoryBar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategory={setSelectedCategoryId}
          onAddCategory={(cat) => {
            setCategories([...(categories ?? []), cat]);
            setSelectedCategoryId(cat.key);
          }}
          onLoadData={() => {
            const input = window.prompt("Paste input file");
            if (input) {
              setCategories(JSON.parse(input));
              window.location.reload();
            }
          }}
        />
        <div id="content">
          {activeCategory && (
            <Category
              category={activeCategory}
              onUpdateCategory={(cat) => {
                const newCategories = [...(categories || [])];
                const changedIndex =
                  categories?.findIndex((c) => c.key === selectedCategoryId) ??
                  -1;
                if (changedIndex > -1) {
                  newCategories[changedIndex] = cat;
                  setCategories(newCategories);
                }
              }}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
