import React, { useEffect, useState } from "react";
import { Table, Card } from "antd";
import ax from "../../conf/ax";

const WebDevReport = () => {
    const [allScores, setAllScores] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScoresAndUser = async () => {
            try {
                const userResult = await ax.get('/users/me');
                const userData = userResult.data;
                setCurrentUser(userData);

                const scoresResult = await ax.get('/scores?populate=*');
                const scoresData = scoresResult.data.data;

                const filteredScores = scoresData.filter(
                    (score) => score.users_permissions_user.username === userData.username &&
                        score.subject.NameOfsubJect === "web-dev"
                );

                setAllScores(filteredScores);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching scores or user data:", error);
                setLoading(false);
            }
        };

        fetchScoresAndUser();
    }, []);


    const columns = [
        {
            title: "Category",
            dataIndex: "key",
            key: "key",
        },
        {
            title: "Score (%)",
            dataIndex: "value",
            key: "value",
        },
    ];

    return (
        <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
            <h1>Web Development Report</h1>
            {loading ? (
                <h1>Loading scores...</h1>
            ) : (
                <div>
                    {allScores.length > 0 ? (
                        allScores.map((score, index) => {

                            const scoreData = Object.keys(score)
                                .filter((key) => typeof score[key] === "number" && key !== "id")
                                .map((key) => ({
                                    key,
                                    value: score[key],
                                }));

                            return (
                                <Card
                                    key={index}
                                    title={`User: ${score.users_permissions_user.username}`}
                                    style={{ marginBottom: "20px" }}
                                >
                                    <p>Email: {score.users_permissions_user.email}</p>
                                    <h3>Scores:</h3>
                                    <Table
                                        columns={columns}
                                        dataSource={scoreData}
                                        pagination={false}
                                        bordered
                                    />
                                </Card>
                            );
                        })
                    ) : (
                        <h1>No scores found for the current user.</h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default WebDevReport;
