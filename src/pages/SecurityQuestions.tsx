import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

const securityQuestionOptions = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your favorite book?",
  "What was your childhood nickname?",
  "What is the name of your favorite teacher?",
  "What was your first car?",
  "What is your favorite movie?",
];

const SecurityQuestions = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].answer = value;
    setQuestions(updated);
  };

  const getAvailableQuestions = (currentIndex: number) => {
    const selectedQuestions = questions
      .filter((_, idx) => idx !== currentIndex)
      .map((q) => q.question);
    return securityQuestionOptions.filter((q) => !selectedQuestions.includes(q));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (questions.some((q) => !q.question || !q.answer)) {
      toast.error("Please complete all security questions");
      return;
    }

    setIsLoading(true);

    // TODO: Connect to AWS backend
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Security questions saved! Your account is now secure.");
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">MobileDev</span>
          </div>

          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Security Questions</h1>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Set up security questions to help recover your account if you forget your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, index) => (
            <div 
              key={index} 
              className="p-5 rounded-xl border border-border bg-card/30 space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Lock className="w-4 h-4" />
                Question {index + 1}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`question-${index}`}>Select a question</Label>
                <Select
                  value={q.question}
                  onValueChange={(value) => handleQuestionChange(index, value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a security question" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableQuestions(index).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`answer-${index}`}>Your answer</Label>
                <Input
                  id={`answer-${index}`}
                  type="text"
                  placeholder="Enter your answer"
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          ))}

          <Button
            type="submit"
            variant="gradient"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Setup"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          These questions will help verify your identity if you need to reset your password.
        </p>
      </div>
    </div>
  );
};

export default SecurityQuestions;
