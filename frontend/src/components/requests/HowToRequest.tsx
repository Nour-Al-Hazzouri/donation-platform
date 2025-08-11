'use client';

import { ClipboardCheck, UserCheck, Clock, Users } from 'lucide-react';

export function HowToRequest() {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-5 md:p-6 overflow-hidden relative">
      {/* Background pattern for visual interest */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl" />
      
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 relative z-10">
        How to request this donation
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {/* Step 1 */}
        <div className="bg-background/50 dark:bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all hover:border-primary/30 hover:shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 dark:bg-purple-950/50 p-2.5 rounded-full text-purple-600 dark:text-purple-400 flex-shrink-0">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-medium text-foreground mb-1">Create a Request</h4>
              <p className="text-sm text-muted-foreground">
                Fill out a simple form describing your needs and situation.
              </p>
            </div>
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="bg-background/50 dark:bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all hover:border-primary/30 hover:shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-950/50 p-2.5 rounded-full text-blue-600 dark:text-blue-400 flex-shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-medium text-foreground mb-1">Verification</h4>
              <p className="text-sm text-muted-foreground">
                Our team verifies your request to ensure authenticity.
              </p>
            </div>
          </div>
        </div>
        
        {/* Step 3 */}
        <div className="bg-background/50 dark:bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all hover:border-primary/30 hover:shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 dark:bg-amber-950/50 p-2.5 rounded-full text-amber-600 dark:text-amber-400 flex-shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-medium text-foreground mb-1">Wait for Matches</h4>
              <p className="text-sm text-muted-foreground">
                Your request is matched with potential donors in your area.
              </p>
            </div>
          </div>
        </div>
        
        {/* Step 4 */}
        <div className="bg-background/50 dark:bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all hover:border-primary/30 hover:shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-950/50 p-2.5 rounded-full text-green-600 dark:text-green-400 flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-medium text-foreground mb-1">Connect</h4>
              <p className="text-sm text-muted-foreground">
                Get connected with donors and receive the help you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}