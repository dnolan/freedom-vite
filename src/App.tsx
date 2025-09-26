'use client';

import './App.css'
import { Calendar } from './components/Calendar';

export default function App() {
  return (
    <div className="App">
      <Calendar />

      <div className="key">
        <h2>Key</h2>
        <section className="days">
          <div className="key-entry">
            <div className="day">1</div>
            <span>School Day</span>
          </div>
          <div className="key-entry">
            <div className="day completed">1</div>
            <span>Completed Day</span>
          </div>
          <div className="key-entry">
            <div className="day holiday">1</div>
            <span>Holiday</span>
          </div>
        </section>
      </div>
    </div>
  );
}


