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
import actions from "../../actions";
import store from "../../store";
import { MiniKit, tokenToDecimals, Tokens } from "@worldcoin/minikit-js";
import Button from "../button";

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      leaderboard: [],
      loading: true,
    };
  }
  componentWillMount() {
    this.fetchLeaderboard();
  }

  // Fetch leaderboard data from Firebase
  fetchLeaderboard = async () => {
    try {
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

        this.setState({ leaderboard, loading: false });
      });
    } catch (error) {
      this.setState({ leaderboard: [], loading: false });
    }
  };

  async sendPayment() {
    console.log("MiniKit.isInstalled() : ", MiniKit.isInstalled());
    // const res = await fetch('/api/initiate-payment', {
    // method: 'POST',
    // });
    // const { id } = await res.json();

    const uuid = crypto.randomUUID().replace(/-/g, "");

    const payload = {
      reference: uuid,
      to: "xxxxxxxxxxxxx", // Test address
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
        },
      ],
      description: "Test example payment for minikit",
    };

    if (MiniKit.isInstalled()) {
      MiniKit.commands.pay(payload);
    }
  }

  // Submit score to Firebase
  submitScore = async () => {
    try {
      await this.sendPayment();
      const { points } = this.props;
      const name = prompt(`Enter your name to submit your score(${points}):`);

      if (name) {
        await addDoc(collection(db, "leaderboard"), {
          name,
          points,
        });
        store.dispatch(actions.pointsSubmitted(true));
        this.fetchLeaderboard();
      }
    } catch (error) {}
  };

  render() {
    const { leaderboard, loading } = this.state;
    const { cur, pause, points, pointsSubmitted } = this.props;

    if (!cur && !pause)
      return (
        <div className={style.container}>
          <div className={style.wrapper}>
            <h4 className={style.pointsText}>Your Points: {points}</h4>
            {!pointsSubmitted && (
              <div className={style.buttonContainer}>
                <Button onClick={this.submitScore}>Submit Score</Button>
              </div>
            )}
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
                      {loading ? "Loading..." : "No Data Found"}
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
  pointsSubmitted: state.get("pointsSubmitted"),
});

export default connect(mapStateToProps)(Leaderboard);
