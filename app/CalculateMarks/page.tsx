// app/page.tsx

import '../globals.css';
import { createTheme, MantineProvider } from '@mantine/core';
// import DropzoneOCR from './components/DropzoneOCR';
const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    primaryColor: 'cyan',
  });
export default function Home() {
  return (
    <MantineProvider theme={theme}>
        Hi Calculator page
      {/* <DropzoneOCR /> */}
    </MantineProvider>
  );
}
