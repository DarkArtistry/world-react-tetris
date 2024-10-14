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
import Swal from 'sweetalert2';

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
    if (!MiniKit.isInstalled()) {
      MiniKit.install();
    }
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
      description: "Pay 1 WLD to submit your score",
    };

    if (MiniKit.isInstalled()) {
      console.log("sending commands to pay");
      MiniKit.commands.pay(payload);
      console.log("Pay Command Sent!, Subscribing to MiniAppPayment");
      MiniKit.subscribe(
        ResponseEvent.MiniAppPayment,
        async (response) => {
          console.log("MiniAppPayment Response: ", response);
          Swal.fire({
            title: "Payment Completed!",
            text: JSON.stringify(response),
            icon: "success"
          });
          console.log("sweet alert fired for success payment");
          if (response.status == "success") {
              const { points } = that.props;
              const name = prompt(`Enter your name to submit your score(${points}):`);
              console.log("prompt name: ", name);
              if (name) {
                console.log('adding doc');
                await addDoc(collection(db, "leaderboard"), {
                  name,
                  nullifier_hash: that.state.nullifier_hash,
                  points,
                });
                console.log('doc added, dispatching pointsSubmitted');
                store.dispatch(actions.pointsSubmitted(true));
                console.log('pointsSubmitted dispatched, fetching leaderboard');
                await this.fetchLeaderboard();
                console.log('leaderboard fetched, unsubscribing from MiniAppPayment');
                MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
                console.log('unsubscribed from MiniAppPayment');
                Swal.fire({
                  title: "Score Submitted!",
                  text: "Let's Go Again!",
                  icon: "success"
                });
                console.log('sweet alert fired for success score submission');
              }
          }
        }
      );
    }
  }

  // Submit score to Firebase
  async submitScore() {
    console.log("Submitting score...");
    try {
      if (!MiniKit.isInstalled()) {
        await MiniKit.install();
      }
      console.log("MiniKit installed:", MiniKit.isInstalled());
  
      const uuid = crypto.randomUUID().replace(/-/g, "");
      const { points } = this.props;
  
      const payload = {
        reference: uuid,
        to: "0x52ffb2ea73f0178f9e073b510e18648d253f6515", // Test address
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
          },
        ],
        description: `Pay 1 WLD to submit your score (${points} points)`,
      };
  
      console.log("Sending payment command...");
      await MiniKit.commands.pay(payload);
      console.log("Payment command sent. Waiting for response...");
  
      return new Promise((resolve, reject) => {  
        MiniKit.subscribe(ResponseEvent.MiniAppPayment, async (response) => {
          MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
  
          console.log("MiniAppPayment Response:", response);
          if (response.status === "success") {
            try {
              const name = await this.promptForName(points);
              if (name) {
                await this.saveScore(name, points);
                await this.updateLeaderboard();
                resolve("Score submitted successfully");
              } else {
                resolve("Score submission cancelled");
              }
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error("Payment failed"));
          }
        });
      });
    } catch (error) {
      console.error("Error in submitScore:", error);
      throw error;
    }
  }

  async promptForName(points) {
    console.log("Prompting for name...");
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.left = '0';
      modal.style.top = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '9999';
  
      const content = document.createElement('div');
      content.style.backgroundColor = 'white';
      content.style.padding = '20px';
      content.style.borderRadius = '10px';
      content.style.textAlign = 'center';
      content.style.width = '90%';
      content.style.height = '90%';
  
      const title = document.createElement('h2');
      title.textContent = 'Enter your name';
      content.appendChild(title);
  
      const inputLabel = document.createElement('p');
      inputLabel.textContent = `Submit your score (${points} points)`;
      inputLabel.fontSize = "10vh";
      content.appendChild(inputLabel);
  
      const input = document.createElement('input');
      input.type = 'text';  // Changed back to 'text'
      input.inputMode = 'text';
      input.style.width = '100%';
      input.style.marginBottom = '10px';
      input.style.padding = '5px';
      input.autocomplete = 'off';
      input.autocorrect = 'off';
      input.autocapitalize = 'off';
      input.style.webkitUserSelect = 'text';
      input.style.userSelect = 'text';
      input.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
      input.style.webkitAppearance = 'none';
      input.style.outline = 'none';
      input.style.border = '1px solid #ccc';
      input.style.fontSize = '10vh';  // Minimum font size to prevent auto-zoom on iOS
      input.maxLength = 13;  // Set maximum length to 13 characters
      content.appendChild(input);
  
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Submit';
      submitButton.fontSize = "8vw";
      submitButton.style.padding = '3vw 6vw';
      submitButton.style.marginRight = '10px';
      submitButton.style.width = '40%';
      submitButton.style.outline = 'None';
      submitButton.style.backgroundColor = '#4CAF50';
      content.appendChild(submitButton);
  
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.fontSize = "8vw";
      cancelButton.style.padding = '3vw 6vw';
      cancelButton.style.width = '40%';
      cancelButton.style.outline = 'None';
      cancelButton.style.backgroundColor = '#c6c6c6';
      content.appendChild(cancelButton);
  
      modal.appendChild(content);
      document.body.appendChild(modal);
  
      const handleSubmit = () => {
        console.log("Handling submit...");
        const name = input.value.trim();
        if (name) {
          document.body.removeChild(modal);
          console.log("Resolving name entered:", name);
          resolve(name);
        } else {
          alert('You need to enter a name!');
        }
      };
  
      const handleCancel = () => {
        document.body.removeChild(modal);
        resolve(null);
      };
  
      submitButton.addEventListener('touchstart', handleSubmit);
      cancelButton.addEventListener('touchstart', handleCancel);
  
      // Enhanced focus and keyboard trigger
      setTimeout(() => {
        input.focus();
        input.click();
        input.dispatchEvent(new TouchEvent('touchstart', {bubbles: true}));
        input.dispatchEvent(new TouchEvent('touchend', {bubbles: true}));
      }, 300);  // Increased timeout
  
      // Fallback method to show keyboard
      input.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.focus();
        this.click();
      });
    });
  }

  async saveScore(name, points) {
    console.log("Saving score to database...");
    await addDoc(collection(db, "leaderboard"), {
      name,
      nullifier_hash: this.state.nullifier_hash,
      points,
    });
    console.log('Score saved to database');
  }
  
  async updateLeaderboard() {
    console.log('Updating leaderboard...');
    store.dispatch(actions.pointsSubmitted(true));
    await this.fetchLeaderboard();
  
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.left = '0';
      modal.style.top = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '9999';
  
      const content = document.createElement('div');
      content.style.backgroundColor = 'white';
      content.style.padding = '5vw';
      content.style.borderRadius = '3vw';
      content.style.textAlign = 'center';
      content.style.width = '90%';
      content.style.maxHeight = '90%';
      content.style.overflow = 'auto';
      content.style.boxShadow = '0 1vw 2vw rgba(0, 0, 0, 0.1)';
  
      const title = document.createElement('h2');
      title.textContent = 'Score Submitted!';
      title.style.margin = '0 0 3vw 0';
      title.style.fontSize = '10vw';  // 10% of viewport width
      title.style.lineHeight = '1.2';
      content.appendChild(title);
  
      const message = document.createElement('p');
      message.textContent = "Let's Go Again!";
      message.style.margin = '0 0 5vw 0';
      message.style.fontSize = '8vw';  // 8% of viewport width
      message.style.lineHeight = '1.2';
      content.appendChild(message);
  
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.padding = '3vw 6vw';
      closeButton.style.fontSize = '8vw';  // 8% of viewport width
      closeButton.style.backgroundColor = '#4CAF50';
      closeButton.style.color = 'white';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '2vw';
      closeButton.style.cursor = 'pointer';
      closeButton.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
      closeButton.style.webkitAppearance = 'none';
      closeButton.style.outline = 'none';
      closeButton.style.width = '80%';  // Make button width 80% of the container
      content.appendChild(closeButton);
  
      modal.appendChild(content);
      document.body.appendChild(modal);
  
      const handleClose = () => {
        document.body.removeChild(modal);
        resolve();
      };
  
      closeButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        closeButton.style.backgroundColor = '#45a049';
      });
  
      closeButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeButton.style.backgroundColor = '#4CAF50';
        handleClose();
      });
  
      modal.addEventListener('touchstart', (e) => {
        if (e.target === modal) {
          e.preventDefault();
          handleClose();
        }
      });
  
      // Ensure the modal is properly displayed
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 50);
    });
  }

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
