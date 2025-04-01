import React from 'react';
import { motion } from 'framer-motion';
import { 
  WeekViewProps, 
  TimeSlotType, 
  EventType 
} from '../CalendarInterfaces';
import { getEventStyle, formatTime, isSameDay, calculateEventPosition } from '../components/UIComponents';
import { eventCategories } from '../data/calendarData';

// Helper function to get week data
const getWeekData = (currentDate: Date) => {
  const currentDay = currentDate.getDay() || 7; // 1-7 (Monday-Sunday)
  const mondayOffset = currentDay - 1;
  
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - mondayOffset);
  
  const weekData = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    
    weekData.push({
      date,
      dayOfMonth: date.getDate(),
      isToday: isSameDay(date, new Date())
    });
  }
  
  return weekData;
};

// Function to get events for a specific day
const getEventsForDay = (events: EventType[], date: Date): EventType[] => {
  return events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    if (event.allDay) {
      return isSameDay(eventStart, date);
    }
    
    // Check if any part of the event is on this day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return eventStart <= dayEnd && eventEnd >= dayStart;
  });
};

// Get time slots for the day
const getTimeSlots = (): TimeSlotType[] => {
  return Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8; // 8:00 to 21:00
    return {
      hour,
      time: `${hour}:00`
    };
  });
};

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onSlotClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
  nowIndicatorPosition,
  timeGridRef,
  selectedEvents,
  draggedOver
}) => {
  const weekData = getWeekData(currentDate);
  const timeSlots = getTimeSlots();

  return (
    <div className="h-[800px] flex flex-col">
      <div className="grid grid-cols-8 border-b border-gray-100">
        <div className="py-4 text-center text-sm font-medium text-gray-600 border-r border-gray-100">
          Heures
        </div>
        {weekData.map((day, index) => (
          <div 
            key={`weekday-${index}`} 
            className={`py-4 text-center ${
              index >= 5 ? 'text-indigo-400' : 'text-gray-600'
            }`}
          >
            <div className="text-sm font-medium">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
            </div>
            <div className={`text-xl mt-1 font-semibold ${
              day.isToday ? 'text-indigo-600' : (index >= 5 ? 'text-indigo-400' : 'text-gray-700')
            }`}>
              {day.dayOfMonth}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-8 relative divide-x divide-gray-100" ref={timeGridRef}>
          {/* Time labels */}
          <div className="bg-gray-50/80 divide-y divide-gray-100">
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="h-20 pr-2 text-right">
                <span className="text-xs font-medium text-gray-500 relative -top-2">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
          
          {/* Now indicator (red line showing current time) */}
          {weekData.some(day => day.isToday) && (
            <div 
              className="absolute left-0 right-0 h-0.5 bg-red-500 z-30 pointer-events-none" 
              style={{ top: `${nowIndicatorPosition}%` }}
            >
              <div className="absolute -left-1 -top-1.5 w-4 h-4 rounded-full bg-red-500"></div>
            </div>
          )}
          
          {/* Days */}
          {weekData.map((day, dayIndex) => {
            const dayStart = new Date(day.date);
            dayStart.setHours(8, 0, 0, 0);
            
            const dayEnd = new Date(day.date);
            dayEnd.setHours(21, 0, 0, 0);
            
            const dayEvents = getEventsForDay(events, day.date);
            
            return (
              <div 
                key={`weekday-col-${dayIndex}`} 
                className={`relative divide-y divide-gray-100 ${
                  dayIndex >= 5 ? 'bg-gray-50/30' : ''
                } ${
                  day.isToday ? 'bg-indigo-50/30' : ''
                } ${
                  draggedOver && isSameDay(new Date(draggedOver), day.date) ? 'bg-indigo-100/70' : ''
                } calendar-cell`}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => onDragEnter(day.date, e.currentTarget)}
                onDrop={onDragEnd}
              >
                {/* All-day events */}
                {dayEvents.filter(e => e.allDay).length > 0 && (
                  <div className="absolute top-0 left-0 right-0 px-1 py-1 bg-indigo-50/50 border-b border-indigo-100 z-10">
                    {dayEvents.filter(e => e.allDay).map((event, eventIndex) => (
                      <motion.div
                        key={`allday-${eventIndex}-${event.id}`}
                        id={`event-${event.id}`}
                        className={`text-xs px-2 py-1 mb-1 rounded-md truncate cursor-pointer transition-all hover:shadow-md bg-white ${
                          selectedEvents.includes(event.id) ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        style={getEventStyle(event, eventCategories)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onMouseDown={(e) => {
                          if (e.button === 0) {
                            e.stopPropagation();
                            onDragStart(event, e);
                          }
                        }}
                        draggable="true"
                      >
                        <div className="font-semibold flex items-center gap-1 text-[10px]" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eventCategories[event.category]?.color }}></span>
                          Journée
                        </div>
                        <div className="font-medium text-gray-800">{event.title}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {/* Time slots */}
                {timeSlots.map((slot) => {
                  const slotTime = new Date(day.date);
                  slotTime.setHours(slot.hour, 0, 0, 0);
                  
                  const slotEndTime = new Date(day.date);
                  slotEndTime.setHours(slot.hour + 1, 0, 0, 0);
                  
                  return (
                    <div 
                      key={`timeslot-${dayIndex}-${slot.hour}`} 
                      className="h-20 relative hover:bg-indigo-50/30 transition-colors cursor-pointer time-slot"
                      onClick={() => onSlotClick({ 
                        date: day.date,
                        start: slotTime,
                        end: slotEndTime
                      })}
                    ></div>
                  );
                })}
                
                {/* Events */}
                {dayEvents.filter(e => !e.allDay).map((event, eventIndex) => {
                  const { top, height } = calculateEventPosition(
                    event, 
                    new Date(day.date).setHours(8, 0, 0, 0), 
                    new Date(day.date).setHours(21, 0, 0, 0)
                  );
                  
                  return (
                    <motion.div
                      key={`event-${eventIndex}-${event.id}`}
                      id={`event-${event.id}`}
                      className={`absolute left-0 right-0 mx-1 rounded-md px-2 py-1 overflow-hidden shadow-sm hover:shadow-md cursor-pointer z-20 ${
                        selectedEvents.includes(event.id) ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      style={{
                        ...getEventStyle(event, eventCategories),
                        top: `${top}%`,
                        height: `${height}%`,
                        maxHeight: `${height}%`,
                        boxShadow: selectedEvents.includes(event.id) ? '0 4px 12px rgba(79, 70, 229, 0.3)' : ''
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      onMouseDown={(e) => {
                        if (e.button === 0) {
                          e.stopPropagation();
                          onDragStart(event, e);
                        }
                      }}
                      draggable="true"
                      whileHover={{
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        scale: 1.01
                      }}
                    >
                      {/* Resize handles */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-transparent cursor-ns-resize hover:bg-indigo-200/50"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-transparent cursor-ns-resize hover:bg-indigo-200/50"></div>
                      
                      <div className="text-xs font-semibold" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                        {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                      </div>
                      <div className="text-xs font-medium text-gray-800 truncate">
                        {event.title}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;