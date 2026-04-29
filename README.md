# 🧮 CPU Scheduling Algorithm Visualizer

A fully-featured interactive web-based tool for visualizing and analyzing CPU scheduling algorithms. Built with pure HTML, CSS, and JavaScript (no frameworks).

## ✨ Features


### 1. ** Process Management **
- ✅ Dynamic process table with CRUD operations
- ✅ Add/Edit/Delete processes on-the-fly
- ✅ Auto-generated Process IDs (P1, P2, P3...)
- ✅ Input validation for Arrival Time, Burst Time, and Priority

### 2. **Scheduling Algorithms**
- ✅ **FCFS** (First Come First Serve)
- ✅ **SJF** (Shortest Job First - Non-preemptive)
- ✅ **SRTF** (Shortest Remaining Time First - Preemptive)
- ✅ **Round Robin** (with configurable time quantum)
- ✅ **Priority Scheduling** (both preemptive and non-preemptive)

### 3. **Metrics Calculation**
For each process:
- **AT**: Arrival Time
- **BT**: Burst Time
- **CT**: Completion Time
- **TAT**: Turnaround Time (CT - AT)
- **WT**: Waiting Time (TAT - BT)
- **RT**: Response Time

### 4. **Gantt Chart Visualization**
- ✅ Dynamic, color-coded Gantt chart
- ✅ Proportional block widths based on execution time
- ✅ Time scale with markers
- ✅ Support for preemptive algorithm visualization (split blocks)
- ✅ Hover tooltips with process details

### 5. **Simulation Controls**
- ✅ **Step** - Execute one process at a time
- ✅ **Play** - Automatic simulation with adjustable speed
- ✅ **Pause** - Pause ongoing simulation
- ✅ **Reset** - Reset simulation to beginning
- ✅ Speed control (0.5x to 3x)

### 6. **Data Visualization**
- ✅ Bar chart comparing WT, TAT, and RT for all processes
- ✅ Pie chart showing CPU time distribution
- ✅ Average metrics cards (Avg WT, Avg TAT, Avg RT)

### 7. **Algorithm Comparison**
- ✅ Compare all 6 algorithms simultaneously
- ✅ Side-by-side metrics table
- ✅ Automatic identification of best algorithm for each metric

## 📁 Project Structure

```
project-2/
├── index.html                 # Main HTML file
├── style.css                  # Complete styling with responsive design
├── script.js                  # Main controller and UI orchestration
├── algorithms/
│   ├── fcfs.js               # FCFS algorithm implementation
│   ├── sjf.js                # SJF and SRTF implementations
│   ├── roundRobin.js         # Round Robin implementation
│   └── priority.js           # Priority scheduling implementations
└── utils/
    ├── calculations.js       # Metric calculations and utilities
    └── gantt.js              # Gantt chart rendering and visualization
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for Chart.js library via CDN)

### Installation
1. Clone or download the project
2. Open `index.html` in your web browser
3. No build process or dependencies to install!

### Basic Usage

#### Step 1: Add Processes
1. Enter Arrival Time (AT) - when the process arrives
2. Enter Burst Time (BT) - how long the process takes
3. Enter Priority (optional, for priority scheduling)
4. Click **"➕ Add Process"** or press Enter
5. Repeat for multiple processes

#### Step 2: Select Algorithm
1. Click the algorithm dropdown
2. Choose from:
   - FCFS (First Come First Serve)
   - SJF (Shortest Job First - Non-preemptive)
   - SRTF (Preemptive SJF)
   - Round Robin (configure time quantum if needed)
   - Priority (Non-preemptive)
   - Priority (Preemptive)

#### Step 3: Execute
1. Click **"▶️ Execute"** button
2. View the Gantt chart, metrics, and statistics

#### Step 4: Simulate
- Click **Step** to advance one process at a time
- Click **Play** for automatic simulation
- Adjust **Speed** slider (0.5x to 3x)
- Use **Pause** to stop simulation
- Use **Reset** to restart simulation

#### Step 5: Compare
1. Click **"🔄 Compare All"** to run all algorithms
2. View comparison table with all algorithms' metrics
3. See which algorithm is best for WT, TAT, and RT

## 📊 Metrics Explained

### Arrival Time (AT)
When the process enters the system/queue

### Burst Time (BT)
Total CPU time needed by the process

### Completion Time (CT)
When the process finishes execution

### Turnaround Time (TAT)
TAT = CT - AT
Total time from arrival to completion

### Waiting Time (WT)
WT = TAT - BT
Time spent waiting in queue

### Response Time (RT)
RT = First CPU allocation time - AT
Time from arrival to first execution

## 🎨 Algorithm Details

### FCFS (First Come First Serve)
- Processes execute in arrival order
- Non-preemptive (no interruption)
- Simple but can have high waiting time
- Good for batch processing

### SJF (Shortest Job First)
- **Non-preemptive**: Selects shortest job among available
- Minimizes average waiting time
- Can starve long processes
- **Preemptive (SRTF)**: Interrupts if shorter job arrives

### Round Robin (RR)
- Each process gets fixed time slice (quantum)
- Preemptive: switches after quantum expires
- Fair distribution of CPU
- Performance depends on quantum value

### Priority Scheduling
- **Non-preemptive**: Once started, runs to completion
- **Preemptive**: Switches if higher priority process arrives
- Lower priority number = higher priority
- Risk of starvation (low priority processes blocked)

## 💡 Key Implementation Details

### Algorithm Format
All algorithms return consistent format:
```javascript
{
  gantt: [
    { id: "P1", start: 0, end: 5 },
    { id: "P2", start: 5, end: 10 }
  ],
  metrics: [
    { id: "P1", at: 0, bt: 5, ct: 5, tat: 5, wt: 0, rt: 0 }
  ],
  averages: {
    wt: "2.50",
    tat: "7.50",
    rt: "0.50"
  },
  algorithm: "Algorithm Name"
}
```

### Color Coding
- Each process gets a unique color (up to 12)
- Colors are consistent across all visualizations
- Active process during simulation is highlighted with animation

### Responsive Design
- Works on desktop, tablet, and mobile
- Flexbox/Grid layout for adaptability
- Touch-friendly buttons and inputs

## 🧪 Testing Examples

### Test Case 1: All Processes Arrive Together
```
P1: AT=0, BT=5
P2: AT=0, BT=3
P3: AT=0, BT=7
```
Best for: Compare FCFS vs SJF performance

### Test Case 2: Sequential Arrivals
```
P1: AT=0, BT=4
P2: AT=1, BT=3
P3: AT=2, BT=5
```
Tests priority and preemption handling

### Test Case 3: Priority Test
```
P1: AT=0, BT=8, Priority=3
P2: AT=1, BT=4, Priority=1 (highest)
P3: AT=2, BT=2, Priority=2
```
Compare preemptive vs non-preemptive

### Test Case 4: Edge Case - Single Process
```
P1: AT=0, BT=5
```
Minimal overhead verification

## ⚙️ Technical Highlights

### Pure JavaScript Implementation
- No frameworks or heavy dependencies
- Only Chart.js for data visualization
- Efficient algorithm implementations
- Proper separation of concerns

### Performance Optimizations
- Handles up to 50 processes efficiently
- Minimal DOM re-renders
- Optimized Gantt chart scaling
- Lazy chart initialization

### Code Quality
- Well-commented functions
- Modular architecture
- Consistent naming conventions
- Error handling and validation

## 🎯 Sample Data

The application comes with pre-loaded sample processes:
- P1: AT=0, BT=8, Priority=3
- P2: AT=1, BT=4, Priority=1
- P3: AT=2, BT=2, Priority=3
- P4: AT=3, BT=1, Priority=2

**Try executing different algorithms on this data to see how they differ!**

## 🚀 Bonus Features Included

✅ Real-time simulation with speed control
✅ Step-by-step execution mode
✅ Algorithm comparison tool
✅ Color-coded process visualization
✅ Responsive design for all devices
✅ Smooth animations and transitions
✅ Dark mode support (CSS ready)

## 📝 Future Enhancements

- [ ] Export results as JSON/CSV
- [ ] Dark mode toggle UI
- [ ] Advanced statistics (variance, standard deviation)
- [ ] Process import/export
- [ ] Custom algorithm implementation interface
- [ ] Animation speed presets
- [ ] Keyboard shortcuts

## 🐛 Known Limitations

- Maximum 12 different colors (preemptive algorithms may have more unique time blocks)
- Browser's JavaScript execution speed limits simulation speed
- Large datasets (50+ processes) may require optimization

## 📄 License

Open source - Feel free to use and modify for educational purposes

## 🙏 Credits

Built as an educational tool for understanding CPU scheduling algorithms

---

**Start visualizing scheduling algorithms now! Open `index.html` in your browser.** 🚀
