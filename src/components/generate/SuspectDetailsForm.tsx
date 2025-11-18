import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import LocationMapPicker from "@/components/LocationMapPicker";

interface SuspectDetailsFormProps {
  onComplete: (caseId: string) => void;
}

const SuspectDetailsForm = ({ onComplete }: SuspectDetailsFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    incident_timestamp: new Date().toISOString().slice(0, 16),
    incident_location_address: "",
    incident_location_lat: null as number | null,
    incident_location_lng: null as number | null,
    crime_committed: "",
    arms_involved: "",
    vehicles_involved: "",
    suspect_name: "",
    suspect_address: "",
    contact_number: "",
    reported_by: "Law Enforcement",
    surveillance_footage_ref: "",
    custodies: "",
  });

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData({
      ...formData,
      incident_location_address: address,
      incident_location_lat: lat,
      incident_location_lng: lng,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("suspect_case_records")
        .insert({
          user_id: user.id,
          ...formData,
        })
        .select()
        .single();

      if (error) throw error;
      
      onComplete(data.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to save suspect details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl">Time & Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="timestamp">Incident Timestamp</Label>
            <Input
              id="timestamp"
              type="datetime-local"
              value={formData.incident_timestamp || new Date().toISOString().slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, incident_timestamp: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl">Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Select Incident Location</Label>
            <LocationMapPicker
              onLocationSelect={handleLocationSelect}
              initialLat={formData.incident_location_lat || 20.5937}
              initialLng={formData.incident_location_lng || 78.9629}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl">Crime Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crime">Crime Committed</Label>
            <Textarea
              id="crime"
              placeholder="Describe the crime"
              value={formData.crime_committed}
              onChange={(e) => setFormData({ ...formData, crime_committed: e.target.value })}
              className="bg-secondary/50"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="arms">Arms Involved</Label>
            <Input
              id="arms"
              placeholder="Any weapons or arms used"
              value={formData.arms_involved}
              onChange={(e) => setFormData({ ...formData, arms_involved: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vehicles">Vehicles Involved</Label>
            <Input
              id="vehicles"
              placeholder="Vehicle descriptions"
              value={formData.vehicles_involved}
              onChange={(e) => setFormData({ ...formData, vehicles_involved: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl">Identifier Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="suspect_name">Name</Label>
            <Input
              id="suspect_name"
              placeholder="Enter suspect name"
              value={formData.suspect_name}
              onChange={(e) => setFormData({ ...formData, suspect_name: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suspect_address">Address</Label>
            <Input
              id="suspect_address"
              placeholder="Suspect's known address"
              value={formData.suspect_address}
              onChange={(e) => setFormData({ ...formData, suspect_address: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              placeholder="Contact information"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reported_by">Reported By</Label>
            <Select
              value={formData.reported_by}
              onValueChange={(value) => setFormData({ ...formData, reported_by: value })}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Law Enforcement">Law Enforcement</SelectItem>
                <SelectItem value="Civilians">Civilians</SelectItem>
                <SelectItem value="Other suspect">Other suspect</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl">Surveillance Footage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="footage">Footage Reference ID</Label>
            <Input
              id="footage"
              placeholder="Enter footage ID or reference"
              value={formData.surveillance_footage_ref}
              onChange={(e) => setFormData({ ...formData, surveillance_footage_ref: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="neon-border">
        <CardHeader>
          <CardTitle className="text-2xl">Custodies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="custodies">Custody Information</Label>
            <Textarea
              id="custodies"
              placeholder="Enter custody details"
              value={formData.custodies}
              onChange={(e) => setFormData({ ...formData, custodies: e.target.value })}
              className="bg-secondary/50"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow"
        >
          {loading ? "Saving..." : "Next"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SuspectDetailsForm;