# ⚡ Quick Reference Guide

## 🎯 5-Minute Quick Start

### Step 1: Open the Application
```
1. Double-click: index.html
2. Opens in default browser
```

### Step 2: Add Your First Process
```
Arrival Time:   0 (when process enters)
Burst Time:     5 (how long it takes)
Priority:       1 (for priority scheduling)
→ Click: "➕ Add Process"
```

### Step 3: Execute an Algorithm
```
1. Dropdown: Select "FCFS (First Come First Serve)"
2. Click: "▶️ Execute"
3. View: Gantt chart appears below
```

### Step 4: Analyze Results
```
✓ Gantt Chart     - Visual execution timeline
✓ Metrics Table   - All calculated values
✓ Average Cards   - Summary metrics
✓ Charts          - Bar and pie visualizations
```

### Step 5: Compare Algorithms
```
Click: "🔄 Compare All"
View: All 6 algorithms side-by-side
```

---

## 🧮 Algorithm Selection Guide

| Algorithm | Use When | Best For |
|-----------|----------|----------|
| **FCFS** | Learning basics | Fair, simple systems |
| **SJF** | Want shorter jobs first | Batch systems |
| **SRTF** | Need preemption | Optimal WT in theory |
| **Round Robin** | Fair scheduling needed | Interactive systems |
| **Priority** | Jobs have priorities | OS task scheduling |
| **Priority-P** | Need to switch on high priority | Real-time systems |

---

## 📊 Understanding Metrics

```
AT (Arrival Time)
├─ When does process arrive? 
└─ User input

BT (Burst Time)
├─ How long does process take?
└─ User input

CT (Completion Time)
├─ When does process finish?
└─ Calculated from algorithm

TAT (Turnaround Time)
├─ Total time = CT - AT
└─ From arrival to completion

WT (Waiting Time)
├─ Time wasted = TAT - BT
└─ Lower is better

RT (Response Time)
├─ First response = First exec - AT
└─ Interactive responsiveness
```

---

## 🎮 Control Guide

### Process Management
| Button | Action |
|--------|--------|
| ➕ Add Process | Add new process to table |
| Edit (inline) | Click value in table to edit |
| Delete | Remove single process |
| 🗑️ Clear All | Remove all processes |

### Algorithm Selection
```
Dropdown Menu:
├─ FCFS
├─ SJF (Non-preemptive)
├─ SRTF (Preemptive SJF)
├─ Round Robin (shows time quantum input)
├─ Priority (Non-preemptive)
└─ Priority (Preemptive)
```

### Execution & Simulation
| Control | Action |
|---------|--------|
| ▶️ Execute | Run selected algorithm |
| Step | Advance one process |
| Play | Auto-animate |
| Pause | Stop animation |
| Reset | Clear animation |
| Speed Slider | 0.5x to 3x speed |

### Comparison
| Button | Action |
|--------|--------|
| 🔄 Compare All | Run all 6 algorithms |

---

## 💡 Tips & Tricks

### Tip 1: Sample Data
- App loads with 4 sample processes
- Try different algorithms on same data
- Great for learning comparisons

### Tip 2: Edit Processes
- Click any value in process table
- No need to delete and re-add
- Changes apply immediately

### Tip 3: Time Quantum for RR
- Input appears when selecting "Round Robin"
- Try values: 1, 2, 3, 5
- Smaller = more switching, larger = less fair

### Tip 4: Priority Values
- Lower number = higher priority
- P1 with priority 1 executes before P2 with priority 3
- In preemptive mode, higher priority interrupts

### Tip 5: Simulation Playback
- Use Speed slider for slow/fast playback
- Pause mid-simulation, then resume
- Step mode perfect for detailed analysis

### Tip 6: Comparison
- Shows all 6 algorithms automatically
- Console shows best algorithm for each metric
- Press F12 to see console messages

---

## 🔍 Reading the Gantt Chart

```
Timeline Scale (bottom)
    0  1  2  3  4  5  6  7  8  9  10

Gantt Chart:
[P1: 0-3] [P2: 3-5] [P3: 5-8]  [P4: 8-10]

Reading:
• P1 starts at 0, ends at 3 (duration: 3)
• P2 starts at 3, ends at 5 (duration: 2)
• Colors help identify processes
• During simulation, active block highlights
```

---

## 📈 Interpreting Results

### Good Results
```
✓ Low Waiting Time      - Processes don't wait long
✓ Low Response Time     - Quick first response
✓ Balanced TAT          - Fair to all processes
✓ No starvation         - All processes execute
```

### Warning Signs
```
⚠ High WT              - Processes waiting too long
⚠ Unbalanced TAT       - Some processes starved
⚠ High RT              - Slow system response
⚠ Low utilization      - CPU idle too much
```

---

## 🎓 Learning Paths

### Path 1: Understanding Basics
```
1. FCFS (simplest, understand basic scheduling)
2. SJF (optimize for average WT)
3. Round Robin (fair scheduling)
4. Compare results
```

### Path 2: Preemption Study
```
1. Run SJF non-preemptive
2. Run SRTF (preemptive)
3. Observe differences in Gantt chart
4. Compare metrics
```

### Path 3: Priority Analysis
```
1. Run Priority non-preemptive
2. Run Priority preemptive
3. Set varied priorities
4. Observe preemption points
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| No Gantt chart | Click Execute first |
| Empty metrics | Add processes, then Execute |
| Charts not showing | Check internet (Chart.js CDN) |
| Wrong results | Verify AT and BT values |
| Simulation too fast | Reduce speed slider |
| Process not adding | Check BT > 0 |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Add process (when focused on BT field) |
| Tab | Move between input fields |
| F12 | Open console (for messages/debugging) |

---

## 📱 Mobile Tips

```
• Landscape orientation recommended
• Use two-finger scroll for tables
• Tap buttons to execute
• Charts responsive and touch-friendly
```

---

## 🔗 Quick Links (In Application)

```
Within the UI:
• Select Algorithm dropdown - Change scheduling method
• Time Quantum input - For Round Robin only
• Speed slider - Adjust simulation speed
• Compare button - Run all algorithms
```

---

## 🎯 Common Use Cases

### Use Case 1: Learning
```
1. Load sample data
2. Try each algorithm
3. Read documentation
4. Understand trade-offs
```

### Use Case 2: Teaching
```
1. Prepare test data
2. Execute algorithm
3. Show Gantt chart to students
4. Compare different algorithms
5. Discuss results
```

### Use Case 3: Analysis
```
1. Input your process set
2. Run all algorithms
3. Compare metrics
4. Export results (future feature)
5. Document findings
```

---

## 📚 Metric Quick Reference

```
Want minimum WT?          → Try SJF or SRTF
Want minimum TAT?         → Try SJF or SRTF
Want fairness?            → Try Round Robin
Want priority support?    → Try Priority scheduling
Want real-time response?  → Try Priority-Preempt or RR

Comparing algorithms:
1. Look at "Compare All" table
2. Check which is best for your metric
3. Consider trade-offs
4. Choose based on goals
```

---

## 🎨 Color Legend

```
Each process gets unique color:
P1 → Blue
P2 → Red
P3 → Green
P4 → Orange
P5 → Purple
... and so on

Same colors used in:
• Gantt chart blocks
• Bar chart
• Pie chart
```

---

## ✨ Features At A Glance

```
✓ 6 CPU scheduling algorithms
✓ Process CRUD operations
✓ Gantt chart visualization
✓ 3 metric types (WT, TAT, RT)
✓ Step-by-step simulation
✓ Speed-adjustable playback
✓ Algorithm comparison
✓ Data validation
✓ Responsive design
✓ Color coding
```

---

## 🚀 Performance Expectations

```
1-5 processes:   Instant execution
10-20 processes: < 100ms
30-50 processes: < 500ms
100+ processes:  Optimization needed

Simulation:
Step mode:       Instant
Play mode:       Depends on speed slider
```

---

## 💬 Getting Help

### In-App Help
```
1. Hover over buttons (tooltips)
2. Read input labels
3. View sample data
4. Check metrics table
```

### Documentation
```
README.md        - Full user guide
TESTING.md       - Test cases & validation
ADVANCED.md      - Technical details
```

### Debugging
```
Press F12 → Console tab
Look for error messages
Check browser network tab for Chart.js CDN
```

---

## ✅ Pre-Execution Checklist

Before clicking Execute:
- [ ] At least 1 process added
- [ ] All processes have valid BT > 0
- [ ] Algorithm selected
- [ ] (If RR) Time Quantum set

---

## 🎓 Key Takeaways

1. **Different algorithms optimize different metrics**
2. **Preemption can improve metrics at cost of complexity**
3. **Priority scheduling adds unfairness but enables real-time**
4. **Round Robin provides fairness for interactive systems**
5. **Context switching has overhead (not simulated here)**

---

**Get Started:** Open `index.html` now! 🚀

For more details, see README.md or TESTING.md
