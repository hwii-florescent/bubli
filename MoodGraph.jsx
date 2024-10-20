import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const MoodGraph = ({ email }) => {
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${email}/mood-ratings/`);
        if (response.ok) {
          const data = await response.json();
          setMoodData(data);
        } else {
          console.error("Failed to fetch mood data");
        }
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    };

    fetchMoodData();
  }, [email]);

  return (
    <div className="graph-container">
      <h2>Mood Ratings Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={moodData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => format(new Date(tick), 'MMM dd yyyy')}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="mood_rating" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodGraph;
