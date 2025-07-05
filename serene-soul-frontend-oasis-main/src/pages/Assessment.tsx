
import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, FileText } from 'lucide-react';
import Layout from '../components/Layout';

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      text: "How often do you feel overwhelmed by daily responsibilities?",
      options: [
        "Never", "Rarely", "Sometimes", "Often", "Always"
      ]
    },
    {
      id: 2,
      text: "How would you rate your current sleep quality?",
      options: [
        "Excellent", "Good", "Fair", "Poor", "Very Poor"
      ]
    },
    {
      id: 3,
      text: "How often do you engage in activities that bring you joy?",
      options: [
        "Daily", "Weekly", "Monthly", "Rarely", "Never"
      ]
    },
    {
      id: 4,
      text: "How comfortable are you expressing your emotions to others?",
      options: [
        "Very comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"
      ]
    },
    {
      id: 5,
      text: "How often do you practice self-care or relaxation techniques?",
      options: [
        "Daily", "Weekly", "Monthly", "Rarely", "Never"
      ]
    }
  ];

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + (4 - score), 0);
    const maxScore = questions.length * 4;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getRecommendation = (score: number) => {
    if (score >= 80) return {
      level: "Excellent",
      color: "text-green-600",
      bgColor: "bg-green-100",
      message: "You're doing great! Keep up your current wellness practices."
    };
    if (score >= 60) return {
      level: "Good",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      message: "You're on the right track. Consider exploring our resources for additional support."
    };
    if (score >= 40) return {
      level: "Fair",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      message: "There's room for improvement. Our community and resources can help you grow."
    };
    return {
      level: "Needs Attention",
      color: "text-red-600",
      bgColor: "bg-red-100",
      message: "Consider reaching out for professional support. You're not alone in this journey."
    };
  };

  const generatePDFSolution = () => {
    try {
      // Prepare assessment data for Relevance AI
      const assessmentData = questions.map(question => ({
        question: question.text,
        answer: question.options[answers[question.id]] || "Not answered",
        score: answers[question.id] !== undefined ? (4 - answers[question.id]) : 0
      }));

      const score = calculateScore();
      const recommendation = getRecommendation(score);

      // Create the data to pass to Relevance AI
      const formData = {
        assessment_questions: JSON.stringify(assessmentData),
        total_score: score,
        recommendation_level: recommendation.level,
        user_answers: JSON.stringify(answers)
      };

      // Create URL with query parameters for Relevance AI
      const baseUrl = "https://app.relevanceai.com/form/d7b62b/07efa1d4-da9f-492a-a84a-9dc1e1f08be2?version=latest";
      const urlParams = new URLSearchParams();
      
      // Add each piece of data as URL parameters
      Object.entries(formData).forEach(([key, value]) => {
        urlParams.append(key, value.toString());
      });

      const fullUrl = `${baseUrl}&${urlParams.toString()}`;

      // Open Relevance AI in a new window
      const popup = window.open(fullUrl, '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        // If popup is blocked, show a message
        alert('Please allow popups for this site to generate your PDF solution.');
      }
    } catch (error) {
      console.error('Error generating PDF solution:', error);
      alert('There was an error generating your PDF solution. Please try again.');
    }
  };

  if (showResults) {
    const score = calculateScore();
    const recommendation = getRecommendation(score);

    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Wellness Assessment Results
              </h1>
              <p className="text-xl text-gray-600">
                Based on your responses, here's your personalized wellness overview
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-gray-900 mb-2">{score}%</div>
                <div className={`text-2xl font-semibold ${recommendation.color}`}>
                  {recommendation.level}
                </div>
              </div>

              <div className={`p-6 rounded-xl ${recommendation.bgColor} mb-8`}>
                <p className="text-lg text-gray-800">{recommendation.message}</p>
              </div>

              {/* PDF Solution Button */}
              <div className="text-center mb-8">
                <button
                  onClick={generatePDFSolution}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Click here to get the solution in PDF form
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Get a personalized wellness plan based on your assessment results
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Recommended Resources</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Mindfulness meditation guides</li>
                    <li>• Sleep improvement techniques</li>
                    <li>• Stress management strategies</li>
                  </ul>
                </div>

                <div className="p-6 bg-green-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Next Steps</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• Join our supportive community</li>
                    <li>• Track your progress daily</li>
                    <li>• Explore personalized content</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={() => window.location.href = '/resources'}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                >
                  Explore Resources
                </button>
                <button
                  onClick={() => window.location.href = '/community'}
                  className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                >
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mental Wellness Assessment
            </h1>
            <p className="text-xl text-gray-600">
              Question {currentStep + 1} of {questions.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-12">
            <div
              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                    answers[currentQuestion.id] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {answers[currentQuestion.id] === index ? (
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                  <span className="text-lg">{option}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              <button
                onClick={nextStep}
                disabled={answers[currentQuestion.id] === undefined}
                className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  answers[currentQuestion.id] === undefined
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700'
                }`}
              >
                {currentStep === questions.length - 1 ? 'View Results' : 'Next'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Assessment;
