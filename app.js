// app.js
class SymptomTracker {
    constructor() {
        this.symptomHistory = JSON.parse(localStorage.getItem('symptomHistory')) || [];
        this.form = document.getElementById('symptomForm');
        this.riskDisplay = document.getElementById('riskDisplay');
        this.adviceList = document.getElementById('adviceList');
        this.historyDisplay = document.getElementById('historyDisplay');
        
        this.initializeEventListeners();
        this.displayHistory();
        this.displayAdvice();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission();
        });
    }

    handleSubmission() {
        const symptoms = Array.from(this.form.querySelectorAll('input[name="symptoms"]'))
            .reduce((acc, input) => {
                acc[input.value] = input.checked;
                return acc;
            }, {});

        const traveledRecently = this.form.querySelector('input[name="travel"]').checked;

        this.logSymptoms(symptoms, traveledRecently);
        this.evaluateRisk(symptoms, traveledRecently);
        this.displayHistory();
        this.form.reset();
    }

    logSymptoms(symptoms, traveledRecently) {
        const entry = {
            date: new Date().toLocaleDateString(),
            symptoms,
            traveledRecently
        };

        this.symptomHistory.push(entry);
        localStorage.setItem('symptomHistory', JSON.stringify(this.symptomHistory));
    }

    evaluateRisk(symptoms, traveledRecently) {
        const isHighRisk = symptoms.Fever && symptoms.Fatigue && traveledRecently;
        
        this.riskDisplay.textContent = isHighRisk 
            ? "High Risk: Seek medical attention."
            : "Low Risk: Monitor your symptoms and take care.";
        
        this.riskDisplay.className = `risk-display ${isHighRisk ? 'risk-high' : 'risk-low'}`;
    }

    displayAdvice() {
        const advice = [
            "Stay hydrated.",
            "Isolate if needed.",
            "Call a local health center if symptoms persist."
        ];

        this.adviceList.innerHTML = advice
            .map(tip => `<li>${tip}</li>`)
            .join('');
    }

    displayHistory() {
        if (this.symptomHistory.length === 0) {
            this.historyDisplay.innerHTML = '<p>No symptom history available.</p>';
            return;
        }

        this.historyDisplay.innerHTML = this.symptomHistory
            .map((entry, index) => {
                const symptomsHtml = Object.entries(entry.symptoms)
                    .map(([symptom, value]) => `<li>${symptom}: ${value ? 'Yes' : 'No'}</li>`)
                    .join('');

                return `
                    <div class="history-entry">
                        <h3>Day ${index + 1} - ${entry.date}</h3>
                        <ul>
                            ${symptomsHtml}
                            <li>Traveled Recently: ${entry.traveledRecently ? 'Yes' : 'No'}</li>
                        </ul>
                    </div>
                `;
            })
            .join('');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SymptomTracker();
});