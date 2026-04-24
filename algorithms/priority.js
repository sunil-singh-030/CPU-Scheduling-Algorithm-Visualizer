/**
 * ========================================
 * Priority Scheduling Algorithm
 * ========================================
 * Includes both preemptive and non-preemptive versions
 * Lower priority number = Higher priority (more important)
 */

const PriorityAlgorithm = {
    name: 'Priority Scheduling',

    /**
     * Execute Non-preemptive Priority scheduling algorithm
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

        // Ensure all processes have priority
        const processList = Calculations.cloneProcesses(processes);
        processList.forEach(p => {
            if (p.priority === undefined || p.priority === null) {
                p.priority = 999; // Lowest priority
            }
        });

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

            // Select process with highest priority (lowest priority number)
            const selected = available.reduce((min, p) =>
                p.priority < min.priority ? p : min
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
            algorithm: 'Priority Scheduling (Non-preemptive)'
        };
    },

    /**
     * Execute Preemptive Priority scheduling algorithm
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
        processList.forEach(p => {
            if (p.priority === undefined || p.priority === null) {
                p.priority = 999; // Lowest priority
            }
        });

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

            // Select process with highest priority (lowest priority number)
            const selected = available.reduce((min, p) =>
                p.priority < min.priority ? p : min
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
            algorithm: 'Priority Scheduling (Preemptive)'
        };
    },

    /**
     * Get algorithm description
     * @returns {string} Description
     */
    getDescription() {
        return `
            Priority Scheduling:
            - Non-preemptive: Once a process starts, it runs to completion
            - Preemptive: Switches if higher priority process arrives
            - Lower priority number = Higher priority (more important)
            - Starvation possible: high-priority processes block low-priority ones
        `;
    }
};
