// History.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Adjust the path if necessary
import { format } from 'date-fns'; // For formatting dates
import axios from 'axios';

const History = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/users/${user.email}/activities/`
        );
        const activitiesData = response.data;

        // Convert the activities dictionary into an array
        const activitiesList = Object.keys(activitiesData).map((date) => ({
          date,
          ...activitiesData[date],
        }));

        // Sort activities by date in descending order (most recent first)
        activitiesList.sort((a, b) => new Date(b.date) - new Date(a.date));

        setActivities(activitiesList);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    if (user) {
      fetchActivities();
    }
  }, [user]);

  const handleActivityClick = (date) => {
    // Encode the date to make it URL-safe
    const encodedDate = encodeURIComponent(date);
    navigate(`/activities/${encodedDate}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Activity History</h1>
      <div className="h-96 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.date}
              className="p-4 mb-4 bg-white shadow-md rounded cursor-pointer"
              onClick={() => handleActivityClick(activity.date)}
            >
              <h2 className="text-xl font-semibold">{activity.prompt}</h2>
              <p className="text-gray-600">
                {format(new Date(activity.date), 'PPpp')}
              </p>
            </div>
          ))
        ) : (
          <p>No activities found.</p>
        )}
      </div>
    </div>
  );
};

export default History;
