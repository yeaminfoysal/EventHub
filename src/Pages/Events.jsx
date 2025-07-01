import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Users, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [error, setError] = useState('');
  const [joinedEventIds, setJoinedEventIds] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, dateFilter]);

  useEffect(() => {
    const stored = localStorage.getItem('joinedEventIds');
    if (stored) {
      setJoinedEventIds(JSON.parse(stored));
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('https://eventhub-server.vercel.app/api/events');
      setEvents(res.data.data);
    } catch (error) {
      setError("Error fetching events");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter(event => {
        if (!event.dateTime) return false;
        const eventDate = new Date(event.dateTime);
        const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

        switch (dateFilter) {
          case 'today':
            return eventDay.getTime() === today.getTime();
          case 'current-week': {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return eventDay >= weekStart && eventDay <= weekEnd;
          }
          case 'last-week': {
            const lastWeekStart = new Date(today);
            lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
            const lastWeekEnd = new Date(lastWeekStart);
            lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
            return eventDay >= lastWeekStart && eventDay <= lastWeekEnd;
          }
          case 'current-month':
            return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
          case 'last-month': {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return eventDate.getMonth() === lastMonth.getMonth() && eventDate.getFullYear() === lastMonth.getFullYear();
          }
          default:
            return true;
        }
      });
    }

    setFilteredEvents(filtered);
  };

  const joinEvent = async (eventId) => {
    try {
      const res = await axios.patch(`https://eventhub-server.vercel.app/api/events/join/${eventId}`);
      if (res.data.success) {
        const updatedIds = [...joinedEventIds, eventId];
        setJoinedEventIds(updatedIds);
        localStorage.setItem('joinedEventIds', JSON.stringify(updatedIds));
        await fetchEvents();
      } else {
        alert(res.data.message || 'Failed to join event');
      }
    } catch (error) {
      alert('Error joining event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Explore Upcoming Events</h1>
          <p className="text-gray-600 text-lg">Join the journey, one event at a time!</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="today">Today</option>
                <option value="current-week">Current Week</option>
                <option value="last-week">Last Week</option>
                <option value="current-month">Current Month</option>
                <option value="last-month">Last Month</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
        )}

        {/* Event Cards */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-md bg-opacity-70"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>

                  <div className="flex items-center text-gray-600 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.creator}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{new Date(event.dateTime).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{event.description}</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.attendeeCount || 0} attendees</span>
                    </div>

                    <button
                      onClick={() => joinEvent(event._id)}
                      disabled={joinedEventIds.includes(event._id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all 
                        ${joinedEventIds.includes(event._id)
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'}`}
                    >
                      {joinedEventIds.includes(event._id) ? 'Joined' : 'Join Event'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Events;
