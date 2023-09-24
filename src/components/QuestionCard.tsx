import { useState, useEffect } from "react";

interface QuestionProps {
  question: {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  };
  onAnswerClick: (answer: string) => void; // Add this line
  onNext: () => void;
}


const QuestionCard: React.FC<QuestionProps> = ({ question, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    const allAnswers = [
      ...question.incorrect_answers,
      question.correct_answer,
    ].sort(() => Math.random() - 0.5);
    setShuffledAnswers(allAnswers);
  }, [question]);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === question.correct_answer);
  };

  const handleNextClick = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    onNext();
  };

  if (!question) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p
        className="text-xl font-bold mb-6"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />
      <ul>
        {shuffledAnswers.map((answer, idx) => (
          <li key={idx} className="mb-4">
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                selectedAnswer === answer
                  ? isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => handleAnswerSelection(answer)}
              dangerouslySetInnerHTML={{ __html: answer }} // Use this to render the answer
            />
          </li>
        ))}
      </ul>
      {selectedAnswer && (
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          onClick={handleNextClick}
        >
          Next Question
        </button>
      )}
    </div>
  );
};

export default QuestionCard;
