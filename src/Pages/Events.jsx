import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Users, Search, Filter } from 'lucide-react';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, dateFilter]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/events');
      setEvents(res.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
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
      const res = await axios.patch(`http://localhost:3000/api/events/join/${eventId}`);
      if (res.data.success) {
        await fetchEvents(); // Refresh
      } else {
        alert(res.data.message || 'Failed to join event');
      }
    } catch (error) {
      alert('Error joining event', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Events</h1>
          <p className="text-gray-600">Discover and join amazing events</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{event.attendeeCount || 0} attendees</span>
                    </div>

                    <button
                      onClick={() => joinEvent(event._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Join Event
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
