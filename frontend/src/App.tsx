// Main App component for LeaseLens with routing

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LoginScreen } from './components/screens/LoginScreen';
import { RenterDetailsScreen } from './components/screens/RenterDetailsScreen';
import { RentalInputScreen } from './components/screens/RentalInputScreen';
import { ChecklistScreen } from './components/screens/ChecklistScreen';
import { ResultScreen } from './components/screens/ResultScreen';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Screen 1: Login */}
          <Route path="/" element={<LoginScreen />} />
          
          {/* Screen 2: Renter Details */}
          <Route path="/renter-details" element={<RenterDetailsScreen />} />
          
          {/* Screen 3: Rental Content Input */}
          <Route path="/rental-input" element={<RentalInputScreen />} />
          
          {/* Screen 4: Risk Checklist */}
          <Route path="/checklist" element={<ChecklistScreen />} />
          
          {/* Screen 5: Final Results */}
          <Route path="/results" element={<ResultScreen />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;