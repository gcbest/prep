import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Diagnostic } from './pages/Diagnostic';
import { AngularBridge } from './pages/AngularBridge';
import { RxjsState } from './pages/RxjsState';
import { TestingLab } from './pages/TestingLab';
import { CodingLab } from './pages/CodingLab';
import { CodeReview } from './pages/CodeReview';
import { SystemDesign } from './pages/SystemDesign';
import { DevOpsControls } from './pages/DevOpsControls';
import { RiskDomain } from './pages/RiskDomain';
import { Leadership } from './pages/Leadership';
import { MockInterview } from './pages/MockInterview';
import { CheatSheet } from './pages/CheatSheet';
import { Settings } from './pages/Settings';
import { Review } from './pages/Review';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/angular-bridge" element={<AngularBridge />} />
          <Route path="/rxjs-state" element={<RxjsState />} />
          <Route path="/testing-lab" element={<TestingLab />} />
          <Route path="/coding-lab" element={<CodingLab />} />
          <Route path="/code-review" element={<CodeReview />} />
          <Route path="/system-design" element={<SystemDesign />} />
          <Route path="/devops-controls" element={<DevOpsControls />} />
          <Route path="/risk-domain" element={<RiskDomain />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/cheat-sheet" element={<CheatSheet />} />
          <Route path="/review" element={<Review />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
