import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraBaseProvider, ColorModeScript, extendTheme, ThemeConfig, ThemeOverride } from '@chakra-ui/react'
import { mode, GlobalStyleProps, StyleFunctionProps } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

const styles: ThemeOverride["styles"] = {
  global: (props: GlobalStyleProps | StyleFunctionProps) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', '#101010')(props)
    }
  })
}


const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
}

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  }
}

const theme = extendTheme({ config, styles, colors })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraBaseProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraBaseProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
)
