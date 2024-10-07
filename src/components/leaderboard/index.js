import React, { Component } from "react";
import { db } from "../../firebase";
import { connect } from "react-redux";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import * as style from "./index.less";

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      leaderboard: [],
      loading: false,
    };
  }
  componentWillMount() {
    this.fetchLeaderboard();
  }

  // Fetch leaderboard data from Firebase
  fetchLeaderboard = async () => {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("points", "desc"),
      limit(10)
    );

    await getDocs(q).then((querySnapshot) => {
      const leaderboard = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      this.setState({ leaderboard });
    });
  };

  // Submit score to Firebase
  submitScore = async () => {
    try {
      const { points } = this.props;
      const name = prompt(`Enter your name to submit your score(${points}):`);

      if (name) {
        await addDoc(collection(db, "leaderboard"), {
          name,
          points,
        });

        this.fetchLeaderboard();
      }
    } catch (error) {}
  };

  render() {
    const { leaderboard } = this.state;
    const { cur, pause, points } = this.props;

    if (!cur && !pause)
      return (
        <div className={style.container}>
          <div className={style.wrapper}>
            <h4 className={style.pointsText}>Your Points: {points}</h4>
            <button className={style.submitBtn} onClick={this.submitScore}>
              Submit Score
            </button>
            <h4 className={style.leaderboardHeading}>Leaderboard</h4>
            <table className={style.leaderboardTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard?.length > 0 ? (
                  leaderboard?.map((entry, index) => (
                    <tr key={index}>
                      <td>
                        {index + 1}. {entry?.name}
                      </td>
                      <td>{entry?.points}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      style={{ textAlign: "center", padding: "24px" }}
                      colSpan={2}
                    >
                      No Data Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );

    return null;
  }
}

const mapStateToProps = (state) => ({
  pause: state.get("pause"),
  cur: state.get("cur"),
  theme: state.get("theme"),
  points: state.get("points"),
});

export default connect(mapStateToProps)(Leaderboard);
