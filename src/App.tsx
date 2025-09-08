import { Toaster } from 'react-hot-toast'
import AppProvider from './provider'
import ChatPopup from './components/ChatPopup'

function App() {

  return (
    <>
      <div>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <ChatPopup />
         <AppProvider />
      </div>
    </>
  )
}

export default App
