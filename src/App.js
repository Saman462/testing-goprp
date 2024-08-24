import './App.css';
import GoProConnectionWrapper from './GoProConnectionWrapper';
import MediaListPage from './MediaListPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<GoProConnectionWrapper />} />
          <Route path="/media" element={<MediaListPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

