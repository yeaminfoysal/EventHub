import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import useAuthUser from '../hooks/useAuthUser';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const user = useAuthUser();

  const fetchMyEvents = async () => {
    if (!user?.username) return;

    try {
      const response = await fetch(
        `https://eventhub-server.vercel.app/api/events/my/${user.username}`
      );
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      } else {
        setError('Failed to fetch your events');
      }
    } catch (error) {
      setError('Error fetching events', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [user?.username]);

  const handleUpdate = async (updatedEvent) => {
    if (!editingEvent) return;

    const today = new Date().toISOString().split('T')[0];

    if (today > updatedEvent.dateTime) {
      setLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Invalied Date",
        text: "Something went wrong!",
      });
    }

    try {
      await axios.patch(`https://eventhub-server.vercel.app/api/events/${editingEvent._id}`, updatedEvent).then(res => {
        if (res.data.success) {
          fetchMyEvents();
          setEditingEvent(null);
          Swal.fire({
            title: "Event updated successfully!",
            icon: "success",
            draggable: true
          });
        } else {
          alert('Failed to update event');
        }
      })
    } catch (error) {
      alert('Error updating event', error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`https://eventhub-server.vercel.app/api/events/${eventId}`).then(res => {
        if (res?.data?.success) {
          fetchMyEvents();
          setShowDeleteConfirm(null);
          Swal.fire({
            title: "Event deleted successfully!",
            icon: "success",
            draggable: true
          });
        } else {
          alert('Failed to delete event');
        }
      })

    } catch (error) {
      alert('Error deleting event', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 py-10 px-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-600">Manage your created events</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events created yet
            </h3>
            <p className="text-gray-600">
              Create your first event to get started
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>

                  <div className="flex items-center text-gray-600 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.creator}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {new Date(event.dateTime).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {new Date(event.dateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {event.attendeeCount} attendees
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="cursor-pointer  flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Update</span>
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(event._id)}
                      className="cursor-pointer flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Update Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-[#00000072] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Update Event</h2>
              <UpdateEventForm
                event={editingEvent}
                onCancel={() => setEditingEvent(null)}
                onUpdate={handleUpdate}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-[#00000072] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Confirm Delete
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this event? This action cannot
                be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ---------- Update Event Form -------------
const UpdateEventForm = ({ event, onUpdate, onCancel }) => {
  const initialDate = new Date(event.dateTime);
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(initialDate.toISOString().split('T')[0]);
  const [time, setTime] = useState(initialDate.toTimeString().slice(0, 5));
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dateTime = `${date}T${time}`;;
    onUpdate({
      title,
      dateTime,
      location,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default MyEvents;
