/**
 * ========================================
 * Round Robin (RR) Algorithm
 * ========================================
 * Each process gets a time slice (quantum) to execute
 * Preemptive: if process doesn't complete, it goes to back of queue
 */

const RoundRobinAlgorithm = {
    name: 'Round Robin',

    /**
     * Execute Round Robin scheduling algorithm
     * @param {Array} processes - Array of processes with {id, arrivalTime, burstTime, priority}
     * @param {number} timeQuantum - Time quantum for each process
     * @returns {Object} Result with gantt data and metrics
     */
    execute(processes, timeQuantum = 2) {
        // Validate input
        const validation = Calculations.validateProcesses(processes);
        if (!validation.isValid) {
            console.error('Invalid processes:', validation.errors);
            return null;
        }

        if (!timeQuantum || timeQuantum <= 0) {
            console.error('Invalid time quantum');
            return null;
        }

        // Clone processes and track remaining time
        const processList = Calculations.cloneProcesses(processes);
        const remaining = {};
        processList.forEach(p => {
            remaining[p.id] = p.burstTime;
        });

        // Sort by arrival time to initialize queue
        processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

        const ganttData = [];
        let currentTime = 0;
        const queue = [];
        let processIndex = 0;

        // Initialize queue with first arriving process
        while (processIndex < processList.length && processList[processIndex].arrivalTime <= currentTime) {
            queue.push(processList[processIndex]);
            processIndex++;
        }

        while (queue.length > 0 || processIndex < processList.length) {
            // If queue is empty, jump to next arrival
            if (queue.length === 0) {
                currentTime = processList[processIndex].arrivalTime;
                queue.push(processList[processIndex]);
                processIndex++;
            }

            const current = queue.shift();

            // Execute for up to timeQuantum
            const executeTime = Math.min(timeQuantum, remaining[current.id]);
            const startTime = currentTime;
            const endTime = currentTime + executeTime;

            ganttData.push({
                id: current.id,
                start: startTime,
                end: endTime
            });

            remaining[current.id] -= executeTime;
            currentTime = endTime;

            // Add newly arrived processes to queue
            while (processIndex < processList.length && processList[processIndex].arrivalTime <= currentTime) {
                queue.push(processList[processIndex]);
                processIndex++;
            }

            // If process not completed, add back to queue
            if (remaining[current.id] > 0) {
                queue.push(current);
            }
        }

        // Calculate metrics
        const result = Calculations.calculateMetrics(ganttData, processes);

        return {
            gantt: ganttData,
            metrics: Calculations.formatMetrics(result.metrics),
            averages: result.averages,
            algorithm: `Round Robin (Time Quantum: ${timeQuantum})`
        };
    },

    /**
     * Get algorithm description
     * @returns {string} Description
     */
    getDescription() {
        return `
            Round Robin (RR):
            - Each process gets a fixed time slice (quantum) to execute
            - If not completed, process goes to back of queue
            - Preemptive: switches process after time quantum expires
            - Fair distribution, good for interactive systems
            - Performance depends on time quantum value
        `;
    }
};
