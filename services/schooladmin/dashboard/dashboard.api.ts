export const api = {
    classes: () => fetch("/api/class/list").then(r => r.json()),
    students: () => fetch("/api/student/list").then(r => r.json()),
    teachers: () => fetch("/api/teacher/list").then(r => r.json()),
    attendance: () => fetch("/api/attendance/view").then(r => r.json()),
    fees: () => fetch("/api/fees/summary").then(r => r.json()),
    events: () => fetch("/api/events/list").then(r => r.json()),
    news: () => fetch("/api/newsfeed/list").then(r => r.json()),
    leavesAll: () => fetch("/api/leaves/all").then(r => r.json()),
    leavesPending: () => fetch("/api/leaves/pending").then(r => r.json()),
    tcRequestsAll: () => fetch("/api/tc/list").then(r => r.json()),
    tcRequestsPending: () => fetch(`/api/tc/list?status=PENDING`).then(r => r.json()),
};
