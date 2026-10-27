import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: { primary: { main: '#2563eb' }, secondary: { main: '#4f46e5' }, background: { default: '#f8fafc', paper: '#ffffff' }, text: { primary: '#0f172a', secondary: '#64748b' } },
  shape: { borderRadius: 12 },
  typography: { fontFamily: "'Barlow', Arial, sans-serif", button: { textTransform: 'none', fontWeight: 600 } },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 20 }, containedPrimary: { background: 'linear-gradient(135deg, #2563eb, #4f46e5)', boxShadow: '0 6px 20px #2563eb25' } } },
    MuiOutlinedInput: { styleOverrides: { root: { background: '#f8fafc', '&.Mui-focused': { background: '#fff', boxShadow: '0 0 0 4px #2563eb12' } }, notchedOutline: { borderColor: '#dce3ee' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
    MuiCard: { styleOverrides: { root: { border: '1px solid #e2e8f0', boxShadow: '0 8px 30px #0f172a08', borderRadius: 20 } } },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}><BrowserRouter>
      <App />
    </BrowserRouter></ThemeProvider>
  </StrictMode>
)
