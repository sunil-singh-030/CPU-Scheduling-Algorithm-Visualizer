/**
 * ========================================
 * CPU Scheduling Visualizer - Main Controller
 * ========================================
 * Handles UI interactions, data management, and orchestration
 */

class SchedulerApp {
    constructor() {
        this.processes = [];
        this.processCounter = 0;
        this.currentResult = null;
        this.simulation = {
            isRunning: false,
            isPaused: false,
            currentStep: 0,
            ganttData: [],
            speed: 1
        };
        this.comparisonResults = null;
        this.charts = {
            comparison: null,
            distribution: null
        };

        this.initializeEventListeners();
        this.loadSampleData();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Process management
        document.getElementById('addProcessBtn').addEventListener('click', () => this.addProcess());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllProcesses());

        // Algorithm selection
        const algorithmSelect = document.getElementById('algorithmSelect');
        algorithmSelect.addEventListener('change', (e) => this.onAlgorithmChanged(e));

        // Execution
        document.getElementById('executeBtn').addEventListener('click', () => this.executeAlgorithm());

        // Simulation controls
        document.getElementById('stepBtn').addEventListener('click', () => this.stepSimulation());
        document.getElementById('playBtn').addEventListener('click', () => this.playSimulation());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseSimulation());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSimulation());

        // Speed control
        document.getElementById('speed').addEventListener('input', (e) => {
            this.simulation.speed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = e.target.value + 'x';
        });

        // Comparison
        document.getElementById('compareBtn').addEventListener('click', () => this.compareAllAlgorithms());

        // Enter key on inputs
        document.getElementById('burstTime').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addProcess();
        });
    }

    /**
     * Load sample data for demonstration
     */
    loadSampleData() {
        const sampleProcesses = [
            { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 3 },
            { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
            { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 3 },
            { id: 'P4', arrivalTime: 3, burstTime: 1, priority: 2 }
        ];

        this.processes = sampleProcesses;
        this.processCounter = 4;
        this.renderProcessTable();
    }

    /**
     * Add a new process
     */
    addProcess() {
        const arrivalTime = parseInt(document.getElementById('arrivalTime').value) || 0;
        const burstTime = parseInt(document.getElementById('burstTime').value);
        const priority = parseInt(document.getElementById('priority').value) || 1;

        if (!burstTime || burstTime <= 0) {
            alert('Please enter a valid burst time');
            return;
        }

        const newProcess = {
            id: Calculations.generateProcessId(this.processes),
            arrivalTime: Math.max(0, arrivalTime),
            burstTime: burstTime,
            priority: Math.max(1, priority)
        };

        this.processes.push(newProcess);
        this.renderProcessTable();

        // Clear inputs
        document.getElementById('arrivalTime').value = 0;
        document.getElementById('burstTime').value = 5;
        document.getElementById('priority').value = 1;

        // Focus back to burst time
        document.getElementById('burstTime').focus();
    }

    /**
     * Edit a process (inline)
     */
    editProcess(processId, field, value) {
        const process = this.processes.find(p => p.id === processId);
        if (process) {
            const numValue = parseInt(value);
            if (field === 'arrivalTime' && numValue >= 0) {
                process.arrivalTime = numValue;
            } else if (field === 'burstTime' && numValue > 0) {
                process.burstTime = numValue;
            } else if (field === 'priority' && numValue > 0) {
                process.priority = numValue;
            }
            this.renderProcessTable();
        }
    }

    /**
     * Delete a process
     */
    deleteProcess(processId) {
        this.processes = this.processes.filter(p => p.id !== processId);
        this.renderProcessTable();
    }

    /**
     * Clear all processes
     */
    clearAllProcesses() {
        if (confirm('Are you sure? This will delete all processes.')) {
            this.processes = [];
            this.renderProcessTable();
            this.clearResults();
        }
    }

    /**
     * Render the process table
     */
    renderProcessTable() {
        const tbody = document.getElementById('processList');
        tbody.innerHTML = '';

        if (this.processes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No processes added</td></tr>';
            return;
        }

        this.processes.forEach(process => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${process.id}</td>
                <td><input type="number" value="${process.arrivalTime}" min="0" onchange="app.editProcess('${process.id}', 'arrivalTime', this.value)" style="width: 50px;"></td>
                <td><input type="number" value="${process.burstTime}" min="1" onchange="app.editProcess('${process.id}', 'burstTime', this.value)" style="width: 50px;"></td>
                <td><input type="number" value="${process.priority}" min="1" onchange="app.editProcess('${process.id}', 'priority', this.value)" style="width: 50px;"></td>
                <td><button class="btn btn-danger" onclick="app.deleteProcess('${process.id}')">Delete</button></td>
            `;

            tbody.appendChild(row);
        });
    }

    /**
     * Handle algorithm change
     */
    onAlgorithmChanged(event) {
        const algorithm = event.target.value;
        const timeQuantumGroup = document.getElementById('timeQuantumGroup');

        if (algorithm === 'rr') {
            timeQuantumGroup.style.display = 'flex';
        } else {
            timeQuantumGroup.style.display = 'none';
        }
    }

    /**
     * Execute the selected algorithm
     */
    executeAlgorithm() {
        if (this.processes.length === 0) {
            alert('Please add at least one process');
            return;
        }

        const algorithm = document.getElementById('algorithmSelect').value;

        try {
            if (algorithm === 'fcfs') {
                this.currentResult = FCFSAlgorithm.execute(this.processes);
            } else if (algorithm === 'sjf') {
                this.currentResult = SJFAlgorithm.executeNonPreemptive(this.processes);
            } else if (algorithm === 'srtf') {
                this.currentResult = SJFAlgorithm.executePreemptive(this.processes);
            } else if (algorithm === 'rr') {
                const timeQuantum = parseInt(document.getElementById('timeQuantum').value) || 2;
                this.currentResult = RoundRobinAlgorithm.execute(this.processes, timeQuantum);
            } else if (algorithm === 'priority') {
                this.currentResult = PriorityAlgorithm.executeNonPreemptive(this.processes);
            } else if (algorithm === 'priority-preemptive') {
                this.currentResult = PriorityAlgorithm.executePreemptive(this.processes);
            }

            if (this.currentResult) {
                this.displayResults();
                this.resetSimulation();
            }
        } catch (error) {
            console.error('Error executing algorithm:', error);
            alert('Error executing algorithm: ' + error.message);
        }
    }

    /**
     * Display results on UI
     */
    displayResults() {
        if (!this.currentResult) return;

        // Update Gantt chart
        const ganttContainer = document.getElementById('ganttChartContainer');
        const maxTime = Calculations.getMaxTime(this.currentResult.gantt);
        GanttVisualizer.render(this.currentResult.gantt, ganttContainer, maxTime);

        // Update metrics table
        this.renderMetricsTable(this.currentResult.metrics);

        // Update averages
        this.updateAverages(this.currentResult.averages);

        // Update charts
        this.updateCharts(this.currentResult.metrics);

        // Store for simulation
        this.simulation.ganttData = this.currentResult.gantt;
        this.simulation.currentStep = 0;
    }

    /**
     * Render metrics table
     */
    renderMetricsTable(metrics) {
        const tbody = document.getElementById('metricsList');
        tbody.innerHTML = '';

        metrics.forEach(metric => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${metric.id}</td>
                <td>${metric.at}</td>
                <td>${metric.bt}</td>
                <td>${metric.ct}</td>
                <td>${metric.tat}</td>
                <td>${metric.wt}</td>
                <td>${metric.rt}</td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Update averages display
     */
    updateAverages(averages) {
        document.getElementById('avgWT').textContent = averages.wt;
        document.getElementById('avgTAT').textContent = averages.tat;
        document.getElementById('avgRT').textContent = averages.rt;
    }

    /**
     * Update Chart.js visualizations
     */
    updateCharts(metrics) {
        // Prepare data for comparison chart
        const labels = metrics.map(m => m.id);
        const wtData = metrics.map(m => m.wt);
        const tatData = metrics.map(m => m.tat);
        const rtData = metrics.map(m => m.rt);

        // Destroy existing charts
        if (this.charts.comparison) this.charts.comparison.destroy();
        if (this.charts.distribution) this.charts.distribution.destroy();

        // Comparison chart (Bar)
        const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
        this.charts.comparison = new Chart(comparisonCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Waiting Time (WT)',
                        data: wtData,
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Turnaround Time (TAT)',
                        data: tatData,
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Response Time (RT)',
                        data: rtData,
                        backgroundColor: 'rgba(231, 76, 60, 0.7)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Distribution chart (Pie)
        const burstTimes = metrics.map(m => m.bt);
        const distributionCtx = document.getElementById('distributionChart').getContext('2d');
        this.charts.distribution = new Chart(distributionCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: burstTimes,
                    backgroundColor: [
                        '#3498db', '#e74c3c', '#2ecc71',
                        '#f39c12', '#9b59b6', '#1abc9c',
                        '#e67e22', '#34495e', '#c0392b',
                        '#16a085', '#8e44ad', '#d35400'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    /**
     * Step through simulation
     */
    stepSimulation() {
        if (!this.currentResult || this.simulation.ganttData.length === 0) {
            alert('Execute an algorithm first');
            return;
        }

        if (this.simulation.currentStep < this.simulation.ganttData.length) {
            const block = this.simulation.ganttData[this.simulation.currentStep];
            this.highlightGanttBlock(block.id);
            this.simulation.currentStep++;
        }
    }

    /**
     * Play simulation
     */
    playSimulation() {
        if (!this.currentResult || this.simulation.ganttData.length === 0) {
            alert('Execute an algorithm first');
            return;
        }

        this.simulation.isRunning = true;
        this.simulation.isPaused = false;
        document.getElementById('playBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;

        this.runSimulationStep();
    }

    /**
     * Run simulation step-by-step
     */
    runSimulationStep() {
        if (!this.simulation.isRunning || this.simulation.isPaused) return;

        if (this.simulation.currentStep < this.simulation.ganttData.length) {
            const block = this.simulation.ganttData[this.simulation.currentStep];
            this.highlightGanttBlock(block.id);
            this.simulation.currentStep++;

            const delay = 1000 / this.simulation.speed;
            setTimeout(() => this.runSimulationStep(), delay);
        } else {
            this.simulation.isRunning = false;
            document.getElementById('playBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = true;
        }
    }

    /**
     * Pause simulation
     */
    pauseSimulation() {
        this.simulation.isPaused = true;
        document.getElementById('playBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }

    /**
     * Reset simulation
     */
    resetSimulation() {
        this.simulation.isRunning = false;
        this.simulation.isPaused = false;
        this.simulation.currentStep = 0;
        document.getElementById('playBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;

        const ganttContainer = document.getElementById('ganttChartContainer');
        GanttVisualizer.clearHighlights(ganttContainer);
    }

    /**
     * Highlight a block in the gantt chart
     */
    highlightGanttBlock(processId) {
        const ganttContainer = document.getElementById('ganttChartContainer');
        GanttVisualizer.highlightProcess(processId, ganttContainer);
    }

    /**
     * Compare all algorithms
     */
    compareAllAlgorithms() {
        if (this.processes.length === 0) {
            alert('Please add at least one process');
            return;
        }

        const algorithms = [
            { name: 'FCFS', fn: () => FCFSAlgorithm.execute(this.processes) },
            { name: 'SJF', fn: () => SJFAlgorithm.executeNonPreemptive(this.processes) },
            { name: 'SRTF', fn: () => SJFAlgorithm.executePreemptive(this.processes) },
            { name: 'RR (q=2)', fn: () => RoundRobinAlgorithm.execute(this.processes, 2) },
            { name: 'Priority', fn: () => PriorityAlgorithm.executeNonPreemptive(this.processes) },
            { name: 'Priority-P', fn: () => PriorityAlgorithm.executePreemptive(this.processes) }
        ];

        this.comparisonResults = [];

        algorithms.forEach(algo => {
            try {
                const result = algo.fn();
                if (result) {
                    this.comparisonResults.push({
                        algorithm: algo.name,
                        avgWT: parseFloat(result.averages.wt),
                        avgTAT: parseFloat(result.averages.tat),
                        avgRT: parseFloat(result.averages.rt)
                    });
                }
            } catch (error) {
                console.error(`Error in ${algo.name}:`, error);
            }
        });

        this.displayComparisonResults();
    }

    /**
     * Display comparison results
     */
    displayComparisonResults() {
        const resultsDiv = document.getElementById('comparisonResults');
        const tableDiv = document.getElementById('comparisonTable');

        if (!this.comparisonResults || this.comparisonResults.length === 0) {
            resultsDiv.style.display = 'none';
            return;
        }

        // Create comparison table
        let html = '<table class="table"><thead><tr>';
        html += '<th>Algorithm</th><th>Avg WT</th><th>Avg TAT</th><th>Avg RT</th></tr></thead><tbody>';

        this.comparisonResults.forEach(result => {
            html += `<tr>
                <td>${result.algorithm}</td>
                <td>${result.avgWT.toFixed(2)}</td>
                <td>${result.avgTAT.toFixed(2)}</td>
                <td>${result.avgRT.toFixed(2)}</td>
            </tr>`;
        });

        html += '</tbody></table>';

        tableDiv.innerHTML = html;
        resultsDiv.style.display = 'block';

        // Find best algorithms
        const bestWT = this.comparisonResults.reduce((min, r) => r.avgWT < min.avgWT ? r : min);
        const bestTAT = this.comparisonResults.reduce((min, r) => r.avgTAT < min.avgTAT ? r : min);
        const bestRT = this.comparisonResults.reduce((min, r) => r.avgRT < min.avgRT ? r : min);

        console.log(`Best for WT: ${bestWT.algorithm} (${bestWT.avgWT.toFixed(2)})`);
        console.log(`Best for TAT: ${bestTAT.algorithm} (${bestTAT.avgTAT.toFixed(2)})`);
        console.log(`Best for RT: ${bestRT.algorithm} (${bestRT.avgRT.toFixed(2)})`);
    }

    /**
     * Clear all results
     */
    clearResults() {
        this.currentResult = null;
        document.getElementById('ganttChartContainer').innerHTML = '';
        document.getElementById('metricsList').innerHTML = '';
        document.getElementById('avgWT').textContent = '-';
        document.getElementById('avgTAT').textContent = '-';
        document.getElementById('avgRT').textContent = '-';
        this.resetSimulation();
    }
}

// Initialize the application when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SchedulerApp();
});