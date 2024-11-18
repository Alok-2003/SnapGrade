"use client"
import { useState } from 'react';

const Index = () => {
  const [worksheets, setWorksheets] = useState<number[]>(new Array(10).fill(0));
  const [finalPractical, setFinalPractical] = useState<number>(0);
  const [attendance, setAttendance] = useState<number>(0);
  const [quiz, setQuiz] = useState<number>(0);
  const [surpriseTest, setSurpriseTest] = useState<number>(0);
  const [labMST, setLabMST] = useState<number>(0);
  const [assignment, setAssignment] = useState<number>(0);
  const [theoryMST1, setTheoryMST1] = useState<number>(0);
  const [theoryMST2, setTheoryMST2] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    // Validate and process worksheets
    const worksheetScore = Math.min(worksheets.reduce((sum, score) => sum + score, 0) / 10, 20);

    // Validate and process final practical
    if (finalPractical > 40) {
      setError('Final practical marks cannot exceed 40');
      return;
    }
    const finalPracticalScore = Math.min(finalPractical, 40) * 20 / 40;

    // Validate and process attendance
    if (attendance > 2) {
      setError('Attendance marks cannot exceed 2');
      return;
    }

    // Validate and process quiz
    if (quiz > 4) {
      setError('Quiz marks cannot exceed 4');
      return;
    }

    // Validate and process surprise test
    if (surpriseTest > 12) {
      setError('Surprise test marks cannot exceed 12');
      return;
    }
    const surpriseTestScore = Math.min(surpriseTest, 12) * 4 / 12;

    // Validate and process lab MST
    if (labMST > 10) {
      setError('Lab MST marks cannot exceed 10');
      return;
    }
    const labMSTScore = Math.min(labMST, 10) * 4 / 10;

    // Validate and process assignment
    if (assignment > 10) {
      setError('Assignment marks cannot exceed 10');
      return;
    }
    const assignmentScore = Math.min(assignment, 10) * 6 / 10;

    // Validate and process theory MSTs
    if (theoryMST1 > 20) {
      setError('Theory MST 1 marks cannot exceed 20');
      return;
    }
    const theoryMST1Score = Math.min(theoryMST1, 20) * 5 / 20;

    if (theoryMST2 > 20) {
      setError('Theory MST 2 marks cannot exceed 20');
      return;
    }
    const theoryMST2Score = Math.min(theoryMST2, 20) * 5 / 20;

    // Calculate total score
    const total = attendance + worksheetScore + finalPracticalScore + quiz + surpriseTestScore + labMSTScore + assignmentScore + theoryMST1Score + theoryMST2Score;
    setTotalScore(total);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Marks Calculator</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-medium mb-2">Enter marks for 10 worksheets (each out of 30):</h2>
          {worksheets.map((score, index) => (
            <div key={index} className="flex items-center mb-2">
              <label className="w-1/4">Worksheet {index + 1}: </label>
              <input
                type="number"
                value={score}
                min="0"
                max="30"
                onChange={(e) => {
                  const newWorksheets = [...worksheets];
                  newWorksheets[index] = Number(e.target.value);
                  setWorksheets(newWorksheets);
                }}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium mb-1">Final Practical (out of 40):</label>
          <input
            type="number"
            value={finalPractical}
            min="0"
            max="40"
            onChange={(e) => setFinalPractical(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Attendance (max 2):</label>
          <input
            type="number"
            value={attendance}
            min="0"
            max="2"
            onChange={(e) => setAttendance(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Quiz (max 4):</label>
          <input
            type="number"
            value={quiz}
            min="0"
            max="4"
            onChange={(e) => setQuiz(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Surprise Test (out of 12):</label>
          <input
            type="number"
            value={surpriseTest}
            min="0"
            max="12"
            onChange={(e) => setSurpriseTest(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Lab MST (out of 10):</label>
          <input
            type="number"
            value={labMST}
            min="0"
            max="10"
            onChange={(e) => setLabMST(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Assignment (out of 10):</label>
          <input
            type="number"
            value={assignment}
            min="0"
            max="10"
            onChange={(e) => setAssignment(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Theory MST 1 (out of 20):</label>
          <input
            type="number"
            value={theoryMST1}
            min="0"
            max="20"
            onChange={(e) => setTheoryMST1(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Theory MST 2 (out of 20):</label>
          <input
            type="number"
            value={theoryMST2}
            min="0"
            max="20"
            onChange={(e) => setTheoryMST2(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full p-3 mt-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Calculate Total
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {totalScore !== null && (
        <h2 className="text-2xl font-semibold text-center mt-4">
          Total Score (out of 70): {totalScore}
        </h2>
      )}
    </div>
  );
};

export default Index;
