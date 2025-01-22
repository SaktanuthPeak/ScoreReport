import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag } from "antd";
import './user.css'
import { Navigate, useNavigate } from "react-router-dom";
import ax from "../conf/ax";



const WebDevReport = () => {
    const [allScore, setAllScore] = useState(null);

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            try {
                const result = await ax.get('/scores')
                const ScoreData = result.data.data
                console.log(ScoreData);
                setAllScore(ScoreData);

            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        }

        fetchSubjectDetails();

    }, [])

    return (
        <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
            <h1>This is WebDevReport</h1>
            {allScore ? (
                <>
                    <h1>Final score got: {allScore.FinalScore}/40 </h1>
                    <h1>Midterm Score got: {allScore.MidtermScore}/40</h1>
                    <h1>Quiz score got: {allScore.Quiz1}/10</h1>
                </>
            ) : (
                <h1>Loading scores...</h1>
            )}
        </div>
    );
};

export default WebDevReport;
