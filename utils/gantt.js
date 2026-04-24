/**
 * ========================================
 * Gantt Chart Visualization Module
 * ========================================
 * Handles rendering and display of Gantt charts
 */

const GanttVisualizer = {
    /**
     * Process color mapping
     */
    colorMap: {
        'P1':  '#3498db',  // Blue
        'P2':  '#e74c3c',  // Red
        'P3':  '#2ecc71',  // Green
        'P4':  '#f39c12',  // Orange
        'P5':  '#9b59b6',  // Purple
        'P6':  '#1abc9c',  // Teal
        'P7':  '#e67e22',  // Dark Orange
        'P8':  '#34495e',  // Dark Gray
        'P9':  '#c0392b',  // Dark Red
        'P10': '#16a085',  // Dark Teal
        'P11': '#8e44ad',  // Dark Purple
        'P12': '#d35400'   // Rust
    },

    /**
     * Get color for a process (with fallback for processes beyond 12)
     * @param {string} processId - Process ID like "P1", "P2"
     * @returns {string} CSS color value
     */
    getProcessColor(processId) {
        if (this.colorMap[processId]) {
            return this.colorMap[processId];
        }

        // Fallback: generate color based on process number
        const num = parseInt(processId.slice(1));
        const colors = Object.values(this.colorMap);
        return colors[num % colors.length];
    },

    /**
     * Render the Gantt chart
     * @param {Array} ganttData - Array of blocks with {id, start, end}
     * @param {HTMLElement} container - Container element
     * @param {number} maxTime - Maximum time value for scaling
     */
    render(ganttData, container, maxTime) {
        container.innerHTML = '';

        if (!ganttData || ganttData.length === 0) {
            container.innerHTML = '<p class="info-text">No scheduling data available</p>';
            return;
        }

        const ganttChart = document.createElement('div');
        ganttChart.className = 'gantt-chart';

        // 20px per unit time, minimum 600px wide
        const chartWidth = Math.max(600, maxTime * 20);
        const scale = chartWidth / maxTime;

        ganttChart.style.minWidth = chartWidth + 'px';
        ganttChart.style.width = chartWidth + 'px';
        // Switch to relative positioning so blocks can be placed absolutely
        ganttChart.style.position = 'relative';
        ganttChart.style.display = 'block';

        // Render each block using absolute positioning — this is the correct approach.
        // Using marginLeft in a flex row caused double-offset: the block's natural
        // flex position PLUS the marginLeft both added up, making the chart wrong.
        ganttData.forEach(block => {
            const blockElement = this.createBlock(block, scale);
            ganttChart.appendChild(blockElement);
        });

        container.appendChild(ganttChart);

        // Render timeline scale
        this.renderTimeline(container, maxTime, scale, chartWidth);
    },

    /**
     * Create a single Gantt chart block
     * @param {Object} block - Block data {id, start, end}
     * @param {number} scale - Scale factor (pixels per time unit)
     * @returns {HTMLElement} block element
     */
    createBlock(block, scale) {
        const blockElement = document.createElement('div');
        blockElement.className = 'gantt-block';

        const duration = block.end - block.start;
        const width = duration * scale;
        const leftPos = block.start * scale;

        // Use absolute positioning so blocks sit exactly at their time position.
        // The old code used marginLeft in a flex row which caused double-offset:
        // flex natural position + marginLeft both contributed, making blocks misaligned.
        blockElement.style.position = 'absolute';
        blockElement.style.left = leftPos + 'px';
        blockElement.style.width = width + 'px';
        blockElement.style.top = '4px';
        blockElement.style.height = '32px';
        blockElement.style.backgroundColor = this.getProcessColor(block.id);

        // Add tooltip and label
        blockElement.title = `${block.id}: ${block.start} → ${block.end} (Duration: ${duration})`;
        blockElement.textContent = block.id;

        // Add data attributes for simulation highlighting
        blockElement.dataset.processId = block.id;
        blockElement.dataset.start = block.start;
        blockElement.dataset.end = block.end;

        return blockElement;
    },

    /**
     * Render timeline scale below gantt chart
     * @param {HTMLElement} container - Container element
     * @param {number} maxTime - Maximum time value
     * @param {number} scale - Scale factor (pixels per time unit)
     */
    renderTimeline(container, maxTime, scale, chartWidth) {
        const existingTimeline = container.querySelector('.timeline-scale');
        if (existingTimeline) existingTimeline.remove();

        const timeline = document.createElement('div');
        timeline.className = 'timeline-scale';
        timeline.style.minWidth = chartWidth + 'px';
        timeline.style.width = chartWidth + 'px';
        timeline.style.position = 'relative';
        timeline.style.height = '20px';
        // display:block so absolute children work correctly
        timeline.style.display = 'block';

        const markers = Calculations.getTimelineMarkers(maxTime);

        markers.forEach(time => {
            const marker = document.createElement('div');
            marker.className = 'timeline-marker';
            marker.textContent = time;
            // Absolute positioning aligns each number exactly under its time slot.
            // Old code used marginLeft in a flex row, which stacked offsets incorrectly.
            marker.style.position = 'absolute';
            marker.style.left = (time * scale) + 'px';
            marker.style.transform = 'translateX(-50%)';
            timeline.appendChild(marker);
        });

        container.appendChild(timeline);
    },

    /**
     * Highlight a specific process in the gantt chart
     * @param {string} processId - Process ID to highlight
     * @param {HTMLElement} container - Gantt chart container
     */
    highlightProcess(processId, container) {
        // Remove previous highlights
        const blocks = container.querySelectorAll('.gantt-block');
        blocks.forEach(block => {
            block.classList.remove('active');
        });

        // Add highlight to matching block
        if (processId) {
            const targetBlock = container.querySelector(`[data-process-id="${processId}"]`);
            if (targetBlock) {
                targetBlock.classList.add('active');
            }
        }
    },

    /**
     * Clear all highlights
     * @param {HTMLElement} container - Gantt chart container
     */
    clearHighlights(container) {
        const blocks = container.querySelectorAll('.gantt-block');
        blocks.forEach(block => {
            block.classList.remove('active');
        });
    },

    /**
     * Get statistics about the gantt chart
     * @param {Array} ganttData - Gantt chart data
     * @returns {Object} statistics
     */
    getStatistics(ganttData) {
        if (!ganttData || ganttData.length === 0) {
            return { totalTime: 0, gaps: 0, processCount: 0 };
        }

        const sortedBlocks = [...ganttData].sort((a, b) => a.start - b.start);
        const totalTime = Calculations.getMaxTime(ganttData);
        const processCount = new Set(ganttData.map(b => b.id)).size;

        // Calculate CPU idle time (gaps)
        let gaps = 0;
        for (let i = 1; i < sortedBlocks.length; i++) {
            const gap = sortedBlocks[i].start - sortedBlocks[i - 1].end;
            if (gap > 0) {
                gaps += gap;
            }
        }

        return {
            totalTime: totalTime,
            idleTime: gaps,
            utilization: ((totalTime - gaps) / totalTime * 100).toFixed(2),
            processCount: processCount
        };
    }
};