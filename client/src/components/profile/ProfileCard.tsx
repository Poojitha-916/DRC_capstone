import { User, Mail, Phone, MapPin, Calendar, Globe, Book, Hash } from "lucide-react";
import type { User as UserType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  user: UserType;
  scholar?: any; // Scholar data would come from separate table
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column: Avatar & Basic Info */}
      <Card className="md:col-span-1 border-t-4 border-t-primary shadow-lg">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden mb-4 relative">
             {/* Fallback avatar if no URL */}
            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-display font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold font-display text-slate-900">{user.name}</h2>
          <Badge variant="secondary" className="mt-2 text-secondary-foreground bg-secondary/20 hover:bg-secondary/30">
            {user.role.toUpperCase()}
          </Badge>
          
          <div className="w-full mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <Mail className="w-4 h-4 text-primary" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <Phone className="w-4 h-4 text-primary" />
              <span>{user.phone || "Not provided"}</span>
            </div>
            {/* Scholar data moved to separate table in normalized schema */}
                  {user.role === 'scholar' && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Location info from scholar profile</span>
                    </div>
                  )}
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Detailed Info */}
      <Card className="md:col-span-2 shadow-md border-border/60">
        <CardHeader>
          <CardTitle className="text-xl font-display text-primary flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {user.role === 'scholar' ? (
              <>
                <InfoItem label="Registration No." value="—" icon={Hash} />
                <InfoItem label="Batch" value="—" icon={Calendar} />
                <InfoItem label="Status" value="—" icon={Globe} badge />
                <InfoItem label="Father's Name" value="—" icon={User} />
                <InfoItem label="Parent Mobile" value="—" icon={Phone} />
                <InfoItem label="Nationality" value="—" icon={Globe} />
                <InfoItem label="Address" value="Scholar data from separate table" icon={MapPin} fullWidth />
              </>
            ) : (
              <div className="col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
                Non-scholar users display basic profile information above.
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-dashed">
            <h3 className="text-lg font-semibold font-display text-slate-800 mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-secondary" />
              Educational Background
            </h3>
            <div className="space-y-4">
              {user.role === 'scholar' ? (
                <>
                  <div className="bg-slate-50 p-4 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-700">Class X (Secondary)</span>
                      <Badge variant="outline" className="text-slate-500">—%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Educational data from scholar table</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-border/50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-700">Class XII (Inter/Plus 2)</span>
                      <Badge variant="outline" className="text-slate-500">—%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Educational data from scholar table</p>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
                  Educational background available for scholars only.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ 
  label, 
  value, 
  icon: Icon, 
  fullWidth = false,
  badge = false
}: { 
  label: string, 
  value?: string | null, 
  icon: any, 
  fullWidth?: boolean,
  badge?: boolean 
}) {
  return (
    <div className={`${fullWidth ? "col-span-1 sm:col-span-2" : ""}`}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </p>
      {badge ? (
        <Badge className={value === "Active" ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200" : ""}>
          {value || "N/A"}
        </Badge>
      ) : (
        <p className="text-sm font-medium text-slate-900">{value || "N/A"}</p>
      )}
    </div>
  );
}
