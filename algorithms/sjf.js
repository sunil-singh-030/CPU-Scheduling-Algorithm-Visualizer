/**
 * ========================================
 * SJF (Shortest Job First) Algorithm
 * ========================================
 * Includes both non-preemptive and preemptive (SRTF) versions
 */

const SJFAlgorithm = {
    name: 'SJF (Shortest Job First - Non-preemptive)',

    /**
     * Execute Non-preemptive SJF scheduling algorithm
     * @param {Array} processes - Array of processes with {id, arrivalTime, burstTime, priority}
     * @returns {Object} Result with gantt data and metrics
     */
    executeNonPreemptive(processes) {
        // Validate input
        const validation = Calculations.validateProcesses(processes);
        if (!validation.isValid) {
            console.error('Invalid processes:', validation.errors);
            return null;
        }

        // Clone processes to avoid mutation
        const processList = Calculations.cloneProcesses(processes);
        const ganttData = [];
        let currentTime = 0;
        const executed = new Set();

        while (executed.size < processList.length) {
            // Find all processes that have arrived
            const available = processList.filter(p =>
                !executed.has(p.id) && p.arrivalTime <= currentTime
            );

            if (available.length === 0) {
                // No process available, find next arrival
                const nextArrival = Math.min(
                    ...processList
                        .filter(p => !executed.has(p.id))
                        .map(p => p.arrivalTime)
                );
                currentTime = nextArrival;
                continue;
            }

            // Select process with shortest burst time
            const selected = available.reduce((min, p) =>
                p.burstTime < min.burstTime ? p : min
            );

            const startTime = currentTime;
            const endTime = currentTime + selected.burstTime;

            ganttData.push({
                id: selected.id,
                start: startTime,
                end: endTime
            });

            executed.add(selected.id);
            currentTime = endTime;
        }

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
     * Execute Preemptive SJF (SRTF) scheduling algorithm
     * @param {Array} processes - Array of processes with {id, arrivalTime, burstTime, priority}
     * @returns {Object} Result with gantt data and metrics
     */
    executePreemptive(processes) {
        // Validate input
        const validation = Calculations.validateProcesses(processes);
        if (!validation.isValid) {
            console.error('Invalid processes:', validation.errors);
            return null;
        }

        // Clone processes and track remaining time
        const processList = Calculations.cloneProcesses(processes);
        const remaining = {};
        processList.forEach(p => {
            remaining[p.id] = p.burstTime;
        });

        const ganttData = [];
        let currentTime = 0;
        let currentProcess = null;
        const completed = new Set();

        // Find the latest arrival time and add buffer
        const maxArrivalTime = Math.max(...processList.map(p => p.arrivalTime));
        const totalBurstTime = processList.reduce((sum, p) => sum + p.burstTime, 0);
        const endTime = maxArrivalTime + totalBurstTime + 100;

        while (completed.size < processList.length && currentTime < endTime) {
            // Find all processes that have arrived
            const available = processList.filter(p =>
                !completed.has(p.id) && p.arrivalTime <= currentTime && remaining[p.id] > 0
            );

            if (available.length === 0) {
                // No process available
                if (completed.size < processList.length) {
                    const nextArrival = Math.min(
                        ...processList
                            .filter(p => !completed.has(p.id))
                            .map(p => p.arrivalTime)
                    );
                    currentTime = nextArrival;
                } else {
                    break;
                }
                continue;
            }

            // Select process with shortest remaining time
            const selected = available.reduce((min, p) =>
                remaining[p.id] < remaining[min.id] ? p : min
            );

            // Execute for 1 unit of time
            const startTime = currentTime;
            const endTimeBlock = currentTime + 1;
            remaining[selected.id]--;

            // Check if this process is different from the current block
            if (currentProcess !== selected.id || ganttData.length === 0) {
                // Start new block
                ganttData.push({
                    id: selected.id,
                    start: startTime,
                    end: endTimeBlock
                });
                currentProcess = selected.id;
            } else {
                // Extend existing block
                ganttData[ganttData.length - 1].end = endTimeBlock;
            }

            if (remaining[selected.id] === 0) {
                completed.add(selected.id);
            }

            currentTime = endTimeBlock;
        }

        // Calculate metrics
        const result = Calculations.calculateMetrics(ganttData, processes);

        return {
            gantt: ganttData,
            metrics: Calculations.formatMetrics(result.metrics),
            averages: result.averages,
            algorithm: 'SRTF (Shortest Remaining Time First - Preemptive)'
        };
    },

    /**
     * Get algorithm description
     * @returns {string} Description
     */
    getDescription() {
        return `
            SJF (Shortest Job First):
            - Non-preemptive: Selects the process with shortest burst time among available processes
            - Preemptive (SRTF): Preempts if a shorter job arrives
            - Minimizes average waiting time for uniform arrival times
            - Can starve long processes if shorter jobs keep arriving
        `;
    }
};
