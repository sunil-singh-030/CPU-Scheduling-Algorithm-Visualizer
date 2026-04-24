/**
 * ========================================
 * Calculations Utility Module
 * ========================================
 * Handles all metric calculations for scheduling algorithms
 */

const Calculations = {
    /**
     * Calculate Completion Time (CT), Turnaround Time (TAT), 
     * Waiting Time (WT), and Response Time (RT) for all processes
     * 
     * @param {Array} ganttData - Array of objects with {id, start, end}
     * @param {Array} processes - Array of original processes with {id, arrivalTime, burstTime}
     * @returns {Object} metrics and averages
     */
    calculateMetrics(ganttData, processes) {
        const metrics = [];
        
        // Create a map for quick access to gantt data
        const ganttMap = {};
        ganttData.forEach(block => {
            if (!ganttMap[block.id]) {
                ganttMap[block.id] = { start: block.start, end: block.end, firstStart: block.start };
            } else {
                ganttMap[block.id].end = block.end;
            }
        });

        // Calculate metrics for each process
        processes.forEach(process => {
            if (ganttMap[process.id]) {
                const gantt = ganttMap[process.id];
                const ct = gantt.end; // Completion Time
                const at = process.arrivalTime; // Arrival Time
                const bt = process.burstTime; // Burst Time
                const tat = ct - at; // Turnaround Time
                const wt = tat - bt; // Waiting Time
                const rt = gantt.firstStart - at; // Response Time

                metrics.push({
                    id: process.id,
                    at: at,
                    bt: bt,
                    ct: ct,
                    tat: tat,
                    wt: Math.max(0, wt), // Ensure non-negative
                    rt: Math.max(0, rt)  // Ensure non-negative
                });
            }
        });

        // Calculate averages
        const averages = this.calculateAverages(metrics);

        return {
            metrics: metrics,
            averages: averages
        };
    },

    /**
     * Calculate average WT, TAT, and RT
     * @param {Array} metrics - Array of metric objects
     * @returns {Object} averages
     */
    calculateAverages(metrics) {
        if (metrics.length === 0) {
            return { wt: 0, tat: 0, rt: 0 };
        }

        const sumWT = metrics.reduce((sum, m) => sum + m.wt, 0);
        const sumTAT = metrics.reduce((sum, m) => sum + m.tat, 0);
        const sumRT = metrics.reduce((sum, m) => sum + m.rt, 0);

        return {
            wt: (sumWT / metrics.length).toFixed(2),
            tat: (sumTAT / metrics.length).toFixed(2),
            rt: (sumRT / metrics.length).toFixed(2)
        };
    },

    /**
     * Find the maximum time in gantt chart (total execution time)
     * @param {Array} ganttData - Gantt chart data
     * @returns {number} maximum time
     */
    getMaxTime(ganttData) {
        if (ganttData.length === 0) return 0;
        return Math.max(...ganttData.map(block => block.end));
    },

    /**
     * Validate process data
     * @param {Array} processes - Process array to validate
     * @returns {Object} {isValid, errors}
     */
    validateProcesses(processes) {
        const errors = [];

        if (!Array.isArray(processes) || processes.length === 0) {
            errors.push("No processes to schedule");
        }

        processes.forEach((proc, index) => {
            if (!proc.id || proc.id.trim() === "") {
                errors.push(`Process ${index + 1}: Invalid Process ID`);
            }
            if (isNaN(proc.arrivalTime) || proc.arrivalTime < 0) {
                errors.push(`Process ${index + 1}: Invalid Arrival Time`);
            }
            if (isNaN(proc.burstTime) || proc.burstTime <= 0) {
                errors.push(`Process ${index + 1}: Invalid Burst Time`);
            }
            if (proc.priority !== undefined && (isNaN(proc.priority) || proc.priority <= 0)) {
                errors.push(`Process ${index + 1}: Invalid Priority`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Format metrics for display
     * @param {Array} metrics - Metrics array
     * @returns {Array} formatted metrics
     */
    formatMetrics(metrics) {
        return metrics.map(m => ({
            ...m,
            at: m.at,
            bt: m.bt,
            ct: m.ct,
            tat: Math.round(m.tat * 100) / 100,
            wt: Math.round(m.wt * 100) / 100,
            rt: Math.round(m.rt * 100) / 100
        }));
    },

    /**
     * Get timeline markers for gantt chart based on max time
     * @param {number} maxTime - Maximum time value
     * @returns {Array} array of time markers
     */
    getTimelineMarkers(maxTime) {
        const markers = [];
        const step = Math.max(1, Math.ceil(maxTime / 10)); // Aim for ~10 markers

        for (let i = 0; i <= maxTime; i += step) {
            markers.push(i);
        }

        // Always include maxTime if not already there
        if (markers[markers.length - 1] !== maxTime) {
            markers.push(maxTime);
        }

        return markers;
    },

    /**
     * Generate a unique process ID
     * @param {Array} existingProcesses - Existing processes
     * @returns {string} new process ID like "P1", "P2", etc.
     */
    generateProcessId(existingProcesses) {
        const existingIds = existingProcesses.map(p => {
            const match = p.id.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        });

        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
        return `P${maxId + 1}`;
    },

    /**
     * Sort processes by arrival time
     * @param {Array} processes - Array of processes
     * @returns {Array} sorted processes
     */
    sortByArrivalTime(processes) {
        return [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    },

    /**
     * Sort processes by burst time (for SJF)
     * @param {Array} processes - Array of processes
     * @returns {Array} sorted processes
     */
    sortByBurstTime(processes) {
        return [...processes].sort((a, b) => a.burstTime - b.burstTime);
    },

    /**
     * Sort processes by priority
     * @param {Array} processes - Array of processes
     * @returns {Array} sorted processes (lower priority number = higher priority)
     */
    sortByPriority(processes) {
        return [...processes].sort((a, b) => a.priority - b.priority);
    },

    /**
     * Deep clone processes to avoid mutation
     * @param {Array} processes - Process array
     * @returns {Array} cloned processes
     */
    cloneProcesses(processes) {
        return processes.map(p => ({ ...p }));
    }
};
