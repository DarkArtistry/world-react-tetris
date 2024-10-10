import React, { Component } from "react";
import { db } from "../../firebase";
import { connect } from "react-redux";
import {
  addDoc,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import * as style from "./index.less";
import actions from "../../actions";
import store from "../../store";
import { 
  MiniKit, tokenToDecimals, Tokens, VerificationLevel,
  ResponseEvent, ISuccessResult, MiniAppVerifyActionPayload
 } from "@worldcoin/minikit-js";
import Button from "../button";
import Pagination from "./pagination";

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      currentPage: 1,
      totalCount: 0,
      totalPages: 0,
      pageSize: 10,
      leaderboard: [],
      loading: true,
      nullifier_hash: "",
    };

    this.fetchLeaderboard = this.fetchLeaderboard.bind(this); // Add this line
    this.sendPayment = this.sendPayment.bind(this); // Add this line
    this.submitScore = this.submitScore.bind(this); // Add this line
  }
  
  async componentWillMount() {
    MiniKit.install();
    this.fetchLeaderboard();
  }

  handlePageChange = (currentPage) => {
    this.setState({ currentPage });
  };

  // Fetch leaderboard data from Firebase
  fetchLeaderboard = async (last) => {
    try {
      let q;
      if (last) {
        q = query(
          collection(db, "leaderboard"),
          orderBy("points", "desc"),
          limit(100),
          startAfter(last)
        );
      } else {
        q = query(
          collection(db, "leaderboard"),
          orderBy("points", "desc"),
          limit(100)
        );
      }

      const snapshot = await getCountFromServer(collection(db, "leaderboard"));
      const totalCount = snapshot.data().count;
      this.setState({
        totalCount,
        totalPages: Math.ceil(totalCount / this.state.pageSize),
      });

      await getDocs(q).then((querySnapshot) => {
        const allLeaderboard = [
          ...this.state.leaderboard,
          ...querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })),
        ].sort((a, b) => b.points - a.points);

        const leaderboard = Array.from(
          new Map(allLeaderboard.map((item) => [item.id, item])).values()
        );

        this.setState({ leaderboard, loading: false });

        if (totalCount > leaderboard.length) {
          const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          this.fetchLeaderboard(lastVisible);
        }
      });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  async sendPayment() {
    console.log("MiniKit.isInstalled() 1: ", MiniKit.isInstalled());
    let that = this;
    // const res = await fetch('/api/initiate-payment', {
    // method: 'POST',
    // });
    // const { id } = await res.json();

    const uuid = crypto.randomUUID().replace(/-/g, "");

    const payload = {
      reference: uuid,
      to: "0x52ffb2ea73f0178f9e073b510e18648d253f6515", // Test address
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
      MiniKit.subscribe(
        ResponseEvent.MiniAppPayment,
        async (response) => {
          if (response.status == "success") {
              const { points } = that.props;
              const name = prompt(`Enter your name to submit your score(${points}):`);
  
              if (name) {
                await addDoc(collection(db, "leaderboard"), {
                  name,
                  nullifier_hash: that.state.nullifier_hash,
                  points,
                });
                store.dispatch(actions.pointsSubmitted(true));
                this.fetchLeaderboard();
                MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
              }
          }
        }
      );
    }
  }

  // Submit score to Firebase
  submitScore = async () => {
    try {
      console.log("MiniKit.isInstalled() 1: ", MiniKit.isInstalled());
      
      if (MiniKit.isInstalled()) {
        // const verifyPayload = {
        //   action: "verify-world-id", // This is your action ID from the Developer Portal
        //   signal: "v1", // Optional additional data
        //   verification_level: VerificationLevel.Orb, // Orb | Device
        // };

        // const verifyPayloadResponse = MiniKit.commands.verify(verifyPayload);
        await sendPayment();
      }
    } catch (error) {}
  };

  render() {
    const { leaderboard, loading, totalPages, currentPage, pageSize } =
      this.state;

    const pageStartIndex = (currentPage - 1) * pageSize;

    const { cur, pause, points, pointsSubmitted } = this.props;
    if (!cur && !pause)
      return (
        <div className={style.container}>
          <div className={style.wrapper}>
            <h4 className={style.pointsText}>Your Points: {points}</h4>
            {!pointsSubmitted && (
              <div className={style.buttonContainer}>
                <Button 
                  // onMouseDown={this.submitScore}
                  onTouchStart={
                    (e) => {
                      e.preventDefault();
                      this.submitScore();
                    }}
                >Submit Score (1 WLD)</Button>
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
                  leaderboard
                    ?.slice(pageStartIndex, pageStartIndex + pageSize)
                    ?.map((entry, index) => (
                      <tr key={index}>
                        <td>
                          <p>
                            {pageStartIndex + (index + 1)}. {entry?.name}
                          </p>
                        </td>
                        <td>
                          <p>{entry?.points}</p>
                        </td>
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
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
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
