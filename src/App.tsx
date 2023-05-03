import './App.scss'

import { useEffect, useState } from 'react'
import { CategoryType } from './Types'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import CategoryBar from './components/CategoryBar'
import Category from './components/Category'

import { utils, write } from 'xlsx'
import { saveAs } from 'file-saver'

function App() {
  // Categories
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>()
  const [categories, setCategories] = useState<CategoryType[]>()
  const [activeCategory, setActiveCategory] = useState<CategoryType>()

  // Effects
  // Bootup
  useEffect(() => {
    const ls = localStorage.getItem('data')
    if (ls) {
      setCategories(JSON.parse(ls))
      setSelectedCategoryId(JSON.parse(localStorage.getItem('data')!)[0].key)
    }
  }, [])
  // Track active category
  useEffect(() => {
    setActiveCategory(categories?.find((cat) => cat.key === selectedCategoryId))
  }, [categories, selectedCategoryId])

  // Watch categories and store in localstorage
  useEffect(() => {
    if (categories) {
      localStorage.setItem('data', JSON.stringify(categories))
    }
  }, [categories])

  const theme = createTheme({
    palette: { primary: { main: '#4874a8' }, secondary: { main: '#ffffff' } },
  })

  const exportToExcel = () => {
    const data: [string, string, number | string][] = [
      ['Category', 'Slide', 'Count'],
    ]

    categories?.forEach((category) => {
      category.counters?.forEach((counter) => {
        data.push([category.label, counter.label, counter.count])
      })
    })

    const sheet = utils.aoa_to_sheet(data)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, sheet, 'Sheet1')

    const buffer = write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    saveAs(blob, 'tally.xlsx')
  }

  // UI
  return (
    <ThemeProvider theme={theme}>
      <div id="app">
        <CategoryBar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategory={setSelectedCategoryId}
          onAddCategory={(cat) => {
            setCategories([...(categories ?? []), cat])
            setSelectedCategoryId(cat.key)
          }}
          onLoadData={() => {
            const input = window.prompt('Paste input file')
            if (input) {
              setCategories(JSON.parse(input))
              window.location.reload()
            }
          }}
          onExportToExcel={exportToExcel}
        />
        <div id="content">
          {activeCategory && (
            <Category
              category={activeCategory}
              onUpdateCategory={(cat) => {
                const newCategories = [...(categories || [])]
                const changedIndex =
                  categories?.findIndex((c) => c.key === selectedCategoryId) ??
                  -1
                if (changedIndex > -1) {
                  newCategories[changedIndex] = cat
                  setCategories(newCategories)
                }
              }}
              onDeleteCategory={() => {
                const newCategories = [...(categories || [])]
                const changedIndex =
                  categories?.findIndex((c) => c.key === selectedCategoryId) ??
                  -1
                if (changedIndex > -1) {
                  newCategories.splice(changedIndex, 1)

                  setCategories(
                    newCategories.length > 0 ? newCategories : undefined
                  )
                  setSelectedCategoryId(
                    newCategories.length > 0 ? newCategories[0].key : undefined
                  )
                }
              }}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
