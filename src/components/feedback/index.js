import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./feedback.module.css";

import Button from "../ui/button/Button";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const FeedBack = () => {
  const [currentQuestion, setCurrentQuestion] = useState();
  const [clientID, setClientID] = useState();

  const { clientid, questionid } = useParams();

  useEffect(() => {
    setCurrentQuestion(questionid);
    setClientID(clientid);
  }, []);

  return (
    <>
      {currentQuestion == 1 ? (
        <>
          <div className={styles.homePage}>
            <div className={styles.feedbackDataContainer}>
              <div className={styles.feedbackTitle}>
                <p>
                  FeedBack <br />
                  Form
                </p>
              </div>
              <div className={styles.btnContainer}>
                <Button>START</Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {currentQuestion == 2 ? (
        <>
          <div className={`${styles.questionPage} container`}>
            <p className={styles.questionTitle}>Pricing</p>
            <div className={styles.questionContainer}>
              <p className={styles.questionData}>
                <strong>Q:</strong> On a scale of 1 to 10, how would you rate
                the pricing of our products/services?
              </p>
            </div>
            <div className={styles.questionSlider}>
              <Slider
                defaultValue={0}
                step={10}
                min={0}
                max={100}
                aria-label="Default"
                valueLabelDisplay="auto"
                sx={{
                  width: "100%",
                  color: "#E85E44",
                  marginTop: 10,
                }}
              />
            </div>
            <Button
              icon="fa-sharp fa-light fa-arrow-right"
              style={{ marginTop: 75 }}
            >
              SUBMIT
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
      {currentQuestion == 3 ? (
        <>
          <div className={styles.feedBackSubmitted}>
            <p className={styles.feedBackData}>
              Your responses have been submitted, Thank You!
            </p>
          </div>
        </>
      ) : (
        <></>
      )}
      {currentQuestion == 4 ? (
        <>
          <div className={`${styles.questionPage} container`}>
            <p className={styles.questionTitle}>Additional Time</p>
            <div className={styles.questionContainer}>
              <p className={styles.questionData}>
                <strong>Q:</strong> On a scale of 1 to 10, how would you rate
                the pricing of our products/services?
              </p>
            </div>
            <div className={styles.questionSlider}>
              <textarea
                placeholder="Type your answer here"
                className={styles.textarea}
                rows="10"
              ></textarea>
            </div>
            <Button icon="fa-sharp fa-light fa-arrow-right">SUBMIT</Button>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default FeedBack;
