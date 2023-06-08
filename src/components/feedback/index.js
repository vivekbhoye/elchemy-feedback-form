import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./feedback.module.css";

import Button from "../ui/button/Button";

import Slider from "@mui/material/Slider";
import axios from "axios";

const FeedBack = () => {
  const [currentQuestion, setCurrentQuestion] = useState();
  const [clientID, setClientID] = useState();
  let [questions, setQuestions] = useState([]);
  const [pageType, setPageType] = useState("START");
  let [questionIndex, setQuestionIndex] = useState(0);
  let [currentRating, setCurrentRating] = useState(0);
  let [comment, setComment] = useState();
  let [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  });

  let { clientid, questionid } = useParams();

  useEffect(() => {
    if (questionid && questionid === "welcome") {
      setPageType("START");
    }
    // setCurrentQuestion(questionid);
    setClientID(clientid);
  }, []);

  const getFeedbackDetails = async () => {
    let feedbackResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_DOMAIN}/feedback/feedbacks/${clientID}`
    );
    if (feedbackResponse.data && feedbackResponse.data.success) {
      if (feedbackResponse.data?.data[0]?.is_completed) {
        setPageType("END");
      } else if (!feedbackResponse?.data.data[0]?.first_name) {
        setPageType("NAME");
        getQuestions("NAME");
      } else {
        getQuestions();
      }
    }
  };

  const changeQuestions = async (flowType = "START") => {
    if (flowType === "START") {
      getFeedbackDetails();
    } else if (flowType === "QUESTION") {
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
    } else if (flowType === "USER_DETAILS") {
      updateUserDetails();
    }
  };

  const getQuestions = async (setType = null) => {
    try {
      let questionsData = await axios.get(
        `${process.env.REACT_APP_BACKEND_DOMAIN}/feedback/answers/${clientID}`
      );
      setQuestions(questionsData.data);
      if (questionsData.data && questionsData.data.success) {
        if (questionsData.data.is_completed) {
          setPageType("END");
        } else if (setType != "NAME") {
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
      if (questionData?.question?.answer_type === "Rating") {
        body["rating"] = currentRating ? currentRating : 0;
      } else if (questionData?.question?.answer_type === "Comment") {
        body["comment"] = comment;
      }

      await axios.put(
        `${process.env.REACT_APP_BACKEND_DOMAIN}/feedback/answers/update/${questionData.answer_id}/`,
        body
      );
      setCurrentRating(0);
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
        return;
      }
      let body = {
        first_name: userDetails.firstname,
        last_name: userDetails.lastname,
        email: userDetails.email,
      };
      await axios.put(
        `${process.env.REACT_APP_BACKEND_DOMAIN}/feedback/feedbacks/update/${clientID}/`,
        body
      );
      setPageType("QUESTION");
    } catch (err) {
      console.log(err);
    }
  };

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
    {
      value: 6,
      label: "6",
    },
    {
      value: 7,
      label: "7",
    },
    {
      value: 8,
      label: "8",
    },
    {
      value: 9,
      label: "9",
    },
    {
      value: 10,
      label: "10",
    },
  ];

  return (
    <>
      {pageType === "START" ? (
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
      {pageType === "NAME" ? (
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
                  handleUserDetailsChange("lastname", e.target.value)
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
      {pageType === "QUESTION" ? (
        <>
          <div className={`${styles.questionPage} container`}>
            <p className={styles.questionTitle}>
              {currentQuestion?.question?.question_title}
            </p>
            <div className={styles.questionContainer}>
              <p className={styles.questionData}>
                <strong>Q:</strong> {currentQuestion?.question?.question}
              </p>
            </div>
            {currentQuestion.question.answer_type === "Rating" ? (
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
                  marks={marks}
                  onChange={(e) => setCurrentRating(e.target.value)}
                />
              </div>
            ) : (
              <></>
            )}

            {currentQuestion.question.answer_type === "Comment" ? (
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
      {pageType === "END" ? (
        <>
          <div className={styles.feedBackSubmitted}>
            <p className={styles.feedBackData}>
              Your responses have been submitted, <br /> Thank You!
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
