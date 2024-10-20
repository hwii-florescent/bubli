// ActivityDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../App'; // Adjust the path if necessary
import axios from 'axios';
import { apiUrl } from '../constant';

const ActivityDetail = () => {
  const { user } = useContext(AuthContext);
  const { date } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Decode the date from the URL
        const decodedDate = decodeURIComponent(date);

        const response = await axios.get(
          `${apiUrl}/users/${user.email}/activities/${decodedDate}`
        );

        const activityData = response.data.activity;
        setActivity({ date: decodedDate, ...activityData });
        console.log(activityData);
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };

    if (user) {
      fetchActivity();
    }
  }, [user, date]);

  if (!activity) {
    return <p>Loading activity...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{activity.prompt}</h1>
      <p className="mb-2">
        <strong>Date:</strong> {new Date(activity.date).toLocaleString()}
      </p>
      <p className="mb-2">
        <strong>Answer:</strong> {activity.answer}
      </p>
      <p className="mb-2">
        <strong>Mood Answer:</strong> {activity.mood_answer}
      </p>
      <p className="mb-2">
        <strong>Mood Rating:</strong> {activity.mood_rating}
      </p>
      {activity.songId && (
        <div className="mt-4">
        <iframe
          src={`https://open.spotify.com/embed/track/${activity.songId}`}
          width="300"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
          title="Spotify Player"
        ></iframe>
      </div>
      )}
        
    </div>
  );
};

export default ActivityDetail;
