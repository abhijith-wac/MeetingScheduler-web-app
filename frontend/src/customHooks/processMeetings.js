const processMeetings = (meetings) => {
    if (!Array.isArray(meetings)) return [];
  
    return meetings
      .map((m) => {
        if (!m.date || !m.startTime || !m.endTime) return null;
  
        const baseDate = new Date(m.date);
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const day = baseDate.getDate();
  
        const [startHour, startMinute] = m.startTime.split(":").map(Number);
        const [endHour, endMinute] = m.endTime.split(":").map(Number);
  
        const start = new Date(year, month, day, startHour, startMinute);
        const end = new Date(year, month, day, endHour, endMinute);
  
        return { ...m, start, end };
      })
      .filter(Boolean);
  };
  
  export default processMeetings;
  