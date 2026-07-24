import React, { useState } from "react";
import axios from "axios";
import { MdPoll, MdHowToVote, MdBarChart, MdCheckCircle } from "react-icons/md";
import { FaUsers, FaClock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const PollCard = ({ poll: initialPoll }) => {
  const { user } = useAuth();
  const [poll, setPoll] = useState(initialPoll);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  const options = poll.options || [];
  const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  const handleVote = (index) => {
    if (!hasVoted) {
      setSelectedOption(index);
    }
  };

  const submitVote = async () => {
    if (selectedOption === null || hasVoted || voting) return;

    setVoting(true);
    try {
      await axios.post(`/api/polls/${poll._id}/vote`, {
        optionIndex: selectedOption,
      });
      // Update local poll state with new vote data
      const newOptions = options.map((opt, i) => ({
        ...opt,
        votes: opt.votes + (i === selectedOption ? 1 : 0),
      }));
      setPoll({ ...poll, options: newOptions });
      setHasVoted(true);
    } catch (err) {
      console.error("Vote failed:", err);
      alert(err.response?.data?.message || "Failed to submit vote");
    } finally {
      setVoting(false);
    }
  };

  const getPercentage = (voteCount) => {
    if (totalVotes === 0) return 0;
    return ((voteCount / totalVotes) * 100).toFixed(1);
  };

  const getBarColor = (index) => {
    const colors = [
      "from-primary-500 to-primary-600",
      "from-accent-500 to-accent-600",
      "from-emerald-500 to-emerald-600",
      "from-amber-500 to-amber-600",
      "from-purple-500 to-purple-600",
      "from-cyan-500 to-cyan-600",
    ];
    return colors[index % colors.length];
  };

  const timeLeft = poll.expiresIn || "3 days left";

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MdPoll className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">Poll</span>
          </div>
          <div className="flex items-center space-x-1 text-primary-200 text-xs">
            <FaUsers className="w-3.5 h-3.5" />
            <span>{totalVotes} votes</span>
          </div>
        </div>
        <p className="text-white text-lg md:text-xl font-bold mt-2 font-[Playfair_Display]">
          {poll.question}
        </p>
      </div>

      {/* Options */}
      <div className="p-4 md:p-5 space-y-3">
        {options.map((option, index) => {
          const voteCount = option.votes || 0;
          const percentage = getPercentage(voteCount);
          const isSelected = selectedOption === index;

          return (
            <div key={index}>
              <button
                onClick={() => handleVote(index)}
                disabled={hasVoted}
                className={`w-full text-left transition-all duration-200 ${
                  hasVoted
                    ? "cursor-default"
                    : "cursor-pointer hover:scale-[1.02]"
                }`}
              >
                <div
                  className={`relative p-3 md:p-4 rounded-xl border-2 transition-all duration-200 ${
                    hasVoted && isSelected
                      ? "border-primary-500 bg-primary-50"
                      : isSelected
                        ? "border-primary-400 bg-primary-50/50"
                        : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-2 flex-1">
                      {hasVoted && isSelected && (
                        <MdCheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          hasVoted && isSelected
                            ? "text-primary-700"
                            : "text-gray-700"
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-600">
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 relative z-10">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full bg-gradient-to-r ${getBarColor(index)} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      {voteCount} vote{voteCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="px-4 md:px-5 pb-4 md:pb-5">
        {!hasVoted ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={submitVote}
              disabled={selectedOption === null || voting}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selectedOption !== null && !voting
                  ? "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <MdHowToVote className="w-4 h-4" />
              <span>{voting ? "Voting..." : "Submit Vote"}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-2.5">
            <span className="text-sm font-medium text-green-700 flex items-center space-x-1">
              <MdCheckCircle className="w-4 h-4" />
              <span>Vote Recorded</span>
            </span>
            <span className="text-xs text-gray-500 flex items-center space-x-1">
              <FaClock className="w-3 h-3" />
              <span>{timeLeft}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollCard;
