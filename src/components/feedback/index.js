import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./feedback.module.css";

import Button from "../ui/button/Button";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import axios from "axios";

const FeedBack = () => {
  const [currentQuestion, setCurrentQuestion] = useState();
  const [clientID, setClientID] = useState();
  let [questions, setQuestions] = useState([]);
  const [pageType, setPageType] = useState("START");
  let [questionIndex, setQuestionIndex] = useState(0);
  let [currentRating, setCurrentRating] = useState();
  let [comment, setComment] = useState();
  let [userDetails, setUserDetails] = useState({
    firstname: null,
    lastname: null,
    email: null,
    message: null,
  });

  let { clientid, questionid } = useParams();

  useEffect(() => {
    if (questionid && questionid == "welcome") {
      setPageType("START");
    }
    setCurrentQuestion(questionid);
    setClientID(clientid);
    // getFeedbackDetails();
    // getQuestions();
  }, []);

  const getFeedbackDetails = async () => {
    let feedbackResponse = await axios.get(
      `https://staging-tracking-backend.herokuapp.com/feedback/feedbacks/${clientID}`
    );
    if (feedbackResponse.data && feedbackResponse.data.success) {
      if (feedbackResponse.data?.data[0]?.is_completed) {
        setPageType("END");
      } else if (!feedbackResponse.data.data[0].first_name) {
        setPageType("NAME");
      } else {
        getQuestions();
      }
    }
  };

  const changeQuestions = (flowType = "START") => {
    if (flowType == "START") {
      getFeedbackDetails();
    } else if (flowType == "QUESTION") {
      updateAnswers(currentQuestion);
      setCurrentRating(0);
      setComment(null);
      if (questionIndex >= questions.data.length - 1) {
        setPageType("END");
        setQuestionIndex(0);
      } else {
        setQuestionIndex(questionIndex + 1);
        setCurrentQuestion(questions.data[questionIndex + 1]);
      }
    } else if (flowType == "USER_DETAILS") {
      updateUserDetails();
      getFeedbackDetails();
    }
  };

  const getQuestions = async () => {
    try {
      let questionsData = await axios.get(
        `https://staging-tracking-backend.herokuapp.com/feedback/answers/${clientID}`
      );
      setQuestions(questionsData.data);
      if (questionsData.data && questionsData.data.success) {
        if (questionsData.data.is_completed) {
          setPageType("END");
        } else {
          setPageType("QUESTION");
        }
        setCurrentQuestion(questionsData.data?.data[0]);
        setQuestionIndex(0);
      } else {
        setPageType("START");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateAnswers = async (questionData) => {
    try {
      let body = {
        feedback: clientID,
      };
      if (questionData?.question?.answer_type == "Rating") {
        body["rating"] = currentRating ? currentRating : 0;
      } else if (questionData?.question?.answer_type == "Comment") {
        body["comment"] = comment;
      }

      let response = await axios.put(
        `https://staging-tracking-backend.herokuapp.com/feedback/answers/update/${questionData.answer_id}/`,
        body
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserDetailsChange = (type, data) => {
    let userDetailsCopy = { ...userDetails };
    switch (type) {
      case "firstname":
        userDetailsCopy["firstname"] = data;
        break;
      case "lastname":
        userDetailsCopy["lastname"] = data;
        break;
      case "email":
        userDetailsCopy["email"] = data;
        break;
    }
    setUserDetails(userDetailsCopy);
  };

  const updateUserDetails = async () => {
    try {
      let userDetailsCopy = { ...userDetails };
      if (!userDetails.firstname) {
        userDetailsCopy["message"] = "First Name is mandatory";
        setUserDetails(userDetailsCopy);
        return;
      } else if (!userDetails.email) {
        userDetailsCopy["message"] = "Email is mandatory";
        setUserDetails(userDetailsCopy);
        return;
      } else if (
        userDetails.email &&
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userDetails.email)
      ) {
        userDetailsCopy["message"] = "Enter valid email";
        setUserDetails(userDetailsCopy);
      }
      let body = {
        first_name: userDetails.firstname,
        last_name: userDetails.lastname,
        email: userDetails.email,
      };
      let response = await axios.put(
        `https://staging-tracking-backend.herokuapp.com/feedback/feedbacks/update/${clientID}/`,
        body
      );
      setPageType("QUESTIONS");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {pageType == "START" ? (
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
                <Button onClick={() => changeQuestions("START")}>START</Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {pageType == "NAME" ? (
        <>
          <div className={`${styles.questionPage} container`}>
            <p className={styles.questionTitle}>Add your details</p>
            <div className={styles.questionContainer}>
              <label>
                First Name<span style={{ color: "red" }}>*</span>{" "}
              </label>{" "}
              <br />
              <input
                type="text"
                placeholder="John"
                value={userDetails.firstname}
                onChange={(e) =>
                  handleUserDetailsChange("firstname", e.target.value)
                }
                required
              />
              <br />
              <label>Last Name</label> <br />
              <input
                type="text"
                placeholder="Doe"
                value={userDetails.lastname}
                onChange={(e) =>
                  handleUserDetailsChange("lastnme", e.target.value)
                }
              />
              <br />
              <label>
                Email ID<span style={{ color: "red" }}>*</span>
              </label>{" "}
              <br />
              <input
                type="email"
                placeholder="john.doe@elchemy.com"
                value={userDetails.email}
                onChange={(e) =>
                  handleUserDetailsChange("email", e.target.value)
                }
                required
              />
              <br />
            </div>
            <p style={{ marginTop: 10, color: "red" }}>{userDetails.message}</p>
            <Button
              icon="fa-sharp fa-light fa-arrow-right"
              style={{ marginTop: 75 }}
              onClick={() => changeQuestions("USER_DETAILS")}
            >
              SUBMIT
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
      {pageType == "QUESTION" ? (
        <>
          <div className={`${styles.questionPage} container`}>
            <p className={styles.questionTitle}>
              {currentQuestion.question.question_title}
            </p>
            <div className={styles.questionContainer}>
              <p className={styles.questionData}>
                <strong>Q:</strong> {currentQuestion.question.question}
              </p>
            </div>
            {currentQuestion.question.answer_type == "Rating" ? (
              <div className={styles.questionSlider}>
                <Slider
                  defaultValue={0}
                  step={1}
                  min={0}
                  max={10}
                  aria-label="Default"
                  valueLabelDisplay="auto"
                  sx={{
                    width: "100%",
                    color: "#E85E44",
                    marginTop: 10,
                  }}
                  value={currentRating}
                  onChange={(e) => setCurrentRating(e.target.value)}
                />
              </div>
            ) : (
              <></>
            )}

            {currentQuestion.question.answer_type == "Comment" ? (
              <div className={styles.questionSlider}>
                <textarea
                  placeholder="Type your answer here"
                  className={styles.textarea}
                  rows="10"
                  onChange={(e) => setComment(e.target.value)}
                >
                  {comment}
                </textarea>
              </div>
            ) : (
              <></>
            )}

            <Button
              icon="fa-sharp fa-light fa-arrow-right"
              style={{ marginTop: 75 }}
              onClick={() => changeQuestions("QUESTION")}
            >
              SUBMIT
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
      {pageType == "END" ? (
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
    </>
  );
};

export default FeedBack;
