import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import SuspectDetailsForm from "@/components/generate/SuspectDetailsForm";
import PhysicalAttributesForm from "@/components/generate/PhysicalAttributesForm";
import { toast } from "sonner";

const Generate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please login to access this page");
        navigate("/auth");
      } else {
        setIsAuthenticated(true);
      }
    });
  }, [navigate]);

  const handleSuspectDetailsComplete = (id: string) => {
    setCaseId(id);
    setStep(2);
    toast.success("Suspect details saved successfully");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${step === 1 ? 'border-primary bg-primary/20' : 'border-muted-foreground'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Suspect Details</span>
              </div>
              
              <div className="w-16 h-0.5 bg-border" />
              
              <div className={`flex items-center ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${step === 2 ? 'border-primary bg-primary/20' : 'border-muted-foreground'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Physical Attributes & Generate</span>
              </div>
            </div>
          </div>

          {/* Form content */}
          {step === 1 && (
            <SuspectDetailsForm onComplete={handleSuspectDetailsComplete} />
          )}
          
          {step === 2 && caseId && (
            <PhysicalAttributesForm caseId={caseId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;