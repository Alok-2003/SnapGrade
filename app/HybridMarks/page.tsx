"use client";
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { createWorker } from 'tesseract.js';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [text, setText] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [worksheets, setWorksheets] = useState<Array<{ maxMarks: number; realMarks: number }>>(
        new Array(10).fill({ maxMarks: 30, realMarks: 0 })
    );
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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            const preview = URL.createObjectURL(uploadedFile);
            setPreviewURL(preview);

            setIsProcessing(true);
            setText('');

            try {
                const worker = await createWorker('eng');
                const { data: { text } } = await worker.recognize(uploadedFile);
                console.log("Extracted Text:", text);
                setText(text); // Update the extracted text state

                // Parse the extracted text and populate input fields
                fillFieldsFromExtractedText(text);

                await worker.terminate();
            } catch (error) {
                console.error('Error recognizing text:', error);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const fillFieldsFromExtractedText = (text: string) => {
        // Regex to capture practical worksheet scores with max marks and real marks
        const worksheetPattern = /Practical\sWorksheet\/Projects\s*(\d+)\s*(\d+)\s*(\d+)/g;
        let match;
        const newWorksheets = [...worksheets];

        // Extract and update the worksheet scores
        while ((match = worksheetPattern.exec(text)) !== null) {
            const index = parseFloat(match[1]) - 1; // Worksheet number (1–10)
            const maxMarks = parseFloat(match[2]); // Max marks (30)
            const realMarks = parseFloat(match[3]); // Obtained marks
            if (index >= 0 && index < 10) {
                newWorksheets[index] = { maxMarks, realMarks };
            }
        }

        const attendanceMatch = text.match(/Attendance\sMarks\s*(\d+)\s*(\d+)/);
        if (attendanceMatch) {
            setAttendance(parseFloat(attendanceMatch[2])); // Obtained marks
        }

        const surpriseTestMatch = text.match(/Surprise\sTest\s*(\d+)\s*(\d+)/);
        if (surpriseTestMatch) {
            setSurpriseTest(parseFloat(surpriseTestMatch[2]));
        }

        const practicalMSTMatch = text.match(/Practical\sMST\s*(\d+)\s*(\d+)/);
        if (practicalMSTMatch) {
            setLabMST(parseFloat(practicalMSTMatch[2]));
        }

        const quizMatch = text.match(/Quiz\s*(\d+)\s*(\d+(\.\d+)?)/); // Support for decimal marks
        if (quizMatch) {
            setQuiz(parseFloat(quizMatch[2])); // Converts the string to a number
        }
        

        const assignmentMatch = text.match(/Assignment\/PBL\s*(\d+)\s*(\d+)/);
        if (assignmentMatch) {
            setAssignment(parseFloat(assignmentMatch[2]));
        }

        const theoryMST1Match = text.match(/MST-1\sHybrid\s*(\d+)\s*(\d+)/);
        if (theoryMST1Match) {
            setTheoryMST1(parseFloat(theoryMST1Match[2]));
        }

        const theoryMST2Match = text.match(/MST-2\sHybrid\s*(\d+)\s*(\d+)/);
        if (theoryMST2Match) {
            setTheoryMST2(parseFloat(theoryMST2Match[2]));
        }
        // Set the updated worksheets state
        setWorksheets(newWorksheets);
    };

    const handleSubmit = () => {
        setError(null);

        // Validate and process worksheets
        const worksheetScore = Math.min(worksheets.reduce((sum, worksheet) => sum + worksheet.realMarks, 0) / worksheets.length, 20);

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
        <div className="min-h-screen bg-gray-50 p-6">
        {/* <Navbar /> */}
        <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h1 className="text-3xl font-bold text-center text-indigo-700">Hybrid Subject Marks Calculator</h1>
          <h1 className="text-xl font-medium text-center text-gray-500">Subjects Like - DAA, CN</h1>
          {isProcessing && <p className="text-center text-yellow-500">Processing image...</p>}
      
          <div className="flex justify-center mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isProcessing}
              className="file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
      
          {previewURL && (
            <div className="mt-4 flex justify-center">
              <img
                src={previewURL}
                alt="Uploaded preview"
                className="max-w-full h-auto border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          )}
        </div>
      
        <h3 className="text-lg text-center mt-4 font-semibold text-gray-600">Verify Marks Extracted from the Image (Some Marks May Not Be Accurate)</h3>
        <div className="grid grid-cols-2 w-full p-4 bg-gray-100 gap-4 mt-4 rounded-lg shadow-sm">
          {worksheets.map((worksheet, index) => (
            <div key={index} className="block">
              <label className="block text-gray-700 font-medium">Worksheet {index + 1}:</label>
              <input
                type="number"
                value={worksheet.realMarks}
                onChange={(e) => {
                  const updatedWorksheets = [...worksheets];
                  updatedWorksheets[index].realMarks = parseFloat(e.target.value);
                  setWorksheets(updatedWorksheets);
                }}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                max={worksheet.maxMarks}
              />
            </div>
          ))}
        </div>
      
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-100 gap-4 px-4 py-2 rounded-lg shadow-sm mt-4">
          <div>
            <label className="block text-gray-700 font-medium">Final Practical (Assume 25 as Worst):</label>
            <input
              type="number"
              value={finalPractical}
              onChange={(e) => setFinalPractical(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              max={40}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Attendance (Max: 2):</label>
            <input
              type="number"
              value={attendance}
              onChange={(e) => setAttendance(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              max={2}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Quiz (Max: 4):</label>
            <input
              type="number"
              value={quiz}
              onChange={(e) => setQuiz(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              max={4}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Surprise Test (Max: 12):</label>
            <input
              type="number"
              value={surpriseTest}
              onChange={(e) => setSurpriseTest(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              max={12}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Lab MST (Max: 10):</label>
            <input
              type="number"
              value={labMST}
              onChange={(e) => setLabMST(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              max={10}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Assignment (Max: 10):</label>
            <input
              type="number"
              value={assignment}
              onChange={(e) => setAssignment(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              max={10}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Theory MST 1 (Max: 20):</label>
            <input
              type="number"
              value={theoryMST1}
              onChange={(e) => setTheoryMST1(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              max={20}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Theory MST 2 (Max: 20):</label>
            <input
              type="number"
              value={theoryMST2}
              onChange={(e) => setTheoryMST2(parseFloat(e.target.value))}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              max={20}
            />
          </div>
        </div>
      
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit and Calculate
          </button>
        </div>
      
        {totalScore !== null && !error && (
          <div className="mt-4 p-4 bg-indigo-50 text-center text-indigo-700 font-medium rounded-lg shadow-md">
            Total Score: {totalScore.toFixed(2)}
          </div>
        )}
      
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-center text-red-600 rounded-lg shadow-md">
            {error}
          </div>
        )}
      </div>
      
    );
}
