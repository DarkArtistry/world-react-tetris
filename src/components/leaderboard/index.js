import React, { Component } from "react";
import { database } from "../../firebase";

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      leaderboard: [],
      loading: false,
    };
  }

  // Fetch leaderboard data from Firebase
  fetchLeaderboard = () => {
    this.setState({ loading: true });
    database.ref("leaderboard").once("value", (snapshot) => {
      const leaderboardData = snapshot.val() || {};
      const leaderboard = Object.keys(leaderboardData)
        .map((key) => ({
          name: key,
          score: leaderboardData[key],
        }))
        .sort((a, b) => b.score - a.score); // Sort scores descending

      this.setState({ leaderboard, loading: false });
    });
  };

  // Submit score to Firebase
  submitScore = () => {
    const { score } = this.state;
    const userName = prompt("Enter your name to submit your score:"); // Get username

    if (userName) {
      database.ref(`leaderboard/${userName}`).set(score, (error) => {
        if (error) {
          console.error("Error submitting score: ", error);
        } else {
          alert("Score submitted successfully!");
          this.fetchLeaderboard(); // Refresh leaderboard
        }
      });
    }
  };

  // Show leaderboard after play
  handleEndGame = (score) => {
    this.fetchLeaderboard(); // Fetch leaderboard when game ends
  };

  render() {
    const { score, leaderboard, loading } = this.state;

    return (
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          padding: "12px",
          width: "65%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <div
          style={{ backgroundColor: "#9ead86", width: "100%", height: "100%" }}
        >
          <h3>Your Score: {score}</h3>
          <button onClick={this.submitScore}>Submit Score</button>
          <h4>Leaderboard</h4>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {leaderboard?.map((entry, index) => (
                <li key={index}>
                  {entry?.name}: {entry?.score}
                </li>
              ))}
            </ul>
          )}
          <button>Close</button>
        </div>
      </div>
    );
  }
}

export default Leaderboard;
