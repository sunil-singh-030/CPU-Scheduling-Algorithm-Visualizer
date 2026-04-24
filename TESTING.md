# 🧪 Testing Guide - CPU Scheduling Visualizer

This document provides comprehensive testing procedures and test cases for the CPU Scheduling Algorithm Visualizer.

## ✅ Verification Checklist

### UI/UX Functionality
- [ ] Process input form works and validates data
- [ ] Add process button adds process to table
- [ ] Edit process inline in table
- [ ] Delete individual process works
- [ ] Clear all processes works
- [ ] Algorithm selector changes and shows/hides time quantum for RR
- [ ] Execute button runs algorithm successfully
- [ ] Gantt chart displays correctly
- [ ] Metrics table shows all calculations
- [ ] Averages display correctly
- [ ] Charts (bar and pie) render properly

### Simulation Controls
- [ ] Play starts animation
- [ ] Step advances one process
- [ ] Pause stops animation mid-way
- [ ] Resume continues from pause
- [ ] Reset clears highlights and resets step
- [ ] Speed slider adjusts simulation speed
- [ ] Color highlighting works during simulation

### Algorithm Correctness
- [ ] FCFS executes processes in arrival order
- [ ] SJF non-preemptive selects shortest job
- [ ] SRTF preempts when shorter job arrives
- [ ] Round Robin respects time quantum
- [ ] Priority algorithms respect priority values
- [ ] Preemptive priority switches on higher priority arrival

### Data Display
- [ ] Gantt chart scales proportionally
- [ ] Time markers display correctly
- [ ] Process IDs are visible in blocks
- [ ] Tooltips show start/end times
- [ ] Metrics table shows accurate calculations
- [ ] All columns present: AT, BT, CT, TAT, WT, RT

### Comparison Feature
- [ ] Compare button runs all algorithms
- [ ] Comparison table shows all 6 algorithms
- [ ] Average values are calculated correctly
- [ ] Best algorithm for each metric is identified

---

## 📋 Test Case 1: Basic FCFS Test

**Objective**: Verify FCFS executes in arrival order

**Test Data**:
```
P1: AT=0, BT=5, Priority=1
P2: AT=0, BT=3, Priority=1
P3: AT=0, BT=2, Priority=1
```

**Expected Result - Gantt Chart**:
```
P1 (0-5) → P2 (5-8) → P3 (8-10)
```

**Expected Metrics**:
```
P1: CT=5, TAT=5, WT=0, RT=0
P2: CT=8, TAT=8, WT=5, RT=5
P3: CT=10, TAT=10, WT=8, RT=8
Averages: WT=4.33, TAT=7.67, RT=4.33
```

**Steps**:
1. Add three processes with above data
2. Select FCFS algorithm
3. Click Execute
4. Verify order: P1 → P2 → P3
5. Verify metrics match expected values

---

## 📋 Test Case 2: SJF (Non-Preemptive) Test

**Objective**: Verify SJF selects shortest job

**Test Data**:
```
P1: AT=0, BT=8, Priority=1
P2: AT=1, BT=4, Priority=1
P3: AT=2, BT=2, Priority=1
```

**Expected Result - Gantt Chart**:
```
P1 (0-8) → P3 (8-10) → P2 (10-14)
```
(P1 starts before others arrive, P3 is shortest among available, then P2)

**Expected Metrics**:
```
P1: CT=8, TAT=8, WT=0, RT=0
P2: CT=14, TAT=13, WT=9, RT=9
P3: CT=10, TAT=8, WT=6, RT=6
Averages: WT=5, TAT=9.67, RT=5
```

**Steps**:
1. Clear previous data
2. Add three processes with above data
3. Select "SJF (Non-preemptive)"
4. Click Execute
5. Verify order and metrics

---

## 📋 Test Case 3: SRTF (Preemptive) Test

**Objective**: Verify SRTF preempts on shorter job arrival

**Test Data**:
```
P1: AT=0, BT=8, Priority=1
P2: AT=1, BT=4, Priority=1
P3: AT=2, BT=2, Priority=1
```

**Expected Result - Gantt Chart**:
```
P1 (0-1) → P2 (1-3) → P3 (3-5) → P2 (5-9) → P1 (9-15)
```
(P1 interrupted by P2, P2 interrupted by P3, then P2 completes, then P1)

**Note**: Exact sequence depends on algorithm implementation

**Steps**:
1. Clear previous data
2. Add three processes
3. Select "SRTF (Preemptive)"
4. Click Execute
5. Verify preemption occurs (split blocks)
6. Verify averages are different from non-preemptive

---

## 📋 Test Case 4: Round Robin Test

**Objective**: Verify Round Robin with time quantum

**Test Data**:
```
P1: AT=0, BT=8, Priority=1
P2: AT=0, BT=4, Priority=1
P3: AT=0, BT=2, Priority=1
Time Quantum: 2
```

**Expected Result - Gantt Chart**:
```
P1 (0-2) → P2 (2-4) → P3 (4-6) → P1 (6-8) → P2 (8-10) → P1 (10-12)
```

**Steps**:
1. Clear previous data
2. Add three processes
3. Select "Round Robin"
4. Set Time Quantum to 2
5. Click Execute
6. Verify each block is ≤ time quantum width
7. Verify processes cycle in queue order

---

## 📋 Test Case 5: Priority Scheduling Test

**Objective**: Verify priority-based execution

**Test Data**:
```
P1: AT=0, BT=5, Priority=3 (low priority)
P2: AT=1, BT=3, Priority=1 (high priority)
P3: AT=2, BT=2, Priority=2 (medium priority)
```

**Expected - Non-Preemptive**:
```
P1 (0-5) → P2 (5-8) → P3 (8-10)
```
(P1 starts first because already running, then P2 because higher priority)

**Expected - Preemptive**:
```
P1 (0-1) → P2 (1-4) → P3 (4-6) → P1 (6-8)
```
(P1 interrupted when P2 arrives with higher priority)

**Steps**:
1. Clear and add three processes
2. Try "Priority (Non-preemptive)"
3. Note execution order
4. Execute again with "Priority (Preemptive)"
5. Verify different behavior

---

## 📋 Test Case 6: CPU Idle Time Test

**Objective**: Verify handling of gaps when processes arrive late

**Test Data**:
```
P1: AT=0, BT=3, Priority=1
P2: AT=10, BT=2, Priority=1
P3: AT=15, BT=1, Priority=1
```

**Expected Result - Gantt Chart**:
```
P1 (0-3) → [IDLE 3-10] → P2 (10-12) → [IDLE 12-15] → P3 (15-16)
```

**Verification Points**:
- [ ] Gantt chart shows gap between processes
- [ ] Gantt chart skips to P2 arrival time (10)
- [ ] Waiting times reflect idle time correctly
- [ ] Total completion time is 16

**Steps**:
1. Clear and add three processes with large gaps
2. Execute any algorithm
3. Observe gaps in Gantt chart (showing proper handling of idle CPU)
4. Verify metrics reflect the idle time

---

## 📋 Test Case 7: Single Process Test

**Objective**: Test edge case with only one process

**Test Data**:
```
P1: AT=0, BT=5, Priority=1
```

**Expected for All Algorithms**:
```
Gantt: P1 (0-5)
CT=5, TAT=5, WT=0, RT=0
Averages: WT=0, TAT=5, RT=0
```

**Steps**:
1. Clear all processes
2. Add single process
3. Execute each algorithm
4. Verify all show same result

---

## 📋 Test Case 8: No Processes Test

**Objective**: Verify proper error handling

**Steps**:
1. Clear all processes
2. Click Execute without adding any
3. Verify error message: "Please add at least one process"
4. Click Play without executing first
5. Verify error message appears

---

## 📋 Test Case 9: Comparison Test

**Objective**: Verify algorithm comparison feature

**Test Data**: Use pre-loaded sample data

**Steps**:
1. Keep sample data or add your own
2. Click "🔄 Compare All"
3. Verify comparison results show 6 algorithms:
   - [ ] FCFS
   - [ ] SJF
   - [ ] SRTF
   - [ ] RR (q=2)
   - [ ] Priority
   - [ ] Priority-P
4. Verify each row has values for WT, TAT, RT
5. Check console for best algorithm for each metric

---

## 📋 Test Case 10: Simulation Controls Test

**Objective**: Verify simulation features work correctly

**Steps**:
1. Execute any algorithm
2. **Test Step Button**:
   - Click "Step" multiple times
   - Observe highlighting advances one block
3. **Test Play Button**:
   - Click "Play"
   - Observe automatic animation
   - Verify speed reflects current setting
4. **Test Pause Button**:
   - Click "Play"
   - Wait for animation
   - Click "Pause"
   - Verify animation stops
   - Click "Play" again
   - Verify resumes from same position
5. **Test Speed Control**:
   - Execute algorithm
   - Click "Play"
   - Drag speed slider to different values
   - Verify animation speed changes

---

## 🔧 Manual Calculations - Verification Guide

### For FCFS with processes arriving at time 0:

1. **Determine execution order**: Processes in arrival order
2. **Calculate CT**: Start time + Duration
3. **Calculate TAT**: CT - AT
4. **Calculate WT**: TAT - BT
5. **Calculate RT**: First CPU access - AT
6. **Calculate Averages**: Sum / Count

### Example:
```
P1: AT=0, BT=5 → CT=5, TAT=5, WT=0, RT=0
P2: AT=0, BT=3 → CT=8, TAT=8, WT=5, RT=5
P3: AT=0, BT=2 → CT=10, TAT=10, WT=8, RT=8

Avg WT = (0+5+8)/3 = 4.33
Avg TAT = (5+8+10)/3 = 7.67
Avg RT = (0+5+8)/3 = 4.33
```

---

## 🎯 Performance Testing

**Test with Large Dataset**:
1. Add 30-50 processes programmatically
2. Execute FCFS and Round Robin
3. Verify:
   - [ ] No significant lag
   - [ ] Charts render properly
   - [ ] Metrics display correctly
   - [ ] Simulation animations smooth

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Charts not displaying | Check Chart.js CDN connection |
| Metrics incorrect | Verify process arrival times and burst times |
| Gantt blocks overlap | Refresh page, clear cache |
| Simulation too fast/slow | Adjust speed slider (0.5x to 3x) |
| Process not in table | Verify burst time > 0 |

---

## ✅ Final Verification Checklist

Before considering the project complete:

- [ ] All 6 algorithms work correctly
- [ ] Metrics calculations are accurate
- [ ] Gantt chart displays properly
- [ ] Simulation controls work smoothly
- [ ] Comparison feature shows all algorithms
- [ ] Responsive design works on different screen sizes
- [ ] No console errors
- [ ] Performance acceptable with 50+ processes
- [ ] Error handling for edge cases
- [ ] Code is well-commented and modular

---

## 📞 Troubleshooting

**If something doesn't work:**

1. Open Developer Tools (F12)
2. Check Console tab for error messages
3. Verify all files are loaded (Network tab)
4. Clear browser cache and reload
5. Try with sample data first
6. Test with simpler cases (1-2 processes)

---

**Happy Testing!** 🚀
