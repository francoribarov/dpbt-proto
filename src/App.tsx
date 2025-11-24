import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { History } from './pages/History'
import { MediaUpload } from './pages/MediaUpload'
import { Questions } from './pages/Questions'
import { Review } from './pages/Review'
import { Summary } from './pages/Summary'
import { SymptomSelect } from './pages/SymptomSelect'
import { FollowUp } from './pages/FollowUp'

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/preconsulta/sintoma" />} />
        <Route path="/preconsulta/sintoma" element={<SymptomSelect />} />
        <Route path="/preconsulta/multimedia" element={<MediaUpload />} />
        <Route path="/preconsulta/preguntas" element={<Questions />} />
        <Route path="/preconsulta/revision" element={<Review />} />
        <Route path="/preconsulta/resumen" element={<Summary />} />
        <Route path="/seguimiento/:id" element={<FollowUp />} />
        <Route path="/historial" element={<History />} />
        <Route path="*" element={<Navigate to="/preconsulta/sintoma" />} />
      </Routes>
    </Layout>
  )
}

export default App
