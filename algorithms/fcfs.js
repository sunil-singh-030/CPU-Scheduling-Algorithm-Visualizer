/**
 * ========================================
 * FCFS (First Come First Serve) Algorithm
 * ========================================
 * Processes execute in the order they arrive
 * Non-preemptive: Once a process starts, it runs to completion
 */

const FCFSAlgorithm = {
    name: 'FCFS (First Come First Serve)',

    /**
     * Execute FCFS scheduling algorithm
     * @param {Array} processes - Array of processes with {id, arrivalTime, burstTime, priority}
     * @returns {Object} Result with gantt data and metrics
     */
    execute(processes) {
        // Validate input
        const validation = Calculations.validateProcesses(processes);
        if (!validation.isValid) {
            console.error('Invalid processes:', validation.errors);
            return null;
        }

        // Clone processes to avoid mutation
        const processList = Calculations.cloneProcesses(processes);

        // Sort by arrival time (FCFS order)
        processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

        const ganttData = [];
        let currentTime = 0;

        // Schedule each process
        processList.forEach(process => {
            // Process cannot start before arrival time
            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }

            // Add to Gantt chart
            const startTime = currentTime;
            const endTime = currentTime + process.burstTime;

            ganttData.push({
                id: process.id,
                start: startTime,
                end: endTime
            });

            currentTime = endTime;
        });

        // Calculate metrics
        const result = Calculations.calculateMetrics(ganttData, processes);

        return {
            gantt: ganttData,
            metrics: Calculations.formatMetrics(result.metrics),
            averages: result.averages,
            algorithm: this.name
        };
    },

    /**
     * Get algorithm description
     * @returns {string} Description
     */
    getDescription() {
        return `
            FCFS (First Come First Serve):
            - Processes are executed in the order they arrive
            - Once a process starts, it runs to completion (non-preemptive)
            - Simple but can have high average waiting time
            - Good for background batch processing
        `;
    }
};
