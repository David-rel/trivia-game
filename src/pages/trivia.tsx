import QuestionCard from "../components/QuestionCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

interface TriviaProps {
  category: string;
  amount: number;
}

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}


export default function Trivia({ category, amount }: TriviaProps) {
const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=${amount}&category=${category}`
      );
      setQuestions(response.data.results);
    };
    fetchQuestions();
  }, [category, amount]);

  const handleAnswerClick = (answer: string) => {
    const updatedAnswers = [...userAnswers, answer];
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex >= questions.length - 1) {
      router.push({
        pathname: "/results",
        query: {
          userAnswers: JSON.stringify(updatedAnswers),
          correctAnswers: JSON.stringify(
            questions.map((q) => q.correct_answer)
          ),
        },
      });
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };
  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  // ... other imports and code ...
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {questions.length > 0 && currentQuestionIndex < questions.length ? (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            onAnswerClick={handleAnswerClick}
            onNext={handleNext}
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Review Your Answers:
            </h2>
            <ul className="list-decimal pl-5">
              {questions.map((q, index) => (
                <li key={index} className="mb-4">
                  <p className="font-medium">Question: {q.question}</p>
                  <p className="text-green-500">
                    Correct Answer: {q.correct_answer}
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/" legacyBehavior>
              <a className="mt-4 block w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
                Go back to home
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );

  // ... rest of the code ...
}

Trivia.getInitialProps = async (ctx: {
  query: { category: any; amount: any };
}) => {
  const { category, amount } = ctx.query;
  return { category, amount };
};
