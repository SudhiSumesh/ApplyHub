import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Send, RotateCcw, Briefcase, CheckCircle2, AlertCircle, LogOut } from "lucide-react";

const MAX_CHARS = 4000;

const Index = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("applyhub_auth");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const remainingChars = MAX_CHARS - jobDescription.length;
  const isOverLimit = remainingChars < 0;
  const isValid = jobDescription.trim().length > 0 && !isOverLimit;

  const handleApply = async () => {
    if (!isValid) {
      toast.error("Please enter a job description");
      return;
    }

    setIsLoading(true);
    setError("");
    setResponse(null);

    try {
    
      const res = await fetch( import.meta.env.NEXT_PUBLIC_API_BASE_URL, //local url
      
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
          sourceUrl: sourceUrl.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
 
      const json = await res.json();
      console.log(json);
      if(json?.success === true) { 
     
        setResponse(json)
        toast.success("Application submitted successfully!");
         }else{
          setError( json?.message ||"Failed to submit application");
          toast.error("Failed to submit application");
         }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit application";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setJobDescription("");
    setSourceUrl("");
    setResponse(null);
    setError("");
    toast.info("Form cleared");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && isValid && !isLoading) {
      handleApply();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="absolute right-0 top-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 animate-pulse-glow">
            <Briefcase className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            ApplyHub
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit your application with ease
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-card border-border/50 backdrop-blur-sm bg-card/95 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl">Application Details</CardTitle>
            <CardDescription>
              Fill in the job description and optional source URL to apply
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="jobDescription" className="text-base font-medium">
                  Job Description *
                </Label>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isOverLimit
                      ? "text-destructive"
                      : remainingChars < 50
                      ? "text-amber-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {remainingChars} / {MAX_CHARS}
                </span>
              </div>
              <Textarea
                id="jobDescription"
                placeholder="Paste or type the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onKeyDown={handleKeyPress}
                className={`min-h-[200px] resize-y transition-all ${
                  isOverLimit ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
                disabled={isLoading}
              />
              {isOverLimit && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Character limit exceeded
                </p>
              )}
            </div>

            {/* Source URL */}
            <div className="space-y-2">
              <Label htmlFor="sourceUrl" className="text-base font-medium">
                Source URL <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="sourceUrl"
                type="url"
                placeholder="https://example.com/job-posting"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleApply}
                disabled={!isValid || isLoading}
                className=" md:flex-1 bg-gradient-primary hover:opacity-90 transition-all shadow-elegant"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Apply Now
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="sm:w-auto transition-all hover:bg-muted"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Clear
              </Button>
            </div>

            <p className="text-xs hidden md:block text-muted-foreground text-center">
              Tip: Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> +{" "}
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to submit
            </p>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mt-6 border-destructive/50 bg-destructive/5 animate-scale-in">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Error</h3>
                  <p className="text-sm text-destructive/90">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Response Display */}
        {response?.success && (
          <Card className="mt-6 border-success/50 bg-success/5 animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <CardTitle className="text-success">Success!</CardTitle>
              </div>
              <CardDescription>Your application was submitted successfully</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-card rounded-lg p-4 border border-border/50">
                <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Response:</h4>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words font-mono bg-muted/50 p-3 rounded">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
